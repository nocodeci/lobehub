"use client";

import React from "react";
import { BlockConfigProps, parseConfig } from "./types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, Sparkles, Brain, Languages, FileText } from "lucide-react";

// Icône OpenAI
const OpenAIIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364l2.0201-1.1638a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
  </svg>
);

// Bloc GPT Analyze / GPT Respond
export function GPTConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    model: "gpt-4o",
    system: "",
    temperature: 0.7,
    maxTokens: 1000,
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#10a37f22] to-transparent border border-[#10a37f33] space-y-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <OpenAIIcon className="h-24 w-24" />
        </div>

        <div className="flex items-center justify-between relative">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-[#10a37f22] flex items-center justify-center border border-[#10a37f33]">
              <Bot className="h-3.5 w-3.5 text-[#10a37f]" />
            </div>
            <label className="text-[10px] font-black uppercase text-white/80 tracking-widest">
              Intelligence
            </label>
          </div>
          <Badge className="bg-[#10a37f22] text-[#10a37f] border-none text-[8px] font-bold uppercase px-2 shadow-sm">
            {config.model}
          </Badge>
        </div>

        <div className="space-y-2 relative">
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60 tracking-wider px-1">
            Modèle d&apos;Intelligence
          </label>
          <div className="relative">
            <select
              value={config.model}
              onChange={(e) => updateConfig({ ...config, model: e.target.value })}
              className="w-full bg-black/60 border border-white/10 rounded-xl h-10 text-xs px-3 text-white appearance-none cursor-pointer hover:border-[#10a37f55] transition-all font-bold focus:ring-1 focus:ring-[#10a37f33]"
            >
              <option value="gpt-4o">GPT-4o (L'intelligence pure)</option>
              <option value="gpt-4o-mini">GPT-4o Mini (Ultra-rapide)</option>
              <option value="o1-preview">o1-preview (Raisonnement avancé)</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Économique)</option>
            </select>
            <div className="absolute right-3 top-3 pointer-events-none">
              <Sparkles className="h-4 w-4 text-[#10a37f] opacity-50" />
            </div>
          </div>
        </div>

        <div className="space-y-2 relative">
          <div className="flex items-center justify-between px-1">
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60 tracking-widest">
              Rôle & Instructions (Prompt)
            </label>
            <Badge
              variant="outline"
              className="text-[7px] border-white/10 text-muted-foreground/50 font-black uppercase px-2"
            >
              System Message
            </Badge>
          </div>
          <textarea
            value={config.system}
            onChange={(e) => updateConfig({ ...config, system: e.target.value })}
            className="w-full h-44 bg-black/40 border border-white/10 rounded-2xl p-4 text-xs text-white/90 leading-relaxed font-medium focus:border-[#10a37f55] transition-all scrollbar-hide shadow-inner"
            placeholder="Tu es un assistant de vente chaleureux et efficace..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60 tracking-wider px-1">
            Température (créativité)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={config.temperature}
              onChange={(e) => updateConfig({ ...config, temperature: parseFloat(e.target.value) })}
              className="flex-1 h-2 bg-black/40 rounded-full appearance-none cursor-pointer"
            />
            <span className="text-xs font-bold text-[#10a37f] w-8">{config.temperature}</span>
          </div>
          <p className="text-[8px] text-muted-foreground/50 px-1">
            0 = Précis et cohérent | 1 = Créatif et varié
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex gap-3 shadow-inner">
        <Sparkles className="h-4 w-4 text-primary shrink-0 opacity-40 animate-pulse" />
        <p className="text-[9px] text-muted-foreground leading-relaxed font-medium italic">
          <b>Astuce:</b> Plus vos instructions sont précises (rôle, ton, limites), plus les
          réponses de l&apos;IA seront qualitatives.
        </p>
      </div>
    </div>
  );
}

