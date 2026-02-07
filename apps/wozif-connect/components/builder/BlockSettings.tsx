"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { SubBlockConfig, SubBlockCondition } from "@/lib/blocks/types";
import { getBlock } from "@/lib/blocks/registry";
import { Plus, Trash2, ChevronDown, ChevronUp, Code, Variable, Sparkles, Zap, Info, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReferenceInput } from "./ReferenceInput"; // On utilise l'input avec autocomplete

interface BlockSettingsProps {
    nodeId: string;
    type: string;
    config: Record<string, unknown>;
    onUpdateConfig: (newConfig: Record<string, unknown>) => void;
    workflowId?: string;
}

// Évalue si une condition est remplie
const evaluateCondition = (
    condition: SubBlockCondition | (() => SubBlockCondition) | undefined,
    config: Record<string, unknown>
): boolean => {
    if (!condition) return true;

    const cond = typeof condition === 'function' ? condition() : condition;
    const fieldValue = config[cond.field];

    let matches: boolean;
    if (Array.isArray(cond.value)) {
        matches = cond.value.includes(fieldValue as any);
    } else {
        matches = fieldValue === cond.value;
    }

    const result = cond.not ? !matches : matches;

    // Gérer la condition AND
    if (cond.and) {
        const andValue = config[cond.and.field];
        let andMatches: boolean;
        if (Array.isArray(cond.and.value)) {
            andMatches = cond.and.value.includes(andValue as any);
        } else {
            andMatches = andValue === cond.and.value;
        }
        const andResult = cond.and.not ? !andMatches : andMatches;
        return result && andResult;
    }

    return result;
};

