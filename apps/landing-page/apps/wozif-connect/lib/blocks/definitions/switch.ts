import { BlockConfig } from "../types";
import { GitMerge } from "lucide-react";

export const SwitchBlock: BlockConfig = {
    type: "switch",
    name: "Switch (Router)",
    description: "Route le flux vers différentes branches selon la valeur d'un champ. Idéal pour gérer plusieurs cas de figure.",
    category: "logic",
    icon: GitMerge,
    bgColor: "#8b5cf6", // violet-500

    inputs: {
        value: {
            type: "string",
            required: true,
            description: "Valeur à évaluer pour le routage",
        },
    },

    subBlocks: [
        {
            id: "inputField",
            title: "Champ à évaluer",
            type: "short-input",
            placeholder: "ex: <trigger.intent> ou <ai_agent.category>",
            description: "La valeur qui sera comparée aux différents cas",
            required: true,
            connectionDroppable: true,
        },
        {
            id: "cases",
            title: "Cas (branches)",
            type: "long-input",
            placeholder: "Entrez un cas par ligne:\ncommande\nquestion\nplainte\nurgent",
            description: "Chaque ligne représente un cas. Le flux sera routé vers la branche correspondante.",
            required: true,
            rows: 6,
        },
        {
            id: "caseSensitive",
            title: "Sensible à la casse",
            type: "switch",
            defaultValue: false,
            description: "Si activé, 'Commande' et 'commande' seront traités différemment",
        },
        {
            id: "defaultCase",
            title: "Cas par défaut",
            type: "switch",
            defaultValue: true,
            description: "Activer une branche 'default' si aucun cas ne correspond",
        },
        {
            id: "matchMode",
            title: "Mode de correspondance",
            type: "dropdown",
            defaultValue: "exact",
            options: [
                { id: "exact", label: "Correspondance exacte" },
                { id: "contains", label: "Contient le texte" },
                { id: "startsWith", label: "Commence par" },
                { id: "endsWith", label: "Termine par" },
                { id: "regex", label: "Expression régulière" },
            ],
            mode: "advanced",
        },
        {
            id: "trimInput",
            title: "Nettoyer les espaces",
            type: "switch",
            defaultValue: true,
            description: "Supprimer les espaces avant/après la valeur avant comparaison",
            mode: "advanced",
        },
    ],

    outputs: {
        matchedCase: {
            type: "string",
            description: "Le cas qui a correspondu",
        },
        inputValue: {
            type: "string",
            description: "La valeur originale du champ évalué",
        },
        caseIndex: {
            type: "number",
            description: "L'index du cas correspondant (0-based)",
        },
        isDefault: {
            type: "boolean",
            description: "Vrai si aucun cas n'a correspondu (branche default)",
        },
    },
};
