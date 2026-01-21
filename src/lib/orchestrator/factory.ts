import { IPaymentProvider } from "./types";
import { MockProviderAdapter } from "./adapters/mock.adapter";
import { PayDunyaAdapter } from "./adapters/paydunya.adapter";
import { PawaPayAdapter } from "./adapters/pawapay.adapter";
import { FlutterwaveAdapter } from "./adapters/flutterwave.adapter";
import { FeexPayAdapter } from "./adapters/feexpay.adapter";
import { PaystackAdapter } from "./adapters/paystack.adapter";
import { CinetPayAdapter } from "./adapters/cinetpay.adapter";
import { StripeAdapter } from "./adapters/stripe.adapter";
import { KkiapayAdapter } from "./adapters/kkiapay.adapter";
import { CoinbaseAdapter } from "./adapters/coinbase.adapter";
import { FedaPayAdapter } from "./adapters/fedapay.adapter";

/**
 * Payment Orchestrator Factory
 * Dynamically creates payment provider instances with configuration
 */
export class PaymentOrchestratorFactory {
    /**
     * Get a payment provider instance by name
     * @param name - Provider name (mock, paydunya, flutterwave, feexpay, paystack, cinetpay, stripe, kkiapay, coinbase, fedapay, etc.)
     * @param config - Optional configuration object for the provider
     */
    static getProvider(name: string, config?: any): IPaymentProvider {
        const providerName = name.toLowerCase();

        switch (providerName) {
            case 'mock':
                return new MockProviderAdapter();

            case 'paydunya':
                if (!config) {
                    throw new Error('PayDunya requires configuration: { masterKey, privateKey, publicKey, token, mode }');
                }
                return new PayDunyaAdapter(config);

            case 'pawapay':
                if (!config) {
                    throw new Error('PawaPay requires configuration: { apiKey, mode }');
                }
                return new PawaPayAdapter(config);

            case 'flutterwave':
                if (!config) {
                    throw new Error('Flutterwave requires configuration: { publicKey, secretKey, mode }');
                }
                return new FlutterwaveAdapter(config);

            case 'feexpay':
                if (!config) {
                    throw new Error('FeexPay requires configuration: { shopId, apiKey, mode }');
                }
                return new FeexPayAdapter(config);

            case 'paystack':
                if (!config) {
                    throw new Error('Paystack requires configuration: { publicKey, secretKey, mode }');
                }
                return new PaystackAdapter(config);

            case 'cinetpay':
                if (!config) {
                    throw new Error('CinetPay requires configuration: { apiKey, siteId, mode }');
                }
                return new CinetPayAdapter(config);

            case 'stripe':
                if (!config) {
                    throw new Error('Stripe requires configuration: { secretKey, mode }');
                }
                return new StripeAdapter(config);

            case 'kkiapay':
                if (!config) {
                    throw new Error('Kkiapay requires configuration: { publicKey, privateKey, secret, mode }');
                }
                return new KkiapayAdapter(config);

            case 'coinbase':
                if (!config) {
                    throw new Error('Coinbase requires configuration: { apiKey, webhookSecret, mode }');
                }
                return new CoinbaseAdapter(config);

            case 'fedapay':
                if (!config) {
                    throw new Error('FedaPay requires configuration: { apiKey, mode }');
                }
                return new FedaPayAdapter(config);

            default:
                throw new Error(`Provider ${name} not found in orchestrator`);
        }
    }

    /**
     * List all available provider names
     */
    static listProviders(): string[] {
        return ['mock', 'paydunya', 'pawapay', 'flutterwave', 'feexpay', 'paystack', 'cinetpay', 'stripe', 'kkiapay', 'coinbase', 'fedapay'];
    }

    /**
     * Get provider info for UI display
     */
    static getProviderInfo(): Array<{ id: string; name: string; logo: string; countries: string[]; description: string }> {
        return [
            {
                id: 'paydunya',
                name: 'PayDunya',
                logo: 'https://assets.cdn.moneroo.io/icons/circle/paydunya.svg',
                countries: ['SN', 'CI', 'BJ', 'TG', 'ML', 'BF'],
                description: 'Mobile Money & Cards en Afrique de l\'Ouest'
            },
            {
                id: 'paystack',
                name: 'Paystack',
                logo: 'https://assets.cdn.moneroo.io/icons/circle/paystack.svg',
                countries: ['NG', 'GH', 'ZA', 'KE'],
                description: 'Le leader des paiements au Nigeria et Afrique anglophone'
            },
            {
                id: 'stripe',
                name: 'Stripe',
                logo: 'https://assets.cdn.moneroo.io/icons/circle/stripe.svg',
                countries: ['US', 'CA', 'FR', 'UK', 'DE', 'Global'],
                description: 'La référence mondiale du paiement par carte bancaire'
            },
            {
                id: 'fedapay',
                name: 'FedaPay',
                logo: 'https://assets.cdn.moneroo.io/icons/circle/fedapay.svg',
                countries: ['BJ', 'TG', 'CI', 'SN', 'ML', 'BF'],
                description: 'Paiements simplifiés au Bénin et en Afrique Francophone'
            },
            {
                id: 'coinbase',
                name: 'Coinbase',
                logo: 'https://assets.cdn.moneroo.io/icons/circle/coinbase_commerce.svg',
                countries: ['Global'],
                description: 'Acceptez les crypto-monnaies (BTC, ETH, USDC, etc.)'
            },
            {
                id: 'kkiapay',
                name: 'Kkiapay',
                logo: 'https://assets.cdn.moneroo.io/icons/circle/kkiapay.svg',
                countries: ['BJ', 'TG', 'CI'],
                description: 'Paiements simplifiés au Bénin et Togo'
            },
            {
                id: 'flutterwave',
                name: 'Flutterwave',
                logo: 'https://assets.cdn.moneroo.io/icons/circle/flutterwave.svg',
                countries: ['NG', 'GH', 'KE', 'UG', 'TZ', 'RW', 'ZA', 'ZM', 'CI', 'SN', 'CM'],
                description: 'Paiements dans 40+ pays africains'
            },
            {
                id: 'cinetpay',
                name: 'CinetPay',
                logo: 'https://assets.cdn.moneroo.io/icons/circle/cinetpay.svg',
                countries: ['CI', 'SN', 'ML', 'TG', 'BJ', 'BF', 'CM', 'CD'],
                description: 'L\'acteur historique du paiement en Afrique Francophone'
            },
            {
                id: 'feexpay',
                name: 'FeexPay',
                logo: 'https://assets.cdn.moneroo.io/icons/circle/feexpay.svg',
                countries: ['BJ', 'TG', 'CI', 'SN', 'CG'],
                description: 'Mobile Money & Cards au Bénin et Afrique de l\'Ouest'
            },
            {
                id: 'pawapay',
                name: 'PawaPay',
                logo: 'https://assets.cdn.moneroo.io/icons/circle/pawapay.svg',
                countries: ['KE', 'UG', 'TZ', 'RW', 'ZM', 'GH', 'CI', 'SN', 'CM'],
                description: 'Mobile Money spécialisé'
            },
        ];
    }

}






