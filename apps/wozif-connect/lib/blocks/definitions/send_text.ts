import { MessageSquare } from "lucide-react";
import { BlockConfig } from "../types";

export const SendTextBlock: BlockConfig = {
    type: "send_text",
    name: "Envoyer un message",
    description: "Envoie un message WhatsApp à l'utilisateur",
    category: "messages",
    bgColor: "#25D366",
    icon: MessageSquare,
    subBlocks: [
        {
            id: "message",
            title: "Message",
            type: "long-input",
            placeholder: "Tapez votre message ici...\n\nUtilisez <block.output> pour insérer des données dynamiques",
            rows: 4,
            required: true,
            connectionDroppable: true,
            description: "Support du formatage WhatsApp: *gras*, _italique_, ~barré~",
        },
        {
            id: "parseMode",
            title: "Mode de formatage",
            type: "dropdown",
            options: [
                { label: "Texte simple", id: "plain" },
                { label: "Markdown WhatsApp", id: "whatsapp" },
            ],
            defaultValue: "whatsapp",
            mode: "advanced",
        },
        {
            id: "previewUrl",
            title: "Aperçu des liens",
            type: "switch",
            defaultValue: true,
            mode: "advanced",
            description: "Afficher un aperçu pour les URLs dans le message",
        },
    ],
    inputs: {
        message: {
            type: 'string',
            description: "Le contenu du message à envoyer",
        },
        recipient: {
            type: 'string',
            description: "Numéro du destinataire (optionnel, utilise le contact courant par défaut)",
        },
    },
    outputs: {
        messageId: {
            type: 'string',
            description: "ID unique du message envoyé",
        },
        status: {
            type: 'string',
            description: "Statut de l'envoi (sent, delivered, read)",
        },
        timestamp: {
            type: 'number',
            description: "Timestamp de l'envoi",
        },
    },
};
