"use client";

import Image from "next/image";
import Link from "next/link";
import MainNavbar from "@/framer/main-navbar";
import FooterFramer from "@/framer/footer";

const team = [
    {
        name: "Koffi Yohan Erick Kouakou",
        role: "Fondateur & CEO",
        bio: "Passionné de technologie et d'entrepreneuriat, Koffi a fondé Wozif avec la vision de démocratiser l'accès aux outils numériques en Afrique. Il dirige la stratégie produit et les partenariats.",
        initials: "KK",
        color: "#FF7A00",
    },
    {
        name: "Ama Diallo",
        role: "Product Lead, Gnata",
        bio: "Experte en design et expérience utilisateur, Ama pilote le développement de Gnata. Elle s'assure que chaque site créé est à la fois beau, rapide et accessible.",
        initials: "AD",
        color: "#10B981",
    },
    {
        name: "Moussa Traoré",
        role: "CTO",
        bio: "Architecte logiciel avec plus de 8 ans d'expérience, Moussa supervise l'infrastructure technique de Wozif. Il est le cerveau derrière Connect et AfriFlow.",
        initials: "MT",
        color: "#3B82F6",
    },
    {
        name: "Fatou Bamba",
        role: "Lead Developer",
        bio: "Développeuse full-stack spécialisée en IA conversationnelle, Fatou construit les agents intelligents de Connect. Elle est passionnée par le NLP appliqué aux langues africaines.",
        initials: "FB",
        color: "#8B5CF6",
    },
    {
        name: "Ibrahim Koné",
        role: "Head of Payments, AfriFlow",
        bio: "Expert en fintech et systèmes de paiement africains, Ibrahim gère les intégrations avec les opérateurs Mobile Money et assure la conformité réglementaire d'AfriFlow.",
        initials: "IK",
        color: "#EC4899",
    },
    {
        name: "Aïcha Sanogo",
        role: "Customer Success Manager",
        bio: "Aïcha accompagne les clients de Wozif dans l'adoption de nos outils. Elle est le lien entre nos utilisateurs et notre équipe produit pour garantir la meilleure expérience.",
        initials: "AS",
        color: "#F59E0B",
    },
];

const values = [
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
        ),
        title: "Impact local",
        description: "Nous construisons des solutions pensées pour l'Afrique, par des Africains. Chaque produit répond à un besoin réel du continent.",
    },
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
        ),
        title: "Accessibilité",
        description: "La technologie doit être accessible à tous. Nos tarifs et nos interfaces sont conçus pour les PME et entrepreneurs africains.",
    },
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
        ),
        title: "Innovation",
        description: "Nous combinons intelligence artificielle et savoir-faire humain pour créer des produits qui font la différence.",
    },
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
        ),
        title: "Confiance",
        description: "La sécurité et la transparence sont au cœur de tout ce que nous faisons. Vos données et vos paiements sont entre de bonnes mains.",
    },
];

const stats = [
    { value: "3", label: "Produits" },
    { value: "18+", label: "Opérateurs de paiement" },
    { value: "5+", label: "Pays couverts" },
    { value: "24h", label: "Temps de réponse" },
];

