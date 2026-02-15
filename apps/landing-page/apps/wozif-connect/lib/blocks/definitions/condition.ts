import { GitBranch } from "lucide-react";
import { BlockConfig } from "../types";

export const ConditionBlock: BlockConfig = {
    type: "condition",
    name: "Condition (IF/ELSE)",
    description: "Divise le flux selon une ou plusieurs conditions logiques",
    longDescription: `Le bloc Condition permet de créer des branches dans votre workflow. 
    Vous pouvez définir plusieurs conditions avec des opérateurs logiques.
    Utilisez <block.output> pour référencer les valeurs d'autres blocs.`,
    category: "logic",
    bgColor: "#f59e0b",
    icon: GitBranch,
    subBlocks: [
        {
            id: "conditions",
            title: "Conditions",
            type: "condition-input",
            placeholder: "Définissez vos conditions...",
            description: "Utilisez <block.property> pour référencer les outputs d'autres blocs",
            connectionDroppable: true,
        },
        {
            id: "defaultBranch",
            title: "Branche par défaut (ELSE)",
            type: "switch",
            defaultValue: true,
            description: "Activer une branche par défaut si aucune condition n'est remplie",
        },
        {
            id: "evaluationMode",
            title: "Mode d'évaluation",
            type: "dropdown",
            options: [
                { label: "Première condition vraie", id: "first_match" },
                { label: "Toutes les conditions vraies (AND)", id: "all_match" },
                { label: "Au moins une vraie (OR)", id: "any_match" },
            ],
            defaultValue: "first_match",
            mode: "advanced",
        },
    ],
    inputs: {
        input: {
            type: 'any',
            description: "Données à évaluer",
        },
    },
    outputs: {
        true: {
            type: 'boolean',
            description: "Si la condition est vraie",
        },
        false: {
            type: 'boolean',
            description: "Si la condition est fausse (ELSE)",
        },
        matchedCondition: {
            type: 'string',
            description: "ID de la condition qui a matché",
        },
    },
};
