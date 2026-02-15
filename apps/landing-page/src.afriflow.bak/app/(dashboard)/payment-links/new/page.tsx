"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Plus,
    Link as LinkIcon,
    Check,
    Facebook,
    BarChart,
    Webhook,
    Zap,
    Loader2,
    ArrowLeft,
    Eye,
    ExternalLink,
    Calendar,
    ShoppingCart,
    MessageSquare,
    Globe,
    Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createPaymentLink } from "@/lib/actions/payment-links";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function NewPaymentLinkPage() {
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState("XOF");
    const [requestPhone, setRequestPhone] = useState(false);
    const [webhookUrl, setWebhookUrl] = useState("");
    const [facebookPixelId, setFacebookPixelId] = useState("");
    const [googleAdsId, setGoogleAdsId] = useState("");

    // Additional features
    const [allowQuantity, setAllowQuantity] = useState(false);
    const [expiresAt, setExpiresAt] = useState("");
    const [customSuccessMessage, setCustomSuccessMessage] = useState("");

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !amount) {
            toast.error("Veuillez remplir les champs obligatoires");
            return;
        }

        setIsCreating(true);
        const result = await createPaymentLink({
            title,
            description,
            amount: parseFloat(amount),
            currency,
            requestPhone,
            allowQuantity,
            webhookUrl,
            facebookPixelId,
            googleAdsId,
            customSuccessMessage,
            expiresAt: expiresAt ? new Date(expiresAt) : undefined
        });

        if (result.success) {
            toast.success("Lien de paiement déployé avec succès");
            router.push("/payment-links");
        } else {
            toast.error(result.error || "Une erreur est survenue");
        }
        setIsCreating(false);
    };

    return (
        <div className="flex flex-col gap-6 min-h-screen pb-20 max-w-5xl mx-auto px-4 md:px-0">
            {/* Header / Navigation Optimisée */}
            <div className="flex flex-col gap-4">
                <Link
                    href="/payment-links"
                    className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors group w-fit"
                >
                    <div className="h-7 w-7 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                        <ArrowLeft className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest italic">Dashboard</span>
                </Link>

                <div className="flex items-end justify-between border-b border-white/5 pb-6">
                    <div>
                        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white">
                            Nouveau <span className="text-primary italic">Lien</span>
                        </h1>
                        <p className="text-xs text-muted-foreground italic font-medium">Configurez votre terminal de paiement souverain.</p>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20 italic font-black text-[10px] px-3 py-1">
                        SOUVERAIN BETA
                    </Badge>
                </div>
            </div>

            <form onSubmit={handleCreate} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Configuration Card */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                        <Tabs defaultValue="payment_page" className="w-full">
                            <TabsList className="w-full h-12 bg-white/[0.02] border-b border-white/5 rounded-none p-1 flex justify-start px-6 gap-6">
                                <TabsTrigger
                                    value="payment_page"
                                    className="h-full bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none font-bold text-[10px] uppercase tracking-[0.2em] transition-all px-0"
                                >
                                    Configuration
                                </TabsTrigger>
                                <TabsTrigger
                                    value="advanced"
                                    className="h-full bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none font-bold text-[10px] uppercase tracking-[0.2em] transition-all px-0"
                                >
                                    Détails & Marketing
                                </TabsTrigger>
                            </TabsList>

                            <div className="p-8">
                                <TabsContent value="payment_page" className="mt-0 space-y-8">
                                    <div className="grid gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="title" className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Titre de l'offre</Label>
                                            <Input
                                                id="title"
                                                required
                                                placeholder="ex: Consultation Stratégique"
                                                className="bg-white/[0.02] border-white/10 h-12 rounded-xl focus:ring-primary/20 text-sm font-medium px-4"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="amount" className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Tarif Fixe</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="amount"
                                                        type="number"
                                                        required
                                                        placeholder="0.00"
                                                        className="bg-white/[0.02] border-white/10 h-12 rounded-xl pl-4 pr-12 focus:ring-primary/20 text-base font-black italic"
                                                        value={amount}
                                                        onChange={(e) => setAmount(e.target.value)}
                                                    />
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-primary italic">XOF</div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Devise</Label>
                                                <div className="h-12 bg-white/[0.01] border border-white/5 rounded-xl flex items-center px-4 justify-between opacity-50">
                                                    <span className="text-[10px] font-bold text-white/60">Franc CFA</span>
                                                    <span className="text-[9px] font-black text-primary">XOF</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description" className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Présentation</Label>
                                            <textarea
                                                id="description"
                                                rows={3}
                                                placeholder="Expliquez brièvement ce qui est inclus dans ce paiement..."
                                                className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-4 focus:ring-primary/20 text-xs font-medium outline-none text-white/70 resize-none transition-all"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Options de flux */}
                                    <div className="space-y-4 pt-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <ShoppingCart className="h-3 w-3 text-primary" />
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 italic">Options Transactionnelles</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.01] border border-white/5">
                                                <div className="space-y-0.5">
                                                    <p className="text-[10px] font-black uppercase tracking-tight text-white/70 italic">Quantités</p>
                                                    <p className="text-[8px] text-muted-foreground font-medium italic">Autoriser plusieurs achats</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer scale-90">
                                                    <input type="checkbox" className="sr-only peer" checked={allowQuantity} onChange={(e) => setAllowQuantity(e.target.checked)} />
                                                    <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-emerald-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all transition-all shadow-inner"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.01] border border-white/5">
                                                <div className="space-y-0.5">
                                                    <p className="text-[10px] font-black uppercase tracking-tight text-white/70 italic">Contact WhatsApp</p>
                                                    <p className="text-[8px] text-muted-foreground font-medium italic">Collecter le numéro client</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer scale-90">
                                                    <input type="checkbox" className="sr-only peer" checked={requestPhone} onChange={(e) => setRequestPhone(e.target.checked)} />
                                                    <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-emerald-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all transition-all shadow-inner"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="advanced" className="mt-0 space-y-8">
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <BarChart className="h-3 w-3 text-primary" />
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 italic">Marketing & Tracking</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="relative group">
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary opacity-30">
                                                        <Facebook className="h-3.5 w-3.5" />
                                                    </div>
                                                    <Input
                                                        placeholder="Facebook Pixel ID"
                                                        className="bg-white/[0.02] border-white/10 h-11 rounded-xl pl-10 pr-4 text-[10px] font-bold"
                                                        value={facebookPixelId}
                                                        onChange={(e) => setFacebookPixelId(e.target.value)}
                                                    />
                                                </div>
                                                <div className="relative group">
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary opacity-30">
                                                        <Globe className="h-3.5 w-3.5" />
                                                    </div>
                                                    <Input
                                                        placeholder="Google Ads ID"
                                                        className="bg-white/[0.02] border-white/10 h-11 rounded-xl pl-10 pr-4 text-[10px] font-bold"
                                                        value={googleAdsId}
                                                        onChange={(e) => setGoogleAdsId(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <Webhook className="h-3 w-3 text-primary" />
                                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 italic">Actions Automatiques</span>
                                                </div>
                                                <Input
                                                    placeholder="https://votre-api.com/webhooks/payment"
                                                    className="bg-white/[0.02] border-white/10 h-11 rounded-xl px-4 text-[10px] font-medium italic"
                                                    value={webhookUrl}
                                                    onChange={(e) => setWebhookUrl(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-3 w-3 text-primary" />
                                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 italic">Expiration (Optionnel)</span>
                                                </div>
                                                <Input
                                                    type="datetime-local"
                                                    className="bg-white/[0.02] border-white/10 h-11 rounded-xl px-4 text-[10px] font-medium text-white/60"
                                                    value={expiresAt}
                                                    onChange={(e) => setExpiresAt(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <MessageSquare className="h-3 w-3 text-primary" />
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 italic">Expérience de Succès</span>
                                            </div>
                                            <textarea
                                                rows={2}
                                                placeholder="Message personnalisé affiché après paiement..."
                                                className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-4 focus:ring-primary/20 text-xs font-medium outline-none text-white/70 resize-none transition-all"
                                                value={customSuccessMessage}
                                                onChange={(e) => setCustomSuccessMessage(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                </div>

                {/* Sidebar / Deployment Details */}
                <div className="space-y-6">
                    <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 space-y-6 shadow-xl sticky top-6">
                        <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-white/80 italic border-b border-white/5 pb-2">Résumé du Déploiement</h3>

                            <div className="space-y-4 py-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] text-muted-foreground uppercase font-bold italic">Status</span>
                                    <Badge variant="outline" className="text-[8px] uppercase tracking-widest border-emerald-500/20 text-emerald-500 bg-emerald-500/5">PRET A DÉPLOYER</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] text-muted-foreground uppercase font-bold italic">Terminal</span>
                                    <span className="text-[10px] font-black text-white italic">AfriFlow Harmony</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] text-muted-foreground uppercase font-bold italic">Canaux</span>
                                    <div className="flex -space-x-1.5">
                                        {['🇸🇳', '🇨🇮', '🇲🇱'].map((f, i) => (
                                            <div key={i} className="h-4 w-4 rounded-full border border-[#0A0A0A] bg-white/5 flex items-center justify-center text-[10px]">{f}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 space-y-3">
                            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Shield className="h-3 w-3 text-primary" />
                                    <span className="text-[9px] font-black uppercase text-primary tracking-widest italic">Souveraineté Totale</span>
                                </div>
                                <p className="text-[8px] text-primary/70 font-medium italic leading-relaxed">
                                    Vos fonds transitent directement par vos passerelles connectées sans aucun intermédiaire.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 rounded-xl bg-primary text-black text-xs font-black uppercase tracking-widest italic shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                disabled={isCreating}
                            >
                                {isCreating ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                    <Zap className="h-4 w-4 fill-current mr-2" />
                                )}
                                Déployer le Lien
                            </Button>
                        </div>

                        <div className="flex items-center justify-center gap-1.5 opacity-30 pt-2 pb-1">
                            <div className="h-1 w-1 rounded-full bg-white" />
                            <span className="text-[7px] font-black uppercase tracking-[0.3em]">Powered by AfriFlow Engine</span>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
