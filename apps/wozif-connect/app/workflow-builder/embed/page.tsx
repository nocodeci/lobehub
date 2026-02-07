"use client";

import React, { useState, useEffect } from "react";
import * as SIMIcons from "@/components/emcn/icons";
import { SearchIcon } from "@/components/icons";
import { WorkflowCanvas } from "@/components/workflow-builder/canvas/workflow-canvas";
import { Toolbar } from "@/components/workflow-builder/toolbar/toolbar";
import { motion, AnimatePresence } from "framer-motion";
import { Editor } from "@/components/workflow-builder/editor/editor";
import { cn } from "@/lib/utils";
import { useWorkflowStore } from "@/components/workflow-builder/stores/workflow-store";
import { ReactFlowProvider } from "@xyflow/react";

export default function EmbeddedWorkflowBuilder() {
    const [activeTab, setActiveTab] = useState("toolbar");
    const [isExecuting, setIsExecuting] = useState(false);
    const [isTerminalExpanded, setIsTerminalExpanded] = useState(false);
    const [logs, setLogs] = useState<any[]>([]);
    const { nodes, edges } = useWorkflowStore();

    const handleRun = async () => {
        if (isExecuting) {
            setIsExecuting(false);
            return;
        }

        setIsExecuting(true);
        setIsTerminalExpanded(true);

        // Initial log
        const startLog = {
            time: new Date().toLocaleTimeString(),
            type: "INFO",
            msg: "Workflow execution started..."
        };
        setLogs([startLog]);

        try {
            // Prepare data for backend
            const workflowData = {
                nodes: nodes.map(n => ({
                    id: n.id,
                    type: n.type,
                    name: n.data.label || n.type,
                    config: JSON.stringify(n.data.config || {})
                })),
                context: {} // Add any global context here
            };

            const response = await fetch("http://localhost:8000/execute", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(workflowData),
            });

            if (!response.ok) {
                throw new Error(`Execution failed: ${response.statusText}`);
            }

            const result = await response.json();

            // Add success log
            setLogs(prev => [...prev, {
                time: new Date().toLocaleTimeString(),
                type: "SUCCESS",
                msg: "Workflow executed successfully!"
            }]);

            // Add actual results to logs
            if (result.results) {
                Object.entries(result.results).forEach(([nodeId, data]: [string, any]) => {
                    setLogs(prev => [...prev, {
                        time: new Date().toLocaleTimeString(),
                        type: "DEBUG",
                        msg: `Node ${nodeId}: ${JSON.stringify(data).substring(0, 100)}...`
                    }]);
                });
            }

        } catch (error: any) {
            setLogs(prev => [...prev, {
                time: new Date().toLocaleTimeString(),
                type: "ERROR",
                msg: error.message
            }]);
        } finally {
            setIsExecuting(false);
        }
    };

    return (
        <ReactFlowProvider>
            <div className="flex h-screen bg-[var(--bg)] text-[var(--text-primary)] overflow-hidden font-sans border border-[var(--border-sim)] rounded-xl">
                {/* L'ARCHITECTURE EXACTE de SIM STUDIO (SANS SIDEBAR MAIN) */}
                <div className="flex-1 flex flex-col min-w-0 bg-[var(--surface-1)]">

                    {/* TOPBAR SIM (AVEC VRAIES ICONES) */}
                    <header className="h-[48px] border-b border-[var(--border-sim)] flex items-center justify-between px-4 bg-[var(--surface-3)] z-30 shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-[var(--text-muted)] text-[13px] font-medium">
                                <span className="text-[var(--text-primary)] font-semibold uppercase tracking-widest text-[10px]">Embedded Workflow Builder</span>
                            </div>
                            <div className="h-4 w-px bg-[var(--border-sim)]" />
                            <div className="flex items-center gap-2 px-2 py-1 bg-[var(--brand-tertiary)]/10 border border-[var(--brand-tertiary)]/20 rounded-md">
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand-tertiary)]" />
                                <span className="text-[10px] font-bold text-[var(--brand-tertiary)] uppercase tracking-wider">Connected</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-[var(--surface-4)] rounded-lg p-0.5 border border-[var(--border-sim)]">
                                <button className="h-7 px-3 text-[11px] font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Help</button>
                                <button className="h-7 px-3 text-[11px] font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors border-l border-[var(--border-sim)] flex items-center gap-2">
                                    <SIMIcons.Eye width={12} height={12} />
                                    <span>Preview</span>
                                </button>
                            </div>

                            <button
                                onClick={handleRun}
                                disabled={isExecuting}
                                className={`h-8 px-4 rounded-lg flex items-center gap-2 text-[12px] font-black uppercase transition-all shadow-sm ${isExecuting
                                    ? "bg-[var(--text-error)] text-white"
                                    : "bg-white text-black hover:bg-[var(--brand-secondary)]"
                                    } disabled:opacity-50`}
                            >
                                {isExecuting ? <SIMIcons.Loader width={12} height={12} className="animate-spin" /> : <SIMIcons.Play width={12} height={12} />}
                                {isExecuting ? "Executing" : "Run"}
                            </button>

                            <button className="h-8 px-4 bg-[var(--brand-400)] text-white rounded-lg flex items-center gap-2 text-[12px] font-black uppercase hover:opacity-90 transition-all shadow-lg">
                                <SIMIcons.Rocket width={12} height={12} />
                                Deploy
                            </button>
                        </div>
                    </header>

                    <div className="flex-1 flex overflow-hidden">
                        {/* CANVAS CENTRAL */}
                        <div className="flex-1 relative bg-[var(--bg)] overflow-hidden flex flex-col">
                            <div className="flex-1 relative h-full">
                                <WorkflowCanvas />
                            </div>

                            {/* TERMINAL SIM STYLE */}
                            <div className={`border-t border-[var(--border-sim)] bg-[var(--surface-1)] transition-all duration-300 ease-in-out shrink-0 ${isTerminalExpanded ? 'h-[280px]' : 'h-[40px]'}`}>
                                <div
                                    className="h-[40px] px-4 flex items-center justify-between cursor-pointer hover:bg-[var(--surface-3)] transition-colors"
                                    onClick={() => setIsTerminalExpanded(!isTerminalExpanded)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <SIMIcons.HexSimple width={14} height={14} className="text-[var(--text-muted)]" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Logs & Terminal</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                                            <span className="text-[10px] font-bold text-[#22c55e] uppercase">Live</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="text-[var(--text-muted)] hover:text-white">
                                            <SIMIcons.ChevronDown width={14} height={14} className={cn("transition-transform", isTerminalExpanded ? "" : "rotate-180")} />
                                        </button>
                                    </div>
                                </div>

                                {/* Terminal Content */}
                                {isTerminalExpanded && (
                                    <div className="p-4 h-[240px] overflow-hidden flex flex-col gap-2 font-mono text-[11px]">
                                        <div className="flex gap-4 text-[var(--text-muted)] border-b border-[var(--border-sim)] pb-2 mb-2 font-black uppercase tracking-tighter">
                                            <div className="w-[80px] shrink-0">Timestamp</div>
                                            <div className="w-[60px] shrink-0">Type</div>
                                            <div className="flex-1">Message</div>
                                        </div>
                                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
                                            {logs.length === 0 && (
                                                <div className="text-[var(--text-muted)] italic py-2">No logs yet. Click 'Run' to start.</div>
                                            )}
                                            {logs.map((log, i) => (
                                                <div key={i} className="flex gap-4 hover:bg-[var(--surface-4)] py-1 px-2 rounded group transition-colors">
                                                    <div className="w-[80px] shrink-0 text-[var(--text-muted)]">{log.time}</div>
                                                    <div className={`w-[60px] shrink-0 font-bold text-[9px] flex items-center ${log.type === 'SUCCESS' ? 'text-[#22c55e]' :
                                                        log.type === 'INFO' ? 'text-[#33b4ff]' :
                                                            log.type === 'ERROR' ? 'text-[var(--text-error)]' : 'text-[var(--text-muted)]'
                                                        }`}>
                                                        <span className="border border-current px-1 rounded-[3px]">{log.type}</span>
                                                    </div>
                                                    <div className="flex-1 text-[var(--text-primary)] opacity-80 group-hover:opacity-100 transition-opacity whitespace-pre-wrap">{log.msg}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* PANEL DROIT SIM */}
                        <aside className="w-[320px] border-l border-[var(--border-sim)] bg-[var(--surface-1)] flex flex-col shrink-0 overflow-hidden">
                            <div className="flex border-b border-[var(--border-sim)] p-1 gap-1 bg-[var(--surface-3)] shrink-0">
                                {["Toolbar", "Editor"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab.toLowerCase())}
                                        className={`flex-1 h-8 text-[11px] font-black uppercase tracking-tighter rounded-md transition-all ${activeTab === tab.toLowerCase()
                                            ? "bg-[var(--surface-5)] text-[var(--text-primary)] border border-[var(--border-sim)] shadow-sm"
                                            : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <div className="flex-1 overflow-hidden flex flex-col">
                                <AnimatePresence mode="wait">
                                    {activeTab === "toolbar" ? (
                                        <motion.div
                                            key="toolbar"
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            className="h-full flex flex-col"
                                        >
                                            <div className="flex-1 overflow-y-auto no-scrollbar">
                                                <Toolbar onAddBlock={() => { }} />
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="editor"
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            className="flex-1 overflow-hidden"
                                        >
                                            <Editor />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </ReactFlowProvider>
    );
}
