import type { JSX, SVGProps } from 'react'

export type BlockIcon = (props: SVGProps<SVGSVGElement>) => JSX.Element

export type BlockCategory = 'triggers' | 'messages' | 'ai' | 'ecommerce' | 'logic' | 'tools'

// Types de valeurs pour les paramètres
export type ParamType = 'string' | 'number' | 'boolean' | 'json' | 'array' | 'any'

// Types de SubBlocks enrichis (alignés avec sim-studio)
export type SubBlockType =
    // Inputs de base
    | 'short-input'        // Input simple une ligne
    | 'long-input'         // Textarea multi-lignes
    | 'number-input'       // Input numérique
    | 'code'               // Éditeur de code
    | 'file-upload'        // Upload de fichier

    // Sélecteurs
    | 'dropdown'           // Menu déroulant
    | 'combobox'           // Dropdown avec recherche
    | 'ai-model-selector'  // Sélecteur de modèle IA
    | 'variable-selector'  // Sélecteur de variable

    // Toggles et options
    | 'switch'             // Toggle on/off
    | 'checkbox-list'      // Liste de cases à cocher
    | 'slider'             // Slider numérique

    // Inputs complexes spécialisés
    | 'messages-input'     // Messages pour LLM (role + content)
    | 'condition-input'    // Conditions logiques
    | 'variables-input'    // Assignation de variables
    | 'tool-input'         // Configuration d'outils
    | 'response-format'    // Format de réponse JSON schema
    | 'table-input'        // Tableau de données

    // WhatsApp spécifique
    | 'button-list'        // Liste de boutons
    | 'quick-reply'        // Réponses rapides

// Interface pour les conditions de visibilité
export interface SubBlockCondition {
    field: string
    value: string | number | boolean | Array<string | number | boolean>
    not?: boolean
    and?: {
        field: string
        value: string | number | boolean | Array<string | number | boolean>
        not?: boolean
    }
}

// Options pour dropdown/combobox
export interface SubBlockOption {
    label: string
    id: string
    icon?: React.ComponentType<{ className?: string }>
    group?: string
}

// Configuration d'un SubBlock
export interface SubBlockConfig {
    id: string
    title: string
    type: SubBlockType
    placeholder?: string
    description?: string
    tooltip?: string
    defaultValue?: any
    required?: boolean | SubBlockCondition

    // Options pour dropdown/combobox
    options?: SubBlockOption[] | (() => SubBlockOption[])

    // Conditions de visibilité
    condition?: SubBlockCondition | (() => SubBlockCondition)

    // Dépendances (pour invalidation/refresh)
    dependsOn?: string[] | { all?: string[]; any?: string[] }

    // Slider
    min?: number
    max?: number
    step?: number

    // Code editor
    language?: 'javascript' | 'json' | 'python' | 'sql'

    // Long input
    rows?: number

    // Input password
    password?: boolean

    // Permet de dropper des connexions d'autres blocs
    connectionDroppable?: boolean

    // Caché dans le preview du bloc
    hideFromPreview?: boolean

    // Mode: basic, advanced, both
    mode?: 'basic' | 'advanced' | 'both'
}

// Configuration des paramètres d'entrée
export interface ParamConfig {
    type: ParamType
    description?: string
    required?: boolean
    schema?: {
        type: string
        properties?: Record<string, any>
        required?: string[]
        items?: any
    }
}

// Configuration des outputs avec conditions
export interface OutputConfig {
    type: ParamType
    description?: string
    condition?: SubBlockCondition
}

// Configuration complète d'un bloc
export interface BlockConfig {
    type: string
    name: string
    description: string
    longDescription?: string
    docsLink?: string
    category: BlockCategory
    bgColor: string
    icon: any // Pour les icônes React/Lucide

    // SubBlocks pour la configuration
    subBlocks: SubBlockConfig[]

    // Définition des entrées/sorties
    inputs: Record<string, ParamConfig>
    outputs: Record<string, OutputConfig>

    // Options avancées
    singleInstance?: boolean    // Un seul bloc de ce type par workflow
    hideFromToolbar?: boolean   // Caché dans la palette

    // Triggers
    triggers?: {
        enabled: boolean
        available: string[]
    }
}

// Type pour les références de variables/outputs
export type VariableReference = {
    type: 'variable' | 'output'
    source: string          // ID du bloc ou 'variables'
    property: string        // Nom de la propriété
    fullPath: string        // Format complet: <block.property> ou {{variable.name}}
}
