"use client";

import { motion } from "framer-motion";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
    MessageSquare, Users, Bot, TrendingUp, Settings, ExternalLink,
    Send, Clock, CheckCircle, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatNumber } from "@/lib/utils";

const messageData = [
    { name: "00h", sent: 120, received: 450 },
    { name: "04h", sent: 45, received: 180 },
    { name: "08h", sent: 280, received: 890 },
    { name: "12h", sent: 420, received: 1200 },
    { name: "16h", sent: 380, received: 1050 },
    { name: "20h", sent: 250, received: 720 },
];

interface Bot {
    id: string;
    name: string;
    business: string;
    status: "active" | "paused" | "error";
    messages: number;
    conversations: number;
    lastActive: string;
}

const bots: Bot[] = [
    { id: "1", name: "Support Client", business: "TechStore CI", status: "active", messages: 12450, conversations: 847, lastActive: "En ligne" },
    { id: "2", name: "Ventes Auto", business: "AutoMobile SN", status: "active", messages: 8920, conversations: 523, lastActive: "En ligne" },
    { id: "3", name: "FAQ Bot", business: "Restaurant Mama", status: "paused", messages: 3420, conversations: 234, lastActive: "Pause" },
    { id: "4", name: "Order Bot", business: "Fashion Shop", status: "error", messages: 156, conversations: 12, lastActive: "Erreur" },
];

const statusConfig = {
    active: { color: "text-emerald-400", bg: "bg-emerald-500/10", dot: "bg-emerald-500" },
    paused: { color: "text-yellow-400", bg: "bg-yellow-500/10", dot: "bg-yellow-500" },
    error: { color: "text-red-400", bg: "bg-red-500/10", dot: "bg-red-500" },
};

export default function WhatsAppPage() {
    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4"
                >
                    <div className="size-16 rounded-2xl bg-green-500/20 flex items-center justify-center">
                        <MessageSquare className="size-8 text-green-400" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold text-white tracking-tight">WhatsApp MCP</h1>
                            <span className="px-2 py-0.5 rounded-md bg-white/5 text-xs text-zinc-400 font-mono">v0.9.5</span>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-yellow-500/10">
                                <div className="size-1.5 rounded-full bg-yellow-500" />
                                <span className="text-xs font-medium text-yellow-400">Maintenance</span>
                            </div>
                        </div>
                        <p className="text-zinc-500">Intégration de chatbots WhatsApp pour l'automatisation</p>
                    </div>
                </motion.div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">
                        <Settings className="size-4 mr-2" />
                        Configuration
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <a href="http://localhost:3003" target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="size-4 mr-2" />
                            Ouvrir
                        </a>
                    </Button>
                </div>
            </div>

            {/* Maintenance Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center gap-3"
            >
                <AlertTriangle className="size-5 text-yellow-400" />
                <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-400">Maintenance planifiée</p>
                    <p className="text-xs text-yellow-400/70">Le service sera indisponible le 20 Jan de 02h à 04h (WAT)</p>
                </div>
                <Button variant="outline" size="sm" className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10">
                    En savoir plus
                </Button>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Bots actifs", value: "24", icon: Bot, color: "green" },
                    { label: "Messages / jour", value: "45.2k", icon: Send, color: "blue" },
                    { label: "Utilisateurs connectés", value: "1,203", icon: Users, color: "purple" },
                    { label: "Temps de réponse", value: "0.8s", icon: Clock, color: "orange" },
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
                            stat.color === "green" ? "bg-green-500/10 text-green-400" :
                                stat.color === "blue" ? "bg-blue-500/10 text-blue-400" :
                                    stat.color === "purple" ? "bg-purple-500/10 text-purple-400" :
                                        "bg-orange-500/10 text-orange-400"
                        )}>
                            <stat.icon className="size-5" />
                        </div>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-sm text-zinc-500">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Messages Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
            >
                <h3 className="text-lg font-bold text-white mb-6">Volume de messages aujourd'hui</h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={messageData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                            <Bar dataKey="sent" name="Envoyés" fill="#22c55e" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="received" name="Reçus" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Active Bots */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden"
            >
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Bots configurés</h3>
                    <Button size="sm">Nouveau bot</Button>
                </div>
                <div className="divide-y divide-white/5">
                    {bots.map((bot, idx) => {
                        const status = statusConfig[bot.status];

                        return (
                            <motion.div
                                key={bot.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * idx }}
                                className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                                        <Bot className="size-6 text-green-400" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-white">{bot.name}</p>
                                            <div className={cn("size-2 rounded-full", status.dot)} />
                                        </div>
                                        <p className="text-xs text-zinc-500">{bot.business}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-white">{formatNumber(bot.messages)}</p>
                                        <p className="text-xs text-zinc-500">Messages</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-white">{bot.conversations}</p>
                                        <p className="text-xs text-zinc-500">Conversations</p>
                                    </div>
                                    <span className={cn("text-xs font-medium px-2 py-1 rounded-lg", status.bg, status.color)}>
                                        {bot.lastActive}
                                    </span>
                                    <Button variant="ghost" size="icon" className="size-8">
                                        <Settings className="size-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
}
