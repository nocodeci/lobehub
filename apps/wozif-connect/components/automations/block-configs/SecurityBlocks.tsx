"use client";

import React from "react";
import { BlockConfigProps, parseConfig } from "./types";
import { Input } from "@/components/ui/input";
import { Shield, Ban, UserCheck, Clock } from "lucide-react";

// Bloc Rate Limit
export function RateLimitConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    maxRequests: 10,
    windowSeconds: 60,
    action: "delay",
    message: "",
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <Clock className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Limite de Débit</h4>
            <p className="text-[10px] text-orange-400/60">Anti-spam temporel</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Max requêtes
            </label>
            <Input
              type="number"
              min={1}
              value={config.maxRequests}
              onChange={(e) => updateConfig({ ...config, maxRequests: parseInt(e.target.value) || 10 })}
              className="mt-1 bg-black/40 border-white/10 h-10"
            />
          </div>
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Par X secondes
            </label>
            <Input
              type="number"
              min={1}
              value={config.windowSeconds}
              onChange={(e) => updateConfig({ ...config, windowSeconds: parseInt(e.target.value) || 60 })}
              className="mt-1 bg-black/40 border-white/10 h-10"
            />
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Action si dépassé
          </label>
          <select
            value={config.action}
            onChange={(e) => updateConfig({ ...config, action: e.target.value })}
            className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
          >
            <option value="delay">Retarder</option>
            <option value="block">Bloquer</option>
            <option value="warn">Avertir</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// Bloc Block Spam
export function BlockSpamConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    detectPatterns: true,
    blockKeywords: [],
    blockLinks: false,
    maxMessageLength: 0,
    action: "ignore",
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-500/20 flex items-center justify-center">
            <Ban className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Bloquer Spam</h4>
            <p className="text-[10px] text-red-400/60">Filtrage anti-spam</p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Action
          </label>
          <select
            value={config.action}
            onChange={(e) => updateConfig({ ...config, action: e.target.value })}
            className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
          >
            <option value="ignore">Ignorer le message</option>
            <option value="block">Bloquer le contact</option>
            <option value="warn">Avertir et continuer</option>
          </select>
        </div>

        <div className="space-y-2">
          {[
            { key: "detectPatterns", label: "Détecter patterns spam" },
            { key: "blockLinks", label: "Bloquer les liens" },
          ].map((opt) => (
            <div key={opt.key} className="flex items-center justify-between p-3 rounded-xl bg-black/20">
              <span className="text-[10px] text-white/70">{opt.label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config[opt.key as keyof typeof config] as boolean}
                  onChange={(e) => updateConfig({ ...config, [opt.key]: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:bg-red-500"></div>
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Bloc Verify Human
export function VerifyHumanConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    method: "question",
    question: "",
    expectedAnswer: "",
    maxAttempts: 3,
    timeoutSeconds: 60,
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <UserCheck className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Vérifier Humain</h4>
            <p className="text-[10px] text-emerald-400/60">CAPTCHA conversationnel</p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Méthode
          </label>
          <select
            value={config.method}
            onChange={(e) => updateConfig({ ...config, method: e.target.value })}
            className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
          >
            <option value="question">Question simple</option>
            <option value="math">Calcul mathématique</option>
            <option value="button">Clic sur bouton</option>
          </select>
        </div>

        {config.method === "question" && (
          <>
            <div>
              <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
                Question
              </label>
              <Input
                value={config.question}
                onChange={(e) => updateConfig({ ...config, question: e.target.value })}
                placeholder="Quelle est la couleur du ciel ?"
                className="mt-1 bg-black/40 border-white/10 h-10"
              />
            </div>
            <div>
              <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
                Réponse attendue
              </label>
              <Input
                value={config.expectedAnswer}
                onChange={(e) => updateConfig({ ...config, expectedAnswer: e.target.value })}
                placeholder="bleu"
                className="mt-1 bg-black/40 border-white/10 h-10"
              />
            </div>
          </>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Max tentatives
            </label>
            <Input
              type="number"
              min={1}
              value={config.maxAttempts}
              onChange={(e) => updateConfig({ ...config, maxAttempts: parseInt(e.target.value) || 3 })}
              className="mt-1 bg-black/40 border-white/10 h-10"
            />
          </div>
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Timeout (sec)
            </label>
            <Input
              type="number"
              min={10}
              value={config.timeoutSeconds}
              onChange={(e) => updateConfig({ ...config, timeoutSeconds: parseInt(e.target.value) || 60 })}
              className="mt-1 bg-black/40 border-white/10 h-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Bloc Anti-Ban
export function AntiBanConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    minDelay: 2,
    maxDelay: 10,
    randomizeOrder: true,
    humanLikeTyping: true,
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-500/10 to-transparent border border-violet-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
            <Shield className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Protection Anti-Ban</h4>
            <p className="text-[10px] text-violet-400/60">Éviter les restrictions</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Délai min (sec)
            </label>
            <Input
              type="number"
              min={1}
              value={config.minDelay}
              onChange={(e) => updateConfig({ ...config, minDelay: parseInt(e.target.value) || 2 })}
              className="mt-1 bg-black/40 border-white/10 h-10"
            />
          </div>
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Délai max (sec)
            </label>
            <Input
              type="number"
              min={1}
              value={config.maxDelay}
              onChange={(e) => updateConfig({ ...config, maxDelay: parseInt(e.target.value) || 10 })}
              className="mt-1 bg-black/40 border-white/10 h-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          {[
            { key: "randomizeOrder", label: "Ordre aléatoire" },
            { key: "humanLikeTyping", label: "Simulation de frappe" },
          ].map((opt) => (
            <div key={opt.key} className="flex items-center justify-between p-3 rounded-xl bg-black/20">
              <span className="text-[10px] text-white/70">{opt.label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config[opt.key as keyof typeof config] as boolean}
                  onChange={(e) => updateConfig({ ...config, [opt.key]: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:bg-violet-500"></div>
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
