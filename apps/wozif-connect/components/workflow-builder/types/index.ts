import { Node, Edge } from "@xyflow/react";

export interface NodeData {
    label: string;
    type: string;
    icon?: string;
    color?: string;
    config?: Record<string, any>;
    [key: string]: unknown;
}

export type WorkflowNode = Node<NodeData, 'workflowNode'>;
export type WorkflowEdge = Edge;

export interface BlockConfig {
    id: string;
    type: string;
    name: string;
    description: string;
    icon: React.ComponentType<any>;
    color: string;
    category: 'triggers' | 'actions' | 'conditions' | 'ai' | 'integrations' | 'messages' | 'logic' | 'crm' | 'tools';
    subBlocks?: SubBlock[];
    outputs?: Record<string, BlockOutput>;
}

export interface SubBlock {
    id: string;
    title: string;
    type: 'short-input' | 'long-input' | 'dropdown' | 'checkbox' | 'template' | 'number';
    placeholder?: string;
    required?: boolean;
    password?: boolean;
    options?: { label: string; id: string }[];
    defaultValue?: any;
}

export interface BlockOutput {
    type: string;
    description: string;
}

export interface WorkflowState {
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
    selectedNodeId: string | null;
}
