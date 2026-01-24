"use client";

import React, { useState } from "react";
import {
    Zap,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Play,
    Pause,
    Clock,
    Split,
    MessageSquare,
    Cpu,
    GitBranch,
    ChevronRight,
    ArrowUpRight,
    Activity,
    Shield,
    Terminal,
    Eye,
    Settings,
    WandSparkles,
    Sparkles,
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const workflows = [
    {
        id: "wf-1",
        name: "Onboarding Client AI",
        status: "active",
        trigger: "Premier message entrant",
        steps: 12,
        executions: "1.2k",
        successRate: "98.5%",
        lastRun: "Il y a 2 min",
        type: "Intelligent",
        logic: [
            { type: "trigger", name: "Incoming Msg" },
            { type: "action", name: "Llama 3.3 Analysis" },
            { type: "branch", name: "Category Intent" },
            { type: "action", name: "Send PDF Catalog" }
        ]
    },
    {
        id: "wf-2",
        name: "Relance Panier Abandonné",
        status: "active",
        trigger: "Webhook: Checkout Failed",
        steps: 5,
        executions: "850",
        successRate: "94.2%",
        lastRun: "Il y a 15 min",
        type: "E-commerce",
        logic: [
            { type: "trigger", name: "Webhook" },
            { type: "delay", name: "2 Hours" },
            { type: "action", name: "WhatsApp Reminder" }
        ]
    },
    {
        id: "wf-3",
        name: "Gestionnaire de Tickets Support",
        status: "paused",
        trigger: "Mot clé: #aide",
        steps: 8,
        executions: "3.4k",
        successRate: "91.0%",
        lastRun: "Hier",
        type: "Support",
        logic: [
            { type: "trigger", name: "Keyword Match" },
            { type: "action", name: "Assign to Agent" },
            { type: "action", name: "Auto-Reply Status" }
        ]
    }
];

export default function AutomationsPage() {
    const router = useRouter();
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [thinkingStep, setThinkingStep] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const thinkingMessages = [
        "Analyse de votre demande...",
        "Calcul de l'architecture optimale...",
        "Conception des nodes et liaisons...",
        "Génération du workflow de génie..."
    ];

    const handleGenerate = () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);
        setThinkingStep(0);

        // Cycle through messages
        const interval = setInterval(() => {
            setThinkingStep(prev => (prev < thinkingMessages.length - 1 ? prev + 1 : prev));
        }, 1000);

        // Redirect after the animation
        setTimeout(() => {
            clearInterval(interval);
            router.push(`/automations/new?prompt=${encodeURIComponent(prompt)}`);
        }, 4500);
    };

    return (
        <div className="flex min-h-screen bg-background text-foreground selection:bg-primary selection:text-black">
            <DashboardSidebar />

            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <DashboardHeader />

                <div className="flex-1 overflow-y-auto md:p-8 p-4 custom-scrollbar">
                    <div className="max-w-[1500px] mx-auto space-y-8">

                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-1"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-6 w-1 bg-primary rounded-full" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Automatisations</span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
                                    Vos <span className="text-primary not-italic">Workflow</span> de génie
                                </h1>
                                <p className="text-muted-foreground font-medium text-xs md:text-sm uppercase tracking-widest opacity-60">
                                    Concevez et gérez vos processus métier automatisés sur WhatsApp.
                                </p>
                            </motion.div>

                            <Link href="/automations/new">
                                <Button className="h-10 px-6 rounded-xl bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-white/90">
                                    <Plus className="h-4 w-4 mr-2" /> Nouveau Workflow
                                </Button>
                            </Link>
                        </div>

                        {/* AI Assistant Banner */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="rounded-3xl border text-white shadow-2xl border-primary/30 bg-primary/5 mb-8 overflow-hidden relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                            <div className="p-8">
                                <AnimatePresence>
                                    {isGenerating && (
                                        <motion.div
                                            key="thinking-overlay"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl rounded-3xl border border-primary/50 shadow-[0_0_50px_rgba(37,211,102,0.2)]"
                                        >
                                            <div className="relative mb-8">
                                                <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full animate-pulse" />
                                                <div className="relative h-20 w-20 flex items-center justify-center">
                                                    <div className="absolute inset-0 rounded-3xl border-2 border-primary/20 border-t-primary animate-spin shadow-[0_0_20px_rgba(37,211,102,0.5)]" />
                                                    <WandSparkles className="h-10 w-10 text-primary animate-bounce" />
                                                </div>
                                            </div>

                                            <div className="text-center space-y-4 px-10 max-w-md">
                                                <motion.h4
                                                    key={thinkingStep}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-lg font-black uppercase text-white italic tracking-tighter"
                                                >
                                                    {thinkingMessages[thinkingStep]}
                                                </motion.h4>
                                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.3em] opacity-60">L'intelligence artificielle prépare votre workflow...</p>

                                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-6 border border-white/5">
                                                    <motion.div
                                                        className="h-full bg-gradient-to-r from-primary/50 to-primary shadow-[0_0_15px_rgba(37,211,102,0.8)]"
                                                        initial={{ width: "0%" }}
                                                        animate={{ width: `${((thinkingStep + 1) / thinkingMessages.length) * 100}%` }}
                                                        transition={{ duration: 0.8 }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Ambient Sparkles */}
                                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                                {isMounted && [...Array(6)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        className="absolute bg-primary rounded-full"
                                                        style={{
                                                            width: Math.random() * 4 + 2,
                                                            height: Math.random() * 4 + 2,
                                                            top: `${Math.random() * 100}%`,
                                                            left: `${Math.random() * 100}%`,
                                                        }}
                                                        animate={{
                                                            y: [0, -100],
                                                            opacity: [0, 1, 0],
                                                            scale: [0, 1.5, 0],
                                                        }}
                                                        transition={{
                                                            duration: Math.random() * 2 + 1,
                                                            repeat: Infinity,
                                                            delay: Math.random() * 2,
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                                    <div className="h-16 w-16 rounded-[24px] bg-primary/20 flex items-center justify-center shrink-0 shadow-lg shadow-primary/10 border border-primary/20 animate-pulse">
                                        <WandSparkles className="h-8 w-8 text-primary" />
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
                                                Assistant <span className="text-primary not-italic">IA Génératif</span>
                                            </h3>
                                            <Badge className="bg-primary text-black text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border-none">
                                                Beta v2
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest opacity-60 mb-6">
                                            Décrivez votre processus métier et laissez notre IA concevoir le workflow optimal pour vous.
                                        </p>

                                        <div className="flex flex-col sm:flex-row gap-3 relative">
                                            <div className="relative flex-1 group">
                                                <input
                                                    className="w-full h-12 rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium text-white placeholder:text-muted-foreground placeholder:italic"
                                                    placeholder="Ex: Je veux un bot qui répond aux questions sur mes produits et prend les commandes..."
                                                    value={prompt}
                                                    onChange={(e) => setPrompt(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                                    disabled={isGenerating}
                                                />
                                                <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-primary group-focus-within:w-full transition-all duration-500" />
                                            </div>
                                            <Button
                                                onClick={handleGenerate}
                                                disabled={isGenerating || !prompt.trim()}
                                                className="h-12 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                                            >
                                                <Sparkles className="h-4 w-4 mr-2" />
                                                Générer
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: "Exécutions", value: "1.2M", change: "+12%", icon: Activity },
                                { label: "Nodes AI", value: "45k", change: "Llama 3.3", icon: Cpu },
                                { label: "Succès", value: "99.98%", change: "Optimal", icon: Shield }
                            ].map((stat, i) => (
                                <Card key={i} className="border-white/10 bg-card hover:bg-white/[0.03] transition-colors shadow-xl rounded-3xl overflow-hidden relative group">
                                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                                        <stat.icon className="h-12 w-12 text-white" />
                                    </div>
                                    <CardContent className="p-6 flex items-center justify-between relative z-10">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-50">{stat.label}</p>
                                            <h4 className="text-2xl font-black italic tracking-tighter text-white uppercase">{stat.value}</h4>
                                            <p className="text-[9px] font-bold text-primary italic uppercase tracking-widest">{stat.change}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Workflows List - Grid Design */}
                        <div className="mb-10">
                            <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-6 flex items-center gap-2 italic">
                                <Zap className="h-4 w-4" /> Mes créations
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {workflows.map((wf, idx) => (
                                    <motion.div
                                        key={wf.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1, duration: 0.3 }}
                                        whileHover={{ scale: 1.02, y: -4 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div
                                            className="relative cursor-pointer group"
                                            onClick={() => router.push(`/automations/new?id=${wf.id}`)}
                                        >
                                            {/* Card Background with Gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                            <div className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 hover:border-primary/40 transition-all duration-300 overflow-hidden">
                                                {/* Glow Effect */}
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2"></div>

                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                        <Zap className={`h-5 w-5 ${wf.status === 'active' ? 'text-primary' : 'text-muted-foreground'}`} />
                                                    </div>

                                                    {/* Status Badge */}
                                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${wf.status === 'active'
                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                        }`}>
                                                        <div className={`h-1.5 w-1.5 rounded-full ${wf.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
                                                        {wf.status === 'active' ? 'Actif' : 'Brouillon'}
                                                    </div>
                                                </div>

                                                <div className="space-y-2 mb-4">
                                                    <h3 className="text-white font-black text-lg truncate group-hover:text-primary transition-colors italic tracking-tighter uppercase">
                                                        {wf.name}
                                                    </h3>
                                                    <p className="text-muted-foreground/60 text-[11px] line-clamp-2 font-medium uppercase tracking-wider">
                                                        {wf.trigger || "Automatisation créée pour votre business"}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <Activity className="h-3 w-3 text-muted-foreground/50" />
                                                        <span className="text-[10px] text-muted-foreground/70 font-bold uppercase tracking-widest">
                                                            {wf.steps || 0} étapes
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Zap className="h-3 w-3 text-primary/50" />
                                                        <span className="text-[10px] text-muted-foreground/70 font-bold uppercase tracking-widest">
                                                            {wf.executions} execs
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-3 w-3 text-muted-foreground/40" />
                                                        <span className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-widest">
                                                            {wf.lastRun || "21 janv. 2026"}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Ouvrir</span>
                                                        <ChevronRight className="h-4 w-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="h-20" />
                    </div>
                </div>
            </main>
        </div>
    );
}
