/**
 * Script to create Stripe Products and Prices for the landing page.
 * Run: npx tsx scripts/setup-stripe-prices.ts
 *
 * Requires STRIPE_SECRET_KEY in .env.local
 */

import Stripe from 'stripe';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local manually (no dotenv dependency needed)
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx === -1) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        if (!process.env[key]) process.env[key] = val;
    }
}

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
    console.error('❌ STRIPE_SECRET_KEY manquant dans .env.local');
    process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2026-01-28.clover' as any,
    typescript: true,
});

interface PlanConfig {
    name: string;
    description: string;
    monthlyAmount: number; // in cents
    yearlyAmount: number;  // in cents
    envMonthly: string;
    envYearly: string;
}

const PLANS: PlanConfig[] = [
    {
        name: 'Connect - Version de base',
        description: 'Plan de base pour Connect avec accès aux fonctionnalités essentielles.',
        monthlyAmount: 1900,  // $19.00
        yearlyAmount: 18000,  // $180.00/year
        envMonthly: 'STRIPE_PRICE_BASE_MONTHLY',
        envYearly: 'STRIPE_PRICE_BASE_YEARLY',
    },
    {
        name: 'Connect - Premium Pro',
        description: 'Plan Premium Pro avec accès aux intégrations avancées et support prioritaire.',
        monthlyAmount: 5000,  // $50.00
        yearlyAmount: 46800,  // $468.00/year
        envMonthly: 'STRIPE_PRICE_PREMIUM_MONTHLY',
        envYearly: 'STRIPE_PRICE_PREMIUM_YEARLY',
    },
    {
        name: 'Connect - Utilisation intensive',
        description: 'Plan Utilisation intensive avec accès illimité à toutes les fonctionnalités.',
        monthlyAmount: 12000,  // $120.00
        yearlyAmount: 118800,  // $1,188.00/year
        envMonthly: 'STRIPE_PRICE_ULTIMATE_MONTHLY',
        envYearly: 'STRIPE_PRICE_ULTIMATE_YEARLY',
    },
];

async function main() {
    console.log('🚀 Création des produits et prix Stripe...\n');

    const envLines: string[] = [];

    for (const plan of PLANS) {
        console.log(`📦 Création du produit: ${plan.name}`);

        // Create the product
        const product = await stripe.products.create({
            name: plan.name,
            description: plan.description,
        });

        console.log(`   ✅ Produit créé: ${product.id}`);

        // Create monthly price
        const monthlyPrice = await stripe.prices.create({
            product: product.id,
            unit_amount: plan.monthlyAmount,
            currency: 'usd',
            recurring: { interval: 'month' },
            metadata: { plan: plan.name, cycle: 'monthly' },
        });

        console.log(`   💰 Prix mensuel: ${monthlyPrice.id} ($${(plan.monthlyAmount / 100).toFixed(2)}/mois)`);

        // Create yearly price
        const yearlyPrice = await stripe.prices.create({
            product: product.id,
            unit_amount: plan.yearlyAmount,
            currency: 'usd',
            recurring: { interval: 'year' },
            metadata: { plan: plan.name, cycle: 'yearly' },
        });

        console.log(`   💰 Prix annuel:  ${yearlyPrice.id} ($${(plan.yearlyAmount / 100).toFixed(2)}/an)`);

        envLines.push(`${plan.envMonthly}=${monthlyPrice.id}`);
        envLines.push(`${plan.envYearly}=${yearlyPrice.id}`);

        console.log('');
    }

    console.log('═══════════════════════════════════════════');
    console.log('📋 Ajoute ces lignes dans ton .env.local :');
    console.log('═══════════════════════════════════════════\n');
    for (const line of envLines) {
        console.log(line);
    }
    console.log('\n✅ Terminé ! Les produits et prix sont créés dans Stripe.');
}

main().catch((err) => {
    console.error('❌ Erreur:', err.message);
    process.exit(1);
});
