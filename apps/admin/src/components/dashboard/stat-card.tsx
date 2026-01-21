"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    change?: number;
    changeLabel?: string;
    icon: LucideIcon;
    color: "purple" | "blue" | "emerald" | "orange" | "pink";
    delay?: number;
}

const colorStyles = {
    purple: {
        bg: "from-purple-600/20 to-purple-600/5",
        border: "border-purple-500/20",
        icon: "bg-purple-500/20 text-purple-400",
        gradient: "from-purple-600 to-purple-400",
    },
    blue: {
        bg: "from-blue-600/20 to-blue-600/5",
        border: "border-blue-500/20",
        icon: "bg-blue-500/20 text-blue-400",
        gradient: "from-blue-600 to-blue-400",
    },
    emerald: {
        bg: "from-emerald-600/20 to-emerald-600/5",
        border: "border-emerald-500/20",
        icon: "bg-emerald-500/20 text-emerald-400",
        gradient: "from-emerald-600 to-emerald-400",
    },
    orange: {
        bg: "from-orange-600/20 to-orange-600/5",
        border: "border-orange-500/20",
        icon: "bg-orange-500/20 text-orange-400",
        gradient: "from-orange-600 to-orange-400",
    },
    pink: {
        bg: "from-pink-600/20 to-pink-600/5",
        border: "border-pink-500/20",
        icon: "bg-pink-500/20 text-pink-400",
        gradient: "from-pink-600 to-pink-400",
    },
};

export function StatCard({ title, value, change, changeLabel, icon: Icon, color, delay = 0 }: StatCardProps) {
    const styles = colorStyles[color];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5, ease: "easeOut" }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={cn(
                "relative group rounded-2xl border bg-gradient-to-br overflow-hidden",
                styles.bg,
                styles.border
            )}
        >
            {/* Gradient Line at Top */}
            <div className={cn(
                "absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r",
                styles.gradient
            )} />

            {/* Content */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                        "size-12 rounded-xl flex items-center justify-center",
                        styles.icon
                    )}>
                        <Icon className="size-6" />
                    </div>

                    {change !== undefined && (
                        <div className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium",
                            change > 0 ? "bg-emerald-500/10 text-emerald-400" :
                                change < 0 ? "bg-red-500/10 text-red-400" :
                                    "bg-zinc-500/10 text-zinc-400"
                        )}>
                            {change > 0 ? <TrendingUp className="size-3" /> :
                                change < 0 ? <TrendingDown className="size-3" /> :
                                    <Minus className="size-3" />}
                            <span>{change > 0 ? "+" : ""}{change}%</span>
                        </div>
                    )}
                </div>

                <div className="space-y-1">
                    <p className="text-zinc-400 text-sm font-medium">{title}</p>
                    <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
                    {changeLabel && (
                        <p className="text-xs text-zinc-500">{changeLabel}</p>
                    )}
                </div>
            </div>

            {/* Hover Glow Effect */}
            <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
                "bg-gradient-to-br",
                styles.bg
            )} />
        </motion.div>
    );
}
