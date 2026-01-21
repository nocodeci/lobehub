"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    icon: LucideIcon;
    trend?: 'up' | 'down';
    color?: string;
}

export function StatCard({ title, value, change, icon: Icon, trend = 'up', color = 'bg-primary' }: StatCardProps) {
    const isPositive = trend === 'up';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="p-5 rounded-3xl bg-card border border-white/10 relative overflow-hidden group shadow-xl"
        >
            <div className={`absolute top-0 right-0 w-24 h-24 blur-[60px] -mr-12 -mt-12 opacity-[0.05] ${color}`} />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className={`h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors`}>
                        <Icon className="h-4.5 w-4.5 text-primary" />
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                        }`}>
                        {isPositive ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                        {change}
                    </div>
                </div>

                <div className="space-y-0.5">
                    <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-40">{title}</h3>
                    <p className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">{value}</p>
                </div>

                {/* Progress bar instead of sparkline for cleaner look */}
                <div className="mt-6 h-1 w-full bg-white/5 rounded-full relative overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: isPositive ? "70%" : "40%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`absolute inset-0 rounded-full ${isPositive ? 'bg-primary' : 'bg-red-500'}`}
                    />
                </div>
            </div>
        </motion.div>
    );
}
