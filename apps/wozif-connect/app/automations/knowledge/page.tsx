"use client";

import React from "react";
import { SIMDashboardLayout } from "@/components/workflow-builder/sim-dashboard/layout/sim-dashboard-layout";
import { Database, Search, Plus, FileText, Globe, FileJson } from "lucide-react";

export default function KnowledgeBasePage() {
    const documents = [
        { name: "Product Catalog 2026.pdf", type: "PDF", size: "2.4 MB", status: "INDEXED", source: "Upload" },
        { name: "FAQ - Technical Support", type: "LINK", size: "N/A", status: "INDEXED", source: "help.wozif.com" },
        { name: "Company Policy v1.docx", type: "DOCX", size: "1.1 MB", status: "PROCESSING", source: "Upload" },
        { name: "API Documentation", type: "JSON", size: "45 KB", status: "INDEXED", source: "Endpoint" },
    ];

    return (
        <SIMDashboardLayout title="Knowledge Base">
            <div className="flex-1 flex flex-col bg-white dark:bg-[var(--bg)] px-[24px] pt-[28px] overflow-hidden">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-[12px]">
                        <div className="flex h-[26px] w-[26px] items-center justify-center rounded-[6px] border border-[#5BA8D9] bg-[#E8F4FB] dark:border-[#1A5070] dark:bg-[#153347]">
                            <Database className="h-[14px] w-[14px] text-[#5BA8D9] dark:text-[#33b4ff]" />
                        </div>
                        <div>
                            <h1 className="font-medium text-[18px]">Knowledge Base</h1>
                            <p className="mt-[4px] text-[14px] text-[var(--text-tertiary)]">
                                Feed your AI agents with custom data and documents.
                            </p>
                        </div>
                    </div>
                    <button className="h-[36px] px-4 rounded-[12px] bg-[var(--brand-400)] text-white font-black uppercase text-[12px] flex items-center gap-2 hover:opacity-90 transition-all shadow-md">
                        <Plus size={16} />
                        Add Source
                    </button>
                </div>

                {/* Toolbar */}
                <div className="mt-[24px] flex items-center gap-4">
                    <div className="flex-1 max-w-[400px] h-[36px] flex items-center gap-[6px] rounded-[10px] bg-[var(--surface-4)] px-[12px] border border-[var(--border-sim)]">
                        <Search className="h-[14px] w-[14px] text-[var(--text-subtle)]" />
                        <input placeholder="Search documents..." className="bg-transparent border-none outline-none text-[12px] flex-1 text-[var(--text-primary)]" />
                    </div>
                </div>

                {/* Grid */}
                <div className="mt-[32px] overflow-y-auto no-scrollbar pb-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[16px]">
                        {documents.map((doc, i) => (
                            <div key={i} className="group flex flex-col p-4 rounded-2xl border border-[var(--border-sim)] bg-[var(--surface-2)] hover:border-[var(--brand-400)]/40 transition-all cursor-pointer">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="h-10 w-10 rounded-xl bg-[var(--surface-4)] border border-[var(--border-sim)] flex items-center justify-center">
                                        {doc.type === 'PDF' && <FileText className="text-red-500" size={20} />}
                                        {doc.type === 'LINK' && <Globe className="text-blue-500" size={20} />}
                                        {doc.type === 'JSON' && <FileJson className="text-yellow-500" size={20} />}
                                        {doc.type === 'DOCX' && <FileText className="text-blue-400" size={20} />}
                                    </div>
                                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-[4px] border ${doc.status === 'INDEXED' ? 'border-[var(--brand-tertiary)]/50 text-[var(--brand-tertiary)] bg-[var(--brand-tertiary)]/5' : 'border-orange-500/50 text-orange-500 bg-orange-500/5'
                                        }`}>
                                        {doc.status}
                                    </span>
                                </div>
                                <h4 className="font-bold text-[13px] text-[var(--text-primary)] truncate mb-1">{doc.name}</h4>
                                <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] font-medium">
                                    <span>{doc.size}</span>
                                    <span className="opacity-30">•</span>
                                    <span>{doc.source}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SIMDashboardLayout>
    );
}
