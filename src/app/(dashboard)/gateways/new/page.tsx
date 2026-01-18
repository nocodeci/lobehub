"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Zap,
    ArrowLeft,
    ShieldCheck,
    Globe,
    Lock,
    ChevronRight,
    CheckCircle2,
    Loader2,
    AlertCircle
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createGateway, validateGatewayCredentials, getGateways } from "@/lib/actions/gateways";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

const providers = [
    {
        id: 'paydunya',
        name: 'PayDunya',
        website: 'https://paydunya.com',
        description: "Leader des paiements digitaux en Afrique Francophone (UEMOA).",
        methods: [
            'Orange Money Sénégal', 'Wave Sénégal', 'Free Money', 'Wizall Money', 'Expresso',
            'Orange Côte d\'Ivoire', 'MTN Côte d\'Ivoire', 'Wave Côte d\'Ivoire', 'Moov Côte d\'Ivoire',
            'MTN Bénin', 'Moov Bénin',
            'T-Money Togo', 'Moov Togo',
            'Orange Mali', 'Orange Burkina Faso',
            'Visa / MasterCard', 'GIM-UEMOA'
        ],
        color: 'bg-blue-500',
        status: 'active',
        logoUrl: '/logos/paydunya.png'
    },
    {
        id: 'pawapay',
        name: 'PawaPay',
        methods: [
            'M-Pesa Kenya', 'Airtel Kenya',
            'Orange Money Côte d\'Ivoire', 'MTN Côte d\'Ivoire', 'Wave Côte d\'Ivoire',
            'MTN Cameroon', 'Orange Money Cameroon',
            'MTN Ghana', 'Vodafone Ghana', 'AirtelTigo Ghana',
            'MTN Uganda', 'Airtel Uganda',
            'MTN Zambia', 'Airtel Zambia',
            'Vodacom Tanzania', 'Tigo Pesa Tanzania', 'Airtel Tanzania',
            'M-Pesa Mozambique', 'Vodacom Mozambique',
            'Airtel Rwanda', 'MTN Rwanda',
            'Orange Guinea', 'MTN Benin', 'Airtel Malawi', 'Airtel Nigeria', 'MTN Congo'
        ],
        color: 'bg-emerald-500',
        website: 'https://pawapay.io',
        description: "L'agrégateur mobile money le plus vaste d'Afrique.",
        status: 'active',
        logoUrl: '/logos/pawapay.png'
    },
    {
        id: 'flutterwave',
        name: 'Flutterwave',
        methods: ['Cartes Bancaires', 'Mobile Money', 'Bank Transfer', 'Barter', 'Apple Pay', 'Google Pay'],
        color: 'bg-orange-500',
        website: 'https://flutterwave.com',
        description: "Infrastructure de paiement globale pour l'Afrique.",
        status: 'coming_soon',
        logoUrl: '/logos/flutterwave.png'
    },
    {
        id: 'cinetpay',
        name: 'CinetPay',
        methods: ['Mobile Money', 'Cartes', 'Wallets Afrique'],
        color: 'bg-blue-600',
        status: 'coming_soon',
        website: 'https://cinetpay.com',
        description: "Guichet unique pour l'encaissement en Afrique de l'Ouest et Centrale.",
        logoUrl: '/logos/cinetpay.png'
    }
];

const getMethodLogo = (method: string) => {
    const m = method.toLowerCase();
    if (m.includes('orange')) return '/logos/orange-money.png';
    if (m.includes('wave')) return '/logos/wave.png';
    if (m.includes('free')) return 'https://paydunya.com/refont/images/icon_pydu/partners/free.png';
    if (m.includes('mtn')) return '/logos/mtn-momo.png';
    if (m.includes('moov')) return 'https://paydunya.com/refont/images/icon_pydu/partners/moov.png';
    if (m.includes('visa')) return 'https://paydunya.com/refont/images/icon_pydu/partners/visa.png';
    if (m.includes('mastercard')) return 'https://paydunya.com/refont/images/icon_pydu/partners/mastercard.png';
    if (m.includes('wizall')) return 'https://paydunya.com/refont/images/icon_pydu/partners/wizall.png';
    if (m.includes('m-pesa')) return '/logos/m-pesa.png';
    if (m.includes('airtel')) return '/logos/airtel-money.png';
    return null;
};

