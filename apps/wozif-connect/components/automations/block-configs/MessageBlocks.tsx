"use client";

import React from "react";
import { BlockConfigProps, parseConfig } from "./types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Image,
  FileText,
  MapPin,
  Contact,
  Mic,
  LayoutGrid,
  Clock,
} from "lucide-react";

// Bloc Delay
export function DelayConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, { delaySeconds: 1 });

  return (
    <div className="space-y-4">
      <div className="p-6 rounded-[2rem] bg-gradient-to-br from-black/40 to-transparent border border-white/5 flex flex-col items-center justify-center text-center space-y-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_10px_30px_-10px_rgba(var(--primary),0.2)]">
          <Clock className="h-8 w-8 text-primary animate-pulse" />
        </div>
        <div className="space-y-1">
          <h4 className="text-[11px] font-black uppercase text-white tracking-[0.2em]">
            Temporisation
          </h4>
          <p className="text-[9px] text-muted-foreground font-bold uppercase opacity-40">
            Attente avant l'action suivante
          </p>
        </div>
        <div className="flex items-end gap-3 pt-2">
          <div className="relative group">
            <Input
              type="number"
              value={config.delaySeconds}
              onChange={(e) =>
                updateConfig({ ...config, delaySeconds: parseInt(e.target.value) || 0 })
              }
              className="w-32 bg-black/60 border-white/10 h-16 text-3xl font-black text-center text-primary rounded-[1.25rem] focus:border-primary/50 transition-all shadow-inner"
            />
            <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-black border border-white/10 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
              <Clock className="h-4 w-4 text-primary/40" />
            </div>
          </div>
          <span className="text-[10px] font-black text-muted-foreground mb-5 uppercase tracking-tighter opacity-60">
            Secondes
          </span>
        </div>
      </div>
    </div>
  );
}

// Bloc Send Text
export function SendTextConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, { text: "" });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <label className="text-[9px] font-bold uppercase text-muted-foreground/60 tracking-widest">
          Contenu du message
        </label>
        <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase tracking-tighter">
          WP / Simulé
        </Badge>
      </div>
      <textarea
        value={config.text}
        onChange={(e) => updateConfig({ ...config, text: e.target.value })}
        className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 text-xs text-white/90 leading-relaxed focus:border-primary/50 transition-all shadow-inner scrollbar-hide"
        placeholder="Bonjour {{nom}}, merci pour votre message !"
      />
      <div className="p-3 rounded-xl bg-primary/5 border border-white/5">
        <p className="text-[8px] text-muted-foreground italic">
          Variables disponibles: {"{{nom}}"}, {"{{telephone}}"}, {"{{message}}"}, {"{{date}}"}
        </p>
      </div>
    </div>
  );
}

// Bloc Send Image
export function SendImageConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    url: "",
    caption: "",
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
            <Image className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Envoyer Image</h4>
            <p className="text-[10px] text-cyan-400/60">Image avec légende optionnelle</p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            URL de l'image
          </label>
          <Input
            value={config.url}
            onChange={(e) => updateConfig({ ...config, url: e.target.value })}
            placeholder="https://exemple.com/image.jpg"
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Légende (optionnel)
          </label>
          <Input
            value={config.caption}
            onChange={(e) => updateConfig({ ...config, caption: e.target.value })}
            placeholder="Voici notre catalogue..."
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>
      </div>
    </div>
  );
}

// Bloc Send Document
export function SendDocumentConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    url: "",
    filename: "",
    caption: "",
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <FileText className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Envoyer Document</h4>
            <p className="text-[10px] text-amber-400/60">PDF, Word, Excel...</p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            URL du document
          </label>
          <Input
            value={config.url}
            onChange={(e) => updateConfig({ ...config, url: e.target.value })}
            placeholder="https://exemple.com/document.pdf"
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Nom du fichier
          </label>
          <Input
            value={config.filename}
            onChange={(e) => updateConfig({ ...config, filename: e.target.value })}
            placeholder="catalogue-2024.pdf"
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Message (optionnel)
          </label>
          <Input
            value={config.caption}
            onChange={(e) => updateConfig({ ...config, caption: e.target.value })}
            placeholder="Voici le document demandé"
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>
      </div>
    </div>
  );
}

