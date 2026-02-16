"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import {
    AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
    AlertTriangle, CheckCircle, Clock, Loader2, RefreshCw,
    XCircle, Activity, Cpu, MessageSquare, Users,
    TrendingDown, Zap, Bug, ShieldAlert, Plug,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatNumber } from "@/lib/utils";

const PERIODS = [
    { key: "24h", label: "24h" },
    { key: "7d", label: "7 jours" },
    { key: "30d", label: "30 jours" },
    { key: "90d", label: "90 jours" },
];

const STATUS_STYLES: Record<string, { color: string; bg: string; icon: any; label: string }> = {
    healthy: { color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle, label: "Sain" },
    warning: { color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", icon: AlertTriangle, label: "Attention" },
    critical: { color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: XCircle, label: "Critique" },
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-3 shadow-xl">
                <p className="text-xs text-zinc-400 mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
                        {entry.name}: {formatNumber(entry.value)}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

function timeAgo(dateStr: string) {
    if (!dateStr) return "—";
    const diff = Date.now() - new Date(dateStr).getTime();
    const secs = Math.floor(diff / 1000);
    if (secs < 60) return `${secs}s`;
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}j`;
}

function parseErrorMessage(error: any): string {
    if (!error) return "Erreur inconnue";
    if (typeof error === "string") return error;
    return error.message || error.body?.message || error.errorMessage || error.type || JSON.stringify(error).slice(0, 120);
}

export default function MonitoringPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState("7d");
    const [error, setError] = useState<string | null>(null);
    const [expandedError, setExpandedError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/connect/monitoring?period=${period}`);
            const json = await res.json();
            if (json.success) {
                setData(json);
            } else {
                setError(json.error);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [period]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Auto refresh every 30s
    useEffect(() => {
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [fetchData]);

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="size-8 animate-spin text-red-500" />
            </div>
        );
    }

    if (error && !data) {
        return (
            <div className="p-8">
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
                    <p className="text-red-400 mb-4">Erreur: {error}</p>
                    <Button onClick={fetchData} variant="outline" size="sm">
                        <RefreshCw className="size-4 mr-2" /> Réessayer
                    </Button>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const { health, errors, asyncTasks, pluginErrors } = data;
    const statusStyle = STATUS_STYLES[health.status] || STATUS_STYLES.healthy;
    const StatusIcon = statusStyle.icon;

    const errorChartData = errors.byDay.map((d: any) => ({
        name: new Date(d.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
        erreurs: d.errors,
        total: d.total,
    }));

    const totalAsyncTasks = asyncTasks.byStatus.reduce((s: number, t: any) => s + t.count, 0);
    const failedAsyncCount = asyncTasks.byStatus
        .filter((t: any) => t.status === 'error' || t.status === 'failed')
        .reduce((s: number, t: any) => s + t.count, 0);

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="size-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/20">
                            <Bug className="size-5 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Monitoring</h1>
                    </div>
                    <p className="text-zinc-500">Suivi des erreurs, bugs et santé de Connect — actualisation auto 30s</p>
                </motion.div>

                <div className="flex items-center gap-3">
                    <div className="flex gap-1 p-1 rounded-lg bg-white/5">
                        {PERIODS.map((p) => (
                            <button
                                key={p.key}
                                onClick={() => setPeriod(p.key)}
                                className={cn(
                                    "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                                    period === p.key ? "bg-red-600 text-white" : "text-zinc-500 hover:text-white"
                                )}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                    <Button onClick={fetchData} variant="outline" size="sm" disabled={loading}>
                        <RefreshCw className={cn("size-4 mr-2", loading && "animate-spin")} />
                        {loading ? "..." : "Actualiser"}
                    </Button>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════ */}
            {/* ROW 1: System Health */}
            {/* ═══════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Overall Status */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className={cn("p-5 rounded-2xl border", statusStyle.bg)}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <StatusIcon className={cn("size-5", statusStyle.color)} />
                        <span className={cn("text-sm font-bold", statusStyle.color)}>{statusStyle.label}</span>
                    </div>
                    <p className="text-xs text-zinc-500">Statut système global</p>
                    <p className="text-[10px] text-zinc-600 mt-1">DB: {health.dbLatency}ms latence</p>
                </motion.div>

                {/* Error Rate */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                    className={cn("p-5 rounded-2xl border",
                        errors.errorRate > 5 ? "border-red-500/20 bg-red-500/5" :
                        errors.errorRate > 1 ? "border-amber-500/20 bg-amber-500/5" :
                        "border-white/5 bg-white/[0.02]"
                    )}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingDown className="size-4 text-red-400" />
                        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Taux erreur</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{errors.errorRate}%</p>
                    <p className="text-xs text-zinc-500">{formatNumber(errors.total)} / {formatNumber(errors.totalMessages)} msgs</p>
                </motion.div>

                {/* Active now */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Users className="size-4 text-emerald-400" />
                        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">En ligne</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{health.activeNow}</p>
                    <p className="text-xs text-zinc-500">Actifs dans la dernière heure</p>
                </motion.div>

                {/* Messages/hour */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="size-4 text-blue-400" />
                        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Msgs/h</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{health.msgsLastHour}</p>
                    <p className="text-xs text-zinc-500">{health.errorsLastHour} erreurs cette heure</p>
                </motion.div>

                {/* Async Tasks */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Zap className="size-4 text-amber-400" />
                        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Tâches</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{totalAsyncTasks}</p>
                    <p className="text-xs text-zinc-500">{failedAsyncCount} échouées</p>
                </motion.div>
            </div>

            {/* ═══════════════════════════════════════════════ */}
            {/* ROW 2: Error Timeline + Error by Provider */}
            {/* ═══════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Error Timeline Chart */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
                >
                    <h3 className="text-lg font-bold text-white mb-1">Erreurs dans le temps</h3>
                    <p className="text-sm text-zinc-500 mb-6">Erreurs vs messages totaux par jour</p>
                    <div className="h-[260px]">
                        {errorChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={errorChartData}>
                                    <defs>
                                        <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                    <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="erreurs" name="Erreurs" stroke="#ef4444" strokeWidth={2} fill="url(#colorErrors)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center">
                                    <CheckCircle className="size-8 text-emerald-400 mx-auto mb-2" />
                                    <p className="text-sm text-zinc-400">Aucune erreur sur cette période</p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Errors by Provider */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
                >
                    <div className="flex items-center gap-2 mb-1">
                        <Cpu className="size-5 text-red-400" />
                        <h3 className="text-lg font-bold text-white">Erreurs par provider</h3>
                    </div>
                    <p className="text-sm text-zinc-500 mb-4">Taux d'erreur par fournisseur IA</p>
                    <div className="space-y-3">
                        {errors.byProvider.length > 0 ? errors.byProvider.map((p: any) => (
                            <div key={p.provider} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-white">{p.provider}</span>
                                    <span className={cn("text-xs font-bold",
                                        parseFloat(p.errorRate) > 5 ? "text-red-400" :
                                        parseFloat(p.errorRate) > 1 ? "text-amber-400" :
                                        "text-emerald-400"
                                    )}>
                                        {p.errorRate}%
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-zinc-500">
                                    <span>{p.errorCount} erreurs / {formatNumber(p.totalCount)} msgs</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mt-2">
                                    <div
                                        className={cn("h-full rounded-full",
                                            parseFloat(p.errorRate) > 5 ? "bg-red-500" :
                                            parseFloat(p.errorRate) > 1 ? "bg-amber-500" :
                                            "bg-emerald-500"
                                        )}
                                        style={{ width: `${Math.min(parseFloat(p.errorRate) * 10, 100)}%` }}
                                    />
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-6">
                                <CheckCircle className="size-6 text-emerald-400 mx-auto mb-2" />
                                <p className="text-sm text-zinc-400">Aucune erreur provider</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* ═══════════════════════════════════════════════ */}
            {/* ROW 3: Error Types + Error Models + Plugin Errors */}
            {/* ═══════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Error Types */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <ShieldAlert className="size-5 text-red-400" />
                        <h3 className="text-lg font-bold text-white">Types d'erreurs</h3>
                    </div>
                    <div className="space-y-2">
                        {errors.byType.length > 0 ? errors.byType.map((t: any) => (
                            <div key={t.type} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.03]">
                                <span className="text-xs text-zinc-300 truncate max-w-[180px] font-mono">{t.type}</span>
                                <span className="text-xs font-bold text-red-400">{t.count}</span>
                            </div>
                        )) : (
                            <p className="text-sm text-zinc-500 text-center py-4">Aucun type d'erreur</p>
                        )}
                    </div>
                </motion.div>

                {/* Errors by Model */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="size-5 text-amber-400" />
                        <h3 className="text-lg font-bold text-white">Modèles problématiques</h3>
                    </div>
                    <div className="space-y-2">
                        {errors.byModel.length > 0 ? errors.byModel.slice(0, 8).map((m: any, idx: number) => (
                            <div key={`${m.model}-${idx}`} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.03]">
                                <div className="min-w-0">
                                    <p className="text-xs text-zinc-300 truncate max-w-[160px]">{m.model}</p>
                                    <p className="text-[10px] text-zinc-600">{m.provider}</p>
                                </div>
                                <span className="text-xs font-bold text-amber-400">{m.errorCount}</span>
                            </div>
                        )) : (
                            <p className="text-sm text-zinc-500 text-center py-4">Aucune erreur modèle</p>
                        )}
                    </div>
                </motion.div>

                {/* Plugin/Tool Errors + Async Tasks */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                    className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Plug className="size-5 text-purple-400" />
                        <h3 className="text-lg font-bold text-white">Plugins & Tâches</h3>
                    </div>

                    {/* Plugin errors */}
                    {pluginErrors.length > 0 && (
                        <div className="mb-4">
                            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Erreurs plugins</p>
                            {pluginErrors.map((p: any) => (
                                <div key={p.plugin} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.03]">
                                    <span className="text-xs text-zinc-300 truncate max-w-[160px]">{p.plugin}</span>
                                    <span className="text-xs font-bold text-purple-400">{p.errorCount}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Async task status */}
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Tâches async</p>
                    <div className="space-y-1.5">
                        {asyncTasks.byStatus.map((t: any) => {
                            const isError = t.status === 'error' || t.status === 'failed';
                            return (
                                <div key={t.status} className="flex items-center justify-between p-2 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className={cn("size-2 rounded-full",
                                            isError ? "bg-red-500" :
                                            t.status === 'success' ? "bg-emerald-500" :
                                            t.status === 'processing' ? "bg-blue-500 animate-pulse" :
                                            "bg-zinc-500"
                                        )} />
                                        <span className="text-xs text-zinc-300 capitalize">{t.status || 'inconnu'}</span>
                                    </div>
                                    <span className={cn("text-xs font-bold", isError ? "text-red-400" : "text-white")}>{t.count}</span>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            {/* ═══════════════════════════════════════════════ */}
            {/* ROW 4: Top Affected Users + Recent Error Log */}
            {/* ═══════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Affected Users */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="size-5 text-red-400" />
                        <h3 className="text-lg font-bold text-white">Utilisateurs affectés</h3>
                    </div>
                    <div className="space-y-2">
                        {errors.topAffectedUsers.length > 0 ? errors.topAffectedUsers.map((u: any, idx: number) => {
                            const initials = (u.fullName || u.email || "?").split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
                            return (
                                <div key={u.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.03]">
                                    <span className="text-xs text-zinc-600 w-4">#{idx + 1}</span>
                                    <div className="size-7 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-[9px] shrink-0">
                                        {initials}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-white truncate">{u.fullName || "Sans nom"}</p>
                                        <p className="text-[10px] text-zinc-500 truncate">{u.email}</p>
                                    </div>
                                    <span className="text-xs font-bold text-red-400">{u.errorCount}</span>
                                </div>
                            );
                        }) : (
                            <p className="text-sm text-zinc-500 text-center py-4">Aucun utilisateur affecté</p>
                        )}
                    </div>
                </motion.div>

                {/* Recent Error Log */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                    className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/[0.02] p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Bug className="size-5 text-red-400" />
                            <h3 className="text-lg font-bold text-white">Journal d'erreurs récent</h3>
                        </div>
                        <span className="text-xs text-zinc-500">{errors.recent.length} dernières erreurs</span>
                    </div>

                    <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2">
                        {errors.recent.length > 0 ? errors.recent.map((err: any) => {
                            const isExpanded = expandedError === err.id;
                            const errorMsg = parseErrorMessage(err.error);
                            return (
                                <div
                                    key={err.id}
                                    className={cn(
                                        "p-3 rounded-xl border transition-all cursor-pointer",
                                        isExpanded ? "border-red-500/20 bg-red-500/5" : "border-white/5 bg-white/[0.01] hover:bg-white/[0.03]"
                                    )}
                                    onClick={() => setExpandedError(isExpanded ? null : err.id)}
                                >
                                    <div className="flex items-start gap-3">
                                        <XCircle className="size-4 text-red-400 shrink-0 mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {err.provider && (
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-medium">
                                                        {err.provider}
                                                    </span>
                                                )}
                                                {err.model && (
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 font-medium truncate max-w-[150px]">
                                                        {err.model}
                                                    </span>
                                                )}
                                                <span className="text-[10px] text-zinc-600">{timeAgo(err.createdAt)}</span>
                                            </div>
                                            <p className="text-xs text-red-300 mt-1 truncate">{errorMsg}</p>
                                            {err.userName && (
                                                <p className="text-[10px] text-zinc-600 mt-1">
                                                    {err.userName} · {err.userEmail}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="mt-3 p-3 rounded-lg bg-black/30 border border-white/5">
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Détails erreur</p>
                                            <pre className="text-[11px] text-red-300 whitespace-pre-wrap break-all font-mono leading-relaxed max-h-[200px] overflow-y-auto">
                                                {JSON.stringify(err.error, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            );
                        }) : (
                            <div className="text-center py-12">
                                <CheckCircle className="size-10 text-emerald-400 mx-auto mb-3" />
                                <p className="text-sm text-zinc-400">Aucune erreur récente</p>
                                <p className="text-xs text-zinc-600 mt-1">Tout fonctionne correctement</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
