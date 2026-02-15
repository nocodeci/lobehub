'use client';

import { useState } from 'react';

type PlanKey = 'free' | 'starter' | 'base' | 'pro' | 'premium' | 'business' | 'ultimate' | 'enterprise';
type BillingCycle = 'monthly' | 'yearly';

const APP_URL = 'https://app.connect.wozif.com';

export function useStripeCheckout() {
    const [loading, setLoading] = useState<string | null>(null);

    const checkout = async (plan: PlanKey, billingCycle: BillingCycle) => {
        const loadingKey = `${plan}-${billingCycle}`;
        setLoading(loadingKey);

        // Redirect to Connect subscription page with plan info
        window.location.href = `${APP_URL}/subscription?plan=${plan}&cycle=${billingCycle}`;
    };

    const isLoading = (plan: PlanKey) => loading?.startsWith(plan) ?? false;

    return { checkout, isLoading, loading };
}
