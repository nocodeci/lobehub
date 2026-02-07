import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Type pour les valeurs de SubBlocks par workflow et par node
type SubBlockValues = Record<string, unknown>  // subBlockId -> value
type NodeValues = Record<string, SubBlockValues>  // nodeId -> subBlockValues
type WorkflowValues = Record<string, NodeValues>  // workflowId -> nodeValues

interface SubBlockStore {
    // Données: workflowId -> nodeId -> subBlockId -> value
    workflowValues: WorkflowValues

    // Définir une valeur
    setValue: (workflowId: string, nodeId: string, subBlockId: string, value: unknown) => void

    // Obtenir une valeur
    getValue: (workflowId: string, nodeId: string, subBlockId: string) => unknown

    // Obtenir toutes les valeurs d'un node
    getNodeValues: (workflowId: string, nodeId: string) => SubBlockValues

    // Définir toutes les valeurs d'un node à la fois
    setNodeValues: (workflowId: string, nodeId: string, values: SubBlockValues) => void

    // Supprimer un node
    deleteNode: (workflowId: string, nodeId: string) => void

    // Supprimer un workflow complet
    deleteWorkflow: (workflowId: string) => void

    // Importer des valeurs (pour charger un workflow sauvegardé)
    importWorkflowValues: (workflowId: string, values: NodeValues) => void

    // Exporter les valeurs (pour sauvegarder)
    exportWorkflowValues: (workflowId: string) => NodeValues
}

export const useSubBlockStore = create<SubBlockStore>()(
    persist(
        (set, get) => ({
            workflowValues: {},

            setValue: (workflowId, nodeId, subBlockId, value) => {
                set((state) => ({
                    workflowValues: {
                        ...state.workflowValues,
                        [workflowId]: {
                            ...state.workflowValues[workflowId],
                            [nodeId]: {
                                ...state.workflowValues[workflowId]?.[nodeId],
                                [subBlockId]: value,
                            }
                        }
                    }
                }))
            },

            getValue: (workflowId, nodeId, subBlockId) => {
                return get().workflowValues[workflowId]?.[nodeId]?.[subBlockId]
            },

            getNodeValues: (workflowId, nodeId) => {
                return get().workflowValues[workflowId]?.[nodeId] ?? {}
            },

            setNodeValues: (workflowId, nodeId, values) => {
                set((state) => ({
                    workflowValues: {
                        ...state.workflowValues,
                        [workflowId]: {
                            ...state.workflowValues[workflowId],
                            [nodeId]: values,
                        }
                    }
                }))
            },

            deleteNode: (workflowId, nodeId) => {
                set((state) => {
                    const workflowData = state.workflowValues[workflowId]
                    if (!workflowData) return state

                    const { [nodeId]: deleted, ...rest } = workflowData
                    return {
                        workflowValues: {
                            ...state.workflowValues,
                            [workflowId]: rest,
                        }
                    }
                })
            },

            deleteWorkflow: (workflowId) => {
                set((state) => {
                    const { [workflowId]: deleted, ...rest } = state.workflowValues
                    return { workflowValues: rest }
                })
            },

            importWorkflowValues: (workflowId, values) => {
                set((state) => ({
                    workflowValues: {
                        ...state.workflowValues,
                        [workflowId]: values,
                    }
                }))
            },

            exportWorkflowValues: (workflowId) => {
                return get().workflowValues[workflowId] ?? {}
            },
        }),
        {
            name: 'wozif-subblock-storage',
        }
    )
)
