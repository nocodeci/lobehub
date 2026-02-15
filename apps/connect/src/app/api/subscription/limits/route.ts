import { NextRequest, NextResponse } from 'next/server';

import { getStripe } from '@/libs/stripe';
import { getPlanLimits, getPlanSummary, canCreateAgent, canUseBYOK } from '@/libs/subscription';

/**
 * GET /api/subscription/limits — Get current user's plan limits and usage
 * Query params: ?customerId=cus_xxx&agentCount=N
 */
export async function GET(req: NextRequest) {
  try {
    const customerId = req.nextUrl.searchParams.get('customerId');
    const agentCount = parseInt(req.nextUrl.searchParams.get('agentCount') || '0', 10);

    let currentPlan: string | null = null;

    if (customerId) {
      const stripe = getStripe();

      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        limit: 1,
        status: 'active',
      });

      if (subscriptions.data.length > 0) {
        currentPlan = subscriptions.data[0].metadata?.plan || null;
      }
    }

    const plan = currentPlan || 'free';
    const limits = getPlanLimits(plan);
    const summary = getPlanSummary(plan);
    const agentCheck = canCreateAgent(plan, agentCount);
    const byokCheck = canUseBYOK(plan);

    return NextResponse.json({
      plan,
      limits,
      summary,
      canCreateAgent: agentCheck,
      canUseBYOK: byokCheck,
      currentUsage: {
        agents: agentCount,
      },
    });
  } catch (error: any) {
    console.error('Subscription limits error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification des limites.' },
      { status: 500 },
    );
  }
}
