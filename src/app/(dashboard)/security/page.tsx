"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Key,
    ShieldCheck,
    Lock,
    Eye,
    EyeOff,
    Copy,
    RefreshCw,
    Globe,
    ShieldAlert,
    History,
    Smartphone,
    CheckCircle2,
    AlertTriangle,
    Check,
    Loader2,
    BookOpen,
    Blocks,
    Webhook,
    Cpu,
    CodeXml,
    Terminal,
    FileCode,
    Braces,
    Play,
    Zap,
    ChevronRight
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getApiConfig, rotateApiKeys, updateWebhookUrl, getSecurityLogs } from "@/lib/actions/security";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import Link from "next/link";

const CodeBlock = ({ code }: { code: string }) => {
    const lines = code.split('\n');

    return (
        <code className="block">
            {lines.map((line, i) => {
                if (line.trim().startsWith('//') || line.trim().startsWith('#') || line.includes('<?php')) {
                    return <div key={i} className="text-muted-foreground/50 italic whitespace-pre">{line || ' '}</div>;
                }

                const parts = line.split(/(\s+|['"].*?['"]|[().{}[\],;])/);
                return (
                    <div key={i} className="min-h-[1.5rem] whitespace-pre">
                        {parts.map((part, j) => {
                            const trimmed = part.trim();
                            if (['const', 'await', 'require', 'import', 'from', 'new', 'echo', 'print', 'return', 'function', '$afriflow', '$transaction', 'Client'].includes(trimmed)) {
                                return <span key={j} className="text-purple-400 font-semibold">{part}</span>;
                            }
                            if (part.startsWith("'") || part.startsWith('"')) {
                                return <span key={j} className="text-emerald-400">{part}</span>;
                            }
                            if (/^\d+$/.test(trimmed)) {
                                return <span key={j} className="text-orange-400">{part}</span>;
                            }
                            return <span key={j}>{part}</span>;
                        })}
                    </div>
                );
            })}
        </code>
    );
};

export default function SecurityPage() {
    const [showSecret, setShowSecret] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isRotating, setIsRotating] = useState(false);
    const [isSavingWebhook, setIsSavingWebhook] = useState(false);
    const [config, setConfig] = useState<any>(null);
    const [logs, setLogs] = useState<any[]>([]);
    const [webhookUrl, setWebhookUrl] = useState("");
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const [copiedCode, setCopiedCode] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [apiData, logData] = await Promise.all([
                getApiConfig(),
                getSecurityLogs()
            ]);
            setConfig(apiData);
            setLogs(logData || []);
            setWebhookUrl(apiData?.webhookUrl || "");
        } catch (error) {
            console.error("Security data loading failure:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleCopy = (text: string, type: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedKey(type);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const handleCopyCode = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
    };

    const handleSimulate = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsSimulating(true);
        setTimeout(() => setIsSimulating(false), 2000);
    };

    const handleRotate = async () => {
        if (!confirm("Attention: La rotation des clés invalidera vos anciennes clés. Vos intégrations actuelles cesseront de fonctionner jusqu'à mise à jour. Continuer ?")) return;

        setIsRotating(true);
        const res = await rotateApiKeys();
        if (res.success) {
            setConfig(res.config);
            loadData();
        }
        setIsRotating(false);
    };

    const handleSaveWebhook = async () => {
        setIsSavingWebhook(true);
        const res = await updateWebhookUrl(webhookUrl);
        if (res.success) {
            loadData();
        }
        setIsSavingWebhook(false);
    };

    const codeSnippets = useMemo(() => {
        const key = config?.publicKey || 'af_live_...92kf';
        return {
            nodejs: `// Initialisation de l'orchestrateur AfriFlow\nconst afriflow = require('afriflow-sdk')('${key}');\n\n// Création d'une transaction multi-passerelle\nconst transaction = await afriflow.payments.create({\n  amount: 25000,\n  currency: 'XOF',\n  customer: 'cust_842h94k',\n  routing: 'auto_optimize', // Choisit la passerelle la moins chère\n  metadata: {\n    order_id: 'ORDER-993'\n  }\n});\n\nconsole.log('ID de transaction:', transaction.id);`,
            python: `# Initialisation de l'orchestrateur AfriFlow\nimport afriflow\n\nclient = afriflow.Client(api_key="${key}")\n\n# Création d'une transaction multi-passerelle\ntransaction = client.payments.create(\n    amount=25000,\n    currency="XOF",\n    customer_id="cust_842h94k",\n    routing="auto_optimize",\n    metadata={\n        "order_id": "ORDER-993"\n    }\n)\n\nprint(f"ID de transaction: {transaction.id}")`,
            php: `<?php\n// Initialisation de l'orchestrateur AfriFlow\n$afriflow = new \\AfriFlow\\Client('${key}');\n\n// Création d'une transaction multi-passerelle\n$transaction = $afriflow->payments->create([\n    'amount' => 25000,\n    'currency' => 'XOF',\n    'customer' => 'cust_842h94k',\n    'routing' => 'auto_optimize',\n    'metadata' => [\n        'order_id' => 'ORDER-993'\n    ]\n]);\n\necho "ID de transaction: " . $transaction->id;`
        };
    }, [config?.publicKey]);

    if (isLoading && !config) {
        return (
            <div className="p-8 animate-pulse space-y-8">
                <div className="h-10 w-64 bg-card/40 rounded-lg" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-96 bg-card/40 rounded-3xl" />
                    <div className="h-96 bg-card/40 rounded-3xl" />
                </div>
            </div>
        );
    }

    if (!config && !isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <AlertTriangle className="h-12 w-12 text-amber-500" />
                <h2 className="text-xl font-black uppercase italic tracking-tighter text-gradient">Session ou Configuration Perdue</h2>
                <p className="text-muted-foreground font-medium text-center max-w-md">
                    Impossible de charger votre environnement API. Veuillez vérifier votre connexion ou vous reconnecter pour rafraîchir la session.
                </p>
                <div className="flex gap-4">
                    <Button onClick={loadData} className="gap-2 rounded-xl font-bold bg-primary shadow-lg shadow-primary/20">
                        <RefreshCw className="h-4 w-4" /> Réessayer
                    </Button>
                    <Link href="/auth/login">
                        <Button variant="outline" className="rounded-xl font-bold border-white/10 uppercase tracking-tighter italic">Reconnexion</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-[900] tracking-tight uppercase italic text-gradient">Sécurité & API</h1>
                    <p className="text-muted-foreground font-medium mt-1">
                        Gérez vos accès confidentiels et configurez vos intégrations live.
                    </p>
                </div>
                <Badge variant="outline" className="w-fit bg-emerald-500/10 text-emerald-500 border-emerald-500/30 py-2 px-4 gap-2 font-black uppercase tracking-widest text-[10px] shadow-sm">
                    <ShieldCheck className="h-4 w-4" /> Environnement de Production
                </Badge>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* API Credentials */}
                <Card className="lg:col-span-2 border border-white/10 bg-card/60 backdrop-blur-3xl shadow-2xl relative overflow-hidden rounded-[2rem]">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Key className="h-32 w-32" />
                    </div>
                    <CardHeader className="p-8 border-b border-white/5 bg-white/5">
                        <CardTitle className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                <Lock className="h-4 w-4 text-primary" />
                            </div>
                            Clés d'accès API
                        </CardTitle>
                        <CardDescription className="font-medium">Utilisez ces clés pour authentifier vos requêtes vers l'orchestrateur.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-3">
                            <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">App ID (Identifiant Application)</Label>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-black/20 border border-white/5 rounded-xl px-4 py-3.5 font-mono text-sm flex items-center justify-between group/key">
                                    <span className="truncate pr-4 text-blue-400 font-bold">{config?.applicationId}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleCopy(config?.applicationId, 'appid')}
                                        className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0 transition-colors"
                                    >
                                        {copiedKey === 'appid' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Clé Publique (Live)</Label>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-black/20 border border-white/5 rounded-xl px-4 py-3.5 font-mono text-sm flex items-center justify-between group/key">
                                    <span className="truncate pr-4 text-primary/80 font-bold">{config?.publicKey}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleCopy(config?.publicKey, 'pub')}
                                        className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0 transition-colors"
                                    >
                                        {copiedKey === 'pub' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between ml-1">
                                <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Clé Secrète (Live)</Label>
                                <Badge className="bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border border-amber-500/20">Confidentialité Maximale</Badge>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-black/20 border border-white/5 rounded-xl px-4 py-3.5 font-mono text-sm flex items-center justify-between overflow-hidden group/key">
                                    <span className={`truncate pr-4 ${showSecret ? "text-emerald-400 font-bold" : "blur-md select-none opacity-40"}`}>
                                        {showSecret ? config?.secretKey : "••••••••••••••••••••••••••••••••••••••••••••••••"}
                                    </span>
                                    <div className="flex gap-2 shrink-0">
                                        <Button variant="ghost" size="icon" onClick={() => setShowSecret(!showSecret)} className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors">
                                            {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleCopy(config?.secretKey, 'sec')}
                                            className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            {copiedKey === 'sec' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between border-t border-white/5 gap-6">
                            <div className="flex items-center gap-3 text-xs text-muted-foreground font-semibold italic">
                                <div className={`h-2 w-2 rounded-full ${isRotating ? 'bg-primary animate-ping' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
                                Dernière rotation : {config?.lastRotationAt ? formatDistanceToNow(new Date(config.lastRotationAt), { addSuffix: true, locale: fr }) : "Initialisée"}
                            </div>
                            <Button
                                onClick={handleRotate}
                                disabled={isRotating}
                                variant="destructive"
                                className="h-11 px-6 gap-2 bg-red-600/10 text-red-500 border border-red-500/20 hover:bg-red-600 hover:text-white font-black rounded-xl w-full sm:w-auto transition-all uppercase italic tracking-tighter"
                            >
                                {isRotating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                                Régénérer les Clés
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Vertical Stats */}
                <div className="flex flex-col gap-6">
                    {/* Security Health */}
                    <Card className="border border-white/10 bg-card/60 backdrop-blur-3xl shadow-2xl rounded-[2rem] overflow-hidden flex-1">
                        <CardHeader className="p-8 border-b border-white/5 bg-white/5">
                            <CardTitle className="text-xl font-black uppercase italic tracking-tighter mb-1">Score d'Intégrité</CardTitle>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-emerald-500">92%</span>
                                <Badge className="bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase border-none">Optimal</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-5">
                            <div className="space-y-4">
                                {[
                                    { label: "Double Authentification", status: true },
                                    { label: "Filtrage d'IP (Whitelisting)", status: true },
                                    { label: "Signature Webhook", status: false },
                                    { label: "Chiffrement des Endpoints", status: true },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between text-[13px]">
                                        <span className="text-muted-foreground font-semibold text-xs uppercase tracking-tight">{item.label}</span>
                                        {item.status ? (
                                            <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                            </div>
                                        ) : (
                                            <div className="h-5 w-5 rounded-full bg-amber-500/10 flex items-center justify-center">
                                                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <Button className="w-full h-11 rounded-xl font-black uppercase italic tracking-tighter mt-4 bg-white/5 border-white/10 hover:bg-white/10" variant="outline">
                                Lancer Diagnostic
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Quick Analytics Mini Card */}
                    <Card className="border border-white/10 bg-primary/5 backdrop-blur-3xl rounded-[2rem] p-6 flex flex-row items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Appels API (24h)</p>
                            <p className="text-2xl font-black italic tracking-tighter">14.2k</p>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Zap className="h-5 w-5 text-primary" />
                        </div>
                    </Card>
                </div>

                {/* Webhooks Configuration */}
                <Card className="lg:col-span-2 border border-white/10 bg-card/60 backdrop-blur-3xl shadow-2xl rounded-[2rem] overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/5 bg-white/5 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-black uppercase italic tracking-tighter">Endpoints Webhook</CardTitle>
                            <CardDescription className="font-medium text-sm">Recevez les statuts de paiement sur votre serveur.</CardDescription>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                            <Globe className="h-6 w-6 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="space-y-3">
                            <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1 mb-2 block">Postback URL</Label>
                            <div className="flex gap-3">
                                <Input
                                    value={webhookUrl}
                                    onChange={(e) => setWebhookUrl(e.target.value)}
                                    placeholder="https://api.votre-serveur.com/webhooks/afri"
                                    className="h-12 bg-black/20 border-white/5 rounded-xl font-bold px-5 focus-visible:ring-primary/30"
                                />
                                <Button
                                    onClick={handleSaveWebhook}
                                    disabled={isSavingWebhook}
                                    className="shrink-0 h-12 px-8 rounded-xl font-black uppercase italic tracking-tighter bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                                >
                                    {isSavingWebhook ? <Loader2 className="h-5 w-5 animate-spin" /> : "Mettre à jour"}
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3 pt-2">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase opacity-50 mb-1 w-full">Événements souscrits :</div>
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-mono py-1.5 px-4 rounded-lg">payment.succeeded</Badge>
                            <Badge className="bg-red-500/10 text-red-500 border-none font-mono py-1.5 px-4 rounded-lg">payment.failed</Badge>
                            <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase px-3 py-1.5 rounded-lg">+ 12 events</Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Audit Log (Short Version) */}
                <Card className="border border-white/10 bg-card/60 backdrop-blur-3xl shadow-2xl rounded-[2rem] overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/5 bg-white/5">
                        <CardTitle className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                            <History className="h-5 w-5 text-muted-foreground" /> Journal d'Accès
                        </CardTitle>
                        <CardDescription className="font-medium">Oversight des opérations sensibles.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="space-y-6">
                            <AnimatePresence mode="popLayout">
                                {logs.length === 0 ? (
                                    <div className="py-8 flex flex-col items-center gap-2 opacity-50">
                                        <div className="h-10 w-10 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center animate-spin" />
                                        <p className="text-xs font-black uppercase tracking-widest italic">Aucun log récent</p>
                                    </div>
                                ) : (
                                    logs.map((log, i) => (
                                        <motion.div
                                            key={log.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="flex items-start gap-4"
                                        >
                                            <div className={`h-2.5 w-2.5 rounded-full mt-2 shrink-0 ${log.action.includes('fail') || log.action.includes('Tentative') ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.7)]' : 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)]'}`} />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-xs leading-none uppercase tracking-tight truncate">{log.action}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter opacity-60">
                                                        {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true, locale: fr })}
                                                    </span>
                                                    <span className="h-1 w-1 rounded-full bg-white/10" />
                                                    <span className="text-[10px] font-mono text-primary/60">{log.ipAddress || "SYSTEM"}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                        <Button variant="ghost" className="w-full mt-10 h-10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 hover:bg-primary/5 transition-all">
                            Voir historique complet
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Developer Section Integration */}
            <div className="grid gap-6 lg:grid-cols-4 mt-8">
                {/* Developer Tools Menu */}
                <div className="lg:col-span-1">
                    <div className="flex flex-col gap-3">
                        {[
                            { title: "Documentation API", sub: "Référence technique complète", icon: BookOpen, accent: "text-primary", bg: "bg-primary/10", href: "/developer/documentation" },
                            { title: "SDKs & Librairies", sub: "JS, Python, PHP, Go", icon: Blocks, accent: "text-emerald-500", bg: "bg-emerald-500/10", href: "/developer/documentation" },
                            { title: "Webhooks Reference", sub: "Liste des événements", icon: Webhook, accent: "text-amber-500", bg: "bg-amber-500/10", href: "/developer/documentation" },
                            { title: "Statut des APIs", sub: "Uptime en temps réel", icon: Cpu, accent: "text-blue-500", bg: "bg-blue-500/10", href: "/developer/documentation" },
                        ].map((item, i) => (
                            <Link key={i} href={item.href} className="group">
                                <Card className="border border-white/5 bg-card/40 backdrop-blur-xl hover:border-primary/40 transition-all cursor-pointer rounded-2xl overflow-hidden shadow-sm">
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <div className={cn(
                                            "h-12 w-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-105",
                                            item.bg || "bg-white/5"
                                        )}>
                                            <item.icon className={cn("h-6 w-6 transition-transform group-hover:rotate-3", item.accent || "text-primary")} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-[13px] tracking-tight group-hover:text-primary transition-colors">{item.title}</p>
                                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{item.sub}</p>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Integration Guide Table */}
                <Card className="lg:col-span-3 border border-white/10 bg-card/60 backdrop-blur-3xl shadow-2xl overflow-hidden rounded-[2rem]">
                    <Tabs defaultValue="nodejs" className="flex flex-col h-full">
                        <CardHeader className="p-8 border-b border-white/5 bg-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-5">
                                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                                    <CodeXml className="h-7 w-7 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="font-black text-xl text-gradient uppercase italic tracking-tighter">Guide d'Intégration Directe</CardTitle>
                                    <CardDescription className="text-muted-foreground font-semibold flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse border border-emerald-500/50" /> API v1.2 Stable
                                    </CardDescription>
                                </div>
                            </div>
                            <TabsList className="bg-white/5 border border-white/10 p-1 h-11 rounded-xl">
                                {['nodejs', 'python', 'php'].map((lang) => (
                                    <TabsTrigger
                                        key={lang}
                                        value={lang}
                                        className="text-[10px] px-6 font-black uppercase tracking-[0.2em] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all h-full"
                                    >
                                        {lang === 'nodejs' ? 'Node.js' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 relative bg-black/40">
                            {Object.entries(codeSnippets).map(([lang, code]) => (
                                <TabsContent key={lang} value={lang} className="mt-0 h-full">
                                    <div className="relative group h-full">
                                        <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all z-20 translate-y-2 group-hover:translate-y-0">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleCopyCode(code)}
                                                className="h-10 w-10 bg-white/5 border-white/10 hover:bg-white/10 backdrop-blur-xl shadow-2xl"
                                            >
                                                {copiedCode ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={handleSimulate}
                                                disabled={isSimulating}
                                                className={`h-10 w-10 bg-primary/20 border-primary/20 text-primary hover:bg-primary/30 backdrop-blur-xl shadow-2xl transition-all ${isSimulating ? 'scale-90 opacity-50' : ''}`}
                                            >
                                                {isSimulating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5" />}
                                            </Button>
                                        </div>
                                        <pre className="p-10 text-[13px] font-mono overflow-x-auto bg-[#0d1117]/60 leading-relaxed text-blue-100 min-h-[400px]">
                                            <CodeBlock code={code} />
                                        </pre>
                                    </div>
                                </TabsContent>
                            ))}
                        </CardContent>
                    </Tabs>
                </Card>
            </div>

            {/* Sandbox CTA Hero */}
            <Card id="sandbox" className="lg:col-span-4 border border-white/10 bg-card/60 backdrop-blur-3xl shadow-2xl relative overflow-hidden group rounded-[2.5rem] mt-4 ring-1 ring-white/10">
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <CardContent className="p-16 flex flex-col items-center justify-center text-center relative z-10">
                    <div className="h-24 w-24 rounded-[2rem] bg-primary/20 flex items-center justify-center mb-8 shadow-2xl ring-4 ring-primary/10 animate-pulse relative">
                        <Terminal className="h-12 w-12 text-primary" />
                        <div className="absolute -top-2 -right-2 h-6 w-6 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-xl animate-bounce">LIVE</div>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-6">AfriFlow API <span className="text-primary italic">Sandbox</span></h2>
                    <p className="text-muted-foreground max-w-2xl text-xl mb-10 leading-relaxed font-semibold">
                        Interprétez et testez vos flux de transaction sans aucun risque financier. Validez vos mappings et simulez des succès de paiement en un clic.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 w-full max-w-xl">
                        <Link href="/developer" className="flex-1">
                            <Button size="lg" className="w-full h-16 rounded-2xl font-black uppercase italic tracking-tighter text-lg shadow-2xl shadow-primary/30 translate-y-0 hover:-translate-y-2 transition-all">
                                Accéder au Playground
                            </Button>
                        </Link>
                        <Link href="/security" className="flex-1">
                            <Button variant="outline" size="lg" className="w-full h-16 rounded-2xl border-white/10 hover:bg-white/5 hover:border-white/20 font-black uppercase italic tracking-tighter text-lg transition-all group">
                                Logs en Temps Réel <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Industrial Security Notice */}
            <Card className="border-none bg-red-600/5 border border-red-600/20 overflow-hidden relative group rounded-[2.5rem] p-[1px]">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/40 via-transparent to-red-600/40 opacity-20" />
                <CardContent className="bg-card/40 backdrop-blur-3xl p-10 flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10 rounded-[2.5rem]">
                    <div className="flex items-center gap-8 text-center lg:text-left flex-1">
                        <div className="h-20 w-20 rounded-3xl bg-red-600/20 flex items-center justify-center shrink-0 border border-red-600/30 group-hover:bg-red-600/30 transition-colors">
                            <ShieldAlert className="h-10 w-10 text-red-600 animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-[950] uppercase italic tracking-tighter text-red-500 mb-2 underline decoration-red-600/30 underline-offset-8">Protection "Strict Defense"</h3>
                            <p className="text-muted-foreground font-semibold max-w-2xl text-lg leading-relaxed">
                                Verrouillez vos transactions avec l'IA d'AfriFlow. Le mode <strong>"Strict Defense"</strong> applique un filtrage géographique agressif pour bloquer instantanément les fraudes transcontinentales.
                            </p>
                        </div>
                    </div>
                    <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white shadow-2xl shadow-red-600/40 whitespace-nowrap font-[950] rounded-2xl h-16 px-12 uppercase italic tracking-tighter text-lg group overflow-hidden">
                        <span className="relative z-10">Activer Mode Strict</span>
                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
