"use client";

import React, { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Connection,
  Controls,
  Background,
  BackgroundVariant,
  MarkerType,
  NodeProps,
  EdgeProps,
  NodeChange,
  EdgeChange,
  getSmoothStepPath,
  BaseEdge,
  Handle,
  Position,
  ReactFlowInstance,
  getBezierPath,
  MiniMap,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Plus, Play, Power, Trash2, MoreHorizontal, Zap, FlaskConical } from "lucide-react";

// Types for workflow nodes
export interface WorkflowNodeData {
  label: string;
  type: string;
  config?: string;
  icon?: React.ReactNode;
  color?: string;
  isSelected?: boolean;
  hasConditionalOutputs?: boolean;
  isTrigger?: boolean;
  [key: string]: unknown;
}

// Custom Node Component - Premium "Soft Glass" Style
function WorkflowNode({ data, selected, id }: NodeProps<Node<WorkflowNodeData>>) {
  const nodeColor = data.color || "#6366f1";
  const isTrigger = data.isTrigger || data.type?.includes("trigger") || data.type?.includes("message") || data.type === "keyword" || data.type === "scheduled" || data.type === "new_contact" || data.type === "webhook_trigger";

  const renderToolbar = () => (
    <div
      className={`
        absolute -top-14 left-1/2 -translate-x-1/2 z-20
        flex items-center gap-1.5 px-2 py-1.5
        bg-zinc-900/80 backdrop-blur-2xl rounded-2xl border border-white/10
        shadow-[0_20px_50px_rgba(0,0,0,0.5)]
        transition-all duration-300 transform
        ${selected ? "opacity-100 visible translate-y-0 scale-100" : "opacity-0 invisible translate-y-2 scale-95 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100"}
      `}
    >
      {[
        { icon: Play, label: 'Run', color: 'hover:text-emerald-400' },
        { icon: Power, label: 'Off', color: 'hover:text-amber-400' },
        { icon: Trash2, label: 'Del', color: 'hover:text-red-400' },
        { icon: MoreHorizontal, label: 'More', color: 'hover:text-white' }
      ].map((btn, i) => (
        <button key={i} className={`h-9 w-9 rounded-xl flex items-center justify-center text-white/40 ${btn.color} hover:bg-white/5 transition-all active:scale-90`}>
          <btn.icon className={`h-4 w-4 ${btn.icon === Play ? 'fill-current' : ''}`} />
        </button>
      ))}
    </div>
  );

  if (isTrigger) {
    return (
      <div className="relative group">
        {renderToolbar()}

        <div className="flex items-center gap-6">
          {/* Executive Panel - Premium Style */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
              <div className="relative w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden group/run">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover/run:opacity-100 transition-opacity" />
                <Zap className="w-6 h-6 text-emerald-400 fill-emerald-400/10" />
              </div>
            </div>
            <button className="h-8 px-5 rounded-full bg-emerald-500 text-black text-[10px] font-black uppercase tracking-[0.15em] shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all transform hover:-translate-y-0.5 active:translate-y-0">
              Run
            </button>
          </div>

          {/* Trigger Node Core */}
          <div
            className={`
              relative w-24 h-24 rounded-[32px] transition-all duration-500
              flex items-center justify-center
              bg-zinc-900/40 backdrop-blur-xl border border-white/10
              ${selected
                ? "border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.2),inset_0_0_20px_rgba(16,185,129,0.1)] scale-105"
                : "hover:border-emerald-500/40 hover:scale-102"
              }
            `}
          >
            {/* Visual Depth layers */}
            <div className="absolute inset-0 rounded-[31px] border border-white/5 pointer-events-none" />
            <div className="absolute inset-[1px] rounded-[30px] border border-black/20 pointer-events-none" />

            <div className="relative z-10 w-12 h-12 flex items-center justify-center text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">
              {data.icon || <Plus className="w-8 h-8" />}
            </div>

            <Handle
              type="source"
              position={Position.Right}
              className="!w-4 !h-4 !bg-zinc-900 !border-2 !border-emerald-500/50 hover:!border-emerald-500 hover:!scale-125 !shadow-[0_0_15px_rgba(16,185,129,0.3)] !rounded-full transition-all !right-[-8px]"
            />
          </div>
        </div>

        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 text-center">
          <div className="text-[12px] font-bold text-white/50 tracking-tight group-hover:text-white transition-colors">
            {data.label}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      {renderToolbar()}

      <Handle
        type="target"
        position={Position.Left}
        className="!w-4 !h-4 !bg-zinc-900 !border-2 !border-white/20 hover:!border-primary hover:!scale-125 !shadow-xl !rounded-full transition-all !left-[-8px]"
      />

      <div
        className={`
          relative w-24 h-24 rounded-[32px] transition-all duration-500
          flex items-center justify-center
          bg-zinc-900/60 backdrop-blur-2xl border border-white/10
          ${selected
            ? "border-primary shadow-[0_0_60px_rgba(99,102,241,0.25),inset_0_0_20px_rgba(99,102,241,0.1)] scale-105"
            : "hover:border-white/30 hover:bg-zinc-800/80 hover:scale-102"
          }
        `}
      >
        {/* Luminous Inner Highlight */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Node Bottom Signature */}
        <div
          className="absolute bottom-4 w-10 h-1.5 rounded-full blur-[1px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${nodeColor}, transparent)`,
            opacity: 0.6
          }}
        />

        {/* Floating Icon Container */}
        <div
          className="w-12 h-12 flex items-center justify-center rounded-[20px] transition-transform duration-500 group-hover:scale-110"
          style={{
            backgroundColor: `${nodeColor}10`,
            border: `1px solid ${nodeColor}20`,
            color: nodeColor,
            boxShadow: `inset 0 0 20px ${nodeColor}05`
          }}
        >
          {data.icon || <Plus className="w-8 h-8" />}
        </div>
      </div>

      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 text-center text-[12px] font-bold text-white/50 tracking-tight group-hover:text-white transition-colors">
        {data.label}
      </div>

      {!data.hasConditionalOutputs && (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-4 !h-4 !bg-zinc-900 !border-2 !border-white/20 hover:!border-primary hover:!scale-125 !shadow-xl !rounded-full transition-all !right-[-8px]"
        />
      )}

      {data.hasConditionalOutputs && (
        <>
          <div className="absolute right-0 top-[28%] translate-x-1/2 flex items-center group/true">
            <Handle
              type="source"
              position={Position.Right}
              id="true"
              className="!relative !transform-none !w-4 !h-4 !bg-zinc-900 !border-2 !border-emerald-500/40 hover:!border-emerald-500 !shadow-lg !rounded-full transition-all"
            />
            <span className="ml-2 text-[10px] font-black text-emerald-400 tracking-[0.1em] opacity-40 group-hover/true:opacity-100 transition-opacity uppercase">Success</span>
          </div>
          <div className="absolute right-0 top-[72%] translate-x-1/2 flex items-center group/false">
            <Handle
              type="source"
              position={Position.Right}
              id="false"
              className="!relative !transform-none !w-4 !h-4 !bg-zinc-900 !border-2 !border-red-500/40 hover:!border-red-500 !shadow-lg !rounded-full transition-all"
            />
            <span className="ml-2 text-[10px] font-black text-red-400 tracking-[0.1em] opacity-40 group-hover/false:opacity-100 transition-opacity uppercase">Failure</span>
          </div>
        </>
      )}
    </div>
  );
}

