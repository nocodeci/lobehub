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
    AlertCircle,
    Search,
    Filter,
    CreditCard,
    Smartphone,
    Coins,
    Sparkles,
    LayoutGrid,
    Info,
    ExternalLink
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
        category: 'mobile_money',
        description: "Leader des paiements digitaux en Afrique Francophone (UEMOA).",
        methods: [
            'Orange Money Sénégal', 'Wave Sénégal', 'Free Money', 'Wizall Money', 'Expresso',
            'Orange Côte d\'Ivoire', 'MTN Côte d\'Ivoire', 'Wave Côte d\'Ivoire', 'Moov Côte d\'Ivoire',
            'MTN Bénin', 'Moov Bénin',
            'T-Money Togo', 'Moov Togo',
            'Orange Mali', 'Orange Burkina Faso',
            'Visa / MasterCard', 'GIM-UEMOA'
        ],
        color: 'bg-blue-600',
        status: 'active',
        logoUrl: '/logos/paydunya.svg'
    },
    {
        id: 'pawapay',
        name: 'PawaPay',
        category: 'mobile_money',
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
        color: 'bg-emerald-600',
        website: 'https://pawapay.io',
        description: "L'agrégateur mobile money le plus vaste d'Afrique.",
        status: 'active',
        logoUrl: '/logos/pawapay.svg'
    },
    {
        id: 'flutterwave',
        name: 'Flutterwave',
        category: 'all',
        methods: [
            'MTN Ghana', 'Vodafone Ghana', 'AirtelTigo Ghana',
            'MPesa Kenya', 'Airtel Kenya',
            'MTN Uganda', 'Airtel Uganda',
            'MTN Rwanda', 'Airtel Rwanda',
            'MTN Zambia', 'Airtel Zambia',
            'Orange CI', 'MTN CI', 'Wave CI',
            'USSD Nigeria', 'Barter'
        ],
        color: 'bg-orange-600',
        website: 'https://flutterwave.com',
        description: "Paiements dans 40+ pays africains avec cartes, Mobile Money, et virements.",
        status: 'active',
        logoUrl: '/logos/flutterwave.svg'
    },
    {
        id: 'paystack',
        name: 'Paystack',
        category: 'all',
        methods: [
            'Visa / MasterCard', 'Verve',
            'Bank Transfer Nigeria', 'USSD Nigeria',
            'Mobile Money Ghana', 'MTN Ghana', 'Vodafone Ghana',
            'M-Pesa Kenya',
            'QR Code', 'Bank Account'
        ],
        color: 'bg-cyan-600',
        website: 'https://paystack.com',
        description: "Le leader des paiements au Nigeria avec cartes, banques, USSD et Mobile Money.",
        status: 'active',
        logoUrl: '/logos/paystack.svg'
    },
    {
        id: 'stripe',
        name: 'Stripe',
        category: 'card',
        methods: [
            'Visa / MasterCard', 'Amex', 'Discover',
            'Apple Pay', 'Google Pay',
            'Link', 'SEPA Direct Debit',
            'Bancontact', 'iDEAL'
        ],
        color: 'bg-indigo-600',
        website: 'https://stripe.com',
        description: "La référence mondiale du paiement par carte bancaire et portefeuilles numériques.",
        status: 'active',
        logoUrl: '/logos/stripe.svg'
    },
    {
        id: 'coinbase',
        name: 'Coinbase',
        category: 'crypto',
        methods: [
            'Bitcoin (BTC)', 'Ethereum (ETH)', 'USDC',
            'Litecoin (LTC)', 'Dogecoin (DOGE)',
            'Base', 'Polygon'
        ],
        color: 'bg-blue-600',
        website: 'https://commerce.coinbase.com',
        description: "Acceptez les paiements en cryptomonnaies de manière sécurisée et décentralisée.",
        status: 'active',
        logoUrl: '/logos/coinbase.svg'
    },
    {
        id: 'fedapay',
        name: 'FedaPay',
        category: 'mobile_money',
        methods: [
            'MTN Bénin', 'Moov Bénin', 'Flooz Togo',
            'T-Money Togo', 'Orange CI', 'MTN CI', 'Moov CI',
            'Sénégal (Orange, Wave, Free)',
            'Visa / MasterCard / AMEX'
        ],
        color: 'bg-emerald-600',
        website: 'https://fedapay.com',
        description: "Solution de paiement moderne pour l'Afrique Francophone.",
        status: 'active',
        logoUrl: '/logos/fedapay.svg'
    },
    {
        id: 'kkiapay',
        name: 'Kkiapay',
        category: 'mobile_money',
        methods: [
            'MTN Bénin', 'Moov Bénin', 'Flooz Togo',
            'T-Money Togo', 'Orange CI', 'MTN CI', 'Moov CI',
            'Visa / MasterCard'
        ],
        color: 'bg-orange-600',
        website: 'https://kkiapay.me',
        description: "Solution de paiement leader au Bénin, Togo et Côte d'Ivoire.",
        status: 'active',
        logoUrl: '/logos/kkiapay.svg'
    },
    {
        id: 'cinetpay',
        name: 'CinetPay',
        category: 'mobile_money',
        methods: [
            'Orange CI', 'MTN CI', 'Moov CI', 'Wave CI',
            'Orange Sénégal', 'Free Sénégal', 'Expresso Sénégal',
            'Orange Mali', 'Moov Mali',
            'T-Money Togo', 'Moov Togo',
            'MTN Bénin', 'Moov Bénin',
            'Orange Burkina', 'Moov Burkina',
            'MTN Cameroun', 'Orange Cameroun',
            'Visa / MasterCard'
        ],
        color: 'bg-blue-600',
        status: 'active',
        website: 'https://cinetpay.com',
        description: "L'acteur historique du paiement en Afrique Francophone (CI, SN, ML, TG, BJ, BF, CM).",
        logoUrl: '/logos/cinetpay.svg'
    },
    {
        id: 'feexpay',
        name: 'FeexPay',
        category: 'mobile_money',
        methods: [
            'MTN Bénin', 'Moov Bénin', 'T-Money Togo',
            'Orange CI', 'Wave CI', 'Orange Sénégal',
            'Visa / MasterCard'
        ],
        color: 'bg-purple-600',
        website: 'https://feexpay.me',
        description: "Agrégateur de paiement spécialisé au Bénin et Afrique de l'Ouest.",
        status: 'active',
        logoUrl: '/logos/feexpay.svg'
    },
    {
        id: 'notchpay',
        name: 'NotchPay',
        category: 'all',
        methods: ['Mobile Money Cameroun', 'PayPal'],
        color: 'bg-blue-400',
        website: 'https://notchpay.co',
        description: "Paiements au Cameroun et intégration PayPal.",
        status: 'coming_soon',
        logoUrl: '/logos/notchpay.svg'
    },
    {
        id: 'payplus',
        name: 'Payplus',
        category: 'mobile_money',
        methods: ['Orange Money', 'MTN MoMo'],
        color: 'bg-green-600',
        website: 'https://payplus.africa',
        description: "Acceptation polyvalente dans plusieurs pays africains.",
        status: 'coming_soon',
        logoUrl: '/logos/payplus.svg'
    },
    {
        id: 'cryptomus',
        name: 'Cryptomus',
        category: 'crypto',
        methods: ['USDT', 'BTC', 'ETH', '60+ Cryptos'],
        color: 'bg-slate-700',
        website: 'https://cryptomus.com',
        description: "Passerelle de paiement crypto avancée pour entreprises.",
        status: 'coming_soon',
        logoUrl: '/logos/cryptomus.svg'
    }
];

