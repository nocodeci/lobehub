"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Variable, Code, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseReferences, getSuggestions } from "@/lib/utils/references";

interface ReferenceInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    multiline?: boolean;
    rows?: number;
    className?: string;
    availableBlocks?: { id: string; name: string; outputs: string[] }[];
    availableVariables?: { name: string; type: string }[];
}

export const ReferenceInput: React.FC<ReferenceInputProps> = ({
    value,
    onChange,
    placeholder,
    multiline = false,
    rows = 3,
    className,
    availableBlocks = [],
    availableVariables = [],
}) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [triggerChar, setTriggerChar] = useState<"<" | "{" | null>(null);
    const [cursorPosition, setCursorPosition] = useState(0);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    const suggestions = getSuggestions(availableBlocks, availableVariables);

    // Détecte les caractères déclencheurs
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "<") {
            setTriggerChar("<");
            setShowSuggestions(true);
        } else if (e.key === "{" && value.endsWith("{")) {
            setTriggerChar("{");
            setShowSuggestions(true);
        } else if (e.key === "Escape") {
            setShowSuggestions(false);
            setTriggerChar(null);
        }
    };

    const handleChange = (newValue: string) => {
        onChange(newValue);

        // Vérifier si on est dans un contexte de suggestion
        const lastChars = newValue.slice(-2);
        if (lastChars === "{{") {
            setTriggerChar("{");
            setShowSuggestions(true);
        } else if (newValue.endsWith("<")) {
            setTriggerChar("<");
            setShowSuggestions(true);
        }
    };

    const insertSuggestion = (suggestion: { value: string }) => {
        const input = inputRef.current;
        if (!input) return;

        const pos = input.selectionStart || value.length;
        let insertValue = suggestion.value;

        // Supprimer le caractère déclencheur si présent
        let newValue = value;
        if (triggerChar === "<" && value.endsWith("<")) {
            newValue = value.slice(0, -1) + insertValue;
        } else if (triggerChar === "{" && value.endsWith("{{")) {
            newValue = value.slice(0, -2) + insertValue;
        } else {
            newValue = value + insertValue;
        }

        onChange(newValue);
        setShowSuggestions(false);
        setTriggerChar(null);

        // Remettre le focus
        setTimeout(() => input.focus(), 0);
    };

    // Filtre les suggestions selon le contexte
    const filteredSuggestions = suggestions.filter(s => {
        if (triggerChar === "<") return s.type === "block";
        if (triggerChar === "{") return s.type === "variable";
        return true;
    });

    // Highlight les références dans le texte (pour preview)
    const highlightedValue = useCallback(() => {
        const refs = parseReferences(value);
        if (refs.length === 0) return null;

        return (
            <div className="mt-1 flex flex-wrap gap-1">
                {refs.map((ref, i) => (
                    <span
                        key={i}
                        className={cn(
                            "text-[9px] px-1.5 py-0.5 rounded font-mono",
                            ref.type === "variable"
                                ? "bg-purple-500/20 text-purple-300"
                                : "bg-blue-500/20 text-blue-300"
                        )}
                    >
                        {ref.type === "variable" ? (
                            <Variable className="inline h-2.5 w-2.5 mr-0.5" />
                        ) : (
                            <Code className="inline h-2.5 w-2.5 mr-0.5" />
                        )}
                        {ref.fullPath}
                    </span>
                ))}
            </div>
        );
    }, [value]);

    const InputComponent = multiline ? Textarea : Input;

    return (
        <div className="relative">
            <InputComponent
                ref={inputRef as any}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={multiline ? rows : undefined}
                className={cn(
                    "bg-white/5 border-white/10 text-xs",
                    multiline && "min-h-[60px] resize-none",
                    className
                )}
            />

            {/* Reference hints */}
            {value && highlightedValue()}

            {/* Suggestions dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute z-50 mt-1 w-full max-h-48 overflow-auto rounded-lg bg-zinc-900 border border-white/10 shadow-xl">
                    <div className="p-1.5 text-[9px] text-white/40 uppercase font-bold border-b border-white/10">
                        {triggerChar === "<" ? "Outputs de blocs" : "Variables"}
                    </div>
                    {filteredSuggestions.map((suggestion, i) => (
                        <button
                            key={i}
                            onClick={() => insertSuggestion(suggestion)}
                            className="w-full flex items-center gap-2 px-2 py-1.5 text-left hover:bg-white/10 transition-colors"
                        >
                            {suggestion.type === "variable" ? (
                                <Variable className="h-3 w-3 text-purple-400" />
                            ) : (
                                <Code className="h-3 w-3 text-blue-400" />
                            )}
                            <span className="text-[11px] text-white/80 flex-1 font-mono">
                                {suggestion.label}
                            </span>
                            <ChevronRight className="h-3 w-3 text-white/30" />
                        </button>
                    ))}
                </div>
            )}

            {/* Helper text */}
            <div className="mt-1 text-[9px] text-white/30">
                Tapez <code className="px-1 py-0.5 bg-white/10 rounded">&lt;</code> pour les outputs ou <code className="px-1 py-0.5 bg-white/10 rounded">{"{{"}</code> pour les variables
            </div>
        </div>
    );
};
