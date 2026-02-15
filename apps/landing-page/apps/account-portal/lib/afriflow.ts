/**
 * AfriFlow Payment Integration
 * Helper functions for interacting with AfriFlow API
 */

export interface PaymentLinkOptions {
    title: string;
    amount: number;
    description?: string;
    customerId?: string;
    metadata?: Record<string, any>;
}

export interface PaymentLinkResponse {
    success: boolean;
    paymentUrl: string;
    paymentId: string;
    amount: number;
    currency: string;
}

export interface PaymentVerifyResponse {
    success: boolean;
    paid: boolean;
    status: string;
    amount: number;
    currency: string;
    title: string;
    metadata?: Record<string, any>;
}

/**
 * Create a payment link via AfriFlow
 */
export async function createPaymentLink(options: PaymentLinkOptions): Promise<PaymentLinkResponse> {
    const response = await fetch('/api/afriflow/create-link', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create payment link');
    }

    return response.json();
}

/**
 * Verify a payment status
 */
export async function verifyPayment(paymentId: string): Promise<PaymentVerifyResponse> {
    const response = await fetch(`/api/afriflow/verify?paymentId=${paymentId}`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to verify payment');
    }

    return response.json();
}

/**
 * Format amount in FCFA
 */
export function formatFCFA(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount) + ' F';
}