// Bloc AI Translate
export function AITranslateConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    sourceLanguage: "auto",
    targetLanguage: "fr",
    preserveTone: true,
    model: "gpt-4o-mini",
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Languages className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Traduction IA</h4>
            <p className="text-[10px] text-blue-400/60">Traduction automatique intelligente</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Langue source
            </label>
            <select
              value={config.sourceLanguage}
              onChange={(e) => updateConfig({ ...config, sourceLanguage: e.target.value })}
              className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
            >
              <option value="auto">Détection auto</option>
              <option value="fr">Français</option>
              <option value="en">Anglais</option>
              <option value="es">Espagnol</option>
              <option value="ar">Arabe</option>
              <option value="zh">Chinois</option>
            </select>
          </div>
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Langue cible
            </label>
            <select
              value={config.targetLanguage}
              onChange={(e) => updateConfig({ ...config, targetLanguage: e.target.value })}
              className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
            >
              <option value="fr">Français</option>
              <option value="en">Anglais</option>
              <option value="es">Espagnol</option>
              <option value="ar">Arabe</option>
              <option value="zh">Chinois</option>
              <option value="pt">Portugais</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-black/20">
          <span className="text-[10px] text-white/70">Préserver le ton original</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.preserveTone}
              onChange={(e) => updateConfig({ ...config, preserveTone: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:bg-blue-500 transition-all"></div>
            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-4"></div>
          </label>
        </div>
      </div>
    </div>
  );
}

// Bloc AI Summarize
export function AISummarizeConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    maxLength: 200,
    style: "bullet",
    includeKeyPoints: true,
    model: "gpt-4o-mini",
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-500/10 to-transparent border border-violet-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
            <FileText className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Résumé IA</h4>
            <p className="text-[10px] text-violet-400/60">Synthèse automatique du contenu</p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Longueur max (mots)
          </label>
          <Input
            type="number"
            min={50}
            max={1000}
            value={config.maxLength}
            onChange={(e) => updateConfig({ ...config, maxLength: parseInt(e.target.value) || 200 })}
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Style de résumé
          </label>
          <select
            value={config.style}
            onChange={(e) => updateConfig({ ...config, style: e.target.value })}
            className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
          >
            <option value="bullet">Points clés (liste)</option>
            <option value="paragraph">Paragraphe fluide</option>
            <option value="executive">Résumé exécutif</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-black/20">
          <span className="text-[10px] text-white/70">Inclure les points clés</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.includeKeyPoints}
              onChange={(e) => updateConfig({ ...config, includeKeyPoints: e.target.checked })}
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

// Bloc Sentiment Analysis
export function SentimentConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    engine: "gpt-4o",
    target: "last_message",
    detectEmotions: true,
    detectTone: true,
    detectLanguage: false,
    urgencyScale: true,
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
            <Brain className="h-5 w-5 text-pink-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Analyse de Sentiment</h4>
            <p className="text-[10px] text-pink-400/60">Comprendre l'émotion du client</p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Cible de l'analyse
          </label>
          <select
            value={config.target}
            onChange={(e) => updateConfig({ ...config, target: e.target.value })}
            className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
          >
            <option value="last_message">Dernier message</option>
            <option value="conversation">Toute la conversation</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { key: "detectEmotions", label: "Émotions" },
            { key: "detectTone", label: "Ton" },
            { key: "urgencyScale", label: "Urgence" },
          ].map((option) => (
            <label key={option.key} className="flex items-center gap-2 p-2 rounded-lg bg-black/20 cursor-pointer">
              <input
                type="checkbox"
                checked={config[option.key as keyof typeof config] as boolean}
                onChange={(e) => updateConfig({ ...config, [option.key]: e.target.checked })}
                className="rounded border-white/20"
              />
              <span className="text-[10px] text-white/70">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// Bloc AI Moderation
export function AIModerationConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, { blockIfFlagged: true, threshold: 70 });
  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-500/20 flex items-center justify-center">
            <Brain className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Modération IA</h4>
            <p className="text-[10px] text-red-400/60">Détecte contenu inapproprié</p>
          </div>
        </div>
        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">Seuil (0-100)</label>
          <Input type="number" min={0} max={100} value={config.threshold} onChange={(e) => updateConfig({ ...config, threshold: parseInt(e.target.value) })} className="mt-1 bg-black/40 border-white/10" />
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl bg-black/20">
          <span className="text-[10px] text-white/70">Bloquer si flaggé</span>
          <input type="checkbox" checked={config.blockIfFlagged} onChange={(e) => updateConfig({ ...config, blockIfFlagged: e.target.checked })} />
        </div>
      </div>
    </div>
  );
}

