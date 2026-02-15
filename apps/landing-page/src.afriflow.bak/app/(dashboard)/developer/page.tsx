"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Code2,
    BookOpen,
    Terminal as TerminalIcon,
    Copy,
    Play,
    Cpu,
    Blocks,
    FileCode,
    Braces,
    Webhook,
    CodeXml,
    Check,
    Loader2,
    Zap,
    ChevronRight,
    Activity,
    ShieldCheck,
    LayoutDashboard,
    Key,
    Eye,
    EyeOff,
    Smartphone,
    Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useMemo } from "react";
import { getApiConfig } from "@/lib/actions/security";
import { getAnalyticsData } from "@/lib/actions/analytics";
import Link from "next/link";
import { useApplication } from "@/components/context/application-context"; // Assuming this exists or we fetch App ID

const CodeBlock = ({ code }: { code: string }) => {
    const lines = code.split('\n');

    return (
        <code className="block">
            {lines.map((line, i) => {
                if (line.trim().startsWith('//') || line.trim().startsWith('#') || line.includes('<?php')) {
                    return <div key={i} className="text-muted-foreground/60 italic whitespace-pre">{line || ' '}</div>;
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
                                return <span key={j} className="text-amber-400">{part}</span>;
                            }
                            if (['afriflow', 'payments', 'create', 'client'].includes(trimmed)) {
                                return <span key={j} className="text-blue-400">{part}</span>;
                            }
                            return <span key={j}>{part}</span>;
                        })}
                    </div>
                );
            })}
        </code>
    );
};

