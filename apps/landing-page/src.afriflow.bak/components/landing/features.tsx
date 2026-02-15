"use client";

import { motion } from "framer-motion";
import { LinkIcon, ShieldCheck, Zap, Globe, BarChart3, Users } from "lucide-react";

export function Features() {
    const features = [
        {
            title: "Orchestration Universelle",
            description: "Connectez +50 gateways en un clic. Gérez les pannes avec notre Smart Routing IA qui redirige les transactions en temps réel.",
            icon: Globe,
            colSpan: "lg:col-span-2",
            bg: "bg-blue-500/10"
        },
        {
            title: "Sécurité Militaire",
            description: "Conformité PCI-DSS N1. Tokenisation avancée et détection de fraude prédictive.",
            icon: ShieldCheck,
            colSpan: "lg:col-span-1",
            bg: "bg-emerald-500/10"
        },
        {
            title: "Réconciliation 0-Touch",
            description: "Vos livres comptables toujours à jour. Finies les erreurs humaines.",
            icon: BarChart3,
            colSpan: "lg:col-span-1",
            bg: "bg-purple-500/10"
        },
        {
            title: "Expérience Client Unifiée",
            description: "Une page de paiement unique, ultra-rapide, qui s'adapte à la devise et à la langue de vos clients.",
            icon: Users,
            colSpan: "lg:col-span-2",
            bg: "bg-amber-500/10"
        }
    ];

    return (
        <section className="py-32 bg-[#020202] relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 mb-6">
                        Plus qu'une passerelle.<br />
                        Un système d'exploitation financier.
                    </h2>
                    <p className="text-zinc-400 text-lg max-w-2xl">
                        Tout ce dont vous avez besoin pour scaler vos paiements en Afrique et au-delà, dans une interface unifiée.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`${feature.colSpan} group relative rounded-3xl border border-white/10 bg-white/[0.02] p-8 overflow-hidden hover:bg-white/[0.04] transition-colors duration-500`}
                        >
                            <div className={`absolute top-0 right-0 p-32 rounded-full blur-[80px] opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity ${feature.bg}`} />

                            <div className="relative z-10 space-y-4">
                                <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-white tracking-tight">{feature.title}</h3>
                                <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
                            </div>

                            {/* Hover Border Gradient */}
                            <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 rounded-3xl transition-colors duration-500 pointer-events-none" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
