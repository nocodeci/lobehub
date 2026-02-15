"use client";

import React, { useState, useCallback } from "react";
import { Node, Edge, NodeChange, EdgeChange, applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import {
  FlowCanvas,
  WorkflowNodeData,
  toFlowNodes,
  toFlowEdges,
} from "@/components/workflow/FlowCanvas";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Bot,
  GitBranch,
  Clock,
  Zap,
  Plus,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

// Sample workflow nodes
const sampleWorkflowNodes = [
  {
    id: 1,
    type: "whatsapp_message",
    name: "Message WhatsApp",
    config: "{}",
    x: 100,
    y: 200,
    connectedTo: 2,
  },
  {
    id: 2,
    type: "ai_respond",
    name: "Réponse IA",
    config: "{}",
    x: 350,
    y: 200,
    connectedTo: 3,
  },
  {
    id: 3,
    type: "condition",
    name: "Condition",
    config: "{}",
    x: 600,
    y: 200,
    connectedToTrue: 4,
    connectedToFalse: 5,
  },
  {
    id: 4,
    type: "send_text",
    name: "Envoyer Oui",
    config: "{}",
    x: 850,
    y: 100,
  },
  {
    id: 5,
    type: "delay",
    name: "Attendre",
    config: "{}",
    x: 850,
    y: 300,
    connectedTo: 6,
  },
  {
    id: 6,
    type: "send_text",
    name: "Relance",
    config: "{}",
    x: 1100,
    y: 300,
  },
];

// Icon mapping
const getNodeIcon = (type: string) => {
  switch (type) {
    case "whatsapp_message":
    case "send_text":
      return <MessageSquare className="w-5 h-5" />;
    case "ai_respond":
      return <Bot className="w-5 h-5" />;
    case "condition":
      return <GitBranch className="w-5 h-5" />;
    case "delay":
      return <Clock className="w-5 h-5" />;
    default:
      return <Zap className="w-5 h-5" />;
  }
};

// Color mapping
const getNodeColor = (type: string) => {
  switch (type) {
    case "whatsapp_message":
      return "#25D366";
    case "ai_respond":
      return "#8B5CF6";
    case "condition":
      return "#F59E0B";
    case "delay":
      return "#3B82F6";
    case "send_text":
      return "#10B981";
    default:
      return "#6366F1";
  }
};

export default function FlowTestPage() {
  // Convert sample nodes to React Flow format
  const initialNodes = toFlowNodes(sampleWorkflowNodes, getNodeIcon, getNodeColor);
  const initialEdges = toFlowEdges(sampleWorkflowNodes);

  const [nodes, setNodes] = useState<Node<WorkflowNodeData>[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<WorkflowNodeData> | null>(null);

  const handleNodesChange = useCallback((changes: NodeChange<Node<WorkflowNodeData>>[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const handleEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const handleNodeClick = useCallback((node: Node<WorkflowNodeData>) => {
    setSelectedNode(node);
  }, []);

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const addNode = () => {
    const newId = Math.max(...nodes.map((n) => parseInt(n.id))) + 1;
    const newNode: Node<WorkflowNodeData> = {
      id: String(newId),
      type: "workflowNode",
      position: { x: 200 + Math.random() * 200, y: 200 + Math.random() * 200 },
      data: {
        label: `Nouveau Bloc ${newId}`,
        type: "send_text",
        icon: <MessageSquare className="w-5 h-5" />,
        color: "#10B981",
      },
    };
    setNodes((prev) => [...prev, newNode]);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/automations">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
          <h1 className="text-lg font-bold">Test React Flow Canvas</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={addNode} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter Bloc
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="h-[calc(100vh-56px)] flex">
        <div className="flex-1">
          <FlowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onNodeClick={handleNodeClick}
            onPaneClick={handlePaneClick}
          />
        </div>

        {/* Right Panel */}
        {selectedNode && (
          <div className="w-80 border-l border-white/10 bg-[#111] p-4">
            <h2 className="text-sm font-bold mb-4 text-white/80">
              Bloc sélectionné
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-white/50">Nom</label>
                <div className="text-sm font-medium">{selectedNode.data.label}</div>
              </div>
              <div>
                <label className="text-xs text-white/50">Type</label>
                <div className="text-sm font-medium">{selectedNode.data.type}</div>
              </div>
              <div>
                <label className="text-xs text-white/50">Position</label>
                <div className="text-sm font-medium">
                  x: {Math.round(selectedNode.position.x)}, y:{" "}
                  {Math.round(selectedNode.position.y)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
