"use client";

import React, { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Plus,
    Users,
    UserPlus,
    Search,
    Filter,
    MoreHorizontal,
    Mail,
    Phone,
    MapPin,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Upload,
    CheckCircle2,
    Clock,
    Tag,
    Share2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const audiences = [
    {
        id: 1,
        name: "Clients VIP 2024",
        count: 1250,
        growth: "+12%",
        trend: "up",
        tags: ["Premium", "Fidèle"],
        lastActivity: "il y a 2h",
        color: "emerald"
    },
    {
        id: 2,
        name: "Prospects Landing Page",
        count: 5420,
        growth: "+24%",
        trend: "up",
        tags: ["Inbound", "Web"],
        lastActivity: "il y a 5 min",
        color: "blue"
    },
    {
        id: 3,
        name: "Anciens Acheteurs",
        count: 850,
        growth: "-4%",
        trend: "down",
        tags: ["Relance", "Churn risk"],
        lastActivity: "il y a 2 jours",
        color: "orange"
    },
    {
        id: 4,
        name: "Inscrits Newsletter",
        count: 12400,
        growth: "+8%",
        trend: "up",
        tags: ["Marketing", "Information"],
        lastActivity: "il y a 1h",
        color: "purple"
    }
];

const contacts = [
    { id: 1, name: "Marc-Antoine Koffi", phone: "+225 07 45 88 99", email: "marc@example.com", segments: ["VIP", "Tech"], status: "online" },
    { id: 2, name: "Sarah Koné", phone: "+225 01 02 03 04", email: "sarah@example.com", segments: ["Design"], status: "offline" },
    { id: 3, name: "Jean-Pierre Yao", phone: "+225 05 55 66 77", email: "jp.yao@example.com", segments: ["Finance", "VIP"], status: "online" },
    { id: 4, name: "Awa Diallo", phone: "+225 02 44 33 22", email: "awa@example.com", segments: ["Marketing"], status: "idle" },
];

export default function AudiencesPage() {
    const [searchQuery, setSearchQuery] = useState("");

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
                                    Gestion des <span className="text-primary">Audiences</span>
                                </h1>
                                <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest opacity-60">
                                    Segmentez vos contacts et gérez vos listes de diffusion intelligemment.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white gap-2 h-11 px-6 rounded-2xl font-bold uppercase tracking-widest text-[10px]">
                                    <Upload className="h-4 w-4" /> Importer CSV
                                </Button>
                                <Button className="bg-primary hover:bg-primary/90 text-black gap-2 h-11 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
                                    <UserPlus className="h-4.5 w-4.5" /> Nouveau Contact
                                </Button>
                            </div>
                        </div>

                        {/* Top Segments Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {audiences.map((audience, i) => (
                                <motion.div
                                    key={audience.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Card className="bg-[#171717] border-white/5 group hover:border-primary/40 transition-all duration-500 cursor-pointer overflow-hidden">
                                        <CardContent className="p-6 relative">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={`p-2.5 rounded-xl ${audience.color === 'emerald' ? 'bg-emerald-400/10 text-emerald-400' :
                                                        audience.color === 'blue' ? 'bg-blue-400/10 text-blue-400' :
                                                            audience.color === 'orange' ? 'bg-orange-400/10 text-orange-400' : 'bg-purple-400/10 text-purple-400'
                                                    }`}>
                                                    <Users className="h-5 w-5" />
                                                </div>
                                                <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${audience.trend === 'up' ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'
                                                    }`}>
                                                    {audience.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                                    {audience.growth}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-sm font-black uppercase tracking-tight group-hover:text-primary transition-colors">{audience.name}</h3>
                                                <p className="text-2xl font-black tracking-tighter">{audience.count.toLocaleString()}</p>
                                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">Contacts actifs</p>
                                            </div>

                                            {/* Decorative tags */}
                                            <div className="flex gap-1.5 mt-4">
                                                {audience.tags.map(tag => (
                                                    <span key={tag} className="text-[8px] font-black uppercase py-0.5 px-2 bg-white/5 rounded-md border border-white/5">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {/* Main Contact List Section */}
                        <div className="bg-[#171717] border border-white/5 rounded-[32px] overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="relative w-full md:w-96">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher par nom, téléphone, email..."
                                        className="w-full bg-black/20 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs focus:outline-none focus:border-primary/50 transition-all font-medium text-white"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" className="h-10 text-[10px] uppercase font-black tracking-widest text-muted-foreground hover:text-white">
                                        <Filter className="h-4 w-4 mr-2" /> Filtrer
                                    </Button>
                                    <Button variant="ghost" className="h-10 text-[10px] uppercase font-black tracking-widest text-muted-foreground hover:text-white">
                                        <Download className="h-4 w-4 mr-2" /> Exporter
                                    </Button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/5 text-left">
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-30">Contact</th>
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-30">Coordonnées</th>
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-30">Segments</th>
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-30">Statut</th>
                                            <th className="p-6 w-12"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {contacts.map((contact) => (
                                            <tr key={contact.id} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="p-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                                                            <span className="text-xs font-black text-primary">{contact.name.charAt(0)}</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black uppercase tracking-tight text-white">{contact.name}</p>
                                                            <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-40">Client depuis 2023</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-zinc-400">
                                                            <Phone className="h-3 w-3" />
                                                            <span className="text-[11px] font-medium">{contact.phone}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-zinc-500">
                                                            <Mail className="h-3 w-3" />
                                                            <span className="text-[10px] font-medium">{contact.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {contact.segments.map(seg => (
                                                            <Badge key={seg} className="bg-white/5 hover:bg-white/10 text-[9px] font-bold uppercase tracking-widest py-0.5 border-none text-muted-foreground">
                                                                {seg}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`h-1.5 w-1.5 rounded-full ${contact.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                                                contact.status === 'idle' ? 'bg-amber-500' : 'bg-zinc-600'
                                                            }`} />
                                                        <span className="text-[10px] font-black uppercase italic tracking-tighter opacity-60">
                                                            {contact.status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <button className="h-8 w-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-muted-foreground hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-6 border-t border-white/5 bg-black/20 flex items-center justify-between">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Affichage de 1-4 sur 18,420 contacts</p>
                                <div className="flex items-center gap-2">
                                    <button className="px-3 py-1.5 text-[9px] font-black uppercase text-muted-foreground hover:text-white">Précédent</button>
                                    <div className="flex items-center gap-1">
                                        <button className="h-7 w-7 rounded bg-primary text-black text-[10px] font-black">1</button>
                                        <button className="h-7 w-7 rounded hover:bg-white/5 text-white text-[10px] font-black">2</button>
                                        <button className="h-7 w-7 rounded hover:bg-white/5 text-white text-[10px] font-black">3</button>
                                    </div>
                                    <button className="px-3 py-1.5 text-[9px] font-black uppercase text-muted-foreground hover:text-white">Suivant</button>
                                </div>
                            </div>
                        </div>

                        <div className="h-20" />
                    </div>
                </div>
            </main>
        </div>
    );
}
