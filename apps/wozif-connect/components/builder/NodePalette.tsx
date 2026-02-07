"use client";

import React, { useState } from "react";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CATEGORIES, getBlocksByCategory } from "@/lib/blocks/registry";
import { motion, AnimatePresence } from "framer-motion";

export const NodePalette: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedCategories, setExpandedCategories] = useState<string[]>(["triggers", "ai", "messages"]);

    const toggleCategory = (id: string) => {
        setExpandedCategories(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";

        // Add a ghost image or styling if needed
        const dragIcon = document.createElement('div');
        dragIcon.style.padding = '8px 16px';
        dragIcon.style.background = '#18181b';
        dragIcon.style.border = '1px solid #3f3f46';
        dragIcon.style.borderRadius = '8px';
        dragIcon.style.color = 'white';
        dragIcon.style.fontSize = '12px';
        dragIcon.innerText = nodeType;
        document.body.appendChild(dragIcon);
        // event.dataTransfer.setDragImage(dragIcon, 0, 0); 
    };

    return (
        <div className="flex flex-col h-full bg-zinc-950 border-r border-white/5">
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xs font-black uppercase tracking-widest text-white/90">
                        Nœuds
                    </h2>
                    <span className="text-[10px] text-white/30 font-medium px-2 py-0.5 rounded-full bg-white/5">
                        Library v2.0
                    </span>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20" />
                    <Input
                        placeholder="Rechercher un bloc..."
                        className="pl-9 bg-white/5 border-white/10 h-9 text-xs focus:ring-1 focus:ring-primary/50 transition-all rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {CATEGORIES.map((cat) => {
                    const blocks = getBlocksByCategory(cat.id).filter(b =>
                        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        b.description.toLowerCase().includes(searchTerm.toLowerCase())
                    );

                    if (searchTerm && blocks.length === 0) return null;

                    const isExpanded = expandedCategories.includes(cat.id);

                    return (
                        <div key={cat.id} className="space-y-1">
                            <button
                                onClick={() => toggleCategory(cat.id)}
                                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-all group"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="h-6 w-6 rounded-lg bg-zinc-900 flex items-center justify-center text-white/40 group-hover:text-primary transition-colors">
                                        <cat.icon className="h-4 w-4" />
                                    </div>
                                    <span className="text-[11px] font-bold text-white/70 uppercase tracking-tight">
                                        {cat.name}
                                    </span>
                                </div>
                                {isExpanded ? (
                                    <ChevronDown className="h-3.5 w-3.5 text-white/20" />
                                ) : (
                                    <ChevronRight className="h-3.5 w-3.5 text-white/20" />
                                )}
                            </button>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden space-y-1 pl-1"
                                    >
                                        {blocks.map((block) => (
                                            <div
                                                key={block.type}
                                                draggable
                                                onDragStart={(e) => onDragStart(e, block.type)}
                                                className="group relative h-20 w-full rounded-2xl bg-zinc-900/50 border border-white/5 p-3 cursor-grab active:cursor-grabbing hover:bg-zinc-900 hover:border-white/10 transition-all overflow-hidden"
                                            >
                                                {/* Background Glow */}
                                                <div
                                                    className="absolute -right-4 -bottom-4 h-16 w-16 opacity-5 blur-2xl rounded-full"
                                                    style={{ backgroundColor: block.bgColor }}
                                                />

                                                <div className="flex gap-3 h-full relative z-10">
                                                    <div
                                                        className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110"
                                                        style={{ backgroundColor: `${block.bgColor}15`, border: `1px solid ${block.bgColor}30`, color: block.bgColor }}
                                                    >
                                                        <block.icon className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex flex-col justify-center min-w-0">
                                                        <h3 className="text-[11px] font-black text-white leading-tight truncate uppercase tracking-tight">
                                                            {block.name}
                                                        </h3>
                                                        <p className="text-[9px] text-white/40 leading-tight mt-1 line-clamp-2 italic font-medium">
                                                            {block.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
