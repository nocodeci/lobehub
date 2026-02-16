import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { getServerDB } from '@/database/core/db-adaptor';
import { getCreditSummary } from '@/libs/subscription/credits';
import { getStripe } from '@/libs/stripe';

/**
 * POST /api/subscription/credits/topup — Create a Stripe checkout session for credit top-up.
 * Body: { amount: number } — amount in dollars (e.g. 5, 10, 25, 50)
 *
 * Not available for free plan users.
 */
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const amountDollars = Number(body.amount);

    if (!amountDollars || amountDollars < 1 || amountDollars > 1000) {
      return NextResponse.json(
        { error: 'Le montant doit être entre $1 et $1000.' },
        { status: 400 },
      );
    }

    // Check plan — free plan cannot top up
    const serverDB = await getServerDB();
    const summary = await getCreditSummary(serverDB, session.user.id);

    if (summary.plan === 'Gratuit') {
      return NextResponse.json(
        { error: 'La recharge de crédits n\'est pas disponible pour le plan Gratuit. Passez au plan Starter ou supérieur.' },
        { status: 403 },
      );
    }

    // Create Stripe checkout session for one-time credit purchase
    const stripe = getStripe();
    const amountCents = Math.round(amountDollars * 100);
    const credits = amountDollars * 100; // 1 credit = $0.01

    const origin = new URL(req.url).origin;

    const checkoutSession = await stripe.checkout.sessions.create({
      client_reference_id: session.user.id,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              description: `${credits} crédits IA Connect ($${amountDollars.toFixed(2)})`,
              name: 'Crédits IA Connect',
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        credits: credits.toString(),
        type: 'credit_topup',
        userId: session.user.id,
      },
      mode: 'payment',
      success_url: `${origin}/credits?topup=success&amount=${amountDollars}`,
      cancel_url: `${origin}/credits?topup=cancelled`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error('[credits/topup] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création du paiement.' },
      { status: 500 },
    );
  }
}
