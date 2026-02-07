"use client";

import React from "react";
import { SIMDashboardLayout } from "@/components/workflow-builder/sim-dashboard/layout/sim-dashboard-layout";
import { Library, Search, Filter, Download as DownloadIcon, Play } from "lucide-react";

export default function LogsPage() {
    return (
        <SIMDashboardLayout title="Logs">
            <div className="flex-1 flex flex-col bg-white dark:bg-[var(--bg)] px-[24px] pt-[28px] overflow-hidden">
                {/* Header Section */}
                <div className="flex items-start gap-[12px]">
                    <div className="flex h-[26px] w-[26px] items-center justify-center rounded-[6px] border border-[#5BA8D9] bg-[#E8F4FB] dark:border-[#1A5070] dark:bg-[#153347]">
                        <Library className="h-[14px] w-[14px] text-[#5BA8D9] dark:text-[#33b4ff]" />
                    </div>
                    <div>
                        <h1 className="font-medium text-[18px]">Logs</h1>
                        <p className="mt-[4px] text-[14px] text-[var(--text-tertiary)]">
                            Monitor and debug your workflow executions in real-time.
                        </p>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="mt-[24px] flex items-center justify-between gap-4">
                    <div className="flex-1 flex max-w-[400px] h-[32px] items-center gap-[6px] rounded-[8px] bg-[var(--surface-4)] px-[8px] border border-[var(--border-sim)]">
                        <Search className="h-[14px] w-[14px] text-[var(--text-subtle)]" />
                        <input
                            placeholder="Search logs..."
                            className="bg-transparent border-none outline-none text-[12px] flex-1 text-[var(--text-primary)]"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="h-[32px] px-3 flex items-center gap-2 rounded-[6px] bg-[var(--surface-4)] border border-[var(--border-sim)] text-[11px] font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-5)] transition-all">
                            <Filter size={14} />
                            Filters
                        </button>
                        <button className="h-[32px] px-3 flex items-center gap-2 rounded-[6px] bg-[var(--surface-4)] border border-[var(--border-sim)] text-[11px] font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-5)] transition-all">
                            <DownloadIcon size={14} />
                            Export
                        </button>
                        <button className="h-[32px] px-3 flex items-center gap-2 rounded-[6px] bg-[var(--brand-tertiary)]/10 border border-[var(--brand-tertiary)]/20 text-[11px] font-bold text-[var(--brand-tertiary)] hover:bg-[var(--brand-tertiary)]/20 transition-all">
                            <Play size={14} />
                            Live
                        </button>
                    </div>
                </div>

                {/* Table Container */}
                <div className="mt-[24px] flex-1 overflow-hidden flex flex-col rounded-t-[8px] border-x border-t border-[var(--border-sim)]">
                    {/* Table Header */}
                    <div className="h-[40px] bg-[var(--surface-3)] flex items-center px-4 border-b border-[var(--border-sim)]">
                        <div className="w-[180px] text-[11px] font-black uppercase tracking-tighter text-[var(--text-muted)]">Timestamp</div>
                        <div className="w-[100px] text-[11px] font-black uppercase tracking-tighter text-[var(--text-muted)]">Level</div>
                        <div className="flex-1 text-[11px] font-black uppercase tracking-tighter text-[var(--text-muted)]">Workflow / Message</div>
                        <div className="w-[120px] text-[11px] font-black uppercase tracking-tighter text-[var(--text-muted)] text-right">Status</div>
                    </div>

                    {/* Table Body (Mock) */}
                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        {[
                            { time: "2026-01-26 10:15:32", level: "INFO", msg: "Workflow 'Onboarding Client' triggered", status: "SUCCESS" },
                            { time: "2026-01-26 10:15:33", level: "DEBUG", msg: "Analyzing intent with Llama 3.3...", status: "PENDING" },
                            { time: "2026-01-26 10:15:35", level: "ERROR", msg: "Failed to connect to WhatsApp API", status: "FAILED" },
                            { time: "2026-01-26 10:16:01", level: "INFO", msg: "Relance Panier triggered for user +225...", status: "SUCCESS" },
                            { time: "2026-01-26 10:16:10", level: "INFO", msg: "Automated response sent via WhatsApp", status: "SUCCESS" },
                        ].map((log, i) => (
                            <div key={i} className="h-[44px] flex items-center px-4 border-b border-[var(--border-sim)]/30 hover:bg-[var(--surface-4)] transition-colors cursor-pointer group">
                                <div className="w-[180px] text-[12px] font-medium text-[var(--text-secondary)]">{log.time}</div>
                                <div className={`w-[100px] text-[10px] font-black px-2 py-0.5 rounded-[4px] border w-fit ${log.level === 'INFO' ? 'border-[#33b4ff] text-[#33b4ff] bg-[#33b4ff]/5' :
                                    log.level === 'ERROR' ? 'border-red-500 text-red-500 bg-red-500/5' :
                                        'border-[var(--text-muted)] text-[var(--text-muted)]'
                                    }`}>
                                    {log.level}
                                </div>
                                <div className="flex-1 text-[12px] font-medium text-[var(--text-primary)] truncate">{log.msg}</div>
                                <div className="w-[120px] text-right">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${log.status === 'SUCCESS' ? 'text-[var(--brand-tertiary)]' :
                                        log.status === 'FAILED' ? 'text-red-500' :
                                            'text-orange-500'
                                        }`}>
                                        {log.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SIMDashboardLayout>
    );
}
