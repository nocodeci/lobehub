"use client";

import React, { useState, useEffect } from "react";
import { useWorkflowStore } from "../stores/workflow-store";
import { getBlockById } from "../blocks/block-configs";
import { SubBlock } from "../types";
import { Pencil, Check, Info, ChevronDown, BookOpen } from "lucide-react";
import * as SIMIcons from "@/components/emcn/icons";
import { cn } from "@/lib/utils";

import { SubBlock as SubBlockComponent } from "./sub-block";
import { SubBlock as SubBlockType } from "../types";

export const Editor = () => {
    const { nodes, selectedNodeId, updateNode, removeNode } = useWorkflowStore();
    const selectedNode = nodes.find(n => n.id === selectedNodeId);
    const blockConfig = selectedNode ? getBlockById(selectedNode.data.type) : null;

    const [isRenaming, setIsRenaming] = useState(false);
    const [editedName, setEditedName] = useState("");

    useEffect(() => {
        if (selectedNode) {
            setEditedName(selectedNode.data.label);
        }
    }, [selectedNodeId]);

    if (!selectedNode || !blockConfig) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center text-center p-8 bg-[var(--surface-1)] h-full">
                <div className="space-y-6">
                    <div className="mx-auto w-16 h-16 rounded-full bg-[var(--surface-3)] flex items-center justify-center border border-[var(--border-sim)] shadow-sm">
                        <Info size={28} className="text-[var(--text-muted)] opacity-50" />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-[var(--text-primary)]">Configuration</h4>
                        <p className="text-[11px] text-[var(--text-muted)] leading-relaxed max-w-[200px] mx-auto">
                            Selectionnez un bloc sur le canvas pour configurer ses paramètres industriels.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const Icon = blockConfig.icon;

    const handleSaveRename = () => {
        if (editedName.trim()) {
            updateNode(selectedNode.id, {
                data: { ...selectedNode.data, label: editedName.trim() }
            });
        }
        setIsRenaming(false);
    };

    const handleInputChange = (inputId: string, value: any) => {
        updateNode(selectedNode.id, {
            data: {
                ...selectedNode.data,
                config: {
                    ...selectedNode.data.config,
                    [inputId]: value
                }
            }
        });
    };

    return (
        <div className="flex h-full flex-col bg-[var(--surface-1)]">
            {/* Header EXACT SIM STYLE */}
            <div className="mx-[-1px] flex flex-shrink-0 items-center justify-between rounded-[4px] border border-[var(--border-sim)] bg-[var(--surface-4)] px-[12px] py-[6px]">
                <div className="flex min-w-0 flex-1 items-center gap-[8px]">
                    <div
                        className="flex h-[18px] w-[18px] items-center justify-center rounded-[4px]"
                        style={{ backgroundColor: blockConfig.color }}
                    >
                        {Icon && <Icon className="h-[12px] w-[12px] text-white" />}
                    </div>
                    {isRenaming ? (
                        <input
                            autoFocus
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            onBlur={handleSaveRename}
                            onKeyDown={(e) => e.key === "Enter" && handleSaveRename()}
                            className="min-w-0 flex-1 bg-transparent pr-[8px] font-medium text-[14px] text-[var(--text-primary)] outline-none"
                        />
                    ) : (
                        <h2
                            className="min-w-0 flex-1 cursor-pointer select-none truncate pr-[8px] font-medium text-[14px] text-[var(--text-primary)]"
                            onDoubleClick={() => setIsRenaming(true)}
                        >
                            {selectedNode.data.label}
                        </h2>
                    )}
                </div>
                <div className="flex shrink-0 items-center gap-[8px]">
                    <button
                        onClick={() => isRenaming ? handleSaveRename() : setIsRenaming(true)}
                        className="p-1 hover:bg-[var(--surface-6)] rounded transition-colors text-[var(--text-muted)]"
                    >
                        {isRenaming ? <Check size={14} /> : <Pencil size={14} />}
                    </button>
                    <button className="p-1 hover:bg-[var(--surface-6)] rounded transition-colors text-[var(--text-muted)]">
                        <BookOpen size={14} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-0">
                {/* Description Banner */}
                <div className="px-4 py-3 bg-[var(--surface-2)]/50 border-b border-[var(--border-sim)]">
                    <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
                        {blockConfig.description}
                    </p>
                </div>

                <div className="p-4 space-y-8">
                    {/* Parameters Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-3 rounded-full bg-[var(--brand-tertiary)]" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Paramètres Bloc</h3>
                        </div>

                        {blockConfig.subBlocks && blockConfig.subBlocks.length > 0 ? (
                            <div className="space-y-6">
                                {blockConfig.subBlocks.map((config, idx: number) => (
                                    <div key={config.id}>
                                        <SubBlockComponent
                                            blockId={selectedNode.id}
                                            config={config}
                                            value={selectedNode.data.config?.[config.id]}
                                            onChange={(val: any) => handleInputChange(config.id, val)}
                                        />

                                        {idx < (blockConfig.subBlocks?.length || 0) - 1 && (
                                            <div className="pt-6 pb-2">
                                                <div className="h-[1px] w-full" style={{ backgroundImage: 'repeating-linear-gradient(to right, var(--border-sim) 0px, var(--border-sim) 4px, transparent 4px, transparent 8px)' }} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 px-4 text-center border border-dashed border-[var(--border-sim)] rounded-lg bg-[var(--surface-2)]/30">
                                <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-widest font-bold">Aucun paramètre configurable</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Actions EXACT SIM STYLE */}
            <div className="p-3 border-t border-[var(--border-sim)] flex items-center justify-between bg-[var(--surface-3)]">
                <button
                    onClick={() => removeNode(selectedNode.id)}
                    className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-black text-[var(--text-error)] hover:bg-[var(--text-error)]/10 rounded-md transition-all uppercase tracking-widest border border-transparent hover:border-[var(--text-error)]/20"
                >
                    <SIMIcons.Trash width={12} height={12} />
                    Supprimer Bloc
                </button>
                <div className="flex items-center gap-1">
                    <button className="p-2 hover:bg-[var(--surface-5)] rounded-md transition-colors text-[var(--text-muted)]">
                        <SIMIcons.Rocket width={14} height={14} />
                    </button>
                    <button className="p-2 hover:bg-[var(--surface-5)] rounded-md transition-colors text-[var(--text-muted)]">
                        <SIMIcons.MoreHorizontal width={14} height={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

