"use client";

import React, { useState } from "react";
import { BlockConfigProps, parseConfig } from "./types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Sparkles,
  Bold,
  Italic,
  Code,
  List,
  ListOrdered,
  Eye,
  Bot,
  ChevronRight,
  X,
} from "lucide-react";

// Bloc GPT Analyze (Analyse d'intention)
export function GPTAnalyzeConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    model: "gpt-4o-mini",
    system: "Tu es un expert en analyse d'intention client. Analyse le message et catégorise-le précisément.",
    categories: "Vente, Support, Facturation, Plainte, Autre",
    outputFields: ["type", "urgency", "autoResolvable", "keywords"],
    temperature: 0.1,
    customOutputs: [] as Array<{ name: string; path: string; description: string }>,
  });

  const [newIntent, setNewIntent] = useState("");

  const toggleField = (field: string) => {
    const currentFields = config.outputFields || [];
    const newFields = currentFields.includes(field)
      ? currentFields.filter((f: string) => f !== field)
      : [...currentFields, field];
    updateConfig({ ...config, outputFields: newFields });
  };

  const addCustomOutput = () => {
    const newOutputs = [...(config.customOutputs || []), { name: "", path: "", description: "" }];
    updateConfig({ ...config, customOutputs: newOutputs });
  };

  const updateCustomOutput = (index: number, field: "name" | "path" | "description", value: string) => {
    const newOutputs = [...(config.customOutputs || [])];
    newOutputs[index] = { ...newOutputs[index], [field]: value };
    updateConfig({ ...config, customOutputs: newOutputs });
  };

  const removeCustomOutput = (index: number) => {
    const newOutputs = (config.customOutputs || []).filter((_: any, i: number) => i !== index);
    updateConfig({ ...config, customOutputs: newOutputs });
  };

  const generateAnalyzePrompt = async () => {
    try {
      const fieldsDesc = (config.outputFields || []).map((f: string) => {
        if (f === 'type') return `- type: une des intentions définies (${config.categories})`;
        if (f === 'urgency') return `- urgency: niveau d'urgence (1 à 5)`;
        if (f === 'autoResolvable') return `- autoResolvable: "oui" ou "non"`;
        if (f === 'keywords') return `- keywords: liste des mots clés importants`;
        return `- ${f}`;
      }).join('\n');

      const prompt = `Génère des instructions système pour une IA dont le rôle est d'analyser l'intention des messages clients.
L'IA doit retourner UNIQUEMENT un JSON avec ces champs:
${fieldsDesc}

Intentions à reconnaître: ${config.categories}

Sois bref et technique.`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          systemPrompt: "Tu es un expert en conception de prompts pour l'analyse d'intention.",
          model: "gpt-4o-mini",
          temperature: 0.7
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.response) {
          updateConfig({ ...config, system: data.response.trim() });
        }
      }
    } catch (error) {
      console.error("Erreur lors de la génération du prompt:", error);
    }
  };

  return (
    <div className="space-y-5">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#10a37f22] to-transparent border border-[#10a37f33] space-y-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <Brain className="h-24 w-24 text-[#10a37f]" />
        </div>

        <div className="flex items-center justify-between relative">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-[#10a37f22] flex items-center justify-center border-2 border-[#10a37f33]">
              <Brain className="h-3.5 w-3.5 text-[#10a37f]" />
            </div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/80">
              Analyse d'Intention
            </label>
            <Badge className="bg-[#10a37f22] text-[#10a37f] border-none text-[8px] font-bold uppercase px-2 shadow-sm">
              {config.model}
            </Badge>
          </div>
        </div>
      </div>

      {/* Catégories */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <label className="text-[9px] font-bold text-white/80 uppercase tracking-wider">
            Intentions à détecter
          </label>
          <span className="text-[9px] text-white/40">
            {(config.categories || "").split(',').filter((v: string) => v.trim()).length} types
          </span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newIntent}
            onChange={(e) => setNewIntent(e.target.value)}
            placeholder="Ex: SAV, Facturation..."
            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/30 focus:border-[#10a37f40] focus:outline-none transition-colors"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const list = (config.categories || "").split(',').map((v: string) => v.trim()).filter(Boolean);
                if (newIntent && !list.includes(newIntent)) {
                  updateConfig({ ...config, categories: [...list, newIntent].join(', ') });
                  setNewIntent("");
                }
              }
            }}
          />
          <button
            onClick={() => {
              const list = (config.categories || "").split(',').map((v: string) => v.trim()).filter(Boolean);
              if (newIntent && !list.includes(newIntent)) {
                updateConfig({ ...config, categories: [...list, newIntent].join(', ') });
                setNewIntent("");
              }
            }}
            className="px-3 py-2 bg-[#10a37f22] border border-[#10a37f33] text-white text-xs font-semibold rounded-lg hover:bg-[#10a37f33] transition-colors"
          >
            Ajouter
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {(config.categories || "Autre").split(',').map((intent: string, idx: number) => (
            <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg group hover:border-[#10a37f40] transition-all">
              <span className="text-xs text-white/80">{intent.trim()}</span>
              <button
                onClick={() => {
                  const list = (config.categories || "").split(',').map((v: string) => v.trim()).filter(Boolean);
                  updateConfig({ ...config, categories: list.filter((_, i) => i !== idx).join(', ') });
                }}
                className="text-white/20 hover:text-red-400 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <label className="text-[9px] font-bold text-white/80 uppercase tracking-wider">
            Instructions d'Analyse
          </label>
          <button
            onClick={generateAnalyzePrompt}
            className="flex items-center gap-1 text-[10px] text-[#10a37f] hover:text-[#10a37f]/80 font-bold transition-colors"
          >
            <Sparkles className="h-3 w-3" />
            Auto-Générer
          </button>
        </div>
        <textarea
          value={config.system}
          onChange={(e) => updateConfig({ ...config, system: e.target.value })}
          className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white/90 leading-relaxed font-mono focus:border-[#10a37f55] transition-all resize-none"
          placeholder="Décrivez comment l'IA doit analyser le message..."
        />
      </div>

      {/* Champs JSON */}
      <div className="space-y-4 border-t border-white/5 pt-4">
        <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest px-1">
          Champs de Sortie JSON
        </label>
        <div className="space-y-2">
          {[
            { id: 'type', label: 'Type d\'intention', desc: 'Identifie la catégorie' },
            { id: 'urgency', label: 'Niveau d\'urgence', desc: 'Score de 1 à 5' },
            { id: 'autoResolvable', label: 'Résolution Bot', desc: 'Suggère si le bot peut répondre' },
            { id: 'keywords', label: 'Mots clés', desc: 'Extractions textuelles' },
          ].map((field) => (
            <div
              key={field.id}
              onClick={() => toggleField(field.id)}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${(config.outputFields || []).includes(field.id)
                ? "bg-[#10a37f11] border-[#10a37f33]"
                : "bg-white/5 border-white/5 opacity-40 hover:opacity-100"
                }`}
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">{field.label}</span>
                <span className="text-[9px] text-white/40">{field.desc}</span>
              </div>
              <div className={`w-8 h-4 rounded-full relative transition-colors ${(config.outputFields || []).includes(field.id) ? "bg-[#10a37f]" : "bg-white/10"}`}>
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${(config.outputFields || []).includes(field.id) ? "right-0.5" : "left-0.5"}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Température */}
      <div className="space-y-3 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between px-1">
          <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
            Précision vs Créativité
          </label>
          <span className="text-[10px] font-mono text-[#10a37f]">{config.temperature}</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={config.temperature}
          onChange={(e) => updateConfig({ ...config, temperature: parseFloat(e.target.value) })}
          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#10a37f]"
        />
      </div>

      {/* Custom Fields */}
      <div className="space-y-3 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between px-1">
          <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
            Variables Personnalisées
          </label>
          <button onClick={addCustomOutput} className="text-[10px] text-[#10a37f] hover:underline font-bold">+ Ajouter</button>
        </div>
        <div className="space-y-2">
          {config.customOutputs?.map((output, idx) => (
            <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-2 relative group">
              <button onClick={() => removeCustomOutput(idx)} className="absolute top-2 right-2 p-1 text-white/20 hover:text-red-400"><X className="h-3 w-3" /></button>
              <div className="grid grid-cols-2 gap-2 pr-6">
                <Input
                  value={output.name}
                  onChange={(e) => updateCustomOutput(idx, 'name', e.target.value)}
                  placeholder="Nom (ex: client_id)"
                  className="bg-black/20 border-white/5 h-8 text-[10px] font-mono"
                />
                <Input
                  value={output.path}
                  onChange={(e) => updateCustomOutput(idx, 'path', e.target.value)}
                  placeholder="Chemin JSON"
                  className="bg-black/20 border-white/5 h-8 text-[10px]"
                />
              </div>
              <Input
                value={output.description}
                onChange={(e) => updateCustomOutput(idx, 'description', e.target.value)}
                placeholder="Description pour l'IA..."
                className="bg-black/20 border-white/5 h-8 text-[10px]"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Bloc GPT Réponse (Réponse textuelle)
export function GPTRespondConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    model: "gpt-4o-mini",
    system: "Tu es un assistant utile et concis. Réponds poliment aux clients.",
    temperature: 0.7,
    maxTokens: 500,
    responseStyles: [] as string[],
    enableAdvancedMode: false,
  });

  const [showPreview, setShowPreview] = useState(false);

  const generateRespondPrompt = async () => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: "Génère un prompt système pour un assistant de service client professionnel et amical sur WhatsApp.",
          systemPrompt: "Tu es un expert en service client.",
          model: "gpt-4o-mini",
          temperature: 0.8
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.response) {
          updateConfig({ ...config, system: data.response.trim() });
        }
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const styles = [
    { id: 'Professionnel', icon: '👔' },
    { id: 'Amical', icon: '😊' },
    { id: 'Concis', icon: '⚡' },
    { id: 'Détaillé', icon: '📝' },
    { id: 'Emojis', icon: '✨' }
  ];

  return (
    <div className="space-y-5">
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <h3 className="text-sm font-bold text-white">Réponse IA</h3>
        </div>
        <p className="text-[10px] text-white/40 font-medium">Génère un message personnalisé via GPT</p>
      </div>

      <div className="px-1 space-y-5">
        {/* Modèle selector */}
        <div className="flex items-center justify-between group">
          <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Modèle IA</label>
          <select
            value={config.model}
            onChange={(e) => updateConfig({ ...config, model: e.target.value })}
            className="bg-transparent text-xs text-white font-bold border-none focus:ring-0 cursor-pointer text-right hover:text-primary transition-colors"
          >
            <option value="gpt-4o-mini">GPT-4o Mini</option>
            <option value="gpt-4o">GPT-4o Standard</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="o1-preview">o1 Preview</option>
          </select>
        </div>

        {/* Style Presets */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Style de réponse</label>
          <div className="flex flex-wrap gap-1.5">
            {styles.map(style => (
              <button
                key={style.id}
                onClick={() => {
                  const current = config.responseStyles || [];
                  const next = current.includes(style.id) ? current.filter(s => s !== style.id) : [...current, style.id];
                  updateConfig({ ...config, responseStyles: next });
                }}
                className={`px-2 py-1.5 rounded-lg border text-[10px] font-bold transition-all flex items-center gap-1.5 ${(config.responseStyles || []).includes(style.id)
                    ? "bg-primary/20 border-primary/40 text-primary shadow-[0_0_10px_rgba(16,163,127,0.1)]"
                    : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                  }`}
              >
                <span>{style.icon}</span>
                {style.id}
              </button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Consignes Système</label>
            <div className="flex gap-3">
              <button onClick={generateRespondPrompt} className="text-[10px] text-primary flex items-center gap-1 hover:brightness-125 font-bold transition-all">
                <Sparkles className="h-3 w-3" /> Auto-Prompt
              </button>
              <button onClick={() => setShowPreview(!showPreview)} className="text-[10px] text-white/40 hover:text-white transition-colors">
                {showPreview ? "Éditer" : "Aperçu"}
              </button>
            </div>
          </div>

          {showPreview ? (
            <div className="min-h-[120px] p-3 rounded-xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 text-xs text-white/80 leading-relaxed italic whitespace-pre-wrap font-medium">
              {config.system}
              <div className="mt-4 pt-3 border-t border-white/5 text-[9px] text-white/30 not-italic">
                💡 Utilisez {"{{variable}}"} pour injecter des données dynamiques.
              </div>
            </div>
          ) : (
            <textarea
              value={config.system}
              onChange={(e) => updateConfig({ ...config, system: e.target.value })}
              className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white leading-relaxed focus:border-primary/40 transition-all resize-none font-mono"
              placeholder="Ex: Tu es un assistant pour une boutique de luxe..."
            />
          )}
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-2 gap-6 pt-2">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[9px] font-black text-white/40 uppercase tracking-tighter">Créativité</label>
              <span className="text-[10px] font-black text-primary">{config.temperature}</span>
            </div>
            <input
              type="range" min="0" max="1" step="0.1" value={config.temperature}
              onChange={(e) => updateConfig({ ...config, temperature: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[9px] font-black text-white/40 uppercase tracking-tighter">Tokens Max</label>
              <span className="text-[10px] font-black text-primary">{config.maxTokens}</span>
            </div>
            <input
              type="range" min="50" max="2000" step="50" value={config.maxTokens}
              onChange={(e) => updateConfig({ ...config, maxTokens: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        </div>

        {/* Tips Section */}
        <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
          <p className="text-[9px] text-blue-400 font-medium leading-normal">
            <span className="font-bold mr-1">PRO TIP:</span>
            Reliez ce bloc à une "Analyse d'intention" pour que l'assistant adapte sa réponse selon l'humeur du client.
          </p>
        </div>
      </div>
    </div>
  );
}
