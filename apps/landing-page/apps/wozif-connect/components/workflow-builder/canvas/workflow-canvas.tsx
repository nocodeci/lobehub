"use client";

import React, { useCallback, useMemo, useRef } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    addEdge,
    Connection,
    Edge,
    ReactFlowProvider,
    useReactFlow,
    Panel,
    BackgroundVariant,
    Node,
    OnNodesChange,
    OnEdgesChange,
    applyNodeChanges,
    applyEdgeChanges,
    SelectionMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { cn } from "@/lib/utils";

import { useWorkflowStore } from "../stores/workflow-store";
import CustomNode from "./custom-node";
import { getBlockById } from "../blocks/block-configs";
import { ActionBar } from "../action-bar/action-bar";
import { WorkflowEdge as WorkflowEdgeType, WorkflowNode } from "../types";

import WorkflowEdge from "./workflow-edge";

const nodeTypes = {
    workflowNode: CustomNode,
};

const edgeTypes = {
    workflowEdge: WorkflowEdge,
};

const reactFlowFitViewOptions = { padding: 0.6, maxZoom: 1.0 } as const;

export const WorkflowCanvas = () => {
    const { nodes, edges, setNodes, setEdges, addNode, selectNode } = useWorkflowStore();
    const { screenToFlowPosition } = useReactFlow();
    const reactFlowWrapper = useRef<HTMLDivElement>(null);

    const onNodesChange: OnNodesChange = useCallback(
        (changes) => setNodes(applyNodeChanges(changes, nodes as any) as any),
        [nodes, setNodes]
    );

    const onEdgesChange: OnEdgesChange = useCallback(
        (changes) => setEdges(applyEdgeChanges(changes, edges as any) as any),
        [edges, setEdges]
    );

    const onConnect = useCallback(
        (params: Connection) => setEdges(addEdge({
            ...params,
            type: 'workflowEdge',
        }, edges as any) as any),
        [edges, setEdges]
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            if (!reactFlowWrapper.current) return;

            const type = event.dataTransfer.getData("application/xyflow");
            if (!type) return;

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const blockConfig = getBlockById(type);

            const newNode: WorkflowNode = {
                id: `${type}-${Date.now()}`,
                type: "workflowNode",
                position,
                data: {
                    label: blockConfig?.name || "Nouveau Bloc",
                    type,
                    config: {},
                },
            };

            addNode(newNode);
        },
        [screenToFlowPosition, addNode]
    );

    const reactFlowStyles = [
        'bg-[var(--bg)]',
        '[&_.react-flow__edges]:!z-0',
        '[&_.react-flow__node]:!z-[21]',
        '[&_.react-flow__handle]:!z-[30]',
        '[&_.react-flow__edge-labels]:!z-[60]',
        '[&_.react-flow__pane]:!bg-[var(--bg)]',
        '[&_.react-flow__pane]:select-none',
        '[&_.react-flow__selectionpane]:select-none',
        '[&_.react-flow__renderer]:!bg-[var(--bg)]',
        '[&_.react-flow__viewport]:!bg-[var(--bg)]',
    ].join(' ');

    return (
        <div className="flex-1 w-full h-full bg-[var(--bg)] relative outline-none" ref={reactFlowWrapper}>
            <ReactFlow
                nodes={nodes as any}
                edges={edges as any}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onNodeClick={(_, node) => selectNode(node.id)}
                onPaneClick={() => selectNode(null)}
                fitView
                fitViewOptions={reactFlowFitViewOptions}
                snapToGrid
                snapGrid={[20, 20]}
                minZoom={0.1}
                maxZoom={1.3}
                panOnScroll
                selectionMode={SelectionMode.Partial}
                className={cn("workflow-container h-full", reactFlowStyles)}
                defaultEdgeOptions={{
                    style: { stroke: 'var(--workflow-edge)', strokeWidth: 2 },
                    type: 'smoothstep'
                }}
            >
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={20}
                    size={1}
                    color="var(--border-sim)"
                    className="opacity-[0.4]"
                />

                <MiniMap
                    style={{ width: 140, height: 90, background: 'var(--surface-1)' }}
                    className="bg-[var(--surface-1)] border-[var(--border-sim)] rounded-xl overflow-hidden !shadow-2xl border"
                    nodeColor={(n: Node) => {
                        const config = getBlockById(n.data?.type as string);
                        return config?.color || "#fff";
                    }}
                    maskColor="rgba(0,0,0,0.4)"
                />

                <Panel position="top-right" className="flex items-center gap-2 p-3">
                    <div className="px-3 py-1.5 bg-[var(--surface-4)] border border-[var(--border-sim)] rounded-md flex items-center gap-2 shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand-tertiary)] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-[var(--text-muted)]">Live Mode</span>
                    </div>
                </Panel>

                <Panel position="bottom-left" className="m-0 p-0">
                    <ActionBar isTerminalExpanded={false} />
                </Panel>
            </ReactFlow>
        </div>
    );
};
