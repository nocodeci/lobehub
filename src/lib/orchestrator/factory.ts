import { IPaymentProvider } from "./types";
import { MockProviderAdapter } from "./adapters/mock.adapter";
import { PayDunyaAdapter } from "./adapters/paydunya.adapter";
import { PawaPayAdapter } from "./adapters/pawapay.adapter";

/**
 * Payment Orchestrator Factory
 * Dynamically creates payment provider instances with configuration
 */
export class PaymentOrchestratorFactory {
    /**
     * Get a payment provider instance by name
     * @param name - Provider name (mock, paydunya, etc.)
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

            default:
                throw new Error(`Provider ${name} not found in orchestrator`);
        }
    }

    /**
     * List all available provider names
     */
    static listProviders(): string[] {
        return ['mock', 'paydunya', 'pawapay'];
    }
}