export default function AProposPage() {
    return (
        <div className="flex flex-col items-center bg-[rgb(245,245,245)] min-h-screen">
            {/* Navbar */}
            <div style={{ position: "sticky", top: 0, zIndex: 50, width: "100%", display: "flex", justifyContent: "center" }}>
                <MainNavbar.Responsive />
            </div>

            {/* Hero */}
            <section className="w-full pt-32 pb-20 px-4" style={{ background: "linear-gradient(180deg, rgb(26,26,26) 0%, rgb(38,38,38) 100%)" }}>
                <div className="max-w-4xl mx-auto text-center">
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase mb-6" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        À propos
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6" style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                        Des solutions numériques utiles et intelligentes
                    </h1>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                        Wozif est une entreprise technologique africaine qui démocratise l&apos;accès au web et aux paiements en ligne en Afrique.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="w-full max-w-4xl mx-auto px-4 -mt-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-white rounded-2xl p-6 text-center" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)" }}>
                            <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-1" style={{ letterSpacing: "-0.02em" }}>{stat.value}</p>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mission */}
            <section className="w-full max-w-4xl mx-auto px-4 mt-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ letterSpacing: "-0.02em" }}>
                        Notre mission
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto" style={{ lineHeight: 1.7 }}>
                        Nous croyons que chaque entreprise africaine mérite des outils numériques performants, accessibles et adaptés à ses réalités. Wozif combine savoir-faire technologique et intelligence artificielle pour créer des produits qui répondent aux besoins concrets du continent.
                    </p>
                </div>

                {/* Products */}
                <div className="grid md:grid-cols-3 gap-5">
                    <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)" }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-white font-bold text-sm" style={{ background: "#FF7A00" }}>C</div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Connect</h3>
                        <p className="text-sm text-gray-500" style={{ lineHeight: 1.6 }}>Automatisation WhatsApp avec IA : agents conversationnels, chatbots et CRM intégré.</p>
                        <a href="https://connect.wozif.com" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-sm font-medium text-orange-600 hover:underline">connect.wozif.com →</a>
                    </div>
                    <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)" }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-white font-bold text-sm" style={{ background: "#10B981" }}>G</div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Gnata</h3>
                        <p className="text-sm text-gray-500" style={{ lineHeight: 1.6 }}>Votre site web en 1 heure. Création ultra-rapide avec service humain dédié, à partir de 50K FCFA.</p>
                        <a href="https://gnata.wozif.com" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-sm font-medium text-emerald-600 hover:underline">gnata.wozif.com →</a>
                    </div>
                    <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)" }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-white font-bold text-sm" style={{ background: "#3B82F6" }}>A</div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">AfriFlow</h3>
                        <p className="text-sm text-gray-500" style={{ lineHeight: 1.6 }}>Orchestrateur de paiements africain : Mobile Money, cartes bancaires, 18+ opérateurs, 2% par transaction.</p>
                        <a href="https://afriflow.wozif.com" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-sm font-medium text-blue-600 hover:underline">afriflow.wozif.com →</a>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="w-full max-w-4xl mx-auto px-4 mt-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ letterSpacing: "-0.02em" }}>
                        Nos valeurs
                    </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                    {values.map((value) => (
                        <div key={value.title} className="bg-white rounded-2xl p-6 flex gap-4" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)" }}>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-gray-700" style={{ background: "rgba(26,26,26,0.05)" }}>
                                {value.icon}
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-900 mb-1">{value.title}</h3>
                                <p className="text-sm text-gray-500" style={{ lineHeight: 1.6 }}>{value.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Team */}
            <section className="w-full max-w-5xl mx-auto px-4 mt-20 pb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ letterSpacing: "-0.02em" }}>
                        Notre équipe
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto" style={{ lineHeight: 1.7 }}>
                        Une équipe passionnée, basée en Afrique de l&apos;Ouest, qui construit l&apos;avenir numérique du continent.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {team.map((member) => (
                        <div key={member.name} className="bg-white rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-200 hover:-translate-y-1" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)" }}>
                            <div
                                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-5"
                                style={{ background: member.color }}
                            >
                                {member.initials}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-0.5" style={{ letterSpacing: "-0.01em" }}>{member.name}</h3>
                            <p className="text-sm font-medium mb-3" style={{ color: member.color }}>{member.role}</p>
                            <p className="text-sm text-gray-500" style={{ lineHeight: 1.6 }}>{member.bio}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="w-full max-w-4xl mx-auto px-4 pb-20">
                <div className="rounded-2xl p-10 md:p-14 text-center" style={{ background: "rgb(26,26,26)" }}>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
                        Prêt à transformer votre business ?
                    </h2>
                    <p className="text-base mb-8 max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                        Rejoignez les entreprises africaines qui font confiance à Wozif pour leur transformation digitale.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/contact" className="px-6 py-3 rounded-full text-sm font-medium text-gray-900 transition-opacity hover:opacity-90" style={{ background: "white" }}>
                            Nous contacter
                        </Link>
                        <Link href="/" className="px-6 py-3 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-80" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
                            Découvrir nos produits
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <FooterFramer.Responsive />
        </div>
    );
}
