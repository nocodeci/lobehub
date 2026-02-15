"use client";

import React from "react";
import { BlockConfigProps, parseConfig } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Users,
  Smartphone,
  Zap,
  Trash2,
  Clock,
  Webhook,
  Calendar,
  Globe,
} from "lucide-react";

// Icônes personnalisées
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

// Bloc WhatsApp/Telegram Message
export function WhatsAppTriggerConfig({ node, context }: BlockConfigProps) {
  const {
    isClientWhatsAppConnected,
    clientWhatsAppNumber,
    isWhatsAppConnected,
    automationId,
    handleDisconnectWhatsApp,
    isDisconnectingWhatsApp,
    setShowConnectionModal,
  } = context || {};

  return (
    <div className="space-y-4">
      <div
        className={`p-8 rounded-3xl bg-gradient-to-br ${isClientWhatsAppConnected ? "from-emerald-500/10" : "from-amber-500/10"} to-transparent border ${isClientWhatsAppConnected ? "border-emerald-500/20 hover:border-emerald-500/30" : "border-amber-500/20 hover:border-amber-500/30"} flex flex-col items-center justify-center text-center space-y-4 shadow-inner relative overflow-hidden transition-all group`}
      >
        <div
          className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_${isClientWhatsAppConnected ? "rgba(16,185,129,0.05)" : "rgba(245,158,11,0.05)"}_0%,_transparent_70%)] pointer-events-none`}
        />
        <div
          className={`h-20 w-20 rounded-[2.5rem] ${isClientWhatsAppConnected ? "bg-emerald-500/10 border-emerald-500/30" : "bg-amber-500/10 border-amber-500/30"} flex items-center justify-center border-2 shadow-[0_20px_40px_-10px_${isClientWhatsAppConnected ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)"}] group-hover:scale-105 transition-transform duration-500`}
        >
          {node.type === "whatsapp_message" ? (
            <WhatsAppIcon className="h-10 w-10" />
          ) : (
            <TelegramIcon className="h-10 w-10" />
          )}
        </div>
        <div className="space-y-1 relative">
          <h4 className="text-[13px] font-black uppercase text-white tracking-[0.3em] italic">
            {isClientWhatsAppConnected ? "Écoute Active" : "Configuration Requise"}
          </h4>
          <p
            className={`text-[9px] ${isClientWhatsAppConnected ? "text-emerald-400/60" : "text-amber-400/60"} font-black uppercase tracking-widest`}
          >
            {isClientWhatsAppConnected
              ? "Votre WhatsApp Business"
              : "Connectez votre WhatsApp"}
          </p>
        </div>

        {isClientWhatsAppConnected ? (
          <>
            <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 relative">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-[ping_1.5s_infinite]" />
              <span className="text-[9px] font-black uppercase tracking-tighter text-emerald-400">
                Connecté {clientWhatsAppNumber && `• ${clientWhatsAppNumber}`}
              </span>
            </div>
            <Button
              onClick={handleDisconnectWhatsApp}
              disabled={isDisconnectingWhatsApp}
              className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-300 font-bold h-10 rounded-xl gap-2 mt-2 border border-red-500/20"
            >
              <Trash2 className="h-4 w-4" />
              {isDisconnectingWhatsApp ? "Déconnexion..." : "Déconnecter WhatsApp"}
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20 relative">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-tighter text-amber-400">
                WhatsApp Non Connecté
              </span>
            </div>
            <Button
              onClick={() => setShowConnectionModal?.(true)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-10 rounded-xl gap-2 mt-2"
            >
              <Smartphone className="h-4 w-4" /> Connecter mon WhatsApp
            </Button>
          </>
        )}
      </div>

      <div
        className={`p-4 rounded-2xl ${isClientWhatsAppConnected ? "bg-white/5 border-white/5" : "bg-amber-500/5 border-amber-500/10"} border`}
      >
        <p className="text-[10px] text-muted-foreground text-center leading-relaxed font-medium italic">
          {isClientWhatsAppConnected
            ? `Dès qu'un client envoie un message sur votre ${node.type === "whatsapp_message" ? "WhatsApp" : "Telegram"}, ce bloc lancera instantanément la suite du workflow.`
            : `⚠️ Chaque automatisation nécessite son propre numéro WhatsApp. Connectez un numéro dédié à ce workflow pour recevoir les messages de vos clients. Une fois publié, ce workflow sera actif 24/7.`}
        </p>
      </div>

      <div className="p-2 rounded-lg bg-white/5 border border-white/5">
        <p className="text-[8px] text-muted-foreground/60 text-center font-mono">
          ID: {automationId}
        </p>
      </div>

      {isWhatsAppConnected && (
        <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-zinc-700/50 flex items-center justify-center">
            <Zap className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="flex-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
              Simulateur
            </p>
            <p className="text-[8px] text-zinc-500">Instance de test disponible</p>
          </div>
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
        </div>
      )}
    </div>
  );
}

// Bloc New Contact
export function NewContactConfig({ node }: BlockConfigProps) {
  return (
    <div className="space-y-4">
      <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 flex flex-col items-center justify-center text-center space-y-4 shadow-inner group transition-all hover:border-blue-500/30">
        <div className="h-20 w-20 rounded-[2.5rem] bg-blue-500/10 flex items-center justify-center border-2 border-blue-500/30 shadow-[0_20px_40px_-10px_rgba(59,130,246,0.3)] group-hover:scale-105 transition-transform duration-500">
          <Users className="h-10 w-10 text-blue-400" />
        </div>
        <div className="space-y-1">
          <h4 className="text-[13px] font-black uppercase text-white tracking-[0.3em] italic">
            Nouveau Contact
          </h4>
          <p className="text-[9px] text-blue-400/60 font-black uppercase tracking-widest">
            Acquisition client
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20">
          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[9px] font-black text-blue-400 uppercase tracking-tighter">
            Premier Message
          </span>
        </div>
      </div>
      <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
        <p className="text-[10px] text-muted-foreground text-center leading-relaxed font-medium italic">
          Ce bloc est idéal pour envoyer un message de bienvenue personnalisé ou un
          cadeau aux nouveaux prospects.
        </p>
      </div>
    </div>
  );
}

