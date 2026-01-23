"use client";

import React from "react";
import { BlockConfigProps, parseConfig } from "./types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Webhook,
  Bell,
  MessageSquare,
} from "lucide-react";

// Icône Slack
const SlackIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
  </svg>
);

// Bloc Notify Email
export function NotifyEmailConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    to: "",
    subject: "",
    body: "",
    cc: "",
    bcc: "",
    replyTo: "",
    template: "default",
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Mail className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Notification Email</h4>
            <p className="text-[10px] text-blue-400/60">Envoyer un email</p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Destinataire(s)
          </label>
          <Input
            value={config.to}
            onChange={(e) => updateConfig({ ...config, to: e.target.value })}
            placeholder="email@exemple.com, autre@exemple.com"
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Objet
          </label>
          <Input
            value={config.subject}
            onChange={(e) => updateConfig({ ...config, subject: e.target.value })}
            placeholder="Nouveau message de {{nom}}"
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Contenu
          </label>
          <textarea
            value={config.body}
            onChange={(e) => updateConfig({ ...config, body: e.target.value })}
            className="w-full mt-1 h-28 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white"
            placeholder="Bonjour,&#10;&#10;Vous avez reçu un nouveau message de {{nom}}:&#10;{{message}}"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              CC (optionnel)
            </label>
            <Input
              value={config.cc}
              onChange={(e) => updateConfig({ ...config, cc: e.target.value })}
              placeholder="copie@exemple.com"
              className="mt-1 bg-black/40 border-white/10 h-9 text-xs"
            />
          </div>
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Répondre à
            </label>
            <Input
              value={config.replyTo}
              onChange={(e) => updateConfig({ ...config, replyTo: e.target.value })}
              placeholder="support@exemple.com"
              className="mt-1 bg-black/40 border-white/10 h-9 text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Bloc Notify Webhook
export function NotifyWebhookConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    url: "",
    method: "POST",
    headers: {},
    body: "",
    contentType: "application/json",
    timeout: 30,
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <Webhook className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Webhook Sortant</h4>
            <p className="text-[10px] text-orange-400/60">Appel HTTP externe</p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            URL
          </label>
          <Input
            value={config.url}
            onChange={(e) => updateConfig({ ...config, url: e.target.value })}
            placeholder="https://api.exemple.com/webhook"
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Méthode
            </label>
            <select
              value={config.method}
              onChange={(e) => updateConfig({ ...config, method: e.target.value })}
              className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
            >
              <option value="POST">POST</option>
              <option value="GET">GET</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Content-Type
            </label>
            <select
              value={config.contentType}
              onChange={(e) => updateConfig({ ...config, contentType: e.target.value })}
              className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
            >
              <option value="application/json">JSON</option>
              <option value="application/x-www-form-urlencoded">Form URL Encoded</option>
              <option value="text/plain">Text</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Corps de la requête (JSON)
          </label>
          <textarea
            value={config.body}
            onChange={(e) => updateConfig({ ...config, body: e.target.value })}
            className="w-full mt-1 h-24 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white font-mono"
            placeholder='{"contact": "{{telephone}}", "message": "{{message}}"}'
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Timeout (secondes)
          </label>
          <Input
            type="number"
            min={5}
            max={120}
            value={config.timeout}
            onChange={(e) => updateConfig({ ...config, timeout: parseInt(e.target.value) || 30 })}
            className="mt-1 bg-black/40 border-white/10 h-10 w-24"
          />
        </div>
      </div>
    </div>
  );
}

// Bloc Notify Slack
export function NotifySlackConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    webhookUrl: "",
    channel: "",
    message: "",
    username: "Wozif Bot",
    iconEmoji: ":robot_face:",
    attachments: false,
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#4A154B]/20 to-transparent border border-[#4A154B]/30 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#4A154B]/30 flex items-center justify-center">
            <SlackIcon className="h-5 w-5 text-[#E01E5A]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Notification Slack</h4>
            <p className="text-[10px] text-[#ECB22E]">Envoyer sur Slack</p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Webhook URL
          </label>
          <Input
            value={config.webhookUrl}
            onChange={(e) => updateConfig({ ...config, webhookUrl: e.target.value })}
            placeholder="https://hooks.slack.com/services/..."
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Canal (optionnel)
          </label>
          <Input
            value={config.channel}
            onChange={(e) => updateConfig({ ...config, channel: e.target.value })}
            placeholder="#notifications"
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Message
          </label>
          <textarea
            value={config.message}
            onChange={(e) => updateConfig({ ...config, message: e.target.value })}
            className="w-full mt-1 h-20 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white"
            placeholder="🔔 Nouveau message de *{{nom}}*: {{message}}"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Nom du bot
            </label>
            <Input
              value={config.username}
              onChange={(e) => updateConfig({ ...config, username: e.target.value })}
              className="mt-1 bg-black/40 border-white/10 h-9"
            />
          </div>
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Emoji
            </label>
            <Input
              value={config.iconEmoji}
              onChange={(e) => updateConfig({ ...config, iconEmoji: e.target.value })}
              className="mt-1 bg-black/40 border-white/10 h-9"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Bloc Notify Internal
export function NotifyInternalConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    type: "push",
    title: "",
    message: "",
    priority: "normal",
    sound: true,
    recipients: "all",
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Bell className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Notification Interne</h4>
            <p className="text-[10px] text-purple-400/60">Alerte pour l'équipe</p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Type de notification
          </label>
          <select
            value={config.type}
            onChange={(e) => updateConfig({ ...config, type: e.target.value })}
            className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
          >
            <option value="push">Push (temps réel)</option>
            <option value="email">Email interne</option>
            <option value="dashboard">Dashboard uniquement</option>
          </select>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Titre
          </label>
          <Input
            value={config.title}
            onChange={(e) => updateConfig({ ...config, title: e.target.value })}
            placeholder="Nouveau lead !"
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Message
          </label>
          <textarea
            value={config.message}
            onChange={(e) => updateConfig({ ...config, message: e.target.value })}
            className="w-full mt-1 h-20 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white"
            placeholder="{{nom}} vient d'envoyer un message..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Priorité
            </label>
            <select
              value={config.priority}
              onChange={(e) => updateConfig({ ...config, priority: e.target.value })}
              className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
            >
              <option value="low">Basse</option>
              <option value="normal">Normale</option>
              <option value="high">Haute</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Destinataires
            </label>
            <select
              value={config.recipients}
              onChange={(e) => updateConfig({ ...config, recipients: e.target.value })}
              className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
            >
              <option value="all">Toute l'équipe</option>
              <option value="admins">Admins seulement</option>
              <option value="assigned">Agent assigné</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-black/20">
          <span className="text-[10px] text-white/70">Son de notification</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.sound}
              onChange={(e) => updateConfig({ ...config, sound: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:bg-purple-500 transition-all"></div>
            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-4"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
