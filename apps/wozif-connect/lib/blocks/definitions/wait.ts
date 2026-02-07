import { Clock } from "lucide-react";
import { BlockConfig } from "../types";

export const WaitBlock: BlockConfig = {
    type: "delay",
    name: "Attendre",
    description: "Fait une pause dans l'exécution du workflow",
    category: "logic",
    bgColor: "#6b7280",
    icon: Clock,
    subBlocks: [
        {
            id: "delay",
            title: "Durée (secondes)",
            type: "number-input",
            defaultValue: 5,
        },
    ],
    inputs: {},
    outputs: {
        waited_time: { type: "number", description: "Temps attendu en secondes" },
    },
};
