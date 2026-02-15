"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Link as LinkIcon,
    Copy,
    Check,
    MoreHorizontal,
    Eye,
    Trash2,
    Clock,
    CreditCard,
    Settings,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { getPaymentLinks } from "@/lib/actions/payment-links";
import { toast } from "sonner";
import Link from "next/link";

export default function PaymentLinksPage() {
    const [links, setLinks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        setIsLoading(true);
        const data = await getPaymentLinks();
        setLinks(data);
        setIsLoading(false);
    };

    const handleCopy = (id: string, slug: string) => {
        const url = `${window.location.origin}/pay/${slug}`;
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        toast.success("Lien copié dans le presse-papier");
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="flex flex-col gap-8 min-h-screen pb-20">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Liens de paiement</h1>
                    <p className="text-muted-foreground">
                        Gérez vos pages de paiement et collectez vos revenus en direct.
                    </p>
                </div>

                <Link href="/payment-links/new">
                    <Button className="gap-2 bg-primary shadow-lg shadow-primary/20 h-11 px-6 rounded-xl hover:scale-105 transition-transform text-black font-bold">
                        <Plus className="h-4 w-4" /> Nouveau Lien
                    </Button>
                </Link>
            </div>

            {/* Content Section */}
            {isLoading ? (
                <div className="flex h-[400px] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : links.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence mode="popLayout">
                        {links.map((link, index) => (
                            <motion.div
                                key={link.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05, type: "spring", damping: 15 }}
                            >
                                <Card className="relative overflow-hidden border border-white/10 bg-card/60 backdrop-blur-xl shadow-2xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-500 group rounded-[2.5rem] p-4">
                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                                    <CardHeader className="pb-4 relative">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                                <LinkIcon className="h-6 w-6 text-primary" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="rounded-full bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest italic">
                                                    Opérationnel
                                                </Badge>
                                            </div>
                                        </div>
                                        <CardTitle className="text-2xl font-black italic uppercase tracking-tighter truncate group-hover:text-primary transition-colors">
                                            {link.title}
                                        </CardTitle>
                                        <CardDescription className="line-clamp-1 italic text-xs font-medium opacity-60">
                                            {link.description || "Prêt pour les transactions souveraines"}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-6 pt-4">
                                        <div className="flex flex-col gap-1 p-5 rounded-[1.5rem] bg-white/[0.03] border border-white/5">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Montant fixé</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-3xl font-black text-white italic tracking-tighter">
                                                    {new Intl.NumberFormat('fr-FR').format(link.amount)}
                                                </span>
                                                <span className="text-sm font-black text-primary italic uppercase tracking-tighter">XOF</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                className="flex-1 h-14 rounded-2xl bg-white text-black hover:bg-white/90 text-sm font-black uppercase tracking-tighter italic shadow-xl transition-all"
                                                onClick={() => handleCopy(link.id, link.slug)}
                                            >
                                                {copiedId === link.id ? (
                                                    <>
                                                        <Check className="h-4 w-4 mr-2" />
                                                        Copié !
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="h-4 w-4 mr-2" />
                                                        Copier URL
                                                    </>
                                                )}
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10">
                                                        <Settings className="h-5 w-5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 bg-card border-white/10 backdrop-blur-2xl rounded-3xl p-3 shadow-2xl">
                                                    <div className="px-2 py-2 mb-2 border-b border-white/5">
                                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Gestion Directe</p>
                                                    </div>
                                                    <DropdownMenuItem className="rounded-xl gap-3 py-3 px-4 cursor-pointer focus:bg-primary/10 focus:text-primary transition-colors">
                                                        <Eye className="h-4 w-4" />
                                                        <span className="text-xs font-bold uppercase tracking-tight">Ouvrir la page</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-xl gap-3 py-3 px-4 cursor-pointer focus:bg-destructive/10 text-destructive focus:text-destructive transition-colors">
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="text-xs font-bold uppercase tracking-tight">Désactiver</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div className="flex items-center justify-between px-2 pt-2 text-[10px] text-muted-foreground font-black uppercase tracking-widest italic group-hover:text-white/60 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-3 w-3 text-primary" />
                                                {new Date(link.createdAt).toLocaleDateString('fr-FR')}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                                Live
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center p-20 rounded-[4rem] border border-dashed border-white/10 bg-white/[0.01] text-center"
                >
                    <div className="h-24 w-24 rounded-[2rem] bg-primary/5 flex items-center justify-center mb-8 relative group">
                        <div className="absolute inset-0 bg-primary/20 rounded-[2rem] blur-3xl group-hover:bg-primary/30 transition-all scale-150 opacity-50" />
                        <LinkIcon className="h-12 w-12 text-primary relative z-10" />
                    </div>
                    <h3 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-4">
                        Flux de revenus <span className="text-primary italic text-gradient">Vierges</span>
                    </h3>
                    <p className="text-muted-foreground max-w-sm mb-10 italic font-medium opacity-60">
                        Capturez l'essence de votre business en créant vos premiers liens de paiement ultra-rapides.
                    </p>
                    <Link href="/payment-links/new">
                        <Button className="gap-3 bg-primary text-black font-black uppercase tracking-tighter italic h-16 px-10 rounded-2xl shadow-2xl shadow-primary/20 hover:scale-[1.05] transition-transform">
                            <Plus className="h-5 w-5" /> Générer mon premier lien
                        </Button>
                    </Link>
                </motion.div>
            )}
        </div>
    );
}
