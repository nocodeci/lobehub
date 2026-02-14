"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Bot, MessageCircle, Brain, Users, Workflow, Shield } from "lucide-react";

const CONNECT_URL = process.env.NEXT_PUBLIC_CONNECT_URL || "https://app.connect.wozif.com";

const features = [
    {
        icon: Bot,
        title: "Agents IA personnalisés",
        desc: "Créez des agents avec des personnalités uniques, des instructions précises et des modèles IA au choix (GPT-4, Claude, Mistral...).",
        color: "indigo",
    },
    {
        icon: MessageCircle,
        title: "WhatsApp natif",
        desc: "Connectez vos agents à WhatsApp en un scan QR. Vos clients interagissent avec l'IA directement depuis leur messagerie.",
        color: "emerald",
    },
    {
        icon: Users,
        title: "Groupes d'agents",
        desc: "Combinez plusieurs agents en équipes intelligentes. Un superviseur coordonne les réponses pour des résultats optimaux.",
        color: "violet",
    },
    {
        icon: Brain,
        title: "Mémoire contextuelle",
        desc: "Vos agents se souviennent des conversations passées, des préférences et du contexte de chaque utilisateur.",
        color: "amber",
    },
    {
        icon: Workflow,
        title: "Outils & Plugins",
        desc: "Étendez les capacités de vos agents avec des outils MCP, des bases de connaissances et des intégrations tierces.",
        color: "cyan",
    },
    {
        icon: Shield,
        title: "Sécurité & Contrôle",
        desc: "Gardez le contrôle total : activez/désactivez vos agents, gérez les accès et suivez l'utilisation en temps réel.",
        color: "rose",
    },
];

export default function ConnectShowcase() {
    return (
        <section id="connect" className="py-32 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/50 to-white pointer-events-none" />

            <div className="relative container mx-auto px-6 lg:px-12">

                {/* Section Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[11px] font-black uppercase tracking-[0.3em] mb-8">
                            <Bot className="w-3.5 h-3.5" />
                            Produit phare
                        </div>
                        <h2 className="text-4xl md:text-6xl xl:text-7xl font-black text-slate-950 tracking-tighter mb-6 leading-[0.9]">
                            Connect
                        </h2>
                        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                            La plateforme d&apos;agents IA qui transforme la façon dont les entreprises africaines communiquent et opèrent.
                        </p>
                    </motion.div>
                </div>

                {/* Product Preview Card */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="max-w-5xl mx-auto mb-24"
                >
                    <div className="relative rounded-[3rem] bg-slate-950 p-2 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.3)]">
                        {/* Browser Chrome */}
                        <div className="flex items-center gap-2 px-6 py-4">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-white/10" />
                                <div className="w-3 h-3 rounded-full bg-white/10" />
                                <div className="w-3 h-3 rounded-full bg-white/10" />
                            </div>
                            <div className="flex-1 flex justify-center">
                                <div className="px-6 py-1.5 rounded-lg bg-white/5 text-white/40 text-xs font-medium">
                                    app.connect.wozif.com
                                </div>
                            </div>
                        </div>
                        {/* App Preview */}
                        <div className="rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 aspect-[16/9] flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-6">
                                    <Bot className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-2">Wozif Connect</h3>
                                <p className="text-white/50 font-medium">Votre workspace d&apos;agents IA</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
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
                            <h4 className="text-xl font-black text-slate-950 mb-4 tracking-tight">{feature.title}</h4>
                            <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-20"
                >
                    <Link
                        href={CONNECT_URL}
                        className="inline-flex items-center gap-3 px-10 py-5 bg-slate-950 text-white font-black rounded-2xl hover:shadow-[0_30px_60px_-15px_rgba(79,70,229,0.3)] transition-all hover:scale-[1.02] uppercase tracking-widest text-sm group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative flex items-center gap-3">
                            Lancer Connect
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                        </span>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
