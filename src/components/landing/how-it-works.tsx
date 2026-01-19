"use client";

import { motion } from "framer-motion";
import { ArrowRight, GitMerge, RefreshCw, Wallet, Zap } from "lucide-react";

export function HowItWorks() {
    const steps = [
        {
            icon: GitMerge,
            title: "Connectez",
            description: "Intégrez notre SDK unique en quelques minutes. Accédez instantanément à +50 moyens de paiement."
        },
        {
            icon: RefreshCw,
            title: "Orchestrez",
            description: "Configurez vos règles de routage. Optimisez chaque transaction pour réduire les échecs et les frais."
        },
        {
            icon: Wallet,
            title: "Encaissez",
            description: "Recevez vos fonds sur un compte unifié. Réconciliez automatiquement vos entrées et sorties."
        }
    ];

    return (
        <section className="py-24 bg-[#020202] border-t border-white/5 relative">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tighter">
                            Un flux de travail <br />
                            <span className="text-zinc-500">conçu pour la vitesse.</span>
                        </h2>
                        <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                            Ne perdez plus de temps avec des intégrations multiples. AfriFlow centralise la complexité pour que vous puissiez vous concentrer sur votre croissance.
                        </p>

                        <div className="space-y-6 pt-4">
                            {steps.map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2 }}
                                    className="flex gap-6 group"
                                >
                                    <div className="relative">
                                        <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-primary/20 group-hover:border-primary/50 transition-colors duration-300">
                                            <step.icon className="h-5 w-5 text-white group-hover:text-primary transition-colors" />
                                        </div>
                                        {i !== steps.length - 1 && (
                                            <div className="absolute top-12 left-6 w-px h-12 bg-white/10 group-hover:bg-primary/20 transition-colors delay-100" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                                        <p className="text-zinc-500 leading-relaxed">{step.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="relative h-[600px] rounded-3xl border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

                        {/* 
                            STATIC LAYOUT - "Connect & Process" 
                            No spinning. Clear "Top Down" hierarchy.
                        */}
                        <div className="relative w-full max-w-md h-[500px] flex flex-col items-center justify-between py-10">

                            {/* 1. INPUT LAYER (Methods) */}
                            <div className="relative w-full flex justify-center gap-6 z-10">
                                {/* Wave */}
                                <div className="flex flex-col items-center gap-2">
                                    <div className="h-12 w-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-lg shadow-sky-500/10 overflow-hidden">
                                        <img src="/logos/wave.svg" alt="Wave" className="h-8 w-auto object-contain" />
                                    </div>
                                    {/* Connection Line */}
                                    <motion.div
                                        className="absolute top-14 left-1/2 w-[2px] h-[100px] bg-gradient-to-b from-sky-500/50 to-transparent -translate-x-32 origin-top"
                                        style={{ transform: "rotate(25deg)" }}
                                    />
                                </div>

                                {/* Orange Money (Center) */}
                                <div className="flex flex-col items-center gap-2 -mt-4">
                                    <div className="h-14 w-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-lg shadow-orange-500/10 z-20 overflow-hidden">
                                        <img src="/logos/orange-money.svg" alt="Orange" className="h-10 w-auto object-contain" />
                                    </div>

                                    {/* Active Packet Animation */}
                                    <motion.div
                                        className="absolute top-12 left-1/2 w-[2px] h-[120px] bg-[#1a1a1a] -z-10"
                                    >
                                        <motion.div
                                            className="w-full bg-gradient-to-b from-orange-500 to-emerald-500"
                                            animate={{ height: ["0%", "100%", "0%"], top: ["0%", "0%", "100%"] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            style={{ position: "absolute", width: "100%" }}
                                        />
                                    </motion.div>
                                </div>

                                {/* MTN */}
                                <div className="flex flex-col items-center gap-2">
                                    <div className="h-12 w-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-lg shadow-yellow-500/10 overflow-hidden">
                                        <img src="/logos/mtn-momo.svg" alt="MTN" className="h-8 w-auto object-contain" />
                                    </div>
                                    <motion.div
                                        className="absolute top-14 left-1/2 w-[2px] h-[100px] bg-gradient-to-b from-yellow-500/50 to-transparent translate-x-32 origin-top"
                                        style={{ transform: "rotate(-25deg)" }}
                                    />
                                </div>
                            </div>


                            {/* 2. PROCESSING LAYER (Center Hub + Gateways) */}
                            <div className="relative flex items-center justify-center w-full my-8">

                                {/* Gateway Left (PayDunya) */}
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center shadow-lg overflow-hidden">
                                        <img src="/logos/paydunya.png" alt="PayDunya" className="h-5 w-auto object-contain" />
                                    </div>
                                    <div className="h-[1px] w-12 bg-white/10" />
                                </div>

                                {/* CENTER HUB (User's Design - With Static Background) */}
                                <div className="relative z-20">
                                    <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse" />
                                    <div className="h-24 w-24 rounded-2xl bg-[#0A0A0A] backdrop-blur-md border border-emerald-500/50 flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.3)]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap h-10 w-10 text-emerald-500 fill-current" aria-hidden="true">
                                            <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
                                        </svg>
                                    </div>
                                </div>

                                {/* Gateway Right (PawaPay) */}
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 flex-row-reverse">
                                    <div className="h-10 w-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center shadow-lg overflow-hidden">
                                        <img src="/logos/pawapay.png" alt="PawaPay" className="h-4 w-auto object-contain" />
                                    </div>
                                    <div className="h-[1px] w-12 bg-white/10" />
                                </div>
                            </div>


                            {/* 3. SETTLEMENT LAYER (Merchant) */}
                            <div className="relative top-0">
                                {/* Flow Line */}
                                <motion.div
                                    className="absolute bottom-full left-1/2 -translate-x-1/2 w-[2px] h-16 bg-gradient-to-b from-emerald-500/50 to-emerald-500"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />

                                <div className="flex flex-col items-center gap-3">
                                    <div className="h-16 w-16 rounded-2xl bg-[#0A0A0A] border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                                        <span className="text-2xl font-bold text-emerald-500">$</span>
                                    </div>
                                    <span className="text-xs font-medium text-emerald-500/70 bg-emerald-500/10 px-2 py-0.5 rounded-full">Marchand</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
