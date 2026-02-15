export interface WorkflowNode {
    id: number;
    type: string;
    name: string;
    config: string;
    x: number;
    y: number;
    connectedTo?: number;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    stock: number;
    labels: string[];
}

export interface NodeDefinition {
    id: string;
    name: string;
    icon: any;
    description: string;
}

export interface NodeCategory {
    id: string;
    name: string;
    icon: any;
    nodes: NodeDefinition[];
}

export interface WorkflowTemplate {
    id: string;
    name: string;
    description: string;
    icon: any;
    color: string;
    bg: string;
    popular: boolean;
    features: string[];
}

export type ViewMode = "templates" | "builder" | "ai-assist" | "products";

export interface NodeExecutionLog {
    nodeId: number;
    nodeType: string;
    nodeName: string;
    status: "success" | "error" | "skipped" | "warning";
    message: string;
    duration: number;
    waitDelay?: number;
    timestamp: string;
}

export interface ExecutionResult {
    success: boolean;
    executedNodes: NodeExecutionLog[];
    logs: string[];
}
