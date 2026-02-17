import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { getServerDB } from '@/database/core/db-adaptor';
import { getPlanLimits } from '@/libs/subscription/index';
import { EmailService } from '@/server/services/email';
import { agents, userSettings } from '@lobechat/database/schemas';
import { eq } from 'drizzle-orm';

interface TeamMember {
  assignedAgentIds?: string[];
  email: string;
  id: string;
  invitedAt: string;
  joinedAt?: string;
  name?: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  status: 'pending' | 'active' | 'inactive';
}

/**
 * GET /api/team — List all team members for the current user
 */
export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const serverDB = await getServerDB();
    const result = await serverDB
      .select({ general: userSettings.general })
      .from(userSettings)
      .where(eq(userSettings.id, session.user.id) as any)
      .limit(1);

    const general = (result?.[0]?.general as Record<string, any>) || {};
    const teamData = general?.team || {};
    const members: TeamMember[] = teamData?.members || [];
    const plan = general?.subscription?.plan || 'free';
    const limits = getPlanLimits(plan);

    // Count non-owner members
    const currentCount = members.filter((m: TeamMember) => m.role !== 'owner').length;

    // Fetch user's agents for assignment UI
    let agentList: { id: string; title: string; avatar?: string }[] = [];
    try {
      const agentResults = await serverDB
        .select({
          avatar: agents.avatar,
          id: agents.id,
          title: agents.title,
        })
        .from(agents)
        .where(eq(agents.userId, session.user.id) as any);
      agentList = agentResults.map((a: any) => ({
        avatar: a.avatar || undefined,
        id: a.id,
        title: a.title || 'Agent sans nom',
      }));
    } catch (e) {
      console.error('[team] Error fetching agents:', e);
    }

    return NextResponse.json({
      agents: agentList,
      limits: {
        current: currentCount,
        limit: limits.teamMembers,
        plan: limits.name,
      },
      members,
    });
  } catch (error: any) {
    console.error('[team] GET Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

/**
 * POST /api/team — Team member actions (invite, remove, updateRole, resend)
 */
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body;

    const serverDB = await getServerDB();
    const result = await serverDB
      .select({ general: userSettings.general })
      .from(userSettings)
      .where(eq(userSettings.id, session.user.id) as any)
      .limit(1);

    const general = (result?.[0]?.general as Record<string, any>) || {};
    const teamData = general?.team || {};
    let members: TeamMember[] = teamData?.members || [];
    const plan = general?.subscription?.plan || 'free';
    const limits = getPlanLimits(plan);

    switch (action) {
      case 'invite': {
        const { email, name, role, assignedAgentIds } = body;

        if (!email) {
          return NextResponse.json({ error: 'Email requis' }, { status: 400 });
        }

        if (!['admin', 'editor', 'viewer'].includes(role)) {
          return NextResponse.json({ error: 'Rôle invalide' }, { status: 400 });
        }

        // Check limit
        const currentCount = members.filter((m) => m.role !== 'owner').length;
        if (limits.teamMembers !== -1 && currentCount >= limits.teamMembers) {
          return NextResponse.json({
            error: `Limite de ${limits.teamMembers} membre${limits.teamMembers > 1 ? 's' : ''} atteinte pour le plan ${limits.name}. Passez à un plan supérieur.`,
          }, { status: 403 });
        }

        // Check duplicate
        if (members.some((m) => m.email.toLowerCase() === email.toLowerCase())) {
          return NextResponse.json({ error: 'Ce membre existe déjà dans votre équipe' }, { status: 400 });
        }

        const newMember: TeamMember = {
          assignedAgentIds: assignedAgentIds || [],
          email: email.toLowerCase(),
          id: `member_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
          invitedAt: new Date().toISOString(),
          name: name || undefined,
          role,
          status: 'pending',
        };

        members.push(newMember);

        // Save to DB
        await serverDB
          .update(userSettings)
          .set({
            general: {
              ...general,
              team: { ...teamData, members },
            },
          } as any)
          .where(eq(userSettings.id, session.user.id) as any);

        // Send invitation email
        try {
          const emailService = new EmailService();
          const ownerName = session.user.name || session.user.email || 'Un utilisateur';
          const roleMap: Record<string, string> = { admin: 'Administrateur', editor: 'Éditeur', owner: 'Propriétaire', viewer: 'Lecteur' };
          const roleFr = roleMap[role] || role;

          await emailService.sendMail({
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
                  <h1 style="color: #fff; margin: 0; font-size: 24px;">Connect</h1>
                  <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Invitation à rejoindre une équipe</p>
                </div>
                <div style="background: #fff; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
                  <p style="font-size: 16px; color: #111;">Bonjour${name ? ` ${name}` : ''} !</p>
                  <p style="color: #4b5563;"><strong>${ownerName}</strong> vous invite à rejoindre son espace de travail sur <strong>Connect</strong> en tant que <strong>${roleFr}</strong>.</p>
                  <div style="text-align: center; margin: 32px 0;">
                    <a href="${process.env.APP_URL || 'https://app.connect.wozif.com'}" style="display: inline-block; background: #6366f1; color: #fff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">Rejoindre l'équipe</a>
                  </div>
                  <p style="color: #9ca3af; font-size: 13px;">Si vous n'avez pas de compte, créez-en un avec l'adresse <strong>${email}</strong> pour accéder à l'espace de travail.</p>
                </div>
                <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">© Connect — Plateforme d'agents IA</p>
              </div>
            `,
            subject: `${ownerName} vous invite à rejoindre son équipe sur Connect`,
            to: email,
          });
          console.log(`[team] Invitation email sent to ${email}`);
        } catch (emailError) {
          console.error('[team] Failed to send invitation email:', emailError);
          // Don't fail the whole operation if email fails
        }

        return NextResponse.json({ member: newMember, success: true });
      }

      case 'remove': {
        const { memberId } = body;
        if (!memberId) {
          return NextResponse.json({ error: 'ID du membre requis' }, { status: 400 });
        }

        const memberToRemove = members.find((m) => m.id === memberId);
        if (!memberToRemove) {
          return NextResponse.json({ error: 'Membre non trouvé' }, { status: 404 });
        }
        if (memberToRemove.role === 'owner') {
          return NextResponse.json({ error: 'Impossible de retirer le propriétaire' }, { status: 403 });
        }

        members = members.filter((m) => m.id !== memberId);

        await serverDB
          .update(userSettings)
          .set({
            general: {
              ...general,
              team: { ...teamData, members },
            },
          } as any)
          .where(eq(userSettings.id, session.user.id) as any);

        return NextResponse.json({ success: true });
      }

      case 'updateRole': {
        const { memberId, role } = body;
        if (!memberId || !role) {
          return NextResponse.json({ error: 'ID et rôle requis' }, { status: 400 });
        }
        if (!['admin', 'editor', 'viewer'].includes(role)) {
          return NextResponse.json({ error: 'Rôle invalide' }, { status: 400 });
        }

        const memberIdx = members.findIndex((m) => m.id === memberId);
        if (memberIdx === -1) {
          return NextResponse.json({ error: 'Membre non trouvé' }, { status: 404 });
        }
        if (members[memberIdx].role === 'owner') {
          return NextResponse.json({ error: 'Impossible de changer le rôle du propriétaire' }, { status: 403 });
        }

        members[memberIdx] = { ...members[memberIdx], role };

        await serverDB
          .update(userSettings)
          .set({
            general: {
              ...general,
              team: { ...teamData, members },
            },
          } as any)
          .where(eq(userSettings.id, session.user.id) as any);

        return NextResponse.json({ success: true });
      }

      case 'resend': {
        const { memberId } = body;
        const member = members.find((m) => m.id === memberId);
        if (!member) {
          return NextResponse.json({ error: 'Membre non trouvé' }, { status: 404 });
        }

        try {
          const emailService = new EmailService();
          const ownerName = session.user.name || session.user.email || 'Un utilisateur';
          const resendRoleMap: Record<string, string> = { admin: 'Administrateur', editor: 'Éditeur', owner: 'Propriétaire', viewer: 'Lecteur' };
          const roleFr = resendRoleMap[member.role] || member.role;

          await emailService.sendMail({
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
                  <h1 style="color: #fff; margin: 0; font-size: 24px;">Connect</h1>
                  <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Rappel d'invitation</p>
                </div>
                <div style="background: #fff; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
                  <p style="font-size: 16px; color: #111;">Bonjour${member.name ? ` ${member.name}` : ''} !</p>
                  <p style="color: #4b5563;">Rappel : <strong>${ownerName}</strong> vous a invité à rejoindre son espace de travail sur <strong>Connect</strong> en tant que <strong>${roleFr}</strong>.</p>
                  <div style="text-align: center; margin: 32px 0;">
                    <a href="${process.env.APP_URL || 'https://app.connect.wozif.com'}" style="display: inline-block; background: #6366f1; color: #fff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">Rejoindre l'équipe</a>
                  </div>
                </div>
              </div>
            `,
            subject: `Rappel : ${ownerName} vous attend sur Connect`,
            to: member.email,
          });
          console.log(`[team] Resend invitation email to ${member.email}`);
        } catch (emailError) {
          console.error('[team] Failed to resend invitation email:', emailError);
          return NextResponse.json({ error: 'Erreur lors de l\'envoi de l\'email' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
      }

      case 'updateAgents': {
        const { memberId, assignedAgentIds } = body;
        if (!memberId) {
          return NextResponse.json({ error: 'ID du membre requis' }, { status: 400 });
        }

        const agentMemberIdx = members.findIndex((m) => m.id === memberId);
        if (agentMemberIdx === -1) {
          return NextResponse.json({ error: 'Membre non trouvé' }, { status: 404 });
        }

        members[agentMemberIdx] = {
          ...members[agentMemberIdx],
          assignedAgentIds: assignedAgentIds || [],
        };

        await serverDB
          .update(userSettings)
          .set({
            general: {
              ...general,
              team: { ...teamData, members },
            },
          } as any)
          .where(eq(userSettings.id, session.user.id) as any);

        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: 'Action invalide' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('[team] POST Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
