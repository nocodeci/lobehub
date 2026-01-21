"use client";

import { motion } from "framer-motion";
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
    TrendingUp, TrendingDown, Users, Globe, Clock, MousePointer,
    ArrowUpRight, Filter, Download, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatNumber } from "@/lib/utils";
import { useState } from "react";

const trafficData = [
    { name: "00h", visits: 400, pageviews: 800, bounceRate: 35 },
    { name: "04h", visits: 200, pageviews: 400, bounceRate: 42 },
    { name: "08h", visits: 800, pageviews: 1600, bounceRate: 28 },
    { name: "12h", visits: 1200, pageviews: 2400, bounceRate: 22 },
    { name: "16h", visits: 1500, pageviews: 3000, bounceRate: 18 },
    { name: "20h", visits: 1100, pageviews: 2200, bounceRate: 25 },
];

const sourceData = [
    { name: "Direct", value: 4500, color: "#a855f7" },
    { name: "Organic", value: 3200, color: "#3b82f6" },
    { name: "Referral", value: 2100, color: "#10b981" },
    { name: "Social", value: 1800, color: "#f59e0b" },
    { name: "Email", value: 900, color: "#ec4899" },
];

const countryData = [
    { country: "Côte d'Ivoire", visits: 4521, percentage: 35 },
    { country: "Sénégal", visits: 3247, percentage: 25 },
    { country: "Cameroun", visits: 2156, percentage: 17 },
    { country: "Mali", visits: 1543, percentage: 12 },
    { country: "Burkina Faso", visits: 987, percentage: 8 },
    { country: "Autres", visits: 456, percentage: 3 },
];

const deviceData = [
    { name: "Mobile", value: 65, color: "#a855f7" },
    { name: "Desktop", value: 28, color: "#3b82f6" },
    { name: "Tablet", value: 7, color: "#10b981" },
];

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

export default function AnalyticsPage() {
    const [period, setPeriod] = useState<"24h" | "7d" | "30d" | "90d">("7d");

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-bold text-white tracking-tight">Analytiques</h1>
                    <p className="text-zinc-500">Performance détaillée de vos applications</p>
                </motion.div>

                <div className="flex items-center gap-3">
                    <div className="flex gap-1 p-1 rounded-lg bg-white/5">
                        {(["24h", "7d", "30d", "90d"] as const).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={cn(
                                    "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                                    period === p ? "bg-purple-600 text-white" : "text-zinc-500 hover:text-white"
                                )}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                    <Button variant="outline" size="sm">
                        <Calendar className="size-4 mr-2" />
                        Personnalisé
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="size-4 mr-2" />
                        Exporter
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total visiteurs", value: "24,892", change: 12.5, icon: Users },
                    { label: "Pages vues", value: "142,847", change: 8.2, icon: MousePointer },
                    { label: "Temps moyen", value: "4m 32s", change: -2.1, icon: Clock },
                    { label: "Taux de rebond", value: "32.4%", change: -5.8, icon: TrendingDown },
                ].map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="size-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                                <stat.icon className="size-5" />
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-xs font-medium",
                                stat.change > 0 ? "text-emerald-400" : "text-red-400"
                            )}>
                                {stat.change > 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                                {Math.abs(stat.change)}%
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-sm text-zinc-500">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Traffic Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-white">Trafic en temps réel</h3>
                        <p className="text-sm text-zinc-500">Visiteurs et pages vues par heure</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-purple-500" />
                            <span className="text-xs text-zinc-500">Visiteurs</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-blue-500" />
                            <span className="text-xs text-zinc-500">Pages vues</span>
                        </div>
                    </div>
                </div>
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trafficData}>
                            <defs>
                                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorPageviews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="visits" name="Visiteurs" stroke="#a855f7" strokeWidth={2} fill="url(#colorVisits)" />
                            <Area type="monotone" dataKey="pageviews" name="Pages vues" stroke="#3b82f6" strokeWidth={2} fill="url(#colorPageviews)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Sources & Geography */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Traffic Sources */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
                >
                    <h3 className="text-lg font-bold text-white mb-6">Sources de trafic</h3>
                    <div className="flex items-center gap-8">
                        <div className="w-48 h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={sourceData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {sourceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex-1 space-y-3">
                            {sourceData.map((source) => (
                                <div key={source.name} className="flex items-center gap-3">
                                    <div className="size-3 rounded-full" style={{ backgroundColor: source.color }} />
                                    <span className="text-sm text-zinc-400 flex-1">{source.name}</span>
                                    <span className="text-sm font-medium text-white">{formatNumber(source.value)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Devices */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
                >
                    <h3 className="text-lg font-bold text-white mb-6">Appareils</h3>
                    <div className="space-y-4">
                        {deviceData.map((device) => (
                            <div key={device.name}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-zinc-400">{device.name}</span>
                                    <span className="text-sm font-medium text-white">{device.value}%</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${device.value}%` }}
                                        transition={{ delay: 0.5, duration: 0.8 }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: device.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Top Countries */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
            >
                <h3 className="text-lg font-bold text-white mb-6">Top pays</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {countryData.map((country, idx) => (
                        <div
                            key={country.country}
                            className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium text-white">{country.country}</span>
                                <span className="text-xs text-purple-400">{country.percentage}%</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                                        style={{ width: `${country.percentage}%` }}
                                    />
                                </div>
                                <span className="text-xs text-zinc-500">{formatNumber(country.visits)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
