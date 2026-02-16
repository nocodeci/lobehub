"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import {
    Search, Filter, Download, Eye, Ban, CheckCircle, Crown,
    ChevronLeft, ChevronRight, Loader2, RefreshCw, Bot,
    MessageSquare, ArrowUpDown, ShieldCheck, ShieldOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatNumber } from "@/lib/utils";
import { toast } from "sonner";

interface ConnectUser {
    id: string;
    username: string;
    email: string;
    avatar: string;
    fullName: string;
    phone: string;
    isOnboarded: boolean;
    banned: boolean;
    banReason: string;
    role: string;
    plan: string;
    createdAt: string;
    lastActiveAt: string;
    updatedAt: string;
    agentsCount: number;
    messagesCount: number;
    sessionsCount: number;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

const planStyles: Record<string, { bg: string; text: string; label: string }> = {
    free: { bg: "bg-zinc-500/10", text: "text-zinc-400", label: "Gratuit" },
    starter: { bg: "bg-blue-500/10", text: "text-blue-400", label: "Starter" },
    pro: { bg: "bg-purple-500/10", text: "text-purple-400", label: "Pro" },
    business: { bg: "bg-amber-500/10", text: "text-amber-400", label: "Business" },
    enterprise: { bg: "bg-emerald-500/10", text: "text-emerald-400", label: "Enterprise" },
};

const PLANS = ["free", "starter", "pro", "business", "enterprise"];

export default function ConnectUsersPage() {
    const [users, setUsers] = useState<ConnectUser[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [planFilter, setPlanFilter] = useState("");
    const [selectedUser, setSelectedUser] = useState<ConnectUser | null>(null);
    const [showPlanModal, setShowPlanModal] = useState(false);

    const fetchUsers = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: "20" });
            if (searchQuery) params.set("search", searchQuery);
            if (planFilter) params.set("plan", planFilter);

