"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    Lock,
    Smartphone,
    User,
    Mail,
    ArrowRight,
    CheckCircle2,
    Globe,
    CreditCard,
    Zap,
    ChevronDown,
    Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getPaymentLinkBySlug, initializePaymentLinkTransaction } from "@/lib/actions/payment-links";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

export default function PublicPaymentPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [link, setLink] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    // Customer info
    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");

    useEffect(() => {
        if (slug) {
            fetchLink();
        }
    }, [slug]);

    const fetchLink = async () => {
        setIsLoading(true);
        const data = await getPaymentLinkBySlug(slug);
        if (data) {
            setLink(data);
        }
        setIsLoading(false);
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const result = await initializePaymentLinkTransaction({
                slug,
                customerName,
                customerEmail,
                customerPhone,
                quantity
            });

            if (result.success && result.transactionId) {
                toast.success("Transaction initialisée");
                // Redirect to checkout page
                window.location.href = `/checkout/${result.transactionId}`;
            } else {
                toast.error(result.error || "Erreur lors de l'initialisation");
            }
        } catch (error) {
            toast.error("Une erreur imprévue est survenue");
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
                <div className="relative">
                    <div className="h-24 w-24 rounded-full border-t-2 border-primary animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Zap className="h-8 w-8 text-primary animate-pulse" />
                    </div>
                </div>
                <p className="mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-white/40 animate-pulse">
                    Sécurisation du flux...
                </p>
            </div>
        );
    }

    if (!link) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full space-y-6"
                >
                    <div className="h-20 w-20 rounded-3xl bg-red-500/10 flex items-center justify-center mx-auto mb-8 border border-red-500/20">
                        <Activity className="h-10 w-10 text-red-500" />
                    </div>
                    <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Lien de paiement expiré ou introuvable</h1>
                    <p className="text-muted-foreground italic font-medium">Le terminal que vous tentez d'atteindre n'est plus actif sur le réseau AfriFlow.</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020202] selection:bg-primary/30 text-white font-sans overflow-x-hidden">
            {/* Background Aesthetics */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute top-[20%] -right-[10%] w-[30%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 brightness-100 mix-blend-overlay" />
            </div>

            <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-12 min-h-screen">

                {/* Product Detail Section (Left) */}
                <div className="lg:col-span-5 flex flex-col justify-center p-8 lg:p-12 space-y-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <span className="text-xl">💎</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">Terminal Sécurisé</span>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter leading-[0.9] text-white">
                            {link.title}
                        </h1>

                        <p className="text-lg text-white/50 italic font-medium leading-relaxed max-w-md">
                            {link.description || "Finalisez votre transaction en toute sécurité via notre infrastructure de paiement souveraine."}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-3xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Zap className="h-20 w-20 text-primary" />
                        </div>

                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 italic">Total à régler</p>
                        <div className="flex items-baseline gap-3">
                            <span className="text-6xl font-black italic tracking-tighter text-white">
                                {new Intl.NumberFormat('fr-FR').format(link.amount * quantity)}
                            </span>
                            <span className="text-xl font-black text-primary italic uppercase tracking-widest">{link.currency}</span>
                        </div>

                        {link.allowQuantity && (
                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                <span className="text-xs font-bold italic text-white/40">Quantité</span>
                                <div className="flex items-center gap-4 bg-black/40 rounded-xl p-1 border border-white/5">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors text-lg"
                                    >–</button>
                                    <span className="text-sm font-black italic w-6 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors text-lg"
                                    >+</button>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { icon: ShieldCheck, text: "Cryptage SSL 256-bit" },
                            { icon: CheckCircle2, text: "Approuvé par AfriFlow" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 opacity-40">
                                <item.icon className="h-3.5 w-3.5 text-primary" />
                                <span className="text-[9px] font-black uppercase tracking-widest italic">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Checkout Form Section (Right) */}
                <div className="lg:col-span-7 bg-white/[0.02] border-l border-white/5 backdrop-blur-lg flex items-center justify-center p-8 lg:p-12 relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-full max-w-lg space-y-8"
                    >
                        <div className="space-y-2 mb-10">
                            <h2 className="text-xl font-black italic uppercase tracking-tight text-white">Vos informations</h2>
                            <p className="text-xs text-muted-foreground italic font-medium">Remplissez ces champs pour générer votre reçu de paiement.</p>
                        </div>

                        <form onSubmit={handlePayment} className="space-y-6">
                            <div className="grid gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Nom complet</Label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <Input
                                            required
                                            placeholder="ex: Jean Dupont"
                                            className="bg-white/[0.03] border-white/10 h-14 rounded-2xl pl-12 pr-6 focus:ring-primary/20 text-sm font-medium transition-all"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Adresse Email</Label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">
                                            <Mail className="h-4 w-4" />
                                        </div>
                                        <Input
                                            required
                                            type="email"
                                            placeholder="ex: jean@email.com"
                                            className="bg-white/[0.03] border-white/10 h-14 rounded-2xl pl-12 pr-6 focus:ring-primary/20 text-sm font-medium transition-all"
                                            value={customerEmail}
                                            onChange={(e) => setCustomerEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {link.requestPhone && (
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Numéro WhatsApp (Requis)</Label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">
                                                <Smartphone className="h-4 w-4" />
                                            </div>
                                            <Input
                                                required
                                                placeholder="+225 00 00 00 00 00"
                                                className="bg-white/[0.03] border-white/10 h-14 rounded-2xl pl-12 pr-6 focus:ring-primary/20 text-sm font-medium transition-all"
                                                value={customerPhone}
                                                onChange={(e) => setCustomerPhone(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-6">
                                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 mb-8 flex items-start gap-4">
                                    <div className="h-10 w-10 min-w-[2.5rem] rounded-xl bg-primary/20 flex items-center justify-center">
                                        <Lock className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">Paiement Sécurisé</p>
                                        <p className="text-[11px] text-primary/70 italic font-medium leading-relaxed">
                                            En cliquant sur le bouton ci-dessous, vous serez redirigé vers notre passerelle sécurisée pour finaliser le règlement.
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    className="w-full h-20 rounded-3xl bg-primary text-black text-xl font-black uppercase tracking-tighter italic shadow-[0_20px_60px_rgba(var(--primary-rgb),0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all gap-4 group"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <div className="flex items-center gap-3">
                                            <div className="h-5 w-5 border-2 border-black/20 border-t-black animate-spin rounded-full" />
                                            <span>Traitement...</span>
                                        </div>
                                    ) : (
                                        <>
                                            Procéder au paiement
                                            <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>

                        <div className="flex flex-col items-center gap-6 pt-8 border-t border-white/5">
                            <div className="flex items-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                                <img src="https://paydunya.com/refont/images/icon_pydu/partners/om.png" className="h-6 object-contain" alt="Orange Money" />
                                <img src="https://paydunya.com/refont/images/icon_pydu/partners/wave.png" className="h-6 object-contain" alt="Wave" />
                                <img src="https://paydunya.com/refont/images/icon_pydu/partners/free.png" className="h-6 object-contain" alt="Free" />
                                <div className="h-6 w-px bg-white/20 mx-2" />
                                <CreditCard className="h-6 w-6" />
                            </div>
                            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20">
                                Powered by AfriFlow Sovereign Payment Engine
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Injected Marketing Scripts (Headless) */}
            {link.facebookPixelId && (
                <script dangerouslySetInnerHTML={{
                    __html: `
                    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
                    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
                    document,'script','https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '${link.facebookPixelId}');
                    fbq('track', 'PageView');
                `}} />
            )}
        </div>
    );
}
