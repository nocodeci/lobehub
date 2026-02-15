"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Zap,
    ShieldCheck,
    ChevronRight,
    Loader2,
    Check,
    Search,
    ChevronDown,
    Lock,
    Globe,
    ArrowRight,
    Smartphone as Phone
} from "lucide-react";
import {
    getCountries,
    getCountryCallingCode
} from 'react-phone-number-input/input';
import fr from 'react-phone-number-input/locale/fr';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getPublicTransaction } from "@/lib/actions/transactions";
import { getPaymentMethodsByAppId } from "@/lib/actions/methods";
import { initiateSoftPayment } from "@/lib/actions/checkout";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// --- Helper for Emoji Flags ---
const getFlagEmoji = (countryCode: string) => {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
};

// --- Country Data ---
const WORLD_COUNTRIES = getCountries().map(code => ({
    code,
    name: fr[code] || code,
    dial_code: `+${getCountryCallingCode(code)}`,
    flag: getFlagEmoji(code),
    currency: "XOF"
}));

export default function CheckoutPage() {
    const params = useParams();
    const router = useRouter();
    const transactionId = params.id as string;

    const [transaction, setTransaction] = useState<any>(null);
    const [methods, setMethods] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMethod, setSelectedMethod] = useState<any>(null);
    const [isPaying, setIsPaying] = useState(false);

    const [selectedCountryCode, setSelectedCountryCode] = useState(() => {
        if (typeof window === 'undefined') return "SN";
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone.toLowerCase();
            if (tz.includes('abidjan')) return "CI";
            if (tz.includes('dakar')) return "SN";
            if (tz.includes('cotonou')) return "BJ";
            if (tz.includes('bamako')) return "ML";
            if (tz.includes('ouagadougou')) return "BF";
            if (tz.includes('lome')) return "TG";
            if (tz.includes('niamey')) return "NE";
            if (tz.includes('douala') || tz.includes('yaounde')) return "CM";
            if (tz.includes('libreville')) return "GA";
            if (tz.includes('brazzaville')) return "CG";
            if (tz.includes('kinshasa')) return "CD";
            if (tz.includes('ndjamena')) return "TD";
            if (tz.includes('bangui')) return "CF";
            if (tz.includes('conakry')) return "GN";
        } catch (e) { }
        return "SN";
    });
    const [searchCountry, setSearchCountry] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const selectedCountry = useMemo(() =>
        WORLD_COUNTRIES.find(c => c.code === selectedCountryCode) || WORLD_COUNTRIES[0],
        [selectedCountryCode]
    );

    const filteredCountries = useMemo(() =>
        WORLD_COUNTRIES.filter(c =>
            c.name.toLowerCase().includes(searchCountry.toLowerCase()) ||
            c.dial_code.includes(searchCountry)
        ),
        [searchCountry]
    );

    const filteredMethods = useMemo(() => {
        return methods.filter(m => {
            const normalize = (str: string) => str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() || "";
            const dbCountry = normalize(m.country);
            const selectedName = normalize(selectedCountry.name);
            const selectedCode = selectedCountry.code.toLowerCase();

            return (
                dbCountry === selectedName ||
                dbCountry === selectedCode ||
                m.country === "UEMOA" ||
                m.country === "International"
            );
        });
    }, [methods, selectedCountry]);

    // Auto-select first method when country changes
    useEffect(() => {
        if (filteredMethods.length > 0) {
            // Only auto-select if nothing selected OR current selection is not in new list
            const currentStillValid = selectedMethod && filteredMethods.find(m => m.id === selectedMethod.id);
            if (!currentStillValid) {
                setSelectedMethod(filteredMethods[0]);
            }
        }
    }, [filteredMethods, selectedMethod]);

    useEffect(() => {
        if (transactionId) {
            loadData();
        }
    }, [transactionId]);

    const loadData = async () => {
        setIsLoading(true);
        // Artificial delay for aesthetic loading animation (2.5s)
        const minDelay = new Promise(resolve => setTimeout(resolve, 2500));

        try {
            const [tx, _] = await Promise.all([
                getPublicTransaction(transactionId),
                minDelay
            ]);

            if (tx) {
                setTransaction(tx);
                setPhoneNumber(tx.customerPhone || "");
                const availableMethods = await getPaymentMethodsByAppId(tx.applicationId!);
                setMethods(availableMethods);

                // 🌍 Auto-detection logic:
                let detectedCode: string | null = null;

                // A. Try to detect from existing phone number (e.g., +225...)
                if (tx.customerPhone) {
                    const parsed = parsePhoneNumberFromString(tx.customerPhone);
                    if (parsed && parsed.country) {
                        detectedCode = parsed.country;
                    }
                }

                // B. Fallback to Merchant country
                if (!detectedCode && (tx as any).application?.user?.country) {
                    const countryHint = (tx as any).application.user.country.toLowerCase();
                    const found = WORLD_COUNTRIES.find(c =>
                        c.name.toLowerCase() === countryHint ||
                        c.code.toLowerCase() === countryHint
                    );
                    if (found) detectedCode = found.code;
                }

                if (detectedCode) {
                    setSelectedCountryCode(detectedCode);
                } else {
                    // C. Last resort: Browser Timezone check again in case state didn't catch it
                    try {
                        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone.toLowerCase();
                        if (tz.includes('abidjan')) setSelectedCountryCode("CI");
                        else if (tz.includes('dakar')) setSelectedCountryCode("SN");
                        else if (tz.includes('cotonou')) setSelectedCountryCode("BJ");
                        else if (tz.includes('bamako')) setSelectedCountryCode("ML");
                        else if (tz.includes('ouagadougou')) setSelectedCountryCode("BF");
                    } catch (e) { }
                }
            }
        } catch (error) {
            toast.error("Erreur de chargement");
        }
        setIsLoading(false);
    };

    const [paymentStatus, setPaymentStatus] = useState<null | 'initiating' | 'pending_user' | 'require_otp' | 'verifying' | 'success' | 'error'>(null);
    const [paymentInstructions, setPaymentInstructions] = useState<{ title: string, detail: string, icon: any, ussd?: string } | null>(null);
    const [otpCode, setOtpCode] = useState("");

    // --- SoftPay Flow Mapping ---
    const getInstructions = (method: any) => {
        const name = method.name.toLowerCase();
        const country = selectedCountry.code.toUpperCase();

        if (name.includes('wave')) return { title: "Redirection Wave", detail: "Ouverture sécurisée de l'application Wave...", icon: Globe };
        if (name.includes('orange')) {
            const ussdCodes: Record<string, string> = {
                'CI': '#144*82#',
                'SN': '#144*77#',
                'ML': '#144#',
                'BF': '*144*4*6*' // simplified for example
            };
            const code = ussdCodes[country] || '#144#';
            return {
                title: `Génération de Code (${country})`,
                detail: country === 'CI'
                    ? "Dialez le code USSD ci-dessous, puis suivez l'option 2 pour générer votre code de paiement."
                    : "Dialez le code USSD ci-dessous sur votre mobile pour générer votre code de paiement temporaire.",
                ussd: code,
                icon: Phone
            };
        }
        if (name.includes('mtn')) return { title: "Validation MTN Money", detail: "Un message (Push USSD) va apparaître sur votre téléphone. Saisissez votre code PIN pour valider.", icon: Zap };
        if (name.includes('moov')) return { title: "Validation Moov Money", detail: "Une demande de confirmation a été envoyée sur votre mobile. Saisissez votre code secret pour confirmer.", icon: ShieldCheck };
        if (name.includes('free')) return { title: "Instructions Free Money", detail: "Composez le #150# pour valider votre transaction.", icon: Lock };
        return { title: "Validation en cours", detail: "Veuillez suivre les instructions sur votre terminal mobile.", icon: Zap };
    };

    const handleFinalPay = async () => {
        console.log("🖱️ [CLIENT] handleFinalPay triggered", {
            method: selectedMethod?.name,
            phone: phoneNumber,
            txId: transaction?.id
        });

        if (!selectedMethod) {
            toast.error("Veuillez choisir un moyen de paiement");
            return;
        }

        if (!phoneNumber) {
            toast.error("Le numéro de téléphone est requis");
            return;
        }

        console.log("🔄 [CLIENT] Setting status to 'initiating'...");
        setPaymentStatus('initiating');

        const instructions = getInstructions(selectedMethod);
        setPaymentInstructions(instructions);

        try {
            console.log("📡 [CLIENT] Calling initiateSoftPayment server action...");
            const response = await initiateSoftPayment({
                transactionId: transaction.id,
                gatewayId: selectedMethod.gatewayId,
                methodCode: selectedMethod.code,
                customerDetails: {
                    name: transaction.customerName,
                    email: transaction.customerEmail,
                    phone: phoneNumber,
                    country: selectedCountry.code
                }
            });

            console.log("🎯 [CLIENT] Server response received:", response);

            if (!response.success) {
                setPaymentStatus(null);
                toast.error(response.message || "Échec du paiement");
                return;
            }

            const name = selectedMethod.name.toLowerCase();
            if (name.includes('wave') && response.redirectUrl) {
                setPaymentStatus('verifying');
                window.location.href = response.redirectUrl;
                return;
            }

            if (response.status === 'SUCCESS') {
                setPaymentStatus('success');
            } else if (response.status === 'REQUIRE_OTP') {
                setPaymentStatus('require_otp');
            } else if (response.status === 'PENDING') {
                setPaymentStatus('pending_user');
            } else {
                // Fallback for unexpected success status
                setPaymentStatus('pending_user');
            }
        } catch (error) {
            setPaymentStatus(null);
            toast.error("Une erreur technique est survenue");
        }
    };

    const handleVerifyOtp = async () => {
        if (!otpCode) return;

        setPaymentStatus('verifying');

        try {
            const response = await initiateSoftPayment({
                transactionId: transaction.id,
                gatewayId: selectedMethod.gatewayId,
                methodCode: selectedMethod.code,
                customerDetails: {
                    name: transaction.customerName,
                    email: transaction.customerEmail,
                    phone: phoneNumber,
                    country: selectedCountry.code,
                    otp: otpCode
                }
            });

            if (response.success && response.status === 'SUCCESS') {
                setPaymentStatus('success');
            } else if (response.success && response.status === 'REQUIRE_OTP') {
                setPaymentStatus('require_otp');
                toast.error(response.message || "Le code OTP est requis ou invalide. Veuillez réessayer.");
            } else if (response.success && response.status === 'PENDING') {
                setPaymentStatus('pending_user');
            } else {
                setPaymentStatus('require_otp');
                toast.error(response.message || "Échec de la validation du code");
            }
        } catch (error) {
            setPaymentStatus('require_otp');
            toast.error("Erreur lors de la vérification");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="relative">
                    <div className="h-24 w-24 rounded-full border-t-2 border-primary animate-spin" />
                    <Zap className="absolute inset-0 m-auto h-8 w-8 text-primary animate-pulse" />
                </div>
            </div>
        );
    }

    if (!transaction) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4">
                <h1 className="text-xl font-bold text-white uppercase tracking-widest">Transaction Introuvable</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-slate-200 flex items-center justify-center p-4 md:p-8 selection:bg-primary selection:text-black">

            {/* Background Aesthetic Layers */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-emerald-500/5 blur-[100px] rounded-full" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 brightness-100 mix-blend-overlay" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-[480px] z-10"
            >
                {/* Processing Overlay */}
                <AnimatePresence>
                    {paymentStatus && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 rounded-[2rem] overflow-hidden backdrop-blur-3xl bg-black/90 flex flex-col items-center justify-center p-8 text-center gap-8 border border-white/5"
                        >
                            {paymentStatus === 'initiating' && (
                                <div className="space-y-6">
                                    <div className="relative">
                                        <div className="h-20 w-20 rounded-full border-t-2 border-primary animate-spin mx-auto" />
                                        <Zap className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-white italic">Initialisation du Signal</h3>
                                        <div className="flex gap-1 justify-center">
                                            {[1, 2, 3].map(i => <div key={i} className="h-1 w-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />)}
                                        </div>
                                        <p className="text-[10px] font-mono text-white/30 truncate max-w-[200px] mx-auto uppercase">HANDSHAKE_GATEWAY_SECURE_NODE</p>
                                    </div>
                                </div>
                            )}

                            {paymentStatus === 'require_otp' && (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-full space-y-8"
                                >
                                    <div className="space-y-4 text-left">
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white italic">{paymentInstructions?.title}</h3>
                                            <p className="text-[9px] font-medium text-slate-500 leading-relaxed uppercase tracking-widest">
                                                {paymentInstructions?.detail}
                                            </p>
                                        </div>

                                        {paymentInstructions?.ussd && (
                                            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between group relative overflow-hidden">
                                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <div className="flex flex-col gap-1 relative z-10">
                                                    <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em]">Étape 1 : Composer le code</span>
                                                    <span className="text-lg font-mono font-black text-white tracking-widest">{paymentInstructions.ussd}</span>
                                                </div>
                                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary relative z-10">
                                                    <Phone size={18} className="animate-pulse" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-6">
                                        <div className="relative group">
                                            <div className="absolute -top-2 left-4 px-2 bg-[#0A0A0B] text-[8px] font-black text-primary uppercase tracking-[0.3em] z-10">Étape 2 : Saisir le Token reçu</div>
                                            <Input
                                                value={otpCode}
                                                onChange={(e) => setOtpCode(e.target.value)}
                                                placeholder="••••••"
                                                className="h-20 w-full bg-white/[0.03] border-white/10 rounded-2xl text-center text-3xl font-mono tracking-[0.5em] focus:border-primary/50 focus:ring-0 placeholder:text-white/5 transition-all group-hover:bg-white/[0.05]"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Button
                                                onClick={handleVerifyOtp}
                                                disabled={otpCode.length < 4}
                                                className="w-full h-14 rounded-xl bg-white text-black font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all disabled:opacity-20"
                                            >
                                                Vérifier le règlement
                                            </Button>
                                            <button className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">
                                                Renvoyer le code
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {paymentStatus === 'pending_user' && (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="space-y-8"
                                >
                                    <div className="h-16 w-16 bg-white shadow-2xl rounded-2xl flex items-center justify-center mx-auto ring-1 ring-white/20">
                                        {paymentInstructions && <paymentInstructions.icon className="h-8 w-8 text-black" />}
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white italic">{paymentInstructions?.title}</h3>
                                        <p className="text-xs font-medium text-slate-400 leading-relaxed max-w-[240px] mx-auto">
                                            {paymentInstructions?.detail}
                                        </p>
                                    </div>
                                    <div className="pt-4">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="text-[9px] font-black uppercase tracking-widest text-emerald-500 animate-pulse">En attente de votre action...</div>
                                            <Button
                                                variant="ghost"
                                                onClick={() => setPaymentStatus('verifying')}
                                                className="text-[9px] font-black uppercase tracking-tighter text-white/20 hover:text-white"
                                            >
                                                J'ai terminé le règlement
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {paymentStatus === 'verifying' && (
                                <div className="space-y-6">
                                    <div className="relative flex items-center justify-center">
                                        <motion.div
                                            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="absolute h-24 w-24 rounded-full border border-primary"
                                        />
                                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Search className="h-6 w-6 text-primary animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-white">Vérification du Statut</h3>
                                        <p className="text-[10px] font-mono text-white/20 uppercase tracking-tighter">Querying block confirmation...</p>
                                    </div>
                                </div>
                            )}

                            {paymentStatus === 'success' && (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="space-y-6"
                                >
                                    <div className="h-20 w-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(16,185,129,0.4)]">
                                        <Check className="h-10 w-10 text-white" strokeWidth={4} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-black uppercase tracking-widest text-white italic">Règlement Confirmé</h3>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Transaction ID: {transaction.providerRef || 'PAY-' + Math.random().toString(36).substring(7).toUpperCase()}</p>
                                    </div>
                                    <Button onClick={() => router.push('/')} className="h-12 px-8 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-emerald-500 hover:text-white transition-all">
                                        Retour au tableau de bord
                                    </Button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- Main Terminal Card --- */}
                <Card className="bg-[#0A0A0B]/80 backdrop-blur-3xl border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden rounded-[2rem]">

                    {/* Header Section */}
                    <div className="p-8 pb-4 flex items-center justify-between border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-white shadow-xl rounded-xl flex items-center justify-center ring-1 ring-white/10 group overflow-hidden">
                                <Zap className="h-5 w-5 text-black group-hover:scale-110 transition-transform" fill="currentColor" />
                            </div>
                            <div>
                                <h2 className="text-sm font-black tracking-tight text-white uppercase">AfriFlow Terminal</h2>
                                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <Globe size={10} className="text-emerald-500" /> Secure Node v2.1
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-tighter block mb-0.5">ID: {transaction.orderId.split('-')[1]}</span>
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 ml-auto animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        </div>
                    </div>

                    <CardContent className="p-8 space-y-8">

                        {/* Compact Amount Display */}
                        <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Montant total dû</Label>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black text-white tracking-tighter italic">
                                    {new Intl.NumberFormat('fr-FR').format(transaction.amount)}
                                </span>
                                <span className="text-lg font-black text-primary italic">{transaction.currency}</span>
                            </div>
                        </div>

                        {/* Order Details Mini-Grid */}
                        <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                            <div className="space-y-1">
                                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Client</p>
                                <p className="text-xs font-black text-white truncate">{transaction.customerName}</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Date</p>
                                <p className="text-xs font-black text-white">{new Date().toLocaleDateString('fr-FR')}</p>
                            </div>
                        </div>

                        {/* Interaction Area */}
                        <div className="space-y-6">

                            {/* Phone Input with Refined Picker */}
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Identification de règlement</Label>
                                <div className="flex gap-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="h-12 px-4 rounded-xl bg-white/[0.03] border-white/10 hover:bg-white/[0.05] transition-all flex items-center gap-2 group">
                                                <span className="text-xl group-hover:scale-110 transition-transform">{selectedCountry.flag}</span>
                                                <span className="text-xs font-black">{selectedCountry.dial_code}</span>
                                                <ChevronDown size={12} className="opacity-20" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="w-[300px] bg-[#0A0A0B]/95 backdrop-blur-2xl border-white/10 rounded-2xl overflow-hidden p-2">
                                            <div className="relative mb-2 px-2 pt-2">
                                                <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30 mt-1" />
                                                <Input
                                                    placeholder="Pays..."
                                                    value={searchCountry}
                                                    onChange={e => setSearchCountry(e.target.value)}
                                                    className="h-9 rounded-lg pl-9 bg-white/5 border-white/5 text-xs focus:ring-primary/50"
                                                />
                                            </div>
                                            <div className="max-h-[240px] overflow-y-auto custom-scrollbar">
                                                {filteredCountries.map(c => (
                                                    <DropdownMenuItem
                                                        key={c.code}
                                                        onClick={() => setSelectedCountryCode(c.code)}
                                                        className="flex items-center gap-3 h-12 rounded-lg focus:bg-primary focus:text-black cursor-pointer px-4"
                                                    >
                                                        <span className="text-2xl">{c.flag}</span>
                                                        <span className="text-[10px] font-black uppercase flex-1">{c.name}</span>
                                                        <span className="text-[10px] font-mono opacity-50">{c.dial_code}</span>
                                                    </DropdownMenuItem>
                                                ))}
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <Input
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="Numéro de mobile..."
                                        className="h-12 px-5 rounded-xl bg-white/[0.03] border-white/10 focus:border-primary/50 focus:ring-0 text-sm font-bold tracking-widest placeholder:text-white/10"
                                    />
                                </div>
                            </div>

                            {/* Payment Methods (Horizontal and Smaller) */}
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Choisir une méthode d'exécution</Label>
                                <div className="flex gap-3 overflow-x-auto pb-4 snap-x no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                    {filteredMethods.map(m => (
                                        <button
                                            key={m.id}
                                            onClick={() => setSelectedMethod(m)}
                                            className={cn(
                                                "min-w-[110px] shrink-0 p-4 rounded-2xl border transition-all duration-300 snap-center flex flex-col items-center gap-3 relative overflow-hidden group",
                                                selectedMethod?.id === m.id
                                                    ? "bg-white text-black border-primary ring-1 ring-primary/50"
                                                    : "bg-white/[0.05] border-white/10 hover:border-white/30 text-slate-300 hover:text-white hover:bg-white/10"
                                            )}
                                        >
                                            <div className={cn(
                                                "h-10 w-10 rounded-full flex items-center justify-center p-2 bg-white shadow-sm"
                                            )}>
                                                <img
                                                    src={m.logo}
                                                    alt={m.name}
                                                    className={cn(
                                                        "w-full h-full object-contain transition-all duration-300",
                                                        selectedMethod?.id !== m.id && "grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100"
                                                    )}
                                                />
                                            </div>
                                            <div className="text-center">
                                                <span className="text-[8px] font-black uppercase block tracking-tighter whitespace-nowrap">{m.name.split(' ')[0]}</span>
                                            </div>
                                            {selectedMethod?.id === m.id && (
                                                <motion.div layoutId="m-active" className="absolute top-1 right-1">
                                                    <div className="h-3 w-3 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/50">
                                                        <Check size={8} className="text-white" strokeWidth={4} />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </button>
                                    ))}
                                    {methods.length === 0 && (
                                        <div className="w-full h-24 rounded-2xl border border-dashed border-white/5 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase italic">
                                            Aucun canal activé
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Execute Button */}
                        <div className="pt-2">
                            <Button
                                onClick={handleFinalPay}
                                disabled={isPaying || !selectedMethod}
                                className="w-full h-16 rounded-2xl bg-white text-black hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_12px_24px_-8px_rgba(255,255,255,0.2)] flex items-center justify-between px-8 border-none group"
                            >
                                <span className="text-sm font-black uppercase tracking-widest italic flex items-center gap-3">
                                    {isPaying ? <Loader2 size={16} className="animate-spin" /> : <Lock size={14} className="text-black/30 group-hover:text-black transition-colors" />}
                                    {isPaying ? "Signature en cours..." : "Confirmer le règlement"}
                                </span>
                                <div className="h-8 w-8 bg-black/5 rounded-full flex items-center justify-center group-hover:bg-primary transition-all">
                                    <ArrowRight size={16} className="text-black group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </Button>
                        </div>
                    </CardContent>

                    {/* Footer Branding */}
                    <div className="p-6 bg-black/40 flex items-center justify-center gap-2">
                        <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">Synchronisé par</span>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full">
                            <Zap size={10} className="text-primary" fill="currentColor" />
                            <span className="text-[10px] font-black text-white italic tracking-tighter uppercase leading-none">AfriFlow</span>
                        </div>
                    </div>
                </Card>

                {/* Secure Badge Layer */}
                <div className="mt-8 flex items-center justify-center gap-6 opacity-30">
                    {["PCI-DSS Level 1", "TLS 1.3 Certified", "ISO 27001"].map((s, i) => (
                        <span key={i} className="text-[8px] font-black uppercase tracking-widest text-white/40">{s}</span>
                    ))}
                </div>
            </motion.div>

            {/* Float Detail layer */}
            <div className="fixed bottom-8 left-8 hidden lg:block">
                <div className="flex flex-col gap-1 p-4 border-l border-white/10">
                    <span className="text-[10px] font-black text-primary/40 italic uppercase tracking-widest">Hash Statut</span>
                    <span className="text-[10px] font-mono text-white/20 uppercase tracking-tighter">0x4F7...E1A9_STABLE</span>
                </div>
            </div>
        </div>
    );
}
