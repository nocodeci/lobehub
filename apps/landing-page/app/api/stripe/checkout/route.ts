import { NextRequest, NextResponse } from 'next/server';
import { stripe, PLANS, type PlanKey, type BillingCycle } from '@/lib/stripe';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { plan, billingCycle } = body as {
            plan: PlanKey;
            billingCycle: BillingCycle;
        };

        // Validate plan
        if (!plan || !PLANS[plan]) {
            return NextResponse.json(
                { error: 'Plan invalide. Choisissez: base, premium, ou ultimate.' },
                { status: 400 }
            );
        }

        // Validate billing cycle
        if (!billingCycle || !['monthly', 'yearly'].includes(billingCycle)) {
            return NextResponse.json(
                { error: 'Cycle de facturation invalide. Choisissez: monthly ou yearly.' },
                { status: 400 }
            );
        }

        const selectedPlan = PLANS[plan];
        const pricing = selectedPlan[billingCycle];

        // Check if Price ID is configured
        if (!pricing.priceId) {
            return NextResponse.json(
                { error: `Le Price ID Stripe pour le plan "${selectedPlan.name}" (${billingCycle}) n'est pas encore configuré. Veuillez ajouter les Price IDs dans vos variables d'environnement.` },
                { status: 500 }
            );
        }

        // Build success and cancel URLs
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.connect.wozif.com';
        const siteUrl = req.nextUrl.origin;

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: pricing.priceId,
                    quantity: 1,
                },
            ],
            // After successful payment, redirect to the app
            success_url: `${appUrl}?checkout=success&plan=${plan}&session_id={CHECKOUT_SESSION_ID}`,
            // On cancel, go back to pricing page
            cancel_url: `${siteUrl}/pricing?checkout=cancelled`,
            // Allow promo/coupon codes
            allow_promotion_codes: true,
            // Collect billing address
            billing_address_collection: 'required',
            // Metadata for tracking
            metadata: {
                plan,
                billingCycle,
                planName: selectedPlan.name,
            },
            // Subscription data
            subscription_data: {
                metadata: {
                    plan,
                    billingCycle,
                    planName: selectedPlan.name,
                },
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe Checkout error:', error);

        // Handle specific Stripe errors
        if (error?.type === 'StripeInvalidRequestError') {
            return NextResponse.json(
                { error: `Erreur Stripe: ${error.message}` },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Une erreur est survenue lors de la création de la session de paiement.' },
            { status: 500 }
        );
    }
}
