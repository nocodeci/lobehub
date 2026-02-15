"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight, CheckCircle2, HelpCircle, Smartphone, CreditCard, ArrowUpRight, ArrowDownLeft, ShieldCheck, Globe, Lock } from "lucide-react";
import Link from "next/link";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { PricingHeroBackground } from "@/components/marketing/pricing-hero-background";

export default function PricingPage() {
    return (
        <main className="bg-[#020202] min-h-screen selection:bg-primary selection:text-black font-sans">
            {/* Unified Header */}
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

                    <div className="hidden md:flex items-center gap-1 text-sm font-medium text-zinc-400">
                        <Link href="/pricing" className="px-4 py-1.5 rounded-full bg-white/10 text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/20">Tarification</Link>
                        <Link href="/docs" className="px-4 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/20">Documentation</Link>
                        <Link href="/integration" className="px-4 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/20">Intégration</Link>
                        <Link href="/coverage" className="px-4 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/20">Couverture</Link>
                        <Link href="/contact" className="px-4 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/20">Contact</Link>
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
            <section className="pt-48 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#020202]">
                    <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[150px] opacity-20" />
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                            Tarifs simples <br />
                            et <span className="text-primary">transparents</span>.
                        </h1>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
                            Ne payez que pour les transactions réussies, nous gagnons de l'argent quand vous le faites.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Pricing Grid */}
            <section className="pb-20 relative z-10">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-8 mb-16">

                        {/* Paiements Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 hover:border-emerald-500/50 transition-all duration-300 relative group overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <ArrowDownLeft className="h-24 w-24 text-emerald-500" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">Paiements</h3>
                            <p className="text-zinc-400 mb-6 min-h-[50px]">Encaissez des paiements de vos clients.</p>

                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-5xl font-bold text-white">$0.01</span>
                            </div>
                            <p className="text-zinc-500 mb-8">par transaction</p>

                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-8 flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-black font-bold text-sm">
                                    150
                                </div>
                                <span className="text-emerald-200 font-medium">transactions gratuites par mois</span>
                            </div>

                            <Button className="w-full rounded-full bg-white text-black hover:bg-zinc-200 font-bold h-12">
                                Commencer maintenant
                            </Button>
                        </motion.div>

                        {/* Transferts Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 hover:border-blue-500/50 transition-all duration-300 relative group overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <ArrowUpRight className="h-24 w-24 text-blue-500" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">Transferts</h3>
                            <p className="text-zinc-400 mb-6 min-h-[50px]">Envoyez de l'argent vers des comptes tiers.</p>

                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-5xl font-bold text-white">$0.01</span>
                            </div>
                            <p className="text-zinc-500 mb-8">par transaction</p>

                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-8 flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                                    100
                                </div>
                                <span className="text-blue-200 font-medium">transactions gratuites par mois</span>
                            </div>

                            <Button variant="outline" className="w-full rounded-full border-white/10 text-white hover:bg-white hover:text-black font-bold h-12">
                                Commencer maintenant
                            </Button>
                        </motion.div>
                    </div>

                    {/* Enterprise Section */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h3 className="text-3xl font-bold text-white mb-4">Personnaliser</h3>
                                <p className="text-lg text-zinc-400 mb-6">
                                    Prenez contact avec nous pour obtenir une tarification personnalisée en fonction de votre volume & de votre modèle d'entreprise.
                                </p>
                                <div className="inline-block bg-primary/20 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
                                    Disponible pour les entreprises traitant plus de 50 000 transactions/mois
                                </div>
                                <Button size="lg" className="rounded-full px-8 bg-white text-black hover:bg-zinc-200 font-bold">
                                    Contacter l'équipe commerciale
                                </Button>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {[
                                    "Offres tarifaires personnalisées",
                                    "Accéder à des fonctionnalités exclusives",
                                    "Remises en fonction du volume",
                                    "Support Premium"
                                ].map((feature) => (
                                    <div key={feature} className="flex items-center gap-3 text-zinc-300">
                                        <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                                        </div>
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dedicated Globe Section */}
            <section className="py-24 bg-[#020202] border-t border-white/5 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                        {/* Text Content - Left */}
                        <div className="lg:w-1/2 z-10">
                            <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                Infrastructure Mondiale
                            </span>

                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                Un réseau financier <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">sans frontières</span>
                            </h2>

                            <p className="text-lg text-zinc-400 mb-8 max-w-xl">
                                Ne vous souciez plus de la complexité des paiements internationaux.
                                Notre infrastructure unifiée gère les devises, les méthodes de paiement locales et la conformité pour vous.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { title: "Multi-devises", desc: "Acceptez 135+ devises et soyez payé dans la vôtre." },
                                    { title: "Règlement Local", desc: "Connexions directes aux réseaux bancaires et Mobile Money." },
                                    { title: "Conformité Automatisée", desc: "Vérifications KYC/KYB et filtrage des fraudes intégrés." },
                                    { title: "Routing Intelligent", desc: "Optimisation automatique pour maximiser l'acceptation." }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col gap-1 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                        <h4 className="text-white font-semibold text-sm">{item.title}</h4>
                                        <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Visual - Right */}
                        <div className="lg:w-1/2 relative h-[500px] lg:h-[600px] w-full rounded-3xl overflow-hidden border border-white/5 bg-white/[0.02]">
                            {/* Masking the edges so the globe blends nicely */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#020202] via-transparent to-transparent z-10 lg:block hidden" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent z-10" />

                            {/* The Globe Component */}
                            <PricingHeroBackground />
                        </div>
                    </div>
                </div>
            </section>

            {/* Coverage Stats Section */}
            <section className="py-24 border-t border-white/5 bg-[#050505]">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
                        {[
                            { value: "+12", label: "passerelles de paiement" },
                            { value: "+60", label: "méthodes de paiement" },
                            { value: "+5", label: "passerelles de transfert" },
                            { value: "+20", label: "méthodes de transfert" },
                            { value: "+50", label: "devises" },
                            { value: "+2", label: "langues" },
                        ].map((stat, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Security Section */}
            <section className="py-24 border-t border-white/5">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                        <div className="flex gap-6">
                            <div className="h-12 w-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Normes de sécurité élevées</h3>
                                <p className="text-zinc-400">
                                    Fiabilité et sécurité garanties par le respect strict des normes PCI-DSS.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="h-12 w-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                                <Lock className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Protection des données</h3>
                                <p className="text-zinc-400">
                                    La sécurité de vos données et celles de vos clients est notre priorité.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 border-t border-white/5 bg-[#050505]">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-white/5 mb-6">
                            <HelpCircle className="h-6 w-6 text-zinc-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Des questions ? Réponses.</h2>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1" className="border-white/10">
                            <AccordionTrigger className="text-white hover:text-emerald-400 text-left">Comment la tarification est-elle structurée ?</AccordionTrigger>
                            <AccordionContent className="text-zinc-400">
                                Notre tarification est basée sur un modèle à l'usage (Pay-as-you-go). Vous payez des frais fixes par transaction réussie ($0.01), sans frais mensuels ni frais d'installation.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2" className="border-white/10">
                            <AccordionTrigger className="text-white hover:text-emerald-400 text-left">Qu'est-ce qu'une transaction réussie ?</AccordionTrigger>
                            <AccordionContent className="text-zinc-400">
                                Une transaction est considérée comme réussie lorsque les fonds ont été effectivement transférés ou reçus. Les tentatives échouées ou annulées ne sont pas facturées.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3" className="border-white/10">
                            <AccordionTrigger className="text-white hover:text-emerald-400 text-left">Comment les frais de transaction sont-ils facturés et payés ?</AccordionTrigger>
                            <AccordionContent className="text-zinc-400">
                                Les frais sont automatiquement déduits du montant de la transaction au moment où elle est traitée. Vous recevez le montant net dans votre solde.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4" className="border-white/10">
                            <AccordionTrigger className="text-white hover:text-emerald-400 text-left">Offrez-vous des remises pour des volumes de transactions élevés ?</AccordionTrigger>
                            <AccordionContent className="text-zinc-400">
                                Absolument. Pour les volumes supérieurs à 50 000 transactions par mois, nous proposons des tarifs personnalisés plus avantageux. Contactez notre équipe commerciale.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 blur-[100px] pointer-events-none" />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Prêt à développer votre entreprise ?</h2>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
                        Créer un compte gratuitement dès aujourd'hui et encaisser dans plus de 10 pays en Afrique.
                    </p>
                    <Link href="/auth/register">
                        <Button size="lg" className="h-16 px-10 rounded-full text-lg font-bold bg-white text-black hover:bg-zinc-200 hover:scale-105 transition-all shadow-2xl shadow-white/20">
                            Créer un compte
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
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
