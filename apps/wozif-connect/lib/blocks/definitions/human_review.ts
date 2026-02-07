import { UserSearch } from "lucide-react";
import { BlockConfig } from "../types";

export const HumanInTheLoopBlock: BlockConfig = {
    type: "human_review",
    name: "Intervention Humaine",
    description: "Met en pause le workflow jusqu'à ce qu'un agent humain valide ou réponde",
    category: "logic",
    bgColor: "#ef4444",
    icon: UserSearch,
    subBlocks: [
        {
            id: "reason",
            title: "Raison de l'intervention",
            type: "short-input",
            placeholder: "L'IA n'est pas sûre de la réponse",
        },
        {
            id: "timeout",
            title: "Timeout (minutes)",
            type: "number-input",
            defaultValue: 60,
        },
    ],
    inputs: {},
    outputs: {
        decision: { type: "string", description: "La décision de l'agent (approuvé/rejeté)" },
        comment: { type: "string", description: "Commentaire laissé par l'agent" },
    },
};
