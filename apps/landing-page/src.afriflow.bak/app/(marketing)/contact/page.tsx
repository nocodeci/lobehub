"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Zap, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
    return (
        <main className="bg-[#020202] min-h-screen selection:bg-primary selection:text-black font-sans">
            {/* Navigation Floating Pill (Copied for Consistency) */}
            <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
                <div className="flex items-center justify-between gap-4 bg-black/60 backdrop-blur-xl border border-white/10 p-2 pl-6 rounded-full shadow-2xl w-full max-w-4xl">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center">
                                <Zap className="h-5 w-5 fill-current" />
                            </div>
                            <span className="text-sm font-bold text-white">AfriFlow</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-1 text-sm font-medium text-zinc-400">
                        <Link href="/pricing" className="px-4 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/20">Tarification</Link>
                        <Link href="/docs" className="px-4 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/20">Documentation</Link>
                        <Link href="/integration" className="px-4 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/20">Intégration</Link>
                        <Link href="/coverage" className="px-4 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/20">Couverture</Link>
                        <Link href="/contact" className="px-4 py-1.5 rounded-full bg-white/10 text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/20">Contact</Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href="/auth/login">
                            <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-white/10 rounded-full h-10 px-6 hidden sm:flex">
                                Connexion
                            </Button>
                        </Link>
                        <Link href="/auth/register">
                            <Button className="rounded-full bg-white text-black hover:bg-zinc-200 h-10 px-6 font-medium">
                                S'inscrire
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-48 pb-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#020202]">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/20 rounded-full blur-[120px] opacity-20" />
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                            Contactez notre équipe
                        </h1>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                            Une question sur nos tarifs, nos intégrations ou un besoin spécifique ? <br />
                            Nos experts en paiement sont là pour vous aider.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="pb-32 relative">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">

                        {/* Contact Info Cards */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors duration-300">
                                <div className="h-12 w-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-6">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Support Commercial</h3>
                                <p className="text-zinc-400 mb-6">Pour les entreprises souhaitant intégrer AfriFlow.</p>
                                <a href="mailto:sales@afriflow.com" className="text-white font-medium hover:text-blue-400 transition-colors flex items-center gap-2">
                                    sales@afriflow.com <ArrowRight className="h-4 w-4" />
                                </a>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors duration-300">
                                <div className="h-12 w-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                                    <Zap className="h-6 w-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Support Technique</h3>
                                <p className="text-zinc-400 mb-6">Pour les développeurs et problèmes d'intégration.</p>
                                <a href="mailto:dev@afriflow.com" className="text-white font-medium hover:text-emerald-400 transition-colors flex items-center gap-2">
                                    dev@afriflow.com <ArrowRight className="h-4 w-4" />
                                </a>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors duration-300">
                                <div className="h-12 w-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Siège Social</h3>
                                <p className="text-zinc-400 mb-6">Abidjan, Côte d'Ivoire <br /> Cocody, Riviera 3</p>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 md:p-10 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

                            <h3 className="text-2xl font-bold text-white mb-6">Envoyez-nous un message</h3>

                            <form className="space-y-6 relative z-10">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">Nom complet</label>
                                        <Input className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 h-12 rounded-xl focus-visible:ring-primary" placeholder="Jean Kouassi" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">Email professionnel</label>
                                        <Input className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 h-12 rounded-xl focus-visible:ring-primary" placeholder="jean@entreprise.com" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400">Sujet</label>
                                    <Input className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 h-12 rounded-xl focus-visible:ring-primary" placeholder="Intégration API..." />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400">Message</label>
                                    <textarea
                                        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 rounded-xl p-4 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#0A0A0A] resize-y text-sm"
                                        placeholder="Comment pouvons-nous vous aider ?"
                                    />
                                </div>

                                <Button className="w-full h-14 rounded-full text-lg font-bold bg-white text-black hover:bg-zinc-200">
                                    Envoyer le message
                                </Button>
                            </form>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Simple Footer (Consistent) */}
            <footer className="py-12 border-t border-white/5 relative bg-black">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-zinc-500 text-sm">
                    <p>© 2026 Wozif. Tous droits réservés.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
                        <a href="#" className="hover:text-white transition-colors">Conditions</a>
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                    </div>
                </div>
            </footer>
        </main>
    );
}
