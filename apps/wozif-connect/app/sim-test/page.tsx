"use client";

import React from "react";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";

export default function SIMIntegrationPage() {
    return (
        <div className="flex h-screen bg-[#0b0c10] text-white overflow-hidden font-sans">
            <DashboardSidebar />

            <div className="flex-1 flex flex-col min-w-0 bg-[var(--surface-1)]">
                <header className="h-[48px] border-b border-[var(--border-sim)] flex items-center justify-between px-4 bg-[var(--surface-3)] z-30 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-[var(--text-muted)] text-[13px] font-medium">
                            <span>Integration</span>
                            <span className="text-[var(--border-sim)]">/</span>
                            <span className="text-[var(--text-primary)] font-semibold">SIM Studio Engine</span>
                        </div>
                        <div className="h-4 w-px bg-[var(--border-sim)]" />
                        <div className="flex items-center gap-2 px-2 py-0.5 bg-[var(--brand-secondary)]/10 border border-[var(--brand-secondary)]/20 rounded-md">
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand-secondary)]" />
                            <span className="text-[10px] font-bold text-[var(--brand-secondary)] uppercase tracking-wider">Live Backend</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="h-7 px-3 bg-[var(--surface-5)] border border-[var(--border-sim)] rounded-md text-[11px] font-bold hover:bg-[var(--surface-6)] transition-all">
                            SYNC DATABASE
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-hidden relative">
                    {/* THE IFRAME POINTING TO SIM STUDIO */}
                    <div className="absolute inset-0 bg-[#0b0c10]">
                        <iframe
                            src="http://localhost:4000"
                            className="w-full h-full border-none"
                            title="SIM Studio"
                            allow="clipboard-read; clipboard-write"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
