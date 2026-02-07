"use client";

import React from "react";
import * as SIMIcons from "@/components/emcn/icons";
import { cn } from "@/lib/utils";

export const SIMTopBar = ({
    breadcrumbs = ["Workspaces", "New Automation"]
}: {
    breadcrumbs?: string[]
}) => {
    return (
        <header className="h-[48px] border-b border-[var(--border-sim)] flex items-center justify-between px-4 bg-[var(--surface-3)] z-30 shrink-0 select-none">
            {/* Left: Breadcrumbs & Status */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[var(--text-muted)] text-[12px] font-medium">
                    {breadcrumbs.map((crumb, i) => (
                        <React.Fragment key={i}>
                            <span className={cn(
                                "hover:text-[var(--text-secondary)] cursor-pointer",
                                i === breadcrumbs.length - 1 && "text-[var(--text-primary)] font-semibold"
                            )}>
                                {crumb}
                            </span>
                            {i < breadcrumbs.length - 1 && (
                                <span className="text-[var(--border-sim)] opacity-50 px-0.5">/</span>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <div className="h-4 w-px bg-[var(--border-sim)]" />

                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[var(--brand-tertiary)]/5 border border-[var(--brand-tertiary)]/10 rounded-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand-tertiary)] animate-pulse" />
                    <span className="text-[10px] font-bold text-[var(--brand-tertiary)] uppercase tracking-wider">Online</span>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                <div className="flex items-center bg-[var(--surface-4)] rounded-lg p-0.5 border border-[var(--border-sim)] mr-1">
                    <button className="h-[26px] px-3 text-[11px] font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Help</button>
                    <div className="h-4 w-px bg-[var(--border-sim)]" />
                    <button className="h-[26px] px-3 text-[11px] font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2">
                        <SIMIcons.Eye width={12} height={12} />
                        <span>Preview</span>
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button className="h-8 px-4 bg-white hover:bg-[var(--surface-7)] text-black rounded-lg flex items-center gap-2 text-[12px] font-black uppercase transition-all shadow-sm active:scale-95">
                        <SIMIcons.Play width={12} height={12} />
                        <span>Run</span>
                    </button>

                    <button className="h-8 px-4 bg-[var(--brand-400)] hover:opacity-90 text-white rounded-lg flex items-center gap-2 text-[12px] font-black uppercase transition-all shadow-md active:scale-95">
                        <SIMIcons.Rocket width={12} height={12} />
                        <span>Deploy</span>
                    </button>
                </div>
            </div>
        </header>
    );
};
