import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-01-28.clover',
    typescript: true,
});

/**
 * Plan configuration mapping plan names and billing cycles to Stripe Price IDs.
 * These Price IDs must be created in your Stripe Dashboard under Products > Pricing.
 */
export const PLANS = {
    base: {
        name: 'Version de base',
        monthly: {
            priceId: process.env.STRIPE_PRICE_BASE_MONTHLY || '',
            amount: 1900, // $19.00
        },
        yearly: {
            priceId: process.env.STRIPE_PRICE_BASE_YEARLY || '',
            amount: 18000, // $180.00/year ($15/mo)
        },
    },
    premium: {
        name: 'Premium Pro',
        monthly: {
            priceId: process.env.STRIPE_PRICE_PREMIUM_MONTHLY || '',
            amount: 5000, // $50.00
        },
        yearly: {
            priceId: process.env.STRIPE_PRICE_PREMIUM_YEARLY || '',
            amount: 46800, // $468.00/year ($39/mo)
        },
    },
    ultimate: {
        name: 'Utilisation intensive',
        monthly: {
            priceId: process.env.STRIPE_PRICE_ULTIMATE_MONTHLY || '',
            amount: 12000, // $120.00
        },
        yearly: {
            priceId: process.env.STRIPE_PRICE_ULTIMATE_YEARLY || '',
            amount: 118800, // $1,188.00/year ($99/mo)
        },
    },
} as const;

export type PlanKey = keyof typeof PLANS;
export type BillingCycle = 'monthly' | 'yearly';
