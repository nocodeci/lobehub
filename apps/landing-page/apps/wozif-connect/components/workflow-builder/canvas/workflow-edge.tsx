"use client";

import React, { memo, useMemo } from 'react';
import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getSmoothStepPath } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useWorkflowStore } from '../stores/workflow-store';

const WorkflowEdgeComponent = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    style,
    selected,
}: EdgeProps) => {
    const { removeEdge } = useWorkflowStore();

    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        borderRadius: 8,
        offset: 20,
    });

    const isErrorEdge = data?.sourceHandle === 'error';

    const edgeStyle = useMemo(() => {
        let color = 'var(--workflow-edge)';
        let strokeWidth = 2;

        if (isErrorEdge) {
            color = 'var(--text-error)';
        }

        if (selected) {
            strokeWidth = 2.5;
            color = isErrorEdge ? 'var(--text-error)' : 'var(--brand-secondary)';
        }

        return {
            ...style,
            stroke: color,
            strokeWidth,
            transition: 'stroke 0.2s, stroke-width 0.2s',
        };
    }, [style, isErrorEdge, selected]);

    return (
        <>
            <BaseEdge path={edgePath} style={edgeStyle} interactionWidth={20} />
            {selected && (
                <EdgeLabelRenderer>
                    <div
                        className="nodrag nopan absolute pointer-events-auto z-[100] flex items-center justify-center w-5 h-5 bg-[var(--surface-1)] border border-[var(--border-sim)] rounded-full shadow-lg hover:bg-[var(--surface-3)] transition-colors cursor-pointer"
                        style={{
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            removeEdge(id);
                        }}
                    >
                        <X size={10} className="text-[var(--text-error)]" />
                    </div>
                </EdgeLabelRenderer>
            )}
        </>
    );
};

export default memo(WorkflowEdgeComponent);
