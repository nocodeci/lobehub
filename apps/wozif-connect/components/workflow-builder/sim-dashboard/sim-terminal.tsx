"use client";

import React, { useState } from "react";
import * as SIMIcons from "@/components/emcn/icons";
import { cn } from "@/lib/utils";

export const SIMTerminal = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={cn(
            "border-t border-[var(--border-sim)] bg-[var(--surface-1)] transition-all duration-300 ease-in-out shrink-0 flex flex-col",
            isExpanded ? 'h-[280px]' : 'h-[36px]'
        )}>
            {/* Header / Collapse Toggle */}
            <div
                className="h-[36px] px-4 flex items-center justify-between cursor-pointer hover:bg-[var(--surface-3)] transition-colors select-none"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <SIMIcons.HexSimple width={14} height={14} className="text-[var(--text-muted)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Terminal</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                        <span className="text-[10px] font-bold text-[#22c55e] uppercase tracking-tight">Live Session</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-[10px] text-[var(--text-muted)] font-medium">Ready for input</div>
                    <div className="h-[22px] px-2.5 bg-[var(--surface-5)] border border-[var(--border-sim)] rounded-md flex items-center gap-2 text-[9px] font-black cursor-pointer hover:bg-[var(--surface-6)] transition-all uppercase tracking-[0.05em] text-[var(--text-secondary)]">
                        History (0)
                    </div>
                    <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                        <SIMIcons.ChevronDown
                            width={12}
                            height={12}
                            className={cn("transition-transform duration-300", isExpanded ? "" : "rotate-180")}
                        />
                    </button>
                </div>
            </div>

            {/* Terminal Content */}
            {isExpanded && (
                <div className="flex-1 overflow-hidden flex flex-col border-t border-[var(--border-sim)]/30">
                    <div className="px-4 py-2 flex items-center gap-4 text-[10px] font-black uppercase text-[var(--text-muted)] border-b border-[var(--border-sim)]/30 bg-[var(--surface-2)]/50">
                        <div className="w-[80px] shrink-0">Timestamp</div>
                        <div className="w-[60px] shrink-0">Level</div>
                        <div className="flex-1">Execution Log</div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 font-mono text-[11px] bg-[var(--surface-1)]">
                        <div className="flex gap-4 group transition-colors hover:bg-[var(--surface-4)] px-1 rounded-sm">
                            <span className="w-[80px] shrink-0 text-[var(--text-muted)]">02:30:15 PM</span>
                            <span className="w-[60px] shrink-0 text-[#33b4ff] font-bold tracking-tighter">[SYSTEM]</span>
                            <span className="flex-1 text-[var(--text-primary)] opacity-70 group-hover:opacity-100">Workflow environment initialized successfully.</span>
                        </div>
                        <div className="flex gap-4 group transition-colors hover:bg-[var(--surface-4)] px-1 rounded-sm">
                            <span className="w-[80px] shrink-0 text-[var(--text-muted)]">02:30:16 PM</span>
                            <span className="w-[60px] shrink-0 text-[var(--brand-tertiary)] font-bold tracking-tighter">[READY]</span>
                            <span className="flex-1 text-[var(--text-primary)] opacity-70 group-hover:opacity-100">Listening for trigger events...</span>
                        </div>
                        <div className="pt-2">
                            <span className="text-[var(--brand-secondary)] mr-2 mr-2 animate-pulse font-bold">$</span>
                            <span className="text-[var(--text-muted)]">Waiting for execution...</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
