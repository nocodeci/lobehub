"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ConnectShowcase from "@/components/EcosystemAnimation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

const CONNECT_URL = process.env.NEXT_PUBLIC_CONNECT_URL || "https://app.connect.wozif.com";

const plans = [
    {
        name: "Gratuit",
        price: "0",
        desc: "Pour découvrir Connect",
        features: ["1 agent IA", "Modèles de base", "Chat illimité", "Communauté"],
        cta: "Commencer gratuitement",
        popular: false,
    },
    {
        name: "Starter",
        price: "5 000",
        currency: "FCFA",
        desc: "Pour les indépendants",
        features: ["3 agents IA", "WhatsApp (1 compte)", "Modèles avancés", "Support email"],
        cta: "Choisir Starter",
        popular: false,
    },
    {
        name: "Business",
        price: "25 000",
        currency: "FCFA",
        desc: "Pour les entreprises",
        features: ["50 agents IA", "Groupes d'agents", "WhatsApp (5 comptes)", "Outils & Plugins", "Base de connaissances", "Support prioritaire"],
        cta: "Choisir Business",
        popular: true,
    },
];

export default function HomePage() {
    return (
        <main className="min-h-screen bg-white">
            <Header />
            <Hero />

            {/* Connect Product Showcase */}
            <ConnectShowcase />

            {/* Pricing Section */}
            <section id="pricing" className="py-32 bg-[#f8fbff] relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                <div className="container mx-auto px-6 lg:px-12">
                    <div className="text-center mb-20">
                        <span className="text-indigo-600 font-black tracking-[0.3em] uppercase text-xs mb-4 block">
                            Tarification
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter mb-6 leading-[0.9]">
                            Simple et transparent.
                        </h2>
                        <p className="text-xl text-slate-500 max-w-xl mx-auto font-medium">
                            Choisissez le plan qui correspond à vos besoins. Évoluez à tout moment.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {plans.map((plan, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`relative p-10 rounded-[2.5rem] border transition-all ${
                                    plan.popular
                                        ? "bg-slate-950 border-slate-800 text-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] scale-[1.03]"
                                        : "bg-white border-slate-100 hover:border-indigo-100 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]"
                                }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em]">
                                        Populaire
                                    </div>
                                )}
                                <h3 className={`text-lg font-black uppercase tracking-widest mb-2 ${plan.popular ? "text-indigo-400" : "text-indigo-600"}`}>
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className={`text-5xl font-black ${plan.popular ? "text-white" : "text-slate-950"}`}>
                                        {plan.price}
                                    </span>
                                    {plan.currency && (
                                        <span className={`text-sm font-bold ${plan.popular ? "text-white/50" : "text-slate-400"}`}>
                                            {plan.currency}/mois
                                        </span>
                                    )}
                                </div>
                                <p className={`text-sm font-medium mb-8 ${plan.popular ? "text-white/60" : "text-slate-500"}`}>
                                    {plan.desc}
                                </p>
                                <ul className="space-y-3 mb-10">
                                    {plan.features.map((f, j) => (
                                        <li key={j} className={`flex items-center gap-3 text-sm font-medium ${plan.popular ? "text-white/80" : "text-slate-600"}`}>
                                            <Check className={`w-4 h-4 flex-shrink-0 ${plan.popular ? "text-indigo-400" : "text-emerald-500"}`} />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href={CONNECT_URL}
                                    className={`block text-center py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                                        plan.popular
                                            ? "bg-white text-slate-950 hover:bg-indigo-50"
                                            : "bg-slate-950 text-white hover:bg-indigo-600"
                                    }`}
                                >
                                    {plan.cta}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About / CTA Section */}
            <section id="about" className="py-24 bg-white">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 p-12 lg:p-20 rounded-[4rem] bg-slate-950 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />

                        <div className="relative z-10 max-w-xl">
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter leading-none">
                                L&apos;IA au service de <br />l&apos;Afrique.
                            </h2>
                            <p className="text-slate-400 text-lg font-medium mb-10">
                                Wozif construit l&apos;écosystème technologique qui permet aux entreprises africaines d&apos;exploiter la puissance de l&apos;intelligence artificielle. Connect est notre premier produit — et ce n&apos;est que le début.
                            </p>
                            <Link
                                href={CONNECT_URL}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-950 font-black rounded-2xl hover:bg-indigo-50 transition-colors uppercase tracking-widest text-sm group"
                            >
                                Essayer Connect
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>

                        <div className="relative z-10 grid grid-cols-2 gap-6 w-full md:w-auto">
                            {[
                                { value: "5+", label: "Modèles IA" },
                                { value: "24/7", label: "Agents actifs" },
                                { value: "1 min", label: "Déploiement" },
                                { value: "∞", label: "Conversations" },
                            ].map((stat) => (
                                <div key={stat.label} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                                    <div className="text-xs font-bold text-white/40 uppercase tracking-widest">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
