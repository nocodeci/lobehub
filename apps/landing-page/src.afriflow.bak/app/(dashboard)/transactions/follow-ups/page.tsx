"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    MessageSquare,
    Mail,
    Search,
    Clock,
    CheckCircle2,
    RefreshCw,
    TrendingUp,
    Send,
    AlertCircle,
    Bell,
    Zap,
    QrCode,
    Smartphone,
    ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { getFollowUpCandidates, getWhatsAppStatus, generateWhatsAppQR, getFollowUpStats, toggleWhatsAppAutomation, sendFollowUp, disconnectWhatsApp } from "@/lib/actions/follow-ups";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export default function FollowUpsPage() {
    const router = useRouter();
    const [followUps, setFollowUps] = useState<any[]>([]);
    const [wsStatus, setWsStatus] = useState<any>({ status: "DISCONNECTED" });
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState<string | null>(null);
    const [showQRModal, setShowQRModal] = useState(false);
    const [isSyncComplete, setIsSyncComplete] = useState(false);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [stats, setStats] = useState({
        recoveryRate: "0%",
        recoveredAmount: "0 FCFA",
        pendingFollowups: "0"
    });

    useEffect(() => {
        async function loadData() {
            const [candidates, status, currentStats] = await Promise.all([
                getFollowUpCandidates(),
                getWhatsAppStatus(),
                getFollowUpStats()
            ]);
            setFollowUps(candidates);
            console.log("[FollowUps] WhatsApp Status from server:", status);
            setWsStatus(status);
            setStats(currentStats);
            setIsLoading(false);
        }
        loadData();
    }, []);

    // Status & QR Polling when modal is open
    useEffect(() => {
        let interval: any;
        if (showQRModal || (wsStatus.status !== "CONNECTED" && !isLoading)) {
            interval = setInterval(async () => {
                // Poll for status
                const status = await getWhatsAppStatus();
                console.log("[FollowUps] Polling status:", status);
                setWsStatus(status);

                if (status.status === "ERROR_ALREADY_USED") {
                    toast.error(status.error || "Ce compte WhatsApp est déjà utilisé par une autre application.");
                    setShowQRModal(false);
                }

                // If modal is open and we don't have a QR yet, try to get one
                if (showQRModal && !qrCode && status.status !== "CONNECTED") {
                    const res = await generateWhatsAppQR();
                    if (res.qrCode) {
                        setQrCode(res.qrCode);
                    }
                }

                // If we just connected while modal is open, show success then close
                if (status.status === "CONNECTED" && showQRModal && !isSyncComplete) {
                    setIsSyncComplete(true);
                    setTimeout(() => {
                        setShowQRModal(false);
                        setIsSyncComplete(false);
                    }, 2500);
                }
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [showQRModal, wsStatus.status, qrCode, isLoading, isSyncComplete]);

    const handleConnectWhatsApp = async () => {
        setShowQRModal(true);
        const res = await generateWhatsAppQR();
        if (res.qrCode) {
            setQrCode(res.qrCode);
        }
    };

    const handleSend = async (type: 'whatsapp' | 'email', id: string) => {
        if (type === 'whatsapp' && wsStatus.status !== "CONNECTED") {
            toast.error("Veuillez d'abord connecter WhatsApp");
            handleConnectWhatsApp();
            return;
        }

        setIsProcessing(`${type}-${id}`);
        try {
            const res = await sendFollowUp(type, id);
            if (res.success) {
                toast.success(`Relance ${type} envoyée avec succès`);
            } else {
                toast.error(res.error || `Échec de la relance ${type}`);
            }
        } catch (e) {
            toast.error("Une erreur est survenue");
        } finally {
            setIsProcessing(null);
        }
    };

    const handleToggleAutomation = async () => {
        // If trying to enable but not connected, show QR modal instead
        if (!wsStatus.autoFollowupEnabled && wsStatus.status !== "CONNECTED") {
            handleConnectWhatsApp();
            return;
        }

        setIsProcessing('automation');
        const res = await toggleWhatsAppAutomation();
        if (res.success) {
            setWsStatus((prev: any) => ({ ...prev, autoFollowupEnabled: res.enabled }));
        }
        setIsProcessing(null);
    };

    const handleDisconnect = async () => {
        if (!confirm("Voulez-vous vraiment réinitialiser votre session WhatsApp ? Cela supprimera votre historique local.")) return;

        setIsProcessing('disconnect');
        try {
            const res = await disconnectWhatsApp();
            if (res.success) {
                toast.success("Session réinitialisée. Vous pouvez scanner à nouveau.");
                setWsStatus({ status: "DISCONNECTED" });
                setQrCode(null);
                setShowQRModal(false);
            } else {
                toast.error("Échec de la réinitialisation");
            }
        } catch (e) {
            toast.error("Une erreur est survenue");
        } finally {
            setIsProcessing(null);
        }
    };

    if (isLoading) {
        return <div className="p-8 animate-pulse space-y-8">
            <div className="h-32 bg-card/40 rounded-3xl" />
            <div className="grid grid-cols-3 gap-6">
                <div className="h-24 bg-card/40 rounded-xl" />
                <div className="h-24 bg-card/40 rounded-xl" />
                <div className="h-24 bg-card/40 rounded-xl" />
            </div>
            <div className="h-96 bg-card/40 rounded-3xl" />
        </div>;
    }

    console.log("[FollowUps] Render Status:", wsStatus.status);

    return (
        <div className="p-8 max-w-7xl mx-auto flex flex-col gap-8">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-[900] tracking-tight uppercase italic">
                        Relances <span className="text-primary tracking-tighter">Automatisées</span>
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        Récupérez vos ventes perdues via WhatsApp et Email.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant={wsStatus.status === "CONNECTED" ? "secondary" : "default"}
                        onClick={handleConnectWhatsApp}
                        disabled={wsStatus.status === "INITIALIZING" || wsStatus.status === "PAIRING"}
                        className="gap-2 h-12 rounded-xl font-bold min-w-[180px]"
                    >
                        {wsStatus.status === "CONNECTED" ? (
                            <> <CheckCircle2 className="h-4 w-4 text-emerald-500" /> WhatsApp Connecté </>
                        ) : wsStatus.status === "INITIALIZING" || wsStatus.status === "PAIRING" ? (
                            <> <RefreshCw className="h-4 w-4 animate-spin" /> {wsStatus.status === "INITIALIZING" ? "Démarrage..." : "Synchronisation..."} </>
                        ) : (
                            <> <QrCode className="h-4 w-4" /> Connecter WhatsApp </>
                        )}
                    </Button>
                    <Button
                        onClick={handleToggleAutomation}
                        variant="outline"
                        className="gap-2 border-white/10 bg-white/5 backdrop-blur-md font-bold h-12 rounded-xl"
                    >
                        <RefreshCw className={`h-4 w-4 ${isProcessing === 'automation' ? 'animate-spin' : ''}`} />
                        {wsStatus.autoFollowupEnabled ? "Gérer l'Auto-Relance" : "Configurer l'Auto-Relance"}
                    </Button>
                </div>
            </div>

            {/* QR Connection Modal */}
            <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
                <DialogContent className="sm:max-w-md bg-card/90 backdrop-blur-2xl border-white/10">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">
                            Connecter <span className="text-primary">WhatsApp</span>
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium">
                            Scannez ce code QR avec votre application WhatsApp pour commencer l'orchestration des relances.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center p-6 gap-6">
                        <div className="p-4 bg-white rounded-3xl shadow-2xl shadow-primary/20">
                            {isSyncComplete ? (
                                <div className="w-64 h-64 flex flex-col items-center justify-center text-center gap-4 bg-emerald-50 rounded-2xl">
                                    <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center animate-bounce">
                                        <CheckCircle2 className="h-12 w-12 text-emerald-600" />
                                    </div>
                                    <p className="text-lg font-black text-emerald-700 tracking-tighter">
                                        Synchronisation terminée !
                                    </p>
                                    <p className="text-[10px] text-emerald-600/70 font-bold uppercase tracking-widest">
                                        Prêt pour les relances
                                    </p>
                                </div>
                            ) : wsStatus.status === "PAIRING" ? (
                                <div className="w-64 h-64 flex flex-col items-center justify-center text-center gap-4 bg-primary/5 rounded-2xl animate-pulse">
                                    <CheckCircle2 className="h-16 w-16 text-primary" />
                                    <p className="text-sm font-bold text-primary">
                                        Scan réussi !
                                    </p>
                                    <p className="text-[10px] text-slate-500 max-w-[180px]">
                                        Synchronisation de votre compte en cours...
                                    </p>
                                </div>
                            ) : wsStatus.status === "INITIALIZING" ? (
                                <div className="w-64 h-64 flex flex-col items-center justify-center text-center gap-4">
                                    <RefreshCw className="h-10 w-10 animate-spin text-primary" />
                                    <p className="text-[10px] text-slate-500 max-w-[180px]">
                                        Initialisation de votre instance...
                                    </p>
                                </div>
                            ) : qrCode ? (
                                <img src={qrCode} alt="WhatsApp QR Code" className="w-64 h-64" />
                            ) : (
                                <div className="w-64 h-64 flex flex-col items-center justify-center text-center gap-4">
                                    <RefreshCw className="h-10 w-10 animate-spin text-primary" />
                                    <p className="text-[10px] text-slate-500 max-w-[180px]">
                                        En attente du signal depuis le serveur AfriFlow...
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 text-center">
                            {!qrCode && (
                                <p className="text-xs text-rose-500 font-bold flex items-center justify-center gap-1">
                                    <AlertCircle className="h-3 w-3" /> Assurez-vous que le bridge est lancé
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                                <Clock className="h-3 w-3" /> Le code expire dans 60 secondes
                            </p>

                            <div className="mt-4 pt-4 border-t border-white/5 w-full">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleDisconnect}
                                    disabled={isProcessing === 'disconnect'}
                                    className="w-full text-[10px] text-muted-foreground hover:text-red-400 gap-2 uppercase font-black tracking-widest"
                                >
                                    {isProcessing === 'disconnect' ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                                    Réinitialiser la session (en cas d'erreur)
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Conversion Impact Area */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Taux de Récupération", value: stats.recoveryRate, icon: TrendingUp, color: "emerald", glow: "bg-emerald-500/10", accent: "bg-emerald-500/20", text: "text-emerald-500" },
                    { label: "Ventes Récupérées", value: stats.recoveredAmount, icon: CheckCircle2, color: "primary", glow: "bg-primary/10", accent: "bg-primary/20", text: "text-primary" },
                    { label: "En Attente de Relance", value: stats.pendingFollowups, icon: Clock, color: "amber", glow: "bg-amber-500/10", accent: "bg-amber-500/20", text: "text-amber-500" },
                ].map((stat, i) => (
                    <div key={i} className="text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm border border-white/10 bg-card/40 backdrop-blur-xl relative overflow-hidden group">
                        <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.glow} rounded-full blur-3xl group-hover:bg-opacity-20 transition-all`} />
                        <div className="px-6 flex items-center gap-4 relative z-10">
                            <div className={`h-12 w-12 rounded-2xl ${stat.accent} flex items-center justify-center`}>
                                <stat.icon className={`h-6 w-6 ${stat.text}`} />
                            </div>
                            <div>
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">{stat.label}</p>
                                <p className="text-2xl font-bold tracking-tighter">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Engagement Table */}
            <Card className="border border-white/10 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden">
                <CardHeader className="flex-row items-center justify-between border-b border-white/5 pb-6">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Filtrer par client ou ID..."
                                className="pl-10 h-12 bg-white/5 border-white/10 rounded-xl font-bold"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${wsStatus.autoFollowupEnabled ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border-white/5'} text-[10px] font-black uppercase tracking-widest border`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${wsStatus.autoFollowupEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                            {wsStatus.autoFollowupEnabled ? "Smart-Relance Active" : "Smart-Relance Désactivée"}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-white/[0.02]">
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead className="pl-6 font-black uppercase text-[10px] tracking-[0.2em] text-muted-foreground">Client & Panier</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-[0.2em] text-muted-foreground">Type d'Incident</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-[0.2em] text-muted-foreground">Dernière Tentative</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-[0.2em] text-muted-foreground">Montant</TableHead>
                                <TableHead className="pr-6 font-black uppercase text-[10px] tracking-[0.2em] text-muted-foreground text-right">Actions de Relance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {followUps.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground pt-12">
                                            <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
                                                <Search className="h-8 w-8 opacity-20" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-lg font-bold text-white/50 tracking-tight">Aucun candidat trouvé</p>
                                                <p className="text-sm">Les transactions à relancer apparaîtront ici.</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                followUps.map((item, index) => (
                                    <motion.tr
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="border-white/5 hover:bg-white/[0.03] transition-colors"
                                    >
                                        <TableCell className="pl-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-10 w-10 border border-white/10 ring-4 ring-primary/5">
                                                    <AvatarFallback className="text-xs bg-primary/20 text-primary font-bold">
                                                        {item.customer.split(' ').map((n: string) => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm tracking-tight">{item.customer}</span>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[9px] text-muted-foreground font-mono uppercase opacity-50">{item.id}</span>
                                                        {item.phone && item.phone !== "N/A" ? (
                                                            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                                                                <Smartphone className="h-2.5 w-2.5 text-emerald-500" />
                                                                <span className="text-[10px] text-emerald-400 font-black">{item.phone}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-[9px] text-red-500/40 font-bold italic">Numéro manquant</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className={`text-[10px] border-none px-2 py-0 h-5 font-black uppercase tracking-wider ${item.status === 'abandoned' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                                                    }`}>
                                                    {item.type}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-bold text-slate-300">{item.lastCheck}</span>
                                                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                    <RefreshCw className="h-2.5 w-2.5" /> {item.retrials} tentative(s)
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-black text-sm tracking-tighter text-white">{item.amount}</span>
                                        </TableCell>
                                        <TableCell className="pr-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleSend('whatsapp', item.id)}
                                                    className="h-10 px-4 rounded-xl border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500 hover:text-white transition-all text-emerald-500 font-bold gap-2"
                                                >
                                                    {isProcessing === `whatsapp-${item.id}` ? <RefreshCw className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
                                                    WhatsApp
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleSend('email', item.id)}
                                                    className="h-10 px-4 rounded-xl border-blue-500/20 bg-blue-500/5 hover:bg-blue-500 hover:text-white transition-all text-blue-500 font-bold gap-2"
                                                >
                                                    {isProcessing === `email-${item.id}` ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                                                    Email
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </motion.tr>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Help/Engagement Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border border-white/10 bg-primary/5 backdrop-blur-xl p-8 rounded-3xl relative overflow-hidden group border-l-4 border-l-primary">
                    <div className="relative z-10">
                        <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
                            <Bell className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Smart Notification WhatsApp</h3>
                        <p className="text-sm text-slate-400 font-medium mb-6 leading-relaxed">
                            Augmentez vos revenus en envoyant automatiquement un message WhatsApp personnalisé 15 minutes après un abandon de panier.
                        </p>
                        <Button
                            onClick={handleToggleAutomation}
                            disabled={isProcessing === 'automation'}
                            variant={wsStatus.autoFollowupEnabled ? "secondary" : "default"}
                            className="rounded-xl font-bold gap-2 h-12"
                        >
                            {isProcessing === 'automation' ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    {wsStatus.autoFollowupEnabled ? "Désactiver l'automatisation" : "Activer l'automatisation"}
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </div>
                    <div className="absolute right-[-20px] bottom-[-20px] opacity-10 rotate-12 scale-150 group-hover:rotate-0 transition-transform duration-700">
                        <Zap className="w-32 h-32 text-primary" />
                    </div>
                </Card>

                <Card className="border border-white/10 bg-white/5 backdrop-blur-xl p-8 rounded-3xl relative overflow-hidden group border-l-4 border-l-blue-500">
                    <div className="relative z-10">
                        <div className="h-12 w-12 rounded-2xl bg-blue-500 flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20">
                            <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Analytiques de Récupération</h3>
                        <p className="text-sm text-slate-400 font-medium mb-6 leading-relaxed">
                            Identifiez les raisons courantes d'échec de paiement et optimisez vos parcours de conversion en temps réel.
                        </p>
                        <Button
                            onClick={() => router.push('/transactions')}
                            variant="outline"
                            className="rounded-xl border-white/10 font-bold gap-2"
                        >
                            Voir les rapports détaillés <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="absolute right-[-20px] bottom-[-20px] opacity-10 rotate-12 scale-150 group-hover:rotate-0 transition-transform duration-700 font-black text-6xl text-white">
                        %
                    </div>
                </Card>
            </div>
        </div>
    );
}

