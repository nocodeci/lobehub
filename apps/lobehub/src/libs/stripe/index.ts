import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export const getStripe = (): Stripe => {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Missing STRIPE_SECRET_KEY environment variable');
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-01-27.acacia' as any,
      typescript: true,
    });
  }
  return _stripe;
};

/**
 * Plan configuration — mirrors the landing page plans exactly.
 * Price IDs come from Stripe Dashboard and are set via environment variables.
 */
export const PLANS = {
  base: {
    credits: '10,000,000',
    description: 'Pour une utilisation légère et occasionnelle',
    features: [
      'GPT-4o mini (~14,000 messages)',
      'DeepSeek R1 (~3,800 messages)',
      'Claude 3.5 Sonnet (~600 messages)',
      'Stockage fichiers 2 GB',
      'Stockage vecteurs 10,000 entrées',
      'Recherche web',
      'Support e-mail prioritaire',
    ],
    monthly: {
      amount: 1900,
      priceId: process.env.STRIPE_PRICE_BASE_MONTHLY || '',
    },
    name: 'Version de base',
    yearly: {
      amount: 18000,
      priceId: process.env.STRIPE_PRICE_BASE_YEARLY || '',
    },
  },
  premium: {
    credits: '40,000,000',
    description: 'Essai gratuit de 3 jours, puis facturation mensuelle ou annuelle.',
    features: [
      'GPT-4o mini (~56,000 messages)',
      'DeepSeek R1 (~15,000 messages)',
      'Claude 3.5 Sonnet (~2,400 messages)',
      'Stockage fichiers 10 GB',
      'Stockage vecteurs 50,000 entrées',
      'OCR & Analyse de documents',
      'Jusqu\'à 10 agents simultanés',
      'Connecteurs CRM Natifs',
      'Support Chat & Email 24/7',
    ],
    monthly: {
      amount: 5000,
      priceId: process.env.STRIPE_PRICE_PREMIUM_MONTHLY || '',
    },
    name: 'Premium Pro',
    popular: true,
    trialDays: 3,
    yearly: {
      amount: 46800,
      priceId: process.env.STRIPE_PRICE_PREMIUM_YEARLY || '',
    },
  },
  ultimate: {
    credits: '100,000,000',
    description: 'Pour les entreprises qui ne veulent aucune limite',
    features: [
      'Accès prioritaire GPT-4o (~14,000 messages)',
      'Claude 3.5 Opus inclus',
      'Génération d\'images (DALL-E 3)',
      'Stockage fichiers 50 GB',
      'Stockage vecteurs illimité',
      'Agents WhatsApp illimités',
      'Multi-utilisateurs & Rôles (RBAC)',
      'SSO & Logs d\'audit',
      'Account Manager dédié',
      'SLA 99.9%',
    ],
    monthly: {
      amount: 12000,
      priceId: process.env.STRIPE_PRICE_ULTIMATE_MONTHLY || '',
    },
    name: 'Utilisation intensive',
    yearly: {
      amount: 118800,
      priceId: process.env.STRIPE_PRICE_ULTIMATE_YEARLY || '',
    },
  },
} as const;

export type PlanKey = keyof typeof PLANS;
export type BillingCycle = 'monthly' | 'yearly';
