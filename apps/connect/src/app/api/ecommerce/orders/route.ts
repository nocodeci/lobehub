import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { getServerDB } from '@/database/core/db-adaptor';
import { userSettings } from '@lobechat/database/schemas';
import { eq } from 'drizzle-orm';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  currency: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod?: string;
  paymentLink?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  source: 'whatsapp' | 'manual';
}

async function getEcommerceData(userId: string) {
  const serverDB = await getServerDB();
  const result = await serverDB
    .select({ general: userSettings.general })
    .from(userSettings)
    .where(eq(userSettings.id, userId) as any)
    .limit(1);

  const general = (result?.[0]?.general as Record<string, any>) || {};
  return { general, ecommerce: general?.ecommerce || {} };
}

async function saveEcommerceData(userId: string, general: Record<string, any>, ecommerce: Record<string, any>) {
  const serverDB = await getServerDB();
  await serverDB
    .update(userSettings)
    .set({
      general: { ...general, ecommerce },
    } as any)
    .where(eq(userSettings.id, userId) as any);
}

/**
 * GET /api/ecommerce/orders — List all orders
 */
export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ecommerce } = await getEcommerceData(session.user.id);
    const orders: Order[] = ecommerce?.orders || [];

    // Sort by date descending
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('[ecommerce/orders] GET Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

/**
 * POST /api/ecommerce/orders — Create a new order
 */
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { customerName, customerPhone, items, notes, source, paymentMethod } = body;

    if (!customerName || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Nom du client et articles requis.' }, { status: 400 });
    }

    const { general, ecommerce } = await getEcommerceData(session.user.id);
    const orders: Order[] = ecommerce?.orders || [];

    const totalAmount = items.reduce((sum: number, item: OrderItem) => sum + item.price * item.quantity, 0);
    const currency = items[0]?.currency || 'XOF';

    const newOrder: Order = {
      id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      customerName,
      customerPhone: customerPhone || '',
      items,
      totalAmount,
      currency,
      status: 'pending',
      paymentMethod: paymentMethod || '',
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: source || 'manual',
    };

    orders.push(newOrder);
    await saveEcommerceData(session.user.id, general, { ...ecommerce, orders });

    return NextResponse.json({ order: newOrder });
  } catch (error: any) {
    console.error('[ecommerce/orders] POST Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

/**
 * PUT /api/ecommerce/orders — Update order status
 */
export async function PUT(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID de la commande requis.' }, { status: 400 });
    }

    const { general, ecommerce } = await getEcommerceData(session.user.id);
    const orders: Order[] = ecommerce?.orders || [];

    const idx = orders.findIndex((o) => o.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Commande non trouvée.' }, { status: 404 });
    }

    orders[idx] = {
      ...orders[idx],
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    };

    await saveEcommerceData(session.user.id, general, { ...ecommerce, orders });

    return NextResponse.json({ order: orders[idx] });
  } catch (error: any) {
    console.error('[ecommerce/orders] PUT Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
