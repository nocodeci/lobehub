"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const stats = [
    { value: "+100", label: "Utilisateurs" },
    { value: "1", label: "Produit actif" },
    { value: "2025", label: "Année de création" },
];

export default function Hero() {
    return (
        <section className="relative pt-40 pb-24 overflow-hidden bg-white">
            <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8">
                <div className="max-w-3xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-950 tracking-tight leading-[1.1] mb-6"
                    >
                        Des solutions numériques utiles et intelligentes.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.6 }}
                        className="text-lg md:text-xl text-slate-500 max-w-2xl leading-relaxed mb-10"
                    >
                        Wozif combine savoir-faire technologique et intelligence artificielle pour créer des produits numériques qui répondent aux besoins des entreprises africaines.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="flex flex-col sm:flex-row items-start gap-4"
                    >
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-950 text-white text-[14px] font-semibold rounded-full hover:bg-slate-800 transition-colors"
                        >
                            Découvrir nos solutions
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/about"
                            className="inline-flex items-center gap-2 px-6 py-3 text-slate-700 text-[14px] font-semibold rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
                        >
                            Qui sommes-nous ?
                        </Link>
                    </motion.div>
                </div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.6 }}
                    className="flex items-center gap-12 mt-20 pt-10 border-t border-slate-100"
                >
                    {stats.map((stat) => (
                        <div key={stat.label}>
                            <div className="text-3xl md:text-4xl font-bold text-slate-950">{stat.value}</div>
                            <div className="text-sm text-slate-400 font-medium mt-1">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
