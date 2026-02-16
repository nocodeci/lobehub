/**
 * Credit system for Connect — monetary-based (1 credit = $0.01).
 *
 * Each AI model has a different cost in credits.
 * Claude models are restricted to Pro+ plans.
 * When credits run out, all AI access is cut off.
 * Users can top-up credits to continue using AI.
 *
 * Structure in userSettings.general:
 * {
 *   subscriptionPlan: 'free',
 *   creditUsage: {
 *     used: 45,
 *     topUp: 0,
 *     periodStart: '2026-02-01T00:00:00.000Z'
 *   }
 * }
 */
import { eq } from 'drizzle-orm';

import { userSettings, users } from '@/database/schemas/user';

import { type SubscriptionPlan, getPlanLimits } from './index';

const PERIOD_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// ==================== MODEL COSTS ==================== //

/**
 * Cost per AI message in credits (1 credit = $0.01).
 * Prices include margin over actual API costs.
 *
 * Actual API cost → What we charge → Margin
 * GPT-4o-mini:  ~$0.0003/msg → 1 credit ($0.01)  → ~33x
 * GPT-4o:       ~$0.004/msg  → 3 credits ($0.03)  → ~7x
 * Claude Haiku: ~$0.001/msg  → 2 credits ($0.02)  → ~20x
 * Claude Sonnet:~$0.006/msg  → 5 credits ($0.05)  → ~8x
 * Claude Opus:  ~$0.06/msg   → 20 credits ($0.20) → ~3x
 */
const MODEL_COSTS: Record<string, number> = {
  // OpenAI
  'gpt-4o-mini': 1,
  'gpt-4o': 3,
  'gpt-4-turbo': 3,
  'gpt-4': 3,
  'gpt-3.5-turbo': 1,
  'o1-mini': 2,
  'o1-preview': 5,
  'o1': 5,
  'o3-mini': 2,

  // Anthropic (Pro+ only)
  'claude-3-haiku-20240307': 2,
  'claude-3-5-haiku-20241022': 2,
  'claude-3-sonnet-20240229': 5,
  'claude-3-5-sonnet-20241022': 5,
  'claude-3-5-sonnet-20240620': 5,
  'claude-sonnet-4-20250514': 5,
  'claude-3-opus-20240229': 20,
  'claude-opus-4-20250514': 20,

  // Google
  'gemini-pro': 1,
  'gemini-1.5-pro': 2,
  'gemini-1.5-flash': 1,
  'gemini-2.0-flash': 1,
  'gemini-2.0-flash-exp': 1,

  // Mistral
  'mistral-large-latest': 2,
  'mistral-medium-latest': 1,
  'mistral-small-latest': 1,

  // Groq (fast inference, low cost)
  'llama-3.1-70b-versatile': 1,
  'llama-3.1-8b-instant': 1,
  'mixtral-8x7b-32768': 1,

  // DeepSeek
  'deepseek-chat': 1,
  'deepseek-reasoner': 2,

  // ==================== OpenRouter models (provider/model format) ==================== //

  // OpenRouter Auto
  'openrouter/auto': 2,

  // OpenAI via OpenRouter
  'openai/gpt-4o-mini': 1,
  'openai/gpt-4o': 3,
  'openai/gpt-4.1': 5,
  'openai/gpt-4.1-mini': 2,
  'openai/gpt-4.1-nano': 1,
  'openai/o1-mini': 2,
  'openai/o1-preview': 5,
  'openai/o3-mini': 3,
  'openai/o3-mini-high': 3,
  'openai/o3': 10,
  'openai/o4-mini': 3,
  'openai/o4-mini-high': 3,

  // Google via OpenRouter
  'google/gemini-2.5-pro': 5,
  'google/gemini-2.5-pro-preview': 5,
  'google/gemini-2.5-flash': 1,
  'google/gemini-2.5-flash-preview': 1,
  'google/gemini-2.5-flash-preview:thinking': 2,
  'google/gemini-2.5-flash-image-preview': 2,

  // DeepSeek via OpenRouter
  'deepseek/deepseek-chat-v3.1': 1,
  'deepseek/deepseek-chat-v3-0324': 1,
  'deepseek/deepseek-chat-v3-0324:free': 1,
  'deepseek/deepseek-r1': 3,
  'deepseek/deepseek-r1:free': 1,
  'deepseek/deepseek-r1-0528': 2,
  'deepseek/deepseek-r1-0528:free': 1,

  // Anthropic via OpenRouter
  'anthropic/claude-3-haiku': 2,
  'anthropic/claude-sonnet-4.5': 5,
  'anthropic/claude-opus-4.5': 20,

  // Qwen via OpenRouter
  'qwen/qwen3-8b:free': 1,
  'qwen/qwen3-14b:free': 1,
  'qwen/qwen3-14b': 1,
  'qwen/qwen3-30b-a3b:free': 1,
  'qwen/qwen3-30b-a3b': 1,
  'qwen/qwen3-32b:free': 1,
  'qwen/qwen3-32b': 1,
  'qwen/qwen3-235b-a22b:free': 1,
  'qwen/qwen3-235b-a22b': 2,

  // GLM via OpenRouter
  'thudm/glm-4-32b:free': 1,
  'thudm/glm-4-32b': 1,
  'thudm/glm-z1-32b': 2,
  'thudm/glm-z1-rumination-32b': 2,

  // Other OpenRouter free models
  'tngtech/deepseek-r1t-chimera:free': 1,
};