// Custom Edge Component - Neural Fiber Style
function WorkflowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeColor = (data as any)?.color || "#6366f1";

  return (
    <>
      <defs>
        <linearGradient id={`gradient-${id}`} gradientUnits="userSpaceOnUse" x1={sourceX} y1={sourceY} x2={targetX} y2={targetY}>
          <stop offset="0%" stopColor={edgeColor} stopOpacity="0.4" />
          <stop offset="50%" stopColor={edgeColor} stopOpacity="1" />
          <stop offset="100%" stopColor={edgeColor} stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Outer Connection Aura */}
      <BaseEdge
        id={`${id}-aura`}
        path={edgePath}
        style={{
          stroke: edgeColor,
          strokeWidth: 8,
          filter: "blur(12px)",
          opacity: 0.1,
        }}
        className="pointer-events-none"
      />

      {/* Main Connection Fiber */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: `url(#gradient-${id})`,
          strokeWidth: 3,
          ...style,
        }}
        className="transition-all duration-500 hover:stroke-white cursor-pointer"
      />

      {/* Energy Pulse (Photon) */}
      <path
        d={edgePath}
        fill="none"
        stroke={edgeColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        className="neural-pulse-path"
        style={{
          filter: `drop-shadow(0 0 5px ${edgeColor})`,
        }}
      />

      {/* Interaction Layer */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        className="cursor-pointer pointer-events-auto"
        onClick={(e) => {
          e.stopPropagation();
          console.log("Edge clicked", id);
        }}
      />

      {/* Plus button in the middle - refined style */}
      <foreignObject
        width={32}
        height={32}
        x={labelX - 16}
        y={labelY - 16}
        className="overflow-visible pointer-events-none"
      >
        <div className="w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 group transition-opacity duration-300">
          <div
            className="w-7 h-7 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center pointer-events-auto cursor-pointer shadow-2xl hover:border-primary hover:scale-110 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Add node at edge", id);
            }}
          >
            <Plus className="w-4 h-4 text-white/50 group-hover:text-primary" />
          </div>
        </div>
      </foreignObject>
    </>
  );
}

