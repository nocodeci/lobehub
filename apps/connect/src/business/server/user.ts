/* eslint-disable unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars */
import { type ReferralStatusString } from '@lobechat/types';
import { eq } from 'drizzle-orm';

import { userSettings } from '@/database/schemas/user';
import { serverDB } from '@/database/server';

const VALID_PLANS = ['free', 'starter', 'pro', 'business', 'enterprise'];

/**
 * Get user's subscription plan.
 * The plan is stored as `general.subscriptionPlan` in user_settings by the Stripe webhook.
 */
export async function getSubscriptionPlan(userId: string): Promise<string> {
  try {
    const result = await serverDB
      .select({ general: userSettings.general })
      .from(userSettings)
      .where(eq(userSettings.id, userId) as any)
      .limit(1);

    if (result?.[0]?.general) {
      const general = result[0].general as Record<string, any>;
      const plan = general?.subscriptionPlan;
      if (plan && VALID_PLANS.includes(plan)) {
        return plan;
      }
    }
  } catch (error) {
    console.error('[getSubscriptionPlan] Error reading plan from DB:', error);
  }

  return 'free';
}

export async function getReferralStatus(userId: string): Promise<ReferralStatusString | undefined> {
  return undefined;
}

export async function getIsInviteCodeRequired(userId: string): Promise<boolean> {
  return false;
}

export async function initNewUserForBusiness(
  userId: string,
  createdAt: Date | null | undefined,
): Promise<void> {}
