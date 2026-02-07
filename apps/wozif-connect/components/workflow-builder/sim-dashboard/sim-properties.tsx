"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as SIMIcons from "@/components/emcn/icons";
import { Toolbar } from "../toolbar/toolbar";
import { Editor } from "../editor/editor";
import { cn } from "@/lib/utils";
import { actionBlocks, getBlockById } from "../blocks/block-configs";
import { WorkflowNode } from "../types";
import { useWorkflowStore } from "../stores/workflow-store";
import { useReactFlow } from "@xyflow/react";

export const SIMPropertiesPanel = () => {
    const [activeTab, setActiveTab] = useState("toolbar");
    const { addNode, selectedNodeId } = useWorkflowStore();
    const { getViewport } = useReactFlow();

    // Auto-switch to editor tab when a node is selected
    useEffect(() => {
        if (selectedNodeId) {
            setActiveTab("editor");
        }
    }, [selectedNodeId]);

    const handleAddBlock = useCallback((type: string) => {
        const viewport = getViewport();

        const blockConfig = getBlockById(type);

        const newNode: WorkflowNode = {
            id: `${type}-${Date.now()}`,
            type: "workflowNode",
            position: {
                x: -viewport.x / viewport.zoom + 100,
                y: -viewport.y / viewport.zoom + 100
            },
            data: {
                label: blockConfig?.name || "Nouveau Bloc",
                type,
                config: {},
            },
        };

        addNode(newNode);
    }, [getViewport, addNode]);

    return (
        <aside className="w-[320px] border-l border-[var(--border-sim)] bg-[var(--surface-1)] flex flex-col shrink-0 overflow-hidden h-full">
            {/* Tab Header - SIM Style */}
            <div className="flex border-b border-[var(--border-sim)] p-1 gap-1 bg-[var(--surface-3)] shrink-0">
                {["Copilot", "Toolbar", "Editor"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        className={cn(
                            "flex-1 h-[30px] text-[11px] font-black uppercase tracking-tight rounded-md transition-all",
                            activeTab === tab.toLowerCase()
                                ? "bg-[var(--surface-1)] text-[var(--text-primary)] border border-[var(--border-sim)] shadow-sm"
                                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                    {activeTab === "toolbar" && (
                        <motion.div
                            key="toolbar"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.15 }}
                            className="h-full overflow-y-auto no-scrollbar"
                        >
                            <Toolbar onAddBlock={handleAddBlock} />
                        </motion.div>
                    )}
                    {activeTab === "copilot" && (
                        <motion.div
                            key="copilot"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.15 }}
                            className="h-full flex flex-col p-6"
                        >
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-[var(--brand-400)]/10 flex items-center justify-center border border-[var(--brand-400)]/20 animate-pulse">
                                    <SIMIcons.BubbleChatPreview width={32} height={32} className="text-[var(--brand-400)]" />
                                </div>
                                <h4 className="text-[14px] font-black uppercase tracking-[0.2em] text-[var(--text-primary)]">Copilot AI</h4>
                                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed max-w-[200px]">
                                    Analyze, optimize or build your workflow using natural language.
                                </p>
                            </div>
                            <div className="pt-4 border-t border-[var(--border-sim)]/30">
                                <div className="relative">
                                    <input
                                        placeholder="Ask Copilot..."
                                        className="w-full h-10 bg-[var(--surface-5)] border border-[var(--border-sim)] rounded-xl px-4 pr-10 text-[12px] outline-none focus:border-[var(--brand-400)]/50 transition-all placeholder:text-[var(--text-subtle)]"
                                    />
                                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--brand-400)] transition-colors">
                                        <SIMIcons.Rocket width={14} height={14} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    {activeTab === "editor" && (
                        <motion.div
                            key="editor"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.15 }}
                            className="h-full overflow-hidden"
                        >
                            <Editor />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </aside>
    );
};
