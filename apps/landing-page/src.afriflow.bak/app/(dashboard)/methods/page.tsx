"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Smartphone,
    CreditCard,
    Search,
    Filter,
    ArrowRight,
    Zap,
    CheckCircle2,
    Globe,
    Settings,
    Activity,
    MoreVertical
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getPaymentMethods } from "@/lib/actions/methods";

export default function MethodsPage() {
    const [methods, setMethods] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchMethods() {
            const data = await getPaymentMethods();
            setMethods(data);
            setIsLoading(false);
        }
        fetchMethods();
    }, []);

    const toggleMethod = (id: string) => {
        setMethods(prev => prev.map(m =>
            m.id === id ? { ...m, isActive: !m.isActive } : m
        ));
    };

    const filtered = methods.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.country.toLowerCase().includes(search.toLowerCase())
    );

    const activeCount = methods.filter(m => m.isActive).length;

    if (isLoading) {
        return (
            <div className="flex flex-col gap-8 pb-12 animate-pulse">
                <div className="h-64 bg-card/40 rounded-3xl" />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-48 bg-card/40 rounded-3xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (methods.length === 0) {
        return (
            <div className="flex flex-col gap-8 pb-12">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-background to-background border border-white/10 p-12 text-center">
                    <div className="absolute top-0 right-0 p-12 opacity-5 blur-3xl">
                        <Globe className="h-96 w-96 text-primary" />
                    </div>
                    <div className="relative z-10 flex flex-col items-center gap-6">
                        <div className="h-20 w-20 rounded-2xl bg-primary/20 flex items-center justify-center">
                            <Zap className="h-10 w-10 text-primary fill-current" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic">
                                Harmonisez vos <span className="text-primary">Flux</span>
                            </h2>
                            <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
                                Aucune méthode de paiement disponible. Connectez votre première passerelle (PayDunya, FedaPay...) pour activer les canaux locaux instantanément.
                            </p>
                        </div>
                        <Link href="/gateways/new">
                            <Button size="lg" className="h-14 px-8 rounded-xl font-bold text-lg gap-2 shadow-2xl shadow-primary/20">
                                Connecter ma première passerelle
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 pb-12">
            {/* Premium Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-background to-background border border-white/10 p-8">
                <div className="absolute top-0 right-0 p-12 opacity-10 blur-2xl">
                    <Globe className="h-64 w-64 text-primary" />
                </div>
                <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
                            Canaux de <span className="text-primary">Paiement</span>
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
                            Gérez votre infrastructure régionale. Connectez les opérateurs locaux à vos passerelles en un clic avec <span className="text-white font-bold">AfriFlow Harmony</span>.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/gateways/new">
                            <Button className="relative h-14 px-8 rounded-xl font-bold text-lg gap-2 shadow-2xl shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90">
                                <Zap className="h-5 w-5 fill-current" /> Connecter une Passerelle
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
                <div className="relative w-full max-w-md group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Rechercher (ex: OM Mali, Nigeria...)"
                        className="h-12 pl-12 bg-card/40 border-white/10 backdrop-blur-xl rounded-2xl focus-visible:ring-primary focus-visible:border-primary/50"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="px-4 py-2 border-white/10 bg-white/5 text-xs font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                        {activeCount} actifs sur {methods.length}
                    </Badge>
                    <Button variant="outline" size="icon" className="h-12 w-12 border-white/10 bg-card/40 rounded-2xl">
                        <Filter className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Grid of Method Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <AnimatePresence mode="popLayout">
                    {filtered.map((method, i) => (
                        <motion.div
                            layout
                            key={method.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                        >
                            <Card className={cn(
                                "group border border-white/10 bg-card/40 backdrop-blur-xl hover:bg-card/60 transition-all duration-500 rounded-3xl overflow-hidden relative active:scale-95",
                                !method.isActive && "opacity-60 saturate-50 grayscale-[0.3] hover:grayscale-0",
                                method.isActive && "hover:border-primary/30"
                            )}>
                                {/* Background Accent */}
                                <div className={cn(
                                    "absolute top-0 right-0 w-24 h-24 rounded-bl-full translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-700",
                                    method.isActive ? "bg-primary/5" : "bg-white/5"
                                )} />

                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <span className="text-3xl filter drop-shadow-sm">{method.flag}</span>
                                            {method.logo && (
                                                <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center shadow-xl overflow-hidden border border-white/10 group-hover:scale-110 transition-transform duration-500">
                                                    <img src={method.logo} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => toggleMethod(method.id)}
                                            className={cn(
                                                "h-8 w-14 rounded-full p-1 relative transition-all duration-500",
                                                method.isActive ? "bg-primary/20 border border-primary/30 shadow-[0_0_20px_rgba(var(--primary),0.1)]" : "bg-white/10 border border-white/10"
                                            )}
                                        >
                                            <motion.div
                                                animate={{ x: method.isActive ? 24 : 0 }}
                                                className={cn(
                                                    "h-5 w-5 rounded-full shadow-xl transition-colors duration-500",
                                                    method.isActive ? "bg-primary shadow-primary/50" : "bg-muted-foreground"
                                                )}
                                            />
                                        </button>
                                    </div>
                                    <div className="space-y-1">
                                        <CardTitle className={cn(
                                            "text-xl font-bold tracking-tight leading-tight transition-colors",
                                            method.isActive ? "group-hover:text-primary" : "text-muted-foreground"
                                        )}>
                                            {method.name}
                                        </CardTitle>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1 font-medium italic">
                                            {method.country}
                                        </p>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    {/* Gateway Connection Flow */}
                                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between relative overflow-hidden group/flow">
                                        <div className={cn(
                                            "absolute inset-0 transition-opacity",
                                            method.isActive ? "bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover/flow:opacity-100" : "opacity-0"
                                        )} />
                                        <div className="flex flex-col items-center">
                                            {method.type === 'Card' ? <CreditCard className="h-4 w-4 text-white" /> : <Smartphone className="h-4 w-4 text-white" />}
                                            <span className="text-[8px] uppercase font-black mt-1 text-muted-foreground">Source</span>
                                        </div>
                                        <div className="flex-1 flex flex-col items-center px-2">
                                            <div className="w-full h-px bg-white/10 relative">
                                                {method.isActive && (
                                                    <motion.div
                                                        className="absolute h-1 w-1 bg-primary rounded-full top-1/2 -translate-y-1/2 shadow-[0_0_8px_var(--primary)]"
                                                        animate={{ left: ["0%", "100%"] }}
                                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                    />
                                                )}
                                            </div>
                                            <span className={cn(
                                                "text-[10px] font-bold italic mt-1",
                                                method.isActive ? "text-primary" : "text-muted-foreground"
                                            )}>{method.gateway}</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <Zap className={cn("h-4 w-4 fill-current", method.isActive ? "text-primary" : "text-muted-foreground")} />
                                            <span className={cn("text-[8px] uppercase font-black mt-1", method.isActive ? "text-primary" : "text-muted-foreground")}>Flow</span>
                                        </div>
                                    </div>

                                    {/* Stats Row */}
                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-0.5">Uptime</span>
                                            <div className="flex items-center gap-1">
                                                <Activity className={cn("h-3 w-3", method.isActive ? "text-emerald-500" : "text-muted-foreground")} />
                                                <span className={cn("text-sm font-bold", method.isActive ? "text-emerald-500" : "text-muted-foreground")}>{method.uptime}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-0.5">Statut</span>
                                            <div className={cn(
                                                "flex items-center gap-1.5 px-3 py-1 border rounded-full",
                                                method.isActive
                                                    ? "bg-emerald-500/10 border-emerald-500/20"
                                                    : "bg-white/5 border-white/10"
                                            )}>
                                                <div className={cn(
                                                    "h-1.5 w-1.5 rounded-full",
                                                    method.isActive ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" : "bg-muted-foreground"
                                                )} />
                                                <span className={cn(
                                                    "text-[10px] font-black uppercase tracking-tighter",
                                                    method.isActive ? "text-emerald-500" : "text-muted-foreground"
                                                )}>
                                                    {method.isActive ? "Opérationnel" : "Désactivé"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            "w-full h-11 rounded-xl bg-white/5 border border-white/5 transition-all group/btn font-bold text-xs gap-2",
                                            method.isActive ? "hover:bg-primary hover:text-white" : "opacity-50 cursor-not-allowed"
                                        )}
                                        disabled={!method.isActive}
                                    >
                                        Configurer <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* System Health Summary Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/10 gap-6">
                <div className="flex items-center gap-6">
                    <div className={cn(
                        "h-14 w-14 rounded-2xl flex items-center justify-center shadow-inner",
                        activeCount === methods.length ? "bg-emerald-500/10" : "bg-amber-500/10"
                    )}>
                        {activeCount === methods.length ? (
                            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                        ) : (
                            <div className="relative">
                                <Activity className="h-8 w-8 text-amber-500" />
                                <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-background" />
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Système Global</h3>
                        <p className="text-sm text-muted-foreground">
                            {activeCount} sur {methods.length} méthodes critiques sont <span className={cn("font-bold", activeCount === methods.length ? "text-emerald-500" : "text-amber-500")}>ACTIVES</span>.
                        </p>
                    </div>
                </div>
                <div className="flex -space-x-3">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-card flex items-center justify-center overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="user" className="h-full w-full object-cover" />
                        </div>
                    ))}
                    <div className="h-10 w-10 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                        +12
                    </div>
                </div>
            </div>
        </div>
    );
}
