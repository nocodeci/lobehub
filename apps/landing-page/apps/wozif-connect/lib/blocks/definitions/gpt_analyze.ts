import { Target } from "lucide-react";
import { BlockConfig } from "../types";

export const GPTAnalyzeBlock: BlockConfig = {
    type: "gpt_analyze",
    name: "Analyser intention",
    description: "L'IA comprend ce que veut le client et extrait des données structurées",
    category: "ai",
    bgColor: "#10a37f",
    icon: Target,
    subBlocks: [
        {
            id: "categories",
            title: "Catégories d'intentions (séparées par virgule)",
            type: "short-input",
            placeholder: "achat, support, plainte, question",
        },
        {
            id: "aiInstructions",
            title: "Consignes spécifiques",
            type: "long-input",
            placeholder: "Focalise-toi sur le ton du client...",
        },
    ],
    inputs: {
        text: { type: "string" },
    },
    outputs: {
        intent: { type: "string", description: "L'intention détectée" },
        urgency: { type: "number", description: "Niveau d'urgence (1-5)" },
        sentiment: { type: "string", description: "Sentiment du client" },
    },
};
