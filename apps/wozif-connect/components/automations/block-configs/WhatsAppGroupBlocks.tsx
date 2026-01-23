"use client";

import React from "react";
import { BlockConfigProps, parseConfig } from "./types";
import { Input } from "@/components/ui/input";
import { Users, UserPlus, UserMinus, Download } from "lucide-react";

// Bloc Create Group
export function CreateGroupConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    name: "",
    description: "",
    addCurrentContact: true,
    initialMembers: [],
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Users className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Créer Groupe</h4>
            <p className="text-[10px] text-emerald-400/60">Nouveau groupe WhatsApp</p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Nom du groupe
          </label>
          <Input
            value={config.name}
            onChange={(e) => updateConfig({ ...config, name: e.target.value })}
            placeholder="Support Client - {{nom}}"
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Description
          </label>
          <textarea
            value={config.description}
            onChange={(e) => updateConfig({ ...config, description: e.target.value })}
            className="w-full mt-1 h-16 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white"
            placeholder="Description du groupe..."
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-black/20">
          <span className="text-[10px] text-white/70">Ajouter le contact actuel</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.addCurrentContact}
              onChange={(e) => updateConfig({ ...config, addCurrentContact: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:bg-emerald-500"></div>
            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4"></div>
          </label>
        </div>
      </div>
    </div>
  );
}

// Bloc Add/Remove Participant
export function ParticipantConfig({ node, updateConfig }: BlockConfigProps) {
  const isAdd = node.type === "add_participant";
  const config = parseConfig(node.config, {
    groupId: "",
    phoneNumber: "{{telephone}}",
    asAdmin: false,
  });

  return (
    <div className="space-y-4">
      <div className={`p-5 rounded-2xl bg-gradient-to-br ${isAdd ? "from-blue-500/10 border-blue-500/20" : "from-red-500/10 border-red-500/20"} to-transparent border space-y-4`}>
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-xl ${isAdd ? "bg-blue-500/20" : "bg-red-500/20"} flex items-center justify-center`}>
            {isAdd ? (
              <UserPlus className={`h-5 w-5 ${isAdd ? "text-blue-400" : "text-red-400"}`} />
            ) : (
              <UserMinus className="h-5 w-5 text-red-400" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              {isAdd ? "Ajouter Participant" : "Retirer Participant"}
            </h4>
            <p className={`text-[10px] ${isAdd ? "text-blue-400/60" : "text-red-400/60"}`}>
              {isAdd ? "Inviter au groupe" : "Exclure du groupe"}
            </p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            ID du groupe
          </label>
          <Input
            value={config.groupId}
            onChange={(e) => updateConfig({ ...config, groupId: e.target.value })}
            placeholder="{{group_id}} ou ID fixe"
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Numéro de téléphone
          </label>
          <Input
            value={config.phoneNumber}
            onChange={(e) => updateConfig({ ...config, phoneNumber: e.target.value })}
            placeholder="{{telephone}}"
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>

        {isAdd && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-black/20">
            <span className="text-[10px] text-white/70">Ajouter comme admin</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.asAdmin}
                onChange={(e) => updateConfig({ ...config, asAdmin: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:bg-blue-500"></div>
              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4"></div>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

// Bloc Bulk Add Members
export function BulkAddMembersConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    source: "csv",
    groupId: "",
    fileUrl: "",
    delay: 30,
    skipExisting: true,
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-500/10 to-transparent border border-violet-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
            <Users className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Ajout en Masse</h4>
            <p className="text-[10px] text-violet-400/60">Importer plusieurs membres</p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Source
          </label>
          <select
            value={config.source}
            onChange={(e) => updateConfig({ ...config, source: e.target.value })}
            className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
          >
            <option value="csv">Fichier CSV</option>
            <option value="variable">Variable (liste)</option>
            <option value="crm">Contacts CRM</option>
          </select>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            ID du groupe
          </label>
          <Input
            value={config.groupId}
            onChange={(e) => updateConfig({ ...config, groupId: e.target.value })}
            placeholder="ID du groupe cible"
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Délai entre ajouts (sec)
          </label>
          <Input
            type="number"
            min={5}
            value={config.delay}
            onChange={(e) => updateConfig({ ...config, delay: parseInt(e.target.value) || 30 })}
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-black/20">
          <span className="text-[10px] text-white/70">Ignorer les existants</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.skipExisting}
              onChange={(e) => updateConfig({ ...config, skipExisting: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:bg-violet-500"></div>
            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4"></div>
          </label>
        </div>
      </div>
    </div>
  );
}

// Bloc Get Group Members / Chat List Collector
export function ExtractionConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    exportFormat: "csv",
    autoSync: false,
    includeProfilePic: false,
    includeStatus: false,
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
            <Download className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Extraction Données</h4>
            <p className="text-[10px] text-cyan-400/60">Exporter les contacts</p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Format d'export
          </label>
          <select
            value={config.exportFormat}
            onChange={(e) => updateConfig({ ...config, exportFormat: e.target.value })}
            className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
          >
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
            <option value="excel">Excel</option>
          </select>
        </div>

        <div className="space-y-2">
          {[
            { key: "autoSync", label: "Synchronisation auto" },
            { key: "includeProfilePic", label: "Inclure photos de profil" },
            { key: "includeStatus", label: "Inclure statuts" },
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
                <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:bg-cyan-500"></div>
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
