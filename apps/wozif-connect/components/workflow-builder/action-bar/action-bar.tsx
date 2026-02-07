"use client";

import React from "react";
import * as SIMIcons from "@/components/emcn/icons";
import { Scan } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionBarProps {
  isTerminalExpanded: boolean;
  leftSidebarWidth?: number;
}

import { useReactFlow } from "@xyflow/react";

export function ActionBar({ isTerminalExpanded }: ActionBarProps) {
  const reactFlowInstance = useReactFlow();

  const handleFitView = () => {
    reactFlowInstance.fitView({ padding: 0.2, duration: 400 });
  };

  const bottomOffset = 16;

  return (
    <div
      className="absolute z-20 flex h-[36px] items-center gap-[2px] rounded-[8px] border border-[var(--border-sim)] bg-[var(--surface-1)] p-[4px] shadow-xl transition-all duration-300 ease-out"
      style={{
        bottom: `${bottomOffset}px`,
        left: `16px`
      }}
    >
      {/* Tool Selector (Hand/Selector) - EXACT SIM STYLE */}
      <div className="flex cursor-pointer items-center gap-[4px] group pr-1">
        <button className="inline-flex items-center justify-center bg-[var(--surface-5)] hover:bg-[var(--surface-6)] text-[var(--text-primary)] border border-[var(--border-sim)] text-[12px] h-[28px] w-[28px] rounded-[6px] transition-colors outline-none shadow-sm">
          <SIMIcons.Hand width={14} height={14} />
        </button>
        <button className="flex items-center text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
          <SIMIcons.ChevronDown width={10} height={8} />
        </button>
      </div>

      {/* Divider */}
      <div className="mx-[4px] h-[20px] w-[1px] bg-[var(--border-sim)] opacity-50"></div>

      {/* Undo/Redo - EXACT SIM STYLE */}
      <div className="flex items-center gap-[1px]">
        <button className="inline-flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-5)] h-[28px] w-[28px] rounded-[6px] transition-all duration-150 disabled:opacity-20 active:scale-95">
          <SIMIcons.Undo width={15} height={15} />
        </button>
        <button className="inline-flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-5)] h-[28px] w-[28px] rounded-[6px] transition-all duration-150 disabled:opacity-20 active:scale-95" disabled>
          <SIMIcons.Redo width={15} height={15} />
        </button>
      </div>

      {/* Divider */}
      <div className="mx-[4px] h-[20px] w-[1px] bg-[var(--border-sim)] opacity-50"></div>

      {/* View Controls (Scan/Fit) - EXACT SIM STYLE */}
      <div className="flex items-center gap-[1px]">
        <button
          onClick={() => reactFlowInstance.zoomIn({ duration: 300 })}
          className="inline-flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-5)] h-[28px] w-[28px] rounded-[6px] transition-all duration-150 active:scale-95"
        >
          <SIMIcons.ZoomIn width={14} height={14} />
        </button>
        <button
          onClick={() => reactFlowInstance.zoomOut({ duration: 300 })}
          className="inline-flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-5)] h-[28px] w-[28px] rounded-[6px] transition-all duration-150 active:scale-95"
        >
          <SIMIcons.ZoomOut width={14} height={14} />
        </button>
        <button
          onClick={handleFitView}
          className="inline-flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-5)] h-[28px] w-[28px] rounded-[6px] transition-all duration-150 active:scale-95"
        >
          <Scan size={14} />
        </button>
      </div>
    </div>
  );
}
