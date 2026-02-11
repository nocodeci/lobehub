import { NextRequest, NextResponse } from 'next/server';

import { getStripe } from '@/libs/stripe';

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
        console.log('[Stripe Webhook] Checkout completed:', {
          customerId: session.customer,
          plan: session.metadata?.plan,
          subscriptionId: session.subscription,
        });
        // TODO: Save customerId + plan to user record in database
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        console.log('[Stripe Webhook] Subscription updated:', {
          customerId: subscription.customer,
          plan: subscription.metadata?.plan,
          status: subscription.status,
        });
        // TODO: Update user subscription status in database
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        console.log('[Stripe Webhook] Subscription cancelled:', {
          customerId: subscription.customer,
          subscriptionId: subscription.id,
        });
        // TODO: Downgrade user to free plan in database
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        console.log('[Stripe Webhook] Payment failed:', {
          customerId: invoice.customer,
          invoiceId: invoice.id,
        });
        // TODO: Notify user of payment failure
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
