"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    BookOpen,
    ChevronLeft,
    Code2,
    Webhook,
    ShieldCheck,
    Layers,
    ArrowRight,
    Zap,
    Cpu,
    Globe,
    Lock,
    Terminal,
    Settings,
    MessageSquare,
    Slack
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DocumentationPage() {
    const mainCategories = [
        {
            title: "Authentification API",
            desc: "Sécurisez vos requêtes avec l'authentification Bearer Token et vos clés secrètes d'orchestrateur.",
            icon: Lock,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            link: "#auth"
        },
        {
            title: "Paiements & Checkout",
            desc: "Créez des intentions de paiement et gérez les flux de redirection multi-passerelles.",
            icon: Zap,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            link: "#payments"
        },
        {
            title: "Webhooks & Events",
            desc: "Recevez des notifications en temps réel lors du succès ou de l'échec des transactions.",
            icon: Webhook,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            link: "#webhooks"
        },
        {
            title: "SDKs & Librairies",
            desc: "Utilisez nos SDKs officiels pour Node.js, Python, PHP, Ruby et Go.",
            icon: Cpu,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            link: "#sdks"
        }
    ];

    return (
        <div className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto p-4 md:p-8">
            {/* Header section with back button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
                <div className="flex items-center gap-5">
                    <Link href="/developer">
                        <Button variant="ghost" size="icon" className="rounded-2xl h-12 w-12 bg-white/5 border border-white/5 hover:bg-primary/10 hover:text-primary transition-all">
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-emerald-500/20 text-emerald-500 border-none px-2 py-0 text-[9px] font-black uppercase tracking-widest">v1.2 stable</Badge>
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Docs Reference</span>
                        </div>
                        <h1 className="text-3xl font-[950] uppercase italic tracking-tighter text-gradient">Centre de Documentation API</h1>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl h-11 border-white/10 hover:bg-white/5 font-black uppercase italic tracking-tighter text-xs">
                        OpenAPI Spec 3.1
                    </Button>
                    <Button className="rounded-xl h-11 bg-primary font-black uppercase italic tracking-tighter text-xs px-6 shadow-xl shadow-primary/20">
                        Postman Collection
                    </Button>
                </div>
            </div>

            {/* Quick search / Intro */}
            <div className="grid lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border border-white/10 bg-slate-950 p-8 rounded-[2rem] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Terminal className="h-32 w-32" />
                        </div>
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-4 relative z-10">Démarrage <span className="text-primary italic">Express</span></h2>
                        <p className="text-muted-foreground font-medium leading-relaxed mb-6 relative z-10">
                            Notre API a été conçue pour être intégrée en moins de 10 minutes.
                            Suivez nos guides thématiques pour connecter vos applications.
                        </p>
                        <div className="space-y-3 relative z-10">
                            {[
                                "Installation du SDK",
                                "Première transaction",
                                "Vérification des signatures",
                                "Gestion des remboursements"
                            ].map((step, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm font-bold group cursor-pointer hover:text-primary transition-colors">
                                    <div className="h-6 w-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] group-hover:bg-primary/20">{i + 1}</div>
                                    <span>{step}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="border border-white/10 bg-gradient-to-br from-indigo-500/10 to-transparent p-6 rounded-2xl">
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
                                <Slack className="h-5 w-5 text-indigo-400" />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Communauté Slack</p>
                                <p className="text-xs text-muted-foreground mt-1">Rejoignez plus de 1,200 développeurs sur notre canal officiel.</p>
                                <Button variant="link" className="p-0 h-auto text-indigo-400 text-xs mt-2 font-black uppercase tracking-tighter">Rejoindre maintenant</Button>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2 grid gap-6 sm:grid-cols-2">
                    {mainCategories.map((cat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card className="border border-white/10 bg-card/40 backdrop-blur-3xl hover:border-primary/50 transition-all cursor-pointer group rounded-[2rem] h-full flex flex-col">
                                <CardContent className="p-8 flex-1 flex flex-col">
                                    <div className={`h-16 w-16 rounded-2xl ${cat.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <cat.icon className={`h-8 w-8 ${cat.color}`} />
                                    </div>
                                    <h3 className="text-xl font-black uppercase italic tracking-tighter mb-3">{cat.title}</h3>
                                    <p className="text-muted-foreground font-medium leading-relaxed text-sm mb-6 flex-1">{cat.desc}</p>
                                    <div className="flex items-center justify-between text-primary font-black text-xs uppercase tracking-tighter group-hover:translate-x-1 transition-transform">
                                        Explorer ce module <ArrowRight className="h-4 w-4" />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}

                    <Card className="sm:col-span-2 border border-white/10 bg-slate-900/50 rounded-[2rem] p-8 mt-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                                <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center ring-1 ring-emerald-500/20">
                                    <Globe className="h-8 w-8 text-emerald-500" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-[950] uppercase italic tracking-tighter">Endpoints Regionaux</h4>
                                    <p className="text-xs text-muted-foreground font-medium mt-1">
                                        Pour une performance optimale, connectez-vous au serveur le plus proche de votre région (CI, SN, ML, CM).
                                    </p>
                                </div>
                            </div>
                            <Button variant="secondary" className="rounded-xl h-12 px-8 font-[950] uppercase italic tracking-tighter">
                                Voir Map Latence
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Help / Support CTA */}
            <Card className="border-none bg-primary/5 rounded-[2.5rem] p-12 mt-12 relative overflow-hidden group">
                <div className="absolute -left-20 -bottom-20 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                    <Layers className="h-96 w-96" />
                </div>
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="text-center lg:text-left space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">Support Dédié</div>
                        <h2 className="text-3xl lg:text-4xl font-[950] uppercase italic tracking-tighter leading-none">Besoin d'un accompagnement <span className="text-primary italic">Technique ?</span></h2>
                        <p className="text-muted-foreground font-medium max-w-2xl text-lg leading-relaxed">
                            Nos ingénieurs Solution sont prêts à vous aider pour le design de votre architecture de paiement ou le debug de vos scripts.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto shrink-0">
                        <Button size="lg" className="rounded-2xl h-16 px-10 font-black uppercase italic tracking-tighter text-lg shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all">
                            <MessageSquare className="h-5 w-5 mr-3" /> Chat Live
                        </Button>
                        <Button variant="outline" size="lg" className="rounded-2xl h-16 px-10 border-white/10 hover:bg-white/5 font-black uppercase italic tracking-tighter text-lg transition-all">
                            Planifier un Call
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
