import {
    IPaymentProvider,
    PaymentRequest,
    PaymentResponse,
    PaymentStatus,
    WebhookResult
} from '../types';

/**
 * FeexPay Payment Provider Adapter
 * Documentation: https://docs.feexpay.me/
 * 
 * Supported Payment Methods:
 * - Mobile Money (MTN, Moov)
 * - Bank Cards (Visa, MasterCard)
 * - E-Wallets
 * 
 * Primary Countries:
 * - Benin (Main)
 * - Togo
 * - Côte d'Ivoire
 * - Senegal
 * - Congo
 * 
 * Currency: XOF (FCFA)
 */

interface FeexPayConfig {
    shopId: string;      // ID de la boutique
    apiKey: string;      // Token API (fp_...)
    mode: 'SANDBOX' | 'LIVE';
}

interface FeexPayTransactionResponse {
    financialTransactionId?: string;
    externalId?: string;
    amount?: string;
    currency?: string;
    payer?: {
        partyIdType?: string;
        partyId?: string;
    };
    payerMessage?: string;
    payeeNote?: string;
    status?: 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'IN PENDING STATE';
    reason?: string;
}

interface FeexPayLinkResponse {
    success?: boolean;
    message?: string;
    link?: string;
    reference?: string;
}

export class FeexPayAdapter implements IPaymentProvider {
    readonly name = 'FeexPay';
    private config: FeexPayConfig;
    private baseUrl = 'https://api.feexpay.me';

    constructor(config: FeexPayConfig) {
        this.config = config;
    }

    /**
     * Generate a unique custom ID
     */
    private generateCustomId(orderId: string): string {
        return `FEEX_${orderId}_${Date.now()}`;
    }