/** Default cost for unknown models */
const DEFAULT_MODEL_COST = 2;

/** Providers whose models require Pro+ plan */
const RESTRICTED_PROVIDERS = new Set(['anthropic']);

/** Minimum plan required to use restricted providers */
const RESTRICTED_PROVIDER_MIN_PLAN: SubscriptionPlan = 'pro';

const PLAN_HIERARCHY: Record<SubscriptionPlan, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  business: 3,
  enterprise: 4,
};

// ==================== TYPES ==================== //

interface CreditUsage {
  periodStart: string;
  topUp: number;
  used: number;
}

interface CreditCheckResult {
  allowed: boolean;
  costForThisCall: number;
  limit: number;
  message?: string;
  remaining: number;
  used: number;
}

// ==================== HELPERS ==================== //

/**
 * Get the credit cost for a specific model.
 */
export function getModelCost(model?: string): number {
  if (!model) return DEFAULT_MODEL_COST;
  return MODEL_COSTS[model] ?? DEFAULT_MODEL_COST;
}

/**
 * Check if a provider is restricted and requires a higher plan.
 */
export function isProviderRestricted(provider?: string): boolean {
  if (!provider) return false;
  return RESTRICTED_PROVIDERS.has(provider.toLowerCase());
}

/**
 * Check if a user's plan allows a specific provider.
 */
export function canUseProvider(plan: SubscriptionPlan, provider?: string): boolean {
  if (!provider || !isProviderRestricted(provider)) return true;
  return PLAN_HIERARCHY[plan] >= PLAN_HIERARCHY[RESTRICTED_PROVIDER_MIN_PLAN];
}

/**
 * Get the current credit usage for a user from the DB.
 * Resets automatically if the billing period has expired.
 */
async function getCreditUsage(
  serverDB: any,
  userId: string,
): Promise<{ general: Record<string, any>; usage: CreditUsage }> {
  const result = await serverDB
    .select({ general: userSettings.general })
    .from(userSettings)
    .where(eq(userSettings.id, userId) as any)
    .limit(1);

  const general = (result?.[0]?.general as Record<string, any>) || {};
  let usage: CreditUsage = general?.creditUsage || {
    periodStart: new Date().toISOString(),
    topUp: 0,
    used: 0,
  };

  // Ensure topUp field exists (backwards compat)
  if (typeof usage.topUp !== 'number') {
    usage.topUp = 0;
  }

  // Reset monthly usage if period expired (keep topUp credits)
  const periodStart = new Date(usage.periodStart).getTime();
  const now = Date.now();
  if (now - periodStart > PERIOD_DURATION_MS) {
    usage = {
      periodStart: new Date().toISOString(),
      topUp: usage.topUp,
      used: 0,
    };
  }

  return { general, usage };
}