const getMethodLogo = (method: string) => {
    const m = method.toLowerCase();

    if (m.includes('orange')) return '/logos/orange.svg';
    if (m.includes('wave')) return '/logos/wave.svg';
    if (m.includes('mtn')) return '/logos/mtn.svg';
    if (m.includes('moov')) return '/logos/moov.svg';
    if (m.includes('free')) return '/logos/freemoney.svg';
    if (m.includes('expresso')) return '/logos/expresso.svg';
    if (m.includes('visa') || m.includes('mastercard') || m.includes('verve') || m.includes('gim-uemoa')) return '/logos/credit_card.svg';
    if (m.includes('wizall')) return '/logos/wizall.svg';
    if (m.includes('m-pesa') || m.includes('mpesa') || m.includes('m pesa')) return '/logos/mpesa.svg';
    if (m.includes('airtel')) return '/logos/airtel.svg';
    if (m.includes('t-money') || m.includes('togocel')) return '/logos/togocel.svg';
    if (m.includes('crypto') || m.includes('bitcoin') || m.includes('btc') || m.includes('ethereum') || m.includes('eth') || m.includes('usdt') || m.includes('usdc')) return '/logos/crypto.svg';
    if (m.includes('ussd')) return '/logos/ussd.svg';
    if (m.includes('bank') || m.includes('transfer')) return '/logos/bank_transfer.svg';
    if (m.includes('djamo')) return '/logos/djamo.svg';

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
    const [flwPublicKey, setFlwPublicKey] = useState("");
    const [flwSecretKey, setFlwSecretKey] = useState("");
    const [feexShopId, setFeexShopId] = useState("");
    const [feexApiKey, setFeexApiKey] = useState("");
    const [pskPublicKey, setPskPublicKey] = useState("");
    const [pskSecretKey, setPskSecretKey] = useState("");
    const [cinetApiKey, setCinetApiKey] = useState("");
    const [cinetSiteId, setCinetSiteId] = useState("");
    const [stripeSecretKey, setStripeSecretKey] = useState("");
    const [stripePublishableKey, setStripePublishableKey] = useState("");
    const [stripeWebhookSecret, setStripeWebhookSecret] = useState("");
    const [kkiaPublicKey, setKkiaPublicKey] = useState("");
    const [kkiaPrivateKey, setKkiaPrivateKey] = useState("");
    const [kkiaSecret, setKkiaSecret] = useState("");
    const [cbApiKey, setCbApiKey] = useState("");
    const [cbWebhookSecret, setCbWebhookSecret] = useState("");
    const [fedaApiKey, setFedaApiKey] = useState("");
    const [mode, setMode] = useState<'test' | 'live'>('test');
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    const [error, setError] = useState("");
    const [existingGateways, setExistingGateways] = useState<any[]>([]);
    const [activeDetailsProvider, setActiveDetailsProvider] = useState<string | null>(null);

    const filteredProviders = providers.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === "all" || p.category === activeTab || (activeTab === "all" && p.category === 'all');
        return matchesSearch && matchesTab;
    });

    const tabs = [
        { id: 'all', label: 'Toutes', icon: LayoutGrid },
        { id: 'mobile_money', label: 'Mobile Money', icon: Smartphone },
        { id: 'card', label: 'Cartes', icon: CreditCard },
        { id: 'crypto', label: 'Crypto', icon: Coins },
    ];


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
            let config: any;
            if (selectedProvider === 'paydunya') {
                config = { masterKey, privateKey, token, mode };
            } else if (selectedProvider === 'flutterwave') {
                config = { publicKey: flwPublicKey, secretKey: flwSecretKey, mode };
            } else if (selectedProvider === 'feexpay') {
                config = { shopId: feexShopId, apiKey: feexApiKey, mode: mode === 'test' ? 'SANDBOX' : 'LIVE' };
            } else if (selectedProvider === 'paystack') {
                config = { publicKey: pskPublicKey, secretKey: pskSecretKey, mode };
            } else if (selectedProvider === 'cinetpay') {
                config = { apiKey: cinetApiKey, siteId: cinetSiteId, mode };
            } else if (selectedProvider === 'stripe') {
                config = {
                    secretKey: stripeSecretKey,
                    publishableKey: stripePublishableKey,
                    webhookSecret: stripeWebhookSecret,
                    mode
                };
            } else if (selectedProvider === 'kkiapay') {
                config = {
                    publicKey: kkiaPublicKey,
                    privateKey: kkiaPrivateKey,
                    secret: kkiaSecret,
                    mode
                };
            } else if (selectedProvider === 'coinbase') {
                config = {
                    apiKey: cbApiKey,
                    webhookSecret: cbWebhookSecret,
                    mode
                };
            } else if (selectedProvider === 'fedapay') {
                config = {
                    apiKey: fedaApiKey,
                    mode
                };
            } else {

                config = { apiKey, mode };
            }







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
                countries: (function () {
                    switch (selectedProvider) {
                        case 'paydunya': return ['Sénégal', 'Bénin', 'Côte d\'Ivoire', 'Burkina Faso', 'Togo', 'Mali'];
                        case 'flutterwave': return ['Nigeria', 'Ghana', 'Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Zambia', 'Côte d\'Ivoire', 'Sénégal', 'South Africa'];
                        case 'feexpay': return ['Bénin', 'Togo', 'Côte d\'Ivoire', 'Sénégal', 'Congo'];
                        case 'paystack': return ['Nigeria', 'Ghana', 'South Africa', 'Kenya'];
                        case 'stripe': return ['États-Unis', 'Europe', 'Canada', 'Monde'];
                        case 'kkiapay': return ['Bénin', 'Togo', 'Côte d\'Ivoire'];
                        case 'coinbase': return ['Global'];
                        case 'fedapay': return ['Bénin', 'Togo', 'Côte d\'Ivoire', 'Sénégal', 'Mali', 'Burkina Faso'];
                        case 'cinetpay': return ['Côte d\'Ivoire', 'Sénégal', 'Mali', 'Togo', 'Bénin', 'Burkina Faso', 'Cameroun', 'Congo (RDC)'];

                        default: return ['Kenya', 'Zambia', 'Uganda', 'Cameroon', 'Ghana', 'Tanzania', 'Rwanda', 'Mozambique'];
                    }
                })(),








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
        <div className="flex flex-col gap-6 max-w-2xl mx-auto py-10 px-4">
            {/* Header section - Premium & Dynamic */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/gateways">
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.1] hover:scale-105 transition-all">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black tracking-tighter text-white bg-clip-text">
                                Connecter une passerelle
                            </h1>
                            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                                Connexions sécurisées par chiffrement AES-256
                            </p>
                        </div>
                    </div>

                    <div className="hidden sm:flex gap-2">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`w-3 h-3 rounded-full transition-all duration-500 ${step === s ? 'bg-primary scale-125 ring-4 ring-primary/20' : step > s ? 'bg-primary/40' : 'bg-white/10'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Search & Filter - Step 1 Only */}
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            </div>
                            <Input
                                type="text"
                                placeholder="Rechercher une plateforme (ex: Stripe, Paystack...)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-12 pl-11 bg-white/[0.02] border-white/5 rounded-2xl text-sm focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:text-muted-foreground/50"
                            />
                        </div>

                        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-none">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${activeTab === tab.id
                                        ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                                        : 'bg-white/[0.02] border-white/5 text-muted-foreground hover:bg-white/[0.05] hover:text-white'
                                        }`}
                                >
                                    <tab.icon className={`h-3.5 w-3.5 ${activeTab === tab.id ? 'text-black' : 'text-muted-foreground'}`} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 gap-3">
                            {filteredProviders.map((provider) => {
                                const isConnected = existingGateways.some(g => g.name === provider.name);
                                const isComingSoon = provider.status === 'coming_soon';
                                const isSelected = selectedProvider === provider.id;

                                return (
                                    <motion.div
                                        layout
                                        key={provider.id}
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => {
                                            if (!isComingSoon && !isConnected) {
                                                setSelectedProvider(provider.id);
                                            }
                                        }}
                                        className={`group relative p-5 rounded-[2rem] border transition-all text-left flex items-center gap-5 cursor-pointer overflow-hidden ${isSelected
                                            ? 'bg-primary/5 border-primary/50 shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]'
                                            : (isComingSoon || isConnected)
                                                ? 'opacity-60 cursor-not-allowed bg-white/[0.01] border-white/5'
                                                : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
                                            }`}
                                    >
                                        {/* Animated select ring */}
                                        {isSelected && (
                                            <motion.div
                                                layoutId="select-ring"
                                                className="absolute inset-0 border-2 border-primary rounded-[2rem] pointer-events-none"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}

                                        <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center overflow-hidden p-2.5 shrink-0 shadow-xl group-hover:scale-110 transition-transform duration-500">
                                            <img src={provider.logoUrl} alt={provider.name} className="w-full h-full object-contain" />
                                        </div>

                                        <div className="flex-1 min-w-0 py-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-base text-white tracking-tight">{provider.name}</h3>
                                                    {isConnected && (
                                                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[9px] h-4 uppercase font-black">
                                                            Actif
                                                        </Badge>
                                                    )}
                                                    {isComingSoon && (
                                                        <Badge className="bg-white/5 text-muted-foreground border-none text-[9px] h-4 uppercase font-black">
                                                            Bientôt
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-full border border-white/5 bg-white/[0.03] hover:bg-white/[0.1] hover:text-white text-muted-foreground transition-all z-20"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveDetailsProvider(provider.id);
                                                        }}
                                                    >
                                                        <Info className="h-4 w-4" />
                                                    </Button>

                                                    {isSelected && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            className="z-20"
                                                        >
                                                            <Button
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    nextStep();
                                                                }}
                                                                className="h-9 px-4 rounded-full bg-primary hover:bg-primary/90 text-black font-black text-[10px] uppercase tracking-tighter shadow-lg shadow-primary/20 flex items-center gap-2 group/btn"
                                                            >
                                                                Continuer
                                                                <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                                                            </Button>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-1.5 mt-2.5">
                                                {provider.methods.slice(0, 4).map(m => (
                                                    <div key={m} className="flex items-center gap-1.5 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.02]">
                                                        {getMethodLogo(m) && <img src={getMethodLogo(m)!} alt="" className="h-3 w-3 object-contain opacity-80" />}
                                                        <span className="text-[10px] font-bold text-white/50 tracking-wide uppercase">{m.split(' ')[0]}</span>
                                                    </div>
                                                ))}
                                                {provider.methods.length > 4 && (
                                                    <div className="text-[10px] font-black text-muted-foreground/60 px-2 py-1 flex items-center">
                                                        +{provider.methods.length - 4}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                    </motion.div>
                                );
                            })}

                            {filteredProviders.length === 0 && (
                                <div className="text-center py-20 px-4 bg-white/[0.01] border border-dashed border-white/5 rounded-[2rem]">
                                    <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                                        <Search className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-sm font-bold text-white">Aucun résultat</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Nous n'avons trouvé aucune plateforme correspondant à votre recherche.</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-start items-center pt-8 border-t border-white/5">
                            <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5 px-4 opacity-50">
                                <Sparkles className="h-3 w-3 text-amber-500/50" />
                                {providers.filter(p => p.status === 'active').length} passerelles de paiement certifiées disponibles
                            </p>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <Card className="border border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
                            <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center gap-5 space-y-0">
                                <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center p-2.5 shadow-2xl">
                                    <img
                                        src={providers.find(p => p.id === selectedProvider)?.logoUrl}
                                        alt=""
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold text-white tracking-tight">Configuration {providers.find(p => p.id === selectedProvider)?.name}</CardTitle>
                                    <CardDescription className="text-xs text-muted-foreground mt-0.5 font-medium flex items-center gap-1.5">
                                        <Lock className="h-3 w-3" />
                                        Paramètres de sécurité requis
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 flex gap-3 items-center"
                                    >
                                        <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                                        <p className="text-xs text-destructive font-bold leading-tight">
                                            {error}
                                        </p>
                                    </motion.div>
                                )}
                                <div className="space-y-4">
                                    <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black">Mode d'exécution</Label>
                                    <div className="flex gap-2 p-1.5 bg-white/[0.03] rounded-2xl border border-white/5 w-fit">
                                        <button
                                            onClick={() => setMode('test')}
                                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${mode === 'test' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-muted-foreground hover:text-white'}`}
                                        >
                                            Sandbox
                                        </button>
                                        <button
                                            onClick={() => setMode('live')}
                                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${mode === 'live' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-muted-foreground hover:text-white'}`}
                                        >
                                            Live
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
                                ) : selectedProvider === 'flutterwave' ? (
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="flwPublicKey" className="text-[10px] uppercase font-semibold text-muted-foreground">Public Key</Label>
                                            <Input
                                                id="flwPublicKey"
                                                placeholder="FLWPUBK_TEST-..."
                                                className="h-10 bg-white/[0.02] border-white/5 rounded-xl px-4 text-xs font-mono focus:ring-primary/20 transition-all"
                                                value={flwPublicKey}
                                                onChange={(e) => setFlwPublicKey(e.target.value)}
                                                autoComplete="off"
                                                autoCorrect="off"
                                                autoCapitalize="none"
                                                spellCheck={false}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="flwSecretKey" className="text-[10px] uppercase font-semibold text-muted-foreground">Secret Key</Label>
                                            <Input
                                                id="flwSecretKey"
                                                type="password"
                                                placeholder="FLWSECK_TEST-..."
                                                className="h-10 bg-white/[0.02] border-white/5 rounded-xl px-4 text-xs font-mono focus:ring-primary/20 transition-all text-security"
                                                value={flwSecretKey}
                                                onChange={(e) => setFlwSecretKey(e.target.value)}
                                                autoComplete="new-password"
                                                autoCorrect="off"
                                                autoCapitalize="none"
                                                spellCheck={false}
                                            />
                                        </div>
                                        <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/10 flex gap-2 items-start">
                                            <Zap className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                                            <p className="text-[10px] text-muted-foreground leading-relaxed">
                                                Obtenez vos clés sur <a href="https://dashboard.flutterwave.com/settings/apis" target="_blank" className="text-orange-400 underline hover:text-orange-300">dashboard.flutterwave.com</a>
                                            </p>
                                        </div>
                                    </div>
                                ) : selectedProvider === 'feexpay' ? (
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="feexShopId" className="text-[10px] uppercase font-semibold text-muted-foreground">Identifiant Boutique</Label>
                                            <Input
                                                id="feexShopId"
                                                placeholder="679a774c703493edb3dc4a34"
                                                className="h-10 bg-white/[0.02] border-white/5 rounded-xl px-4 text-xs font-mono focus:ring-primary/20 transition-all"
                                                value={feexShopId}
                                                onChange={(e) => setFeexShopId(e.target.value)}
                                                autoComplete="off"
                                                autoCorrect="off"
                                                autoCapitalize="none"
                                                spellCheck={false}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="feexApiKey" className="text-[10px] uppercase font-semibold text-muted-foreground">Clé API</Label>
                                            <Input
                                                id="feexApiKey"
                                                type="password"
                                                placeholder="fp_..."
                                                className="h-10 bg-white/[0.02] border-white/5 rounded-xl px-4 text-xs font-mono focus:ring-primary/20 transition-all text-security"
                                                value={feexApiKey}
                                                onChange={(e) => setFeexApiKey(e.target.value)}
                                                autoComplete="new-password"
                                                autoCorrect="off"
                                                autoCapitalize="none"
                                                spellCheck={false}
                                            />
                                        </div>
                                        <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 flex gap-2 items-start">
                                            <Zap className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" />
                                            <p className="text-[10px] text-muted-foreground leading-relaxed">
                                                Obtenez vos clés dans le menu <span className="text-purple-400 font-medium">Développeurs</span> de votre <a href="https://app.feexpay.me" target="_blank" className="text-purple-400 underline hover:text-purple-300">compte FeexPay</a>
                                            </p>
                                        </div>
                                    </div>
                                ) : selectedProvider === 'paystack' ? (
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="pskPublicKey" className="text-[10px] uppercase font-semibold text-muted-foreground">Public Key</Label>
                                            <Input
                                                id="pskPublicKey"
                                                placeholder="pk_test_..."
                                                className="h-10 bg-white/[0.02] border-white/5 rounded-xl px-4 text-xs font-mono focus:ring-primary/20 transition-all"
                                                value={pskPublicKey}
                                                onChange={(e) => setPskPublicKey(e.target.value)}
                                                autoComplete="off"
                                                autoCorrect="off"
                                                autoCapitalize="none"
                                                spellCheck={false}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="pskSecretKey" className="text-[10px] uppercase font-semibold text-muted-foreground">Secret Key</Label>
                                            <Input
                                                id="pskSecretKey"
                                                type="password"
                                                placeholder="sk_test_..."
                                                className="h-10 bg-white/[0.02] border-white/5 rounded-xl px-4 text-xs font-mono focus:ring-primary/20 transition-all text-security"
                                                value={pskSecretKey}
                                                onChange={(e) => setPskSecretKey(e.target.value)}
                                                autoComplete="new-password"
                                                autoCorrect="off"
                                                autoCapitalize="none"
                                                spellCheck={false}
                                            />
                                        </div>
                                        <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10 flex gap-2 items-start">
                                            <Zap className="h-4 w-4 text-cyan-500 shrink-0 mt-0.5" />
                                            <p className="text-[10px] text-muted-foreground leading-relaxed">
                                                Obtenez vos clés sur <a href="https://dashboard.paystack.com/#/settings/developer" target="_blank" className="text-cyan-400 underline hover:text-cyan-300">dashboard.paystack.com</a>
                                            </p>
                                        </div>
                                    </div>
                                ) : selectedProvider === 'stripe' ? (
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="stripeSecretKey" className="text-[10px] uppercase font-semibold text-muted-foreground">Secret Key</Label>
                                            <Input
                                                id="stripeSecretKey"
                                                type="password"
                                                placeholder="sk_test_..."
                                                className="h-10 bg-white/[0.02] border-white/5 rounded-xl px-4 text-xs font-mono focus:ring-primary/20 transition-all text-security"
                                                value={stripeSecretKey}
                                                onChange={(e) => setStripeSecretKey(e.target.value)}
                                                autoComplete="new-password"
                                                autoCorrect="off"
                                                autoCapitalize="none"
                                                spellCheck={false}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="stripePublishableKey" className="text-[10px] uppercase font-semibold text-muted-foreground">Publishable Key</Label>
                                            <Input
                                                id="stripePublishableKey"
                                                placeholder="pk_test_..."
                                                className="h-10 bg-white/[0.02] border-white/5 rounded-xl px-4 text-xs font-mono focus:ring-primary/20 transition-all"
                                                value={stripePublishableKey}
                                                onChange={(e) => setStripePublishableKey(e.target.value)}
                                                autoComplete="off"
                                                autoCorrect="off"
                                                autoCapitalize="none"
                                                spellCheck={false}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="stripeWebhookSecret" className="text-[10px] uppercase font-semibold text-muted-foreground">Webhook Secret (Optionnel)</Label>
                                            <Input
                                                id="stripeWebhookSecret"
                                                type="password"
                                                placeholder="whsec_..."
                                                className="h-10 bg-white/[0.02] border-white/5 rounded-xl px-4 text-xs font-mono focus:ring-primary/20 transition-all text-security"
                                                value={stripeWebhookSecret}
                                                onChange={(e) => setStripeWebhookSecret(e.target.value)}
                                                autoComplete="new-password"
                                                autoCorrect="off"
                                                autoCapitalize="none"
                                                spellCheck={false}
                                            />
                                        </div>
                                        <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex gap-2 items-start">
                                            <Zap className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                                            <p className="text-[10px] text-muted-foreground leading-relaxed">
                                                Gérez vos clés API sur le <a href="https://dashboard.stripe.com/test/apikeys" target="_blank" className="text-indigo-400 underline hover:text-indigo-300">Dashboard Stripe</a>
                                            </p>
                                        </div>
                                    </div>
                                ) : selectedProvider === 'kkiapay' ? (
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="kkiaPublicKey" className="text-[10px] uppercase font-semibold text-muted-foreground">Public Key</Label>
                                            <Input
                                                id="kkiaPublicKey"
                                                placeholder="pk_..."
                                                className="h-10 bg-white/[0.02] border-white/5 rounded-xl px-4 text-xs font-mono focus:ring-primary/20 transition-all"
                                                value={kkiaPublicKey}
                                                onChange={(e) => setKkiaPublicKey(e.target.value)}
                                                autoComplete="off"
                                                autoCorrect="off"
                                                autoCapitalize="none"
                                                spellCheck={false}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="kkiaPrivateKey" className="text-[10px] uppercase font-semibold text-muted-foreground">Private Key</Label>
                                            <Input
                                                id="kkiaPrivateKey"
                                                type="password"
                                                placeholder="sk_..."
                                                className="h-10 bg-white/[0.02] border-white/5 rounded-xl px-4 text-xs font-mono focus:ring-primary/20 transition-all text-security"
                                                value={kkiaPrivateKey}
                                                onChange={(e) => setKkiaPrivateKey(e.target.value)}
                                                autoComplete="new-password"
                                                autoCorrect="off"
                                                autoCapitalize="none"
                                                spellCheck={false}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="kkiaSecret" className="text-[10px] uppercase font-semibold text-muted-foreground">Secret Hash (Webhooks)</Label>
                                            <Input
                                                id="kkiaSecret"
                                                type="password"
                                                placeholder="Secret..."
                                                className="h-10 bg-white/[0.02] border-white/5 rounded-xl px-4 text-xs font-mono focus:ring-primary/20 transition-all text-security"
                                                value={kkiaSecret}
                                                onChange={(e) => setKkiaSecret(e.target.value)}
                                                autoComplete="new-password"
                                                autoCorrect="off"
                                                autoCapitalize="none"
                                                spellCheck={false}
                                            />
                                        </div>
                                        <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/10 flex gap-2 items-start">
                                            <Zap className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                                            <p className="text-[10px] text-muted-foreground leading-relaxed">
                                                Récupérez vos clés sur le <a href="https://app.kkiapay.me/developers" target="_blank" className="text-orange-400 underline hover:text-orange-300">Dashboard Kkiapay</a>
                                            </p>
                                        </div>
                                    </div>
                                ) : selectedProvider === 'coinbase' ? (
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="cbApiKey" className="text-[10px] uppercase font-semibold text-muted-foreground">API Key</Label>
                                            <Input
                                                id="cbApiKey"
                                                type="password"
                                                placeholder="API Key..."
                                                className="h-10 bg-white/[0.02] border-white/5 rounded-xl px-4 text-xs font-mono focus:ring-primary/20 transition-all text-security"
                                                value={cbApiKey}
                                                onChange={(e) => setCbApiKey(e.target.value)}
                                                autoComplete="new-password"
                                                autoCorrect="off"
                                                autoCapitalize="none"
                                                spellCheck={false}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cbWebhookSecret" className="text-[10px] uppercase font-semibold text-muted-foreground">Webhook Shared Secret</Label>
                                            <Input
                                                id="cbWebhookSecret"
                                                type="password"
                                                placeholder="Webhook Secret..."
                                                className="h-10 bg-white/[0.02] border-white/5 rounded-xl px-4 text-xs font-mono focus:ring-primary/20 transition-all text-security"
                                                value={cbWebhookSecret}
                                                onChange={(e) => setCbWebhookSecret(e.target.value)}
                                                autoComplete="new-password"
                                                autoCorrect="off"
                                                autoCapitalize="none"
                                                spellCheck={false}
                                            />
                                        </div>
                                        <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-2 items-start">
                                            <Zap className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                                            <p className="text-[10px] text-muted-foreground leading-relaxed">
                                                Gérez vos clés sur le <a href="https://commerce.coinbase.com/dashboard/settings" target="_blank" className="text-blue-400 underline hover:text-blue-300">Dashboard Coinbase Commerce</a>
                                            </p>
                                        </div>
                                    </div>
                                ) : selectedProvider === 'fedapay' ? (
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="fedaApiKey" className="text-[10px] uppercase font-semibold text-muted-foreground">Clé API Secrète (Secret Key)</Label>
                                            <Input
                                                id="fedaApiKey"
                                                type="password"
                                                placeholder="sk_..."
                                                className="h-10 bg-white/[0.02] border-white/5 rounded-xl px-4 text-xs font-mono focus:ring-primary/20 transition-all text-security"
                                                value={fedaApiKey}
                                                onChange={(e) => setFedaApiKey(e.target.value)}
                                                autoComplete="new-password"
                                                autoCorrect="off"
                                                autoCapitalize="none"
                                                spellCheck={false}
                                            />
                                        </div>
                                        <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex gap-2 items-start">
                                            <Zap className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                            <p className="text-[10px] text-muted-foreground leading-relaxed">
                                                Récupérez votre clé API secrète sur le <a href="https://app.fedapay.com/settings/api" target="_blank" className="text-emerald-400 underline hover:text-emerald-300">Dashboard FedaPay</a>
                                            </p>
                                        </div>
                                    </div>
                                ) : selectedProvider === 'cinetpay' ? (




                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="cinetApiKey" className="text-[10px] uppercase font-semibold text-muted-foreground">Clé API (API KEY)</Label>
                                            <Input
                                                id="cinetApiKey"
                                                type="password"
                                                placeholder="API Key..."
                                                className="h-10 bg-white/[0.02] border-white/5 rounded-xl px-4 text-xs font-mono focus:ring-primary/20 transition-all text-security"
                                                value={cinetApiKey}
                                                onChange={(e) => setCinetApiKey(e.target.value)}
                                                autoComplete="new-password"
                                                autoCorrect="off"
                                                autoCapitalize="none"
                                                spellCheck={false}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cinetSiteId" className="text-[10px] uppercase font-semibold text-muted-foreground">Site ID</Label>
                                            <Input
                                                id="cinetSiteId"
                                                placeholder="Site ID..."
                                                className="h-10 bg-white/[0.02] border-white/5 rounded-xl px-4 text-xs font-mono focus:ring-primary/20 transition-all"
                                                value={cinetSiteId}
                                                onChange={(e) => setCinetSiteId(e.target.value)}
                                                autoComplete="off"
                                                autoCorrect="off"
                                                autoCapitalize="none"
                                                spellCheck={false}
                                            />
                                        </div>
                                        <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-2 items-start">
                                            <Zap className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                                            <p className="text-[10px] text-muted-foreground leading-relaxed">
                                                Obtenez vos clés dans le menu <span className="text-blue-400 font-medium">Services</span> de votre <a href="https://www.cinetpay.com" target="_blank" className="text-blue-400 underline hover:text-blue-300">compte CinetPay</a>
                                            </p>
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

                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <Button
                                        variant="ghost"
                                        onClick={prevStep}
                                        className="flex-1 h-12 rounded-2xl border border-white/10 text-white font-bold text-xs hover:bg-white/5"
                                    >
                                        Retour
                                    </Button>
                                    <Button
                                        onClick={handleCreateGateway}
                                        disabled={isLoading || (
                                            selectedProvider === 'paydunya'
                                                ? (!masterKey || !privateKey || !token)
                                                : selectedProvider === 'flutterwave'
                                                    ? (!flwPublicKey || !flwSecretKey)
                                                    : selectedProvider === 'feexpay'
                                                        ? (!feexShopId || !feexApiKey)
                                                        : selectedProvider === 'paystack'
                                                            ? (!pskPublicKey || !pskSecretKey)
                                                            : selectedProvider === 'cinetpay'
                                                                ? (!cinetApiKey || !cinetSiteId)
                                                                : selectedProvider === 'stripe'
                                                                    ? (!stripeSecretKey || !stripePublishableKey)
                                                                    : selectedProvider === 'kkiapay'
                                                                        ? (!kkiaPublicKey || !kkiaPrivateKey || !kkiaSecret)
                                                                        : selectedProvider === 'coinbase'
                                                                            ? (!cbApiKey || !cbWebhookSecret)
                                                                            : selectedProvider === 'fedapay'
                                                                                ? (!fedaApiKey)
                                                                                : !apiKey
                                        )}
                                        className="flex-[2] h-12 rounded-2xl bg-white hover:bg-white/90 text-black font-black text-xs shadow-xl active:scale-95 transition-all"
                                    >
                                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-black" /> : "Activer la passerelle"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
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
                <SheetContent className="overflow-y-auto bg-black/95 border-l border-white/5 backdrop-blur-3xl w-full sm:w-[500px] p-0">
                    {detailsProvider && (
                        <div className="relative min-h-full flex flex-col pb-10">
                            {/* Dynamic Premium Header */}
                            <div className="relative h-64 w-full overflow-hidden flex items-center justify-center">
                                {/* Abstract background blobs */}
                                <div className={`absolute inset-0 opacity-20 blur-[100px] animate-pulse ${detailsProvider.color}`} />
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] -mr-32 -mt-32" />

                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="relative z-10 h-32 w-32 rounded-[2.5rem] bg-white flex items-center justify-center p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10"
                                >
                                    <img src={detailsProvider.logoUrl} alt={detailsProvider.name} className="w-full h-full object-contain" />
                                </motion.div>

                                {/* Decorative lines */}
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-40" />
                            </div>

                            <div className="px-8 -mt-6 relative z-20 flex flex-col gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Badge className={`${detailsProvider.color} bg-opacity-20 text-white border-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider`}>
                                            {detailsProvider.status === 'active' ? 'Disponible' : 'Bientôt disponible'}
                                        </Badge>
                                        <div className="flex gap-2">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Global Network</span>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <SheetTitle className="text-4xl font-black tracking-tighter text-white uppercase italic">
                                            {detailsProvider.name}
                                        </SheetTitle>
                                        <SheetDescription className="text-sm text-muted-foreground leading-relaxed font-medium">
                                            {detailsProvider.description}
                                        </SheetDescription>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/5 space-y-1">
                                        <span className="text-[9px] font-black text-muted-foreground uppercase">Régions</span>
                                        <p className="text-xs font-bold text-white flex items-center gap-1.5">
                                            <Globe className="h-3 w-3 text-primary" /> Multi-régional
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/5 space-y-1">
                                        <span className="text-[9px] font-black text-muted-foreground uppercase">Sécurité</span>
                                        <p className="text-xs font-bold text-white flex items-center gap-1.5">
                                            <Lock className="h-3 w-3 text-primary" /> Chiffrement Bout-en-bout
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Méthodes supportées</h3>
                                        <Badge variant="outline" className="text-[9px] border-white/10 font-black">{detailsProvider.methods.length}</Badge>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2.5">
                                        {detailsProvider.methods.map((method) => (
                                            <motion.div
                                                key={method}
                                                whileHover={{ x: 5 }}
                                                className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group"
                                            >
                                                {getMethodLogo(method) ? (
                                                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center p-2 shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                                                        <img src={getMethodLogo(method)!} alt="" className="w-full h-full object-contain" />
                                                    </div>
                                                ) : (
                                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                        <CreditCard className="h-5 w-5 text-primary" />
                                                    </div>
                                                )}
                                                <span className="text-xs font-bold text-white/90">{method}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 flex flex-col gap-3">
                                    <Link href={detailsProvider.website} target="_blank" className="w-full">
                                        <Button className="w-full h-14 rounded-2xl bg-white hover:bg-white/90 text-black font-black uppercase text-xs tracking-widest shadow-xl">
                                            Voir la documentation <ExternalLink className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setActiveDetailsProvider(null)}
                                        className="w-full h-14 rounded-2xl text-muted-foreground hover:text-white font-bold text-xs"
                                    >
                                        Fermer l'aperçu
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}

