import { Bot } from "lucide-react";
import { BlockConfig } from "../types";

export const AgentBlock: BlockConfig = {
    type: "ai_agent",
    name: "Agent IA Expert",
    description: "Agent autonome capable d'utiliser des outils et d'accéder à vos documents",
    longDescription: `L'Agent IA est un bloc central qui encapsule un LLM. Il prend des prompts système/utilisateur et appelle un provider IA. Il peut aussi utiliser des outils et retourner des réponses structurées.`,
    category: "ai",
    bgColor: "#10a37f",
    icon: Bot,
    subBlocks: [
        // Messages d'entrée
        {
            id: "messages",
            title: "Messages",
            type: "messages-input",
            placeholder: "Ajoutez des messages (system, user, assistant)...",
            description: "Messages de conversation pour le LLM",
            connectionDroppable: true,
        },
        // Modèle IA
        {
            id: "model",
            title: "Modèle",
            type: "ai-model-selector",
            defaultValue: "gpt-4o-mini",
            required: true,
        },
        // Instructions système
        {
            id: "instructions",
            title: "Instructions (System Prompt)",
            type: "long-input",
            placeholder: "Tu es un assistant de vente expert en...",
            rows: 6,
            connectionDroppable: true,
            description: "Instructions pour guider le comportement de l'IA",
        },
        // Clé API (conditionnelle)
        {
            id: "apiKey",
            title: "Clé API",
            type: "short-input",
            placeholder: "Entrez votre clé API (sk-...)",
            password: true,
            mode: "advanced",
            connectionDroppable: false,
            condition: {
                field: "model",
                value: ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo", "claude-3-5-sonnet", "claude-3-opus"],
                not: false, // Afficher pour ces modèles
            },
        },
        // Temperature
        {
            id: "temperature",
            title: "Température",
            type: "slider",
            min: 0,
            max: 2,
            step: 0.1,
            defaultValue: 0.7,
            mode: "advanced",
            description: "Contrôle la créativité des réponses (0 = déterministe, 2 = créatif)",
        },
        // Format de réponse
        {
            id: "responseFormat",
            title: "Format de réponse",
            type: "response-format",
            placeholder: "JSON Schema pour structurer la réponse...",
            mode: "advanced",
            description: "Définissez un schéma JSON pour obtenir des réponses structurées",
        },
        // Outils disponibles
        {
            id: "tools",
            title: "Outils",
            type: "tool-input",
            defaultValue: [],
            mode: "advanced",
            description: "Ajoutez des outils que l'agent peut utiliser",
        },
        // Mémoire de conversation
        {
            id: "memoryType",
            title: "Type de mémoire",
            type: "dropdown",
            options: [
                { label: "Aucune", id: "none" },
                { label: "Conversation complète", id: "conversation" },
                { label: "Fenêtre glissante (messages)", id: "sliding_window" },
                { label: "Fenêtre glissante (tokens)", id: "sliding_window_tokens" },
            ],
            defaultValue: "none",
            mode: "advanced",
        },
        // ID de conversation (conditionnel)
        {
            id: "conversationId",
            title: "ID de conversation",
            type: "short-input",
            placeholder: "Ex: user-123, session-abc",
            connectionDroppable: true,
            condition: {
                field: "memoryType",
                value: ["conversation", "sliding_window", "sliding_window_tokens"],
            },
        },
        // Taille de la fenêtre (conditionnel)
        {
            id: "slidingWindowSize",
            title: "Taille de la fenêtre",
            type: "number-input",
            placeholder: "10",
            defaultValue: 10,
            condition: {
                field: "memoryType",
                value: ["sliding_window"],
            },
        },
    ],
    inputs: {
        messages: {
            type: 'json',
            description: "Messages de conversation [{role, content}]",
        },
        user_message: {
            type: 'string',
            description: "Message de l'utilisateur (alternative à messages)",
        },
        context: {
            type: 'json',
            description: "Contexte additionnel (documents, données)",
        },
    },
    outputs: {
        response: {
            type: 'string',
            description: "La réponse générée par l'IA",
        },
        thought: {
            type: 'string',
            description: "Le raisonnement interne de l'agent",
        },
        model: {
            type: 'string',
            description: "Le modèle utilisé",
        },
        tokens: {
            type: 'json',
            description: "Statistiques d'utilisation des tokens",
        },
        toolCalls: {
            type: 'json',
            description: "Appels d'outils effectués par l'agent",
        },
    },
};
