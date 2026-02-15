"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Star, ShieldCheck, CreditCard, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

const ACCOUNT_URL = process.env.NEXT_PUBLIC_ACCOUNT_URL || "https://account.wozif.com";

export default function Hero() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();

    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <section ref={targetRef} className="relative min-h-[110vh] flex items-center justify-center pt-20 overflow-hidden bg-white">

            {/* Background Kinetic Art */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <motion.div
                    style={{ y: y1, opacity }}
                    className="absolute top-[-10%] left-[-5%] w-[60%] h-[80%] bg-indigo-500/5 blur-[120px] rounded-full"
                />
                <motion.div
                    style={{ y: y2, opacity }}
                    className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[70%] bg-emerald-500/5 blur-[120px] rounded-full"
                />

                {/* Floating Mesh Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>

            <div className="relative z-10 container mx-auto px-6 lg:px-12">
                <div className="flex flex-col items-center text-center">

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="group relative cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative flex items-center gap-2 px-6 py-2 rounded-full bg-slate-900/[0.03] border border-slate-900/10 text-slate-600 text-[12px] font-bold uppercase tracking-[0.3em] mb-12 backdrop-blur-sm overflow-hidden group">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                            L&apos;AFRIQUE DE DEMAIN SE BÂTIT ICI
                            <div className="absolute inset-y-0 left-0 w-1/2 bg-white/20 -skew-x-12 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000" />
                        </div>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="relative"
                    >
                        <h1 className="text-6xl md:text-8xl lg:text-[140px] leading-[0.9] font-[900] text-slate-950 tracking-[-0.06em] max-w-6xl mb-12">
                            L&apos;orchestration <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 relative">
                                souveraine.
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ delay: 1, duration: 1 }}
                                    className="absolute -bottom-2 left-0 h-[8px] bg-indigo-100/50 -z-10 rounded-full"
                                />
                            </span>
                        </h1>
                    </motion.div>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-lg md:text-2xl text-slate-500 max-w-2xl leading-relaxed mb-16 font-medium px-4"
                    >
                        Wozif automatise vos opérations techniques pour que vous puissiez vous concentrer sur ce qui compte vraiment : <b className="text-slate-900">votre croissance.</b>
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="flex flex-col sm:flex-row items-center gap-8"
                    >
                        <Link
                            href={`${ACCOUNT_URL}/auth/register`}
                            className="relative group px-12 py-6 bg-slate-950 rounded-2xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.3)]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="relative flex items-center gap-3 text-sm font-black text-white uppercase tracking-widest">
                                Démarrer l&apos;expérience
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                            </span>
                        </Link>

                        <button className="group flex items-center gap-4 text-sm font-black text-slate-900 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                            <div className="relative w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center transition-all group-hover:border-indigo-100 group-hover:bg-indigo-50 shadow-sm">
                                <Play className="w-5 h-5 fill-slate-900 group-hover:fill-indigo-600 text-transparent relative z-10 ml-1" />
                                <div className="absolute inset-0 rounded-full border border-indigo-200 animate-ping opacity-0 group-hover:opacity-40" />
                            </div>
                            Voir le futur
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Floating Premium Badges */}
            <div className="hidden xl:block absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    style={{ y: useTransform(scrollY, [0, 800], [0, -300]) }}
                    className="absolute top-[25%] left-[8%] bg-white/70 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border border-white/50 animate-float"
                >
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                            <ShieldCheck className="w-7 h-7 text-emerald-600" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Infrastructure</div>
                            <div className="text-lg font-black text-slate-950">100% Souveraine</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    style={{ y: useTransform(scrollY, [0, 800], [0, 200]) }}
                    className="absolute bottom-[20%] right-[10%] bg-white/70 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border border-white/50 animate-float [animation-delay:2s]"
                >
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                            <CreditCard className="w-7 h-7 text-indigo-600" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Performance</div>
                            <div className="text-lg font-black text-slate-950">99.9% Uptime</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
