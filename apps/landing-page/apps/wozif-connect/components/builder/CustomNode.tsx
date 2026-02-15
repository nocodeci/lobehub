"use client";

import React, { memo, useState } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { getBlock } from "@/lib/blocks/registry";
import { cn } from "@/lib/utils";
import { Settings, Trash2, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CustomNode = memo(({ data, selected, type }: NodeProps) => {
    const block = getBlock(type);
    const name = data.name as string || block?.name || type;
    const [showToolbar, setShowToolbar] = useState(false);

    // Extract handlers from data if available
    const onOpenSettings = (data as any)?.onOpenSettings;
    const onDelete = (data as any)?.onDelete;
    const executionStatus = (data as any)?.executionStatus;

    if (!block) {
        return (
            <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
                <div className="font-bold text-red-500">Unknown: {type}</div>
            </div>
        );
    }

    const Icon = block.icon;

    return (
        <div
            onMouseEnter={() => setShowToolbar(true)}
            onMouseLeave={() => setShowToolbar(false)}
            onDoubleClick={(e) => {
                e.stopPropagation();
                onOpenSettings?.();
            }}
            className="relative"
        >
            {/* Hover Toolbar */}
            <AnimatePresence>
                {(showToolbar || selected) && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute -top-12 left-1/2 -translate-x-1/2 z-[1001] pointer-events-auto"
                    >
                        <div className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-[#1f1f1f] border border-white/10 shadow-xl">
                            <button
                                onClick={(e) => { e.stopPropagation(); }}
                                className="h-7 w-7 rounded-md hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
                            >
                                <Play className="h-3 w-3" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onOpenSettings?.(); }}
                                className="h-7 w-7 rounded-md hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
                            >
                                <Settings className="h-3 w-3" />
                            </button>
                            <div className="w-px h-4 bg-white/10 mx-0.5" />
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
                                className="h-7 w-7 rounded-md hover:bg-red-500/10 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"
                            >
                                <Trash2 className="h-3 w-3" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Execution Status Ring */}
            <AnimatePresence>
                {executionStatus && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.5 }}
                        animate={{ opacity: 1, scale: 1, x: executionStatus === "error" ? [0, -3, 3, -3, 3, 0] : 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={cn(
                            "absolute inset-0 -z-10 rounded-2xl pointer-events-none ring-4 shadow-lg",
                            executionStatus === "success" && "ring-emerald-500/60 shadow-emerald-500/50",
                            executionStatus === "error" && "ring-red-500/80 shadow-red-500/60",
                            executionStatus === "warning" && "ring-orange-500/60 shadow-orange-500/50",
                            executionStatus === "skipped" && "ring-zinc-500/40"
                        )}
                    />
                )}
            </AnimatePresence>

            <div className={cn(
                "group relative min-w-[180px] max-w-[240px] bg-zinc-950 rounded-2xl border-2 transition-all p-3 shadow-2xl overflow-hidden cursor-pointer",
                selected ? "border-primary ring-4 ring-primary/20 scale-105" : "border-white/10 hover:border-white/20"
            )}>
                {/* Background Decorative Element */}
                <div
                    className="absolute -right-8 -top-8 h-24 w-24 opacity-10 blur-3xl rounded-full"
                    style={{ backgroundColor: block.bgColor }}
                />

                <div className="flex gap-3 items-center relative z-10">
                    <div
                        className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: `${block.bgColor}20`, border: `1px solid ${block.bgColor}40`, color: block.bgColor }}
                    >
                        <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <div className="text-[11px] font-black text-white uppercase tracking-tight truncate">
                            {name}
                        </div>
                        <div className="text-[8px] text-white/40 uppercase font-black tracking-widest mt-0.5">
                            {block.category}
                        </div>
                    </div>
                </div>

                {block.category !== 'triggers' && (
                    <Handle
                        type="target"
                        position={Position.Left}
                        className="!w-2.5 !h-2.5 !bg-black !border-[3px] !border-zinc-700 !-left-1.5 transition-all group-hover:!scale-150"
                    />
                )}

                {/* Logic for logic nodes like condition (multiple outputs) */}
                {type === 'condition' ? (
                    <>
                        <div className="absolute -right-1 top-1/4 h-1/2 flex flex-col justify-around">
                            <div className="relative">
                                <span className="absolute -left-5 top-1/2 -translate-y-1/2 text-[7px] font-black uppercase text-emerald-500/80">OUI</span>
                                <Handle
                                    type="source"
                                    position={Position.Right}
                                    id="true"
                                    className="!w-2.5 !h-2.5 !bg-zinc-950 !border-[3px] !border-emerald-500 transition-all hover:!scale-150"
                                    style={{ top: 'auto', bottom: 'auto' }}
                                />
                            </div>
                            <div className="relative">
                                <span className="absolute -left-5 top-1/2 -translate-y-1/2 text-[7px] font-black uppercase text-rose-500/80">NON</span>
                                <Handle
                                    id="false"
                                    type="source"
                                    position={Position.Right}
                                    className="!w-2.5 !h-2.5 !bg-zinc-950 !border-[3px] !border-rose-500 transition-all hover:!scale-150"
                                    style={{ top: 'auto', bottom: 'auto' }}
                                />
                            </div>
                        </div>
                    </>
                ) : type === 'switch' ? (
                    <div className="absolute -right-1 top-0 bottom-0 py-4 flex flex-col justify-around">
                        {(() => {
                            const config = typeof data.node?.config === 'string' ? JSON.parse(data.node.config) : (data.node?.config || {});
                            const cases = (config.cases || "").split("\n").filter((c: string) => c.trim());
                            const hasDefault = config.defaultCase !== false;

                            return (
                                <>
                                    {cases.map((caseLabel: string, idx: number) => (
                                        <div key={idx} className="relative h-6 flex items-center justify-end">
                                            <span className="mr-4 text-[7px] font-black uppercase text-violet-400 opacity-60">
                                                {caseLabel}
                                            </span>
                                            <Handle
                                                type="source"
                                                id={`case_${idx}`}
                                                position={Position.Right}
                                                className="!w-2.5 !h-2.5 !bg-zinc-950 !border-[3px] !border-violet-500 transition-all hover:!scale-150"
                                                style={{ top: 'auto', bottom: 'auto', right: '0' }}
                                            />
                                        </div>
                                    ))}
                                    {hasDefault && (
                                        <div className="relative h-6 flex items-center justify-end">
                                            <span className="mr-4 text-[7px] font-black uppercase text-zinc-500 opacity-60">
                                                AUTRE
                                            </span>
                                            <Handle
                                                type="source"
                                                id="default"
                                                position={Position.Right}
                                                className="!w-2.5 !h-2.5 !bg-zinc-950 !border-[3px] !border-zinc-700 transition-all hover:!scale-150"
                                                style={{ top: 'auto', bottom: 'auto', right: '0' }}
                                            />
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                ) : (
                    <Handle
                        type="source"
                        position={Position.Right}
                        className="!w-2.5 !h-2.5 !bg-zinc-950 !border-[3px] !border-zinc-700 !-right-1.5 transition-all group-hover:!scale-150"
                    />
                )}

                {/* Visual Status Indicator */}
                <div className="absolute top-2 right-2 flex gap-1">
                    <div className="h-1 w-1 rounded-full bg-white/20" />
                    <div className="h-1 w-1 rounded-full bg-white/20" />
                </div>
            </div>
        </div>
    );
});

CustomNode.displayName = "CustomNode";

