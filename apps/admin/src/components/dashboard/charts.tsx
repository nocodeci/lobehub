"use client";

import { motion } from "framer-motion";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";
import { useState } from "react";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

const revenueData = [
    { name: "Jan", value: 4000000 },
    { name: "Fév", value: 3000000 },
    { name: "Mar", value: 5000000 },
    { name: "Avr", value: 4500000 },
    { name: "Mai", value: 6000000 },
    { name: "Jun", value: 5500000 },
    { name: "Jul", value: 7000000 },
    { name: "Aoû", value: 6500000 },
    { name: "Sep", value: 8000000 },
    { name: "Oct", value: 7500000 },
    { name: "Nov", value: 9000000 },
    { name: "Déc", value: 12000000 },
];

const usersData = [
    { name: "Lun", gnata: 400, afriflow: 240, portal: 180 },
    { name: "Mar", gnata: 300, afriflow: 139, portal: 221 },
    { name: "Mer", gnata: 520, afriflow: 380, portal: 290 },
    { name: "Jeu", gnata: 278, afriflow: 390, portal: 200 },
    { name: "Ven", gnata: 489, afriflow: 480, portal: 181 },
    { name: "Sam", gnata: 239, afriflow: 380, portal: 250 },
    { name: "Dim", gnata: 349, afriflow: 430, portal: 210 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-3 shadow-xl">
                <p className="text-xs text-zinc-400 mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
                        {entry.name}: {typeof entry.value === 'number' && entry.value > 10000
                            ? `${(entry.value / 1000000).toFixed(1)}M FCFA`
                            : formatNumber(entry.value)}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export function RevenueChart() {
    const [period, setPeriod] = useState<"7d" | "30d" | "1y">("1y");

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white">Revenus</h3>
                    <p className="text-sm text-zinc-500">Performance globale des paiements</p>
                </div>
                <div className="flex gap-1 p-1 rounded-lg bg-white/5">
                    {(["7d", "30d", "1y"] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                                period === p
                                    ? "bg-purple-600 text-white"
                                    : "text-zinc-500 hover:text-white"
                            )}
                        >
                            {p === "7d" ? "7 jours" : p === "30d" ? "30 jours" : "1 an"}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                        <XAxis
                            dataKey="name"
                            stroke="#71717a"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#71717a"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="value"
                            name="Revenus"
                            stroke="#a855f7"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}

export function UsersChart() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white">Activité utilisateurs</h3>
                    <p className="text-sm text-zinc-500">Par application cette semaine</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-purple-500" />
                        <span className="text-xs text-zinc-500">Gnata</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-emerald-500" />
                        <span className="text-xs text-zinc-500">AfriFlow</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-blue-500" />
                        <span className="text-xs text-zinc-500">Portal</span>
                    </div>
                </div>
            </div>

            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={usersData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                        <XAxis
                            dataKey="name"
                            stroke="#71717a"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#71717a"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="gnata" name="Gnata" fill="#a855f7" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="afriflow" name="AfriFlow" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="portal" name="Portal" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
