"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { WorkflowNode } from "../types";
import { getBlockById } from "../blocks/block-configs";
import { cn } from "@/lib/utils";

const CustomNode = ({ data, selected }: NodeProps<WorkflowNode>) => {
    const blockConfig = getBlockById(data.type as string);
    const Icon = blockConfig?.icon;

    return (
        <div
            className={cn(
                "relative w-[250px] select-none rounded-[8px] border bg-[var(--surface-2)] shadow-2xl transition-all duration-150 overflow-hidden",
                selected ? "border-[var(--brand-secondary)] ring-[1.75px] ring-[var(--brand-secondary)]" : "border-[var(--border-sim)] hover:border-[var(--text-muted)]"
            )}
        >
            {/* Selection/Success/Error Ring Overlay is handled by the ring class above in SIM style */}

            {/* Header - EXACT SAME STRUCTURE AS SIM block.tsx */}
            <div className={cn(
                "flex items-center justify-between p-[8px]",
                "border-[var(--border-sim)] border-b"
            )}>
                <div className="relative z-10 flex min-w-0 flex-1 items-center gap-[10px]">
                    <div
                        className="flex h-[24px] w-[24px] flex-shrink-0 items-center justify-center rounded-[6px]"
                        style={{ background: blockConfig?.color || "#666" }}
                    >
                        {Icon && <Icon className="h-[16px] w-[16px] text-white" />}
                    </div>
                    <span className="truncate font-medium text-[16px] text-[var(--text-primary)]" title={data.label}>
                        {data.label}
                    </span>
                </div>
            </div>

            {/* Content area SIM Style */}
            <div className="flex flex-col gap-[8px] p-[8px]">
                {/* Dynamic Outputs based on block type/category */}
                {blockConfig?.category === 'triggers' ? (
                    <>
                        <div className="flex items-center gap-[8px]">
                            <span className="min-w-0 truncate text-[14px] text-[var(--text-tertiary)] capitalize">input</span>
                            <span className="flex-1 truncate text-right text-[14px] text-[var(--text-primary)] opacity-40">-</span>
                        </div>
                        <div className="flex items-center gap-[8px]">
                            <span className="min-w-0 truncate text-[14px] text-[var(--text-tertiary)] capitalize">files</span>
                            <span className="flex-1 truncate text-right text-[14px] text-[var(--text-primary)] opacity-40">-</span>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-[8px]">
                            <span className="min-w-0 truncate text-[14px] text-[var(--text-tertiary)] capitalize">output</span>
                            <span className="flex-1 truncate text-right text-[14px] text-[var(--text-primary)] opacity-40">-</span>
                        </div>
                        {/* Error output - Not for triggers */}
                        <div className="flex items-center gap-[8px]">
                            <span className="min-w-0 truncate text-[14px] text-[var(--text-tertiary)] capitalize">error</span>
                        </div>
                    </>
                )}
            </div>

            {/* Handles SIM Style - Industrial discrete handles */}
            {/* Target handle (Input) - Not for triggers */}
            {blockConfig?.category !== 'triggers' && (
                <Handle
                    type="target"
                    position={Position.Top}
                    className="!border-none !bg-[var(--surface-7)] !h-[7px] !w-5 !rounded-[2px] !top-[-4px] !left-1/2 !-translate-x-1/2 cursor-crosshair hover:!bg-[var(--brand-secondary)] transition-colors"
                />
            )}

            {/* Source handle (Output) - Not for end nodes */}
            {data.type !== 'end_flow' && (
                <Handle
                    type="source"
                    position={Position.Bottom}
                    className="!border-none !bg-[var(--surface-7)] !h-[7px] !w-5 !rounded-[2px] !bottom-[-4px] !left-1/2 !-translate-x-1/2 cursor-crosshair hover:!bg-[var(--brand-secondary)] transition-colors"
                />
            )}
        </div>
    );
};

export default memo(CustomNode);
