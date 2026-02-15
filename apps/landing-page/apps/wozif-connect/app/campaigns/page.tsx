"use client";

import React, { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Plus,
    MessageSquare,
    Send,
    BarChart3,
    Calendar,
    Search,
    Filter,
    MoreHorizontal,
    CheckCircle2,
    Clock,
    AlertCircle,
    ArrowUpRight,
    Users,
    MousePointer2,
    MailOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const campaigns = [
    {
        id: 1,
        name: "Soldes d'Hiver 2024",
        status: "active",
        audience: "Clients VIP",
        sent: 1250,
        delivered: 1245,
        read: 980,
        clicked: 450,
        progress: 100,
        date: "20 Jan 2024",
        color: "emerald"
    },
    {
        id: 2,
        name: "Lancement Nouveau Produit",
        status: "scheduled",
        audience: "Tous les contacts",
        sent: 5000,
        delivered: 0,
        read: 0,
        clicked: 0,
        progress: 0,
        date: "25 Jan 2024",
        color: "blue"
    },
    {
        id: 3,
        name: "Flash Sale Flash",
        status: "completed",
        audience: "Prospects",
        sent: 850,
        delivered: 840,
        read: 710,
        clicked: 120,
        progress: 100,
        date: "15 Jan 2024",
        color: "purple"
    },
    {
        id: 4,
        name: "Relance Panier Abandonné",
        status: "active",
        audience: "Automatique",
        sent: 120,
        delivered: 118,
        read: 95,
        clicked: 42,
        progress: 75,
        date: "En continu",
        color: "orange"
    }
];

export default function CampaignsPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const stats = [
        { label: "Campagnes Actives", value: "12", icon: Clock, color: "text-blue-400", bg: "bg-blue-400/10" },
        { label: "Messages Envoyés", value: "24.5k", icon: Send, color: "text-emerald-400", bg: "bg-emerald-400/10" },
        { label: "Taux de Lecture", value: "82%", icon: MailOpen, color: "text-purple-400", bg: "bg-purple-400/10" },
        { label: "Taux de Clic", value: "15.4%", icon: MousePointer2, color: "text-orange-400", bg: "bg-orange-400/10" },
    ];

    return (
        <div className="flex h-screen bg-background text-white overflow-hidden font-sans">
            <DashboardSidebar />

            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <DashboardHeader />

                <div className="flex-1 overflow-y-auto custom-scrollbar md:p-8 p-4">
                    <div className="max-w-[1600px] mx-auto space-y-8">
                        {/* Hero Section */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <h1 className="text-3xl font-black tracking-tighter uppercase italic">
                                    Campagnes <span className="text-primary">WhatsApp</span>
                                </h1>
                                <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest opacity-60">
                                    Gérez vos diffusions massives et suivez les performances en temps réel.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white gap-2 h-11 px-6 rounded-2xl font-bold uppercase tracking-widest text-[10px]">
                                    <BarChart3 className="h-4 w-4" /> Rapport Global
                                </Button>
                                <Button className="bg-primary hover:bg-primary/90 text-black gap-2 h-11 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
                                    <Plus className="h-4.5 w-4.5" /> Nouvelle Campagne
                                </Button>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Card className="bg-[#171717] border-white/5 overflow-hidden group hover:border-primary/30 transition-all duration-500">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                                                    <stat.icon className="h-5 w-5" />
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg">
                                                    <ArrowUpRight className="h-3 w-3" /> +12%
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-50">{stat.label}</p>
                                                <h3 className="text-2xl font-black tracking-tight">{stat.value}</h3>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {/* Filters & Search */}
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Rechercher une campagne..."
                                    className="w-full bg-[#171717] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 h-11 px-6 rounded-2xl bg-[#171717] border border-white/5 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white hover:border-white/20 transition-all">
                                    <Filter className="h-4 w-4" /> Filtres
                                </button>
                                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 h-11 px-6 rounded-2xl bg-[#171717] border border-white/5 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white hover:border-white/20 transition-all">
                                    <Calendar className="h-4 w-4" /> Date
                                </button>
                            </div>
                        </div>

                        {/* Campaigns List */}
                        <div className="space-y-4">
                            <div className="flex items-center px-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-30">
                                <div className="flex-[2]">Campagne / Audience</div>
                                <div className="flex-1 text-center">Status</div>
                                <div className="flex-1 text-center">Engagement</div>
                                <div className="flex-1 text-center">Rapport</div>
                                <div className="w-12"></div>
                            </div>

                            <div className="space-y-3">
                                {campaigns.map((campaign, i) => (
                                    <motion.div
                                        key={campaign.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + (i * 0.05) }}
                                        className="group relative"
                                    >
                                        <div className="bg-[#171717] hover:bg-[#1f1f1f] border border-white/5 hover:border-white/10 rounded-3xl p-6 transition-all duration-300 flex items-center">
                                            {/* Name & Audience */}
                                            <div className="flex-[2] flex items-center gap-4">
                                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${campaign.color === 'emerald' ? 'bg-emerald-400/10' :
                                                    campaign.color === 'blue' ? 'bg-blue-400/10' :
                                                        campaign.color === 'purple' ? 'bg-purple-400/10' :
                                                            campaign.color === 'orange' ? 'bg-orange-400/10' : 'bg-zinc-400/10'
                                                    }`}>
                                                    <MessageSquare className={`h-6 w-6 ${campaign.color === 'emerald' ? 'text-emerald-400' :
                                                        campaign.color === 'blue' ? 'text-blue-400' :
                                                            campaign.color === 'purple' ? 'text-purple-400' :
                                                                campaign.color === 'orange' ? 'text-orange-400' : 'text-zinc-400'
                                                        }`} />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-sm uppercase tracking-tight group-hover:text-primary transition-colors">{campaign.name}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Users className="h-3 w-3 text-muted-foreground opacity-50" />
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-50 tracking-widest">{campaign.audience}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status */}
                                            <div className="flex-1 flex justify-center">
                                                {campaign.status === 'active' && (
                                                    <Badge className="bg-emerald-400/10 text-emerald-400 border-none px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest animate-pulse flex items-center gap-1.5">
                                                        <div className="h-1 w-1 rounded-full bg-emerald-400" /> En cours
                                                    </Badge>
                                                )}
                                                {campaign.status === 'scheduled' && (
                                                    <Badge className="bg-blue-400/10 text-blue-400 border-none px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                                        <Clock className="h-2.5 w-2.5" /> Programmé
                                                    </Badge>
                                                )}
                                                {campaign.status === 'completed' && (
                                                    <Badge className="bg-white/5 text-white/40 border-none px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                                        <CheckCircle2 className="h-2.5 w-2.5" /> Terminé
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Engagement Stats */}
                                            <div className="flex-1 flex flex-col items-center gap-2">
                                                <div className="flex items-center gap-4">
                                                    <div className="text-center">
                                                        <p className="text-[10px] font-black">{campaign.read}</p>
                                                        <p className="text-[8px] font-bold text-muted-foreground uppercase opacity-40">Lus</p>
                                                    </div>
                                                    <div className="w-px h-6 bg-white/5" />
                                                    <div className="text-center">
                                                        <p className="text-[10px] font-black">{campaign.clicked}</p>
                                                        <p className="text-[8px] font-bold text-muted-foreground uppercase opacity-40">Clics</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Mini Graph / Progress */}
                                            <div className="flex-1 px-8">
                                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${campaign.progress}%` }}
                                                        className={`h-full shadow-[0_0_10px_rgba(37,211,102,0.3)] ${campaign.color === 'emerald' ? 'bg-emerald-400' :
                                                            campaign.color === 'blue' ? 'bg-blue-400' :
                                                                campaign.color === 'purple' ? 'bg-purple-400' :
                                                                    campaign.color === 'orange' ? 'bg-orange-400' : 'bg-zinc-400'
                                                            }`}
                                                    />
                                                </div>
                                                <div className="flex justify-between mt-2">
                                                    <span className="text-[8px] font-black uppercase tracking-tighter opacity-30">{campaign.progress}% Envoyé</span>
                                                    <span className="text-[8px] font-black uppercase tracking-tighter opacity-30">{campaign.date}</span>
                                                </div>
                                            </div>

                                            {/* Action */}
                                            <div className="w-12 flex justify-end">
                                                <button className="h-8 w-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-muted-foreground hover:text-white transition-all">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="h-20" />
                </div>
            </main>
        </div>
    );
}
