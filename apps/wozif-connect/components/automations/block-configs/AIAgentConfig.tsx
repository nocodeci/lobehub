"use client";

import React, { useEffect, useMemo, useState } from "react";
import { BlockConfigProps, parseConfig } from "./types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { Bot, Sparkles, ChevronDown, ChevronRight, Maximize2, Code, Plus } from "lucide-react";

// Bloc AI Agent
export function AIAgentConfig({ node, updateConfig }: BlockConfigProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showModelParams, setShowModelParams] = useState(false);

  const [knowledgeBases, setKnowledgeBases] = useState<
    Array<{ id: string; name: string; _count?: { documents?: number; sources?: number } }>
  >([]);
  const [kbLoading, setKbLoading] = useState(false);

  const config: any = parseConfig(node.config, {
    name: node.name || "Agent IA",
    agentName: "Mon Agent",
    instructions: "Tu es un assistant utile.",
    model: "gpt-4o",
    reasoningEffort: "low",
    includeChatHistory: true,
    outputFormat: "text",
    verbosity: "medium",
    continueOnError: false,
    writeToConversationHistory: true,
    temperature: 0.4,
    strictMode: true,
    tools: [] as string[],
    knowledgeBase: "general",
    knowledgeBaseId: null as string | null,
    personality: "Expert"
  });

  const activeKbLabel = useMemo(() => {
    if (!config.knowledgeBaseId) return null;
    const kb = knowledgeBases.find((k) => k.id === config.knowledgeBaseId);
    return kb ? kb.name : null;
  }, [config.knowledgeBaseId, knowledgeBases]);

  useEffect(() => {
    let cancelled = false;
    const fetchKBs = async () => {
      setKbLoading(true);
      try {
        const res = await fetch("/api/knowledge-bases");
        const data = await res.json();
        if (cancelled) return;
        if (data?.success) {
          setKnowledgeBases(data.knowledgeBases || []);
        }
      } catch (e) {
        if (!cancelled) setKnowledgeBases([]);
      } finally {
        if (!cancelled) setKbLoading(false);
      }
    };
    fetchKBs();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleSwitch = (key: string) => {
    updateConfig({ ...config, [key]: !config[key] });
  };

  const toggleTool = (toolId: string) => {
    const current = config.tools || [];
    const next = current.includes(toolId) ? current.filter((t: string) => t !== toolId) : [...current, toolId];
    updateConfig({ ...config, tools: next });
  };

  const personalities = [
    { id: 'Expert', icon: '🧠', desc: 'Précis et technique' },
    { id: 'Vendeur', icon: '💰', desc: 'Persuasif et chaleureux' },
    { id: 'Support', icon: '🛠️', desc: 'Patient et aidant' },
    { id: 'Amical', icon: '👋', desc: 'Relâché et informel' }
  ];

  const tools = [
    { id: 'catalog', name: 'Catalogue Produits', desc: 'Accès aux prix et stocks' },
    { id: 'search', name: 'Recherche Web', desc: 'Infos en temps réel' },
    { id: 'calendar', name: 'Rendez-vous', desc: 'Lecture/Écriture agenda' },
    { id: 'payments', name: 'Paiements', desc: 'Génération de liens' }
  ];

  return (
    <div className="space-y-5">
      {/* Header Info */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 via-transparent to-transparent border border-purple-500/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <Bot className="h-20 w-20 text-purple-400" />
        </div>
        <div className="flex items-center gap-4 relative">
          <div className="h-12 w-12 rounded-xl flex items-center justify-center shadow-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white uppercase tracking-tight">Agent Autonome</h3>
              <Badge className="bg-purple-500/20 text-purple-400 border-none text-[8px] font-bold px-1.5 h-4">PRO</Badge>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">
              Intelligence {config.model}
            </p>
          </div>
        </div>
      </div>

      {/* Configuration de base */}
      <div className="space-y-5 px-1">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Identité de l'Agent</label>
          <Input
            value={config.agentName}
            onChange={(e) => updateConfig({ ...config, agentName: e.target.value })}
            className="bg-white/5 border-white/10 h-11 text-sm text-white focus:border-purple-500/50 transition-all font-medium"
            placeholder="Ex: Clara, assistante commerciale"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Base de connaissance</label>
          <div className="space-y-2">
            <select
              value={config.knowledgeBaseId || ""}
              onChange={(e) =>
                updateConfig({
                  ...config,
                  knowledgeBaseId: e.target.value ? e.target.value : null,
                })
              }
              className="w-full bg-white/5 border border-white/10 rounded-xl h-10 px-3 text-xs text-white focus:outline-none focus:border-purple-500/50"
            >
              <option value="">Aucune</option>
              {knowledgeBases.map((kb) => (
                <option key={kb.id} value={kb.id}>
                  {kb.name}
                </option>
              ))}
            </select>
            <div className="flex items-center justify-between">
              <p className="text-[9px] text-white/40">
                {kbLoading
                  ? "Chargement des bases..."
                  : knowledgeBases.length > 0
                    ? `${knowledgeBases.length} base(s) disponible(s)`
                    : "Aucune base créée"}
              </p>
              {activeKbLabel && (
                <Badge className="bg-purple-500/20 text-purple-300 border-none text-[8px] font-bold px-2 h-4">
                  {activeKbLabel}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Personnalité */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Personnalité & Ton</label>
          <div className="grid grid-cols-2 gap-2">
            {personalities.map(p => (
              <button
                key={p.id}
                onClick={() => updateConfig({ ...config, personality: p.id })}
                className={`p-2.5 rounded-xl border text-left transition-all ${config.personality === p.id
                  ? "bg-purple-500/10 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                  : "bg-white/5 border-white/5 opacity-60 hover:opacity-100 hover:border-white/20"
                  }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{p.icon}</span>
                  <span className="text-[11px] font-bold text-white">{p.id}</span>
                </div>
                <p className="text-[9px] text-white/40 leading-tight">{p.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Outils & Capacités */}
        <div className="space-y-2 pt-2">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Capacités & Outils</label>
          <div className="space-y-2">
            {tools.map(tool => (
              <div
                key={tool.id}
                onClick={() => toggleTool(tool.id)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${(config.tools || []).includes(tool.id)
                  ? "bg-purple-500/10 border-purple-500/40"
                  : "bg-white/5 border-white/5 opacity-50 hover:opacity-80"
                  }`}
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">{tool.name}</span>
                  <span className="text-[9px] text-white/40">{tool.desc}</span>
                </div>
                <div className={`w-8 h-4 rounded-full relative transition-colors ${(config.tools || []).includes(tool.id) ? "bg-purple-500" : "bg-white/10"}`}>
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${(config.tools || []).includes(tool.id) ? "right-0.5" : "left-0.5"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-2 pt-2">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Instructions Directives</label>
          <MarkdownEditor
            value={config.instructions || ""}
            onChange={(value) => updateConfig({ ...config, instructions: value })}
            placeholder="Définissez les règles de conduite de l'agent..."
            className="min-h-[120px]"
          />
        </div>

        {/* Connaissance */}
        <div className="space-y-2 pt-2">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Source de Connaissance</label>
          <select
            value={config.knowledgeBase}
            onChange={(e) => updateConfig({ ...config, knowledgeBase: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl h-10 px-3 text-xs text-white focus:outline-none focus:border-purple-500/50"
          >
            <option value="general">Culture Générale (Web)</option>
            <option value="catalog_rag">Catalogue Produits CONNECT</option>
            <option value="doc_faq">Documents WhatsApp FAQ</option>
            <option value="none">Aucune (Instructions uniquement)</option>
          </select>
        </div>

        {/* Paramètres Modèle */}
        <div className="pt-4 border-t border-white/5">
          <button
            onClick={() => setShowModelParams(!showModelParams)}
            className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-white/5 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-purple-400" />
              <span className="text-[10px] font-bold text-white/60 uppercase">Réglages Modèle</span>
            </div>
            <ChevronRight className={`h-3 w-3 text-white/40 transition-transform ${showModelParams ? "rotate-90" : ""}`} />
          </button>

          {showModelParams && (
            <div className="mt-2 p-4 bg-white/5 rounded-xl border border-white/10 space-y-5">
              <div className="flex items-center justify-between">
                <label className="text-xs text-white/80">Modèle</label>
                <select
                  value={config.model}
                  onChange={(e) => updateConfig({ ...config, model: e.target.value })}
                  className="bg-transparent text-xs text-purple-400 font-bold border-none text-right"
                >
                  <option value="gpt-4o">gpt-4o</option>
                  <option value="gpt-4o-mini">gpt-4o-mini</option>
                  <option value="o1-preview">o1-preview</option>
                </select>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-white/40 uppercase">Température</label>
                  <span className="text-[10px] font-mono text-purple-400">{config.temperature}</span>
                </div>
                <input
                  type="range" min="0" max="1" step="0.1" value={config.temperature}
                  onChange={(e) => updateConfig({ ...config, temperature: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-xs text-white/80 shrink-0">Mode Strict (RAG)</label>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-white/40">{config.strictMode ? "Base uniquement" : "Hybride"}</span>
                  <button
                    onClick={() => toggleSwitch("strictMode")}
                    className={`relative w-8 h-4 rounded-full transition-colors ${config.strictMode ? "bg-purple-500" : "bg-white/10"}`}
                  >
                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${config.strictMode ? "right-0.5" : "left-0.5"}`} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-xs text-white/80">Mémoriser conversation</label>
                <button
                  onClick={() => toggleSwitch("includeChatHistory")}
                  className={`relative w-8 h-4 rounded-full transition-colors ${config.includeChatHistory ? "bg-purple-500" : "bg-white/10"}`}
                >
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${config.includeChatHistory ? "right-0.5" : "left-0.5"}`} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