// ==================== AUTO-RECHARGE & NOTIFICATIONS ==================== //

const AUTO_RECHARGE_AMOUNT_DOLLARS = 10; // $10 auto-recharge
const AUTO_RECHARGE_CREDITS = AUTO_RECHARGE_AMOUNT_DOLLARS * 100; // 1000 credits

/**
 * Try to auto-recharge credits by charging the user's saved Stripe payment method.
 * Only works for paid plans (Starter+) with a saved stripeCustomerId.
 * Uses Stripe PaymentIntent with off_session to charge without user interaction.
 * Returns true if recharge succeeded.
 */
async function tryAutoRecharge(
  serverDB: any,
  userId: string,
  general: Record<string, any>,
): Promise<boolean> {
  try {
    const plan = (general?.subscriptionPlan || 'free') as SubscriptionPlan;
    // Don't auto-recharge free plan
    if (plan === 'free') return false;

    const customerId = general?.subscription?.stripeCustomerId;
    if (!customerId) {
      console.log('[autoRecharge] No stripeCustomerId for user', userId);
      return false;
    }

    // Prevent rapid-fire recharge attempts (max 1 per hour)
    const lastAttempt = general?.creditUsage?.lastAutoRechargeAttempt;
    if (lastAttempt && Date.now() - new Date(lastAttempt).getTime() < 60 * 60 * 1000) {
      console.log('[autoRecharge] Throttled — last attempt was less than 1 hour ago');
      return false;
    }

    // Mark attempt timestamp
    const updatedGeneral = {
      ...general,
      creditUsage: {
        ...general.creditUsage,
        lastAutoRechargeAttempt: new Date().toISOString(),
      },
    };
    await serverDB
      .update(userSettings)
      .set({ general: updatedGeneral } as any)
      .where(eq(userSettings.id, userId) as any);

    // Lazy-load Stripe to avoid circular deps
    const { getStripe } = await import('@/libs/stripe');
    const stripe = getStripe();

    // Get customer's default payment method
    const customer = await stripe.customers.retrieve(customerId) as any;
    const defaultPm = customer?.invoice_settings?.default_payment_method
      || customer?.default_source;

    if (!defaultPm) {
      console.log('[autoRecharge] No default payment method for customer', customerId);
      return false;
    }

    // Create and confirm a PaymentIntent off-session
    const paymentIntent = await stripe.paymentIntents.create({
      amount: AUTO_RECHARGE_AMOUNT_DOLLARS * 100, // cents
      confirm: true,
      currency: 'usd',
      customer: customerId,
      description: `Connect AI Credits — Auto-recharge $${AUTO_RECHARGE_AMOUNT_DOLLARS}`,
      metadata: {
        credits: AUTO_RECHARGE_CREDITS.toString(),
        type: 'auto_recharge',
        userId,
      },
      off_session: true,
      payment_method: defaultPm as string,
    });

    if (paymentIntent.status === 'succeeded') {
      console.log(`[autoRecharge] Success! Added ${AUTO_RECHARGE_CREDITS} credits to user ${userId}`);
      await addTopUpCredits(serverDB, userId, AUTO_RECHARGE_CREDITS);
      return true;
    }

    console.warn('[autoRecharge] PaymentIntent not succeeded:', paymentIntent.status);
    return false;
  } catch (error: any) {
    console.error('[autoRecharge] Failed:', error.message);
    return false;
  }
}

/**
 * Send a "credits exhausted" notification email.
 * Throttled to once per day to avoid spamming.
 */