// Node types registry
const nodeTypes = {
  workflowNode: WorkflowNode,
};

// Edge types registry
const edgeTypes = {
  workflowEdge: WorkflowEdge,
};

// Default edge options - n8n style
const defaultEdgeOptions = {
  type: "workflowEdge",
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: "#4f46e5",
  },
  style: {
    stroke: "#4f46e5",
    strokeWidth: 2,
  },
};

interface FlowCanvasProps {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  onNodesChange?: (changes: NodeChange<Node<WorkflowNodeData>>[]) => void;
  onEdgesChange?: (changes: EdgeChange[]) => void;
  onSelectionChange?: (selection: { nodes: Node<WorkflowNodeData>[]; edges: Edge[] }) => void;
  onNodeClick?: (node: Node<WorkflowNodeData>) => void;
  onPaneClick?: () => void;
  onConnect?: (connection: Connection) => void;
  onDrop?: (event: React.DragEvent, position: { x: number; y: number }) => void;
}

export function FlowCanvas({
  nodes,
  edges,
  onNodesChange: onNodesChangeExternal,
  onEdgesChange: onEdgesChangeExternal,
  onSelectionChange,
  onNodeClick,
  onPaneClick,
  onConnect: onConnectExternal,
  onDrop: onDropExternal,
}: FlowCanvasProps) {
  const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance<Node<WorkflowNodeData>, Edge> | null>(null);

  // Handle new connections
  const handleConnect = useCallback(
    (connection: Connection) => {
      onConnectExternal?.(connection);
    },
    [onConnectExternal]
  );

  // Handle drag over for dropping new nodes
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Handle drop for new nodes
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowInstance) return;
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      onDropExternal?.(event, position);
    },
    [onDropExternal, reactFlowInstance]
  );

  return (
    <div className="w-full h-full">
      <ReactFlow<Node<WorkflowNodeData>, Edge>
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChangeExternal}
        onEdgesChange={onEdgesChangeExternal}
        onConnect={handleConnect}
        onNodeClick={(_, node) => onNodeClick?.(node as unknown as Node<WorkflowNodeData>)}
        onPaneClick={onPaneClick}
        onSelectionChange={(sel) =>
          onSelectionChange?.({
            nodes: (sel.nodes as unknown as Node<WorkflowNodeData>[]) ?? [],
            edges: sel.edges ?? [],
          })
        }
        onDragOver={onDragOver}
        onDrop={onDrop}
        onInit={(instance) => setReactFlowInstance(instance)}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineStyle={{
          stroke: "#6366f1",
          strokeWidth: 3,
          strokeDasharray: '5, 5',
        }}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        deleteKeyCode={["Backspace", "Delete"]}
        panOnDrag={true}
        zoomOnScroll={true}
        className="bg-[#050505]"
        proOptions={{ hideAttribution: true }}
      >
        <style dangerouslySetInnerHTML={{
          __html: `
          .neural-pulse-path {
            stroke-dasharray: 10 100;
            animation: neural-pulse 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            stroke-opacity: 1;
          }
          @keyframes neural-pulse {
            from { stroke-dashoffset: 110; }
            to { stroke-dashoffset: 0; }
          }
          .react-flow__handle {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            border: 2px solid rgba(255,255,255,0.1) !important;
          }
          .react-flow__handle:hover {
            transform: scale(1.4) !important;
            filter: brightness(1.3);
            border-color: currentColor !important;
          }
           .react-flow__edge-path {
            stroke-width: 3;
            transition: stroke-width 0.3s;
          }
          .react-flow__edge:hover .react-flow__edge-path {
            stroke-width: 4;
            filter: brightness(1.2);
          }
        `}} />
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          color="rgba(255, 255, 255, 0.05)"
          className="bg-[#050505]"
        />
        <Controls
          className="!bg-[#1e1e1e] !border-white/10 !rounded-lg !shadow-2xl !p-1"
          showInteractive={false}
        />
        <MiniMap
          nodeStrokeWidth={3}
          maskColor="rgba(0, 0, 0, 0.6)"
          className="!bg-[#1e1e1e] !border-white/10 !rounded-xl !bottom-4 !right-4"
          nodeColor={(node) => (node.data as any).color || "#6366f1"}
          nodeBorderRadius={16}
          zoomable
          pannable
        />
        <Panel position="top-right" className="flex gap-2 p-2">
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1 text-[10px] text-white/60 font-medium">
            Workflow Logic Engine v2.0
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

