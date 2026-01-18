import {
    IPaymentProvider,
    PaymentRequest,
    PaymentResponse,
    PaymentStatus,
    WebhookResult
} from '../types';

/**
 * PawaPay Payment Provider Adapter
 * Documentation: https://docs.pawapay.io/
 */

interface PawaPayConfig {
    apiKey: string;
    mode: 'test' | 'live';
}

interface PawaPayDepositResponse {
    depositId: string;
    status: string;
    created: string;
    reason?: string;
}

export class PawaPayAdapter implements IPaymentProvider {
    readonly name = 'PawaPay';
    private config: PawaPayConfig;
    private baseUrl: string;

    constructor(config: PawaPayConfig) {
        this.config = config;
        this.baseUrl = config.mode === 'live'
            ? 'https://api.pawapay.io'
            : 'https://api.sandbox.pawapay.io';
    }

    /**
     * Initiate a deposit with PawaPay
     */
    async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
        try {
            // PawaPay requires a UUID for depositId. We use the orderId if it's a UUID, 
            // or we could generate one. To ensure idempotency and reconciliation, 
            // the depositId should be unique and stored.
            // For the sake of this implementation, we assume metadata might contain a depositId,
            // otherwise we'd need a way to generate/store it.
            const depositId = request.metadata?.depositId || crypto.randomUUID();

            // PawaPay requires a specific provider code (e.g. MTN_MOMO_BEN, ORANGE_CIV)
            // We map this from metadata or default to a common one if missing.
            const provider = request.metadata?.provider || 'MTN_MOMO_CIV'; // Default for demo

            const body = {
                depositId: depositId,
                amount: request.amount.toString(),
                currency: request.currency,
                payer: {
                    type: "MMO",
                    accountDetails: {
                        phoneNumber: request.customerPhone?.replace('+', '') || '',
                        provider: provider
                    }
                },
                clientReferenceId: request.orderId,
                customerMessage: `Paiement ${request.orderId}`,
                metadata: [
                    { name: request.customerName },
                    { email: request.customerEmail }
                ]
            };

            const response = await fetch(`${this.baseUrl}/v2/deposits`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.apiKey}`
                },
                body: JSON.stringify(body)
            });

            const data: PawaPayDepositResponse = await response.json();

            if (!response.ok) {
                return {
                    transactionId: depositId,
                    providerReference: depositId,
                    status: 'FAILED',
                    rawData: data
                };
            }

            return {
                transactionId: depositId,
                providerReference: depositId,
                status: this.mapStatus(data.status),
                rawData: data
            };
        } catch (error: any) {
            return {
                transactionId: '',
                providerReference: '',
                status: 'FAILED',
                rawData: { error: error.message }
            };
        }
    }

    /**
     * Verify payment status by polling
     */
    async verifyPayment(providerReference: string): Promise<PaymentResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/v2/deposits/${providerReference}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.config.apiKey}`
                }
            });

            if (!response.ok) {
                throw new Error(`PawaPay API error: ${response.statusText}`);
            }

            const data = await response.json();
            // PawaPay returns an array of status objects for GET /v2/deposits/{id}
            const statusData = Array.isArray(data) ? data[0] : data;

            return {
                transactionId: providerReference,
                providerReference: providerReference,
                status: this.mapStatus(statusData.status),
                rawData: statusData
            };
        } catch (error: any) {
            return {
                transactionId: providerReference,
                providerReference: providerReference,
                status: 'FAILED',
                rawData: { error: error.message }
            };
        }
    }

    /**
     * Handle PawaPay webhooks
     */
    async handleWebhook(payload: any, headers?: any): Promise<WebhookResult> {
        // PawaPay webhooks are typically JSON POSTs
        const depositId = payload.depositId;
        const status = this.mapStatus(payload.status);

        return {
            transactionId: depositId,
            providerReference: depositId,
            status: status,
            rawData: payload
        };
    }

    private mapStatus(pawapayStatus: string): PaymentStatus {
        switch (pawapayStatus.toUpperCase()) {
            case 'COMPLETED':
                return 'SUCCESS';
            case 'FAILED':
                return 'FAILED';
            case 'CANCELLED':
                return 'CANCELLED';
            case 'ACCEPTED':
            case 'SUBMITTED':
            case 'PENDING':
                return 'PENDING';
            default:
                return 'PENDING';
        }
    }

    /**
     * Validate credentials
     */
    async validateCredentials(): Promise<{ success: boolean; message?: string }> {
        try {
            // We can call the active-configuration endpoint to test the API key
            const response = await fetch(`${this.baseUrl}/v1/active-configuration`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.config.apiKey}`
                }
            });

            if (response.ok) {
                return { success: true };
            }

            const data = await response.json();
            return {
                success: false,
                message: data.message || `Erreur de connexion (Code: ${response.status})`
            };
        } catch (error: any) {
            return { success: false, message: "Impossible de contacter PawaPay." };
        }
    }
}
