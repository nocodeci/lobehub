"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ProductsShowcase from "@/components/EcosystemAnimation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, RefreshCw, User, Fingerprint } from "lucide-react";

const ACCOUNT_URL = process.env.NEXT_PUBLIC_ACCOUNT_URL || "https://account.wozif.com";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-white">
            <Header />
            <Hero />

            {/* Products */}
            <ProductsShowcase />

            {/* Account Section — like Axazara */}
            <section className="py-24 bg-slate-50">
                <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-950 tracking-tight mb-4">
                                    Un seul compte pour tout l&apos;écosystème.
                                </h2>
                                <p className="text-lg text-slate-500 leading-relaxed mb-8">
                                    Votre compte Wozif vous donne accès à tous nos produits et services. Un email, un mot de passe — c&apos;est tout ce qu&apos;il vous faut.
                                </p>
                                <div className="flex items-center gap-4">
                                    <Link
                                        href={`${ACCOUNT_URL}/auth/register`}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-950 text-white text-[14px] font-semibold rounded-full hover:bg-slate-800 transition-colors"
                                    >
                                        Créer un compte
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        href={`${ACCOUNT_URL}/auth/login`}
                                        className="text-[14px] font-semibold text-slate-600 hover:text-slate-950 transition-colors"
                                    >
                                        Se connecter
                                    </Link>
                                </div>
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { icon: Shield, title: "Sécurité intégrée", desc: "Authentification à deux facteurs et chiffrement de bout en bout." },
                                { icon: User, title: "Expérience personnalisée", desc: "Accédez à des offres et fonctionnalités adaptées à votre profil." },
                                { icon: RefreshCw, title: "Infos synchronisées", desc: "Mettez à jour une fois, c'est appliqué partout automatiquement." },
                                { icon: Fingerprint, title: "Contrôle total", desc: "Gérez vos données, appareils connectés et préférences de confidentialité." },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08 }}
                                    className="p-6 rounded-2xl bg-white border border-slate-100"
                                >
                                    <item.icon className="w-5 h-5 text-slate-400 mb-3" />
                                    <h4 className="text-[15px] font-semibold text-slate-950 mb-1">{item.title}</h4>
                                    <p className="text-[13px] text-slate-500 leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Partners / Ecosystem Section */}
            <section className="py-24 bg-white">
                <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-950 tracking-tight mb-4">
                            Construit pour l&apos;Afrique.
                        </h2>
                        <p className="text-lg text-slate-500 max-w-xl mx-auto">
                            Wozif développe des solutions pensées pour le contexte africain — accessibles, performantes et évolutives.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: "Infrastructure locale", desc: "Nos services sont optimisés pour les réalités du continent : connectivité, langues, usages mobiles." },
                            { title: "Open & Interopérable", desc: "Nos produits s'intègrent facilement avec vos outils existants grâce à des APIs ouvertes et documentées." },
                            { title: "Support réactif", desc: "Une équipe basée en Afrique, disponible pour vous accompagner dans votre langue et votre fuseau horaire." },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors"
                            >
                                <h4 className="text-lg font-semibold text-slate-950 mb-2">{item.title}</h4>
                                <p className="text-[15px] text-slate-500 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