// Helper to convert workflow nodes to React Flow format
export function toFlowNodes(
  workflowNodes: Array<{
    id: number;
    type: string;
    name: string;
    config?: string;
    x: number;
    y: number;
  }>,
  getIcon?: (type: string) => React.ReactNode,
  getColor?: (type: string) => string
): Node<WorkflowNodeData>[] {
  const triggerTypes = ["whatsapp_message", "telegram_message", "keyword", "new_contact", "scheduled", "webhook_trigger"];

  return workflowNodes.map((node) => ({
    id: String(node.id),
    type: "workflowNode",
    position: { x: node.x, y: node.y },
    data: {
      label: node.name,
      type: node.type,
      config: node.config,
      icon: getIcon?.(node.type),
      color: getColor?.(node.type),
      hasConditionalOutputs: node.type === "condition" || node.type === "random_choice",
      isTrigger: triggerTypes.includes(node.type),
    },
  }));
}

// Helper to convert workflow connections to React Flow edges
export function toFlowEdges(
  workflowNodes: Array<{
    id: number;
    type?: string;
    config?: string;
    connectedTo?: number;
    connectedToTrue?: number;
    connectedToFalse?: number;
    conditionalConnections?: { true?: number; false?: number };
  }>
): Edge[] {
  const edges: Edge[] = [];

  for (const node of workflowNodes) {
    // Normal connection
    if (node.connectedTo && node.connectedTo !== -1) {
      edges.push({
        id: `e${node.id}-${node.connectedTo}`,
        source: String(node.id),
        target: String(node.connectedTo),
        type: "workflowEdge",
      });
    }

    // Parse config for conditional targets if they aren't explicitly in the object
    let configTrue: number | undefined;
    let configFalse: number | undefined;

    if (node.config && (node.type === "condition" || node.type === "random_choice")) {
      try {
        const parsed = JSON.parse(node.config);
        if (parsed.ifTrue) configTrue = parseInt(parsed.ifTrue);
        if (parsed.ifFalse) configFalse = parseInt(parsed.ifFalse);
      } catch (e) {
        // Ignore parse errors
      }
    }

    // Conditional true connection
    const trueTarget = node.connectedToTrue || node.conditionalConnections?.true || configTrue;
    if (trueTarget && trueTarget !== -1) {
      edges.push({
        id: `e${node.id}-${trueTarget}-true`,
        source: String(node.id),
        sourceHandle: "true",
        target: String(trueTarget),
        type: "workflowEdge",
        data: { color: "#10b981" },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 15,
          height: 15,
          color: "#10b981",
        },
      });
    }

    // Conditional false connection
    const falseTarget = node.connectedToFalse || node.conditionalConnections?.false || configFalse;
    if (falseTarget && falseTarget !== -1) {
      edges.push({
        id: `e${node.id}-${falseTarget}-false`,
        source: String(node.id),
        sourceHandle: "false",
        target: String(falseTarget),
        type: "workflowEdge",
        data: { color: "#ef4444" },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 15,
          height: 15,
          color: "#ef4444",
        },
      });
    }
  }

  return edges;
}

// Helper to convert React Flow nodes back to workflow format
export function fromFlowNodes(
  flowNodes: Node<WorkflowNodeData>[]
): Array<{
  id: number;
  type: string;
  name: string;
  config: string;
  x: number;
  y: number;
}> {
  return flowNodes.map((node) => ({
    id: parseInt(node.id, 10),
    type: node.data.type,
    name: node.data.label,
    config: node.data.config || "{}",
    x: node.position.x,
    y: node.position.y,
  }));
}

// Helper to convert React Flow edges back to workflow connections
export function fromFlowEdges(
  flowEdges: Edge[]
): Map<number, { connectedTo?: number; connectedToTrue?: number; connectedToFalse?: number }> {
  const connections = new Map<number, { connectedTo?: number; connectedToTrue?: number; connectedToFalse?: number }>();

  for (const edge of flowEdges) {
    const sourceId = parseInt(edge.source, 10);
    const targetId = parseInt(edge.target, 10);

    if (!connections.has(sourceId)) {
      connections.set(sourceId, {});
    }

    const conn = connections.get(sourceId)!;

    if (edge.sourceHandle === "true") {
      conn.connectedToTrue = targetId;
    } else if (edge.sourceHandle === "false") {
      conn.connectedToFalse = targetId;
    } else {
      conn.connectedTo = targetId;
    }
  }

  return connections;
}

export default FlowCanvas;
