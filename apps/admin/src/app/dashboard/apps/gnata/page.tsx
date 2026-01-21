"use client";

import { motion } from "framer-motion";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
    Zap, Users, Globe, TrendingUp, Settings, ExternalLink,
    Clock, CheckCircle, Loader2, AlertTriangle, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sitesData = [
    { name: "Lun", created: 12, completed: 10 },
    { name: "Mar", created: 8, completed: 7 },
    { name: "Mer", created: 15, completed: 14 },
    { name: "Jeu", created: 10, completed: 9 },
    { name: "Ven", created: 18, completed: 16 },
    { name: "Sam", created: 6, completed: 5 },
    { name: "Dim", created: 4, completed: 4 },
];

interface Site {
    id: string;
    name: string;
    client: string;
    status: "building" | "completed" | "review";
    progress: number;
    coder: string;
    startedAt: string;
}

const activeSites: Site[] = [
    { id: "1", name: "E-commerce Mode", client: "Mamadou D.", status: "building", progress: 65, coder: "Coder #12", startedAt: "Il y a 45 min" },
    { id: "2", name: "Portfolio Artist", client: "Aissatou B.", status: "building", progress: 23, coder: "Coder #7", startedAt: "Il y a 1h 30" },
    { id: "3", name: "Restaurant App", client: "Oumar S.", status: "review", progress: 100, coder: "Coder #3", startedAt: "Il y a 2h" },
    { id: "4", name: "Blog Personnel", client: "Fatou N.", status: "completed", progress: 100, coder: "Coder #15", startedAt: "Terminé" },
];

const statusConfig = {
    building: { color: "text-purple-400", bg: "bg-purple-500/10", icon: Loader2, label: "En construction" },
    review: { color: "text-yellow-400", bg: "bg-yellow-500/10", icon: Eye, label: "En révision" },
    completed: { color: "text-emerald-400", bg: "bg-emerald-500/10", icon: CheckCircle, label: "Terminé" },
};

export default function GnataPage() {
    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4"
                >
                    <div className="size-16 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                        <Zap className="size-8 text-purple-400" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold text-white tracking-tight">Gnata</h1>
                            <span className="px-2 py-0.5 rounded-md bg-white/5 text-xs text-zinc-400 font-mono">v1.2.0</span>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/10">
                                <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-medium text-emerald-400">En ligne</span>
                            </div>
                        </div>
                        <p className="text-zinc-500">Création de sites web par nos experts Vibe Coders</p>
                    </div>
                </motion.div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">
                        <Settings className="size-4 mr-2" />
                        Configuration
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <a href="http://localhost:3002" target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="size-4 mr-2" />
                            Ouvrir
                        </a>
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Sites en construction", value: "8", icon: Loader2, color: "purple" },
                    { label: "Sites terminés ce mois", value: "156", icon: Globe, color: "emerald" },
                    { label: "Clients actifs", value: "2,847", icon: Users, color: "blue" },
                    { label: "Temps moyen", value: "1h 42", icon: Clock, color: "orange" },
                ].map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]"
                    >
                        <div className={cn(
                            "size-10 rounded-xl flex items-center justify-center mb-4",
                            stat.color === "purple" ? "bg-purple-500/10 text-purple-400" :
                                stat.color === "emerald" ? "bg-emerald-500/10 text-emerald-400" :
                                    stat.color === "blue" ? "bg-blue-500/10 text-blue-400" :
                                        "bg-orange-500/10 text-orange-400"
                        )}>
                            <stat.icon className={cn("size-5", stat.label === "Sites en construction" && "animate-spin")} />
                        </div>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-sm text-zinc-500">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
            >
                <h3 className="text-lg font-bold text-white mb-6">Sites créés cette semaine</h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sitesData}>
                            <defs>
                                <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                            <Area type="monotone" dataKey="created" name="Créés" stroke="#a855f7" strokeWidth={2} fill="url(#colorCreated)" />
                            <Area type="monotone" dataKey="completed" name="Terminés" stroke="#10b981" strokeWidth={2} fill="transparent" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Active Sites */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden"
            >
                <div className="p-6 border-b border-white/5">
                    <h3 className="text-lg font-bold text-white">Projets en cours</h3>
                </div>
                <div className="divide-y divide-white/5">
                    {activeSites.map((site, idx) => {
                        const status = statusConfig[site.status];
                        const StatusIcon = status.icon;

                        return (
                            <motion.div
                                key={site.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * idx }}
                                className="p-4 hover:bg-white/[0.02] transition-colors"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("size-10 rounded-xl flex items-center justify-center", status.bg)}>
                                            <StatusIcon className={cn("size-5", status.color, site.status === "building" && "animate-spin")} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{site.name}</p>
                                            <p className="text-xs text-zinc-500">{site.client} • {site.coder}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={cn("text-xs font-medium px-2 py-1 rounded-lg", status.bg, status.color)}>
                                            {status.label}
                                        </span>
                                        <p className="text-xs text-zinc-500 mt-1">{site.startedAt}</p>
                                    </div>
                                </div>
                                {site.status === "building" && (
                                    <div className="ml-13">
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-zinc-500">Progression</span>
                                            <span className="text-purple-400">{site.progress}%</span>
                                        </div>
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div

                                                initial={{ width: 0 }}
                                                animate={{ width: `${site.progress}%` }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                                className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
}
