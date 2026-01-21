import { FedaPay, Transaction } from 'fedapay';
import {
    IPaymentProvider,
    PaymentRequest,
    PaymentResponse,
    PaymentStatus,
    WebhookResult
} from '../types';

/**
 * FedaPay Payment Provider Adapter
 * Documentation: https://docs.fedapay.com/
 * 
 * Supported Countries:
 * - Benin
 * - Togo
 * - Côte d'Ivoire
 * - Senegal
 * - Mali
 * - Burkina Faso
 * 
 * Payment Methods:
 * - Mobile Money (MTN, Moov, Flooz, T-Money, Orange, Wave)
 * - Cards (Visa, MasterCard)
 */

interface FedaPayConfig {
    apiKey: string;
    mode?: 'test' | 'live';
}

export class FedaPayAdapter implements IPaymentProvider {
    readonly name = 'FedaPay';
    private config: FedaPayConfig;

    constructor(config: FedaPayConfig) {
        this.config = config;
        this.initSDK();
    }

    private initSDK() {
        FedaPay.setApiKey(this.config.apiKey);
        FedaPay.setEnvironment(this.config.mode === 'live' ? 'live' : 'sandbox');
    }

    /**
     * Initiate a payment with FedaPay
     */
    async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
        try {
            this.initSDK(); // Ensure context is correct

            const transactionData = {
                description: request.metadata?.description || `Paiement commande ${request.orderId}`,
                amount: request.amount,
                currency: { iso: request.currency || 'XOF' },
                callback_url: request.returnUrl,
                customer: {
                    firstname: request.customerName?.split(' ')[0] || 'Client',
                    lastname: request.customerName?.split(' ')[1] || 'Gnata',
                    email: request.customerEmail,
                    phone_number: {
                        number: request.customerPhone || '',
                        country: 'BJ' // Default or extracted
                    }
                },
                metadata: {
                    orderId: request.orderId,
                    ...request.metadata
                }
            };

            const transaction = await Transaction.create(transactionData);
            const token = await transaction.generateToken();

            return {
                transactionId: transaction.id.toString(),
                providerReference: transaction.reference,
                status: 'PENDING' as PaymentStatus,
                checkoutUrl: token.url,
                rawData: transaction,
            };
        } catch (error: any) {
            console.error('[FedaPay] initiatePayment error:', error);
            return {
                transactionId: '',
                providerReference: '',
                status: 'FAILED' as PaymentStatus,
                rawData: { error: error.message },
            };
        }
    }

    /**
     * Verify payment status
     */
    async verifyPayment(providerReference: string): Promise<PaymentResponse> {
        try {
            this.initSDK();
            // providerReference should be the FedaPay transaction ID
            const transaction = await Transaction.retrieve(providerReference);

            return {
                transactionId: transaction.id.toString(),
                providerReference: transaction.reference,
                status: this.mapStatus(transaction.status),
                rawData: transaction,
            };
        } catch (error: any) {
            return {
                transactionId: providerReference,
                providerReference,
                status: 'FAILED' as PaymentStatus,
                rawData: { error: error.message },
            };
        }
    }

    /**
     * Handle FedaPay webhook
     */
    async handleWebhook(payload: any, headers?: any): Promise<WebhookResult> {
        try {
            // FedaPay webhooks contain the transaction object
            const entity = payload.entity || payload;
            const status = this.mapStatus(entity.status);

            return {
                transactionId: entity.id?.toString(),
                providerReference: entity.reference,
                status,
                rawData: payload,
            };
        } catch (error: any) {
            return {
                transactionId: '',
                providerReference: '',
                status: 'FAILED' as PaymentStatus,
                rawData: { error: error.message },
            };
        }
    }

    /**
     * Map FedaPay status to internal PaymentStatus
     */
    private mapStatus(status: string): PaymentStatus {
        switch (status.toLowerCase()) {
            case 'approved':
            case 'transferred':
            case 'captured':
                return 'SUCCESS';
            case 'canceled':
                return 'CANCELLED';
            case 'declined':
            case 'failed':
                return 'FAILED';
            case 'pending':
                return 'PENDING';
            default:
                return 'PENDING';
        }
    }

    /**
     * Validate credentials by retrieving account info
     */
    async validateCredentials(): Promise<{ success: boolean; message?: string }> {
        try {
            this.initSDK();
            // A simple list will check if API key is valid
            await Transaction.all({ per_page: 1 });
            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                message: error.message || 'Clé API FedaPay invalide'
            };
        }
    }
}
