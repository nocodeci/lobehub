"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Zap,
    CheckCircle2,
    Globe,
    ShieldCheck,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";

const methodsByCountry = {
    'Sénégal': [
        { name: 'Orange Money Sénégal', logo: 'https://paydunya.com/refont/images/icon_pydu/partners/om.png' },
        { name: 'Wave Sénégal', logo: 'https://paydunya.com/refont/images/icon_pydu/partners/wave.png' },
        { name: 'Free Money Sénégal', logo: 'https://paydunya.com/refont/images/icon_pydu/partners/free.png' },
        { name: 'Wizall Money Sénégal', logo: 'https://paydunya.com/refont/images/icon_pydu/partners/wizall.png' },
        { name: 'Expresso Sénégal', logo: 'https://paydunya.com/refont/images/icon_pydu/partners/expresso.png' }
    ],
    'Côte d\'Ivoire': [
        { name: 'Orange Money CI', logo: 'https://paydunya.com/refont/images/icon_pydu/partners/om.png' },
        { name: 'MTN Mobile Money CI', logo: 'https://paydunya.com/refont/images/icon_pydu/partners/mtn.png' },
        { name: 'Wave Côte d\'Ivoire', logo: 'https://paydunya.com/refont/images/icon_pydu/partners/wave.png' },
        { name: 'Moov Money CI', logo: 'https://paydunya.com/refont/images/icon_pydu/partners/moov.png' }
    ],
    'Bénin': [
        { name: 'MTN Mobile Money Bénin', logo: 'https://paydunya.com/refont/images/icon_pydu/partners/mtn.png' },
        { name: 'Moov Money Bénin', logo: 'https://paydunya.com/refont/images/icon_pydu/partners/moov.png' }
    ],
    'Togo': [
        { name: 'T-Money Togo', logo: 'https://paydunya.com/refont/images/icon_pydu/partners/tmoney.png' },
        { name: 'Moov Money Togo', logo: 'https://paydunya.com/refont/images/icon_pydu/partners/moov.png' }
    ],
    'Mali & Burkina': [
        { name: 'Orange Money Mali', logo: 'https://paydunya.com/refont/images/icon_pydu/partners/om.png' },
        { name: 'Orange Money Burkina', logo: 'https://paydunya.com/refont/images/icon_pydu/partners/om.png' },
        { name: 'Moov Money Burkina', logo: 'https://paydunya.com/refont/images/icon_pydu/partners/moov.png' }
    ],
    'International': [
        { name: 'Visa International', logo: 'https://paydunya.com/refont/images/icon_pydu/partners/visa.png' },
        { name: 'MasterCard', logo: 'https://paydunya.com/refont/images/icon_pydu/partners/mastercard.png' }
    ]
};

export default function GatewayMethodsPage() {
    return (
        <div className="min-h-screen pb-20">
            {/* Header section with glass effect - Adjusted to sit below global header */}
            <div className="sticky top-16 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 py-6">
                <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/gateways/new">
                            <Button variant="ghost" size="icon" className="rounded-full bg-white/5 hover:bg-white/10 transition-all">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center p-1.5 shadow-lg">
                                    <img src="/logos/paydunya.png" className="object-contain" alt="PayDunya" />
                                </div>
                                <h1 className="text-2xl font-black italic uppercase tracking-tighter text-gradient">
                                    Canaux <span className="text-primary italic">PayDunya</span>
                                </h1>
                            </div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Catalogue des méthodes de paiement supportées</p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <a
                            href="https://paydunya.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                        >
                            <span className="text-[10px] font-black uppercase tracking-tighter text-white/60 group-hover:text-white transition-colors">Voir le site</span>
                            <ExternalLink className="h-3 w-3 text-white/40 group-hover:text-primary transition-colors" />
                        </a>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/5 border border-primary/10">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-tighter text-primary">Certifié PCI-DSS</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 mt-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-12"
                >
                    {Object.entries(methodsByCountry).map(([country, methods], countryIdx) => (
                        <motion.div
                            key={country}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: countryIdx * 0.1 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-px flex-1 bg-white/10" />
                                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary italic whitespace-nowrap px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 flex items-center gap-3">
                                    <span>{country}</span>
                                    <span className="not-italic text-sm">
                                        {country === 'Sénégal' && '🇸🇳'}
                                        {country === 'Côte d\'Ivoire' && '🇨🇮'}
                                        {country === 'Bénin' && '🇧🇯'}
                                        {country === 'Togo' && '🇹🇬'}
                                        {country === 'Mali & Burkina' && '🇲🇱 🇧🇫'}
                                        {country === 'International' && '🌍'}
                                    </span>
                                </h2>
                                <div className="h-px flex-1 bg-white/10" />
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {methods.map((method, idx) => (
                                    <div
                                        key={method.name}
                                        className="group flex items-center justify-between p-5 rounded-[1.5rem] bg-card/40 border border-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="h-14 w-14 rounded-2xl bg-white border border-white/10 flex items-center justify-center group-hover:scale-110 transition-all duration-500 overflow-hidden p-2 shadow-[0_8px_25px_rgba(0,0,0,0.4)] shrink-0">
                                                {method.logo ? (
                                                    <img
                                                        src={method.logo}
                                                        alt={method.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Zap className="h-7 w-7 text-primary" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black uppercase tracking-tight text-white/80 group-hover:text-white transition-colors">
                                                    {method.name}
                                                </p>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Actif</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                                            <CheckCircle2 className="h-4 w-4 text-primary" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Info Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-20 p-10 rounded-[3rem] bg-gradient-to-br from-primary/10 via-transparent to-transparent border border-white/5 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                        <Globe className="h-32 w-32 text-primary" />
                    </div>

                    <div className="relative z-10 max-w-2xl">
                        <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
                            <Globe className="h-7 w-7 text-primary" />
                        </div>
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4">
                            Centralisation <span className="text-primary italic">Souveraine</span>
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed italic mb-8">
                            Toutes ces méthodes sont automatiquement activées sur votre instance AfriFlow dès que votre clé API PayDunya est configurée. Plus besoin de contrats séparés avec chaque opérateur.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link href="/gateways/new">
                                <Button className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-black text-base font-black uppercase tracking-tighter italic shadow-[0_10px_25px_rgba(var(--primary-rgb),0.2)]">
                                    Configurer maintenant
                                </Button>
                            </Link>
                            <Button variant="outline" className="h-14 px-10 rounded-2xl border-white/10 hover:bg-white/5 text-white text-base font-black uppercase tracking-tighter italic">
                                Documentation <ExternalLink className="h-4 w-4 ml-3" />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
