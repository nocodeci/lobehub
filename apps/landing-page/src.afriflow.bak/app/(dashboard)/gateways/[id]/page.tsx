"use client";

import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    ArrowLeft,
    Settings2,
    Zap,
    ShieldCheck,
    Smartphone,
    Wifi,
    Activity,
    Lock,
    Webhook,
    Terminal,
    AlertTriangle,
    CheckCircle2,
    Loader2,
    Save,
    Trash2,
    AlertCircle,
    Eye,
    EyeOff,
    Copy,
    Check
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getGatewayById, updateGateway, deleteGateway, validateGatewayCredentials } from "@/lib/actions/gateways";
import { useRouter } from "next/navigation";

export default function GatewayDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [gateway, setGateway] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Configuration state management
    const [mode, setMode] = useState<'test' | 'live'>('test');

    // Test Config
    const [testKeys, setTestKeys] = useState({
        masterKey: "",
        privateKey: "",
        token: ""
    });

    // Live Config
    const [liveKeys, setLiveKeys] = useState({
        masterKey: "",
        privateKey: "",
        token: ""
    });

    // Visibility state
    const [showMaster, setShowMaster] = useState(false);
    const [showToken, setShowToken] = useState(false);
    const [showPrivate, setShowPrivate] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);

    useEffect(() => {
        const fetchGateway = async () => {
            const data = await getGatewayById(id);
            if (data) {
                setGateway(data);

                // Initialize configs
                const config = data.config || {};
                const currentMode = config.mode || 'test';
                setMode(currentMode);

                // Handle legacy or structured config
                if (config.test || config.live) {
                    setTestKeys({
                        masterKey: config.test?.masterKey || "",
                        privateKey: config.test?.privateKey || "",
                        token: config.test?.token || ""
                    });
                    setLiveKeys({
                        masterKey: config.live?.masterKey || "",
                        privateKey: config.live?.privateKey || "",
                        token: config.live?.token || ""
                    });
                } else {
                    // Legacy migration: put existing keys in the active mode
                    const legacyKeys = {
                        masterKey: config.masterKey || "",
                        privateKey: config.privateKey || "",
                        token: config.token || ""
                    };

                    if (currentMode === 'test') {
                        setTestKeys(legacyKeys);
                    } else {
                        setLiveKeys(legacyKeys);
                    }
                }
            }
            setIsLoading(false);
        };
        fetchGateway();
    }, [id]);

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(null), 2000);
    };

    // Current keys based on mode
    const currentKeys = mode === 'test' ? testKeys : liveKeys;
    const setCurrentKeys = mode === 'test' ? setTestKeys : setLiveKeys;

    const handleKeyChange = (field: string, value: string) => {
        setCurrentKeys(prev => ({ ...prev, [field]: value }));
    };

    const handleUpdate = async () => {
        setIsSaving(true);
        setError("");
        setSuccess("");

        try {
            const newConfig = {
                mode,
                test: testKeys,
                live: liveKeys,
                // Keep flat keys for compatibility with existing orchestrator logic
                masterKey: mode === 'test' ? testKeys.masterKey : liveKeys.masterKey,
                privateKey: mode === 'test' ? testKeys.privateKey : liveKeys.privateKey,
                token: mode === 'test' ? testKeys.token : liveKeys.token,
            };

            // Validate ONLY the currently selected environment keys
            const validation = await validateGatewayCredentials(gateway.name.toLowerCase(), {
                masterKey: currentKeys.masterKey,
                privateKey: currentKeys.privateKey,
                token: currentKeys.token,
                mode: mode
            });

            if (!validation.success) {
                setError(`Validation ${mode === 'test' ? 'Sandbox' : 'Live'} échouée : ${validation.message}`);
                setIsSaving(false);
                return;
            }

            const result = await updateGateway(id, {
                config: newConfig,
            });

            if (result.success) {
                setSuccess(`Configuration ${mode === 'test' ? 'Sandbox' : 'Production'} enregistrée.`);
                setGateway(result.gateway);
            } else {
                setError("Erreur lors de l'enregistrement.");
            }
        } catch (err: any) {
            setError(err.message || "Une erreur est survenue.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleStatus = async () => {
        setIsSaving(true);
        const newStatus = gateway.status === 'active' ? 'maintenance' : 'active';
        const result = await updateGateway(id, { status: newStatus });
        if (result.success) {
            setGateway(result.gateway);
        }
        setIsSaving(false);
    };

    const handleDelete = async () => {
        if (!confirm("⚠️ Cette action supprimera définitivement l'intégration. Souhaitez-vous continuer ?")) return;

        setIsDeleting(true);
        const result = await deleteGateway(id);
        if (result.success) {
            router.push("/gateways");
        } else {
            setError("Erreur lors de la suppression.");
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-t-2 border-primary animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-pulse text-primary" />
                    </div>
                </div>
            </div>
        );
    }

    if (!gateway) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 text-center">
                <div className="h-20 w-20 rounded-full bg-amber-500/10 flex items-center justify-center animate-bounce">
                    <AlertTriangle className="h-10 w-10 text-amber-500" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">Intégration Manquante</h1>
                    <p className="text-muted-foreground text-sm max-w-xs">Cette passerelle n'existe plus ou vous n'avez pas les droits d'accès.</p>
                </div>
                <Link href="/gateways">
                    <Button variant="outline" className="rounded-xl border-white/10 hover:bg-white/5 h-11 px-8">
                        Retour au Dashboard
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 pb-12 overflow-x-hidden">
            {/* Header section avec animation */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-6"
            >
                <div className="flex items-center gap-4">
                    <Link href="/gateways">
                        <Button variant="ghost" size="icon" className="rounded-full bg-white/5 hover:bg-white/10 transition-all active:scale-95 h-10 w-10">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-[1.25rem] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-black text-xl text-primary shadow-2xl border border-white/5 overflow-hidden p-2.5">
                            {gateway.logo ? <img src={gateway.logo} alt="" className="w-full h-full object-contain" /> : gateway.name.substring(0, 2)}
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl font-black italic tracking-tighter uppercase text-gradient">
                                    {gateway.name}
                                </h1>
                                <Badge variant="secondary" className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${gateway.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                    {gateway.status === 'active' ? 'En Ligne' : 'Maintenance'}
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                                <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                                ID: <code className="bg-white/5 px-2 py-0.5 rounded text-primary/80 font-mono">{gateway.id}</code>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                    <Button variant="secondary" className="gap-2 bg-white/5 border border-white/5 hover:bg-white/10 rounded-xl h-10 px-6 font-bold text-xs">
                        <Terminal className="h-4 w-4 text-cyan-400" /> Flux de logs
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleToggleStatus}
                        className={`gap-2 rounded-xl h-10 px-6 font-bold text-xs transition-all duration-300 ${gateway.status === 'active' ? 'text-red-400 border-red-500/20 hover:bg-red-500/10' : 'text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10'}`}
                    >
                        {gateway.status === 'active' ? 'Suspendre' : 'Rétablir'}
                    </Button>
                    <div className="flex-1" />
                    <div className="flex gap-2">
                        <Button
                            onClick={handleDelete}
                            variant="ghost"
                            className="h-10 w-10 p-0 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/5 transition-all"
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={18} />}
                        </Button>
                        <Button
                            onClick={handleUpdate}
                            disabled={isSaving}
                            className="gap-2 bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 rounded-xl text-black font-black uppercase tracking-tighter h-10 px-8 transition-all active:scale-95"
                        >
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Mise à jour
                        </Button>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {(error || success) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`p-5 rounded-2xl border flex gap-4 items-start shadow-2xl ${error ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}
                    >
                        <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${error ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}>
                            {error ? <AlertCircle className="h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
                        </div>
                        <div className="flex-1 pt-0.5">
                            <p className="font-black text-sm uppercase tracking-tighter mb-0.5">{error ? 'Erreur critique' : 'Action réussie'}</p>
                            <p className="text-xs font-medium opacity-80 leading-relaxed">{error || success}</p>
                        </div>
                        <button onClick={() => { setError(""); setSuccess(""); }} className="opacity-50 hover:opacity-100 transition-opacity p-1">
                            <Trash2 size={14} className="hover:text-current" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Configuration API */}
                <Card className="lg:col-span-2 border border-white/5 bg-card/10 backdrop-blur-3xl rounded-[2rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border-t-white/10">
                    <CardHeader className="p-8 border-b border-white/5 bg-white/[0.01]">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl font-black italic tracking-tighter uppercase text-white">Gestion des Clés</CardTitle>
                                <CardDescription className="text-xs text-muted-foreground font-medium uppercase tracking-widest opacity-60">Environnements ISO3264 isolés</CardDescription>
                            </div>
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-inner overflow-hidden p-2">
                                {gateway.logo ? <img src={gateway.logo} alt="" className="w-full h-full object-contain" /> : <Lock className="h-6 w-6 text-primary" />}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-10">
                        <div className="space-y-4">
                            <Label className="text-[10px] uppercase tracking-[0.25em] text-primary font-black ml-1">Sélecteur d'Environnement</Label>
                            <div className="flex gap-2 p-2 bg-black/60 rounded-3xl w-fit border border-white/5 shadow-2xl backdrop-blur-3xl relative">
                                <button
                                    onClick={() => setMode('test')}
                                    className={`relative z-10 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${mode === 'test' ? 'bg-amber-500 text-black shadow-[0_0_30px_rgba(245,158,11,0.3)]' : 'text-muted-foreground hover:text-white'}`}
                                >
                                    Sandbox Mode
                                </button>
                                <button
                                    onClick={() => setMode('live')}
                                    className={`relative z-10 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${mode === 'live' ? 'bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'text-muted-foreground hover:text-white'}`}
                                >
                                    Production Mode
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                            {/* Background decoration */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-px bg-gradient-to-b from-transparent via-white/5 to-transparent hidden md:block" />

                            {/* Master Key */}
                            <div className="space-y-3">
                                <Label htmlFor="masterKey" className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">Master API Key</Label>
                                <div className="relative group">
                                    <Input
                                        id="masterKey"
                                        placeholder={mode === 'test' ? "Indiquez votre Master Key de test..." : "Indiquez votre Master Key de production..."}
                                        className={`h-12 bg-black/40 border-white/10 rounded-2xl px-5 text-xs font-mono focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all duration-500 pr-24 border shadow-inner ${!showMaster && 'text-security'}`}
                                        value={currentKeys.masterKey}
                                        onChange={(e) => handleKeyChange('masterKey', e.target.value)}
                                        autoComplete="off"
                                    />
                                    <div className="absolute right-3 top-2 flex gap-1.5">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-xl hover:bg-white/10 transition-all active:scale-90" onClick={() => setShowMaster(!showMaster)}>
                                            {showMaster ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-xl hover:bg-white/10 transition-all active:scale-90" onClick={() => handleCopy(currentKeys.masterKey, 'master')}>
                                            {copied === 'master' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Token Boutique */}
                            <div className="space-y-3">
                                <Label htmlFor="token" className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">Shop Token</Label>
                                <div className="relative group">
                                    <Input
                                        id="token"
                                        placeholder="Entrez votre Token boutique..."
                                        className={`h-12 bg-black/40 border-white/10 rounded-2xl px-5 text-xs font-mono focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all duration-500 pr-24 border shadow-inner ${!showToken && 'text-security'}`}
                                        value={currentKeys.token}
                                        onChange={(e) => handleKeyChange('token', e.target.value)}
                                        autoComplete="off"
                                    />
                                    <div className="absolute right-3 top-2 flex gap-1.5">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-xl hover:bg-white/10 transition-all active:scale-90" onClick={() => setShowToken(!showToken)}>
                                            {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-xl hover:bg-white/10 transition-all active:scale-90" onClick={() => handleCopy(currentKeys.token, 'token')}>
                                            {copied === 'token' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Private Key */}
                            <div className="space-y-3 md:col-span-2">
                                <Label htmlFor="privateKey" className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">Private Secret Key</Label>
                                <div className="relative group">
                                    <Input
                                        id="privateKey"
                                        type={showPrivate ? "text" : "password"}
                                        placeholder="sk_test_..."
                                        className="h-12 bg-black/40 border-white/10 rounded-2xl px-5 text-xs font-mono focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all duration-500 pr-24 border shadow-inner"
                                        value={currentKeys.privateKey}
                                        onChange={(e) => handleKeyChange('privateKey', e.target.value)}
                                        autoComplete="new-password"
                                    />
                                    <div className="absolute right-3 top-2 flex gap-1.5">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-xl hover:bg-white/10 transition-all active:scale-90" onClick={() => setShowPrivate(!showPrivate)}>
                                            {showPrivate ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-xl hover:bg-white/10 transition-all active:scale-90" onClick={() => handleCopy(currentKeys.privateKey, 'private')}>
                                            {copied === 'private' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 backdrop-blur-md flex gap-5 items-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            <div className="h-12 w-12 shrink-0 rounded-[1rem] bg-primary/20 flex items-center justify-center border border-primary/30 shadow-2xl">
                                <ShieldCheck className="h-6 w-6 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-black text-[10px] uppercase tracking-widest text-white">Sécurité Militaire Active</h4>
                                <p className="text-[11px] text-muted-foreground leading-relaxed max-w-lg">
                                    Toutes vos informations sont chiffrées au repos via <span className="text-primary font-bold">AES-256-GCM</span>.
                                    AfriFlow ne conserve aucune version en clair de vos secrets d'API.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-8 h-full">
                    {/* Webhooks Card */}
                    <Card className="border border-white/5 bg-white/[0.02] backdrop-blur-2xl rounded-[2rem] shadow-2xl overflow-hidden border-t-white/10">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-lg font-black uppercase tracking-tighter italic flex items-center gap-3">
                                <Webhook className="h-5 w-5 text-primary" /> Notification Hub
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-4 space-y-6">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Webhook Endpoint</Label>
                                <div className="relative group">
                                    <div className="w-full bg-black/40 rounded-2xl p-4 font-mono text-[10px] border border-white/5 group-hover:border-primary/40 transition-all duration-300">
                                        https://api.afriflow.com/v1/webhooks/{gateway.name.toLowerCase()}
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="absolute right-2 top-2 h-8 px-4 rounded-xl text-[10px] font-black uppercase tracking-tighter shadow-2xl hover:bg-white/10"
                                        onClick={() => handleCopy(`https://api.afriflow.com/v1/webhooks/${gateway.name.toLowerCase()}`, 'webhook')}
                                    >
                                        {copied === 'webhook' ? <Check size={12} className="mr-2" /> : <Copy size={12} className="mr-2" />}
                                        {copied === 'webhook' ? 'Copié' : 'Copier'}
                                    </Button>
                                </div>
                            </div>
                            <div className="p-6 rounded-[1.5rem] bg-emerald-500/5 border border-emerald-500/20 flex flex-col gap-4">
                                <div className="flex items-center gap-2 text-emerald-400">
                                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-2 h-5 rounded text-[8px] font-black uppercase">Vérifié</Badge>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Hachage HMAC-SHA256</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground leading-relaxed">
                                    Configurez cette URL dans votre interface <span className="text-white font-bold">{gateway.name}</span> pour recevoir les états de transaction en temps réel.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Stats side info */}
                    <Card className="border border-white/5 bg-white/[0.01] backdrop-blur-3xl rounded-[2rem] p-8 flex flex-col gap-8 shadow-2xl border-t-white/10">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Disponibilité</p>
                            <Badge className="bg-emerald-500 text-black font-black uppercase text-[8px] px-3 h-5">Stable</Badge>
                        </div>
                        <div className="space-y-1">
                            <p className="text-7xl font-black italic tracking-tighter text-gradient leading-none">{gateway.uptime}</p>
                            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest ml-1">Temps de fonctionnement global</p>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: gateway.uptime }} className="h-full bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.8)]" />
                        </div>
                    </Card>
                </div>

                {/* Performance Analytics */}
                <Card className="lg:col-span-3 border border-white/5 bg-card/10 backdrop-blur-3xl rounded-[2.5rem] p-10 shadow-2xl border-t-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative">
                        {/* Divider lines */}
                        <div className="absolute top-0 bottom-0 left-1/3 w-px bg-white/5 hidden md:block" />
                        <div className="absolute top-0 bottom-0 left-2/3 w-px bg-white/5 hidden md:block" />

                        <motion.div whileHover={{ scale: 1.05 }} className="space-y-4">
                            <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em]">Taux de Conversion</p>
                            <div className="relative inline-block">
                                <p className="text-8xl font-black italic text-gradient tracking-tighter leading-none">{gateway.successRate}</p>
                                <div className="absolute -top-4 -right-8 h-4 w-4 bg-emerald-500 rounded-full blur-xl animate-pulse" />
                            </div>
                            <p className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest">Performance Optimale</p>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }} className="space-y-4">
                            <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em]">Latence API</p>
                            <p className="text-8xl font-black italic text-gradient tracking-tighter leading-none">1.2s</p>
                            <Badge className="bg-white/5 border-white/10 text-white font-black uppercase text-[9px] tracking-widest">-0.2s vs HIER</Badge>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }} className="space-y-4">
                            <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em]">Status Réseau</p>
                            <div className="flex justify-center mb-2">
                                <div className="h-20 w-px bg-gradient-to-t from-emerald-500/40 via-emerald-500/10 to-transparent" />
                                <div className="h-20 w-px bg-gradient-to-t from-emerald-500/40 via-emerald-500/30 to-transparent translate-x-1" />
                                <div className="h-20 w-px bg-gradient-to-t from-emerald-500 via-emerald-500/60 to-transparent translate-x-2" />
                            </div>
                            <p className="text-lg font-black italic uppercase tracking-tighter text-emerald-400">Opérationnel</p>
                            <p className="text-[9px] text-muted-foreground font-bold tracking-widest">DERNIÈRE VÉRIF: IL Y A 2M</p>
                        </motion.div>
                    </div>
                </Card>

                {/* Capabilities Grid */}
                <Card className="lg:col-span-3 border border-white/5 bg-white/[0.01] backdrop-blur-3xl rounded-[3rem] p-10 border-t-white/10 shadow-3xl">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div className="space-y-2">
                            <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white">Capabilities du Canal</h2>
                            <p className="text-xs text-muted-foreground font-medium max-w-md">Ces services reflètent les capacités activées sur votre intégration {gateway.name} par votre gestionnaire de compte.</p>
                        </div>
                        <Badge className="bg-primary/10 text-primary border-primary/20 px-6 h-10 rounded-2xl text-[10px] font-black uppercase tracking-widest">Connecté au Hub Africain</Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Smartphone, label: "Mobile Money", desc: "Paiements via opérateurs locaux (Orange, MTN, Moov, Wave)", active: true },
                            { icon: Zap, label: "Flash Confirmation", desc: "Traitement asynchrone ultra-rapide des requêtes", active: true },
                            { icon: ShieldCheck, label: "3DS 2.x Firewall", desc: "Authentification forte obligatoire pour la sécurité", active: gateway.status === 'active' },
                            { icon: Lock, label: "Cloud Tokenization", desc: "Stockage sécurisé des identifiants carte sur nos serveurs", active: false },
                        ].map((feat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`group p-10 rounded-[2.5rem] border transition-all duration-700 relative overflow-hidden ${feat.active ? 'bg-gradient-to-b from-primary/[0.08] to-transparent border-primary/20 shadow-2xl' : 'bg-white/[0.02] border-white/5 opacity-40'}`}
                            >
                                <div className={`h-16 w-16 rounded-3xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 ${feat.active ? 'bg-primary/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'bg-white/5'}`}>
                                    <feat.icon className={`h-8 w-8 ${feat.active ? 'text-primary' : 'text-muted-foreground'}`} />
                                </div>
                                <h4 className="font-black text-lg mb-2 tracking-tighter uppercase italic">{feat.label}</h4>
                                <p className="text-[11px] text-muted-foreground mb-8 leading-relaxed font-medium">{feat.desc}</p>
                                <div className="flex items-center justify-between">
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${feat.active ? 'text-primary' : 'text-muted-foreground'}`}>{feat.active ? 'Actif' : 'Bloqué'}</span>
                                    <div className={`h-6 w-12 rounded-full p-1.5 transition-colors duration-500 ${feat.active ? 'bg-primary/20 border border-primary/20' : 'bg-white/5 border border-white/10'}`}>
                                        <div className={`h-full w-3.5 rounded-full shadow-lg transition-transform duration-500 ${feat.active ? 'translate-x-[1.4rem] bg-primary shadow-primary/50' : 'translate-x-0 bg-white/20'}`} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
