"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Globe, Zap, ArrowRight, CheckCircle2, CreditCard } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Helper to get logo path
const getMethodLogo = (name: string) => {
    const normalized = name.toLowerCase();
    if (normalized.includes("wave")) return "/logos/wave.svg";
    if (normalized.includes("orange")) return "/logos/orange-money.svg";
    if (normalized.includes("mtn")) return "/logos/mtn-momo.svg";
    if (normalized.includes("moov")) return "/logos/moov-money.svg";
    if (normalized.includes("airtel")) return "/logos/airtel-money.svg";
    if (normalized.includes("m-pesa")) return "/logos/m-pesa.svg";
    if (normalized.includes("djamo")) return "/logos/djamo.svg";
    if (normalized.includes("free")) return "/logos/free-money.svg";
    if (normalized.includes("celtiis")) return "/logos/celtiis.svg";
    if (normalized.includes("t-money")) return "/logos/t-money.svg";
    if (normalized.includes("express")) return "/logos/express-union.svg";
    if (normalized.includes("wizall")) return "/logos/wizall.svg";
    return null;
};

// Data for coverage
const regions = [
    {
        name: "Afrique de l'Ouest",
        countries: [
            { name: "Côte d'Ivoire", code: "CI", methods: ["Orange Money", "MTN Momo", "Moov Money", "Wave", "Visa/Mastercard"] },
            { name: "Sénégal", code: "SN", methods: ["Orange Money", "Free Money", "Wave", "Visa/Mastercard"] },
            { name: "Bénin", code: "BJ", methods: ["MTN Momo", "Moov Money", "Celtiis", "Visa/Mastercard"] },
            { name: "Burkina Faso", code: "BF", methods: ["Orange Money", "Moov Money", "Visa/Mastercard"] },
            { name: "Mali", code: "ML", methods: ["Orange Money", "Moov Money", "Visa/Mastercard"] },
            { name: "Togo", code: "TG", methods: ["T-Money", "Moov Money", "Visa/Mastercard"] },
        ]
    },
    {
        name: "Afrique Centrale",
        countries: [
            { name: "Cameroun", code: "CM", methods: ["Orange Money", "MTN Momo", "Express Union", "Visa/Mastercard"] },
            { name: "Gabon", code: "GA", methods: ["Airtel Money", "Moov Money", "Visa/Mastercard"] },
            { name: "Congo", code: "CG", methods: ["Airtel Money", "MTN Momo", "Visa/Mastercard"] },
            { name: "RDC", code: "CD", methods: ["Airtel Money", "Orange Money", "M-Pesa", "Visa/Mastercard"] },
        ]
    }
];

export default function CoveragePage() {
    const [searchQuery, setSearchQuery] = useState("");

    // Filter logic
    const filteredRegions = regions.map(region => ({
        ...region,
        countries: region.countries.filter(country =>
            country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            country.methods.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()))
        )
    })).filter(region => region.countries.length > 0);

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
                        <Link href="/pricing" className="px-4 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/20">Tarification</Link>
                        <Link href="/docs" className="px-4 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/20">Documentation</Link>
                        <Link href="/integration" className="px-4 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/20">Intégration</Link>
                        <Link href="/coverage" className="px-4 py-1.5 rounded-full bg-white/10 text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/20">Couverture</Link>
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
                    <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[150px] opacity-30" />
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-400 mb-8">
                            <Globe className="h-3 w-3" />
                            Présent dans +15 pays
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                            Une couverture panafricaine
                        </h1>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
                            Acceptez les paiements locaux préférés de vos clients, partout en Afrique.
                            Une seule intégration pour débloquer tout le continent.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-md mx-auto relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                            <Input
                                type="text"
                                placeholder="Rechercher un pays (ex: Côte d'Ivoire) ou une méthode..."
                                className="pl-12 h-14 rounded-full bg-white/5 border-white/10 text-white placeholder:text-zinc-500 hover:bg-white/10 focus-visible:ring-primary text-base w-full transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Countries Grid */}
            <section className="pb-32 relative z-10">
                <div className="container mx-auto px-4 max-w-6xl">
                    {filteredRegions.length > 0 ? (
                        <div className="space-y-16">
                            {filteredRegions.map((region) => (
                                <motion.div
                                    key={region.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <h2 className="text-2xl font-bold text-white mb-8 px-4 border-l-4 border-primary">{region.name}</h2>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {region.countries.map((country) => (
                                            <div key={country.name} className="group bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full border border-white/10 overflow-hidden relative shadow-sm">
                                                            <img
                                                                src={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png`}
                                                                alt={country.name}
                                                                className="h-full w-full object-cover"
                                                                loading="lazy"
                                                            />
                                                        </div>
                                                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{country.name}</h3>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    {country.methods.map((method) => {
                                                        const logo = getMethodLogo(method);
                                                        return (
                                                            <div key={method} className="flex items-center gap-2 text-sm text-zinc-400">
                                                                {logo ? (
                                                                    <div className="h-5 w-5 bg-white rounded-full flex items-center justify-center p-0.5 flex-shrink-0">
                                                                        <img src={logo} alt={method} className="h-full w-full object-contain" />
                                                                    </div>
                                                                ) : method.includes("Visa") ? (
                                                                    <div className="h-5 w-5 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                                        <CreditCard className="h-3 w-3 text-white" />
                                                                    </div>
                                                                ) : (
                                                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                                                                )}
                                                                {method}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-zinc-500 text-lg">Aucun résultat trouvé pour "{searchQuery}".</p>
                            <Button
                                variant="link"
                                className="text-primary mt-2"
                                onClick={() => setSearchQuery("")}
                            >
                                Voir tous les pays
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Footer */}
            <section className="py-24 border-t border-white/5 bg-[#050505]">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Vous ne trouvez pas votre pays ?</h2>
                    <p className="text-zinc-400 max-w-lg mx-auto mb-8">
                        Nous ajoutons de nouvelles destinations chaque mois. Contactez-nous pour connaître notre roadmap.
                    </p>
                    <Link href="/contact">
                        <Button variant="outline" className="rounded-full h-12 px-8 border-white/10 text-white hover:bg-white hover:text-black">
                            Contacter l'équipe expansion
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
