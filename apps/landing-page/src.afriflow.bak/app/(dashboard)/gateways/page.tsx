"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Plus,
    Settings2,
    ShieldCheck,
    Smartphone,
    Wifi,
    Zap,
    MoreHorizontal,
    ArrowUpRight,
    Filter,
    Loader2
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getGateways } from "@/lib/actions/gateways";

export default function GatewaysPage() {
    const [gateways, setGateways] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGateways = async () => {
            const data = await getGateways();
            setGateways(data);
            setIsLoading(false);
        };
        fetchGateways();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Passerelles de Paiement</h1>
                    <p className="text-muted-foreground">
                        Gérez vos intégrations multi-canaux à travers toute l'Afrique.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" /> Filtrer
                    </Button>
                    <Link href="/gateways/new">
                        <Button className="gap-2 bg-primary shadow-lg shadow-primary/20">
                            <Plus className="h-4 w-4" /> Connecter une API
                        </Button>
                    </Link>
                </div>
            </div>

            {gateways.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {gateways.map((gateway, index) => (
                        <motion.div
                            key={gateway.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="relative overflow-hidden border border-white/10 bg-card/60 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:border-primary/30 transition-all duration-500 group">
                                {/* Subtle inner glow */}
                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                                <div className={`absolute top-0 right-0 h-32 w-32 -mr-8 -mt-8 rounded-full blur-3xl opacity-20 transition-all duration-700 group-hover:opacity-60 group-hover:scale-150 bg-${gateway.status === 'active' ? 'emerald' : 'amber'}-500 pointer-events-none`} />

                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-lg text-primary shadow-inner overflow-hidden p-2">
                                                {gateway.logo ? <img src={gateway.logo} alt="" className="w-full h-full object-contain" /> : gateway.name.substring(0, 2)}
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl">{gateway.name}</CardTitle>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className={`h-2 w-2 rounded-full ${gateway.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'
                                                        }`} />
                                                    <span className="text-xs font-medium capitalize">
                                                        {gateway.status === 'active' ? 'En ligne' : gateway.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <Link href={`/gateways/${gateway.id}`}>
                                                    <DropdownMenuItem className="cursor-pointer">Configurer</DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuItem>Voir les logs</DropdownMenuItem>
                                                <DropdownMenuItem>Clés API</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-500">Désactiver</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    <div className="flex flex-wrap gap-1.5">
                                        {gateway.countries.map((c: string) => (
                                            <Badge key={c} variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] px-2 py-0.5">
                                                {c}
                                            </Badge>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 rounded-xl bg-accent/30 border border-border/50">
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Succès</p>
                                            <div className="flex items-end gap-2 mt-1">
                                                <span className="text-xl font-bold">{gateway.successRate}</span>
                                                <ArrowUpRight className="h-4 w-4 text-emerald-500 mb-1" />
                                            </div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-accent/30 border border-border/50">
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Uptime</p>
                                            <div className="flex items-end gap-2 mt-1">
                                                <span className="text-xl font-bold">{gateway.uptime}</span>
                                                <Wifi className="h-4 w-4 text-emerald-500 mb-1" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground flex items-center gap-1.5">
                                                <Smartphone className="h-3.5 w-3.5" /> Mobile Money
                                            </span>
                                            <span className="font-semibold text-emerald-500">Disponible</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground flex items-center gap-1.5">
                                                <Zap className="h-3.5 w-3.5" /> Paiement Instantané
                                            </span>
                                            <span className="font-semibold text-emerald-500">Activé</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground flex items-center gap-1.5">
                                                <ShieldCheck className="h-3.5 w-3.5" /> Sécurité 3DS
                                            </span>
                                            <span className="font-semibold text-emerald-500">Vérifié</span>
                                        </div>
                                    </div>

                                    <Link href={`/gateways/${gateway.id}`}>
                                        <Button className="w-full mt-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300" variant="outline">
                                            Gérer l'intégration
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="group"
                    >
                        <Link href="/gateways/new" className="block h-full">
                            <Card className="h-full border-2 border-dashed border-white/10 bg-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center p-8 text-center min-h-[350px]">
                                <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-all border border-white/5">
                                    <Plus className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold">Ajouter une passerelle</h3>
                                <p className="text-sm text-muted-foreground mt-2 max-w-[200px]">
                                    Intégrez une nouvelle solution régionale à votre orchestrateur.
                                </p>
                            </Card>
                        </Link>
                    </motion.div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.02] backdrop-blur-sm"
                >
                    <div className="relative mb-8">
                        <div className="h-24 w-24 rounded-3xl bg-primary/10 flex items-center justify-center relative z-10 border border-primary/20 bg-gradient-to-br from-primary/20 to-transparent">
                            <Zap className="h-12 w-12 text-primary animate-pulse" />
                        </div>
                        <div className="absolute inset-0 bg-primary blur-3xl opacity-20 -z-10 animate-pulse" />
                    </div>
                    <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-4 text-gradient">Aucune Intégration <span className="text-primary italic">Active</span></h2>
                    <p className="text-muted-foreground max-w-sm text-lg mb-10 leading-relaxed font-medium">
                        Votre orchestrateur est prêt, mais aucune passerelle n'est connectée. Activez votre premier flux pour commencer à traiter des paiements.
                    </p>
                    <Link href="/gateways/new">
                        <Button size="lg" className="h-16 px-10 rounded-2xl gap-3 font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/20 hover:scale-105 transition-all active:scale-95">
                            <Plus className="h-5 w-5" /> Connecter ma première API
                        </Button>
                    </Link>

                    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
                        <div className="flex flex-col items-center gap-2">
                            <div className="h-10 w-10 rounded-lg bg-white/5 p-2 flex items-center justify-center border border-white/5">
                                <img src="/logos/paydunya.png" alt="PayDunya" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">PayDunya</span>
                        </div>
                        {['Flutterwave', 'Moneroo', 'CinetPay'].map((p) => (
                            <div key={p} className="flex flex-col items-center gap-2">
                                <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 font-bold text-xs">
                                    {p.substring(0, 2).toUpperCase()}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest">{p}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            <Card className="border-none bg-emerald-500/5 border border-emerald-500/10 overflow-hidden relative">
                <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-emerald-500/10 to-transparent" />
                <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                            <Settings2 className="h-8 w-8 text-emerald-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold italic">Routage Intelligent Liquide</h3>
                            <p className="text-muted-foreground max-w-md">
                                Activez l'optimisation automatique pour choisir la passerelle la moins chère et la plus rapide par pays.
                            </p>
                        </div>
                    </div>
                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/20 whitespace-nowrap">
                        Activer l'Auto-Routing
                    </Button>
                </CardContent>
            </Card>
        </div >
    );
}
