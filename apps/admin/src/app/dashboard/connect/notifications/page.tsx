"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useCallback, useRef } from "react";
import {
    Bell, BellRing, CheckCircle, Loader2, RefreshCw, Play, Pause,
    UserPlus, Key, AlertTriangle, Bot, Wifi, WifiOff, XCircle,
    Mail, MailCheck, Trash2, Clock, CreditCard, ArrowDownCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatNumber } from "@/lib/utils";
import { toast } from "sonner";

const EVENT_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
    new_user: { icon: UserPlus, color: "text-orange-400", label: "Nouvel utilisateur" },
    byok_key_added: { icon: Key, color: "text-purple-400", label: "Clé API ajoutée (BYOK)" },
    key_failure: { icon: AlertTriangle, color: "text-amber-400", label: "Clé API en échec" },
    ai_errors: { icon: XCircle, color: "text-red-400", label: "Erreurs IA" },
    agent_created: { icon: Bot, color: "text-blue-400", label: "Agent créé" },
    new_subscription: { icon: CreditCard, color: "text-emerald-400", label: "Nouvel abonnement" },
    subscription_renewed: { icon: CreditCard, color: "text-blue-400", label: "Abonnement renouvelé" },
    plan_changed: { icon: CreditCard, color: "text-purple-400", label: "Plan modifié" },
    subscription_cancelled: { icon: CreditCard, color: "text-red-400", label: "Abonnement annulé" },
    payment_failed: { icon: AlertTriangle, color: "text-red-500", label: "Paiement échoué" },
    auto_downgrade: { icon: ArrowDownCircle, color: "text-red-500", label: "Auto-downgrade (3j)" },
    bridge_down: { icon: WifiOff, color: "text-red-500", label: "Bridge WhatsApp DOWN" },
    bridge_back_online: { icon: Wifi, color: "text-emerald-400", label: "Bridge WhatsApp OK" },
    bridge_health: { icon: Wifi, color: "text-emerald-400", label: "Bridge OK" },
    bridge_still_down: { icon: WifiOff, color: "text-red-400", label: "Bridge toujours DOWN" },
};

interface NotifResult {
    event: string;
    count: number;
    sent: boolean;
    details?: string;
}

