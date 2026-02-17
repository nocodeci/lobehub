import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { getServerDB } from '@/database/core/db-adaptor';
import { userSettings } from '@lobechat/database/schemas';
import { eq } from 'drizzle-orm';

interface Product {
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
 * POST /api/ecommerce/import — Import products from CSV text
 * Body: { csv: string, replace?: boolean }
 * CSV format: name,description,price,currency,category,imageUrl,stockQuantity
 */
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { csv, replace } = body;

    if (!csv || typeof csv !== 'string') {
      return NextResponse.json({ error: 'Données CSV requises.' }, { status: 400 });
    }

    // Parse CSV
    const lines = csv.split('\n').map((l: string) => l.trim()).filter(Boolean);
    if (lines.length < 2) {
      return NextResponse.json({ error: 'Le CSV doit contenir un en-tête et au moins une ligne de données.' }, { status: 400 });
    }

    // Parse header
    const header = lines[0].toLowerCase().split(/[,;\t]/).map((h: string) => h.trim().replace(/"/g, ''));

    const nameIdx = header.findIndex((h: string) => ['nom', 'name', 'produit', 'product'].includes(h));
    const descIdx = header.findIndex((h: string) => ['description', 'desc'].includes(h));
    const priceIdx = header.findIndex((h: string) => ['prix', 'price', 'montant'].includes(h));
    const currencyIdx = header.findIndex((h: string) => ['devise', 'currency', 'monnaie'].includes(h));
    const categoryIdx = header.findIndex((h: string) => ['catégorie', 'categorie', 'category', 'cat'].includes(h));
    const imageIdx = header.findIndex((h: string) => ['image', 'imageurl', 'image_url', 'photo', 'url_image'].includes(h));
    const stockIdx = header.findIndex((h: string) => ['stock', 'quantité', 'quantite', 'quantity', 'qty'].includes(h));

    if (nameIdx === -1) {
      return NextResponse.json({
        error: 'Colonne "Nom" ou "Name" non trouvée dans l\'en-tête CSV. Colonnes attendues: Nom, Description, Prix, Devise, Catégorie, Image, Stock',
      }, { status: 400 });
    }
    if (priceIdx === -1) {
      return NextResponse.json({
        error: 'Colonne "Prix" ou "Price" non trouvée dans l\'en-tête CSV.',
      }, { status: 400 });
    }

    const now = new Date().toISOString();
    const imported: Product[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      try {
        // Split handling quoted fields
        const fields = lines[i].split(/[,;\t]/).map((f: string) => f.trim().replace(/^"|"$/g, ''));

        const name = fields[nameIdx];
        const priceStr = fields[priceIdx];

        if (!name) {
          errors.push(`Ligne ${i + 1}: nom manquant`);
          continue;
        }

        const price = Number(priceStr?.replace(/[^\d.,]/g, '').replace(',', '.'));
        if (isNaN(price) || price <= 0) {
          errors.push(`Ligne ${i + 1}: prix invalide "${priceStr}"`);
          continue;
        }

        const product: Product = {
          id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
          name,
          description: descIdx >= 0 ? (fields[descIdx] || '') : '',
          price,
          currency: currencyIdx >= 0 ? (fields[currencyIdx] || 'XOF') : 'XOF',
          category: categoryIdx >= 0 ? (fields[categoryIdx] || 'Général') : 'Général',
          imageUrl: imageIdx >= 0 ? (fields[imageIdx] || '') : '',
          inStock: true,
          stockQuantity: stockIdx >= 0 && fields[stockIdx] ? Number(fields[stockIdx]) || undefined : undefined,
          createdAt: now,
          updatedAt: now,
        };

        imported.push(product);
      } catch {
        errors.push(`Ligne ${i + 1}: erreur de parsing`);
      }
    }

    if (imported.length === 0) {
      return NextResponse.json({
        error: 'Aucun produit valide trouvé dans le CSV.',
        errors,
      }, { status: 400 });
    }

    // Save to DB
    const serverDB = await getServerDB();
    const result = await serverDB
      .select({ general: userSettings.general })
      .from(userSettings)
      .where(eq(userSettings.id, session.user.id) as any)
      .limit(1);

    const general = (result?.[0]?.general as Record<string, any>) || {};
    const ecommerce = general?.ecommerce || {};
    const existingProducts: Product[] = replace ? [] : (ecommerce?.products || []);

    const allProducts = [...existingProducts, ...imported];

    await serverDB
      .update(userSettings)
      .set({
        general: {
          ...general,
          ecommerce: { ...ecommerce, products: allProducts },
        },
      } as any)
      .where(eq(userSettings.id, session.user.id) as any);

    return NextResponse.json({
      imported: imported.length,
      total: allProducts.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error('[ecommerce/import] POST Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
