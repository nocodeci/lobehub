import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { getServerDB } from '@/database/core/db-adaptor';
import { userSettings } from '@lobechat/database/schemas';
import { eq } from 'drizzle-orm';

/**
 * GET /api/ecommerce/payment — Get payment config
 */
export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const serverDB = await getServerDB();
    const result = await serverDB
      .select({ general: userSettings.general })
      .from(userSettings)
      .where(eq(userSettings.id, session.user.id) as any)
      .limit(1);

    const general = (result?.[0]?.general as Record<string, any>) || {};
    const paymentConfig = general?.ecommerce?.paymentConfig || {};

    return NextResponse.json({ paymentConfig });
  } catch (error: any) {
    console.error('[ecommerce/payment] GET Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

/**
 * POST /api/ecommerce/payment — Save payment config
 * Body: { waveMerchantCode, orangeMoneyCode }
 */
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { waveMerchantCode, orangeMoneyCode } = body;

    const serverDB = await getServerDB();
    const result = await serverDB
      .select({ general: userSettings.general })
      .from(userSettings)
      .where(eq(userSettings.id, session.user.id) as any)
      .limit(1);

    const general = (result?.[0]?.general as Record<string, any>) || {};
    const ecommerce = general?.ecommerce || {};

    const paymentConfig = {
      waveMerchantCode: waveMerchantCode || '',
      orangeMoneyCode: orangeMoneyCode || '',
    };

    await serverDB
      .update(userSettings)
      .set({
        general: {
          ...general,
          ecommerce: { ...ecommerce, paymentConfig },
        },
      } as any)
      .where(eq(userSettings.id, session.user.id) as any);

    return NextResponse.json({ paymentConfig });
  } catch (error: any) {
    console.error('[ecommerce/payment] POST Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
