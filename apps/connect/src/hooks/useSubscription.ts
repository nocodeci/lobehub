'use client';

import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';

import type { PlanLimits, SubscriptionPlan } from '@/libs/subscription';

interface SubscriptionData {
  canCreateAgent: { allowed: boolean; limit: number; message?: string };
  canUseBYOK: { allowed: boolean; message?: string };
  currentUsage: { agents: number };
  limits: PlanLimits;
  plan: SubscriptionPlan;
  summary: {
    agents: string;
    byok: string;
    credits: string;
    name: string;
    storage: string;
  };
}

interface SubscriptionStatus {
  currentPlan: string | null;
  status: string;
  subscription: {
    billingCycle: string;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: number;
    currentPeriodStart: number;
    id: string;
  } | null;
}

const fetchSubscriptionStatus = async (customerId: string | null): Promise<SubscriptionStatus> => {
  if (!customerId) {
    return { currentPlan: null, status: 'none', subscription: null };
  }
  const res = await fetch(`/api/subscription?customerId=${customerId}`);
  if (!res.ok) throw new Error('Failed to fetch subscription status');
  return res.json();
};

const fetchSubscriptionLimits = async (
  customerId: string | null,
  agentCount: number,
): Promise<SubscriptionData> => {
  const params = new URLSearchParams();
  if (customerId) params.set('customerId', customerId);
  params.set('agentCount', String(agentCount));

  const res = await fetch(`/api/subscription/limits?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch subscription limits');
  return res.json();
};

/**
 * Hook to access subscription status and plan limits throughout the app.
 * Usage:
 *   const { plan, limits, canCreateAgent, canUseBYOK, refresh } = useSubscription(customerId, agentCount);
 */
export function useSubscription(customerId: string | null, agentCount: number = 0) {
  const { data: status, mutate: mutateStatus } = useSWR(
    customerId ? ['subscription-status', customerId] : null,
    () => fetchSubscriptionStatus(customerId),
    { revalidateOnFocus: false, dedupingInterval: 30000 },
  );

  const { data: limitsData, mutate: mutateLimits } = useSWR(
    ['subscription-limits', customerId, agentCount],
    () => fetchSubscriptionLimits(customerId, agentCount),
    { revalidateOnFocus: false, dedupingInterval: 30000 },
  );

  const refresh = useCallback(() => {
    mutateStatus();
    mutateLimits();
  }, [mutateStatus, mutateLimits]);

  return {
    // Status
    currentPlan: status?.currentPlan || 'free',
    subscriptionStatus: status?.status || 'none',
    subscription: status?.subscription || null,
    isActive: status?.status === 'active',

    // Limits
    plan: limitsData?.plan || 'free',
    limits: limitsData?.limits || {
      agents: 1,
      byokAllowed: false,
      credits: 100,
      name: 'Gratuit',
      storage: 500,
    },
    summary: limitsData?.summary,
    canCreateAgent: limitsData?.canCreateAgent || { allowed: false, limit: 1 },
    canUseBYOK: limitsData?.canUseBYOK || { allowed: false },
    currentUsage: limitsData?.currentUsage || { agents: 0 },

    // Actions
    refresh,
  };
}

const BYOK_PLANS = ['pro', 'business', 'enterprise'];

const fetchPlanFromDB = async (): Promise<string> => {
  try {
    const res = await fetch('/api/subscription/plan');
    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) return 'free';
      const data = await res.json();
      return data.plan || 'free';
    }
  } catch {
    // ignore — default to free
  }
  return 'free';
};

/**
 * Lightweight hook to check BYOK eligibility.
 * Reads the plan from the DB via /api/subscription/plan (no Stripe dependency).
 * Returns canUseBYOK=false (plan=free) while loading, so the banner shows by default.
 */
export function useBYOKCheck(_customerId?: string | null) {
  const { data: plan = 'free' } = useSWR('subscription-plan-db', fetchPlanFromDB, {
    dedupingInterval: 30_000,
    revalidateOnFocus: false,
  });

  const allowed = BYOK_PLANS.includes(plan);

  return { canUseBYOK: allowed, plan };
}
