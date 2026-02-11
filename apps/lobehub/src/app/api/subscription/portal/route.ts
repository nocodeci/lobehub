import { NextRequest, NextResponse } from 'next/server';

import { getStripe } from '@/libs/stripe';

/**
 * POST /api/subscription/portal — Create a Stripe Customer Portal session
 * Body: { customerId: string }
 * Returns the portal URL where the user can manage billing, cancel, upgrade, etc.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerId } = body as { customerId: string };

    if (!customerId) {
      return NextResponse.json(
        { error: 'customerId est requis.' },
        { status: 400 },
      );
    }

    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appUrl}/subscription`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Portal error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du portail de facturation.' },
      { status: 500 },
    );
  }
}
