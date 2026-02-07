import { create } from 'zustand';
import { WorkflowNode, WorkflowEdge } from '../types';

interface WorkflowStore {
    // State
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
    selectedNodeId: string | null;

    // Actions
    setNodes: (nodes: WorkflowNode[]) => void;
    setEdges: (edges: WorkflowEdge[]) => void;
    addNode: (node: WorkflowNode) => void;
    updateNode: (id: string, data: Partial<WorkflowNode>) => void;
    removeNode: (id: string) => void;
    addEdge: (edge: WorkflowEdge) => void;
    removeEdge: (id: string) => void;
    selectNode: (id: string | null) => void;
    clearWorkflow: () => void;
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
    nodes: [],
    edges: [],
    selectedNodeId: null,

    setNodes: (nodes) => set({ nodes }),

    setEdges: (edges) => set({ edges }),

    addNode: (node) => set((state) => ({
        nodes: [...state.nodes, node]
    })),

    updateNode: (id, data) => set((state) => ({
        nodes: state.nodes.map((node) =>
            node.id === id ? { ...node, ...data } : node
        ),
    })),

    removeNode: (id) => set((state) => ({
        nodes: state.nodes.filter((node) => node.id !== id),
        edges: state.edges.filter(
            (edge) => edge.source !== id && edge.target !== id
        ),
        selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    })),

    addEdge: (edge) => set((state) => ({
        edges: [...state.edges, edge]
    })),

    removeEdge: (id) => set((state) => ({
        edges: state.edges.filter((edge) => edge.id !== id),
    })),

    selectNode: (id) => set({ selectedNodeId: id }),

    clearWorkflow: () => set({ nodes: [], edges: [], selectedNodeId: null }),
}));