export default function NotificationsPage() {
    const [running, setRunning] = useState(false);
    const [autoCheck, setAutoCheck] = useState(false);
    const [lastCheck, setLastCheck] = useState<string | null>(null);
    const [results, setResults] = useState<NotifResult[]>([]);
    const [history, setHistory] = useState<NotifResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [smtpConfigured, setSmtpConfigured] = useState<boolean | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Check if SMTP is configured
    useEffect(() => {
        fetch("/api/connect/notifications/check")
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    setSmtpConfigured(true);
                    setResults(data.notifications || []);
                    setLastCheck(data.checkedAt);
                    // Add to history
                    if (data.notifications?.length) {
                        setHistory(prev => [...data.notifications.filter((n: NotifResult) => n.sent), ...prev].slice(0, 100));
                    }
                }
            })
            .catch(() => setSmtpConfigured(false));
    }, []);

    const runCheck = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/connect/notifications/check");
            const data = await res.json();
            if (data.success) {
                setResults(data.notifications || []);
                setLastCheck(data.checkedAt);
                const sent = data.notifications?.filter((n: NotifResult) => n.sent) || [];
                if (sent.length > 0) {
                    setHistory(prev => [...sent, ...prev].slice(0, 100));
                    toast.success(`${sent.length} notification${sent.length > 1 ? 's' : ''} envoyée${sent.length > 1 ? 's' : ''}`);
                } else {
                    toast.info("Aucun nouvel événement détecté");
                }
            } else {
                toast.error(data.error || "Erreur de vérification");
            }
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const toggleAutoCheck = useCallback(() => {
        if (autoCheck) {
            // Stop
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            setAutoCheck(false);
            toast.info("Vérification automatique désactivée");
        } else {
            // Start - check every 2 minutes
            setAutoCheck(true);
            intervalRef.current = setInterval(runCheck, 2 * 60 * 1000);
            toast.success("Vérification automatique activée (toutes les 2 min)");
            runCheck(); // Run immediately
        }
    }, [autoCheck, runCheck]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const sentCount = results.filter(r => r.sent).length;

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="size-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <BellRing className="size-5 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Notifications</h1>
                    </div>
                    <p className="text-zinc-500">Alertes email automatiques — inscriptions, erreurs, clés API, bridge WhatsApp</p>
                </motion.div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={toggleAutoCheck}
                        variant="outline"
                        size="sm"
                        className={cn(autoCheck && "border-emerald-500/30 text-emerald-400")}
                    >
                        {autoCheck ? <Pause className="size-4 mr-2" /> : <Play className="size-4 mr-2" />}
                        {autoCheck ? "Auto: ON" : "Auto: OFF"}
                    </Button>
                    <Button onClick={runCheck} variant="outline" size="sm" disabled={loading}>
                        <RefreshCw className={cn("size-4 mr-2", loading && "animate-spin")} />
                        Vérifier maintenant
                    </Button>
                </div>
            </div>

            {/* SMTP Config Notice */}
            {smtpConfigured === false && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5"
                >
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="size-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-amber-300">Configuration SMTP requise</p>
                            <p className="text-xs text-zinc-400 mt-1">
                                Ajoutez ces variables dans <code className="text-amber-400">.env.local</code> :
                            </p>
                            <pre className="text-[11px] text-zinc-400 mt-2 bg-black/30 rounded-lg p-3 font-mono">
{`SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-app
ADMIN_EMAIL=votre-email@gmail.com
WHATSAPP_BRIDGE_URL=https://whatsapp-bridge.onrender.com`}
                            </pre>
                            <p className="text-[11px] text-zinc-500 mt-2">
                                Pour Gmail, créez un <a href="https://myaccount.google.com/apppasswords" target="_blank" className="text-blue-400 underline">mot de passe d'application</a>.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ═══════════════════════════════════════════════ */}
            {/* ROW 1: Status Cards */}
            {/* ═══════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className={cn("p-5 rounded-2xl border",
                        autoCheck ? "border-emerald-500/20 bg-emerald-500/5" : "border-white/5 bg-white/[0.02]"
                    )}
                >
                    <div className="flex items-center gap-2 mb-3">
                        {autoCheck ? <Play className="size-4 text-emerald-400" /> : <Pause className="size-4 text-zinc-500" />}
                        <span className="text-xs font-medium text-zinc-500 uppercase">Auto-check</span>
                    </div>
                    <p className={cn("text-xl font-bold", autoCheck ? "text-emerald-400" : "text-zinc-400")}>
                        {autoCheck ? "Actif" : "Inactif"}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">{autoCheck ? "Toutes les 2 minutes" : "Manuel uniquement"}</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                    className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Mail className="size-4 text-blue-400" />
                        <span className="text-xs font-medium text-zinc-500 uppercase">Emails envoyés</span>
                    </div>
                    <p className="text-xl font-bold text-white">{sentCount}</p>
                    <p className="text-xs text-zinc-500 mt-1">Lors de la dernière vérif.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Bell className="size-4 text-amber-400" />
                        <span className="text-xs font-medium text-zinc-500 uppercase">Événements</span>
                    </div>
                    <p className="text-xl font-bold text-white">{results.length}</p>
                    <p className="text-xs text-zinc-500 mt-1">Détectés au total</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Clock className="size-4 text-zinc-400" />
                        <span className="text-xs font-medium text-zinc-500 uppercase">Dernière vérif.</span>
                    </div>
                    <p className="text-sm font-bold text-white">
                        {lastCheck ? new Date(lastCheck).toLocaleTimeString("fr-FR") : "—"}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                        {lastCheck ? new Date(lastCheck).toLocaleDateString("fr-FR") : "Jamais"}
                    </p>
                </motion.div>
            </div>

            {/* ═══════════════════════════════════════════════ */}
            {/* ROW 2: Event Types Monitored */}
            {/* ═══════════════════════════════════════════════ */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
            >
                <h3 className="text-lg font-bold text-white mb-4">Événements surveillés</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                        { key: "new_user", desc: "Quand un nouvel utilisateur s'inscrit sur Connect" },
                        { key: "new_subscription", desc: "Quand un utilisateur souscrit à un plan payant" },
                        { key: "subscription_renewed", desc: "Quand un abonnement est renouvelé avec succès" },
                        { key: "subscription_cancelled", desc: "Quand un abonnement est annulé" },
                        { key: "payment_failed", desc: "Quand un paiement Stripe échoue — 3j pour régulariser" },
                        { key: "auto_downgrade", desc: "Auto-downgrade vers Gratuit après 3 jours impayés" },
                        { key: "byok_key_added", desc: "Quand un utilisateur ajoute sa propre clé API" },
                        { key: "key_failure", desc: "Quand une clé API ne fonctionne plus (auth, quota)" },
                        { key: "ai_errors", desc: "Quand plusieurs erreurs IA sont détectées (3+)" },
                        { key: "agent_created", desc: "Quand un utilisateur crée un nouvel agent" },
                        { key: "bridge_down", desc: "Quand le bridge WhatsApp ne répond plus" },
                    ].map((item) => {
                        const config = EVENT_CONFIG[item.key];
                        const Icon = config?.icon || Bell;
                        const recent = results.find(r => r.event === item.key);
                        return (
                            <div key={item.key} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <Icon className={cn("size-5 shrink-0 mt-0.5", config?.color || "text-zinc-400")} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white">{config?.label || item.key}</p>
                                    <p className="text-[11px] text-zinc-500 mt-0.5">{item.desc}</p>
                                    {recent && (
                                        <div className="flex items-center gap-1 mt-1.5">
                                            {recent.sent ? (
                                                <MailCheck className="size-3 text-emerald-400" />
                                            ) : (
                                                <span className="size-2 rounded-full bg-zinc-600" />
                                            )}
                                            <span className={cn("text-[10px]", recent.sent ? "text-emerald-400" : "text-zinc-600")}>
                                                {recent.sent ? "Email envoyé" : "Aucun événement"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            {/* ═══════════════════════════════════════════════ */}
            {/* ROW 3: Last Check Results + History */}
            {/* ═══════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Last Check Results */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Dernière vérification</h3>
                        {loading && <Loader2 className="size-4 animate-spin text-blue-400" />}
                    </div>

                    {results.length > 0 ? (
                        <div className="space-y-2">
                            {results.map((r, idx) => {
                                const config = EVENT_CONFIG[r.event] || { icon: Bell, color: "text-zinc-400", label: r.event };
                                const Icon = config.icon;
                                return (
                                    <div key={`${r.event}-${idx}`}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-xl border",
                                            r.sent ? "border-blue-500/20 bg-blue-500/5" : "border-white/5 bg-white/[0.01]"
                                        )}
                                    >
                                        <Icon className={cn("size-4 shrink-0", config.color)} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-white">{config.label}</p>
                                            {r.details && (
                                                <p className="text-[10px] text-zinc-500 truncate">{r.details}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            {r.count > 1 && (
                                                <span className="text-[10px] text-zinc-500">×{r.count}</span>
                                            )}
                                            {r.sent ? (
                                                <MailCheck className="size-4 text-emerald-400" />
                                            ) : (
                                                <span className="text-[10px] text-zinc-600">—</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <CheckCircle className="size-8 text-emerald-400 mx-auto mb-2" />
                            <p className="text-sm text-zinc-400">Aucun événement</p>
                            <p className="text-xs text-zinc-600 mt-1">Cliquez "Vérifier maintenant" pour scanner</p>
                        </div>
                    )}
                </motion.div>

                {/* Notification History */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Historique emails envoyés</h3>
                        {history.length > 0 && (
                            <Button variant="ghost" size="sm" onClick={() => setHistory([])} className="text-xs text-zinc-500">
                                <Trash2 className="size-3 mr-1" /> Effacer
                            </Button>
                        )}
                    </div>

                    {history.length > 0 ? (
                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                            {history.map((r, idx) => {
                                const config = EVENT_CONFIG[r.event] || { icon: Mail, color: "text-zinc-400", label: r.event };
                                const Icon = config.icon;
                                return (
                                    <div key={`hist-${idx}`} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.02]">
                                        <div className={cn("size-7 rounded-lg flex items-center justify-center bg-white/5")}>
                                            <Icon className={cn("size-3.5", config.color)} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-white">{config.label}</p>
                                            {r.details && (
                                                <p className="text-[10px] text-zinc-500 truncate">{r.details}</p>
                                            )}
                                        </div>
                                        <MailCheck className="size-3.5 text-emerald-400 shrink-0" />
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Mail className="size-8 text-zinc-600 mx-auto mb-2" />
                            <p className="text-sm text-zinc-400">Aucun email envoyé</p>
                            <p className="text-xs text-zinc-600 mt-1">Les emails apparaîtront ici</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