export default function DeveloperPage() {
    const [config, setConfig] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [copiedCode, setCopiedCode] = useState(false);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const [showSecret, setShowSecret] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);

    // In a real scenario, we'd get the current App ID from a context or state
    // For now, we rely on the backend `getApiConfig` to return data for the selected app context

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [apiData, analyticsData] = await Promise.all([
                getApiConfig(),
                getAnalyticsData(7)
            ]);
            setConfig(apiData);
            setStats(analyticsData);
        } catch (error) {
            console.error("Developer page failed to load config:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleCopyCode = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
    };

    const handleCopyKey = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(type);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const handleSimulate = () => {
        setIsSimulating(true);
        setTimeout(() => setIsSimulating(false), 2000);
    };

    const codeSnippets = useMemo(() => {
        const key = config?.publicKey || 'af_live_...92kf';
        const appId = config?.applicationId || 'app_...'; // Fallback
        return {
            nodejs: `// Initialisation de l'orchestrateur AfriFlow\nconst afriflow = require('afriflow-sdk')('${key}');\n\n// Pour les intégrations serveur à serveur, incluez votre App ID: '${appId}'\n\n// Création d'une transaction multi-passerelle\nconst transaction = await afriflow.payments.create({\n  amount: 25000,\n  currency: 'XOF',\n  customer: 'cust_842h94k',\n  routing: 'auto_optimize',\n  metadata: {\n    order_id: 'ORDER-993'\n  }\n});\n\nconsole.log('ID de transaction:', transaction.id);`,
            python: `# Initialisation de l'orchestrateur AfriFlow\nimport afriflow\n\nclient = afriflow.Client(api_key="${key}")\n# App ID: ${appId}\n\n# Création d'une transaction multi-passerelle\ntransaction = client.payments.create(\n    amount=25000,\n    currency="XOF",\n    customer_id="cust_842h94k",\n    routing="auto_optimize",\n    metadata={\n        "order_id": "ORDER-993"\n    }\n)\n\nprint(f"ID de transaction: {transaction.id}")`,
            php: `<?php\n// Initialisation de l'orchestrateur AfriFlow\n$afriflow = new \\AfriFlow\\Client('${key}');\n// App ID: ${appId}\n\n// Création d'une transaction multi-passerelle\n$transaction = $afriflow->payments->create([\n    'amount' => 25000,\n    'currency' => 'XOF',\n    'customer' => 'cust_842h94k',\n    'routing' => 'auto_optimize',\n    'metadata' => [\n        'order_id' => 'ORDER-993'\n    ]\n]);\n\necho "ID de transaction: " . $transaction->id;`
        };
    }, [config]);

    return (
        <div id="top" className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto p-4 md:p-8">
            {/* Developer Hub Header */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 border border-white/5 p-8 md:p-12 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
                <div className="absolute top-0 right-0 p-12 opacity-5 blur-3xl">
                    <Zap className="h-64 w-64 text-primary" />
                </div>

                <div className="relative z-10 grid gap-12 lg:grid-cols-2 items-center">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Badge className="bg-primary/20 text-primary border-primary/20 px-3 py-1 font-black uppercase tracking-[0.2em] text-[10px]">Technical Hub</Badge>
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">API Status: Operational</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-[950] tracking-tighter uppercase italic leading-[0.9]">
                            Developer <span className="text-primary italic">Ecosystem</span>
                        </h1>
                        <p className="text-muted-foreground font-medium max-w-lg text-lg leading-relaxed">
                            L'orchestrateur de paiements unifié pour l'Afrique. Connectez-vous à Orange, MTN, Wave et Moov via une API REST unique et robuste.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/developer/documentation">
                                <Button size="lg" className="rounded-2xl h-14 px-8 font-black uppercase italic tracking-tighter shadow-xl shadow-primary/20 group">
                                    <BookOpen className="h-5 w-5 mr-3 group-hover:rotate-6 transition-transform" /> Lire la Doc
                                </Button>
                            </Link>
                            <Button variant="outline" size="lg" className="rounded-2xl h-14 px-8 font-black uppercase italic tracking-tighter border-white/10 hover:bg-white/5 group">
                                <TerminalIcon className="h-5 w-5 mr-3 group-hover:translate-x-1 transition-transform" /> API Explorer
                            </Button>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Temps de Réponse", value: stats?.stats[1]?.value || "0.8s", icon: Activity, color: "text-blue-500" },
                            { label: "Taux de Succès", value: stats?.stats[2] ? (100 - parseFloat(stats.stats[2].value)).toFixed(1) + "%" : "99.9%", icon: ShieldCheck, color: "text-emerald-500" },
                            { label: "Uptime (30j)", value: "99.99%", icon: Cpu, color: "text-purple-500" },
                            { label: "Appels API (24h)", value: stats?.stats[0]?.value ? "1.2k" : "---", icon: Zap, color: "text-primary" }
                        ].map((stat, i) => (
                            <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm group hover:bg-white/10 transition-colors">
                                <stat.icon className={`h-6 w-6 ${stat.color} mb-3 group-hover:scale-110 transition-transform`} />
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                                <p className="text-2xl font-black italic tracking-tighter">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left Column: Tools & Keys */}
                <div className="lg:col-span-1 space-y-8">
                    {/* API Key Manager (Quick View) */}
                    <Card className="border border-white/10 bg-card/60 backdrop-blur-3xl shadow-2xl rounded-[2rem] overflow-hidden">
                        <CardHeader className="p-8 border-b border-white/5">
                            <div className="flex items-center justify-between mb-2">
                                <CardTitle className="text-xl font-[950] uppercase italic tracking-tighter">Accès API</CardTitle>
                                <Key className="h-5 w-5 text-primary" />
                            </div>
                            <CardDescription className="text-xs font-semibold">Gérez vos identifiants d'intégration directe.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            {/* App ID Display */}
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">App ID</Label>
                                <div className="relative group">
                                    <div className="h-12 bg-black/40 border border-white/5 rounded-xl px-4 flex items-center font-mono text-xs text-blue-400 overflow-hidden pr-12">
                                        {config?.applicationId || "Waiting for Context..."}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleCopyKey(config?.applicationId, 'appid')}
                                        className="absolute right-1 top-1 h-10 w-10 text-muted-foreground hover:text-primary"
                                    >
                                        {copiedKey === 'appid' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Public Key</Label>
                                    <div className="relative group">
                                        <div className="h-12 bg-black/40 border border-white/5 rounded-xl px-4 flex items-center font-mono text-xs text-primary/80 overflow-hidden pr-12">
                                            {config?.publicKey || "••••••••••••••••"}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleCopyKey(config?.publicKey, 'pub')}
                                            className="absolute right-1 top-1 h-10 w-10 text-muted-foreground hover:text-primary"
                                        >
                                            {copiedKey === 'pub' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Secret Key</Label>
                                    <div className="relative group">
                                        <div className={`h-12 bg-black/40 border border-white/5 rounded-xl px-4 flex items-center font-mono text-xs pr-20 overflow-hidden ${!showSecret ? "blur-md opacity-50" : "text-emerald-400"}`}>
                                            {config?.secretKey || "••••••••••••••••"}
                                        </div>
                                        <div className="absolute right-1 top-1 flex gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => setShowSecret(!showSecret)} className="h-10 w-10 text-muted-foreground">
                                                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleCopyKey(config?.secretKey, 'sec')}
                                                className="h-10 w-10 text-muted-foreground hover:text-emerald-500"
                                            >
                                                {copiedKey === 'sec' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Link href="/security">
                                <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 hover:bg-white/5 font-black uppercase italic tracking-tighter text-xs">
                                    Paramètres Avancés
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                </div>

                {/* Right Column: Integration Workspace */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Multi-language Guide */}
                    <Card id="docs" className="border border-white/10 bg-slate-900 shadow-2xl overflow-hidden rounded-[2.5rem] relative">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <CodeXml className="h-32 w-32" />
                        </div>
                        <Tabs defaultValue="nodejs" className="flex flex-col h-full">
                            <CardHeader className="p-8 border-b border-white/5 bg-slate-950/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-5">
                                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                                        <Code2 className="h-7 w-7 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="font-[950] text-2xl text-gradient uppercase italic tracking-tighter">Guide d'Intégration</CardTitle>
                                        <CardDescription className="text-muted-foreground font-semibold flex items-center gap-2">
                                            Simple • Rapide • Puissant
                                        </CardDescription>
                                    </div>
                                </div>
                                <TabsList className="bg-slate-900 border border-white/10 p-1.5 h-12 rounded-2xl">
                                    {['nodejs', 'python', 'php'].map((lang) => (
                                        <TabsTrigger
                                            key={lang}
                                            value={lang}
                                            className="text-[10px] px-8 font-black uppercase tracking-[0.2em] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl transition-all h-full"
                                        >
                                            {lang === 'nodejs' ? 'Node.js' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </CardHeader>
                            <CardContent className="p-0 flex-1">
                                {isLoading ? (
                                    <div className="p-20 flex flex-col items-center justify-center gap-6">
                                        <Loader2 className="h-12 w-12 text-primary animate-spin" />
                                        <p className="font-black text-muted-foreground animate-pulse uppercase tracking-[0.3em] text-[10px]">Bootstrapping SDK Examples...</p>
                                    </div>
                                ) : (
                                    Object.entries(codeSnippets).map(([lang, code]) => (
                                        <TabsContent key={lang} value={lang} className="mt-0 h-full">
                                            <div className="relative group h-full">
                                                <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all z-20 translate-y-2 group-hover:translate-y-0">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleCopyCode(code)}
                                                        className="h-12 w-12 bg-slate-900/90 border-white/10 hover:bg-slate-800 backdrop-blur-xl shadow-2xl rounded-xl"
                                                    >
                                                        {copiedCode ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5 font-bold" />}
                                                    </Button>
                                                </div>
                                                <pre className="p-10 text-sm font-mono overflow-x-auto bg-[#0d1117] leading-relaxed text-blue-100 min-h-[450px]">
                                                    <CodeBlock code={code} />
                                                </pre>
                                            </div>
                                        </TabsContent>
                                    ))
                                )}
                            </CardContent>
                        </Tabs>
                    </Card>

                </div>
            </div>

            {/* Bottom: Ecosystem Status & Links */}
            <div className="grid gap-6 md:grid-cols-4">
                {[
                    { label: "Mobile Money CI", status: "Operational", color: "bg-emerald-500", icon: Smartphone },
                    { label: "Wave Integration", status: "Operational", color: "bg-emerald-500", icon: LayoutDashboard },
                    { label: "Direct Card (VISA)", status: "Degraded", color: "bg-amber-500", icon: Globe },
                    { label: "Moov Money ML", status: "Maintenance", color: "bg-red-500", icon: Smartphone },
                ].map((item, i) => (
                    <Card key={i} className="border border-white/5 bg-card/40 backdrop-blur-3xl rounded-3xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                                <item.icon className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className={`h-2 w-2 rounded-full ${item.color} shadow-[0_0_8px_currentColor]`} />
                        </div>
                        <p className="font-black text-xs uppercase italic tracking-tighter mb-1">{item.label}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{item.status}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
}
