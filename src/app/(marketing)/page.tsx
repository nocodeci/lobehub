"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { VisualShowcase } from "@/components/landing/showcase";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CheckoutDemo } from "@/components/landing/checkout-demo";
import { WhatsAppRetargeting } from "@/components/landing/whatsapp-retargeting";
import { useSession, signOut } from "next-auth/react";

export default function LandingPage() {
    const { data: session, status } = useSession();
    const isLoading = status === "loading";
    const isAuthenticated = !!session?.user;

    return (
        <main className="bg-[#191919] min-h-screen selection:bg-primary selection:text-black">
            {/* Navigation Overlay */}
            {/* Navigation Floating Pill */}
            <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
                <div className="flex items-center justify-between gap-4 bg-black/60 backdrop-blur-xl border border-white/10 p-2 pl-6 rounded-full shadow-2xl w-full max-w-4xl">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center">
                            <Zap className="h-5 w-5 fill-current" />
                        </div>
                        <span className="text-sm font-bold text-white">AfriFlow</span>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-1 text-sm font-medium text-zinc-400">
                        <Link href="/pricing" className="px-4 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/20">Tarification</Link>
                        <Link href="/docs" className="px-4 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/20">Documentation</Link>
                        <Link href="/integration" className="px-4 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/20">Intégration</Link>
                        <Link href="/coverage" className="px-4 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/20">Couverture</Link>
                        <Link href="/contact" className="px-4 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/20">Contact</Link>
                    </div>

                    <div className="flex items-center gap-2">
                        {isLoading ? (
                            <div className="h-10 w-24 bg-white/10 rounded-full animate-pulse" />
                        ) : isAuthenticated ? (
                            <>
                                <Link href="/dashboard">
                                    <Button className="rounded-full bg-white text-black hover:bg-zinc-200 h-10 px-6 font-medium">
                                        <LayoutDashboard className="h-4 w-4 mr-2" />
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    className="text-zinc-300 hover:text-white hover:bg-white/10 rounded-full h-10 px-4 hidden sm:flex"
                                    onClick={() => signOut()}
                                >
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <Hero />
            <VisualShowcase />
            <CheckoutDemo />
            <HowItWorks />
            <Features />
            <WhatsAppRetargeting />

            {/* CTA Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/10 blur-[150px] pointer-events-none" />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter">
                            Prêt à redéfinir <br />
                            vos standards ?
                        </h2>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
                            Rejoignez les entreprises qui construisent le futur financier de l'Afrique avec AfriFlow.
                        </p>
                        <Link href="/auth/register">
                            <Button size="lg" className="h-16 px-10 rounded-full text-lg font-bold bg-white text-black hover:bg-zinc-200 hover:scale-105 transition-all shadow-2xl shadow-white/20">
                                Commencer gratuitement
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Simple Footer */}
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
