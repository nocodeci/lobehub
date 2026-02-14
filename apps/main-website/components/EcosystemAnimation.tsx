"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Bot, Sparkles } from "lucide-react";

const CONNECT_URL = process.env.NEXT_PUBLIC_CONNECT_URL || "https://app.connect.wozif.com";

const products = [
    {
        name: "Connect",
        desc: "La plateforme d'agents IA pour automatiser vos opérations et communiquer via WhatsApp.",
        href: CONNECT_URL,
        color: "from-indigo-500 to-violet-600",
        icon: Bot,
        available: true,
    },
    {
        name: "Bientôt",
        desc: "De nouveaux produits sont en cours de développement pour compléter l'écosystème Wozif.",
        href: "#",
        color: "from-slate-300 to-slate-400",
        icon: Sparkles,
        available: false,
    },
];

export default function ProductsShowcase() {
    return (
        <section className="py-24 bg-white">
            <div className="mx-auto max-w-[1200px] px-6 lg:px-8">

                {/* Products Carousel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
                    {products.map((product, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            {product.available ? (
                                <Link href={product.href} className="block group">
                                    <div className="relative p-8 rounded-2xl bg-slate-950 overflow-hidden transition-all group-hover:shadow-xl">
                                        <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${product.color} opacity-20 blur-3xl rounded-full`} />
                                        <div className="relative">
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center mb-6`}>
                                                <product.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
                                            <p className="text-white/60 text-[15px] leading-relaxed mb-6">{product.desc}</p>
                                            <div className="flex items-center gap-2 text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                                                Découvrir
                                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ) : (
                                <div className="p-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-6">
                                        <product.icon className="w-6 h-6 text-slate-300" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-300 mb-2">{product.name}</h3>
                                    <p className="text-slate-400 text-[15px] leading-relaxed">{product.desc}</p>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Discover All */}
                <div className="text-center">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 text-[14px] font-semibold text-slate-600 hover:text-slate-950 transition-colors"
                    >
                        Découvrir toutes nos solutions
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
