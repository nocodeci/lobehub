import { MessageSquare } from "lucide-react";
import { BlockConfig } from "../types";

export const WhatsAppTriggerBlock: BlockConfig = {
    type: "whatsapp_message",
    name: "WhatsApp Reçu",
    description: "Se déclenche lorsqu'un nouveau message est reçu sur WhatsApp",
    category: "triggers",
    bgColor: "#25D366",
    icon: MessageSquare,
    subBlocks: [
        {
            id: "keyword",
            title: "Mot-clé (Optionnel)",
            type: "short-input",
            placeholder: "Laissez vide pour tous les messages",
        },
    ],
    inputs: {},
    outputs: {
        message: { type: "string", description: "Le texte du message reçu" },
        sender: { type: "string", description: "Le numéro de téléphone de l'expéditeur" },
        sender_name: { type: "string", description: "Le nom de l'expéditeur (si disponible)" },
    },
};
