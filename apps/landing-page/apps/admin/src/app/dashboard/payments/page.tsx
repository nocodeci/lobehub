"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from "recharts";
import {
    Search, Filter, Download, CreditCard, ArrowUpRight, ArrowDownRight,
    CheckCircle, Clock, XCircle, AlertCircle, Eye, MoreVertical, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatNumber } from "@/lib/utils";

const revenueData = [
    { name: "Jan", revenue: 2400000, transactions: 120 },
    { name: "Fév", revenue: 1398000, transactions: 85 },
    { name: "Mar", revenue: 9800000, transactions: 420 },
    { name: "Avr", revenue: 3908000, transactions: 180 },
    { name: "Mai", revenue: 4800000, transactions: 210 },
    { name: "Jun", revenue: 3800000, transactions: 165 },
    { name: "Jul", revenue: 4300000, transactions: 195 },
];

interface Transaction {
    id: string;
    reference: string;
    user: string;
    email: string;
    amount: number;
    status: "completed" | "pending" | "failed" | "refunded";
    method: "card" | "mobile" | "bank";
    app: string;
    date: string;
}

const transactions: Transaction[] = [
    { id: "1", reference: "PAY-2024-001", user: "Mamadou Diallo", email: "mamadou@example.com", amount: 30000, status: "completed", method: "mobile", app: "Gnata", date: "19 Jan 2024, 14:32" },
    { id: "2", reference: "PAY-2024-002", user: "Aissatou Bah", email: "aissatou@example.com", amount: 75000, status: "completed", method: "card", app: "AfriFlow", date: "19 Jan 2024, 13:45" },
    { id: "3", reference: "PAY-2024-003", user: "Oumar Sy", email: "oumar@example.com", amount: 15000, status: "pending", method: "mobile", app: "Gnata", date: "19 Jan 2024, 12:15" },
    { id: "4", reference: "PAY-2024-004", user: "Fatou Ndiaye", email: "fatou@example.com", amount: 30000, status: "failed", method: "card", app: "Gnata", date: "19 Jan 2024, 11:30" },
    { id: "5", reference: "PAY-2024-005", user: "Ibrahim Koné", email: "ibrahim@example.com", amount: 50000, status: "refunded", method: "bank", app: "AfriFlow", date: "19 Jan 2024, 10:00" },
    { id: "6", reference: "PAY-2024-006", user: "Aminata Traoré", email: "aminata@example.com", amount: 120000, status: "completed", method: "card", app: "AfriFlow", date: "18 Jan 2024, 18:22" },
];

const statusConfig = {
    completed: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", label: "Complété" },
    pending: { icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10", label: "En attente" },
    failed: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10", label: "Échoué" },
    refunded: { icon: RefreshCw, color: "text-orange-400", bg: "bg-orange-500/10", label: "Remboursé" },
};

const methodConfig = {
    card: { label: "Carte", icon: "💳" },
    mobile: { label: "Mobile Money", icon: "📱" },
    bank: { label: "Virement", icon: "🏦" },
};

export default function PaymentsPage() {
    const [statusFilter, setStatusFilter] = useState<string>("all");

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Paiements</h1>
                    <p className="text-zinc-500">Suivez et gérez toutes les transactions</p>
                </motion.div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">
                        <Download className="size-4 mr-2" />
                        Exporter
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Revenus ce mois", value: "8.4M F", change: 23.1, icon: ArrowUpRight, color: "emerald" },
                    { label: "Transactions", value: "1,234", change: 12.5, icon: ArrowUpRight, color: "blue" },
                    { label: "Taux de réussite", value: "94.8%", change: 2.1, icon: ArrowUpRight, color: "purple" },
                    { label: "Remboursements", value: "45", change: -8.3, icon: ArrowDownRight, color: "orange" },
                ].map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={cn(
                                "size-10 rounded-xl flex items-center justify-center",
                                stat.color === "emerald" ? "bg-emerald-500/10 text-emerald-400" :
                                    stat.color === "blue" ? "bg-blue-500/10 text-blue-400" :
                                        stat.color === "purple" ? "bg-purple-500/10 text-purple-400" :
                                            "bg-orange-500/10 text-orange-400"
                            )}>
                                <CreditCard className="size-5" />
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-xs font-medium",
                                stat.change > 0 ? "text-emerald-400" : "text-red-400"
                            )}>
                                <stat.icon className="size-3" />
                                {Math.abs(stat.change)}%
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-sm text-zinc-500">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Revenue Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-white">Évolution des revenus</h3>
                        <p className="text-sm text-zinc-500">Revenus mensuels et transactions</p>
                    </div>
                </div>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                labelStyle={{ color: '#a1a1aa' }}
                            />
                            <Area type="monotone" dataKey="revenue" name="Revenus" stroke="#10b981" strokeWidth={2} fill="url(#colorRev)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4"
            >
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Rechercher par référence, utilisateur..."
                        className="w-full h-11 pl-11 pr-4 rounded-xl bg-white/5 border border-white/5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500/30"
                    />
                </div>
                <div className="flex gap-1 p-1 rounded-lg bg-white/5">
                    {["all", "completed", "pending", "failed", "refunded"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize",
                                statusFilter === status ? "bg-purple-600 text-white" : "text-zinc-500 hover:text-white"
                            )}
                        >
                            {status === "all" ? "Tous" : statusConfig[status as keyof typeof statusConfig]?.label}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Transactions Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Référence</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Utilisateur</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Montant</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Méthode</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">App</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {transactions.map((tx, idx) => {
                                const status = statusConfig[tx.status];
                                const StatusIcon = status.icon;
                                const method = methodConfig[tx.method];

                                return (
                                    <motion.tr
                                        key={tx.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.05 * idx }}
                                        className="hover:bg-white/[0.02] transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-mono text-purple-400">{tx.reference}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium text-white">{tx.user}</p>
                                                <p className="text-xs text-zinc-500">{tx.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-white">{formatNumber(tx.amount)} F</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span>{method.icon}</span>
                                                <span className="text-sm text-zinc-400">{method.label}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-zinc-400">{tx.app}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg", status.bg)}>
                                                <StatusIcon className={cn("size-3", status.color)} />
                                                <span className={cn("text-xs font-medium", status.color)}>{status.label}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-zinc-500">{tx.date}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="size-8">
                                                    <Eye className="size-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="size-8">
                                                    <MoreVertical className="size-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
