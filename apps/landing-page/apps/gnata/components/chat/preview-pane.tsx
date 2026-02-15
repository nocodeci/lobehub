"use client";

import { useChatStore } from "@/store/chat-store";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { useEffect, useState, useCallback } from "react";
import { Rocket, Monitor, Smartphone, Tablet, ExternalLink, CheckCircle2, Clock, Code, Palette, Server, Zap, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Project status types matching the backend
type ProjectStatus = 'PENDING' | 'PAID' | 'ASSIGNED' | 'BUILDING' | 'REVIEW' | 'COMPLETED';

interface ProjectData {
    status: ProjectStatus;
    coderName?: string;
    previewUrl?: string;
    deployUrl?: string;
}

export function PreviewPane() {
    const { previewState, setPreviewState } = useChatStore();
    const [projectData, setProjectData] = useState<ProjectData | null>(null);
    const [animationData, setAnimationData] = useState<any>(null);
    const [dots, setDots] = useState("");

    // Poll for project status
    useEffect(() => {
        if (previewState !== 'building') return;

        const chatId = localStorage.getItem("gnata-chat-id");
        if (!chatId) return;

        const pollStatus = async () => {
            try {
                const res = await fetch(`/api/project/status?chatId=${chatId}`);
                if (res.ok) {
                    const data = await res.json();
                    setProjectData(data);
                }
            } catch (e) {
                console.error("Error polling status:", e);
            }
        };

        // Initial poll
        pollStatus();

        // Poll every 5 seconds
        const interval = setInterval(pollStatus, 5000);

        return () => clearInterval(interval);
    }, [previewState]);

    // Animate dots for waiting state
    useEffect(() => {
        if (!projectData || projectData.status !== 'PENDING') return;

        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? "" : prev + ".");
        }, 500);

        return () => clearInterval(interval);
    }, [projectData]);

    // Load Lottie animation
    useEffect(() => {
        fetch("https://assets9.lottiefiles.com/packages/lf20_m6cuL6.json")
            .then(res => res.json())
            .then(data => setAnimationData(data))
            .catch(err => console.error("Lottie load error:", err));
    }, []);

    // WAITING STATE - Project just paid, waiting for admin to assign
    if (previewState === 'building' && (!projectData || projectData.status === 'PENDING' || projectData.status === 'PAID')) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[#050505]/80 backdrop-blur-sm relative z-10">
                {/* Animated Icon */}
                <div className="relative mb-8">
                    <div className="size-24 rounded-full bg-gradient-to-tr from-purple-600/20 to-blue-600/20 flex items-center justify-center border border-purple-500/20">
                        <Users className="size-10 text-purple-400" />
                    </div>
                    <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-ping" />
                </div>

                <div className="space-y-4 max-w-md">
                    <h2 className="text-2xl font-bold text-white">
                        Attribution en cours{dots}
                    </h2>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        Nous sélectionnons le meilleur <span className="text-purple-400 font-medium">Vibe Coder</span> pour votre projet.
                        Vous serez notifié dès qu'un expert prendra en charge votre site.
                    </p>

                    <div className="flex items-center justify-center gap-3 py-4 px-6 bg-white/5 rounded-2xl border border-white/10 mt-6">
                        <Loader2 className="size-5 text-purple-400 animate-spin" />
                        <span className="text-sm text-zinc-300">Recherche d'un expert disponible...</span>
                    </div>

                    <p className="text-xs text-zinc-600 mt-4">
                        Délai habituel : moins de 5 minutes
                    </p>
                </div>

                {/* Background Grid */}
                <div
                    className="absolute inset-0 z-[-1] hidden dark:block pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(to right, #1f1f23 1px, transparent 1px), linear-gradient(to bottom, #1f1f23 1px, transparent 1px)`,
                        backgroundSize: '20px 20px',
                        maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)'
                    }}
                />
            </div>
        );
    }

    // BUILDING STATE - Vibe Coder is working on the project
    if (previewState === 'building' && projectData && (projectData.status === 'ASSIGNED' || projectData.status === 'BUILDING')) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[#050505]/80 backdrop-blur-sm relative z-10">
                {/* Lottie Animation */}
                <div className="w-48 h-48 mb-6">
                    {animationData && <Lottie animationData={animationData} loop={true} />}
                </div>

                <div className="space-y-6 max-w-lg w-full">
                    {/* Title */}
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-2">
                            <Code className="size-3 text-blue-400" />
                            <span className="text-xs font-medium text-blue-400">En cours de création</span>
                        </div>
                        <h2 className="text-2xl font-bold italic tracking-tight text-white">
                            Votre site est en construction !
                        </h2>
                        <p className="text-zinc-400 text-sm">
                            {projectData.coderName ? (
                                <>L'expert <span className="text-purple-400 font-medium">{projectData.coderName}</span> travaille sur votre site.</>
                            ) : (
                                <>Un expert Vibe Coder travaille sur votre site en temps réel.</>
                            )}
                        </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center gap-3 py-4 px-6 bg-white/5 rounded-2xl border border-white/10">
                        <div className="size-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <Rocket className="size-5 text-blue-400 animate-bounce" />
                        </div>
                        <div className="text-left flex-1">
                            <p className="text-sm font-medium text-white">Développement en cours</p>
                            <p className="text-xs text-zinc-500">Livraison prévue sous 2 heures</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-zinc-500">
                            <Clock className="size-3" />
                            <span>~2h</span>
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="grid grid-cols-3 gap-2 pt-4">
                        {[
                            { label: 'ATTRIBUÉ', done: true },
                            { label: 'EN COURS', current: true },
                            { label: 'TERMINÉ', done: false }
                        ].map((step) => (
                            <div key={step.label} className="flex flex-col items-center gap-1.5">
                                <div className={`size-2 rounded-full transition-all ${step.done
                                    ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                                    : step.current
                                        ? 'bg-blue-500 animate-pulse'
                                        : 'bg-zinc-800'
                                    }`} />
                                <span className={`text-[10px] font-medium ${step.done ? 'text-emerald-500' : step.current ? 'text-blue-400' : 'text-zinc-600'}`}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Background Grid */}
                <div
                    className="absolute inset-0 z-[-1] hidden dark:block pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(to right, #1f1f23 1px, transparent 1px), linear-gradient(to bottom, #1f1f23 1px, transparent 1px)`,
                        backgroundSize: '20px 20px',
                        maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)'
                    }}
                />
            </div>
        );
    }

    // REVIEW STATE - Vibe Coder submitted for review
    if (previewState === 'building' && projectData?.status === 'REVIEW') {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[#050505]/80 backdrop-blur-sm relative z-10">
                <div className="size-20 rounded-3xl bg-gradient-to-tr from-yellow-600 to-orange-600 mx-auto flex items-center justify-center shadow-2xl shadow-yellow-500/20 mb-6">
                    <CheckCircle2 className="size-8 text-white" />
                </div>

                <div className="space-y-4 max-w-md">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                        <Clock className="size-3 text-yellow-500" />
                        <span className="text-xs font-medium text-yellow-500">En révision</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Vérification finale</h2>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        Votre site est presque prêt ! Notre équipe effectue les dernières vérifications de qualité avant la livraison.
                    </p>
                </div>

                {/* Background Grid */}
                <div
                    className="absolute inset-0 z-[-1] hidden dark:block pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(to right, #1f1f23 1px, transparent 1px), linear-gradient(to bottom, #1f1f23 1px, transparent 1px)`,
                        backgroundSize: '20px 20px',
                        maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)'
                    }}
                />
            </div>
        );
    }

    // COMPLETED STATE - Site is ready!
    if (previewState === 'building' && projectData?.status === 'COMPLETED') {
        return (
            <div className="h-full flex flex-col bg-[#080808] relative z-10">
                {/* Background Grid */}
                <div
                    className="absolute inset-0 z-0 hidden dark:block pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(to right, #1f1f23 1px, transparent 1px), linear-gradient(to bottom, #1f1f23 1px, transparent 1px)`,
                        backgroundSize: '20px 20px',
                        maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)'
                    }}
                />

                {/* Toolbar */}
                <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#050505]/50 backdrop-blur-xl relative z-20">
                    <div className="flex items-center gap-4">
                        <div className="flex bg-white/5 p-1 rounded-lg">
                            <Button variant="ghost" size="icon" className="size-8 rounded-md text-zinc-400 hover:text-white bg-white/5">
                                <Monitor className="size-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="size-8 rounded-md text-zinc-400 hover:text-white">
                                <Tablet className="size-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="size-8 rounded-md text-zinc-400 hover:text-white">
                                <Smartphone className="size-4" />
                            </Button>
                        </div>
                        <div className="h-4 w-px bg-white/10 mx-2" />
                        <span className="text-xs font-medium text-zinc-500">v1.0.0 — Prêt</span>
                    </div>

                    <div className="flex items-center gap-3">
                        {projectData.deployUrl && (
                            <Button
                                className="h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs font-bold gap-2 px-4 shadow-lg shadow-emerald-900/20"
                                onClick={() => window.open(projectData.deployUrl, '_blank')}
                            >
                                <CheckCircle2 className="size-3.5" />
                                Voir le site en ligne
                            </Button>
                        )}
                        {projectData.previewUrl && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-8 rounded-lg border-white/5 bg-white/5 hover:bg-white/10"
                                onClick={() => window.open(projectData.previewUrl, '_blank')}
                            >
                                <ExternalLink className="size-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Simulated Device Frame */}
                <div className="flex-1 p-6 md:p-12 overflow-hidden flex items-center justify-center relative z-10">
                    <div className="w-full h-full max-w-5xl rounded-2xl border border-white/10 bg-[#0c0c0c] shadow-2xl shadow-black overflow-hidden flex flex-col">
                        <div className="h-8 bg-[#111] border-b border-white/5 flex items-center gap-2 px-4 shrink-0">
                            <div className="flex gap-1.5">
                                <div className="size-2.5 rounded-full bg-red-500/20 border border-red-500/30" />
                                <div className="size-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
                                <div className="size-2.5 rounded-full bg-green-500/20 border border-green-500/30" />
                            </div>
                            <div className="flex-1 flex justify-center">
                                <div className="bg-white/5 px-4 py-0.5 rounded text-[10px] text-zinc-500 font-medium tracking-tight">
                                    votre-site.gnata.app
                                </div>
                            </div>
                        </div>

                        {/* The "Site" Preview */}
                        <div className="flex-1 bg-gradient-to-br from-[#151515] to-[#0d0d0d] overflow-y-auto custom-scrollbar relative group">
                            <div className="p-12 text-center space-y-8">
                                <div className="size-20 rounded-3xl bg-gradient-to-tr from-purple-600 to-blue-600 mx-auto flex items-center justify-center shadow-2xl shadow-purple-500/20">
                                    <Rocket className="size-8 text-white" />
                                </div>
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                        <CheckCircle2 className="size-3 text-emerald-500" />
                                        <span className="text-xs font-medium text-emerald-500">Site terminé !</span>
                                    </div>
                                    <h1 className="text-4xl font-black italic tracking-tighter text-white">VOTRE SITE EST PRÊT</h1>
                                    <p className="text-zinc-400 max-w-sm mx-auto text-sm leading-relaxed">
                                        Félicitations ! Votre site a été créé par notre expert Vibe Coder.
                                        Vous pouvez maintenant le visiter ou demander des modifications.
                                    </p>
                                </div>
                                <div className="flex justify-center gap-4">
                                    {projectData.deployUrl && (
                                        <Button
                                            className="bg-purple-600 hover:bg-purple-700"
                                            onClick={() => window.open(projectData.deployUrl, '_blank')}
                                        >
                                            Visiter le site
                                        </Button>
                                    )}
                                    <Button variant="outline" className="border-white/10">
                                        Demander des modifications
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Legacy preview state (fallback)
    if (previewState === 'preview') {
        setPreviewState('building');
    }

    return null;
}
