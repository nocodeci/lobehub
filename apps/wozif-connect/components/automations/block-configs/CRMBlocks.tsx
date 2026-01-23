"use client";

import React from "react";
import { BlockConfigProps, parseConfig } from "./types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  UserPlus,
  Tag,
  UserCog,
  UserCheck,
  FileText,
} from "lucide-react";

// Bloc Save Contact
export function SaveContactConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    savePhone: true,
    saveName: true,
    saveEmail: false,
    customFields: [],
    updateIfExists: true,
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <UserPlus className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Sauvegarder Contact</h4>
            <p className="text-[10px] text-emerald-400/60">Enregistrer dans le CRM</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Champs à sauvegarder
          </label>
          <div className="space-y-2">
            {[
              { key: "savePhone", label: "Téléphone" },
              { key: "saveName", label: "Nom" },
              { key: "saveEmail", label: "Email" },
            ].map((field) => (
              <label
                key={field.key}
                className="flex items-center gap-2 p-2 rounded-lg bg-black/20 cursor-pointer hover:bg-black/30 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={config[field.key as keyof typeof config] as boolean}
                  onChange={(e) => updateConfig({ ...config, [field.key]: e.target.checked })}
                  className="rounded border-white/20"
                />
                <span className="text-[10px] text-white/70">{field.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-black/20">
          <span className="text-[10px] text-white/70">Mettre à jour si existe</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.updateIfExists}
              onChange={(e) => updateConfig({ ...config, updateIfExists: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:bg-emerald-500 transition-all"></div>
            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-4"></div>
          </label>
        </div>
      </div>
    </div>
  );
}

// Bloc Add/Remove Tag
export function TagConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    action: node.type === "add_tag" ? "add" : "remove",
    tags: [],
    newTag: "",
  });

  const addTag = () => {
    if (config.newTag.trim()) {
      updateConfig({
        ...config,
        tags: [...config.tags, config.newTag.trim()],
        newTag: "",
      });
    }
  };

  const removeTag = (index: number) => {
    updateConfig({
      ...config,
      tags: config.tags.filter((_: any, i: number) => i !== index),
    });
  };

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <Tag className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              {config.action === "add" ? "Ajouter Tag" : "Retirer Tag"}
            </h4>
            <p className="text-[10px] text-orange-400/60">Gérer les étiquettes</p>
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
            <option value="add">Ajouter</option>
            <option value="remove">Retirer</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Tags ({config.tags.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {config.tags.map((tag: string, idx: number) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/20 text-orange-300 text-[10px]"
              >
                {tag}
                <button
                  onClick={() => removeTag(idx)}
                  className="hover:text-white"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={config.newTag}
              onChange={(e) => updateConfig({ ...config, newTag: e.target.value })}
              placeholder="Nouveau tag..."
              className="flex-1 bg-black/40 border-white/10 h-9"
              onKeyPress={(e) => e.key === "Enter" && addTag()}
            />
            <button
              onClick={addTag}
              className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 text-xs"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Bloc Update Contact
export function UpdateContactConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    field: "name",
    value: "",
    customField: "",
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
            <UserCog className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Modifier Contact</h4>
            <p className="text-[10px] text-cyan-400/60">Mettre à jour les infos</p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Champ à modifier
          </label>
          <select
            value={config.field}
            onChange={(e) => updateConfig({ ...config, field: e.target.value })}
            className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
          >
            <option value="name">Nom</option>
            <option value="email">Email</option>
            <option value="company">Entreprise</option>
            <option value="notes">Notes</option>
            <option value="status">Statut</option>
            <option value="custom">Champ personnalisé</option>
          </select>
        </div>

        {config.field === "custom" && (
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Nom du champ personnalisé
            </label>
            <Input
              value={config.customField}
              onChange={(e) => updateConfig({ ...config, customField: e.target.value })}
              placeholder="nom_du_champ"
              className="mt-1 bg-black/40 border-white/10 h-10"
            />
          </div>
        )}

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Nouvelle valeur
          </label>
          <Input
            value={config.value}
            onChange={(e) => updateConfig({ ...config, value: e.target.value })}
            placeholder="{{valeur}} ou texte statique"
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>
      </div>
    </div>
  );
}

// Bloc Assign Agent
export function AssignAgentConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    assignmentType: "specific",
    agentId: "",
    agentEmail: "",
    roundRobin: false,
    teamId: "",
    notifyAgent: true,
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-500/10 to-transparent border border-violet-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
            <UserCheck className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Assigner Agent</h4>
            <p className="text-[10px] text-violet-400/60">Attribuer à un membre</p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Type d'assignation
          </label>
          <select
            value={config.assignmentType}
            onChange={(e) => updateConfig({ ...config, assignmentType: e.target.value })}
            className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
          >
            <option value="specific">Agent spécifique</option>
            <option value="round_robin">Rotation (Round Robin)</option>
            <option value="least_busy">Moins occupé</option>
            <option value="team">Équipe entière</option>
          </select>
        </div>

        {config.assignmentType === "specific" && (
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Email de l'agent
            </label>
            <Input
              value={config.agentEmail}
              onChange={(e) => updateConfig({ ...config, agentEmail: e.target.value })}
              placeholder="agent@exemple.com"
              className="mt-1 bg-black/40 border-white/10 h-10"
            />
          </div>
        )}

        {config.assignmentType === "team" && (
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              ID de l'équipe
            </label>
            <Input
              value={config.teamId}
              onChange={(e) => updateConfig({ ...config, teamId: e.target.value })}
              placeholder="team_support"
              className="mt-1 bg-black/40 border-white/10 h-10"
            />
          </div>
        )}

        <div className="flex items-center justify-between p-3 rounded-xl bg-black/20">
          <span className="text-[10px] text-white/70">Notifier l'agent</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.notifyAgent}
              onChange={(e) => updateConfig({ ...config, notifyAgent: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:bg-violet-500 transition-all"></div>
            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-4"></div>
          </label>
        </div>
      </div>
    </div>
  );
}

// Bloc Add Note
export function AddNoteConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    note: "",
    visibility: "internal",
    attachToContact: true,
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <FileText className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Ajouter Note</h4>
            <p className="text-[10px] text-amber-400/60">Note interne sur le contact</p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Contenu de la note
          </label>
          <textarea
            value={config.note}
            onChange={(e) => updateConfig({ ...config, note: e.target.value })}
            className="w-full mt-1 h-24 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white"
            placeholder="Client intéressé par le produit X. À recontacter..."
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Visibilité
          </label>
          <select
            value={config.visibility}
            onChange={(e) => updateConfig({ ...config, visibility: e.target.value })}
            className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
          >
            <option value="internal">Interne (équipe uniquement)</option>
            <option value="public">Publique</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-black/20">
          <span className="text-[10px] text-white/70">Attacher au contact</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.attachToContact}
              onChange={(e) => updateConfig({ ...config, attachToContact: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:bg-amber-500 transition-all"></div>
            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-4"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
