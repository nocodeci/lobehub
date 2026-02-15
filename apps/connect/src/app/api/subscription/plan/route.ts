import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { userSettings } from '@/database/schemas/user';
import { getServerDB } from '@/database/server';
import { getSessionUser } from '@/libs/trusted-client/getSessionUser';

/**
 * GET /api/subscription/plan — Get current user's subscription plan from DB.
 * Does NOT depend on Stripe. Reads directly from userSettings.general.subscriptionPlan.
 */
export async function GET() {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.userId) {
      return NextResponse.json({ plan: 'free' });
    }

    const db = await getServerDB();

    const result = await db
      .select({ general: userSettings.general })
      .from(userSettings)
      .where(eq(userSettings.id, sessionUser.userId) as any)
      .limit(1);

    if (result?.[0]?.general) {
      const general = result[0].general as Record<string, any>;
      const plan = general?.subscriptionPlan || 'free';
      return NextResponse.json({ plan });
    }

    return NextResponse.json({ plan: 'free' });
  } catch (error: any) {
    console.error('[/api/subscription/plan] Error:', error?.message);
    return NextResponse.json({ plan: 'free' });
  }
}
