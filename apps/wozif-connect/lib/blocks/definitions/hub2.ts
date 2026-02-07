import { CreditCard } from "lucide-react";
import { BlockConfig } from "../types";

export const Hub2BalanceBlock: BlockConfig = {
    type: "hub2_balance",
    name: "Solde Hub2",
    description: "Vérifie votre solde en temps réel sur la plateforme Hub2",
    category: "tools",
    bgColor: "#ef4444", // Hub2 branding is often red/dark
    icon: CreditCard,
    subBlocks: [
        {
            id: "apiKey",
            title: "API Key",
            type: "short-input",
            placeholder: "H2_PK_...",
            defaultValue: "",
        },
        {
            id: "merchantId",
            title: "Merchant ID",
            type: "short-input",
            placeholder: "votre-id-marchand",
            defaultValue: "",
        },
        {
            id: "environment",
            title: "Environnement",
            type: "dropdown",
            defaultValue: "sandbox",
            options: [
                { label: "Tests (Sandbox)", id: "sandbox" },
                { label: "Production (Live)", id: "live" },
            ],
        },
        {
            id: "currency",
            title: "Devise",
            type: "dropdown",
            defaultValue: "XOF",
            options: [
                { label: "FCFA (XOF)", id: "XOF" },
                { label: "Euro (EUR)", id: "EUR" },
                { label: "Dollar (USD)", id: "USD" },
            ],
        },
    ],
    inputs: {},
    outputs: {
        balance: { type: "number", description: "Le montant disponible du solde" },
        currency: { type: "string", description: "La devise du solde" },
        lastUpdate: { type: "string", description: "Dernière mise à jour du solde" },
    },
};