            const res = await fetch(`/api/connect/users?${params}`);
            const json = await res.json();
            if (json.success) {
                setUsers(json.users);
                setPagination(json.pagination);
            }
        } catch (err: any) {
            toast.error("Erreur: " + err.message);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, planFilter]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleBanToggle = async (user: ConnectUser) => {
        const action = user.banned ? "unban" : "ban";
        const confirmMsg = user.banned
            ? `Débannir ${user.fullName} ?`
            : `Bannir ${user.fullName} ?`;

        if (!confirm(confirmMsg)) return;

        try {
            const res = await fetch("/api/connect/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, action, value: "Banned by admin" }),
            });
            const json = await res.json();
            if (json.success) {
                toast.success(user.banned ? "Utilisateur débanni" : "Utilisateur banni");
                fetchUsers(pagination.page);
            } else {
                toast.error(json.error);
            }
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleChangePlan = async (plan: string) => {
        if (!selectedUser) return;
        try {
            const res = await fetch("/api/connect/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: selectedUser.id, action: "changePlan", value: plan }),
            });
            const json = await res.json();
            if (json.success) {
                toast.success(`Plan changé en ${planStyles[plan]?.label || plan}`);
                setShowPlanModal(false);
                setSelectedUser(null);
                fetchUsers(pagination.page);
            } else {
                toast.error(json.error);
            }
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const getInitials = (user: ConnectUser) => {
        return (user.fullName || user.username || user.email || "?")
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const timeAgo = (dateStr: string) => {
        if (!dateStr) return "—";
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "En ligne";
        if (mins < 60) return `${mins}m`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h`;
        const days = Math.floor(hours / 24);
        if (days < 30) return `${days}j`;
        return `${Math.floor(days / 30)}mo`;
    };

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Utilisateurs Connect</h1>
                    <p className="text-zinc-500">Gérez les utilisateurs de la plateforme Connect</p>
                </motion.div>
                <div className="flex items-center gap-3">
                    <Button onClick={() => fetchUsers(pagination.page)} variant="outline" size="sm">
                        <RefreshCw className="size-4 mr-2" />
                        Actualiser
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="size-4 mr-2" />
                        Exporter
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                    <p className="text-2xl font-bold text-white">{formatNumber(pagination.total)}</p>
                    <p className="text-sm text-zinc-500">Total utilisateurs</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                    <p className="text-2xl font-bold text-white">{users.filter(u => !u.banned).length}</p>
                    <p className="text-sm text-zinc-500">Actifs (page)</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                    <p className="text-2xl font-bold text-white">{users.filter(u => u.plan !== "free").length}</p>
                    <p className="text-sm text-zinc-500">Payants (page)</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                    <p className="text-2xl font-bold text-white">{users.filter(u => u.banned).length}</p>
                    <p className="text-sm text-zinc-500">Bannis (page)</p>
                </motion.div>
            </div>

            {/* Filters */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && fetchUsers(1)}
                        className="w-full h-11 pl-11 pr-4 rounded-xl bg-white/5 border border-white/5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500/30"
                    />
                </div>
                <div className="flex gap-1 p-1 rounded-lg bg-white/5">
                    {[{ key: "", label: "Tous" }, ...PLANS.map(p => ({ key: p, label: planStyles[p]?.label || p }))].map((f) => (
                        <button
                            key={f.key}
                            onClick={() => { setPlanFilter(f.key); }}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                                planFilter === f.key ? "bg-orange-600 text-white" : "text-zinc-500 hover:text-white"
                            )}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden"
            >
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="size-6 animate-spin text-orange-500" />
                    </div>
                ) : (
                    <>
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                            <div className="col-span-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Utilisateur</div>
                            <div className="col-span-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">Plan</div>
                            <div className="col-span-1 text-xs font-medium text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                                <Bot className="size-3" /> Agents
                            </div>
                            <div className="col-span-1 text-xs font-medium text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                                <MessageSquare className="size-3" /> Msgs
                            </div>
                            <div className="col-span-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">Statut</div>
                            <div className="col-span-1 text-xs font-medium text-zinc-500 uppercase tracking-wider">Activité</div>
                            <div className="col-span-2 text-xs font-medium text-zinc-500 uppercase tracking-wider text-right">Actions</div>
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-white/5">
                            {users.map((user, idx) => {
                                const plan = planStyles[user.plan] || planStyles.free;
                                return (
                                    <motion.div
                                        key={user.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.03 * idx }}
                                        className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors group"
                                    >
                                        <div className="col-span-3 flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-gradient-to-br from-orange-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                                {getInitials(user)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-white truncate">{user.fullName}</p>
                                                <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="col-span-2 flex items-center">
                                            <button
                                                onClick={() => { setSelectedUser(user); setShowPlanModal(true); }}
                                                className={cn("px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer hover:opacity-80 transition", plan.bg, plan.text)}
                                            >
                                                {plan.label}
                                            </button>
                                        </div>
                                        <div className="col-span-1 flex items-center text-sm text-zinc-400">
                                            {user.agentsCount}
                                        </div>
                                        <div className="col-span-1 flex items-center text-sm text-zinc-400">
                                            {formatNumber(user.messagesCount)}
                                        </div>
                                        <div className="col-span-2 flex items-center gap-2">
                                            {user.banned ? (
                                                <div className="flex items-center gap-1.5">
                                                    <div className="size-2 rounded-full bg-red-500" />
                                                    <span className="text-sm text-red-400">Banni</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5">
                                                    <div className="size-2 rounded-full bg-emerald-500" />
                                                    <span className="text-sm text-emerald-400">Actif</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-span-1 flex items-center text-xs text-zinc-500">
                                            {timeAgo(user.lastActiveAt)}
                                        </div>
                                        <div className="col-span-2 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-8"
                                                title="Changer le plan"
                                                onClick={() => { setSelectedUser(user); setShowPlanModal(true); }}
                                            >
                                                <Crown className="size-4 text-amber-400" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={cn("size-8", user.banned ? "text-emerald-400" : "text-red-400")}
                                                title={user.banned ? "Débannir" : "Bannir"}
                                                onClick={() => handleBanToggle(user)}
                                            >
                                                {user.banned ? <ShieldCheck className="size-4" /> : <ShieldOff className="size-4" />}
                                            </Button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {users.length === 0 && !loading && (
                            <div className="py-16 text-center text-zinc-500">Aucun utilisateur trouvé</div>
                        )}

                        {/* Pagination */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
                            <p className="text-sm text-zinc-500">
                                {pagination.total > 0
                                    ? `${(pagination.page - 1) * pagination.limit + 1}-${Math.min(pagination.page * pagination.limit, pagination.total)} sur ${formatNumber(pagination.total)}`
                                    : "Aucun résultat"}
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="size-8"
                                    disabled={pagination.page <= 1}
                                    onClick={() => fetchUsers(pagination.page - 1)}
                                >
                                    <ChevronLeft className="size-4" />
                                </Button>
                                <span className="text-sm text-zinc-400 px-2">
                                    {pagination.page} / {pagination.totalPages || 1}
                                </span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="size-8"
                                    disabled={pagination.page >= pagination.totalPages}
                                    onClick={() => fetchUsers(pagination.page + 1)}
                                >
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </motion.div>

            {/* Plan Change Modal */}
            {showPlanModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowPlanModal(false)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold text-white mb-1">Changer le plan</h3>
                        <p className="text-sm text-zinc-500 mb-6">
                            {selectedUser.fullName} — actuellement <span className="text-orange-400">{planStyles[selectedUser.plan]?.label || selectedUser.plan}</span>
                        </p>
                        <div className="space-y-2">
                            {PLANS.map((p) => {
                                const style = planStyles[p];
                                const isCurrent = selectedUser.plan === p;
                                return (
                                    <button
                                        key={p}
                                        onClick={() => !isCurrent && handleChangePlan(p)}
                                        disabled={isCurrent}
                                        className={cn(
                                            "w-full flex items-center justify-between p-3 rounded-xl border transition-all",
                                            isCurrent
                                                ? "border-orange-500/30 bg-orange-500/10 cursor-default"
                                                : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 cursor-pointer"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn("px-2.5 py-1 rounded-lg text-xs font-medium", style.bg, style.text)}>
                                                {style.label}
                                            </div>
                                        </div>
                                        {isCurrent && <span className="text-xs text-orange-400">Actuel</span>}
                                    </button>
                                );
                            })}
                        </div>
                        <Button variant="outline" className="w-full mt-4" onClick={() => setShowPlanModal(false)}>
                            Annuler
                        </Button>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
