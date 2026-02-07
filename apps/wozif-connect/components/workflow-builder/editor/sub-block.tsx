"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, ArrowUp, ChevronDown, Check, Sparkles } from "lucide-react";
import * as SIMIcons from "@/components/emcn/icons";
import { SubBlock as SubBlockType } from "../types";

interface SubBlockProps {
    blockId: string;
    config: SubBlockType;
    value: any;
    onChange: (value: any) => void;
    disabled?: boolean;
}

export const SubBlock = ({ blockId, config, value, onChange, disabled }: SubBlockProps) => {
    const [isFocused, setIsFocused] = useState(false);

    const renderInput = () => {
        switch (config.type) {
            case "short-input":
            case "number":
                return (
                    <input
                        type={config.type === "number" ? "number" : config.password ? "password" : "text"}
                        value={value ?? (config.type === "number" ? config.defaultValue : "")}
                        onChange={(e) => onChange(config.type === "number" ? parseFloat(e.target.value) : e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        disabled={disabled}
                        className="w-full h-[32px] bg-[var(--surface-4)] border border-[var(--border-sim)] rounded-md px-3 text-[13px] text-[var(--text-primary)] outline-none focus:border-[var(--brand-secondary)] focus:ring-1 focus:ring-[var(--brand-secondary)]/10 transition-all placeholder:text-[var(--text-muted)]"
                        placeholder={config.placeholder}
                    />
                );

            case "long-input":
            case "template":
                return (
                    <textarea
                        rows={config.type === "template" ? 5 : 3}
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        disabled={disabled}
                        className={cn(
                            "w-full bg-[var(--surface-4)] border border-[var(--border-sim)] rounded-md p-3 text-[13px] text-[var(--text-primary)] outline-none focus:border-[var(--brand-secondary)] transition-all resize-none placeholder:text-[var(--text-muted)]",
                            config.type === "template" ? "font-mono text-[12px]" : ""
                        )}
                        placeholder={config.placeholder}
                    />
                );

            case "dropdown":
                return (
                    <div className="relative">
                        <select
                            value={value || config.defaultValue || ""}
                            onChange={(e) => onChange(e.target.value)}
                            disabled={disabled}
                            className="w-full h-[32px] bg-[var(--surface-4)] border border-[var(--border-sim)] rounded-md px-3 pr-8 text-[13px] text-[var(--text-primary)] outline-none appearance-none focus:border-[var(--brand-secondary)] transition-all cursor-pointer disabled:opacity-50"
                        >
                            <option value="" disabled>Select option...</option>
                            {config.options?.map((opt: { label: string; id: string }) => (
                                <option key={opt.id} value={opt.id}>{opt.label}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                    </div>
                );

            case "checkbox":
                return (
                    <div
                        className={cn(
                            "flex items-center gap-2 group cursor-pointer h-[32px] px-1",
                            disabled && "opacity-50 cursor-not-allowed"
                        )}
                        onClick={() => !disabled && onChange(!value)}
                    >
                        <div className={cn(
                            "w-7 h-4 rounded-full transition-colors relative flex items-center px-0.5",
                            value ? "bg-[var(--brand-tertiary)]" : "bg-[var(--surface-7)]"
                        )}>
                            <div className={cn(
                                "w-3 h-3 rounded-full bg-white shadow-sm transition-transform",
                                value ? "translate-x-3" : "translate-x-0"
                            )} />
                        </div>
                        <span className="text-[12px] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                            {config.title}
                        </span>
                    </div>
                );

            default:
                return <div className="text-[10px] text-red-500">Unsupported type: {config.type}</div>;
        }
    };

    return (
        <div className="space-y-2 group/row">
            {config.type !== 'checkbox' && config.title && (
                <div className="flex items-center justify-between px-0.5">
                    <label className="text-[11px] font-bold uppercase tracking-tight text-[var(--text-muted)] select-none">
                        {config.title}
                        {config.required && <span className="text-[var(--text-error)] ml-1">*</span>}
                    </label>
                </div>
            )}
            <div className="relative">
                {renderInput()}
            </div>
        </div>
    );
};
