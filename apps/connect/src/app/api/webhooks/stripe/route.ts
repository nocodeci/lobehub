import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { userSettings } from '@/database/schemas/user';
import { serverDB } from '@/database/server';
import { getStripe } from '@/libs/stripe';

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
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const customerId = subscription.customer;
        console.log('[Stripe Webhook] Subscription cancelled:', {
          customerId,
          subscriptionId: subscription.id,
        });
        if (customerId) {
          await updateUserPlan(customerId, 'free', subscription.id, 'canceled');
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        console.log('[Stripe Webhook] Payment failed:', {
          customerId: invoice.customer,
          invoiceId: invoice.id,
        });
        // On payment failure, we don't immediately downgrade.
        // Stripe will retry and eventually cancel if payment keeps failing.
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
