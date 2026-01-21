"use client";

import React, { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Plus,
    Database,
    Zap,
    Link2,
    CheckCircle2,
    AlertCircle,
    Search,
    Filter,
    ArrowUpRight,
    Globe,
    Layers,
    MessageSquare,
    ShoppingBag,
    Calendar,
    Mail,
    Lock,
    Webhook,
    RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
    { id: 'all', name: 'Tous', icon: Layers },
    { id: 'ecommerce', name: 'E-commerce', icon: ShoppingBag },
    { id: 'crm', name: 'CRM & Sales', icon: Database },
    { id: 'marketing', name: 'Marketing', icon: Mail },
    { id: 'tools', name: 'Outils', icon: Zap },
];

const connectors = [
    {
        id: "whatsapp-official",
        name: "WhatsApp API",
        description: "Connexion officielle via Meta pour des envois massifs certifiés.",
        status: "connected",
        category: "marketing",
        type: "Direct",
        icon: MessageSquare,
        color: "emerald"
    },
    {
        id: "chariow-store",
        name: "Chariow Store",
        description: "Synchronisez vos produits et commandes automatiquement.",
        status: "connected",
        category: "ecommerce",
        type: "API Key",
        icon: ShoppingBag,
        color: "blue"
    },
    {
        id: "google-calendar",
        name: "Google Calendar",
        description: "Permettez la prise de rendez-vous directe via WhatsApp.",
        status: "disconnected",
        category: "tools",
        type: "OAuth2",
        icon: Calendar,
        color: "purple"
    },
    {
        id: "hubspot-crm",
        name: "HubSpot",
        description: "Synchronisez vos contacts et opportunités en temps réel.",
        status: "disconnected",
        category: "crm",
        type: "OAuth2",
        icon: Database,
        color: "orange"
    },
    {
        id: "shopify",
        name: "Shopify",
        description: "Relances paniers abandonnés et suivis de commandes.",
        status: "available",
        category: "ecommerce",
        type: "App",
        icon: Globe,
        color: "pink"
    },
    {
        id: "custom-webhook",
        name: "Webhooks",
        description: "Connectez n'importe quelle application via des requêtes HTTP.",
        status: "active",
        category: "tools",
        type: "Webhooks",
        icon: Webhook,
        color: "cyan"
    }
];

export default function ConnectorsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");

    const filteredConnectors = connectors.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === "all" || c.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="flex h-screen bg-background text-white overflow-hidden font-sans">
            <DashboardSidebar />

            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden text-white/90">
                <DashboardHeader />

                <div className="flex-1 overflow-y-auto custom-scrollbar md:p-8 p-4">
                    <div className="max-w-[1600px] mx-auto space-y-8">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <h1 className="text-3xl font-black tracking-tighter uppercase italic text-white">
                                    Connecteurs <span className="text-primary">& API</span>
                                </h1>
                                <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest opacity-60">
                                    Reliez votre écosystème à WhatsApp et automatisez vos flux de données.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white gap-2 h-11 px-6 rounded-2xl font-bold uppercase tracking-widest text-[10px]">
                                    <RefreshCw className="h-4 w-4" /> Actualiser
                                </Button>
                                <Button className="bg-primary hover:bg-primary/90 text-black gap-2 h-11 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
                                    <Plus className="h-4.5 w-4.5" /> Créer une Clé API
                                </Button>
                            </div>
                        </div>

                        {/* Search & Categories */}
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher un service, un CRM, une boutique..."
                                        className="w-full bg-[#171717] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="flex bg-[#171717] p-1 rounded-2xl border border-white/5">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveCategory(cat.id)}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat.id
                                                    ? "bg-white text-black shadow-lg"
                                                    : "text-muted-foreground hover:text-white"
                                                }`}
                                        >
                                            <cat.icon className="h-3.5 w-3.5" />
                                            <span className="hidden lg:inline">{cat.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Connectors Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence mode="popLayout">
                                {filteredConnectors.map((connector, i) => (
                                    <motion.div
                                        key={connector.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.2, delay: i * 0.05 }}
                                    >
                                        <Card className="bg-[#171717] border-white/5 hover:border-primary/30 transition-all duration-500 group relative overflow-hidden h-full flex flex-col">
                                            <CardContent className="p-6 flex-1 flex flex-col">
                                                {/* Card Header */}
                                                <div className="flex items-start justify-between mb-6">
                                                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 ${connector.color === 'emerald' ? 'bg-emerald-400/10 text-emerald-400' :
                                                            connector.color === 'blue' ? 'bg-blue-400/10 text-blue-400' :
                                                                connector.color === 'purple' ? 'bg-purple-400/10 text-purple-400' :
                                                                    connector.color === 'orange' ? 'bg-orange-400/10 text-orange-400' :
                                                                        connector.color === 'pink' ? 'bg-pink-400/10 text-pink-400' : 'bg-cyan-400/10 text-cyan-400'
                                                        }`}>
                                                        <connector.icon className="h-7 w-7" />
                                                    </div>

                                                    {connector.status === 'connected' ? (
                                                        <Badge className="bg-emerald-400/10 text-emerald-400 border-none px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                                            <div className="h-1 w-1 rounded-full bg-emerald-400" /> Connecté
                                                        </Badge>
                                                    ) : connector.status === 'disconnected' ? (
                                                        <Badge className="bg-zinc-400/10 text-zinc-400 border-none px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                                            Configuration requise
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-primary/10 text-primary border-none px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                                                            Disponible
                                                        </Badge>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="space-y-2 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-lg font-black tracking-tight text-white uppercase">{connector.name}</h3>
                                                        <span className="text-[9px] font-bold text-muted-foreground border border-white/10 px-1.5 py-0.5 rounded uppercase">{connector.type}</span>
                                                    </div>
                                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                                        {connector.description}
                                                    </p>
                                                </div>

                                                {/* Footer Action */}
                                                <div className="mt-8 pt-6 border-t border-white/5">
                                                    <Button
                                                        variant="outline"
                                                        className={`w-full h-11 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${connector.status === 'connected'
                                                                ? 'border-white/10 text-white hover:bg-white/5'
                                                                : 'border-primary/50 text-white hover:bg-primary/10'
                                                            }`}
                                                    >
                                                        {connector.status === 'connected' ? 'Gérer la connexion' : 'Configurer'}
                                                    </Button>
                                                </div>
                                            </CardContent>

                                            {/* Glow Effect on Hover */}
                                            <div className={`absolute -bottom-12 -right-12 w-24 h-24 blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none ${connector.color === 'emerald' ? 'bg-emerald-400' :
                                                    connector.color === 'blue' ? 'bg-blue-400' :
                                                        connector.color === 'purple' ? 'bg-purple-400' :
                                                            connector.color === 'orange' ? 'bg-orange-400' :
                                                                connector.color === 'pink' ? 'bg-pink-400' : 'bg-cyan-400'
                                                }`} />
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Empty State */}
                        {filteredConnectors.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-20 px-4 text-center"
                            >
                                <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                    <Layers className="h-10 w-10 text-muted-foreground opacity-20" />
                                </div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tight">Aucun connecteur trouvé</h3>
                                <p className="text-muted-foreground text-sm max-w-md mt-2">
                                    Nous n'avons trouvé aucun connecteur correspondant à vos critères de recherche.
                                </p>
                            </motion.div>
                        )}

                        <div className="h-20" />
                    </div>
                </div>
            </main>
        </div>
    );
}
