"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import EcosystemAnimation from "@/components/EcosystemAnimation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Layers, Zap, Shield, Rocket, Globe, ZapIcon } from "lucide-react";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-white">
            <Header />
            <Hero />

            {/* Ecosystem Transition */}
            <div id="products">
                <EcosystemAnimation />
            </div>

            {/* High-End Features Grid */}
            <section className="py-32 bg-[#f8fbff] relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                <div className="container mx-auto px-6 lg:px-12">
                    <div className="max-w-3xl mb-24">
                        <span className="text-indigo-600 font-black tracking-[0.3em] uppercase text-xs mb-4 block">
                            Pourquoi Wozif ?
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter mb-8 leading-[0.9]">
                            L&apos;infrastructure qui <br /> redéfinit les possibles.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: Shield, title: "Sécurité Militaire", desc: "Chiffrement de bout en bout et conformité PCI-DSS de niveau 1 pour toutes vos transactions." },
                            { icon: Rocket, title: "Déploiement Éclair", desc: "Passez de l&apos;idée à la production en quelques minutes grâce à nos SDKs et APIs intuitifs." },
                            { icon: Globe, title: "Scale Continentale", desc: "Une infrastructure pensée pour l&apos;échelle africaine, capable de gérer des millions de requêtes." },
                            { icon: ZapIcon, title: "Performance Latence", desc: "Temps de réponse ultra-rapides grâce à nos serveurs stratégiquement positionnés." },
                            { icon: Layers, title: "Intégration Totale", desc: "Connectez vos outils existants (ERP, CRM, Comptabilité) en un clin d&apos;œil." },
                            { icon: Rocket, title: "Support Expert", desc: "Une équipe dédiée disponible 24/7 pour vous accompagner dans votre croissance." }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-10 rounded-[2.5rem] bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] transition-all"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 group-hover:bg-indigo-50 group-hover:scale-110 transition-all">
                                    <feature.icon className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
                                </div>
                                <h4 className="text-xl font-black text-slate-950 mb-4 uppercase tracking-tight">{feature.title}</h4>
                                <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Social Proof / Trust Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 p-12 lg:p-20 rounded-[4rem] bg-slate-950 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />

                        <div className="relative z-10 max-w-xl">
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter leading-none">
                                Prêt à bâtir l&apos;avenir africain ?
                            </h2>
                            <p className="text-slate-400 text-lg font-medium mb-10">
                                Rejoignez plus de 500 entreprises qui utilisent déjà Wozif pour scaler leurs opérations.
                            </p>
                            <Link
                                href="https://account.wozif.com/register"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-950 font-black rounded-2xl hover:bg-indigo-50 transition-colors uppercase tracking-widest text-sm"
                            >
                                Commencer l&apos;aventure
                            </Link>
                        </div>

                        <div className="relative z-10 grid grid-cols-2 gap-4 w-full md:w-auto">
                            {[1, 2, 3, 4].map((n) => (
                                <div key={n} className="h-20 w-32 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer">
                                    <div className="font-black text-white text-xs tracking-widest uppercase opacity-50">Partner {n}</div>
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
