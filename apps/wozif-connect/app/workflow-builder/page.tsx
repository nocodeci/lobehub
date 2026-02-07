"use client";

import React, { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import * as SIMIcons from "@/components/emcn/icons";
import { SearchIcon } from "@/components/icons";
import { WorkflowCanvas } from "@/components/workflow-builder/canvas/workflow-canvas";
import { Toolbar } from "@/components/workflow-builder/toolbar/toolbar";
import { motion, AnimatePresence } from "framer-motion";
import { Editor } from "@/components/workflow-builder/editor/editor";
import { cn } from "@/lib/utils";
import { ReactFlowProvider } from "@xyflow/react";

export default function SIMInterfacePage() {
    const [activeTab, setActiveTab] = useState("toolbar");
    const [isExecuting, setIsExecuting] = useState(false);
    const [isTerminalExpanded, setIsTerminalExpanded] = useState(false);

    return (
        <ReactFlowProvider>
            <div className="flex h-screen bg-[var(--bg)] text-[var(--text-primary)] overflow-hidden font-sans">
                <DashboardSidebar />

                {/* L'ARCHITECTURE EXACTE DE SIM STUDIO */}
                <div className="flex-1 flex flex-col min-w-0 bg-[var(--surface-1)]">

                    {/* TOPBAR SIM (AVEC VRAIES ICONES) */}
                    <header className="h-[48px] border-b border-[var(--border-sim)] flex items-center justify-between px-4 bg-[var(--surface-3)] z-30 shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-[var(--text-muted)] text-[13px] font-medium">
                                <span>Workspaces</span>
                                <span className="text-[var(--border-sim)]">/</span>
                                <span className="text-[var(--text-primary)] font-semibold">Mon Workflow SIM</span>
                            </div>
                            <div className="h-4 w-px bg-[var(--border-sim)]" />
                            <div className="flex items-center gap-2 px-2 py-1 bg-[var(--brand-tertiary)]/10 border border-[var(--brand-tertiary)]/20 rounded-md">
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand-tertiary)]" />
                                <span className="text-[10px] font-bold text-[var(--brand-tertiary)] uppercase tracking-wider">Online</span>
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
                                onClick={() => setIsExecuting(!isExecuting)}
                                className={`h-8 px-4 rounded-lg flex items-center gap-2 text-[12px] font-black uppercase transition-all shadow-sm ${isExecuting
                                    ? "bg-[var(--text-error)] text-white"
                                    : "bg-white text-black hover:bg-[var(--brand-secondary)]"
                                    }`}
                            >
                                {isExecuting ? <SIMIcons.Loader width={12} height={12} className="animate-spin" /> : <SIMIcons.Play width={12} height={12} />}
                                {isExecuting ? "Stop" : "Run"}
                            </button>

                            <button className="h-8 px-4 bg-[var(--brand-400)] text-white rounded-lg flex items-center gap-2 text-[12px] font-black uppercase hover:opacity-90 transition-all shadow-lg">
                                <SIMIcons.Rocket width={12} height={12} />
                                Deploy
                            </button>
                        </div>
                    </header>

                    <div className="flex-1 flex overflow-hidden">

                        {/* SIDEBAR GAUCHE SIM (WORKFLOWS/LOGS - AVEC ICONES EMCN) */}
                        <aside className="w-[232px] border-r border-[var(--border-sim)] bg-[var(--surface-1)] flex flex-col shrink-0">
                            <div className="p-3">
                                <div className="relative group">
                                    <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-3.5 h-3.5" />
                                    <input
                                        placeholder="Search workflows..."
                                        className="w-full h-8 bg-[var(--surface-5)] border border-[var(--border-sim)] rounded-md pl-8 pr-3 text-[12px] text-[var(--text-primary)] outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto px-2 space-y-4">
                                <div>
                                    <div className="flex items-center justify-between px-2 mb-2">
                                        <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest">Automations</span>
                                        <div className="flex gap-2.5 opacity-40 hover:opacity-100 transition-opacity">
                                            <SIMIcons.Download width={14} height={14} className="cursor-pointer" />
                                            <SIMIcons.FolderPlus width={14} height={14} className="cursor-pointer" />
                                        </div>
                                    </div>
                                    <div className="space-y-px text-[13px]">
                                        <div className="h-8 flex items-center gap-3 px-2 bg-[var(--surface-4)] border border-[var(--border-sim)] rounded-md text-[var(--text-primary)] font-medium">
                                            <div className="w-2 h-2 rounded-full bg-[var(--brand-tertiary)]" />
                                            <span className="truncate">WhatsApp Assistant</span>
                                        </div>
                                        <div className="h-8 flex items-center gap-3 px-2 text-[var(--text-tertiary)] hover:bg-[var(--surface-4)] rounded-md transition-colors cursor-pointer group">
                                            <div className="w-2 h-2 rounded-full bg-[var(--brand-secondary)]" />
                                            <span className="truncate tracking-tight">Onboarding Sequence</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-2 border-t border-[var(--border-sim)] bg-[var(--surface-1)]">
                                {[
                                    { icon: SIMIcons.Library, label: "Logs" },
                                    { icon: SIMIcons.Layout, label: "Templates" },
                                    { icon: SIMIcons.Connections, label: "Knowledge Base" },
                                    { icon: SIMIcons.Key, label: "Variables" },
                                ].map((item, idx) => (
                                    <button key={idx} className="w-full h-8 flex items-center gap-3 px-2 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--surface-5)] rounded-md transition-colors">
                                        <item.icon width={14} height={14} className="text-[var(--text-muted)]" />
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </aside>

                        {/* CANVAS CENTRAL (ÉTENDU) */}
                        <div className="flex-1 relative bg-[var(--bg)] overflow-hidden flex flex-col">
                            <div className="flex-1 relative h-full">
                                <WorkflowCanvas />
                            </div>

                            {/* TERMINAL SIM STYLE (Expansion logic) */}
                            <div className={`border-t border-[var(--border-sim)] bg-[var(--surface-1)] transition-all duration-300 ease-in-out shrink-0 ${isTerminalExpanded ? 'h-[280px]' : 'h-[40px]'}`}>
                                <div
                                    className="h-[40px] px-4 flex items-center justify-between cursor-pointer hover:bg-[var(--surface-3)] transition-colors"
                                    onClick={() => setIsTerminalExpanded(!isTerminalExpanded)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <SIMIcons.HexSimple width={14} height={14} className="text-[var(--text-muted)]" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Terminal</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                                            <span className="text-[10px] font-bold text-[#22c55e] uppercase">Live</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-[10px] text-[var(--text-muted)] font-medium">128ms Execution</div>
                                        <div className="h-6 px-3 bg-[var(--surface-5)] border border-[var(--border-sim)] rounded-md flex items-center gap-2 text-[10px] font-bold cursor-pointer hover:bg-[var(--surface-6)] transition-all uppercase tracking-tight">
                                            Logs (24)
                                        </div>
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
                                            {[
                                                { time: "14:20:01", type: "INFO", msg: "Workflow started: WhatsApp Assistant" },
                                                { time: "14:20:02", type: "DEBUG", msg: "Evaluating trigger: incoming_message" },
                                                { time: "14:20:02", type: "SUCCESS", msg: "Trigger matched for +225 0707..." },
                                                { time: "14:20:03", type: "EXEC", msg: "Running block: AI Agent (GPT-4o)" },
                                                { time: "14:20:04", type: "INFO", msg: "Agent response received (245 tokens)" },
                                                { time: "14:20:05", type: "SUCCESS", msg: "Message sent to WhatsApp API" },
                                                { time: "14:20:05", type: "INFO", msg: "Workflow finished in 4022ms" },
                                            ].map((log, i) => (
                                                <div key={i} className="flex gap-4 hover:bg-[var(--surface-4)] py-1 px-2 rounded group transition-colors">
                                                    <div className="w-[80px] shrink-0 text-[var(--text-muted)]">{log.time}</div>
                                                    <div className={`w-[60px] shrink-0 font-bold text-[9px] flex items-center ${log.type === 'SUCCESS' ? 'text-[#22c55e]' :
                                                        log.type === 'INFO' ? 'text-[#33b4ff]' :
                                                            log.type === 'DEBUG' ? 'text-[var(--text-muted)]' : 'text-[#f59e0b]'
                                                        }`}>
                                                        <span className="border border-current px-1 rounded-[3px]">{log.type}</span>
                                                    </div>
                                                    <div className="flex-1 text-[var(--text-primary)] opacity-80 group-hover:opacity-100 transition-opacity">{log.msg}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* PANEL DROIT SIM (LE CŒUR DE L'INTERFACE) */}
                        <aside className="w-[320px] border-l border-[var(--border-sim)] bg-[var(--surface-1)] flex flex-col shrink-0 overflow-hidden">

                            {/* Onglets SIM exacts */}
                            <div className="flex border-b border-[var(--border-sim)] p-1 gap-1 bg-[var(--surface-3)] shrink-0">
                                {["Copilot", "Toolbar", "Editor"].map((tab) => (
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

                            {/* Contenu dynamique du panneau droit */}
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
                                    ) : activeTab === "copilot" ? (
                                        <motion.div
                                            key="copilot"
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            className="flex-1 p-6"
                                        >
                                            <div className="flex flex-col h-full">
                                                <div className="flex-1 space-y-4 text-center">
                                                    <div className="mx-auto w-16 h-16 rounded-full bg-[var(--brand-400)]/10 flex items-center justify-center border border-[var(--brand-400)]/20 mb-4 animate-pulse">
                                                        <SIMIcons.BubbleChatPreview width={32} height={32} className="text-[var(--brand-400)]" />
                                                    </div>
                                                    <h4 className="text-[14px] font-black uppercase tracking-widest text-[var(--text-primary)]">Copilot AI</h4>
                                                    <p className="text-[11px] text-[var(--text-muted)] leading-relaxed max-w-[200px] mx-auto">
                                                        I can help you build, debug and optimize your WhatsApp workflows.
                                                    </p>
                                                </div>
                                                <div className="pt-4 border-t border-[var(--border-sim)]">
                                                    <input
                                                        placeholder="Ask Copilot..."
                                                        className="w-full h-10 bg-[var(--surface-5)] border border-[var(--border-sim)] rounded-xl px-4 text-[12px] outline-none"
                                                    />
                                                </div>
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
