"use client";

import React, { useState, useEffect } from "react";
import {
    Settings,
    User,
    Wrench,
    Mail,
    Files,
    Key,
    Database,
    Server,
    Plus,
    Search,
    X,
    CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SettingsDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SIMSettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
    const [activeSection, setActiveSection] = useState("general");

    // Close on Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    const sections = [
        { id: "general", label: "General", icon: Settings, group: "Account" },
        { id: "template-profile", label: "Template Profile", icon: User, group: "Account" },
        { id: "integrations", label: "Integrations", icon: Database, group: "Tools" },
        { id: "custom-tools", label: "Custom Tools", icon: Wrench, group: "Tools" },
        { id: "mcp", label: "MCP Tools", icon: Server, group: "Tools" },
        { id: "subscription", label: "Subscription", icon: CreditCard, group: "Subscription" },
        { id: "environment", label: "Environment", icon: Database, group: "System" },
        { id: "apikeys", label: "API Keys", icon: Key, group: "System" },
        { id: "files", label: "Files", icon: Files, group: "System" },
        { id: "credential-sets", label: "Email Polling", icon: Mail, group: "System" },
    ];

    const groupedSections = sections.reduce((acc, section) => {
        if (!acc[section.group]) acc[section.group] = [];
        acc[section.group].push(section);
        return acc;
    }, {} as Record<string, typeof sections>);

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[1000] flex items-center justify-center">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Dialog Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative flex h-[min(calc(100vh-8rem),900px)] min-h-[400px] w-[min(calc(100vw-8rem),1080px)] min-w-[520px] flex-row rounded-[8px] border border-[var(--border-sim)] bg-[var(--bg)] shadow-2xl overflow-hidden"
                >
                    {/* Internal Settings Sidebar */}
                    <div className="flex min-h-0 w-[186px] flex-col overflow-y-auto py-[12px] bg-[var(--surface-1)]">
                        <div className="mb-[16px] px-[12px] font-medium text-[16px] text-[var(--text-primary)] tracking-tight">Settings</div>

                        {Object.entries(groupedSections).map(([group, items]) => (
                            <div key={group} className="flex flex-col gap-[4px] px-[12px] mt-[12px] first:mt-0">
                                <div className="mb-[2px] font-medium text-[10px] uppercase tracking-widest text-[var(--text-muted)] opacity-50">{group}</div>
                                {items.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id)}
                                        className={cn(
                                            "inline-flex items-center font-medium transition-colors px-[8px] py-[6px] w-full justify-start gap-[8px] rounded-[6px] text-[13px] outline-none",
                                            activeSection === item.id
                                                ? "bg-[var(--surface-5)] text-[var(--text-primary)] border border-[var(--border-sim)] shadow-sm"
                                                : "text-[var(--text-tertiary)] hover:bg-[var(--surface-4)] hover:text-[var(--text-primary)]"
                                        )}
                                    >
                                        <item.icon className="h-[14px] w-[14px] shrink-0" />
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Main Content Area */}
                    <div className="flex min-w-0 flex-1 flex-col gap-[16px] overflow-hidden rounded-r-[8px] border-l border-[var(--border-sim)] bg-[var(--surface-2)] p-[14px]">
                        <div className="flex items-center justify-between">
                            <span className="font-base text-[14px] text-[var(--text-muted)] capitalize">
                                {sections.find(s => s.id === activeSection)?.label}
                            </span>
                            <button
                                onClick={onClose}
                                className="inline-flex items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] justify-center font-medium transition-colors rounded-[5px] text-[12px] h-[24px] w-[24px] p-0 hover:bg-[var(--surface-4)]"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Section Content (Mock Example for MCP Tools based on user HTML) */}
                        <div className="min-w-0 flex-1 overflow-y-auto no-scrollbar">
                            {activeSection === "mcp" ? (
                                <div className="flex h-full flex-col gap-[16px]">
                                    <div className="flex items-center gap-[8px]">
                                        <div className="flex flex-1 items-center gap-[8px] rounded-[8px] border border-[var(--border-sim)] bg-[var(--surface-4)] px-[8px] py-[5px] transition-colors focus-within:border-[var(--brand-400)]/50">
                                            <Search className="h-[14px] w-[14px] flex-shrink-0 text-[var(--text-tertiary)]" />
                                            <input
                                                className="flex-1 bg-transparent border-0 p-0 font-base text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none"
                                                placeholder="Search MCPs..."
                                            />
                                        </div>
                                        <button className="inline-flex items-center bg-[var(--brand-tertiary)] text-white hover:brightness-110 px-[12px] py-[6px] rounded-[6px] text-[12px] font-bold gap-1.5 transition-all">
                                            <Plus size={14} />
                                            Add
                                        </button>
                                    </div>

                                    {/* MCP Form Mockup */}
                                    <div className="rounded-[8px] border border-[var(--border-sim)] bg-[var(--surface-3)] p-[16px] space-y-4">
                                        <div className="grid gap-4">
                                            <div className="flex items-center gap-4">
                                                <label className="w-[100px] text-[13px] font-medium text-[var(--text-secondary)]">Server Name</label>
                                                <input className="flex-1 bg-[var(--surface-5)] border border-[var(--border-sim)] rounded-[6px] px-3 py-2 text-sm text-[var(--text-primary)] outline-none" placeholder="e.g., My MCP Server" />
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <label className="w-[100px] text-[13px] font-medium text-[var(--text-secondary)]">Server URL</label>
                                                <input className="flex-1 bg-[var(--surface-5)] border border-[var(--border-sim)] rounded-[6px] px-3 py-2 text-sm text-[var(--text-primary)] outline-none" placeholder="https://mcp.server.dev/sse" />
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-[var(--border-sim)]/30 flex justify-end gap-2">
                                            <button className="px-4 py-2 text-[12px] font-bold text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">Cancel</button>
                                            <button className="px-4 py-2 text-[12px] font-black uppercase tracking-widest bg-[var(--brand-tertiary)] text-white rounded-[6px] shadow-lg shadow-[var(--brand-tertiary)]/20">Add Server</button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center p-10 opacity-40">
                                    <Settings size={48} className="mb-4 animate-spin-slow" />
                                    <h3 className="text-lg font-bold">Section in Development</h3>
                                    <p className="text-sm">Configuring {activeSection} preferences...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