export default function NewGatewayPage() {
    const [selectedProvider, setSelectedProvider] = useState("");
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [masterKey, setMasterKey] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [token, setToken] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [mode, setMode] = useState<'test' | 'live'>('test');
    const [error, setError] = useState("");
    const [existingGateways, setExistingGateways] = useState<any[]>([]);
    const [activeDetailsProvider, setActiveDetailsProvider] = useState<string | null>(null);

    const detailsProvider = providers.find(p => p.id === activeDetailsProvider);

    useEffect(() => {
        const fetchExisting = async () => {
            const data = await getGateways();
            setExistingGateways(data);
        };
        fetchExisting();
    }, []);

    const nextStep = () => {
        const provider = providers.find(p => p.id === selectedProvider);
        if (provider?.status === 'active') {
            setStep(prev => prev + 1);
        }
    };
    const prevStep = () => setStep(prev => prev - 1);

    const handleCreateGateway = async () => {
        setIsLoading(true);
        setError("");
        const providerData = providers.find(p => p.id === selectedProvider);
        if (!providerData || providerData.status !== 'active') return;

        try {
            const config = selectedProvider === 'paydunya' ? {
                masterKey,
                privateKey,
                token,
                mode,
            } : {
                apiKey,
                mode,
            };

            // 1. Validation des clés en temps réel
            const validation = await validateGatewayCredentials(selectedProvider, config);

            if (!validation.success) {
                setError(validation.message || "Les identifiants fournis sont invalides.");
                setIsLoading(false);
                return;
            }

            // 2. Création si validation OK
            const result = await createGateway({
                name: providerData.name,
                countries: selectedProvider === 'paydunya'
                    ? ['Sénégal', 'Bénin', 'Côte d\'Ivoire', 'Burkina Faso', 'Togo', 'Mali']
                    : ['Kenya', 'Zambia', 'Uganda', 'Cameroon', 'Ghana', 'Tanzania', 'Rwanda', 'Mozambique'],
                config,
                status: "active",
                logo: providerData.logoUrl
            });

            if (result.success) {
                setStep(3);
            } else {
                setError(result.error || "Erreur lors de l'enregistrement de la passerelle.");
            }
        } catch (error: any) {
            setError(error.message || "Une erreur inattendue est survenue.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-xl mx-auto py-10 px-4">
            {/* Header section - Compact & Modern */}
            <div className="flex items-center gap-4">
                <Link href="/gateways">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border border-white/5 bg-white/[0.02] hover:bg-white/[0.05]">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-white">
                        Nouvelle Connexion
                    </h1>
                    <p className="text-xs text-muted-foreground mt-0.5">Configurez votre passerelle en moins de 2 minutes.</p>
                </div>
            </div>

            {/* Subtle Stepper */}
            <div className="flex items-center gap-2">
                {[1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className={`h-1 rounded-full flex-1 transition-all duration-500 ${step >= s ? 'bg-primary' : 'bg-white/5'}`}
                    />
                ))}
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-1 gap-4">
                            {providers.map((provider) => {
                                const isConnected = existingGateways.some(g => g.name === provider.name);
                                const isComingSoon = provider.status === 'coming_soon';

                                return (
                                    <div
                                        key={provider.id}
                                        role="button"
                                        aria-disabled={isComingSoon || isConnected}
                                        onClick={() => {
                                            if (!isComingSoon && !isConnected) {
                                                setSelectedProvider(provider.id);
                                            }
                                        }}
                                        className={`group relative p-6 rounded-2xl border transition-all text-left flex items-center gap-5 cursor-pointer ${selectedProvider === provider.id
                                            ? 'bg-primary/[0.03] border-primary/40 shadow-sm'
                                            : (isComingSoon || isConnected)
                                                ? 'opacity-60 cursor-not-allowed bg-white/[0.01] border-white/5'
                                                : 'bg-card border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
                                            }`}
                                    >
                                        <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center overflow-hidden p-1.5 shrink-0">
                                            <img src={provider.logoUrl} alt={provider.name} className="w-full h-full object-contain" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-sm text-white">{provider.name}</h3>
                                                    {isConnected && (
                                                        <Badge variant="outline" className="text-[9px] h-4 px-1.5 border-primary/20 bg-primary/5 text-primary">
                                                            Connecté
                                                        </Badge>
                                                    )}
                                                    {isComingSoon && (
                                                        <Badge variant="outline" className="text-[9px] h-4 px-1.5 border-white/10 bg-white/5 text-muted-foreground uppercase tracking-widest font-black">
                                                            Bientôt
                                                        </Badge>
                                                    )}
                                                </div>
                                                {selectedProvider === provider.id && (
                                                    <CheckCircle2 className="h-4 w-4 text-primary" />
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-1 mt-1.5 text-ellipsis overflow-hidden">
                                                {provider.methods.slice(0, 5).map(m => {
                                                    const logo = getMethodLogo(m);
                                                    return (
                                                        <div key={m} className="flex items-center gap-1 bg-white/[0.03] px-2 py-0.5 rounded-md border border-white/[0.02]">
                                                            {logo && <img src={logo} alt="" className="h-2.5 w-2.5 object-contain" />}
                                                            <span className="text-[9px] font-medium text-white/40">{m.split(' ')[0]}</span>
                                                        </div>
                                                    );
                                                })}
                                                {provider.methods.length > 5 && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveDetailsProvider(provider.id);
                                                        }}
                                                        className="text-[9px] text-muted-foreground ml-1 underline transition-colors hover:text-primary z-10 relative"
                                                    >
                                                        +{provider.methods.length - 5} autres
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-end pt-2">
                            <Button
                                disabled={!selectedProvider}
                                onClick={nextStep}
                                className="h-10 px-8 rounded-xl bg-primary hover:bg-primary/90 text-black font-semibold text-xs transition-all"
                            >
                                Continuer <ChevronRight className="h-3.5 w-3.5 ml-2" />
                            </Button>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <Card className="border border-white/5 bg-card rounded-2xl overflow-hidden">
                            <CardHeader className="p-6 border-b border-white/5 flex flex-row items-center gap-4 space-y-0">
                                <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <Lock className="h-4 w-4 text-blue-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-base font-bold text-white tracking-tight">Identifiants {providers.find(p => p.id === selectedProvider)?.name}</CardTitle>
                                    <CardDescription className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider">Connexion sécurisée via API</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex gap-3 items-center"
                                    >
                                        <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                                        <p className="text-[10px] text-destructive font-medium leading-tight">
                                            {error}
                                        </p>
                                    </motion.div>
                                )}
                                <div className="space-y-3">
                                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Environnement</Label>
                                    <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl w-fit border border-white/5 shadow-inner">
                                        <button
                                            onClick={() => setMode('test')}
                                            className={`px-5 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${mode === 'test' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'text-muted-foreground hover:text-white'}`}
                                        >
                                            Sandbox
                                        </button>
                                        <button
                                            onClick={() => setMode('live')}
                                            className={`px-5 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${mode === 'live' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'text-muted-foreground hover:text-white'}`}
                                        >
                                            Production
                                        </button>
                                    </div>
                                </div>

                                {selectedProvider === 'paydunya' ? (
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="masterKey" className="text-[10px] uppercase font-semibold text-muted-foreground">Master Key</Label>
                                            <Input
                                                id="masterKey"
                                                placeholder="Indiquez votre Master Key..."
                                                className="h-10 bg-white/[0.02] border-white/5 rounded-xl px-4 text-xs font-mono focus:ring-primary/20 focus:bg-white/[0.04] transition-all"
                                                value={masterKey}
                                                onChange={(e) => setMasterKey(e.target.value)}
                                                autoComplete="off"
                                                autoCorrect="off"
                                                autoCapitalize="none"
                                                spellCheck={false}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="privateKey" className="text-[10px] uppercase font-semibold text-muted-foreground">Private Key</Label>
                                            <Input
                                                id="privateKey"
                                                type="password"
                                                placeholder="sk_test_..."
                                                className="h-10 bg-white/[0.02] border-white/5 rounded-xl px-4 text-xs font-mono focus:ring-primary/20 transition-all text-security"
                                                value={privateKey}
                                                onChange={(e) => setPrivateKey(e.target.value)}
                                                autoComplete="new-password"
                                                autoCorrect="off"
                                                autoCapitalize="none"
                                                spellCheck={false}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="token" className="text-[10px] uppercase font-semibold text-muted-foreground">Token Boutique</Label>
                                            <Input
                                                id="token"
                                                placeholder="Entrez votre Token..."
                                                className="h-10 bg-white/[0.02] border-white/5 rounded-xl px-4 text-xs font-mono transition-all"
                                                value={token}
                                                onChange={(e) => setToken(e.target.value)}
                                                autoComplete="off"
                                                autoCorrect="off"
                                                autoCapitalize="none"
                                                spellCheck={false}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="apiKey" className="text-[10px] uppercase font-semibold text-muted-foreground">Clé API (Merchant Token)</Label>
                                            <Input
                                                id="apiKey"
                                                type="password"
                                                placeholder="v1_live_..."
                                                className="h-10 bg-white/[0.02] border-white/5 rounded-xl px-4 text-xs font-mono focus:ring-primary/20 transition-all text-security"
                                                value={apiKey}
                                                onChange={(e) => setApiKey(e.target.value)}
                                                autoComplete="new-password"
                                                autoCorrect="off"
                                                autoCapitalize="none"
                                                spellCheck={false}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex gap-3 items-start">
                                    <ShieldCheck className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                                        Vos identifiants sont chiffrés avec <span className="text-white font-medium">AES-256-GCM</span>.
                                        Données isolées et sécurisées.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-between items-center mt-6">
                            <Button variant="ghost" disabled={isLoading} onClick={prevStep} className="h-10 px-6 rounded-xl text-xs font-medium text-muted-foreground hover:text-white">
                                Retour
                            </Button>
                            <Button
                                onClick={handleCreateGateway}
                                disabled={isLoading || (selectedProvider === 'paydunya' ? (!masterKey || !privateKey || !token) : !apiKey)}
                                className="h-10 px-8 rounded-xl bg-primary hover:bg-primary/90 text-black font-semibold text-xs shadow-sm"
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-black" /> : "Activer la passerelle"}
                            </Button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center text-center py-6"
                    >
                        <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-500">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>

                        <h2 className="text-xl font-bold tracking-tight text-white mb-2">Configuration réussie</h2>
                        <p className="text-xs text-muted-foreground max-w-[280px] leading-relaxed mb-8">
                            Votre passerelle <span className="text-white font-medium">{providers.find(p => p.id === selectedProvider)?.name}</span> est désormais active et prête à l'emploi.
                        </p>

                        <div className="grid gap-3 w-full max-w-[240px]">
                            <Link href="/gateways" className="w-full">
                                <Button className="w-full h-10 rounded-xl font-semibold text-xs text-black">
                                    Voir mes passerelles
                                </Button>
                            </Link>
                            <Button variant="outline" className="h-10 rounded-xl text-xs border-white/5 hover:bg-white/5 font-medium">
                                Tutoriel webhooks
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Sheet open={!!activeDetailsProvider} onOpenChange={(open) => !open && setActiveDetailsProvider(null)}>
                <SheetContent className="overflow-y-auto bg-card border-l border-white/10 backdrop-blur-xl w-full sm:w-[500px]">
                    {detailsProvider && (
                        <>
                            <SheetHeader className="pb-6 border-b border-white/5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center p-2 shadow-lg border border-white/10">
                                        <img src={detailsProvider.logoUrl} alt={detailsProvider.name} className="w-full h-full object-contain" />
                                    </div>
                                    <Badge variant="outline" className={`${detailsProvider.color} bg-opacity-10 text-white border-white/10`}>
                                        {detailsProvider.status === 'active' ? 'Disponible' : 'Bientôt'}
                                    </Badge>
                                </div>
                                <div>
                                    <SheetTitle className="text-2xl font-black italic tracking-tighter uppercase text-white">{detailsProvider.name}</SheetTitle>
                                    <SheetDescription className="text-muted-foreground font-medium mt-1">
                                        {detailsProvider.description}
                                    </SheetDescription>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <Link href={detailsProvider.website} target="_blank" className="flex-1">
                                        <Button variant="outline" className="w-full gap-2 border-white/10 bg-white/5 hover:bg-white/10 rounded-xl font-bold">
                                            <Globe className="h-4 w-4" /> Site Officiel
                                        </Button>
                                    </Link>
                                </div>
                            </SheetHeader>
                            <div className="py-6 space-y-6">
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Méthodes de Paiement ({detailsProvider.methods.length})</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {detailsProvider.methods.map((method) => (
                                            <div key={method} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                                {getMethodLogo(method) && (
                                                    <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center p-1 shrink-0">
                                                        <img src={getMethodLogo(method)!} alt="" className="w-full h-full object-contain" />
                                                    </div>
                                                )}
                                                <span className="text-xs font-bold leading-tight">{method}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