// Bloc Send Location
export function SendLocationConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    latitude: "",
    longitude: "",
    name: "",
    address: "",
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-green-500/20 flex items-center justify-center">
            <MapPin className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Envoyer Localisation</h4>
            <p className="text-[10px] text-green-400/60">Partager une position GPS</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Latitude
            </label>
            <Input
              value={config.latitude}
              onChange={(e) => updateConfig({ ...config, latitude: e.target.value })}
              placeholder="5.3599"
              className="mt-1 bg-black/40 border-white/10 h-10"
            />
          </div>
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Longitude
            </label>
            <Input
              value={config.longitude}
              onChange={(e) => updateConfig({ ...config, longitude: e.target.value })}
              placeholder="-4.0083"
              className="mt-1 bg-black/40 border-white/10 h-10"
            />
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Nom du lieu
          </label>
          <Input
            value={config.name}
            onChange={(e) => updateConfig({ ...config, name: e.target.value })}
            placeholder="Notre boutique"
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Adresse
          </label>
          <Input
            value={config.address}
            onChange={(e) => updateConfig({ ...config, address: e.target.value })}
            placeholder="Cocody, Abidjan"
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>
      </div>
    </div>
  );
}

// Bloc Send Contact
export function SendContactConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    name: "",
    phone: "",
    email: "",
    organization: "",
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
            <Contact className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Envoyer Contact</h4>
            <p className="text-[10px] text-indigo-400/60">Partager une fiche contact</p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Nom complet
          </label>
          <Input
            value={config.name}
            onChange={(e) => updateConfig({ ...config, name: e.target.value })}
            placeholder="Jean Dupont"
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Téléphone
          </label>
          <Input
            value={config.phone}
            onChange={(e) => updateConfig({ ...config, phone: e.target.value })}
            placeholder="+225 07 XX XX XX XX"
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Email (optionnel)
          </label>
          <Input
            value={config.email}
            onChange={(e) => updateConfig({ ...config, email: e.target.value })}
            placeholder="contact@exemple.com"
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Organisation (optionnel)
          </label>
          <Input
            value={config.organization}
            onChange={(e) => updateConfig({ ...config, organization: e.target.value })}
            placeholder="Ma Société"
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>
      </div>
    </div>
  );
}

// Bloc Send Audio
export function SendAudioConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    url: "",
    asVoiceNote: true,
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-500/10 to-transparent border border-rose-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
            <Mic className="h-5 w-5 text-rose-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Envoyer Audio</h4>
            <p className="text-[10px] text-rose-400/60">Message vocal ou fichier audio</p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            URL du fichier audio
          </label>
          <Input
            value={config.url}
            onChange={(e) => updateConfig({ ...config, url: e.target.value })}
            placeholder="https://exemple.com/audio.mp3"
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-black/20">
          <span className="text-[10px] text-white/70">Envoyer comme note vocale</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.asVoiceNote}
              onChange={(e) => updateConfig({ ...config, asVoiceNote: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:bg-rose-500 transition-all"></div>
            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-4"></div>
          </label>
        </div>
      </div>
    </div>
  );
}

// Bloc Send Buttons
export function SendButtonsConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    text: "",
    buttons: [{ id: "1", text: "Option 1" }],
    footer: "",
  });

  const addButton = () => {
    if (config.buttons.length < 3) {
      updateConfig({
        ...config,
        buttons: [...config.buttons, { id: String(config.buttons.length + 1), text: "" }],
      });
    }
  };

  const removeButton = (index: number) => {
    updateConfig({
      ...config,
      buttons: config.buttons.filter((_: any, i: number) => i !== index),
    });
  };

  const updateButton = (index: number, text: string) => {
    const newButtons = [...config.buttons];
    newButtons[index] = { ...newButtons[index], text };
    updateConfig({ ...config, buttons: newButtons });
  };

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-500/10 to-transparent border border-teal-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
            <LayoutGrid className="h-5 w-5 text-teal-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Boutons Interactifs</h4>
            <p className="text-[10px] text-teal-400/60">Max 3 boutons</p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Message
          </label>
          <textarea
            value={config.text}
            onChange={(e) => updateConfig({ ...config, text: e.target.value })}
            className="w-full mt-1 h-20 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white"
            placeholder="Choisissez une option..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Boutons ({config.buttons.length}/3)
          </label>
          {config.buttons.map((btn: any, idx: number) => (
            <div key={idx} className="flex gap-2">
              <Input
                value={btn.text}
                onChange={(e) => updateButton(idx, e.target.value)}
                placeholder={`Bouton ${idx + 1}`}
                className="flex-1 bg-black/40 border-white/10 h-9"
              />
              {config.buttons.length > 1 && (
                <button
                  onClick={() => removeButton(idx)}
                  className="px-2 text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          {config.buttons.length < 3 && (
            <button
              onClick={addButton}
              className="text-[10px] text-teal-400 hover:text-teal-300"
            >
              + Ajouter un bouton
            </button>
          )}
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Pied de page (optionnel)
          </label>
          <Input
            value={config.footer}
            onChange={(e) => updateConfig({ ...config, footer: e.target.value })}
            placeholder="Répondez en cliquant sur un bouton"
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>
      </div>
    </div>
  );
}
