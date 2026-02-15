import { NextRequest, NextResponse } from 'next/server';

import { getStripe, PLANS, type BillingCycle, type PlanKey, type PricingMode } from '@/libs/stripe';

/**
 * GET /api/subscription — Get current user's subscription status
 * Query params: ?customerId=cus_xxx (Stripe customer ID stored in user settings)
 */
export async function GET(req: NextRequest) {
  try {
    const customerId = req.nextUrl.searchParams.get('customerId');

    if (!customerId) {
      return NextResponse.json({
        currentPlan: null,
        status: 'none',
        subscription: null,
      });
    }

    const stripe = getStripe();

    // Fetch active subscriptions for this customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'active',
    });

    if (subscriptions.data.length === 0) {
      // Check for past_due or canceled
      const allSubs = await stripe.subscriptions.list({
        customer: customerId,
        limit: 1,
      });

      if (allSubs.data.length > 0) {
        const sub = allSubs.data[0];
        return NextResponse.json({
          currentPlan: sub.metadata?.plan || null,
          status: sub.status,
          subscription: {
            billingCycle: sub.metadata?.billingCycle || 'monthly',
            cancelAtPeriodEnd: sub.cancel_at_period_end,
            currentPeriodEnd: sub.current_period_end,
            currentPeriodStart: sub.current_period_start,
            id: sub.id,
          },
        });
      }

      return NextResponse.json({
        currentPlan: null,
        status: 'none',
        subscription: null,
      });
    }

    const sub = subscriptions.data[0];

    return NextResponse.json({
      currentPlan: sub.metadata?.plan || null,
      status: sub.status,
      subscription: {
        billingCycle: sub.metadata?.billingCycle || 'monthly',
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        currentPeriodEnd: sub.current_period_end,
        currentPeriodStart: sub.current_period_start,
        id: sub.id,
      },
    });
  } catch (error: any) {
    console.error('Subscription status error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du statut d\'abonnement.' },
      { status: 500 },
    );
  }
}

/**
 * POST /api/subscription — Create a Stripe Checkout session
 * Body: { plan: 'base'|'premium'|'ultimate', billingCycle: 'monthly'|'yearly', customerId?: string }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { billingCycle, customerId, plan, mode = 'standard' } = body as {
      billingCycle: BillingCycle;
      customerId?: string;
      plan: PlanKey;
      mode?: PricingMode;
    };

    if (!plan || !PLANS[plan]) {
      return NextResponse.json(
        { error: 'Plan invalide. Choisissez: free, starter, pro, business, ou enterprise.' },
        { status: 400 },
      );
    }

    // Free plan doesn't require checkout
    if (plan === 'free') {
      return NextResponse.json(
        { error: 'Le plan gratuit ne nécessite pas de paiement.' },
        { status: 400 },
      );
    }

    // Enterprise requires contact sales
    if (plan === 'enterprise') {
      return NextResponse.json(
        { error: 'Veuillez contacter notre équipe commerciale pour le plan Enterprise.' },
        { status: 400 },
      );
    }

    if (!billingCycle || !['monthly', 'yearly'].includes(billingCycle)) {
      return NextResponse.json(
        { error: 'Cycle de facturation invalide.' },
        { status: 400 },
      );
    }

    if (!['standard', 'byok'].includes(mode)) {
      return NextResponse.json(
        { error: 'Invalid pricing mode' },
        { status: 400 },
      );
    }

    // BYOK is only available for Pro, Business, and Enterprise plans
    if (mode === 'byok' && !['pro', 'business', 'enterprise'].includes(plan)) {
      return NextResponse.json({ error: 'BYOK mode is only available for Pro, Business, and Enterprise plans' }, { status: 400 });
    }

    const selectedPlan = PLANS[plan];
    
    // Determine pricing based on mode (standard or BYOK)
    let pricing;
    if (mode === 'byok' && selectedPlan.byok) {
      pricing = selectedPlan.byok[billingCycle];
    } else {
      pricing = selectedPlan[billingCycle];
    }

    if (!pricing.priceId) {
      return NextResponse.json(
        {
          error: `Le Price ID Stripe pour "${selectedPlan.name}" (${billingCycle}, mode: ${mode}) n'est pas configuré.`,
        },
        { status: 500 },
      );
    }

    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://app.connect.wozif.com';

    const sessionParams: any = {
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      line_items: [{ price: pricing.priceId, quantity: 1 }],
      metadata: { billingCycle, plan, planName: selectedPlan.name, pricingMode: mode },
      mode: 'subscription',
      payment_method_types: ['card'],
      subscription_data: {
        metadata: { billingCycle, plan, planName: selectedPlan.name, pricingMode: mode },
        ...('trialDays' in selectedPlan && selectedPlan.trialDays ? { trial_period_days: selectedPlan.trialDays } : {}),
      },
      success_url: `${appUrl}/subscription?checkout=success&plan=${plan}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/subscription?checkout=cancelled`,
      custom_text: {
        submit: {
          message: 'Abonnez-vous à Connect',
        },
      },
    };

    if (customerId) {
      sessionParams.customer = customerId;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout error:', error);

    if (error?.type === 'StripeInvalidRequestError') {
      return NextResponse.json({ error: `Erreur Stripe: ${error.message}` }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création de la session de paiement.' },
      { status: 500 },
    );
  }
}
