import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { userSettings } from '@/database/schemas/user';
import { users } from '@/database/schemas/user';
import { serverDB } from '@/database/server';
import { getStripe } from '@/libs/stripe';

// ═══════════════════════════════════════════════
// MAILTRAP EMAIL NOTIFICATIONS
// ═══════════════════════════════════════════════
const MAILTRAP_API_URL = 'https://send.api.mailtrap.io/api/send';
const MAILTRAP_TOKEN = process.env.MAILTRAP_API_TOKEN || '';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const FROM_EMAIL = 'hello@wozif.com';
const CONNECT_APP_URL = 'https://app.connect.wozif.com';
const PLAN_NAMES: Record<string, string> = { free: 'Gratuit', starter: 'Starter', pro: 'Pro', business: 'Business', enterprise: 'Enterprise' };
const PLAN_PRICES: Record<string, number> = { free: 0, starter: 29, pro: 79, business: 199, enterprise: 499 };

async function sendMailtrap(to: string, subject: string, html: string, fromName: string) {
  if (!MAILTRAP_TOKEN) return;
  try {
    await fetch(MAILTRAP_API_URL, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${MAILTRAP_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: { email: FROM_EMAIL, name: fromName },
        to: [{ email: to }],
        subject,
        html,
        category: 'Subscription',
      }),
    });
    console.log(`[Stripe Webhook] ✉️ Email → ${to}: ${subject}`);
  } catch (e: any) {
    console.error(`[Stripe Webhook] Email failed:`, e.message);
  }
}

