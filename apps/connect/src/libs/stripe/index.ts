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
 * Plan configuration with BYOK (Bring Your Own Key) support.
 * Price IDs come from Stripe Dashboard and are set via environment variables.
 */
export const PLANS = {
  free: {
    name: 'Gratuit',
    description: 'Idéal pour tester la plateforme',
    features: [
      '1 agent WhatsApp',
      '250 crédits/mois (~25 messages)',
      'Stockage 500 MB',
      'Branding "Powered by Connect"',
      'Support communauté',
    ],
    limits: {
      agents: 1,
      credits: 250,
      storage: 500, // MB
    },
    monthlyAmount: 0,
    yearlyAmount: 0,
    priceIds: {
      monthly: null,
      yearly: null,
    },
  },
  starter: {
    name: 'Starter',
    description: 'Pour petites entreprises et freelances',
    agents: 3,
    credits: 5000000,
    creditsLabel: '5,000,000',
    storage: '5 GB',
    features: [
      '3 agents WhatsApp',
      '5,000,000 crédits/mois',
      'Tous les modèles IA (GPT-4o, Claude, DeepSeek)',
      'Stockage 5 GB',
      'Support email',
      'Crédits supplémentaires : 15€/10M',
    ],
    monthlyAmount: 29,
    yearlyAmount: 290,
    priceIds: {
      monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY!,
      yearly: process.env.STRIPE_PRICE_STARTER_YEARLY!,
    },
  },
  pro: {
    name: 'Pro',
    description: 'Pour PME et agences en croissance',
    agents: 10,
    credits: 40000000,
    creditsLabel: '40,000,000',
    storage: '20 GB',
    features: [
      '10 agents WhatsApp',
      '40M crédits (~56,000 messages)',
      'Tous les modèles IA (GPT-4o, Claude, DeepSeek)',
      'Stockage 20 GB',
      'Connecteurs CRM natifs',
      'Support prioritaire 24/7',
      'Crédits supplémentaires : 12€/10M',
    ],
    monthly: {
      amount: 7900,
      priceId: process.env.STRIPE_PRICE_PRO_MONTHLY || '',
    },
    yearly: {
      amount: 79000,
      priceId: process.env.STRIPE_PRICE_PRO_YEARLY || '',
    },
    popular: true,
    trialDays: 7,
    byok: {
      description: 'Utilisez vos propres clés API',
      monthly: { amount: 3900, priceId: process.env.STRIPE_PRICE_PRO_BYOK_MONTHLY || '' },
      yearly: { amount: 39000, priceId: process.env.STRIPE_PRICE_PRO_BYOK_YEARLY || '' },
      discount: 51,
    },
  },
  business: {
    name: 'Business',
    description: 'Pour grandes entreprises',
    agents: 50,
    credits: 150000000,
    creditsLabel: '150,000,000',
    storage: '100 GB',
    features: [
      '50 agents WhatsApp',
      '150M crédits',
      'Tous les modèles IA + priorité',
      'Stockage 100 GB',
      'Multi-utilisateurs (5 sièges inclus)',
      'SSO & Logs d\'audit',
      'Account Manager dédié',
      'Crédits supplémentaires : 10€/10M',
    ],
    monthly: {
      amount: 19900,
      priceId: process.env.STRIPE_PRICE_BUSINESS_MONTHLY || '',
    },
    yearly: {
      amount: 199000,
      priceId: process.env.STRIPE_PRICE_BUSINESS_YEARLY || '',
    },
    byok: {
      description: 'Utilisez vos propres clés API',
      monthly: { amount: 9900, priceId: process.env.STRIPE_PRICE_BUSINESS_BYOK_MONTHLY || '' },
      yearly: { amount: 99000, priceId: process.env.STRIPE_PRICE_BUSINESS_BYOK_YEARLY || '' },
      discount: 50,
    },
  },
  enterprise: {
    name: 'Enterprise',
    description: 'Solution sur mesure pour corporations',
    agents: -1,
    credits: -1,
    creditsLabel: 'Illimité',
    storage: 'Illimité',
    features: [
      'Agents WhatsApp illimités',
      'Crédits personnalisés',
      'Infrastructure dédiée',
      'Stockage illimité',
      'Multi-utilisateurs illimités',
      'SLA 99.9%',
      'Onboarding personnalisé',
      'Support dédié 24/7',
    ],
    monthly: { amount: 0, priceId: '' },
    yearly: { amount: 0, priceId: '' },
    contactSales: true,
    byok: {
      description: 'Inclus dans l\'offre Enterprise',
      monthly: { amount: 0, priceId: '' },
      yearly: { amount: 0, priceId: '' },
      discount: 0,
    },
  },
} as const;

export type PlanKey = keyof typeof PLANS;
export type BillingCycle = 'monthly' | 'yearly';
export type PricingMode = 'standard' | 'byok';
