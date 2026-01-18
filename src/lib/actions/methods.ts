"use server";

import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getSelectedAppId } from "./utils";

// Comprehensive mapping of what each provider supports
// Using official logos from the PayDunya catalog
const PROVIDER_METHODS: Record<string, any[]> = {
    'paydunya': [
        // Sénégal
        { name: "Orange Money Sénégal", country: "Sénégal", flag: "🇸🇳", type: "MOBILE_MONEY", code: "orange-money-senegal", logo: "https://paydunya.com/refont/images/icon_pydu/partners/om.png" },
        { name: "Wave Sénégal", country: "Sénégal", flag: "🇸🇳", type: "MOBILE_MONEY", code: "wave-senegal", logo: "https://paydunya.com/refont/images/icon_pydu/partners/wave.png" },
        { name: "Free Money Sénégal", country: "Sénégal", flag: "🇸🇳", type: "MOBILE_MONEY", code: "free-money-senegal", logo: "https://paydunya.com/refont/images/icon_pydu/partners/free.png" },
        { name: "Wizall Money Sénégal", country: "Sénégal", flag: "🇸🇳", type: "MOBILE_MONEY", code: "wizall-senegal", logo: "https://paydunya.com/refont/images/icon_pydu/partners/wizall.png" },
        { name: "Expresso Sénégal", country: "Sénégal", flag: "🇸🇳", type: "MOBILE_MONEY", code: "expresso-sn", logo: "https://paydunya.com/refont/images/icon_pydu/partners/expresso.png" },

        // Côte d'Ivoire
        { name: "Orange Money CI", country: "Côte d'Ivoire", flag: "🇨🇮", type: "MOBILE_MONEY", code: "orange-money-ci", logo: "https://paydunya.com/refont/images/icon_pydu/partners/om.png" },
        { name: "Wave CI", country: "Côte d'Ivoire", flag: "🇨🇮", type: "MOBILE_MONEY", code: "wave-ci", logo: "https://paydunya.com/refont/images/icon_pydu/partners/wave.png" },
        { name: "MTN CI", country: "Côte d'Ivoire", flag: "🇨🇮", type: "MOBILE_MONEY", code: "mtn-ci", logo: "https://paydunya.com/refont/images/icon_pydu/partners/mtn.png" },
        { name: "Moov CI", country: "Côte d'Ivoire", flag: "🇨🇮", type: "MOBILE_MONEY", code: "moov-ci", logo: "https://paydunya.com/refont/images/icon_pydu/partners/moov.png" },

        // Bénin
        { name: "MTN Bénin", country: "Bénin", flag: "🇧🇯", type: "MOBILE_MONEY", code: "mtn-benin", logo: "https://paydunya.com/refont/images/icon_pydu/partners/mtn.png" },
        { name: "Moov Bénin", country: "Bénin", flag: "🇧🇯", type: "MOBILE_MONEY", code: "moov-benin", logo: "https://paydunya.com/refont/images/icon_pydu/partners/moov.png" },

        // Mali
        { name: "Orange Money Mali", country: "Mali", flag: "🇲🇱", type: "MOBILE_MONEY", code: "orange-money-mali", logo: "https://paydunya.com/refont/images/icon_pydu/partners/om.png" },
        { name: "Moov Mali", country: "Mali", flag: "🇲🇱", type: "MOBILE_MONEY", code: "moov-ml", logo: "https://paydunya.com/refont/images/icon_pydu/partners/moov.png" },

        // Togo
        { name: "T-Money Togo", country: "Togo", flag: "🇹🇬", type: "MOBILE_MONEY", code: "t-money-togo", logo: "https://paydunya.com/refont/images/icon_pydu/partners/tmoney.png" },
        { name: "Moov Togo", country: "Togo", flag: "🇹🇬", type: "MOBILE_MONEY", code: "moov-togo", logo: "https://paydunya.com/refont/images/icon_pydu/partners/moov.png" },

        // Burkina Faso
        { name: "Orange Money Burkina", country: "Burkina Faso", flag: "🇧🇫", type: "MOBILE_MONEY", code: "orange-money-burkina", logo: "https://paydunya.com/refont/images/icon_pydu/partners/om.png" },
        { name: "Moov Burkina", country: "Burkina Faso", flag: "🇧🇫", type: "MOBILE_MONEY", code: "moov-burkina-faso", logo: "https://paydunya.com/refont/images/icon_pydu/partners/moov.png" },

        // Cartes
        { name: "Visa International", country: "UEMOA", flag: "🌍", type: "CARD", code: "card", logo: "https://paydunya.com/refont/images/icon_pydu/partners/visa.png" },
        { name: "MasterCard", country: "UEMOA", flag: "🌍", type: "CARD", code: "mastercard", logo: "https://paydunya.com/refont/images/icon_pydu/partners/mastercard.png" },
    ],
    'fedapay': [
        { name: "MTN MoMo Benin", country: "Bénin", flag: "🇧🇯", type: "MOBILE_MONEY", code: "mtn-benin", logo: "https://paydunya.com/refont/images/icon_pydu/partners/mtn.png" },
        { name: "MOOV Money Benin", country: "Bénin", flag: "🇧🇯", type: "MOBILE_MONEY", code: "moov-benin", logo: "https://paydunya.com/refont/images/icon_pydu/partners/moov.png" },
        { name: "Celtiis Benin", country: "Bénin", flag: "🇧🇯", type: "MOBILE_MONEY", code: "celtiis-benin", logo: "https://celtiis.bj/wp-content/uploads/2022/10/celtiis-logo-1.png" },
        { name: "Airtel Niger", country: "Niger", flag: "🇳🇪", type: "MOBILE_MONEY", code: "airtel-niger", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Airtel_logo_2011.svg/1200px-Airtel_logo_2011.svg.png" },
    ],
    'pawapay': [
        { name: "Orange Money CI", country: "Côte d'Ivoire", flag: "🇨🇮", type: "MOBILE_MONEY", code: "orange-money-ci", logo: "https://paydunya.com/refont/images/icon_pydu/partners/om.png" },
        { name: "MTN MoMo CI", country: "Côte d'Ivoire", flag: "🇨🇮", type: "MOBILE_MONEY", code: "mtn-ci", logo: "https://paydunya.com/refont/images/icon_pydu/partners/mtn.png" },
        { name: "Wave CI", country: "Côte d'Ivoire", flag: "🇨🇮", type: "MOBILE_MONEY", code: "wave-ci", logo: "https://paydunya.com/refont/images/icon_pydu/partners/wave.png" },
        { name: "MTN MoMo Congo", country: "Congo", flag: "🇨🇬", type: "MOBILE_MONEY", code: "mtn-congo", logo: "https://paydunya.com/refont/images/icon_pydu/partners/mtn.png" },
        { name: "Vodacom Mozambique", country: "Mozambique", flag: "🇲🇿", type: "MOBILE_MONEY", code: "vodacom-moz", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Vodacom_Logo.svg/1200px-Vodacom_Logo.svg.png" },
        { name: "Airtel Money Nigeria", country: "Nigeria", flag: "🇳🇬", type: "MOBILE_MONEY", code: "airtel-nigeria", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Airtel_logo_2011.svg/1200px-Airtel_logo_2011.svg.png" },
        { name: "M-Pesa Kenya", country: "Kenya", flag: "🇰🇪", type: "MOBILE_MONEY", code: "mpesa-kenya", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/M-Pesa_logo.svg/1200px-M-Pesa_logo.svg.png" },
        { name: "Airtel Money Kenya", country: "Kenya", flag: "🇰🇪", type: "MOBILE_MONEY", code: "airtel-kenya", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Airtel_logo_2011.svg/1200px-Airtel_logo_2011.svg.png" },
        { name: "MTN Ghana", country: "Ghana", flag: "🇬🇭", type: "MOBILE_MONEY", code: "mtn-ghana", logo: "https://paydunya.com/refont/images/icon_pydu/partners/mtn.png" },
        { name: "Vodafone Cash Ghana", country: "Ghana", flag: "🇬🇭", type: "MOBILE_MONEY", code: "vodafone-ghana", logo: "https://companieslogo.com/img/orig/VOD-e9803328.png" },
        { name: "AirtelTigo Ghana", country: "Ghana", flag: "🇬🇭", type: "MOBILE_MONEY", code: "airteltigo-ghana", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Airtel_logo_2011.svg/1200px-Airtel_logo_2011.svg.png" },
        { name: "Airtel Money Tanzania", country: "Tanzania", flag: "🇹🇿", type: "MOBILE_MONEY", code: "airtel-tanzania", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Airtel_logo_2011.svg/1200px-Airtel_logo_2011.svg.png" },
        { name: "Tigo Pesa Tanzania", country: "Tanzania", flag: "🇹🇿", type: "MOBILE_MONEY", code: "tigo-tanzania", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Tigo_Logo.svg/1200px-Tigo_Logo.svg.png" },
        { name: "M-Pesa Tanzania", country: "Tanzania", flag: "🇹🇿", type: "MOBILE_MONEY", code: "mpesa-tanzania", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/M-Pesa_logo.svg/1200px-M-Pesa_logo.svg.png" },
        { name: "MTN Uganda", country: "Uganda", flag: "🇺🇬", type: "MOBILE_MONEY", code: "mtn-uganda", logo: "https://paydunya.com/refont/images/icon_pydu/partners/mtn.png" },
        { name: "Airtel Money Uganda", country: "Uganda", flag: "🇺🇬", type: "MOBILE_MONEY", code: "airtel-uganda", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Airtel_logo_2011.svg/1200px-Airtel_logo_2011.svg.png" },
        { name: "MTN Zambia", country: "Zambia", flag: "🇿🇲", type: "MOBILE_MONEY", code: "mtn-zambia", logo: "https://paydunya.com/refont/images/icon_pydu/partners/mtn.png" },
        { name: "Airtel Money Zambia", country: "Zambia", flag: "🇿🇲", type: "MOBILE_MONEY", code: "airtel-zambia", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Airtel_logo_2011.svg/1200px-Airtel_logo_2011.svg.png" },
        { name: "MTN Cameroon", country: "Cameroun", flag: "🇨🇲", type: "MOBILE_MONEY", code: "mtn-cameroon", logo: "https://paydunya.com/refont/images/icon_pydu/partners/mtn.png" },
        { name: "Orange Money Cameroon", country: "Cameroun", flag: "🇨🇲", type: "MOBILE_MONEY", code: "orange-money-cameroon", logo: "https://paydunya.com/refont/images/icon_pydu/partners/om.png" },
    ]
};

export async function getPaymentMethods() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const appId = await getSelectedAppId();
        if (!appId) return [];

        // 1. Get user's active gateways for this app
        const gateways = await prisma.gateway.findMany({
            where: { applicationId: appId, status: "active" }
        });

        if (gateways.length === 0) return [];

        // 2. Derive methods from gateways
        let allAvailableMethods: any[] = [];

        for (const gateway of gateways) {
            const name = gateway.name.toLowerCase();
            // Robust matching: find if any provider key is contained in the gateway name
            const providerKey = Object.keys(PROVIDER_METHODS).find(k => name.includes(k));

            const supported = providerKey ? PROVIDER_METHODS[providerKey] : [];

            supported.forEach(method => {
                allAvailableMethods.push({
                    ...method,
                    gatewayId: gateway.id,
                    provider: gateway.name,
                });
            });
        }

        // 3. Return a unique list based on name and country if multiple gateways support the same method
        // But for now, let's keep all and append the provider name to the method unique ID
        return allAvailableMethods.map((m, index) => ({
            id: `${m.gatewayId}-${m.code}-${index}`,
            name: m.name,
            gateway: m.provider,
            logo: m.logo,
            status: "Opérationnel",
            type: m.type === "CARD" ? "Card" : "Mobile Money",
            country: m.country,
            flag: m.flag,
            uptime: "99.9%",
            isActive: true
        }));

    } catch (error) {
        console.error("Failed to fetch payment methods:", error);
        return [];
    }
}

export async function togglePaymentMethod(methodId: string, isActive: boolean) {
    return { success: true };
}
export async function getPaymentMethodsByAppId(applicationId: string) {
    try {
        const gateways = await prisma.gateway.findMany({
            where: { applicationId, status: "active" }
        });

        if (gateways.length === 0) return [];

        let allAvailableMethods: any[] = [];

        for (const gateway of gateways) {
            const name = gateway.name.toLowerCase();
            const providerKey = Object.keys(PROVIDER_METHODS).find(k => name.includes(k));
            const supported = providerKey ? PROVIDER_METHODS[providerKey] : [];

            supported.forEach(method => {
                allAvailableMethods.push({
                    ...method,
                    gatewayId: gateway.id,
                    provider: gateway.name,
                    config: gateway.config
                });
            });
        }

        return allAvailableMethods.map((m, index) => ({
            id: `${m.gatewayId}-${m.code}-${index}`,
            name: m.name,
            gateway: m.provider,
            gatewayId: m.gatewayId,
            logo: m.logo,
            type: m.type,
            country: m.country,
            flag: m.flag,
            code: m.code,
            config: m.config
        }));

    } catch (error) {
        console.error("Failed to fetch payment methods:", error);
        return [];
    }
}