function adminTemplate(title: string, content: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,sans-serif;"><div style="max-width:600px;margin:0 auto;padding:24px;"><div style="background:linear-gradient(135deg,#f97316,#ea580c);border-radius:16px 16px 0 0;padding:24px;text-align:center;"><h1 style="margin:0;color:#fff;font-size:20px;font-weight:800;">Connect Admin</h1><p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:12px;">${title}</p></div><div style="background:#111;border:1px solid #222;border-top:none;border-radius:0 0 16px 16px;padding:24px;color:#e4e4e7;">${content}</div></div></body></html>`;
}

function userTemplate(title: string, content: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#f8f9fa;font-family:-apple-system,sans-serif;"><div style="max-width:600px;margin:0 auto;padding:24px;"><div style="background:linear-gradient(135deg,#f97316,#ea580c);border-radius:16px 16px 0 0;padding:28px 24px;text-align:center;"><h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;">Connect</h1><p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">${title}</p></div><div style="background:#fff;border:1px solid #e5e7eb;border-top:none;padding:28px 24px;color:#1f2937;">${content}</div><div style="background:#f3f4f6;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 16px 16px;padding:16px 24px;text-align:center;"><a href="${CONNECT_APP_URL}" style="display:inline-block;background:#f97316;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;">Ouvrir Connect</a></div></div></body></html>`;
}

async function notifyNewSubscription(userEmail: string, userName: string, plan: string) {
  const pn = PLAN_NAMES[plan] || plan;
  const pp = PLAN_PRICES[plan] || 0;
  await sendMailtrap(ADMIN_EMAIL, `[Connect] 💳 Nouvel abonnement: ${userName || userEmail} → ${pn}`, adminTemplate('Nouvel abonnement', `<h2 style="color:#10b981;margin:0 0 16px;">Nouvel abonnement souscrit</h2><table style="width:100%;"><tr><td style="padding:8px 0;color:#a1a1aa;">Utilisateur</td><td style="padding:8px 0;color:#fff;font-weight:600;">${userName || userEmail}</td></tr><tr><td style="padding:8px 0;color:#a1a1aa;">Plan</td><td style="padding:8px 0;color:#10b981;font-weight:700;">${pn}</td></tr><tr><td style="padding:8px 0;color:#a1a1aa;">Prix</td><td style="padding:8px 0;color:#fff;">${pp}€/mois</td></tr></table>`), 'Connect Admin');
  await sendMailtrap(userEmail, `Bienvenue sur le plan ${pn} ! 🎉`, userTemplate(`Abonnement ${pn} activé`, `<h2 style="color:#059669;margin:0 0 8px;font-size:22px;">Abonnement ${pn} activé !</h2><p style="color:#4b5563;font-size:14px;margin:0 0 20px;">Merci ! Votre plan <strong>${pn}</strong> est actif. Vous avez accès à toutes les fonctionnalités premium.</p><div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:12px;padding:16px;"><table style="width:100%;"><tr><td style="padding:6px 0;color:#047857;font-weight:600;">Plan</td><td style="color:#1f2937;font-weight:700;">${pn}</td></tr><tr><td style="padding:6px 0;color:#047857;font-weight:600;">Prix</td><td style="color:#1f2937;">${pp}€/mois</td></tr><tr><td style="padding:6px 0;color:#047857;font-weight:600;">Statut</td><td style="color:#059669;font-weight:700;">✅ Actif</td></tr></table></div>`), 'Connect by Wozif');
}

async function notifySubscriptionCancelled(userEmail: string, userName: string, plan: string) {
  const pn = PLAN_NAMES[plan] || plan;
  await sendMailtrap(ADMIN_EMAIL, `[Connect] ❌ Abonnement annulé: ${userName || userEmail} — ${pn}`, adminTemplate('Abonnement annulé', `<h2 style="color:#ef4444;margin:0 0 16px;">Abonnement annulé</h2><table style="width:100%;"><tr><td style="padding:8px 0;color:#a1a1aa;">Utilisateur</td><td style="padding:8px 0;color:#fff;">${userName || userEmail}</td></tr><tr><td style="padding:8px 0;color:#a1a1aa;">Plan annulé</td><td style="padding:8px 0;color:#ef4444;font-weight:600;">${pn}</td></tr><tr><td style="padding:8px 0;color:#a1a1aa;">Nouveau plan</td><td style="padding:8px 0;color:#71717a;">Gratuit</td></tr></table>`), 'Connect Admin');
  await sendMailtrap(userEmail, `Votre abonnement ${pn} a été annulé`, userTemplate('Abonnement annulé', `<h2 style="color:#dc2626;margin:0 0 8px;font-size:20px;">Abonnement annulé</h2><p style="color:#4b5563;font-size:14px;margin:0 0 16px;">Votre abonnement <strong>${pn}</strong> a été annulé. Vous êtes sur le plan <strong>Gratuit</strong>.</p><div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:16px;"><p style="color:#991b1b;font-weight:600;margin:0 0 8px;">Ce que vous perdez :</p><ul style="color:#991b1b;font-size:12px;margin:0;padding-left:20px;line-height:1.8;"><li>Limite réduite à 1 agent et 250 crédits/mois</li><li>Pas d'accès BYOK</li><li>Stockage limité à 500 MB</li></ul></div><div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px;margin:16px 0 0;"><p style="color:#166534;font-size:13px;margin:0;">Réactivez à tout moment depuis votre tableau de bord.</p></div>`), 'Connect by Wozif');
}

async function notifyPaymentFailed(userEmail: string, userName: string, plan: string) {
  const pn = PLAN_NAMES[plan] || plan;
  await sendMailtrap(ADMIN_EMAIL, `[Connect] 🚨 Paiement échoué: ${userName || userEmail} — ${pn}`, adminTemplate('Paiement échoué', `<h2 style="color:#ef4444;margin:0 0 16px;">Paiement échoué</h2><p style="color:#d4d4d8;">Le renouvellement a échoué. Rétrogradation auto après 3 jours.</p><table style="width:100%;margin-top:12px;"><tr><td style="padding:8px 0;color:#a1a1aa;">Utilisateur</td><td style="padding:8px 0;color:#fff;">${userName || userEmail}</td></tr><tr><td style="padding:8px 0;color:#a1a1aa;">Plan</td><td style="padding:8px 0;color:#f59e0b;font-weight:600;">${pn}</td></tr></table>`), 'Connect Admin');
  await sendMailtrap(userEmail, `⚠️ Échec de paiement — Action requise`, userTemplate('Échec de paiement', `<h2 style="color:#dc2626;margin:0 0 8px;font-size:20px;">Échec de paiement</h2><p style="color:#4b5563;font-size:14px;margin:0 0 16px;">Le renouvellement de votre abonnement <strong>${pn}</strong> a échoué.</p><div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:16px;margin:0 0 16px;"><p style="color:#991b1b;font-weight:600;margin:0 0 8px;">⏰ Important :</p><p style="color:#991b1b;font-size:13px;margin:0;">Si le paiement n'est pas régularisé dans les <strong>3 jours</strong>, votre compte sera rétrogradé au plan <strong>Gratuit</strong>.</p></div><div style="text-align:center;margin:20px 0;"><a href="${CONNECT_APP_URL}/subscription" style="display:inline-block;background:#dc2626;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;">Mettre à jour le paiement</a></div>`), 'Connect by Wozif');
}

async function notifySubscriptionRenewed(userEmail: string, userName: string, plan: string) {
  const pn = PLAN_NAMES[plan] || plan;
  const pp = PLAN_PRICES[plan] || 0;
  await sendMailtrap(ADMIN_EMAIL, `[Connect] 🔄 Abonnement renouvelé: ${userName || userEmail} — ${pn}`, adminTemplate('Abonnement renouvelé', `<h2 style="color:#3b82f6;margin:0 0 16px;">Abonnement renouvelé</h2><table style="width:100%;"><tr><td style="padding:8px 0;color:#a1a1aa;">Utilisateur</td><td style="padding:8px 0;color:#fff;">${userName || userEmail}</td></tr><tr><td style="padding:8px 0;color:#a1a1aa;">Plan</td><td style="padding:8px 0;color:#3b82f6;font-weight:600;">${pn}</td></tr><tr><td style="padding:8px 0;color:#a1a1aa;">Montant</td><td style="padding:8px 0;color:#fff;">${pp}€</td></tr></table>`), 'Connect Admin');
  await sendMailtrap(userEmail, `Abonnement ${pn} renouvelé ✅`, userTemplate('Abonnement renouvelé', `<h2 style="color:#2563eb;margin:0 0 8px;font-size:20px;">Abonnement renouvelé</h2><p style="color:#4b5563;font-size:14px;margin:0 0 16px;">Votre abonnement <strong>${pn}</strong> a été renouvelé automatiquement.</p><div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:16px;"><table style="width:100%;"><tr><td style="padding:6px 0;color:#1d4ed8;font-weight:600;">Plan</td><td style="color:#1f2937;">${pn}</td></tr><tr><td style="padding:6px 0;color:#1d4ed8;font-weight:600;">Montant</td><td style="color:#1f2937;">${pp}€</td></tr></table></div>`), 'Connect by Wozif');
}

/**
 * Find user email/name from stripeCustomerId
 */
async function findUserByCustomerId(customerId: string): Promise<{ email: string; fullName: string; plan: string } | null> {
  try {
    const allSettings = await serverDB
      .select({ id: userSettings.id, general: userSettings.general })
      .from(userSettings);

    for (const settings of allSettings) {
      const general = (settings.general || {}) as Record<string, any>;
      if (general?.subscription?.stripeCustomerId === customerId) {
        const userRes = await serverDB
          .select({ email: users.email, fullName: users.fullName })
          .from(users)
          .where(eq(users.id, settings.id) as any);
        const u = userRes[0];
        return {
          email: (u as any)?.email || '',
          fullName: (u as any)?.fullName || '',
          plan: general.subscriptionPlan || 'free',
        };
      }
    }
  } catch (e) {
    console.error('[Stripe Webhook] findUserByCustomerId error:', e);
  }
  return null;
}

/**
 * Update the user's subscription plan in the database.
 * Stores plan in userSettings.general.subscriptionPlan and subscription metadata.
 */
async function updateUserPlan(
  customerId: string,
  plan: string,
  subscriptionId?: string,
  status?: string,
) {
  try {
    // Find user by stripeCustomerId stored in general settings
    const allSettings = await serverDB
      .select({ id: userSettings.id, general: userSettings.general })
      .from(userSettings);

    for (const settings of allSettings) {
      const general = (settings.general || {}) as Record<string, any>;
      if (general?.subscription?.stripeCustomerId === customerId) {
        // Update the plan in general settings
        const updatedGeneral = {
          ...general,
          subscriptionPlan: plan,
          subscription: {
            ...general.subscription,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId || general.subscription?.stripeSubscriptionId,
            status: status || general.subscription?.status,
            plan,
          },
        };

        await serverDB
          .update(userSettings)
          .set({ general: updatedGeneral })
          .where(eq(userSettings.id, settings.id) as any);

        console.log(`[Stripe Webhook] Updated plan for user ${settings.id}: ${plan}`);
        return true;
      }
    }

    console.warn(`[Stripe Webhook] No user found with stripeCustomerId: ${customerId}`);
    return false;
  } catch (error) {
    console.error('[Stripe Webhook] Error updating user plan:', error);
    return false;
  }
}

/**
 * POST /api/webhooks/stripe — Stripe webhook endpoint
 * Handles subscription lifecycle events (created, updated, deleted, payment_failed)
 * Configure this URL in Stripe Dashboard > Webhooks
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('Missing STRIPE_WEBHOOK_SECRET environment variable');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    const stripe = getStripe();
    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const plan = session.metadata?.plan;
        const customerId = session.customer;
        console.log('[Stripe Webhook] Checkout completed:', {
          customerId,
          plan,
          subscriptionId: session.subscription,
        });
        if (plan && customerId) {
          await updateUserPlan(customerId, plan, session.subscription, 'active');
          // Send email notifications
          const user = await findUserByCustomerId(customerId);
          if (user) {
            await notifyNewSubscription(user.email, user.fullName, plan);
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const plan = subscription.metadata?.plan;
        const customerId = subscription.customer;
        console.log('[Stripe Webhook] Subscription updated:', {
          customerId,
          plan,
          status: subscription.status,
        });
        if (plan && customerId) {
          await updateUserPlan(customerId, plan, subscription.id, subscription.status);
          // Send renewal notification if status is active (successful payment)
          if (subscription.status === 'active') {
            const user = await findUserByCustomerId(customerId);
            if (user) {
              await notifySubscriptionRenewed(user.email, user.fullName, plan);
            }
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const customerId = subscription.customer;
        const plan = subscription.metadata?.plan;
        console.log('[Stripe Webhook] Subscription cancelled:', {
          customerId,
          subscriptionId: subscription.id,
        });
        if (customerId) {
          // Get user info before downgrading
          const user = await findUserByCustomerId(customerId);
          await updateUserPlan(customerId, 'free', subscription.id, 'canceled');
          if (user) {
            await notifySubscriptionCancelled(user.email, user.fullName, plan || user.plan);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        const customerId = invoice.customer;
        console.log('[Stripe Webhook] Payment failed:', {
          customerId,
          invoiceId: invoice.id,
        });
        // Send payment failed notification
        if (customerId) {
          const user = await findUserByCustomerId(customerId);
          if (user) {
            await notifyPaymentFailed(user.email, user.fullName, user.plan);
          }
        }
        // Don't immediately downgrade — admin cron will auto-downgrade after 3 days
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