// Bloc AI Analyze Image
export function AIAnalyzeImageConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, { detailed: true });
  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Analyser Image</h4>
            <p className="text-[10px] text-cyan-400/60">GPT-4 Vision décrit l'image</p>
          </div>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl bg-black/20">
          <span className="text-[10px] text-white/70">Description détaillée</span>
          <input type="checkbox" checked={config.detailed} onChange={(e) => updateConfig({ ...config, detailed: e.target.checked })} />
        </div>
      </div>
    </div>
  );
}

// Bloc AI Generate Image
export function AIGenerateImageConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, { size: "1024x1024", quality: "standard", prompt: "" });
  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Générer Image (DALL-E)</h4>
            <p className="text-[10px] text-purple-400/60">Crée une image depuis un prompt</p>
          </div>
        </div>
        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">Prompt</label>
          <textarea value={config.prompt} onChange={(e) => updateConfig({ ...config, prompt: e.target.value })} className="w-full mt-1 h-20 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white" placeholder="Décrivez l'image à générer..." />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">Taille</label>
            <select value={config.size} onChange={(e) => updateConfig({ ...config, size: e.target.value })} className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white">
              <option value="1024x1024">1024x1024</option>
              <option value="1792x1024">1792x1024</option>
              <option value="1024x1792">1024x1792</option>
            </select>
          </div>
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">Qualité</label>
            <select value={config.quality} onChange={(e) => updateConfig({ ...config, quality: e.target.value })} className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white">
              <option value="standard">Standard</option>
              <option value="hd">HD</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// Bloc AI Generate Audio (TTS)
export function AIGenerateAudioConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, { voice: "alloy", speed: 1.0, text: "" });
  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Générer Audio (TTS)</h4>
            <p className="text-[10px] text-orange-400/60">Convertit texte en voix</p>
          </div>
        </div>
        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">Voix</label>
          <select value={config.voice} onChange={(e) => updateConfig({ ...config, voice: e.target.value })} className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white">
            <option value="alloy">Alloy</option>
            <option value="echo">Echo</option>
            <option value="fable">Fable</option>
            <option value="onyx">Onyx</option>
            <option value="nova">Nova</option>
            <option value="shimmer">Shimmer</option>
          </select>
        </div>
        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">Vitesse: {config.speed}x</label>
          <input type="range" min="0.25" max="4" step="0.25" value={config.speed} onChange={(e) => updateConfig({ ...config, speed: parseFloat(e.target.value) })} className="w-full" />
        </div>
      </div>
    </div>
  );
}

// Bloc AI Transcribe (Whisper)
export function AITranscribeConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, { language: "auto" });
  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Transcrire Audio (Whisper)</h4>
            <p className="text-[10px] text-emerald-400/60">Audio → Texte</p>
          </div>
        </div>
        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">Langue</label>
          <select value={config.language} onChange={(e) => updateConfig({ ...config, language: e.target.value })} className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white">
            <option value="auto">Détection auto</option>
            <option value="fr">Français</option>
            <option value="en">Anglais</option>
            <option value="es">Espagnol</option>
            <option value="ar">Arabe</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// Bloc AI Generate Video (Sora)
export function AIGenerateVideoConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, { duration: 5, prompt: "" });
  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Générer Vidéo (Sora)</h4>
            <p className="text-[10px] text-indigo-400/60">Crée une vidéo depuis un prompt</p>
          </div>
        </div>
        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">Prompt</label>
          <textarea value={config.prompt} onChange={(e) => updateConfig({ ...config, prompt: e.target.value })} className="w-full mt-1 h-20 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white" placeholder="Décrivez la vidéo à générer..." />
        </div>
        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">Durée (secondes)</label>
          <Input type="number" min={1} max={60} value={config.duration} onChange={(e) => updateConfig({ ...config, duration: parseInt(e.target.value) })} className="mt-1 bg-black/40 border-white/10" />
        </div>
      </div>
    </div>
  );
}

