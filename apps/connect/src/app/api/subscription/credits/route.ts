import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { getServerDB } from '@/database/core/db-adaptor';
import { getCreditSummary } from '@/libs/subscription/credits';

/**
 * GET /api/subscription/credits — Get current user's credit usage and remaining
 */
export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const serverDB = await getServerDB();
    const summary = await getCreditSummary(serverDB, session.user.id);

    return NextResponse.json(summary);
  } catch (error: any) {
    console.error('[credits] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des crédits.' },
      { status: 500 },
    );
  }
}
