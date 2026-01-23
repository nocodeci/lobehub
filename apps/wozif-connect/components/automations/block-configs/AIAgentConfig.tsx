"use client";

import React, { useState } from "react";
import { BlockConfigProps, parseConfig } from "./types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { Bot, Sparkles, ChevronDown, ChevronRight, Maximize2, Code, Plus } from "lucide-react";

// Bloc AI Agent
export function AIAgentConfig({ node, updateConfig }: BlockConfigProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showModelParams, setShowModelParams] = useState(false);

  const config = parseConfig(node.config, {
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
  });

  const toggleSwitch = (key: string) => {
    updateConfig({ ...config, [key]: !config[key] });
  };

  return (
    <div className="space-y-4">
      {/* Nom du bloc */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase text-muted-foreground px-1">
          Nom du bloc
        </label>
        <input
          className="flex w-full rounded-md border px-3 py-1 shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-white/5 border-white/10 h-10 focus:border-primary/50 transition-colors text-xs text-white"
          value={config.name}
          onChange={(e) => updateConfig({ ...config, name: e.target.value })}
        />
      </div>

      {/* Carte principale */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 shadow-inner">
        {/* En-tête */}
        <div className="flex items-center gap-4 mb-4">
          <div className="h-12 w-12 rounded-xl flex items-center justify-center shadow-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-black text-white uppercase tracking-tight">
              Agent IA
            </p>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">
              Intelligence IA
            </p>
          </div>
        </div>

        <div className="h-px bg-white/5 w-full mb-3"></div>
        <p className="text-[11px] text-muted-foreground/80 leading-relaxed italic mb-4">
          Agent IA autonome avec outils et mémoire
        </p>

        {/* Configuration spécifique */}
        <div className="space-y-3 pt-2">
          <label className="text-[10px] font-bold uppercase text-muted-foreground px-1">
            Configuration Spécifique
          </label>

          <div className="space-y-0">
            {/* Section principale */}
            <div className="pb-4 border-b border-white/5">
              <h3 className="text-base font-semibold text-white">{config.agentName}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Appeler le modèle avec vos instructions et outils
              </p>
            </div>

            <div className="py-4 space-y-4">
              {/* Nom de l'agent */}
              <div className="flex items-center justify-between gap-4">
                <label className="text-sm text-white/80 font-medium shrink-0">Nom</label>
                <input
                  placeholder="Agent"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg h-9 px-3 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none transition-colors"
                  type="text"
                  value={config.agentName}
                  onChange={(e) => updateConfig({ ...config, agentName: e.target.value })}
                />
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-white/80 font-medium">Instructions</label>
                </div>
                <MarkdownEditor
                  value={config.instructions || ""}
                  onChange={(value) => updateConfig({ ...config, instructions: value })}
                  placeholder="Décrivez le comportement souhaité du modèle (ton, utilisation des outils, style de réponse)"
                />
              </div>

              {/* Inclure l'historique de chat */}
              <div className="flex items-center justify-between">
                <label className="text-sm text-white/80 font-medium">
                  Inclure l&apos;historique de chat
                </label>
                <button
                  onClick={() => toggleSwitch("includeChatHistory")}
                  className={`relative w-10 h-6 rounded-full transition-colors ${
                    config.includeChatHistory ? "bg-[#10a37f]" : "bg-white/20"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${
                      config.includeChatHistory ? "left-5" : "left-1"
                    }`}
                  ></span>
                </button>
              </div>

              {/* Modèle */}
              <div className="flex items-center justify-between gap-4">
                <label className="text-sm text-white/80 font-medium shrink-0">Modèle</label>
                <select
                  className="flex-1 max-w-[180px] bg-transparent border-none text-sm text-white font-medium cursor-pointer focus:outline-none text-right appearance-none"
                  style={{ direction: "rtl" }}
                  value={config.model}
                  onChange={(e) => updateConfig({ ...config, model: e.target.value })}
                >
                  <option value="gpt-4o">gpt-4o</option>
                  <option value="gpt-4o-mini">gpt-4o-mini</option>
                  <option value="gpt-4-turbo">gpt-4-turbo</option>
                  <option value="o1-preview">o1-preview</option>
                </select>
              </div>

              {/* Effort de raisonnement */}
              <div className="flex items-center justify-between gap-4">
                <label className="text-sm text-white/80 font-medium shrink-0">
                  Effort de raisonnement
                </label>
                <select
                  className="bg-transparent border-none text-sm text-white font-medium cursor-pointer focus:outline-none text-right appearance-none"
                  value={config.reasoningEffort}
                  onChange={(e) => updateConfig({ ...config, reasoningEffort: e.target.value })}
                >
                  <option value="low">Faible</option>
                  <option value="medium">Moyen</option>
                  <option value="high">Élevé</option>
                </select>
              </div>

              {/* Format de sortie */}
              <div className="h-px bg-white/5"></div>
              <div className="flex items-center justify-between gap-4">
                <label className="text-sm text-white/80 font-medium shrink-0">
                  Format de sortie
                </label>
                <select
                  className="bg-transparent border-none text-sm text-white font-medium cursor-pointer focus:outline-none text-right appearance-none"
                  value={config.outputFormat}
                  onChange={(e) => updateConfig({ ...config, outputFormat: e.target.value })}
                >
                  <option value="text">Texte</option>
                  <option value="json">JSON</option>
                  <option value="markdown">Markdown</option>
                </select>
              </div>

              {/* Bouton pour afficher/masquer les paramètres avancés */}
              <div className="pt-2">
                <button
                  onClick={() => setShowModelParams(!showModelParams)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      showModelParams ? "rotate-180" : ""
                    }`}
                  />
                  <span>{showModelParams ? "Moins" : "Plus"}</span>
                </button>
              </div>

              {/* Paramètres du modèle (masqués par défaut) */}
              {showModelParams && (
                <div className="space-y-4 pt-2">
                  <div className="text-xs font-medium text-muted-foreground">
                    Paramètres du modèle
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <label className="text-sm text-white/80 font-medium shrink-0">Verbosité</label>
                    <select
                      className="bg-transparent border-none text-sm text-white font-medium cursor-pointer focus:outline-none text-right appearance-none"
                      value={config.verbosity}
                      onChange={(e) => updateConfig({ ...config, verbosity: e.target.value })}
                    >
                      <option value="low">Faible</option>
                      <option value="medium">Moyen</option>
                      <option value="high">Élevé</option>
                    </select>
                  </div>

                  <div className="text-xs font-medium text-muted-foreground pt-2">Avancé</div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-white/80 font-medium">
                      Continuer en cas d&apos;erreur
                    </label>
                    <button
                      onClick={() => toggleSwitch("continueOnError")}
                      className={`relative w-10 h-6 rounded-full transition-colors ${
                        config.continueOnError ? "bg-[#10a37f]" : "bg-white/20"
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${
                          config.continueOnError ? "left-5" : "left-1"
                        }`}
                      ></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm text-white/80 font-medium">
                      Écrire dans l&apos;historique de conversation
                    </label>
                    <button
                      onClick={() => toggleSwitch("writeToConversationHistory")}
                      className={`relative w-10 h-6 rounded-full transition-colors ${
                        config.writeToConversationHistory ? "bg-[#10a37f]" : "bg-white/20"
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${
                          config.writeToConversationHistory ? "left-5" : "left-1"
                        }`}
                      ></span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section Instructions IA (en bas) */}
        <div className="mt-6 pt-2 border-t border-white/5">
          <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Bot className="h-3 w-3 text-primary" />
              </div>
              <label className="text-[10px] font-black uppercase tracking-widest text-white/90 cursor-pointer">
                Instructions IA
              </label>
            </div>
            <ChevronRight className="h-3 w-3 text-white/40 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
}
