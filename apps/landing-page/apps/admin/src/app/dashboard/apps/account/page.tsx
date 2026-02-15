"use client";

import { motion } from "framer-motion";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
    Shield, Users, Key, TrendingUp, Settings, ExternalLink,
    LogIn, UserPlus, Lock, Clock, Globe, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const authData = [
    { name: "00h", logins: 120, signups: 15 },
    { name: "04h", logins: 45, signups: 5 },
    { name: "08h", logins: 380, signups: 42 },
    { name: "12h", logins: 520, signups: 68 },
    { name: "16h", logins: 480, signups: 55 },
    { name: "20h", logins: 350, signups: 38 },
];

interface Session {
    id: string;
    user: string;
    email: string;
    app: string;
    device: string;
    location: string;
    time: string;
}

const activeSessions: Session[] = [
    { id: "1", user: "Mamadou Diallo", email: "mamadou@example.com", app: "Gnata", device: "Chrome / macOS", location: "Abidjan, CI", time: "En ligne" },
    { id: "2", user: "Aissatou Bah", email: "aissatou@example.com", app: "AfriFlow", device: "Safari / iOS", location: "Dakar, SN", time: "Il y a 2 min" },
    { id: "3", user: "Oumar Sy", email: "oumar@example.com", app: "Gnata", device: "Firefox / Windows", location: "Douala, CM", time: "Il y a 5 min" },
    { id: "4", user: "Fatou Ndiaye", email: "fatou@example.com", app: "Admin", device: "Chrome / Windows", location: "Bamako, ML", time: "Il y a 12 min" },
];

export default function AccountPortalPage() {
    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4"
                >
                    <div className="size-16 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                        <Shield className="size-8 text-blue-400" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold text-white tracking-tight">Account Portal</h1>
                            <span className="px-2 py-0.5 rounded-md bg-white/5 text-xs text-zinc-400 font-mono">v1.0.3</span>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/10">
                                <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-medium text-emerald-400">En ligne</span>
                            </div>
                        </div>
                        <p className="text-zinc-500">Système d'authentification SSO centralisé</p>
                    </div>
                </motion.div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">
                        <Settings className="size-4 mr-2" />
                        Configuration
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <a href="http://localhost:3012" target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="size-4 mr-2" />
                            Ouvrir
                        </a>
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Sessions actives", value: "2,847", icon: Users, color: "blue" },
                    { label: "Connexions / jour", value: "8,974", icon: LogIn, color: "emerald" },
                    { label: "Inscriptions / jour", value: "+234", icon: UserPlus, color: "purple" },
                    { label: "Taux de succès", value: "99.2%", icon: CheckCircle, color: "orange" },
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
                            stat.color === "blue" ? "bg-blue-500/10 text-blue-400" :
                                stat.color === "emerald" ? "bg-emerald-500/10 text-emerald-400" :
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

            {/* Auth Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
            >
                <h3 className="text-lg font-bold text-white mb-6">Activité d'authentification aujourd'hui</h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={authData}>
                            <defs>
                                <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                            <Area type="monotone" dataKey="logins" name="Connexions" stroke="#3b82f6" strokeWidth={2} fill="url(#colorLogins)" />
                            <Area type="monotone" dataKey="signups" name="Inscriptions" stroke="#a855f7" strokeWidth={2} fill="url(#colorSignups)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Security Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "SSO Unifié", desc: "Connexion unique pour toutes les apps", icon: Key, status: "active" },
                    { title: "2FA Activé", desc: "Authentification à deux facteurs", icon: Lock, status: "active" },
                    { title: "Session Timeout", desc: "Expiration après 24h d'inactivité", icon: Clock, status: "active" },
                ].map((feature, idx) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <feature.icon className="size-5 text-blue-400" />
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10">
                                <CheckCircle className="size-3 text-emerald-400" />
                                <span className="text-xs font-medium text-emerald-400">Actif</span>
                            </div>
                        </div>
                        <h4 className="text-sm font-medium text-white mb-1">{feature.title}</h4>
                        <p className="text-xs text-zinc-500">{feature.desc}</p>
                    </motion.div>
                ))}
            </div>

            {/* Active Sessions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden"
            >
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Sessions actives</h3>
                    <Button variant="outline" size="sm">Voir toutes</Button>
                </div>
                <div className="divide-y divide-white/5">
                    {activeSessions.map((session, idx) => (
                        <motion.div
                            key={session.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                    {session.user.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{session.user}</p>
                                    <p className="text-xs text-zinc-500">{session.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-center">
                                    <p className="text-xs text-zinc-500">App</p>
                                    <p className="text-sm font-medium text-white">{session.app}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-zinc-500">Appareil</p>
                                    <p className="text-sm text-white">{session.device}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="size-3 text-zinc-500" />
                                    <span className="text-sm text-zinc-400">{session.location}</span>
                                </div>
                                <span className={cn(
                                    "text-xs font-medium px-2 py-1 rounded-lg",
                                    session.time === "En ligne"
                                        ? "bg-emerald-500/10 text-emerald-400"
                                        : "bg-zinc-500/10 text-zinc-400"
                                )}>
                                    {session.time}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
