"use client";

import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { motion } from "framer-motion";

const data = [
    { name: "Lun", revenue: 4000, interactions: 2400 },
    { name: "Mar", revenue: 3000, interactions: 1398 },
    { name: "Mer", revenue: 2000, interactions: 9800 },
    { name: "Jeu", revenue: 2780, interactions: 3908 },
    { name: "Ven", revenue: 1890, interactions: 4800 },
    { name: "Sam", revenue: 2390, interactions: 3800 },
    { name: "Dim", revenue: 3490, interactions: 4300 },
];

export function MainChart() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-[3rem] bg-[#0A0A0A] border border-white/5 shadow-2xl relative overflow-hidden h-[450px]"
        >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

            <div className="flex items-center justify-between mb-10 relative z-10">
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50 mb-1">Performance des interactions</h3>
                    <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-tight">Activité hebdomadaire</h2>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                        <div className="h-2 w-2 rounded-full bg-[#25D366]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Revenue</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                        <div className="h-2 w-2 rounded-full bg-[#128C7E]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Interactions</span>
                    </div>
                </div>
            </div>

            <div className="h-[300px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#25D366" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#25D366" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorInter" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#128C7E" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#128C7E" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 900 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 900 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#000',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '16px',
                                padding: '12px'
                            }}
                            itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#25D366"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                        />
                        <Area
                            type="monotone"
                            dataKey="interactions"
                            stroke="#128C7E"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorInter)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
