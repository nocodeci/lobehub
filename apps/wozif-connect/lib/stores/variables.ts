import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types de variables supportés
export type VariableType = 'string' | 'number' | 'boolean' | 'object' | 'array'

// Interface pour une variable
export interface Variable {
    id: string
    workflowId: string
    name: string
    type: VariableType
    value: unknown
    description?: string
    createdAt: number
    updatedAt: number
}

// Interface du store
interface VariablesStore {
    // Données
    variables: Record<string, Variable>

    // Actions CRUD
    addVariable: (variable: Omit<Variable, 'id' | 'createdAt' | 'updatedAt'>) => string
    updateVariable: (id: string, update: Partial<Omit<Variable, 'id' | 'workflowId' | 'createdAt'>>) => void
    deleteVariable: (id: string) => void

    // Requêtes
    getVariablesByWorkflowId: (workflowId: string) => Variable[]
    getVariableByName: (workflowId: string, name: string) => Variable | undefined

    // Bulk operations
    setVariableValue: (id: string, value: unknown) => void
    clearWorkflowVariables: (workflowId: string) => void
}

// Génère un ID unique
const generateId = () => `var_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

export const useVariablesStore = create<VariablesStore>()(
    persist(
        (set, get) => ({
            variables: {},

            addVariable: (variable) => {
                const id = generateId()
                const now = Date.now()

                set((state) => ({
                    variables: {
                        ...state.variables,
                        [id]: {
                            ...variable,
                            id,
                            createdAt: now,
                            updatedAt: now,
                        }
                    }
                }))

                return id
            },

            updateVariable: (id, update) => {
                set((state) => {
                    if (!state.variables[id]) return state

                    return {
                        variables: {
                            ...state.variables,
                            [id]: {
                                ...state.variables[id],
                                ...update,
                                updatedAt: Date.now(),
                            }
                        }
                    }
                })
            },

            deleteVariable: (id) => {
                set((state) => {
                    const { [id]: deleted, ...rest } = state.variables
                    return { variables: rest }
                })
            },

            getVariablesByWorkflowId: (workflowId) => {
                const state = get()
                return Object.values(state.variables).filter(v => v.workflowId === workflowId)
            },

            getVariableByName: (workflowId, name) => {
                const state = get()
                return Object.values(state.variables).find(
                    v => v.workflowId === workflowId && v.name === name
                )
            },

            setVariableValue: (id, value) => {
                set((state) => {
                    if (!state.variables[id]) return state

                    return {
                        variables: {
                            ...state.variables,
                            [id]: {
                                ...state.variables[id],
                                value,
                                updatedAt: Date.now(),
                            }
                        }
                    }
                })
            },

            clearWorkflowVariables: (workflowId) => {
                set((state) => {
                    const filtered = Object.fromEntries(
                        Object.entries(state.variables).filter(([, v]) => v.workflowId !== workflowId)
                    )
                    return { variables: filtered }
                })
            },
        }),
        {
            name: 'wozif-variables-storage',
        }
    )
)
