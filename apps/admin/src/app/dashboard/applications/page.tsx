"use client";

import { motion } from "framer-motion";
import {
    Globe, Zap, MessageSquare, Shield, Plus, Settings, ExternalLink,
    Activity, Users, Server, Clock, CheckCircle, AlertTriangle, XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatNumber } from "@/lib/utils";

interface Application {
    id: string;
    name: string;
    description: string;
    icon: any;
    color: string;
    status: "online" | "offline" | "maintenance";
    version: string;
    users: number;
    requests: number;
    uptime: number;
    lastDeploy: string;
    url: string;
    port: number;
}

const applications: Application[] = [
    {
        id: "afriflow",
        name: "AfriFlow",
        description: "Plateforme de paiement unifiée pour l'Afrique. Intègre Mobile Money, cartes bancaires et virements.",
        icon: Globe,
        color: "#10b981",
        status: "online",
        version: "2.4.1",
        users: 4521,
        requests: 12500,
        uptime: 99.98,
        lastDeploy: "Il y a 2 jours",
        url: "http://localhost:3000",
        port: 3000
    },
    {
        id: "gnata",
        name: "Gnata",
        description: "Création de sites web en moins de 2 heures par nos experts Vibe Coders.",
        icon: Zap,
        color: "#a855f7",
        status: "online",
        version: "1.2.0",
        users: 2847,
        requests: 8560,
        uptime: 99.95,
        lastDeploy: "Il y a 5 heures",
        url: "http://localhost:3002",
        port: 3002
    },
    {
        id: "whatsapp",
        name: "WhatsApp MCP",
        description: "Intégration de chatbots WhatsApp pour l'automatisation des ventes et du support.",
        icon: MessageSquare,
        color: "#22c55e",
        status: "maintenance",
        version: "0.9.5",
        users: 1203,
        requests: 4230,
        uptime: 98.5,
        lastDeploy: "Il y a 1 semaine",
        url: "http://localhost:3003",
        port: 3003
    },
    {
        id: "account-portal",
        name: "Account Portal",
        description: "Système d'authentification SSO centralisé pour toutes les applications Wozif.",
        icon: Shield,
        color: "#3b82f6",
        status: "online",
        version: "1.0.3",
        users: 8974,
        requests: 21000,
        uptime: 99.99,
        lastDeploy: "Il y a 3 jours",
        url: "http://localhost:3012",
        port: 3012
    },
];

const statusConfig = {
    online: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500", label: "En ligne" },
    offline: { icon: XCircle, color: "text-red-400", bg: "bg-red-500", label: "Hors ligne" },
    maintenance: { icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-500", label: "Maintenance" },
};

export default function ApplicationsPage() {
    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Applications</h1>
                    <p className="text-zinc-500">Gérez et surveillez toutes vos applications</p>
                </motion.div>

                <Button size="sm">
                    <Plus className="size-4 mr-2" />
                    Nouvelle application
                </Button>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Applications actives", value: "4", icon: Server, color: "purple" },
                    { label: "Utilisateurs totaux", value: "17,545", icon: Users, color: "blue" },
                    { label: "Requêtes / heure", value: "46.3k", icon: Activity, color: "emerald" },
                    { label: "Uptime moyen", value: "99.6%", icon: Clock, color: "orange" },
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
                                stat.color === "blue" ? "bg-blue-500/10 text-blue-400" :
                                    stat.color === "emerald" ? "bg-emerald-500/10 text-emerald-400" :
                                        "bg-orange-500/10 text-orange-400"
                        )}>
                            <stat.icon className="size-5" />
                        </div>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-sm text-zinc-500">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Applications Grid */}
            <div className="space-y-6">
                {applications.map((app, idx) => {
                    const status = statusConfig[app.status];
                    const StatusIcon = status.icon;
                    const AppIcon = app.icon;

                    return (
                        <motion.div
                            key={app.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden hover:border-white/10 transition-colors"
                        >
                            {/* App Header */}
                            <div className="p-6 border-b border-white/5">
                                <div className="flex items-start gap-6">
                                    <div
                                        className="size-16 rounded-2xl flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: `${app.color}20` }}
                                    >
                                        <AppIcon className="size-8" style={{ color: app.color }} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-white">{app.name}</h3>
                                            <span className="px-2 py-0.5 rounded-md bg-white/5 text-xs text-zinc-400 font-mono">
                                                v{app.version}
                                            </span>
                                            <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-lg",
                                                app.status === "online" ? "bg-emerald-500/10" :
                                                    app.status === "maintenance" ? "bg-yellow-500/10" : "bg-red-500/10"
                                            )}>
                                                <div className={cn("size-1.5 rounded-full animate-pulse", status.bg)} />
                                                <span className={cn("text-xs font-medium", status.color)}>{status.label}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-zinc-400 mb-4">{app.description}</p>

                                        <div className="flex items-center gap-6 text-sm">
                                            <div className="flex items-center gap-2 text-zinc-500">
                                                <Users className="size-4" />
                                                <span>{formatNumber(app.users)} utilisateurs</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-zinc-500">
                                                <Activity className="size-4" />
                                                <span>{formatNumber(app.requests)} req/h</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-zinc-500">
                                                <Clock className="size-4" />
                                                <span>{app.uptime}% uptime</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={app.url} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="size-4 mr-2" />
                                                Ouvrir
                                            </a>
                                        </Button>
                                        <Button variant="secondary" size="sm">
                                            <Settings className="size-4 mr-2" />
                                            Config
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* App Stats */}
                            <div className="grid grid-cols-4 divide-x divide-white/5 bg-white/[0.01]">
                                <div className="p-4 text-center">
                                    <p className="text-xs text-zinc-500 mb-1">Port</p>
                                    <p className="text-sm font-mono text-white">:{app.port}</p>
                                </div>
                                <div className="p-4 text-center">
                                    <p className="text-xs text-zinc-500 mb-1">Dernier déploiement</p>
                                    <p className="text-sm text-white">{app.lastDeploy}</p>
                                </div>
                                <div className="p-4 text-center">
                                    <p className="text-xs text-zinc-500 mb-1">CPU</p>
                                    <p className="text-sm text-white">12%</p>
                                </div>
                                <div className="p-4 text-center">
                                    <p className="text-xs text-zinc-500 mb-1">Mémoire</p>
                                    <p className="text-sm text-white">256 MB</p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