export const BlockSettings: React.FC<BlockSettingsProps> = ({
    nodeId,
    type,
    config,
    onUpdateConfig,
    workflowId,
}) => {
    const block = getBlock(type);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [copiedOutput, setCopiedOutput] = useState<string | null>(null);

    const copyToClipboard = async (text: string, key: string) => {
        try {
            await navigator.clipboard.writeText(`<${text}>`);
            setCopiedOutput(key);
            setTimeout(() => setCopiedOutput(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    if (!block) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <Info className="h-8 w-8 text-white/20" />
                </div>
                <p className="text-sm font-medium text-white/40 italic">Configuration non disponible</p>
            </div>
        );
    }

    const handleChange = (id: string, value: unknown) => {
        onUpdateConfig({
            ...config,
            [id]: value,
        });
    };

    // Filtrer les subBlocks selon le mode
    const basicSubBlocks = block.subBlocks.filter(sub =>
        sub.mode !== 'advanced' && evaluateCondition(sub.condition, config)
    );
    const advancedSubBlocks = block.subBlocks.filter(sub =>
        sub.mode === 'advanced' && evaluateCondition(sub.condition, config)
    );

    const renderSubBlock = (sub: SubBlockConfig) => {
        const value = config[sub.id] ?? sub.defaultValue ?? "";

        return (
            <div key={sub.id} className="group/field space-y-2.5 relative">
                <div className="flex items-center justify-between px-0.5">
                    <div className="flex flex-col">
                        <label className="text-[10px] font-black uppercase text-white/40 tracking-[0.15em] mb-0.5 group-hover/field:text-white/60 transition-colors">
                            {sub.title}
                            {sub.required && <span className="text-rose-500 ml-1.5">*</span>}
                        </label>
                        {sub.description && (
                            <p className="text-[9px] text-white/25 leading-normal max-w-[90%]">
                                {sub.description}
                            </p>
                        )}
                    </div>
                </div>

                <div className="relative group/input">
                    {renderInput(sub, value)}
                </div>
            </div>
        );
    };

    const renderInput = (sub: SubBlockConfig, value: unknown) => {
        // Design commun pour les inputs
        const inputBaseClass = "bg-[#0a0a0a]/40 border-white/[0.06] hover:border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-300 rounded-xl text-sm placeholder:text-white/20";

        switch (sub.type) {
            case "short-input":
            case "long-input":
                if (sub.connectionDroppable) {
                    return (
                        <ReferenceInput
                            value={value as string}
                            onChange={(v) => handleChange(sub.id, v)}
                            placeholder={sub.placeholder}
                            multiline={sub.type === "long-input"}
                            rows={sub.rows}
                            className={inputBaseClass}
                            availableBlocks={[]} // À remplir dynamiquement plus tard
                            availableVariables={[]} // À remplir dynamiquement plus tard
                        />
                    );
                }
                return sub.type === "short-input" ? (
                    <Input
                        value={value as string}
                        onChange={(e) => handleChange(sub.id, e.target.value)}
                        placeholder={sub.placeholder}
                        type={sub.password ? "password" : "text"}
                        className={cn(inputBaseClass, "h-11")}
                    />
                ) : (
                    <Textarea
                        value={value as string}
                        onChange={(e) => handleChange(sub.id, e.target.value)}
                        placeholder={sub.placeholder}
                        rows={sub.rows || 4}
                        className={cn(inputBaseClass, "min-h-[100px] py-3 resize-none")}
                    />
                );

            case "number-input":
                return (
                    <Input
                        type="number"
                        value={value as number}
                        onChange={(e) => handleChange(sub.id, parseFloat(e.target.value))}
                        placeholder={sub.placeholder}
                        min={sub.min}
                        max={sub.max}
                        step={sub.step}
                        className={cn(inputBaseClass, "h-11")}
                    />
                );

            case "dropdown":
            case "ai-model-selector":
                return (
                    <Select
                        value={value as string}
                        onValueChange={(val: string) => handleChange(sub.id, val)}
                    >
                        <SelectTrigger className={cn(inputBaseClass, "h-11")}>
                            <SelectValue placeholder="Sélectionner..." />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-950 border-white/10 text-white backdrop-blur-xl">
                            {sub.type === "ai-model-selector" ? (
                                <>
                                    <div className="px-2 py-2 text-[9px] font-bold text-white/20 uppercase tracking-widest">OpenAI</div>
                                    <SelectItem value="gpt-4o-mini" className="rounded-lg">GPT-4o Mini</SelectItem>
                                    <SelectItem value="gpt-4o" className="rounded-lg">GPT-4o</SelectItem>
                                    <div className="px-2 py-2 text-[9px] font-bold text-white/20 uppercase tracking-widest mt-2">Anthropic</div>
                                    <SelectItem value="claude-3-5-sonnet" className="rounded-lg">Claude 3.5 Sonnet</SelectItem>
                                    <SelectItem value="claude-3-opus" className="rounded-lg">Claude 3 Opus</SelectItem>
                                </>
                            ) : (
                                (typeof sub.options === 'function' ? sub.options() : sub.options)?.map((opt) => (
                                    <SelectItem key={opt.id} value={opt.id} className="rounded-lg">
                                        {opt.label}
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                );

            case "switch":
                return (
                    <div className="flex items-center justify-between bg-[#0a0a0a]/40 p-3 rounded-xl border border-white/[0.06] hover:border-white/10 transition-colors">
                        <span className="text-xs text-white/60 font-medium">Activer cette option</span>
                        <Switch
                            checked={!!value}
                            onCheckedChange={(checked) => handleChange(sub.id, checked)}
                            className="data-[state=checked]:bg-primary"
                        />
                    </div>
                );

            case "slider":
                return (
                    <div className="bg-[#0a0a0a]/40 p-4 rounded-xl border border-white/[0.06]">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-primary font-bold">{value as number}</span>
                            <div className="flex gap-1">
                                <span className="text-[9px] text-white/20 uppercase font-bold tracking-tighter">Min: {sub.min}</span>
                                <span className="text-[9px] text-white/20 uppercase font-bold tracking-tighter ml-2">Max: {sub.max}</span>
                            </div>
                        </div>
                        <input
                            type="range"
                            min={sub.min ?? 0}
                            max={sub.max ?? 100}
                            step={sub.step ?? 1}
                            value={value as number}
                            onChange={(e) => handleChange(sub.id, parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>
                );

            case "messages-input":
                return <MessagesInput value={value as any[]} onChange={(v) => handleChange(sub.id, v)} />;

            case "response-format":
                return <ResponseFormatInput value={value as string} onChange={(v) => handleChange(sub.id, v)} />;

            case "tool-input":
                return (
                    <div className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl text-[10px] text-rose-400 font-medium">
                        Type {sub.type} non supporté dans cet aperçu
                    </div>
                );

            case "condition-input":
                return <ConditionInputField value={value as any} onChange={(v) => handleChange(sub.id, v)} />;

            default:
                return (
                    <div className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl text-[10px] text-rose-400 font-medium">
                        Type {sub.type} non supporté dans cet aperçu
                    </div>
                );
        }
    };

    return (
        <div className="px-1 py-4 space-y-8 animate-in fade-in duration-500">
            {/* Elegant Block Card */}
            <div className="relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50 blur-2xl group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="relative z-10 p-6 rounded-[2rem] bg-[#121212]/80 backdrop-blur-3xl border border-white/[0.06] shadow-2xl overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                        <Sparkles className="h-24 w-24 text-white rotate-12" />
                    </div>

                    <div className="flex items-center gap-5 mb-5">
                        <div
                            className="h-16 w-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                            style={{
                                backgroundColor: `${block.bgColor}15`,
                                color: block.bgColor,
                                border: `1px solid ${block.bgColor}30`,
                                boxShadow: `0 20px 40px -10px ${block.bgColor}20`
                            }}
                        >
                            <block.icon className="h-8 w-8 stroke-[1.5]" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-black text-white tracking-tight uppercase">
                                {block.name}
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">
                                    {block.category}
                                </span>
                                <span className="h-1 w-1 rounded-full bg-white/10" />
                                <span className="text-[9px] font-bold text-primary/60 uppercase tracking-widest flex items-center gap-1">
                                    <Zap className="h-2 w-2 fill-primary" /> Active node
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-white/10 w-full mb-5 opacity-50" />

                    <p className="text-[13px] text-white/50 leading-relaxed font-medium">
                        {block.description}
                    </p>
                </div>
            </div>

            {/* Main Parameters */}
            <div className="space-y-8 px-2">
                <div className="flex items-center gap-3">
                    <span className="text-[11px] font-black text-white uppercase tracking-widest whitespace-nowrap">Paramètres de base</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                <div className="grid gap-7">
                    {basicSubBlocks.map(renderSubBlock)}
                </div>
            </div>

            {/* Advanced Section */}
            {advancedSubBlocks.length > 0 && (
                <div className="space-y-6 pt-4">
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="w-full flex items-center justify-center gap-4 py-3 group/btn"
                    >
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10 transition-all group-hover/btn:to-primary/30" />
                        <span className="flex items-center gap-2 text-[10px] font-black uppercase text-white/30 group-hover/btn:text-primary transition-colors tracking-[.2em]">
                            {showAdvanced ? "Masquer les options" : "Options avancées"}
                            {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </span>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10 transition-all group-hover/btn:to-primary/30" />
                    </button>

                    {showAdvanced && (
                        <div className="grid gap-7 px-2 animate-in slide-in-from-top-4 duration-500">
                            {advancedSubBlocks.map(renderSubBlock)}
                        </div>
                    )}
                </div>
            )}

            {/* Enhanced Outputs Panel */}
            <div className="mx-2 mt-12 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-white/30 tracking-[.2em]">Flux de données (Outputs)</span>
                    <Info className="h-3 w-3 text-white/20" />
                </div>
                <div className="flex flex-wrap gap-2.5">
                    {Object.entries(block.outputs).map(([key, output]) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => copyToClipboard(`${nodeId}.${key}`, key)}
                            className={cn(
                                "group/output flex items-center gap-2 pl-3 pr-1 py-1 rounded-full transition-all cursor-pointer",
                                copiedOutput === key
                                    ? "bg-emerald-500/20 border border-emerald-500/30"
                                    : "bg-[#0a0a0a]/60 border border-white/[0.04] hover:border-primary/30 hover:bg-primary/5"
                            )}
                            title={`Cliquez pour copier: <${nodeId}.${key}>`}
                        >
                            <Code className={cn(
                                "h-3 w-3 transition-colors",
                                copiedOutput === key ? "text-emerald-400" : "text-white/20 group-hover/output:text-primary"
                            )} />
                            <span className={cn(
                                "text-[10px] font-mono tracking-tight transition-colors",
                                copiedOutput === key ? "text-emerald-400" : "text-white/50 group-hover/output:text-white"
                            )}>
                                {nodeId}.{key}
                            </span>
                            <div className={cn(
                                "h-6 w-6 rounded-full flex items-center justify-center transition-colors",
                                copiedOutput === key ? "bg-emerald-500/30" : "bg-white/5 group-hover/output:bg-primary/20"
                            )}>
                                {copiedOutput === key ? (
                                    <Check className="h-3 w-3 text-emerald-400" />
                                ) : (
                                    <Copy className="h-3 w-3 text-white/20 group-hover/output:text-primary" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ====== Optimized Complex Inputs ======

// Messages Input
const MessagesInput: React.FC<{
    value: { role: string; content: string }[];
    onChange: (value: { role: string; content: string }[]) => void;
}> = ({ value, onChange }) => {
    const messages = Array.isArray(value) ? value : [];

    const addMessage = () => {
        onChange([...messages, { role: "user", content: "" }]);
    };

    const updateMessage = (index: number, field: "role" | "content", newValue: string) => {
        const updated = [...messages];
        updated[index] = { ...updated[index], [field]: newValue };
        onChange(updated);
    };

    const removeMessage = (index: number) => {
        onChange(messages.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-3">
            {messages.map((msg, index) => (
                <div key={index} className="relative group animate-in zoom-in-95 duration-300">
                    <div className="flex gap-2 items-start p-3 bg-white/[0.02] border border-white/[0.05] rounded-2xl group-hover:bg-white/[0.04] transition-all">
                        <Select
                            value={msg.role}
                            onValueChange={(v: string) => updateMessage(index, "role", v)}
                        >
                            <SelectTrigger className="w-28 bg-[#0a0a0a]/40 border-white/5 h-9 text-[10px] rounded-xl">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-950 border-white/10 text-white backdrop-blur-xl">
                                <SelectItem value="system">System</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="assistant">Assistant</SelectItem>
                            </SelectContent>
                        </Select>
                        <Textarea
                            value={msg.content}
                            onChange={(e) => updateMessage(index, "content", e.target.value)}
                            placeholder="Entrez le contenu du message..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1.5 min-h-[60px] resize-none placeholder:text-white/10"
                        />
                        <button
                            onClick={() => removeMessage(index)}
                            className="mt-1.5 p-1.5 bg-rose-500/10 hover:bg-rose-500/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                        </button>
                    </div>
                </div>
            ))}
            <Button
                variant="ghost"
                size="sm"
                onClick={addMessage}
                className="w-full h-11 rounded-2xl border border-dashed border-white/10 hover:border-primary/50 hover:bg-primary/10 text-[10px] font-black uppercase text-white/30 hover:text-primary transition-all duration-300"
            >
                <Plus className="h-4 w-4 mr-2" /> Ajouter un message
            </Button>
        </div>
    );
};

// Response Format Input
const ResponseFormatInput: React.FC<{
    value: string;
    onChange: (value: string) => void;
}> = ({ value = "", onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="space-y-3">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-[#0a0a0a]/40 border border-white/[0.06] rounded-2xl hover:bg-white/[0.04] transition-all"
            >
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Code className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-[11px] font-bold text-white/60 tracking-wider">
                        {value ? "Schéma JSON configuré" : "Définir un schéma JSON"}
                    </span>
                </div>
                {isOpen ? <ChevronUp className="h-4 w-4 text-white/20" /> : <ChevronDown className="h-4 w-4 text-white/20" />}
            </button>
            {isOpen && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                    <Textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={`{
  "type": "object",
  "properties": {
    "result": { "type": "string" }
  }
}`}
                        className="bg-[#0a0a0a]/60 border-white/10 text-xs min-h-[180px] font-mono py-4 px-5 rounded-2xl focus:ring-primary/20"
                    />
                </div>
            )}
        </div>
    );
};

// Tool Input
const ToolInput: React.FC<{
    value: any[];
    onChange: (value: any[]) => void;
}> = ({ value = [], onChange }) => {
    return (
        <div className="space-y-2">
            <div className="p-3 bg-white/5 border border-white/10 rounded text-center">
                <p className="text-[10px] text-white/40 italic">
                    Configuration des outils bientôt disponible
                </p>
            </div>
        </div>
    );
};

// Condition Input
const ConditionInputField: React.FC<{
    value: any;
    onChange: (value: any) => void;
}> = ({ value = {}, onChange }) => {
    return (
        <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl space-y-4">
            <div className="grid grid-cols-1 gap-3">
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest pl-1">Champ</label>
                        <Input
                            value={value.field || ""}
                            onChange={(e) => onChange({ ...value, field: e.target.value })}
                            placeholder="ex: status"
                            className="bg-[#0a0a0a]/40 border-white/5 h-10 text-xs rounded-xl"
                        />
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                        <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest pl-1">Opérateur</label>
                        <Select
                            value={value.operator || "equals"}
                            onValueChange={(v: string) => onChange({ ...value, operator: v })}
                        >
                            <SelectTrigger className="bg-[#0a0a0a]/40 border-white/5 h-10 text-xs rounded-xl w-full cursor-pointer relative z-20">
                                <SelectValue placeholder="Opérateur" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-950 border-white/10 text-white z-[200]">
                                <SelectItem value="equals">= égal</SelectItem>
                                <SelectItem value="contains">∋ contient</SelectItem>
                                <SelectItem value="greater_than">&gt; supérieur</SelectItem>
                                <SelectItem value="less_than">&lt; inférieur</SelectItem>
                                <SelectItem value="not_equals">≠ différent</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest pl-1">Valeur</label>
                    <Input
                        value={value.value || ""}
                        onChange={(e) => onChange({ ...value, value: e.target.value })}
                        placeholder="Valeur attendue..."
                        className="bg-[#0a0a0a]/40 border-white/5 h-10 text-xs rounded-xl"
                    />
                </div>
            </div>
        </div>
    );
};
