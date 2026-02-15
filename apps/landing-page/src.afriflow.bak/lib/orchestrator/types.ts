export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';

export interface PaymentRequest {
    amount: number;
    currency: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    orderId: string;
    metadata?: Record<string, any>;
    callbackUrl: string;
    returnUrl: string;
}

export interface PaymentResponse {
    transactionId: string;
    providerReference: string;
    status: PaymentStatus;
    checkoutUrl?: string; // For redirect-based payments
    rawData?: any;
}

export interface WebhookResult {
    transactionId: string;
    status: PaymentStatus;
    providerReference: string;
    rawData: any;
}

export interface IPaymentProvider {
    readonly name: string;
    initiatePayment(request: PaymentRequest): Promise<PaymentResponse>;
    verifyPayment(providerReference: string): Promise<PaymentResponse>;
    handleWebhook(payload: any, headers?: any): Promise<WebhookResult>;
    validateCredentials?(): Promise<{ success: boolean; message?: string }>;
}
