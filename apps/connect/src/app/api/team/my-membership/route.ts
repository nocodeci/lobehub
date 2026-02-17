import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { getServerDB } from '@/database/core/db-adaptor';
import { agents, users, userSettings } from '@lobechat/database/schemas';
import { eq, inArray, sql } from 'drizzle-orm';

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

interface MembershipTeam {
  agents: { avatar?: string; id: string; title: string }[];
  ownerEmail?: string;
  ownerId: string;
  ownerName?: string;
  role: string;
  status: string;
}

/**
 * GET /api/team/my-membership
 * Check if the current user's email is in any team's member list.
 * Returns the list of teams the user belongs to, with their assigned agents.
 * Also auto-activates the membership if it was pending.
 */
export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = session.user.email.toLowerCase();
    const serverDB = await getServerDB();

    // Search all userSettings where general->team->members contains an entry with this email
    // Using PostgreSQL jsonb query
    const allSettings = await serverDB
      .select({
        general: userSettings.general,
        id: userSettings.id,
      })
      .from(userSettings)
      .where(
        sql`${userSettings.general}::jsonb -> 'team' -> 'members' @> ${`[{"email":"${userEmail}"}]`}::jsonb` as any
      );

    if (allSettings.length === 0) {
      return NextResponse.json({ memberships: [] });
    }

    const memberships: MembershipTeam[] = [];
    const allAgentIds = new Set<string>();
    const autoActivateUpdates: { general: any; ownerId: string }[] = [];

    for (const row of allSettings) {
      const general = (row.general as Record<string, any>) || {};
      const teamData = general?.team || {};
      const members: TeamMember[] = teamData?.members || [];

      const myMembership = members.find(
        (m) => m.email.toLowerCase() === userEmail,
      );
      if (!myMembership) continue;

      // Collect assigned agent IDs for fetching
      if (myMembership.assignedAgentIds) {
        myMembership.assignedAgentIds.forEach((id) => allAgentIds.add(id));
      }

      // Auto-activate if pending
      if (myMembership.status === 'pending') {
        myMembership.status = 'active';
        myMembership.joinedAt = new Date().toISOString();
        autoActivateUpdates.push({
          general: {
            ...general,
            team: { ...teamData, members },
          },
          ownerId: row.id,
        });
      }

      memberships.push({
        agents: [], // Will be filled after fetching
        ownerEmail: undefined, // Will be filled after
        ownerId: row.id,
        ownerName: undefined,
        role: myMembership.role,
        status: myMembership.status,
      });
    }

    // Auto-activate pending memberships
    for (const update of autoActivateUpdates) {
      try {
        await serverDB
          .update(userSettings)
          .set({ general: update.general } as any)
          .where(eq(userSettings.id, update.ownerId) as any);
        console.log(`[my-membership] Auto-activated membership for ${userEmail} in team of ${update.ownerId}`);
      } catch (e) {
        console.error('[my-membership] Error auto-activating:', e);
      }
    }

    // Fetch all assigned agents in one batch
    if (allAgentIds.size > 0) {
      try {
        const agentResults = await serverDB
          .select({
            avatar: agents.avatar,
            id: agents.id,
            title: agents.title,
            userId: agents.userId,
          })
          .from(agents)
          .where(inArray(agents.id, [...allAgentIds]) as any);

        // Map agents to their respective memberships
        for (const membership of memberships) {
          const ownerRow = allSettings.find((r) => r.id === membership.ownerId);
          if (!ownerRow) continue;

          const general = (ownerRow.general as Record<string, any>) || {};
          const members: TeamMember[] = general?.team?.members || [];
          const myMembership = members.find(
            (m) => m.email.toLowerCase() === userEmail,
          );

          if (myMembership?.assignedAgentIds) {
            membership.agents = agentResults
              .filter((a: any) => myMembership.assignedAgentIds!.includes(a.id))
              .map((a: any) => ({
                avatar: a.avatar || undefined,
                id: a.id,
                title: a.title || 'Agent sans nom',
              }));
          }
        }
      } catch (e) {
        console.error('[my-membership] Error fetching agents:', e);
      }
    }

    // Fetch owner names from users table
    for (const membership of memberships) {
      try {
        const ownerResult = await serverDB
          .select({ email: users.email, fullName: users.fullName })
          .from(users)
          .where(eq(users.id, membership.ownerId) as any)
          .limit(1);

        if (ownerResult.length > 0) {
          membership.ownerName = (ownerResult[0] as any).fullName || undefined;
          membership.ownerEmail = (ownerResult[0] as any).email || undefined;
        }
      } catch {
        // Owner info not available, skip
      }
    }

    return NextResponse.json({ memberships });
  } catch (error: any) {
    console.error('[my-membership] GET Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
