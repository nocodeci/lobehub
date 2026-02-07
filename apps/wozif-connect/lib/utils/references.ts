import { VariableReference } from '@/lib/blocks/types'

/**
 * Pattern pour détecter les références aux outputs de blocs: <blockName.property>
 */
const BLOCK_REF_PATTERN = /<([a-zA-Z_][a-zA-Z0-9_]*)\.([a-zA-Z_][a-zA-Z0-9_]*)>/g

/**
 * Pattern pour détecter les références aux variables: {{variables.name}}
 */
const VARIABLE_REF_PATTERN = /\{\{variables\.([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g

/**
 * Pattern alternatif: {{var:name}}
 */
const VARIABLE_REF_SHORT_PATTERN = /\{\{var:([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g

/**
 * Parse un texte et extrait toutes les références
 */
export function parseReferences(text: string): VariableReference[] {
    const references: VariableReference[] = []

    // Parse les références de blocs: <block.property>
    let match: RegExpExecArray | null
    while ((match = BLOCK_REF_PATTERN.exec(text)) !== null) {
        references.push({
            type: 'output',
            source: match[1],
            property: match[2],
            fullPath: match[0],
        })
    }

    // Parse les références de variables: {{variables.name}}
    while ((match = VARIABLE_REF_PATTERN.exec(text)) !== null) {
        references.push({
            type: 'variable',
            source: 'variables',
            property: match[1],
            fullPath: match[0],
        })
    }

    // Parse les références courtes: {{var:name}}
    while ((match = VARIABLE_REF_SHORT_PATTERN.exec(text)) !== null) {
        references.push({
            type: 'variable',
            source: 'variables',
            property: match[1],
            fullPath: match[0],
        })
    }

    return references
}

/**
 * Résout les références dans un texte avec les valeurs réelles
 * @param text - Le texte contenant des références
 * @param blockOutputs - Map des outputs de blocs: { blockName: { property: value } }
 * @param variables - Map des variables: { name: value }
 */
export function resolveReferences(
    text: string,
    blockOutputs: Record<string, Record<string, unknown>>,
    variables: Record<string, unknown>
): string {
    let result = text

    // Remplacer les références de blocs
    result = result.replace(BLOCK_REF_PATTERN, (match, blockName, property) => {
        const blockOutput = blockOutputs[blockName]
        if (blockOutput && property in blockOutput) {
            const value = blockOutput[property]
            return typeof value === 'object' ? JSON.stringify(value) : String(value ?? '')
        }
        return match // Garder la référence si non trouvée
    })

    // Remplacer les références de variables
    result = result.replace(VARIABLE_REF_PATTERN, (match, name) => {
        if (name in variables) {
            const value = variables[name]
            return typeof value === 'object' ? JSON.stringify(value) : String(value ?? '')
        }
        return match
    })

    // Remplacer les références courtes
    result = result.replace(VARIABLE_REF_SHORT_PATTERN, (match, name) => {
        if (name in variables) {
            const value = variables[name]
            return typeof value === 'object' ? JSON.stringify(value) : String(value ?? '')
        }
        return match
    })

    return result
}

/**
 * Vérifie si un texte contient des références
 */
export function hasReferences(text: string): boolean {
    return BLOCK_REF_PATTERN.test(text) ||
        VARIABLE_REF_PATTERN.test(text) ||
        VARIABLE_REF_SHORT_PATTERN.test(text)
}

/**
 * Génère une liste de suggestions d'autocomplétion pour les références
 */
export function getSuggestions(
    availableBlocks: { id: string; name: string; outputs: string[] }[],
    availableVariables: { name: string; type: string }[]
): { label: string; value: string; type: 'block' | 'variable' }[] {
    const suggestions: { label: string; value: string; type: 'block' | 'variable' }[] = []

    // Suggestions pour les outputs de blocs
    for (const block of availableBlocks) {
        for (const output of block.outputs) {
            suggestions.push({
                label: `${block.name}.${output}`,
                value: `<${block.name}.${output}>`,
                type: 'block',
            })
        }
    }

    // Suggestions pour les variables
    for (const variable of availableVariables) {
        suggestions.push({
            label: `variables.${variable.name}`,
            value: `{{variables.${variable.name}}}`,
            type: 'variable',
        })
    }

    return suggestions
}

/**
 * Extrait tous les noms de blocs référencés dans un texte
 * Utile pour déterminer les dépendances d'un node
 */
export function getReferencedBlockNames(text: string): string[] {
    const names = new Set<string>()
    let match: RegExpExecArray | null

    BLOCK_REF_PATTERN.lastIndex = 0
    while ((match = BLOCK_REF_PATTERN.exec(text)) !== null) {
        names.add(match[1])
    }

    return Array.from(names)
}

/**
 * Extrait tous les noms de variables référencées dans un texte
 */
export function getReferencedVariableNames(text: string): string[] {
    const names = new Set<string>()
    let match: RegExpExecArray | null

    VARIABLE_REF_PATTERN.lastIndex = 0
    while ((match = VARIABLE_REF_PATTERN.exec(text)) !== null) {
        names.add(match[1])
    }

    VARIABLE_REF_SHORT_PATTERN.lastIndex = 0
    while ((match = VARIABLE_REF_SHORT_PATTERN.exec(text)) !== null) {
        names.add(match[1])
    }

    return Array.from(names)
}
