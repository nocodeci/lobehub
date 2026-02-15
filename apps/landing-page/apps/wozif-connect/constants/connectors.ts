import {
    Layers,
    ShoppingBag,
    Database,
    Mail,
    Zap,
    MessageSquare,
    Calendar,
    Globe,
    Webhook
} from "lucide-react";
import { Connector, ConnectorCategory } from "../types/connectors";

export const CATEGORIES: ConnectorCategory[] = [
    { id: 'all', name: 'Tous', icon: Layers },
    { id: 'ecommerce', name: 'E-commerce', icon: ShoppingBag },
    { id: 'crm', name: 'CRM & Sales', icon: Database },
    { id: 'marketing', name: 'Marketing', icon: Mail },
    { id: 'tools', name: 'Outils', icon: Zap },
];

export const CONNECTORS: Connector[] = [
    {
        id: "whatsapp-official",
        name: "WhatsApp API",
        description: "Connexion officielle via Meta pour des envois massifs certifiés.",
        status: "connected",
        category: "marketing",
        type: "Direct",
        icon: MessageSquare,
        color: "emerald"
    },
    {
        id: "chariow-store",
        name: "Chariow Store",
        description: "Synchronisez vos produits et commandes automatiquement.",
        status: "connected",
        category: "ecommerce",
        type: "API Key",
        icon: ShoppingBag,
        color: "blue"
    },
    {
        id: "google-calendar",
        name: "Google Calendar",
        description: "Permettez la prise de rendez-vous directe via WhatsApp.",
        status: "disconnected",
        category: "tools",
        type: "OAuth2",
        icon: Calendar,
        color: "purple"
    },
    {
        id: "hubspot-crm",
        name: "HubSpot",
        description: "Synchronisez vos contacts et opportunités en temps réel.",
        status: "disconnected",
        category: "crm",
        type: "OAuth2",
        icon: Database,
        color: "orange"
    },
    {
        id: "shopify",
        name: "Shopify",
        description: "Relances paniers abandonnés et suivis de commandes.",
        status: "available",
        category: "ecommerce",
        type: "App",
        icon: Globe,
        color: "pink"
    },
    {
        id: "custom-webhook",
        name: "Webhooks",
        description: "Connectez n'importe quelle application via des requêtes HTTP.",
        status: "active",
        category: "tools",
        type: "Webhooks",
        icon: Webhook,
        color: "cyan"
    }
];
