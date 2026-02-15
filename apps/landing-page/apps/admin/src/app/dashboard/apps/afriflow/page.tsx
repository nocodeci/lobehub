"use client";

import { motion } from "framer-motion";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell
} from "recharts";
import {
    Globe, Users, CreditCard, TrendingUp, Settings, ExternalLink,
    Activity, CheckCircle, Clock, AlertTriangle, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatNumber } from "@/lib/utils";

const transactionData = [
    { name: "Lun", success: 450, failed: 12, pending: 8 },
    { name: "Mar", success: 320, failed: 8, pending: 5 },
    { name: "Mer", success: 580, failed: 15, pending: 12 },
    { name: "Jeu", success: 420, failed: 10, pending: 6 },
    { name: "Ven", success: 650, failed: 18, pending: 10 },
    { name: "Sam", success: 280, failed: 6, pending: 4 },
    { name: "Dim", success: 190, failed: 4, pending: 3 },
];

const paymentMethods = [
    { name: "Mobile Money", value: 65, color: "#10b981" },
    { name: "Carte bancaire", value: 25, color: "#3b82f6" },
    { name: "Virement", value: 10, color: "#a855f7" },
];

const recentTransactions = [
    { id: "TRX-001", user: "Mamadou D.", amount: 45000, status: "success", method: "MTN", time: "Il y a 2 min" },
    { id: "TRX-002", user: "Aissatou B.", amount: 120000, status: "success", method: "Orange", time: "Il y a 5 min" },
    { id: "TRX-003", user: "Oumar S.", amount: 35000, status: "pending", method: "Wave", time: "Il y a 8 min" },
    { id: "TRX-004", user: "Fatou N.", amount: 80000, status: "failed", method: "Visa", time: "Il y a 12 min" },
];

const statusConfig = {
    success: { color: "text-emerald-400", bg: "bg-emerald-500/10", icon: CheckCircle },
    pending: { color: "text-yellow-400", bg: "bg-yellow-500/10", icon: Clock },
    failed: { color: "text-red-400", bg: "bg-red-500/10", icon: AlertTriangle },
};

export default function AfriFlowPage() {
    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4"
                >
                    <div className="size-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                        <Globe className="size-8 text-emerald-400" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold text-white tracking-tight">AfriFlow</h1>
                            <span className="px-2 py-0.5 rounded-md bg-white/5 text-xs text-zinc-400 font-mono">v2.4.1</span>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/10">
                                <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-medium text-emerald-400">En ligne</span>
                            </div>
                        </div>
                        <p className="text-zinc-500">Plateforme de paiement unifiée pour l'Afrique</p>
                    </div>
                </motion.div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">
                        <Settings className="size-4 mr-2" />
                        Configuration
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="size-4 mr-2" />
                            Ouvrir
                        </a>
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Transactions aujourd'hui", value: "1,234", change: 12.5, icon: Activity, color: "emerald" },
                    { label: "Volume traité", value: "12.4M F", change: 23.1, icon: CreditCard, color: "blue" },
                    { label: "Utilisateurs actifs", value: "4,521", change: 8.2, icon: Users, color: "purple" },
                    { label: "Taux de réussite", value: "96.8%", change: 1.2, icon: TrendingUp, color: "orange" },
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
                                <stat.icon className="size-5" />
                            </div>
                            <span className="text-xs font-medium text-emerald-400">+{stat.change}%</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-sm text-zinc-500">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Transaction Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/[0.02] p-6"
                >
                    <h3 className="text-lg font-bold text-white mb-6">Transactions cette semaine</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={transactionData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                                <Bar dataKey="success" name="Réussies" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="failed" name="Échouées" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="pending" name="En attente" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Payment Methods */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
                >
                    <h3 className="text-lg font-bold text-white mb-6">Méthodes de paiement</h3>
                    <div className="h-48 mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={paymentMethods}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {paymentMethods.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-2">
                        {paymentMethods.map((method) => (
                            <div key={method.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="size-3 rounded-full" style={{ backgroundColor: method.color }} />
                                    <span className="text-sm text-zinc-400">{method.name}</span>
                                </div>
                                <span className="text-sm font-medium text-white">{method.value}%</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Recent Transactions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden"
            >
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Dernières transactions</h3>
                    <Button variant="outline" size="sm">Voir tout</Button>
                </div>
                <div className="divide-y divide-white/5">
                    {recentTransactions.map((tx) => {
                        const status = statusConfig[tx.status as keyof typeof statusConfig];
                        const StatusIcon = status.icon;

                        return (
                            <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02]">
                                <div className="flex items-center gap-4">
                                    <div className={cn("size-10 rounded-xl flex items-center justify-center", status.bg)}>
                                        <StatusIcon className={cn("size-5", status.color)} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{tx.user}</p>
                                        <p className="text-xs text-zinc-500">{tx.id} • {tx.method}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-white">{formatNumber(tx.amount)} F</p>
                                    <p className="text-xs text-zinc-500">{tx.time}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
}
