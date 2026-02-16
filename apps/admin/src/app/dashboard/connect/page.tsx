"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
    Users, Bot, MessageSquare, FolderOpen, Crown, Loader2, RefreshCw,
    TrendingUp, TrendingDown, DollarSign, Key, HardDrive, Cpu,
    Eye, Activity, ShieldCheck, UserCheck, Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatNumber } from "@/lib/utils";
import Link from "next/link";

const PLAN_COLORS: Record<string, string> = {
    free: "#71717a",
    starter: "#3b82f6",
    pro: "#a855f7",
    business: "#f59e0b",
    enterprise: "#10b981",
};

const PLAN_LABELS: Record<string, string> = {
    free: "Gratuit",
    starter: "Starter",
    pro: "Pro",
    business: "Business",
    enterprise: "Enterprise",
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

function formatBytes(bytes: number) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export default function ConnectPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/connect/stats");
            const json = await res.json();
            if (json.success) {
                setData(json);
            } else {
                setError(json.error || "Erreur inconnue");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStats(); }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="size-8 animate-spin text-orange-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
                    <p className="text-red-400 mb-4">Erreur: {error}</p>
                    <Button onClick={fetchStats} variant="outline" size="sm">
                        <RefreshCw className="size-4 mr-2" /> Réessayer
                    </Button>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const { stats, charts, topUsers, recentUsers } = data;

    // Format chart data
    const usersChartData = charts.usersByDay.map((d: any) => ({
        name: new Date(d.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
        utilisateurs: d.count,
    }));
    const messagesChartData = charts.messagesByDay.map((d: any) => ({
        name: new Date(d.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
        messages: d.count,
    }));

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="size-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <MessageSquare className="size-5 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Connect</h1>
                    </div>
                    <p className="text-zinc-500">Dashboard complet — données en temps réel de la base de données</p>
                </motion.div>
                <Button onClick={fetchStats} variant="outline" size="sm">
                    <RefreshCw className="size-4 mr-2" /> Actualiser
                </Button>
            </div>

            {/* ═══════════════════════════════════════════════ */}
            {/* ROW 1: Revenue + Key Metrics */}
            {/* ═══════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* MRR */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                    <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="size-4 text-emerald-400" />
                        <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">MRR</span>
                    </div>
                    <p className="text-3xl font-black text-white">{formatNumber(stats.revenue.mrr)}€</p>
                    <p className="text-xs text-zinc-500 mt-1">Revenu mensuel récurrent</p>
                </motion.div>

                {/* ARR */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="p-5 rounded-2xl border border-emerald-500/10 bg-white/[0.02]">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="size-4 text-emerald-400" />
                        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">ARR</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{formatNumber(stats.revenue.arr)}€</p>
                    <p className="text-xs text-zinc-500 mt-1">Revenu annuel estimé</p>
                </motion.div>

                {/* Paying Users */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-2 mb-3">
                        <Crown className="size-4 text-amber-400" />
                        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Payants</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.revenue.payingUsers}</p>
                    <p className="text-xs text-zinc-500 mt-1">{stats.users.total > 0 ? ((stats.revenue.payingUsers / stats.users.total) * 100).toFixed(1) : 0}% de conversion</p>
                </motion.div>

                {/* BYOK Users */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-2 mb-3">
                        <Key className="size-4 text-purple-400" />
                        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">BYOK</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.byokUsers}</p>
                    <p className="text-xs text-zinc-500 mt-1">Utilisent leurs propres clés</p>
                </motion.div>

                {/* Active Users */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-2 mb-3">
                        <Activity className="size-4 text-blue-400" />
                        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Actifs 7j</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.users.active7d}</p>
                    <p className="text-xs text-zinc-500 mt-1">{stats.users.active30d} actifs 30j</p>
                </motion.div>
            </div>

            {/* ═══════════════════════════════════════════════ */}
            {/* ROW 2: Platform Stats */}
            {/* ═══════════════════════════════════════════════ */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                {[
                    { label: "Utilisateurs", value: stats.users.total, sub: `+${stats.users.thisMonth}`, icon: Users, color: "text-orange-400" },
                    { label: "Agents", value: stats.agents.total, sub: `+${stats.agents.thisMonth}`, icon: Bot, color: "text-purple-400" },
                    { label: "Messages", value: stats.messages.total, sub: `+${formatNumber(stats.messages.thisMonth)}`, icon: MessageSquare, color: "text-blue-400" },
                    { label: "Sessions", value: stats.sessions.total, sub: `${stats.topics.total} topics`, icon: FolderOpen, color: "text-emerald-400" },
                    { label: "Fichiers", value: stats.files.total, sub: formatBytes(stats.files.totalSize), icon: HardDrive, color: "text-cyan-400" },
                    { label: "Clés API", value: stats.apiKeys.total, sub: `${stats.apiKeys.active} actives`, icon: Key, color: "text-amber-400" },
                    { label: "Providers", value: stats.totalProviderConfigs, sub: `${stats.aiProviders.length} uniques`, icon: Cpu, color: "text-pink-400" },
                    { label: "Générations", value: stats.generations.total, sub: "images IA", icon: Image, color: "text-indigo-400" },
                ].map((item, idx) => (
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 * idx }}
                        className="p-4 rounded-xl border border-white/5 bg-white/[0.02] text-center"
                    >
                        <item.icon className={cn("size-4 mx-auto mb-2", item.color)} />
                        <p className="text-lg font-bold text-white">{formatNumber(item.value)}</p>
                        <p className="text-[10px] text-zinc-500">{item.label}</p>
                        <p className="text-[10px] text-zinc-600 mt-0.5">{item.sub}</p>
                    </motion.div>
                ))}
            </div>

            {/* ═══════════════════════════════════════════════ */}
            {/* ROW 3: Revenue Breakdown + Plan Distribution */}
            {/* ═══════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue by Plan */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <DollarSign className="size-5 text-emerald-400" />
                        <h3 className="text-lg font-bold text-white">Revenus par plan</h3>
                    </div>
                    <div className="space-y-3">
                        {stats.revenue.revenueByPlan.filter((p: any) => p.price > 0).map((p: any) => (
                            <div key={p.plan} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <div className="size-3 rounded-full" style={{ backgroundColor: PLAN_COLORS[p.plan] || "#71717a" }} />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-white">{PLAN_LABELS[p.plan] || p.plan}</span>
                                        <span className="text-sm font-bold text-emerald-400">{formatNumber(p.revenue)}€/mo</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-xs text-zinc-500">{p.count} utilisateur{p.count > 1 ? "s" : ""} × {p.price}€</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {stats.revenue.revenueByPlan.filter((p: any) => p.price > 0).length === 0 && (
                            <p className="text-sm text-zinc-500 text-center py-4">Aucun utilisateur payant</p>
                        )}
                        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 mt-2">
                            <span className="text-sm font-bold text-white">Total MRR</span>
                            <span className="text-lg font-black text-emerald-400">{formatNumber(stats.revenue.mrr)}€</span>
                        </div>
                    </div>
                </motion.div>

                {/* Plan Distribution Pie */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Crown className="size-5 text-amber-400" />
                        <h3 className="text-lg font-bold text-white">Distribution des plans</h3>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="w-44 h-44">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={stats.planDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="count" nameKey="plan">
                                        {stats.planDistribution.map((entry: any, index: number) => (
                                            <Cell key={index} fill={PLAN_COLORS[entry.plan] || "#71717a"} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex-1 space-y-2.5">
                            {stats.planDistribution.map((p: any) => (
                                <div key={p.plan} className="flex items-center gap-2.5">
                                    <div className="size-3 rounded-full" style={{ backgroundColor: PLAN_COLORS[p.plan] || "#71717a" }} />
                                    <span className="text-sm text-zinc-400 flex-1">{PLAN_LABELS[p.plan] || p.plan}</span>
                                    <span className="text-sm font-bold text-white">{p.count}</span>
                                    <span className="text-xs text-zinc-600 w-10 text-right">
                                        {stats.users.total > 0 ? ((p.count / stats.users.total) * 100).toFixed(0) : 0}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ═══════════════════════════════════════════════ */}
            {/* ROW 4: Charts - Users & Messages */}
            {/* ═══════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                    <h3 className="text-lg font-bold text-white mb-1">Inscriptions</h3>
                    <p className="text-sm text-zinc-500 mb-6">Nouveaux utilisateurs / jour (30j)</p>
                    <div className="h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={usersChartData}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="utilisateurs" name="Utilisateurs" stroke="#f97316" strokeWidth={2} fill="url(#colorUsers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                    <h3 className="text-lg font-bold text-white mb-1">Messages IA</h3>
                    <p className="text-sm text-zinc-500 mb-6">Messages envoyés / jour (30j)</p>
                    <div className="h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={messagesChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="messages" name="Messages" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* ═══════════════════════════════════════════════ */}
            {/* ROW 5: AI Providers + Models Usage + Messages by Provider */}
            {/* ═══════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* AI Providers configured by users */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                    <div className="flex items-center gap-2 mb-1">
                        <Cpu className="size-5 text-pink-400" />
                        <h3 className="text-lg font-bold text-white">Providers IA configurés</h3>
                    </div>
                    <p className="text-xs text-zinc-500 mb-4">Providers ajoutés par les utilisateurs (BYOK)</p>
                    <div className="space-y-2.5">
                        {stats.aiProviders.slice(0, 8).map((p: any) => {
                            const maxUsers = stats.aiProviders[0]?.userCount || 1;
                            return (
                                <div key={p.id}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-zinc-300 font-medium truncate max-w-[140px]">{p.name || p.id}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-zinc-500">{p.withKeys} clés</span>
                                            <span className="text-xs font-medium text-white">{p.userCount} users</span>
                                        </div>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full bg-gradient-to-r from-pink-600 to-purple-600" style={{ width: `${(p.userCount / maxUsers) * 100}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Models used in messages */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                    <div className="flex items-center gap-2 mb-1">
                        <Bot className="size-5 text-purple-400" />
                        <h3 className="text-lg font-bold text-white">Top modèles utilisés</h3>
                    </div>
                    <p className="text-xs text-zinc-500 mb-4">Par nombre de réponses IA générées</p>
                    <div className="space-y-2.5">
                        {stats.messages.byModel.slice(0, 8).map((m: any, idx: number) => {
                            const maxCount = stats.messages.byModel[0]?.count || 1;
                            return (
                                <div key={`${m.model}-${idx}`}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-zinc-300 truncate max-w-[160px]">{m.model}</span>
                                        <span className="text-xs font-medium text-white">{formatNumber(m.count)}</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600" style={{ width: `${(m.count / maxCount) * 100}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Messages by provider */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                    <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="size-5 text-blue-400" />
                        <h3 className="text-lg font-bold text-white">Messages par provider</h3>
                    </div>
                    <p className="text-xs text-zinc-500 mb-4">Coût API proportionnel à l'usage</p>
                    <div className="space-y-2.5">
                        {stats.messages.byProvider.slice(0, 8).map((p: any) => {
                            const maxCount = stats.messages.byProvider[0]?.count || 1;
                            const totalAssistant = stats.messages.byProvider.reduce((s: number, x: any) => s + x.count, 0);
                            const pct = totalAssistant > 0 ? ((p.count / totalAssistant) * 100).toFixed(1) : "0";
                            return (
                                <div key={p.provider}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-zinc-300 font-medium">{p.provider}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-zinc-500">{pct}%</span>
                                            <span className="text-xs font-medium text-white">{formatNumber(p.count)}</span>
                                        </div>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-600" style={{ width: `${(p.count / maxCount) * 100}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            {/* ═══════════════════════════════════════════════ */}
            {/* ROW 6: Top Users + Recent Users + File Storage */}
            {/* ═══════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Users */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <UserCheck className="size-5 text-orange-400" />
                            <h3 className="text-lg font-bold text-white">Top utilisateurs</h3>
                        </div>
                        <Link href="/dashboard/connect/users" className="text-xs text-orange-400 hover:underline">Voir tous</Link>
                    </div>
                    <div className="space-y-2.5">
                        {topUsers.slice(0, 7).map((user: any, idx: number) => {
                            const initials = (user.fullName || user.username || user.email || "?").split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
                            const plan = PLAN_LABELS[user.plan] || user.plan;
                            return (
                                <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.03] transition">
                                    <span className="text-xs text-zinc-600 w-4">#{idx + 1}</span>
                                    <div className="size-8 rounded-full bg-gradient-to-br from-orange-500 to-purple-500 flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                                        {initials}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white truncate">{user.fullName || user.username || "Sans nom"}</p>
                                        <p className="text-[10px] text-zinc-500">{formatNumber(user.messageCount)} msgs · {user.agentCount} agents</p>
                                    </div>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ color: PLAN_COLORS[user.plan], backgroundColor: `${PLAN_COLORS[user.plan]}15` }}>
                                        {plan}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Recent Users */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Users className="size-5 text-orange-400" />
                        <h3 className="text-lg font-bold text-white">Derniers inscrits</h3>
                    </div>
                    <div className="space-y-2.5">
                        {recentUsers.slice(0, 7).map((user: any) => {
                            const initials = (user.full_name || user.username || user.email || "?").split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
                            return (
                                <div key={user.id} className="flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-gradient-to-br from-orange-500 to-purple-500 flex items-center justify-center text-white font-bold text-[10px]">
                                        {initials}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white truncate">{user.full_name || user.username || "Sans nom"}</p>
                                        <p className="text-[11px] text-zinc-500 truncate">{user.email}</p>
                                    </div>
                                    <span className="text-[10px] text-zinc-600">
                                        {new Date(user.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* File Storage + Messages by Role */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <HardDrive className="size-5 text-cyan-400" />
                        <h3 className="text-lg font-bold text-white">Stockage & Rôles</h3>
                    </div>

                    {/* Storage */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-zinc-400">Stockage total</span>
                            <span className="text-sm font-bold text-white">{formatBytes(stats.files.totalSize)}</span>
                        </div>
                        <div className="space-y-1.5">
                            {stats.filesByType.slice(0, 5).map((f: any) => (
                                <div key={f.type} className="flex items-center justify-between text-xs">
                                    <span className="text-zinc-500 truncate max-w-[120px]">{f.type}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-zinc-400">{f.count} fichiers</span>
                                        <span className="text-white font-medium">{formatBytes(f.size)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Messages by Role */}
                    <div>
                        <p className="text-sm text-zinc-400 mb-3">Messages par rôle</p>
                        <div className="space-y-1.5">
                            {stats.messages.byRole.map((r: any) => (
                                <div key={r.role} className="flex items-center justify-between text-xs">
                                    <span className="text-zinc-400 capitalize">{r.role}</span>
                                    <span className="text-white font-medium">{formatNumber(r.count)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
