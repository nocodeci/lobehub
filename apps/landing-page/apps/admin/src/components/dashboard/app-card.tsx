"use client";

import { motion } from "framer-motion";
import { cn, formatNumber } from "@/lib/utils";
import { LucideIcon, ExternalLink, MoreVertical, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppCardProps {
    name: string;
    description: string;
    icon: LucideIcon;
    status: "online" | "offline" | "maintenance";
    users: number;
    requests: string;
    color: string;
    url: string;
    delay?: number;
}

const statusStyles = {
    online: { bg: "bg-emerald-500", label: "En ligne", textColor: "text-emerald-400" },
    offline: { bg: "bg-red-500", label: "Hors ligne", textColor: "text-red-400" },
    maintenance: { bg: "bg-yellow-500", label: "Maintenance", textColor: "text-yellow-400" },
};

export function AppCard({ name, description, icon: Icon, status, users, requests, color, url, delay = 0 }: AppCardProps) {
    const statusStyle = statusStyles[status];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.4, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
            className="group relative rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] overflow-hidden transition-colors"
        >
            {/* Top Gradient */}
            <div
                className="absolute top-0 left-0 right-0 h-32 opacity-20 pointer-events-none"
                style={{
                    background: `linear-gradient(180deg, ${color}40 0%, transparent 100%)`
                }}
            />

            <div className="relative p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div
                            className="size-14 rounded-2xl flex items-center justify-center shadow-lg"
                            style={{ backgroundColor: `${color}20` }}
                        >
                            <Icon className="size-7" style={{ color }} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">{name}</h3>
                            <p className="text-sm text-zinc-500">{description}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                        <MoreVertical className="size-4" />
                    </Button>
                </div>

                {/* Status */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <div className={cn("size-2 rounded-full animate-pulse", statusStyle.bg)} />
                        <span className={cn("text-sm font-medium", statusStyle.textColor)}>
                            {statusStyle.label}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500">
                        <Activity className="size-3" />
                        <span className="text-xs">{requests} req/min</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-white/5">
                        <p className="text-xs text-zinc-500 mb-1">Utilisateurs actifs</p>
                        <p className="text-xl font-bold text-white">{formatNumber(users)}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5">
                        <p className="text-xs text-zinc-500 mb-1">Uptime</p>
                        <p className="text-xl font-bold text-white">99.9%</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" asChild>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="size-4 mr-2" />
                            Ouvrir
                        </a>
                    </Button>
                    <Button variant="secondary" className="flex-1">
                        Configurer
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
