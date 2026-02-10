'use client';

import { useState } from 'react';

type PlanKey = 'base' | 'premium' | 'ultimate';
type BillingCycle = 'monthly' | 'yearly';

export function useStripeCheckout() {
    const [loading, setLoading] = useState<string | null>(null);

    const checkout = async (plan: PlanKey, billingCycle: BillingCycle) => {
        const loadingKey = `${plan}-${billingCycle}`;
        setLoading(loadingKey);

        try {
            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan, billingCycle }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Erreur lors du paiement');
            }

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error: any) {
            console.error('Checkout error:', error);
            alert(error.message || 'Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setLoading(null);
        }
    };

    const isLoading = (plan: PlanKey) => loading?.startsWith(plan) ?? false;

    return { checkout, isLoading, loading };
}
