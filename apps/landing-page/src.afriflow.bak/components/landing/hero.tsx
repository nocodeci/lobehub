"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Zap } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 200]);
    const rotate = useTransform(scrollY, [0, 500], [0, 20]);

    return (
        <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[#020202]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-30 animate-pulse" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] opacity-20" />

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            <div className="container mx-auto relative z-10 px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-8"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-emerald-400"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Nouvelle Génération de Paiements
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                            Orchestrez vos flux financiers avec <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary to-purple-400 animate-gradient-x">
                                une précision absolue.
                            </span>
                        </h1>

                        <p className="text-xl text-zinc-400 max-w-xl leading-relaxed">
                            AfriFlow unifie vos passerelles de paiement, automatise vos réconciliations et sécurise chaque transaction. L'infrastructure financière conçue pour l'Afrique de demain.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="/auth/register">
                                <Button size="lg" className="h-14 px-8 rounded-full bg-white text-black hover:bg-zinc-200 transition-all text-base font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-105">
                                    Commencer maintenant
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Button variant="outline" size="lg" className="h-14 px-8 rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 backdrop-blur-sm transition-all text-base font-medium">
                                <Play className="ml-2 h-4 w-4 mr-2 fill-current" />
                                Démo interactive
                            </Button>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-zinc-500 pt-8">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-8 w-8 rounded-full border-2 border-[#020202] bg-zinc-800" />
                                ))}
                            </div>
                            <p>Rejoint par +500 entreprises leaders</p>
                        </div>
                    </motion.div>

                    {/* Complex 3D Visual */}
                    <motion.div style={{ y, rotate }} className="relative hidden lg:block perspective-1000">
                        <div className="relative w-full aspect-square max-w-[600px] mx-auto">
                            {/* Main Floating Card */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
                                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                                transition={{ duration: 1, delay: 0.4, type: "spring" }}
                                className="absolute inset-0 bg-gradient-to-br from-zinc-900/90 to-black/90 rounded-[30px] border border-white/10 p-6 backdrop-blur-xl shadow-2xl z-20"
                            >
                                {/* Mock UI Header */}
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="h-3 w-3 rounded-full bg-red-500/50" />
                                        <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                                        <div className="h-3 w-3 rounded-full bg-green-500/50" />
                                    </div>
                                    <div className="h-2 w-20 bg-white/10 rounded-full" />
                                </div>
                                {/* Mock Graph */}
                                <div className="h-full w-full flex items-end justify-between gap-1.5 pb-8 px-4">
                                    {[
                                        { name: 'Wave', height: 40, logo: '/logos/wave.svg' },
                                        { name: 'Orange', height: 70, logo: '/logos/orange-money.svg' },
                                        { name: 'MTN', height: 45, logo: '/logos/mtn-momo.svg' },
                                        { name: 'Airtel', height: 90, logo: '/logos/airtel-money.svg' },
                                        { name: 'M-Pesa', height: 60, logo: '/logos/m-pesa.svg' },
                                        { name: 'PayDunya', height: 80, logo: '/logos/paydunya.png' },
                                        { name: 'PawaPay', height: 50, logo: '/logos/pawapay.png' },
                                        { name: 'Moov', height: 95, logo: '/logos/moov-money.svg' },
                                        { name: 'Djamo', height: 85, logo: '/logos/djamo.svg' },
                                    ].map((method, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${method.height}%` }}
                                            transition={{ duration: 1, delay: 0.8 + (i * 0.1) }}
                                            className="w-full bg-gradient-to-t from-primary/20 to-primary rounded-t-lg relative group"
                                        >
                                            {/* Floating Logo */}
                                            <div
                                                className="absolute -top-8 left-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-white flex items-center justify-center p-1 shadow-lg opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]"
                                                style={{ animationDelay: `${1.5 + (i * 0.1)}s` }}
                                            >
                                                <img src={method.logo} alt={method.name} className="h-full w-full object-contain" />
                                            </div>

                                            {/* Tooltip */}
                                            <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none border border-white/10">
                                                {method.name}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Floating Elements: Transaction Notification */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -right-12 top-20 bg-[#1E293B] border border-white/10 p-4 rounded-2xl z-30 flex items-center gap-4 w-56 shadow-2xl backdrop-blur-md"
                            >
                                <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center p-1 shadow-lg shrink-0">
                                    <img src="/logos/wave.svg" alt="Wave" className="h-full w-full object-contain" />
                                </div>
                                <div>
                                    <div className="text-white font-bold text-lg leading-none mb-1">+ 25.000 F</div>
                                    <div className="text-xs text-sky-400 font-medium flex items-center gap-1">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Payé via Wave
                                    </div>
                                </div>
                            </motion.div>

                            {/* Background Elements */}
                            <div className="absolute inset-0 bg-primary/20 blur-[100px] -z-10 rounded-full" />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Explorer</div>
                <div className="w-[1px] h-12 bg-gradient-to-b from-zinc-500 to-transparent" />
            </motion.div>
        </section>
    );
}