// Bloc Scheduled (Planifié)
export function ScheduledConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    scheduleType: "interval",
    intervalValue: 1,
    intervalUnit: "hours",
    cronExpression: "",
    timezone: "Africa/Abidjan",
    startDate: "",
    endDate: "",
  });

  return (
    <div className="space-y-4">
      <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Planification</h4>
            <p className="text-[10px] text-purple-400/60">Exécution programmée</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60 tracking-wider">
              Type de planification
            </label>
            <select
              value={config.scheduleType}
              onChange={(e) => updateConfig({ ...config, scheduleType: e.target.value })}
              className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
            >
              <option value="interval">Intervalle régulier</option>
              <option value="cron">Expression Cron</option>
              <option value="once">Une seule fois</option>
            </select>
          </div>

          {config.scheduleType === "interval" && (
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
                  Valeur
                </label>
                <Input
                  type="number"
                  min={1}
                  value={config.intervalValue}
                  onChange={(e) =>
                    updateConfig({ ...config, intervalValue: parseInt(e.target.value) || 1 })
                  }
                  className="mt-1 bg-black/40 border-white/10 h-10"
                />
              </div>
              <div className="flex-1">
                <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
                  Unité
                </label>
                <select
                  value={config.intervalUnit}
                  onChange={(e) => updateConfig({ ...config, intervalUnit: e.target.value })}
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Heures</option>
                  <option value="days">Jours</option>
                  <option value="weeks">Semaines</option>
                </select>
              </div>
            </div>
          )}

          {config.scheduleType === "cron" && (
            <div>
              <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
                Expression Cron
              </label>
              <Input
                value={config.cronExpression}
                onChange={(e) => updateConfig({ ...config, cronExpression: e.target.value })}
                placeholder="0 9 * * 1-5"
                className="mt-1 bg-black/40 border-white/10 h-10 font-mono text-xs"
              />
              <p className="text-[8px] text-muted-foreground/50 mt-1">
                Ex: "0 9 * * 1-5" = Chaque jour à 9h du lundi au vendredi
              </p>
            </div>
          )}

          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Fuseau horaire
            </label>
            <select
              value={config.timezone}
              onChange={(e) => updateConfig({ ...config, timezone: e.target.value })}
              className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
            >
              <option value="Africa/Abidjan">Abidjan (GMT+0)</option>
              <option value="Africa/Lagos">Lagos (GMT+1)</option>
              <option value="Europe/Paris">Paris (GMT+1/+2)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// Bloc Webhook Trigger
export function WebhookTriggerConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    webhookUrl: "",
    secret: "",
    method: "POST",
    headers: {},
  });

  const generatedUrl = `https://api.wozif.com/webhooks/${node.id}`;

  return (
    <div className="space-y-4">
      <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <Webhook className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Webhook Entrant</h4>
            <p className="text-[10px] text-orange-400/60">Déclenché par appel HTTP</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              URL du Webhook
            </label>
            <div className="flex gap-2 mt-1">
              <Input
                value={generatedUrl}
                readOnly
                className="flex-1 bg-black/40 border-white/10 h-10 font-mono text-[10px]"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(generatedUrl)}
                className="h-10 px-3"
              >
                Copier
              </Button>
            </div>
          </div>

          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Secret (optionnel)
            </label>
            <Input
              type="password"
              value={config.secret}
              onChange={(e) => updateConfig({ ...config, secret: e.target.value })}
              placeholder="Clé secrète pour valider les requêtes"
              className="mt-1 bg-black/40 border-white/10 h-10"
            />
          </div>

          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Méthode HTTP acceptée
            </label>
            <select
              value={config.method}
              onChange={(e) => updateConfig({ ...config, method: e.target.value })}
              className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
            >
              <option value="POST">POST</option>
              <option value="GET">GET</option>
              <option value="PUT">PUT</option>
              <option value="ANY">Toutes méthodes</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/10">
        <p className="text-[9px] text-muted-foreground italic">
          Utilisez cette URL pour déclencher l'automatisation depuis un service externe (Zapier,
          Make, API personnalisée, etc.)
        </p>
      </div>
    </div>
  );
}

// Bloc Keyword
export function KeywordConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, { keywords: "" });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <label className="text-[9px] font-bold uppercase text-muted-foreground/60 tracking-wider">
          Déclencheurs (un par ligne)
        </label>
        <Badge
          variant="outline"
          className="text-[7px] border-primary/30 text-primary uppercase font-black"
        >
          Insensible à la casse
        </Badge>
      </div>
      <textarea
        value={config.keywords}
        onChange={(e) => updateConfig({ ...config, keywords: e.target.value })}
        className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 text-xs text-white/90 font-mono focus:border-primary/50 transition-all shadow-inner scrollbar-hide"
        placeholder="devis&#10;prix&#10;commander&#10;acheter"
      />
      <div className="p-3 rounded-xl bg-primary/5 border border-white/5">
        <p className="text-[8px] text-muted-foreground italic px-1 font-medium">
          L'automatisation se lancera si le message contient l'un de ces mots.
        </p>
      </div>
    </div>
  );
}
