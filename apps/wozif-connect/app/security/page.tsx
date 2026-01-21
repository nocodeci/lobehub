"use client";

import React, { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
    ShieldCheck,
    Lock,
    Key,
    Smartphone,
    Monitor,
    History,
    AlertTriangle,
    CheckCircle2,
    LogOut,
    Eye,
    EyeOff,
    MoreHorizontal,
    Globe,
    Clock,
    ShieldAlert
} from "lucide-react";
import { motion } from "framer-motion";

const activeSessions = [
    { id: 1, device: "MacBook Pro", location: "Abidjan, CI", ip: "197.214.12.34", current: true, icon: Monitor },
    { id: 2, device: "iPhone 15 Pro", location: "Grand-Bassam, CI", ip: "41.202.45.11", current: false, icon: Smartphone },
];

const auditLogs = [
    { id: 1, event: "Connexion réussie", time: "il y a 2 min", status: "success", info: "Browser: Chrome (macOS)" },
    { id: 2, event: "Modification Clé API", time: "il y a 3h", status: "warning", info: "L'utilisateur a régénéré la clé 'Chariow Connector'" },
    { id: 3, event: "Échec de connexion", time: "Hier, 23:45", status: "error", info: "Tentative infructueuse depuis 185.12.3.4" },
    { id: 4, event: "2FA Activé", time: "15 Jan 2024", status: "success", info: "Authentification à deux facteurs validée" },
];

export default function SecurityPage() {
    const [is2FAEnabled, setIs2FAEnabled] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex h-screen bg-background text-white overflow-hidden font-sans">
            <DashboardSidebar />

            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <DashboardHeader />

                <div className="flex-1 overflow-y-auto custom-scrollbar md:p-8 p-4">
                    <div className="max-w-[1200px] mx-auto space-y-10">
                        {/* Hero Section */}
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black tracking-tighter uppercase italic">
                                Sécurité <span className="text-primary">& Confidentialité</span>
                            </h1>
                            <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest opacity-60">
                                Protégez votre compte et surveillez l'activité de votre instance WhatsApp.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Security Settings */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* 2FA Card */}
                                <Card className="bg-[#171717] border-white/10 overflow-hidden relative">
                                    <CardContent className="p-8">
                                        <div className="flex items-start justify-between mb-8">
                                            <div className="flex items-center gap-4">
                                                <div className="h-14 w-14 rounded-2xl bg-emerald-400/10 flex items-center justify-center text-emerald-400">
                                                    <Lock className="h-7 w-7" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black uppercase tracking-tight">Authentification 2FA</h3>
                                                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest opacity-50">Sécurisation par code OTP</p>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={is2FAEnabled}
                                                onCheckedChange={setIs2FAEnabled}
                                                className="data-[state=checked]:bg-primary"
                                            />
                                        </div>
                                        <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                                            L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire à votre compte en exigeant un code de vérification généré par une application mobile (comme Google Authenticator) lors de chaque connexion.
                                        </p>
                                        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-400/5 border border-emerald-400/10 text-emerald-400">
                                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Votre compte est actuellement bien protégé</span>
                                        </div>
                                    </CardContent>
                                    {/* Accent line */}
                                    <div className="absolute top-0 left-0 h-[2px] w-1/4 bg-primary" />
                                </Card>

                                {/* Password Management */}
                                <Card className="bg-[#171717] border-white/10">
                                    <CardContent className="p-8 space-y-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60">
                                                <Key className="h-5 w-5" />
                                            </div>
                                            <h3 className="text-lg font-black uppercase tracking-tight">Mot de passe</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Ancien mot de passe</label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:border-primary/50"
                                                        placeholder="••••••••••••"
                                                    />
                                                    <button
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                                                    >
                                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Nouveau mot de passe</label>
                                                <input
                                                    type="password"
                                                    className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:border-primary/50"
                                                    placeholder="Nouveau mot de passe"
                                                />
                                            </div>
                                        </div>
                                        <Button className="bg-white text-black font-black uppercase text-[10px] tracking-widest h-11 px-8 rounded-xl hover:bg-white/90">
                                            Mettre à jour le mot de passe
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Activity Logs */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-30">Historique d'audit</h3>
                                        <Button variant="ghost" className="h-8 text-[9px] uppercase font-black tracking-widest text-muted-foreground">Tout voir</Button>
                                    </div>
                                    <div className="space-y-2">
                                        {auditLogs.map((log) => (
                                            <div key={log.id} className="bg-[#171717]/50 border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:border-white/10 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className={`h-2 w-2 rounded-full ${log.status === 'success' ? 'bg-emerald-500' :
                                                            log.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                                                        }`} />
                                                    <div>
                                                        <p className="text-xs font-black uppercase tracking-tight text-white">{log.event}</p>
                                                        <p className="text-[10px] text-muted-foreground italic">{log.info}</p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-bold text-muted-foreground opacity-30 uppercase">{log.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Info */}
                            <div className="space-y-6">
                                {/* Active Sessions */}
                                <Card className="bg-[#171717] border-white/10">
                                    <CardContent className="p-6">
                                        <h3 className="text-xs font-black uppercase tracking-widest mb-6">Sessions Actives</h3>
                                        <div className="space-y-6">
                                            {activeSessions.map((session) => (
                                                <div key={session.id} className="flex items-start gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 border border-white/5">
                                                        <session.icon className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-xs font-black uppercase tracking-tight">{session.device}</p>
                                                            {session.current && (
                                                                <Badge className="bg-primary/20 text-primary border-none text-[8px] font-black uppercase h-5">Ici</Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-[10px] text-muted-foreground font-medium opacity-50">{session.location}</p>
                                                        <p className="text-[10px] font-medium text-primary/60">{session.ip}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <Button variant="ghost" className="w-full mt-6 h-10 border border-red-500/20 text-red-500/60 hover:text-red-500 hover:bg-red-500/5 text-[9px] font-black uppercase tracking-widest rounded-xl">
                                            <LogOut className="h-3.5 w-3.5 mr-2" /> Déconnexion globale
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Account Alert */}
                                <Card className="bg-red-500/5 border border-red-500/20">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 text-red-500 mb-3">
                                            <ShieldAlert className="h-5 w-5" />
                                            <h3 className="text-xs font-black uppercase tracking-widest">Zone de danger</h3>
                                        </div>
                                        <p className="text-[10px] text-red-500/60 font-medium leading-relaxed mb-4 uppercase tracking-wider">
                                            La suppression de votre compte entraînera la perte définitive de toutes vos automatisations et contacts.
                                        </p>
                                        <button className="text-[10px] font-black text-red-500 uppercase tracking-widest border-b border-red-500/30 hover:border-red-500 transition-colors">
                                            Désactiver le compte
                                        </button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        <div className="h-20" />
                    </div>
                </div>
            </main>
        </div>
    );
}
