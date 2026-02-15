"use client";

import { useScroll, useTransform, motion, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Zap, Globe, ShieldCheck, CreditCard, Layout, Plus, Check } from "lucide-react";
import Logo from "./Logo";

export default function EcosystemAnimation() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const pathLength = useSpring(scrollYProgress, {
        stiffness: 40,
        damping: 20,
        restDelta: 0.001
    });

    // Transforms for entry/exit
    const opacity = useTransform(scrollYProgress, [0.15, 0.25, 0.85, 0.95], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0.1, 0.3], [0.8, 1]);
    const linesOpacity = useTransform(scrollYProgress, [0.25, 0.45], [0, 0.6]);

    const cards = [
        {
            id: "afriflow",
            title: "AfriFlow",
            subtitle: "Orchestration",
            desc: "Unifiez mobile money, cartes et virements sous une SEULE interface intelligente.",
            color: "blue",
            icon: Zap,
            href: "/products/afriflow",
            position: "left"
        },
        {
            id: "gnata",
            title: "Gnata",
            subtitle: "No-Code",
            desc: "Propulsez votre business en ligne en 1h. E-commerce complet sans complexité technique.",
            color: "emerald",
            icon: Globe,
            href: "/products/gnata",
            position: "right"
        }
    ];

    return (
        <section ref={containerRef} className="relative h-[300vh] bg-white overflow-visible">
            <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">

                {/* Visual Foundation */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-500/[0.02] blur-[150px] rounded-full" />
                </div>

                <div className="relative w-full max-w-7xl mx-auto px-6 flex flex-col items-center">

                    {/* Section Header */}
                    <motion.div
                        style={{ opacity: useTransform(scrollYProgress, [0.1, 0.2], [0, 1]) }}
                        className="text-center mb-24"
                    >
                        <h2 className="text-3xl md:text-5xl font-black text-slate-950 mb-4 tracking-tight leading-none uppercase xl:text-7xl">
                            Un écosystème <br className="md:hidden" /> sans couture.
                        </h2>
                        <div className="h-1 w-24 bg-indigo-600 mx-auto rounded-full" />
                    </motion.div>

                    <div className="relative w-full flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-0">

                        {/* Core SVG Infrastructure */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[400px] pointer-events-none z-0 hidden lg:block">
                            <svg
                                viewBox="0 0 1000 400"
                                className="w-full h-full overflow-visible"
                                preserveAspectRatio="xMidYMid meet"
                            >
                                <defs>
                                    <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#3b82f6" />
                                        <stop offset="100%" stopColor="#6366f1" />
                                    </linearGradient>
                                    <linearGradient id="gradient-green" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#6366f1" />
                                        <stop offset="100%" stopColor="#10b981" />
                                    </linearGradient>
                                    <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="5" result="blur" />
                                        <feComposite in="glow" in2="SourceGraphic" operator="over" />
                                    </filter>
                                </defs>

                                {/* Path Left */}
                                <motion.path
                                    d="M 500 200 Q 350 200, 150 200"
                                    fill="none"
                                    stroke="url(#gradient-blue)"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    style={{ pathLength, opacity: linesOpacity }}
                                    className="transition-all duration-500"
                                    filter={hoveredCard === "afriflow" ? "url(#neon-glow)" : ""}
                                />

                                {/* Path Right */}
                                <motion.path
                                    d="M 500 200 Q 650 200, 850 200"
                                    fill="none"
                                    stroke="url(#gradient-green)"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    style={{ pathLength, opacity: linesOpacity }}
                                    className="transition-all duration-500"
                                    filter={hoveredCard === "gnata" ? "url(#neon-glow)" : ""}
                                />

                                {/* Moving Data Packets */}
                                {hoveredCard && (
                                    <motion.circle r="6" fill={hoveredCard === "afriflow" ? "#3b82f6" : "#10b981"}>
                                        <animateMotion
                                            dur="0.8s"
                                            repeatCount="indefinite"
                                            path={hoveredCard === "afriflow" ? "M 500 200 Q 350 200, 150 200" : "M 500 200 Q 650 200, 850 200"}
                                        />
                                    </motion.circle>
                                )}
                            </svg>
                        </div>

                        {/* Middle Hub */}
                        <div className="order-1 md:order-2 relative z-20">
                            <motion.div
                                style={{ scale, opacity }}
                                className="relative w-32 h-32 md:w-48 md:h-48 rounded-[3rem] bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100 flex items-center justify-center group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white rounded-inherit opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Logo height={80} variant="icon" className="relative z-10" />

                                {/* Orbital Dots */}
                                {[0, 72, 144, 216, 288].map((angle, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 pointer-none"
                                    >
                                        <div
                                            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-200"
                                            style={{ transform: `rotate(${angle}deg) translateY(-80px)` }}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Cards Section */}
                        {cards.map((card) => (
                            <motion.div
                                key={card.id}
                                onMouseEnter={() => setHoveredCard(card.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                                style={{
                                    opacity,
                                    x: useTransform(scrollYProgress, [0.15, 0.35], [card.position === "left" ? -150 : 150, 0])
                                }}
                                className={`order-${card.position === "left" ? 1 : 3} relative z-30 w-full md:w-[320px] lg:w-[400px]`}
                            >
                                <Link href={card.href} className="block group">
                                    <div className="relative p-8 md:p-12 rounded-[3rem] bg-white/70 backdrop-blur-3xl border border-white/50 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 group-hover:scale-[1.03] group-hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] group-hover:bg-white overflow-hidden">

                                        {/* Background Accent */}
                                        <div className={`absolute top-0 right-0 w-32 h-32 bg-${card.color}-500/5 blur-[60px] rounded-full group-hover:bg-${card.color}-500/10 transition-colors`} />

                                        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.8rem] bg-${card.color}-50 flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform duration-500`}>
                                            <card.icon className={`w-8 h-8 md:w-10 md:h-10 text-${card.color}-600`} />
                                        </div>

                                        <div className="mb-2">
                                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] text-${card.color}-600/60`}>
                                                {card.subtitle}
                                            </span>
                                            <h3 className="text-3xl md:text-5xl font-black text-slate-950 mb-4 tracking-tighter">
                                                {card.title}
                                            </h3>
                                        </div>

                                        <p className="text-slate-500 text-lg leading-relaxed mb-8 font-medium">
                                            {card.desc}
                                        </p>

                                        <div className="flex items-center gap-4">
                                            <div className={`flex items-center gap-2 text-sm font-black text-${card.color}-600 uppercase tracking-widest`}>
                                                En savoir plus
                                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Feature Dots (Bottom Indicator) */}
                    <motion.div
                        style={{ opacity: useTransform(scrollYProgress, [0.3, 0.4], [0, 1]) }}
                        className="mt-32 flex items-center gap-4 text-slate-300"
                    >
                        <ShieldCheck className="w-5 h-5 text-indigo-400" />
                        <div className="h-px w-12 bg-slate-200" />
                        <CreditCard className="w-5 h-5 text-indigo-400" />
                        <div className="h-px w-12 bg-slate-200" />
                        <Globe className="w-5 h-5 text-indigo-400" />
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
