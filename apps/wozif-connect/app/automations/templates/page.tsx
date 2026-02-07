"use client";

import React from "react";
import { SIMDashboardLayout } from "@/components/workflow-builder/sim-dashboard/layout/sim-dashboard-layout";
import { Layout, Search, Zap, Star } from "lucide-react";

export default function TemplatesPage() {
    const templates = [
        { name: "Customer Support Bot", desc: "Automate responses to common queries on WhatsApp.", author: "SIM Team", stars: 124, executions: "12k" },
        { name: "E-commerce Order Tracker", desc: "Send real-time order updates to customers.", author: "SIM Team", stars: 89, executions: "8k" },
        { name: "Abandonment Recovery", desc: "Recover lost sales with automated reminders.", author: "Community", stars: 210, executions: "45k" },
        { name: "AI Lead Qualifier", desc: "Qualify leads using Llama 3.3 before sales handover.", author: "SIM Team", stars: 342, executions: "102k" },
    ];

    return (
        <SIMDashboardLayout title="Templates">
            <div className="flex-1 flex flex-col bg-white dark:bg-[var(--bg)] px-[24px] pt-[28px] overflow-hidden">
                {/* Header */}
                <div className="flex items-start gap-[12px]">
                    <div className="flex h-[26px] w-[26px] items-center justify-center rounded-[6px] border border-[#5BA8D9] bg-[#E8F4FB] dark:border-[#1A5070] dark:bg-[#153347]">
                        <Layout className="h-[14px] w-[14px] text-[#5BA8D9] dark:text-[#33b4ff]" />
                    </div>
                    <div>
                        <h1 className="font-medium text-[18px]">Templates</h1>
                        <p className="mt-[4px] text-[14px] text-[var(--text-tertiary)]">
                            Speed up your build with pre-configured workflow templates.
                        </p>
                    </div>
                </div>

                {/* Search & Tabs */}
                <div className="mt-[24px] flex items-center justify-between">
                    <div className="flex-1 max-w-[400px] h-[32px] flex items-center gap-[6px] rounded-[8px] bg-[var(--surface-4)] px-[8px] border border-[var(--border-sim)]">
                        <Search className="h-[14px] w-[14px] text-[var(--text-subtle)]" />
                        <input placeholder="Search templates..." className="bg-transparent border-none outline-none text-[12px] flex-1 text-[var(--text-primary)]" />
                    </div>
                    <div className="flex gap-2">
                        <button className="h-[32px] px-4 rounded-[6px] bg-[var(--surface-5)] border border-[var(--border-sim)] text-[11px] font-black uppercase">Gallery</button>
                        <button className="h-[32px] px-4 rounded-[6px] hover:bg-[var(--surface-4)] text-[11px] font-black uppercase text-[var(--text-muted)]">Your Templates</button>
                    </div>
                </div>

                {/* Grid */}
                <div className="mt-[32px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px] overflow-y-auto no-scrollbar pb-10">
                    {templates.map((tpl, i) => (
                        <div key={i} className="group relative bg-[var(--surface-2)] border border-[var(--border-sim)] rounded-xl p-5 hover:border-[var(--brand-400)]/50 transition-all cursor-pointer">
                            <div className="h-10 w-10 rounded-lg bg-[var(--surface-4)] border border-[var(--border-sim)] flex items-center justify-center mb-4 group-hover:bg-[var(--brand-400)]/10 transition-colors">
                                <Zap size={20} className="text-[var(--text-muted)] group-hover:text-[var(--brand-400)]" />
                            </div>
                            <h3 className="font-bold text-[15px] text-[var(--text-primary)] mb-1 group-hover:text-[var(--brand-400)] text-sm tracking-tight">{tpl.name}</h3>
                            <p className="text-[12px] text-[var(--text-tertiary)] line-clamp-2 mb-6 h-9 leading-relaxed">{tpl.desc}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-sim)]/30">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-[var(--surface-5)] border border-[var(--border-sim)]" />
                                    <span className="text-[10px] font-bold text-[var(--text-muted)]">{tpl.author}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] font-black">
                                        <Star size={10} className="fill-[var(--text-muted)]" />
                                        {tpl.stars}
                                    </div>
                                    <div className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest">{tpl.executions}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </SIMDashboardLayout>
    );
}
