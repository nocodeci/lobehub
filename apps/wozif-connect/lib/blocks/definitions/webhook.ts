import { Globe } from "lucide-react";
import { BlockConfig } from "../types";

export const WebhookBlock: BlockConfig = {
    type: "webhook",
    name: "Appel Webhook",
    description: "Envoie une requête HTTP à un service externe",
    category: "tools",
    bgColor: "#3b82f6",
    icon: Globe,
    subBlocks: [
        {
            id: "url",
            title: "URL du Webhook",
            type: "short-input",
            placeholder: "https://api.monservice.com/webhook",
        },
        {
            id: "method",
            title: "Méthode",
            type: "dropdown",
            defaultValue: "POST",
            options: [
                { label: "GET", id: "GET" },
                { label: "POST", id: "POST" },
                { label: "PUT", id: "PUT" },
                { label: "DELETE", id: "DELETE" },
            ],
        },
        {
            id: "headers",
            title: "Headers (JSON)",
            type: "code",
            defaultValue: "{}",
        },
        {
            id: "body",
            title: "Corps de la requête (JSON)",
            type: "code",
            defaultValue: "{}",
        },
    ],
    inputs: {},
    outputs: {
        response: { type: "json", description: "La réponse brute de l'API" },
        status: { type: "number", description: "Le code de statut HTTP (ex: 200)" },
    },
};
