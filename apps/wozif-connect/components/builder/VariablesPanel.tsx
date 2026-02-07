"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVariablesStore, Variable, VariableType } from "@/lib/stores/variables";
import { Plus, Trash2, Edit2, Check, X, Variable as VariableIcon, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface VariablesPanelProps {
    workflowId: string;
    className?: string;
}

export const VariablesPanel: React.FC<VariablesPanelProps> = ({
    workflowId,
    className,
}) => {
    const {
        addVariable,
        updateVariable,
        deleteVariable,
        getVariablesByWorkflowId
    } = useVariablesStore();

    const variables = getVariablesByWorkflowId(workflowId);
    const [isExpanded, setIsExpanded] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // New variable form state
    const [newName, setNewName] = useState("");
    const [newType, setNewType] = useState<VariableType>("string");
    const [newValue, setNewValue] = useState("");

    // Edit form state
    const [editName, setEditName] = useState("");
    const [editValue, setEditValue] = useState("");

    const handleAdd = () => {
        if (!newName.trim()) return;

        let parsedValue: unknown = newValue;
        try {
            if (newType === "number") parsedValue = parseFloat(newValue) || 0;
            else if (newType === "boolean") parsedValue = newValue.toLowerCase() === "true";
            else if (newType === "object" || newType === "array") parsedValue = JSON.parse(newValue);
        } catch (e) {
            // Keep as string if parsing fails
        }

        addVariable({
            workflowId,
            name: newName.trim(),
            type: newType,
            value: parsedValue,
        });

        setNewName("");
        setNewType("string");
        setNewValue("");
        setIsAdding(false);
    };

    const handleEdit = (variable: Variable) => {
        setEditingId(variable.id);
        setEditName(variable.name);
        setEditValue(typeof variable.value === "object" ? JSON.stringify(variable.value) : String(variable.value ?? ""));
    };

    const handleSaveEdit = (id: string, type: VariableType) => {
        let parsedValue: unknown = editValue;
        try {
            if (type === "number") parsedValue = parseFloat(editValue) || 0;
            else if (type === "boolean") parsedValue = editValue.toLowerCase() === "true";
            else if (type === "object" || type === "array") parsedValue = JSON.parse(editValue);
        } catch (e) {
            // Keep as string if parsing fails
        }

        updateVariable(id, { name: editName, value: parsedValue });
        setEditingId(null);
    };

    const getTypeColor = (type: VariableType) => {
        switch (type) {
            case "string": return "text-green-400";
            case "number": return "text-blue-400";
            case "boolean": return "text-purple-400";
            case "object": return "text-yellow-400";
            case "array": return "text-orange-400";
            default: return "text-white/60";
        }
    };

    return (
        <div className={cn("rounded-xl bg-white/5 border border-white/10", className)}>
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <VariableIcon className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold uppercase text-white/70">
                        Variables
                    </span>
                    <span className="text-[10px] text-white/40">
                        ({variables.length})
                    </span>
                </div>
                {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-white/40" />
                ) : (
                    <ChevronDown className="h-4 w-4 text-white/40" />
                )}
            </button>

            {isExpanded && (
                <div className="p-3 pt-0 space-y-2">
                    {/* Variables list */}
                    {variables.length === 0 && !isAdding && (
                        <div className="text-center py-4">
                            <p className="text-[10px] text-white/30 italic">
                                Aucune variable définie
                            </p>
                            <p className="text-[9px] text-white/20 mt-1">
                                Utilisez {"{{variables.name}}"} pour les référencer
                            </p>
                        </div>
                    )}

                    {variables.map((variable) => (
                        <div
                            key={variable.id}
                            className="flex items-center gap-2 p-2 rounded-lg bg-white/5 group"
                        >
                            {editingId === variable.id ? (
                                <>
                                    <Input
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="flex-1 h-7 bg-white/10 border-white/20 text-xs"
                                        placeholder="Nom"
                                    />
                                    <Input
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="flex-1 h-7 bg-white/10 border-white/20 text-xs"
                                        placeholder="Valeur"
                                    />
                                    <button
                                        onClick={() => handleSaveEdit(variable.id, variable.type)}
                                        className="p-1.5 hover:bg-green-500/20 rounded"
                                    >
                                        <Check className="h-3 w-3 text-green-400" />
                                    </button>
                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="p-1.5 hover:bg-red-500/20 rounded"
                                    >
                                        <X className="h-3 w-3 text-red-400" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span className={cn("text-[10px] font-mono", getTypeColor(variable.type))}>
                                        {variable.type.slice(0, 3)}
                                    </span>
                                    <span className="text-xs text-white/80 font-medium flex-1 truncate">
                                        {variable.name}
                                    </span>
                                    <span className="text-xs text-white/40 truncate max-w-[100px]">
                                        {typeof variable.value === "object"
                                            ? JSON.stringify(variable.value).slice(0, 20) + "..."
                                            : String(variable.value ?? "")}
                                    </span>
                                    <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(variable)}
                                            className="p-1.5 hover:bg-white/10 rounded"
                                        >
                                            <Edit2 className="h-3 w-3 text-white/60" />
                                        </button>
                                        <button
                                            onClick={() => deleteVariable(variable.id)}
                                            className="p-1.5 hover:bg-red-500/20 rounded"
                                        >
                                            <Trash2 className="h-3 w-3 text-red-400" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}

                    {/* Add new variable form */}
                    {isAdding ? (
                        <div className="space-y-2 p-2 rounded-lg border border-dashed border-white/20 bg-white/5">
                            <div className="flex gap-2">
                                <Input
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Nom de la variable"
                                    className="flex-1 h-8 bg-white/10 border-white/20 text-xs"
                                />
                                <Select value={newType} onValueChange={(v: VariableType) => setNewType(v)}>
                                    <SelectTrigger className="w-24 h-8 bg-white/10 border-white/20 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-white/10">
                                        <SelectItem value="string" className="text-xs">String</SelectItem>
                                        <SelectItem value="number" className="text-xs">Number</SelectItem>
                                        <SelectItem value="boolean" className="text-xs">Boolean</SelectItem>
                                        <SelectItem value="object" className="text-xs">Object</SelectItem>
                                        <SelectItem value="array" className="text-xs">Array</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Input
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                                placeholder="Valeur initiale"
                                className="h-8 bg-white/10 border-white/20 text-xs"
                            />
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={handleAdd}
                                    className="flex-1 h-7 text-[10px]"
                                >
                                    <Check className="h-3 w-3 mr-1" /> Ajouter
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setIsAdding(false)}
                                    className="h-7 text-[10px]"
                                >
                                    Annuler
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsAdding(true)}
                            className="w-full h-8 text-[10px] border border-dashed border-white/10 hover:border-white/20"
                        >
                            <Plus className="h-3 w-3 mr-1" /> Nouvelle variable
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};
