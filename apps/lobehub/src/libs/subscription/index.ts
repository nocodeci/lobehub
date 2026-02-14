/**
 * Subscription plan limits and enforcement utilities.
 * Defines what each plan allows: agent count, credits, storage, BYOK access.
 */

export type SubscriptionPlan = 'free' | 'starter' | 'pro' | 'business' | 'enterprise';

export interface PlanLimits {
  agents: number; // -1 = unlimited
  byokAllowed: boolean;
  credits: number; // -1 = unlimited
  name: string;
  storage: number; // in MB, -1 = unlimited
  whatsappAccounts: number; // -1 = unlimited
}

/**
 * Plan limits configuration
 */
export const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  free: {
    agents: 1,
    byokAllowed: false,
    credits: 250,
    name: 'Gratuit',
    storage: 500,
    whatsappAccounts: 1,
  },
  starter: {
    agents: 3,
    byokAllowed: false,
    credits: 5_000_000,
    name: 'Starter',
    storage: 5_000,
    whatsappAccounts: 2,
  },
  pro: {
    agents: 10,
    byokAllowed: true,
    credits: 40_000_000,
    name: 'Pro',
    storage: 20_000,
    whatsappAccounts: 5,
  },
  business: {
    agents: 50,
    byokAllowed: true,
    credits: 150_000_000,
    name: 'Business',
    storage: 100_000,
    whatsappAccounts: 20,
  },
  enterprise: {
    agents: -1,
    byokAllowed: true,
    credits: -1,
    name: 'Enterprise',
    storage: -1,
    whatsappAccounts: -1,
  },
};

/**
 * Get limits for a given plan. Defaults to 'free' if plan is unknown.
 */
export function getPlanLimits(plan: string | null | undefined): PlanLimits {
  const key = (plan || 'free') as SubscriptionPlan;
  return PLAN_LIMITS[key] || PLAN_LIMITS.free;
}

/**
 * Check if a user can create a new agent based on their plan.
 */
export function canCreateAgent(plan: string | null | undefined, currentAgentCount: number): {
  allowed: boolean;
  limit: number;
  message?: string;
} {
  const limits = getPlanLimits(plan);

  if (limits.agents === -1) {
    return { allowed: true, limit: -1 };
  }

  if (currentAgentCount >= limits.agents) {
    return {
      allowed: false,
      limit: limits.agents,
      message: `Vous avez atteint la limite de ${limits.agents} agent${limits.agents > 1 ? 's' : ''} pour le plan ${limits.name}. Passez à un plan supérieur pour créer plus d'agents.`,
    };
  }

  return { allowed: true, limit: limits.agents };
}

/**
 * Check if BYOK (Bring Your Own Key) is allowed for a given plan.
 */
export function canUseBYOK(plan: string | null | undefined): {
  allowed: boolean;
  message?: string;
} {
  const limits = getPlanLimits(plan);

  if (!limits.byokAllowed) {
    return {
      allowed: false,
      message: `L'utilisation de vos propres clés API (BYOK) est disponible à partir du plan Pro. Vous êtes actuellement sur le plan ${limits.name}.`,
    };
  }

  return { allowed: true };
}

/**
 * Check if a user can add a new WhatsApp account based on their plan.
 */
export function canAddWhatsAppAccount(plan: string | null | undefined, currentCount: number): {
  allowed: boolean;
  limit: number;
  message?: string;
} {
  const limits = getPlanLimits(plan);

  if (limits.whatsappAccounts === -1) {
    return { allowed: true, limit: -1 };
  }

  if (currentCount >= limits.whatsappAccounts) {
    return {
      allowed: false,
      limit: limits.whatsappAccounts,
      message: `Vous avez atteint la limite de ${limits.whatsappAccounts} compte${limits.whatsappAccounts > 1 ? 's' : ''} WhatsApp pour le plan ${limits.name}. Passez à un plan supérieur.`,
    };
  }

  return { allowed: true, limit: limits.whatsappAccounts };
}

/**
 * Check if a user can create groups based on their plan.
 * Groups are only available for Business and Enterprise plans.
 */
export function canCreateGroup(plan: string | null | undefined): {
  allowed: boolean;
  message?: string;
} {
  const GROUP_PLANS = ['business', 'enterprise'];
  const key = (plan || 'free') as string;

  if (!GROUP_PLANS.includes(key)) {
    const limits = getPlanLimits(plan);
    return {
      allowed: false,
      message: `La création de groupes d'agents est disponible à partir du plan Business. Vous êtes actuellement sur le plan ${limits.name}.`,
    };
  }

  return { allowed: true };
}

/**
 * Get a human-readable summary of plan limits.
 */
export function getPlanSummary(plan: string | null | undefined) {
  const limits = getPlanLimits(plan);
  return {
    agents: limits.agents === -1 ? 'Illimités' : `${limits.agents}`,
    byok: limits.byokAllowed ? 'Oui' : 'Non (Pro+ requis)',
    credits: limits.credits === -1 ? 'Illimités' : limits.credits.toLocaleString('fr-FR'),
    name: limits.name,
    storage: limits.storage === -1 ? 'Illimité' : `${limits.storage >= 1000 ? `${limits.storage / 1000} GB` : `${limits.storage} MB`}`,
    whatsapp: limits.whatsappAccounts === -1 ? 'Illimités' : `${limits.whatsappAccounts}`,
  };
}
