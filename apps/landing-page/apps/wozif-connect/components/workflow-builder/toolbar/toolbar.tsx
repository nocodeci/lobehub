"use client";

import React, { useState, useRef, useCallback, memo } from "react";
import { triggerBlocks, actionBlocks } from "../blocks/block-configs";
import { BlockConfig } from "../types";
import { cn } from "@/lib/utils";
import { SearchIcon } from "@/components/icons";
import { ChevronDown, ChevronRight, Search, GripHorizontal } from "lucide-react";

interface ToolbarItemProps {
    block: BlockConfig;
    onAddBlock: (type: string) => void;
}


const ToolbarItem = memo(({ block, onAddBlock }: ToolbarItemProps) => {
    const Icon = block.icon;
    return (
        <div
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData("application/xyflow", block.type);
                e.dataTransfer.effectAllowed = "move";
            }}
            onClick={() => onAddBlock(block.type)}
            className="group flex h-[28px] items-center gap-[8px] rounded-[8px] px-[6px] text-[14px] cursor-pointer hover:bg-[var(--surface-6)] dark:hover:bg-[var(--surface-5)] transition-colors active:scale-[0.98]"
        >
            <div
                className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center overflow-hidden rounded-[4px]"
                style={{ backgroundColor: block.color }}
            >
                {Icon && <Icon className="text-white !h-[12px] !w-[12px]" />}
            </div>
            <span className="truncate font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] text-[12px]">
                {block.name}
            </span>
        </div>
    );
});

ToolbarItem.displayName = "ToolbarItem";

const CATEGORIES = [
    { id: 'triggers', label: 'Triggers', color: 'var(--brand-tertiary)' },
    { id: 'ai', label: 'AI & Intelligence', color: '#10a37f' },
    { id: 'messages', label: 'Messaging', color: '#25D366' },
    { id: 'logic', label: 'Logic & Flow', color: '#ef4444' },
    { id: 'crm', label: 'CRM & Data', color: '#3b82f6' },
    { id: 'integrations', label: 'Integrations', color: '#8e4cfb' },
    { id: 'tools', label: 'Tools', color: '#f59e0b' },
];

export const Toolbar = ({ onAddBlock }: { onAddBlock: (type: string) => void }) => {
    const [search, setSearch] = useState("");
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['triggers', 'ai', 'messages']));

    const toggleCategory = (id: string) => {
        const next = new Set(expandedCategories);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setExpandedCategories(next);
    };

    const allBlocks = [...triggerBlocks, ...actionBlocks];
    const filteredBlocks = allBlocks.filter(b =>
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div id="toolbar-container" className="flex h-full flex-col bg-[var(--surface-1)]">
            {/* Header compact SIM Style */}
            <div
                className="mx-[-1px] flex flex-shrink-0 cursor-pointer items-center justify-between rounded-[4px] border border-[var(--border-sim)] bg-[var(--surface-4)] px-[12px] py-[6px]"
                onClick={() => setIsSearchActive(true)}
            >
                <h2 className="font-black uppercase tracking-widest text-[11px] text-[var(--text-primary)]">Palette</h2>
                <div className="flex shrink-0 items-center gap-[8px]">
                    {isSearchActive ? (
                        <input
                            autoFocus
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onBlur={() => !search && setIsSearchActive(false)}
                            className="w-[120px] border-none bg-transparent pr-[2px] text-right font-medium text-[11px] text-[var(--text-primary)] placeholder:text-[#737373] focus:outline-none"
                            placeholder="Search..."
                        />
                    ) : (
                        <Search className="h-[12px] w-[12px] text-[var(--text-muted)]" />
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar py-2">
                {CATEGORIES.map((cat) => {
                    const blocksInCat = filteredBlocks.filter(b => b.category === cat.id);
                    if (blocksInCat.length === 0) return null;
                    const isExpanded = expandedCategories.has(cat.id) || search.length > 0;

                    return (
                        <div key={cat.id} className="flex flex-col mb-1">
                            <button
                                onClick={() => toggleCategory(cat.id)}
                                className="px-[10px] py-[6px] flex items-center justify-between group hover:bg-[var(--surface-4)] transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                                    <span className="font-bold text-[10px] uppercase tracking-wider text-[var(--text-muted)] group-hover:text-[var(--text-primary)]">
                                        {cat.label}
                                    </span>
                                </div>
                                {isExpanded ? <ChevronDown size={12} className="text-[var(--text-muted)]" /> : <ChevronRight size={12} className="text-[var(--text-muted)]" />}
                            </button>

                            {isExpanded && (
                                <div className="px-[6px] space-y-[1px] mt-1 mb-2">
                                    {blocksInCat.map((block) => (
                                        <ToolbarItem key={block.id} block={block} onAddBlock={onAddBlock} />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