async function sendCreditsExhaustedEmail(
  serverDB: any,
  userId: string,
  general: Record<string, any>,
): Promise<void> {
  try {
    // Throttle: max 1 email per 24h
    const lastNotif = general?.creditUsage?.lastExhaustedEmail;
    if (lastNotif && Date.now() - new Date(lastNotif).getTime() < 24 * 60 * 60 * 1000) {
      return;
    }

    // Mark email sent
    const updatedGeneral = {
      ...general,
      creditUsage: {
        ...general.creditUsage,
        lastExhaustedEmail: new Date().toISOString(),
      },
    };
    await serverDB
      .update(userSettings)
      .set({ general: updatedGeneral } as any)
      .where(eq(userSettings.id, userId) as any);

    // Get user email
    const userResult = await serverDB
      .select({ email: users.email, fullName: users.fullName })
      .from(users)
      .where(eq(users.id, userId) as any)
      .limit(1);

    const user = userResult?.[0];
    if (!user || !(user as any).email) return;

    const plan = general?.subscriptionPlan || 'free';

    // Import and call the webhook notification function
    const { notifyCreditsExhausted } = await import('@/app/api/webhooks/stripe/route');
    await notifyCreditsExhausted((user as any).email, (user as any).fullName || '', plan);
  } catch (error) {
    console.error('[sendCreditsExhaustedEmail] Error:', error);
  }
}

// ==================== MAIN API ==================== //

/**
 * Check if a user has enough credits and is allowed to use the requested model/provider.
 * @param model - The AI model being used (e.g., 'gpt-4o-mini', 'claude-3-5-sonnet-20241022')
 * @param provider - The AI provider (e.g., 'openai', 'anthropic')
 */
export async function checkCredits(
  serverDB: any,
  userId: string,
  model?: string,
  provider?: string,
): Promise<CreditCheckResult> {
  try {
    const { general, usage } = await getCreditUsage(serverDB, userId);
    const plan = (general?.subscriptionPlan || 'free') as SubscriptionPlan;
    const limits = getPlanLimits(plan);
    const cost = getModelCost(model);

    // Check provider restriction (Claude = Pro+ only)
    if (!canUseProvider(plan, provider)) {
      return {
        allowed: false,
        costForThisCall: cost,
        limit: limits.credits,
        message: `Le fournisseur ${provider} (Claude) est réservé aux plans Pro et supérieurs. Veuillez passer au plan Pro pour utiliser Claude.`,
        remaining: 0,
        used: usage.used,
      };
    }

    // Unlimited credits (Enterprise)
    if (limits.credits === -1) {
      return { allowed: true, costForThisCall: cost, limit: -1, remaining: -1, used: usage.used };
    }

    // Total available = plan credits + top-up credits
    const totalAvailable = limits.credits + usage.topUp;
    const remaining = Math.max(0, totalAvailable - usage.used);

    // Check if user has enough credits for this call
    if (usage.used + cost > totalAvailable) {
      // Try auto-recharge before refusing
      const autoRecharged = await tryAutoRecharge(serverDB, userId, general);
      if (autoRecharged) {
        // Re-read usage after recharge
        const refreshed = await getCreditUsage(serverDB, userId);
        const newTotal = limits.credits + refreshed.usage.topUp;
        const newRemaining = Math.max(0, newTotal - refreshed.usage.used);
        if (refreshed.usage.used + cost <= newTotal) {
          return { allowed: true, costForThisCall: cost, limit: newTotal, remaining: newRemaining, used: refreshed.usage.used };
        }
      }

      // Auto-recharge failed or not enough — send exhaustion email (fire & forget)
      sendCreditsExhaustedEmail(serverDB, userId, general).catch(() => {});

      const remainingValue = (remaining * 0.01).toFixed(2);
      const costValue = (cost * 0.01).toFixed(2);
      return {
        allowed: false,
        costForThisCall: cost,
        limit: totalAvailable,
        message: `Crédits insuffisants. Il vous reste $${remainingValue} de crédits mais cette requête coûte $${costValue}. Ajoutez des crédits ou passez à un plan supérieur.`,
        remaining,
        used: usage.used,
      };
    }

    return { allowed: true, costForThisCall: cost, limit: totalAvailable, remaining, used: usage.used };
  } catch (error) {
    console.error('[checkCredits] Error:', error);
    return {
      allowed: false,
      costForThisCall: 0,
      limit: 0,
      message: 'Erreur lors de la vérification des crédits. Veuillez réessayer.',
      remaining: 0,
      used: 0,
    };
  }
}

/**
 * Deduct credits after a successful AI call.
 * @param model - The AI model used, determines cost
 */
