"use client";

import React, { memo } from "react";
import {
    Search,
    Plus,
    Download,
    FolderPlus,
    Library,
    Layout,
    Database,
    Settings,
    HelpCircle,
    ChevronDown,
    PanelLeft
} from "lucide-react";
import Link from "next/link";
import * as SIMIcons from "@/components/emcn/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/emcn/components/button/button";
import { Tooltip } from "@/components/emcn/components/tooltip/tooltip";

interface SIMSidebarProps {
    onOpenSettings?: () => void;
}

export const SIMSidebar = memo(function SIMSidebar({ onOpenSettings }: SIMSidebarProps) {
    const footerItems = [
        { icon: Library, label: "Logs", href: "/automations/logs" },
        { icon: Layout, label: "Templates", href: "/automations/templates" },
        { icon: Database, label: "Knowledge Base", href: "/automations/knowledge" },
        { icon: HelpCircle, label: "Help", href: "#" },
        { icon: Settings, label: "Settings", onClick: onOpenSettings }
    ];

    return (
        <aside className="w-[232px] border-r border-[var(--border-sim)] bg-[var(--surface-1)] flex flex-col shrink-0 h-full overflow-hidden">
            {/* Header / Workspace Switcher */}
            <div className="px-[14px] pt-[12px] flex items-center justify-between">
                <button className="group flex items-center gap-[8px] rounded-[6px] bg-transparent px-[6px] py-[4px] transition-colors hover:bg-[var(--surface-6)] min-w-0 max-w-full">
                    <span className="font-base text-[14px] text-[var(--text-primary)] truncate">
                        Default Workspace
                    </span>
                    <SIMIcons.ChevronDown width={10} height={8} className="text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]" />
                </button>

                <div className="h-4 w-px bg-[var(--border-sim)] mx-1" />

                <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    <SIMIcons.PanelLeft width={16} height={16} />
                </button>
            </div>

            {/* Search Bar - SIM Style */}
            <div className="px-[8px] mt-[10px]">
                <div className="flex cursor-pointer items-center justify-between rounded-[8px] border border-[var(--border-sim)] bg-[var(--surface-4)] px-[8px] py-[6px] hover:border-[var(--border-1)] hover:bg-[var(--surface-5)] transition-all">
                    <div className="flex items-center gap-[6px]">
                        <Search className="h-[14px] w-[14px] text-[var(--text-subtle)]" />
                        <span className="translate-y-[0.25px] font-medium text-[var(--text-tertiary)] text-[12px]">Search</span>
                    </div>
                    <span className="font-medium text-[var(--text-subtle)] text-[11px]">⌘K</span>
                </div>
            </div>

            {/* Workflows Section */}
            <div className="mt-[14px] flex flex-1 flex-col overflow-hidden">
                <div className="flex items-center justify-between px-[14px] mb-[6px]">
                    <span className="text-[12px] font-medium text-[var(--text-tertiary)] uppercase tracking-tight">Workflows</span>
                    <div className="flex items-center gap-[10px]">
                        <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-0.5">
                            <SIMIcons.Download width={14} height={14} />
                        </button>
                        <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-0.5">
                            <SIMIcons.FolderPlus width={14} height={14} />
                        </button>
                        <button className="bg-[var(--surface-4)] border border-[var(--border-sim)] text-[var(--text-primary)] hover:bg-[var(--surface-5)] p-0.5 rounded-sm">
                            <Plus size={14} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-[8px] space-y-px">
                    <div className="group flex h-[32px] items-center gap-[8px] rounded-[8px] px-[8px] bg-[var(--surface-5)] border border-[var(--border-sim)] cursor-pointer">
                        <div className="w-2.5 h-2.5 rounded-full bg-[var(--brand-tertiary)] shadow-[0_0_8px_var(--brand-tertiary)]" />
                        <span className="text-[13px] font-medium text-[var(--text-primary)] truncate">New Automation</span>
                    </div>
                    {/* Placeholder for more workflows */}
                    <div className="group flex h-[32px] items-center gap-[8px] rounded-[8px] px-[8px] hover:bg-[var(--surface-4)] cursor-pointer transition-colors">
                        <div className="w-2.5 h-2.5 rounded-full bg-[var(--text-muted)]" />
                        <span className="text-[13px] font-medium text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] truncate">Customer Onboarding</span>
                    </div>
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="mt-auto px-[8px] py-[8px] border-t border-[var(--border-sim)] flex flex-col gap-px">
                {footerItems.map((item, idx) => (
                    item.href ? (
                        <Link
                            key={idx}
                            href={item.href}
                            className="group flex h-[28px] items-center gap-[8px] rounded-[8px] px-[8px] hover:bg-[var(--surface-4)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-all"
                        >
                            <item.icon className="h-[14px] w-[14px] shrink-0" />
                            <span className="text-[13px] font-medium truncate">{item.label}</span>
                        </Link>
                    ) : (
                        <button
                            key={idx}
                            onClick={item.onClick}
                            className="group flex h-[28px] items-center gap-[8px] rounded-[8px] px-[8px] hover:bg-[var(--surface-4)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-all"
                        >
                            <item.icon className="h-[14px] w-[14px] shrink-0" />
                            <span className="text-[13px] font-medium truncate">{item.label}</span>
                        </button>
                    )
                ))}
            </div>
        </aside>
    );
});
