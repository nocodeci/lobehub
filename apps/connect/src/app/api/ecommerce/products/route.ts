import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { getServerDB } from '@/database/core/db-adaptor';
import { userSettings } from '@lobechat/database/schemas';
import { eq } from 'drizzle-orm';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  imageUrl?: string;
  inStock: boolean;
  stockQuantity?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * GET /api/ecommerce/products — List all products for the current user
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
    const products: Product[] = general?.ecommerce?.products || [];

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('[ecommerce/products] GET Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

/**
 * POST /api/ecommerce/products — Add a new product
 * Body: { name, description, price, currency, category, imageUrl, stockQuantity }
 */
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, price, currency, category, imageUrl, stockQuantity } = body;

    if (!name || !price) {
      return NextResponse.json({ error: 'Nom et prix sont requis.' }, { status: 400 });
    }

    const serverDB = await getServerDB();
    const result = await serverDB
      .select({ general: userSettings.general })
      .from(userSettings)
      .where(eq(userSettings.id, session.user.id) as any)
      .limit(1);

    const general = (result?.[0]?.general as Record<string, any>) || {};
    const ecommerce = general?.ecommerce || {};
    const products: Product[] = ecommerce?.products || [];

    const newProduct: Product = {
      id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      name,
      description: description || '',
      price: Number(price),
      currency: currency || 'XOF',
      category: category || 'Général',
      imageUrl: imageUrl || '',
      inStock: true,
      stockQuantity: stockQuantity != null ? Number(stockQuantity) : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    products.push(newProduct);

    await serverDB
      .update(userSettings)
      .set({
        general: {
          ...general,
          ecommerce: { ...ecommerce, products },
        },
      } as any)
      .where(eq(userSettings.id, session.user.id) as any);

    return NextResponse.json({ product: newProduct });
  } catch (error: any) {
    console.error('[ecommerce/products] POST Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

/**
 * PUT /api/ecommerce/products — Update an existing product
 * Body: { id, ...fields }
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
      return NextResponse.json({ error: 'ID du produit requis.' }, { status: 400 });
    }

    const serverDB = await getServerDB();
    const result = await serverDB
      .select({ general: userSettings.general })
      .from(userSettings)
      .where(eq(userSettings.id, session.user.id) as any)
      .limit(1);

    const general = (result?.[0]?.general as Record<string, any>) || {};
    const ecommerce = general?.ecommerce || {};
    const products: Product[] = ecommerce?.products || [];

    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Produit non trouvé.' }, { status: 404 });
    }

    products[idx] = {
      ...products[idx],
      ...updates,
      id, // keep original ID
      updatedAt: new Date().toISOString(),
    };

    await serverDB
      .update(userSettings)
      .set({
        general: {
          ...general,
          ecommerce: { ...ecommerce, products },
        },
      } as any)
      .where(eq(userSettings.id, session.user.id) as any);

    return NextResponse.json({ product: products[idx] });
  } catch (error: any) {
    console.error('[ecommerce/products] PUT Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

/**
 * DELETE /api/ecommerce/products — Delete a product
 * Body: { id }
 */
export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID du produit requis.' }, { status: 400 });
    }

    const serverDB = await getServerDB();
    const result = await serverDB
      .select({ general: userSettings.general })
      .from(userSettings)
      .where(eq(userSettings.id, session.user.id) as any)
      .limit(1);

    const general = (result?.[0]?.general as Record<string, any>) || {};
    const ecommerce = general?.ecommerce || {};
    const products: Product[] = ecommerce?.products || [];

    const filtered = products.filter((p) => p.id !== id);

    if (filtered.length === products.length) {
      return NextResponse.json({ error: 'Produit non trouvé.' }, { status: 404 });
    }

    await serverDB
      .update(userSettings)
      .set({
        general: {
          ...general,
          ecommerce: { ...ecommerce, products: filtered },
        },
      } as any)
      .where(eq(userSettings.id, session.user.id) as any);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[ecommerce/products] DELETE Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