    /**
     * Initiate a payment with FeexPay using FeexLink API
     * Creates a payment link that can be shared with the customer
     */
    async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
        try {
            const customId = this.generateCustomId(request.orderId);

            const payload = {
                shopId: this.config.shopId,
                amount: request.amount,
                currency: request.currency || 'XOF',
                description: `Payment for order ${request.orderId}`,
                callback_url: request.returnUrl,
                error_callback_url: request.callbackUrl + '?status=failed',
                paymentMethod: 'ALL', // MOBILE, CARD, or ALL
                custom_id: customId,
                customerEmail: request.customerEmail,
                customerName: request.customerName,
                customerPhone: request.customerPhone,
                metadata: request.metadata,
            };

            const response = await fetch(`${this.baseUrl}/api/feexlink/api-create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.apiKey}`,
                },
                body: JSON.stringify(payload),
            });

            const data: FeexPayLinkResponse = await response.json();

            if (!data.success || !data.link) {
                return {
                    transactionId: customId,
                    providerReference: '',
                    status: 'FAILED' as PaymentStatus,
                    rawData: data,
                };
            }

            return {
                transactionId: customId,
                providerReference: data.reference || customId,
                status: 'PENDING' as PaymentStatus,
                checkoutUrl: data.link,
                rawData: data,
            };
        } catch (error: any) {
            console.error('[FeexPay] initiatePayment error:', error);
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
            const response = await fetch(
                `${this.baseUrl}/api/transactions/public/single/status/${providerReference}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.config.apiKey}`,
                    },
                }
            );

            const data: FeexPayTransactionResponse = await response.json();

            let status: PaymentStatus = 'PENDING';
            const txStatus = data.status?.toUpperCase();

            if (txStatus === 'SUCCESSFUL') {
                status = 'SUCCESS';
            } else if (txStatus === 'FAILED') {
                status = 'FAILED';
            } else if (txStatus === 'PENDING' || txStatus === 'IN PENDING STATE') {
                status = 'PENDING';
            }

            return {
                transactionId: data.externalId || providerReference,
                providerReference: data.financialTransactionId || providerReference,
                status,
                rawData: data,
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
     * Process FeexPay webhook
     * Webhook payload structure:
     * {
     *   reference: string,
     *   order_id: string,
     *   status: 'SUCCESSFUL' | 'FAILED',
     *   amount: number,
     *   callback_info: string,
     *   last_name: string,
     *   first_name: string,
     *   email: string,
     *   type: string,
     *   phoneNumber: number,
     *   date: string,
     *   reseau: 'MTN' | 'MOOV',
     *   ref_link: string,
     *   description: string,
     *   reason?: string
     * }
     */
    async handleWebhook(payload: any, headers?: any): Promise<WebhookResult> {
        try {
            const data = payload;

            let status: PaymentStatus = 'PENDING';
            if (data.status === 'SUCCESSFUL') {
                status = 'SUCCESS';
            } else if (data.status === 'FAILED') {
                status = 'FAILED';
            }

            return {
                transactionId: data.order_id || data.reference,
                providerReference: data.reference,
                status,
                rawData: {
                    ...data,
                    customerName: `${data.first_name} ${data.last_name}`.trim(),
                    customerEmail: data.email,
                    customerPhone: data.phoneNumber,
                    network: data.reseau,
                    amount: data.amount,
                    failureReason: data.reason,
                },
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
     * Payout API - Send money to a mobile wallet
     */
    async payout(details: {
        phone: string;
        amount: number;
        network: 'MTN' | 'MOOV';
        country?: string; // BJ, TG, CI, SN, CG
    }): Promise<{ success: boolean; reference?: string; message?: string }> {
        try {
            const response = await fetch(`${this.baseUrl}/api/payouts/public/transfer/global`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.apiKey}`,
                },
                body: JSON.stringify({
                    phone: details.phone,
                    amount: details.amount,
                    network: details.network,
                    country: details.country || 'BJ',
                }),
            });

            const data = await response.json();

            return {
                success: data.success || false,
                reference: data.reference,
                message: data.message,
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.message,
            };
        }
    }

    /**
     * Get supported payment methods for a country
     */
    getSupportedMethods(countryCode: string): string[] {
        const methods: Record<string, string[]> = {
            'BJ': ['MTN Mobile Money', 'Moov Money', 'Visa/MasterCard'],
            'TG': ['T-Money', 'Moov Money', 'Visa/MasterCard'],
            'CI': ['Orange Money', 'MTN Mobile Money', 'Moov Money', 'Wave', 'Visa/MasterCard'],
            'SN': ['Orange Money', 'Free Money', 'Wave', 'Visa/MasterCard'],
            'CG': ['MTN Mobile Money', 'Visa/MasterCard'],
        };
        return methods[countryCode] || ['MTN Mobile Money', 'Moov Money', 'Visa/MasterCard'];
    }

    /**
     * Get supported currencies
     */
    getSupportedCurrencies(): string[] {
        return ['XOF', 'USD', 'CAD']; // USD/CAD for card payments only
    }

    /**
     * Validate credentials by checking API key format
     */
    async validateCredentials(): Promise<{ success: boolean; message?: string }> {
        try {
            // FeexPay API keys start with 'fp_'
            if (!this.config.apiKey.startsWith('fp_')) {
                return {
                    success: false,
                    message: 'La clé API FeexPay doit commencer par "fp_"'
                };
            }

            if (!this.config.shopId || this.config.shopId.length < 10) {
                return {
                    success: false,
                    message: 'L\'identifiant boutique FeexPay est invalide'
                };
            }

            // Try to verify by checking a non-existent transaction
            // This will fail but should return a proper response if credentials are valid
            const response = await fetch(
                `${this.baseUrl}/api/transactions/public/single/status/test-validation-check`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.config.apiKey}`,
                    },
                }
            );

            // If we get 401, credentials are invalid
            if (response.status === 401 || response.status === 403) {
                return {
                    success: false,
                    message: 'Clé API FeexPay invalide ou non autorisée'
                };
            }

            // Any other response means the API key is valid (even 404 for non-existent tx)
            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                message: 'Impossible de contacter FeexPay. Vérifiez votre connexion.'
            };
        }
    }
}