export async function deductCredits(
  serverDB: any,
  userId: string,
  model?: string,
): Promise<void> {
  try {
    const cost = getModelCost(model);
    console.log(`[deductCredits] userId=${userId}, model=${model}, cost=${cost}`);
    const { general, usage } = await getCreditUsage(serverDB, userId);
    console.log(`[deductCredits] Before: used=${usage.used}, topUp=${usage.topUp}`);

    const updatedUsage: CreditUsage = {
      periodStart: usage.periodStart,
      topUp: usage.topUp,
      used: usage.used + cost,
    };

    const updatedGeneral = {
      ...general,
      creditUsage: updatedUsage,
    };

    const existing = await serverDB
      .select({ id: userSettings.id })
      .from(userSettings)
      .where(eq(userSettings.id, userId) as any)
      .limit(1);

    if (existing.length > 0) {
      await serverDB
        .update(userSettings)
        .set({ general: updatedGeneral } as any)
        .where(eq(userSettings.id, userId) as any);
    } else {
      await serverDB.insert(userSettings).values({
        general: updatedGeneral,
        id: userId,
      } as any);
    }
    console.log(`[deductCredits] Success: used=${updatedUsage.used} (was ${usage.used}, cost=${cost})`);
  } catch (error) {
    console.error('[deductCredits] Error deducting credits:', error);
  }
}

/**
 * Add top-up credits to a user's account (when they purchase more).
 * @param credits - Number of credits to add (1 credit = $0.01)
 */
export async function addTopUpCredits(
  serverDB: any,
  userId: string,
  credits: number,
): Promise<void> {
  try {
    const { general, usage } = await getCreditUsage(serverDB, userId);

    const updatedUsage: CreditUsage = {
      periodStart: usage.periodStart,
      topUp: usage.topUp + credits,
      used: usage.used,
    };

    const updatedGeneral = {
      ...general,
      creditUsage: updatedUsage,
    };

    const existing = await serverDB
      .select({ id: userSettings.id })
      .from(userSettings)
      .where(eq(userSettings.id, userId) as any)
      .limit(1);

    if (existing.length > 0) {
      await serverDB
        .update(userSettings)
        .set({ general: updatedGeneral } as any)
        .where(eq(userSettings.id, userId) as any);
    } else {
      await serverDB.insert(userSettings).values({
        general: updatedGeneral,
        id: userId,
      } as any);
    }
  } catch (error) {
    console.error('[addTopUpCredits] Error:', error);
  }
}

/**
 * Get credit usage summary for display.
 */
export async function getCreditSummary(
  serverDB: any,
  userId: string,
): Promise<{
  creditValueDollars: string;
  limit: number;
  periodEnd: string;
  periodStart: string;
  plan: string;
  remaining: number;
  remainingDollars: string;
  topUp: number;
  topUpDollars: string;
  used: number;
  usedDollars: string;
}> {
  const { general, usage } = await getCreditUsage(serverDB, userId);
  const plan = (general?.subscriptionPlan || 'free') as SubscriptionPlan;
  const limits = getPlanLimits(plan);

  const periodStart = new Date(usage.periodStart);
  const periodEnd = new Date(periodStart.getTime() + PERIOD_DURATION_MS);

  const totalAvailable = limits.credits === -1 ? -1 : limits.credits + usage.topUp;
  const remaining = totalAvailable === -1 ? -1 : Math.max(0, totalAvailable - usage.used);

  return {
    creditValueDollars: totalAvailable === -1 ? 'Illimité' : `$${(totalAvailable * 0.01).toFixed(2)}`,
    limit: totalAvailable,
    periodEnd: periodEnd.toISOString(),
    periodStart: usage.periodStart,
    plan: limits.name,
    remaining,
    remainingDollars: remaining === -1 ? 'Illimité' : `$${(remaining * 0.01).toFixed(2)}`,
    topUp: usage.topUp,
    topUpDollars: `$${(usage.topUp * 0.01).toFixed(2)}`,
    used: usage.used,
    usedDollars: `$${(usage.used * 0.01).toFixed(2)}`,
  };
}
