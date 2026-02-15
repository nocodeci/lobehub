"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTransactionById, getTransactionLogs, syncTransactionStatus } from "@/lib/actions/transactions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChevronLeft,
    Terminal,
    Clock,
    User,
    Mail,
    CreditCard,
    Smartphone,
    Globe,
    ShieldCheck,
    ArrowRightCircle,
    Receipt,
    RotateCcw,
    Zap,
    Download,
    RefreshCw
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

export default function TransactionDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [transaction, setTransaction] = useState<any>(null);
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);

    const loadData = async () => {
        const id = params.id as string;
        if (!id) return;

        const [txData, logData] = await Promise.all([
            getTransactionById(id),
            getTransactionLogs(id)
        ]);

        setTransaction(txData);
        setLogs(logData);
    };

    useEffect(() => {
        const init = async () => {
            await loadData();
            setIsLoading(false);
        };
        init();
    }, [params.id]);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const res = await syncTransactionStatus(transaction.id);
            if (res.error) {
                toast.error(`Erreur : ${res.error}`);
            } else {
                toast.success(`Statut synchronisé : ${res.status}`);
                await loadData();
            }
        } catch (error) {
            toast.error("Échec de la synchronisation");
        } finally {
            setIsSyncing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 animate-pulse space-y-8">
                <div className="h-10 w-48 bg-card/40 rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="h-64 bg-card/40 rounded-3xl" />
                    <div className="h-64 bg-card/40 rounded-3xl" />
                </div>
            </div>
        );
    }

    if (!transaction) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <p className="text-xl font-bold opacity-50">Transaction introuvable</p>
                <Button onClick={() => router.back()}>Retour</Button>
            </div>
        );
    }

    const isMobile = (transaction.paymentType || '').toLowerCase().includes('mobile');

    return (
        <>
            <div className="p-8 max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        className="gap-2 -ml-4 hover:bg-white/5"
                        onClick={() => router.back()}
                    >
                        <ChevronLeft className="h-4 w-4" /> Retour à l'historique
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="gap-2 border-white/10"
                            onClick={() => {
                                if (transaction.status !== 'SUCCESS') {
                                    toast.error("Le reçu n'est disponible que pour les transactions réussies.");
                                    return;
                                }
                                setIsReceiptOpen(true);
                            }}
                        >
                            <Receipt className="h-4 w-4" /> Reçu
                        </Button>
                        <Button variant="outline" className="gap-2 border-white/10 text-red-400 hover:text-red-500" onClick={() => toast.info("Remboursement disponible prochainement.")}>
                            <RotateCcw className="h-4 w-4" /> Rembourser
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="border-white/10 bg-card/60 backdrop-blur-xl overflow-hidden">
                            <CardHeader className="border-b border-white/5 pb-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">ID de Transaction</p>
                                        <h1 className="text-2xl font-black font-mono uppercase">{transaction.id}</h1>
                                    </div>
                                    <Badge
                                        className={`
                                        ${transaction.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500' : ''}
                                        ${transaction.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' : ''}
                                        ${transaction.status === 'FAILED' ? 'bg-red-500/10 text-red-500' : ''}
                                        border-none px-4 py-1.5 text-xs font-black uppercase tracking-wider
                                    `}
                                    >
                                        {transaction.status === 'SUCCESS' ? 'Réussi' : transaction.status === 'PENDING' ? 'En Attente' : 'Échoué'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-8 space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                                            <User size={12} /> Client
                                        </p>
                                        <p className="font-bold text-lg">{transaction.customerName}</p>
                                        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                            <Mail size={12} /> {transaction.customerEmail}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Montant Total</p>
                                        <p className="text-4xl font-black tracking-tighter">
                                            {transaction.amount.toLocaleString()} <span className="text-xl text-primary">{transaction.currency}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/5 grid grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Méthode</p>
                                        <div className="flex items-center gap-2">
                                            {isMobile ? <Smartphone size={14} className="text-blue-400" /> : <CreditCard size={14} className="text-purple-400" />}
                                            <span className="font-bold text-sm">{transaction.paymentType || 'Standard'}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Passerelle</p>
                                        <div className="flex items-center gap-2">
                                            <Globe size={14} className="text-emerald-400" />
                                            <span className="font-bold text-sm">{transaction.provider}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</p>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Clock size={14} />
                                            <span className="font-bold text-sm">
                                                {format(new Date(transaction.createdAt), "dd MMMM yyyy HH:mm", { locale: fr })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-md font-black uppercase tracking-tight flex items-center gap-2">
                                    <Terminal size={18} className="text-primary" /> Audit Technique
                                </CardTitle>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 gap-2 border-white/5 bg-white/5 hover:bg-white/10"
                                    onClick={handleSync}
                                    disabled={isSyncing}
                                >
                                    <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
                                    Synchroniser
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {logs.length > 0 ? (
                                        logs.map((log, i) => (
                                            <div key={i} className="bg-black/40 rounded-xl border border-white/5 p-4 space-y-3">
                                                <div className="flex justify-between items-center font-mono">
                                                    <span className="text-[10px] font-black text-primary uppercase">{log.type}</span>
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {format(new Date(log.timestamp), "HH:mm:ss.SSS", { locale: fr })}
                                                    </span>
                                                </div>
                                                <pre className="text-[10px] text-slate-400 overflow-x-auto p-2 bg-black/20 rounded">
                                                    {JSON.stringify(log.payload, null, 2)}
                                                </pre>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-12 text-center opacity-30">
                                            <p className="text-sm italic">Aucune donnée d'audit disponible pour cette transaction.</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="text-sm font-black uppercase tracking-widest">Résumé du Flux</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                        <ShieldCheck size={16} className="text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold">Initiation</p>
                                        <p className="text-[10px] text-muted-foreground">{format(new Date(transaction.createdAt), "HH:mm:ss")}</p>
                                    </div>
                                </div>
                                <div className="h-8 w-px bg-white/5 ml-4" />
                                <div className="flex items-start gap-4">
                                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                        <ArrowRightCircle size={16} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold">Traitement Provider</p>
                                        <p className="text-[10px] text-muted-foreground">{transaction.providerRef || 'En attente...'}</p>
                                    </div>
                                </div>
                                {transaction.status === 'SUCCESS' && (
                                    <>
                                        <div className="h-8 w-px bg-white/5 ml-4" />
                                        <div className="flex items-start gap-4">
                                            <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                                                <ShieldCheck size={16} className="text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold">Réussite Confirmée</p>
                                                <p className="text-[10px] text-muted-foreground">ID: {transaction.orderId}</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-white/10 bg-primary/5">
                            <CardContent className="pt-6">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Note de Securité</p>
                                <p className="text-xs leading-relaxed text-muted-foreground">
                                    Cette transaction a été traitée via un canal sécurisé et vérifiée par l'orchestrateur AfriFlow.
                                    Les logs d'audit sont conservés pendant 30 jours conformément aux normes PCI-DSS.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Receipt Modal */}
            <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
                <DialogContent className="max-w-md bg-white text-slate-950 p-0 overflow-hidden border-none shadow-2xl max-h-[95vh] flex flex-col">
                    <div className="p-6 space-y-5">
                        {/* Receipt Header */}
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="h-12 w-12 bg-slate-950 rounded-xl flex items-center justify-center text-white shrink-0">
                                <Zap className="h-6 w-6 fill-current text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black italic tracking-tighter uppercase leading-tight">AfriFlow <span className="text-slate-500 italic">Receipt</span></h2>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Transaction Certifiée Souveraine</p>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-dashed border-slate-200" />

                        {/* Receipt Details */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-400 uppercase text-[9px] tracking-widest">Référence</span>
                                <span className="font-mono font-bold text-slate-900">{transaction.id.substring(0, 12).toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-400 uppercase text-[9px] tracking-widest">Date</span>
                                <span className="font-bold text-slate-900">{format(new Date(transaction.createdAt), "dd MMM yyyy HH:mm", { locale: fr })}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-400 uppercase text-[9px] tracking-widest">Passerelle</span>
                                <span className="font-bold text-slate-900">{transaction.provider}</span>
                            </div>
                        </div>

                        {/* Customer & Amount Box */}
                        <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
                            <div className="space-y-0.5">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Client</p>
                                <p className="font-bold text-slate-900 text-sm">{transaction.customerName}</p>
                                <p className="text-[10px] text-slate-500 font-medium">{transaction.customerEmail}</p>
                            </div>
                            <div className="pt-3 border-t border-slate-200">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Montant Payé</p>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-2xl font-black tracking-tighter text-slate-950 font-sans">
                                        {transaction.amount.toLocaleString()}
                                    </span>
                                    <span className="text-sm font-black text-primary">{transaction.currency}</span>
                                </div>
                            </div>
                        </div>

                        {/* Status Stamp */}
                        <div className="flex justify-center py-1">
                            <div className="border-2 border-emerald-500/20 text-emerald-500 px-4 py-1.5 rounded-lg rotate-[-5deg] font-black uppercase text-lg tracking-tighter shadow-sm flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5" /> PAYÉ
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="text-center space-y-1.5">
                            <p className="text-[9px] text-slate-400 font-medium leading-tight">
                                Merci d'utiliser l'infrastructure AfriFlow.<br />
                                Ce document fait office de preuve de paiement officielle.
                            </p>
                            <div className="flex justify-center gap-3 text-[8px] font-bold text-slate-300 uppercase tracking-widest">
                                <span>PCI-DSS COMPLIANT</span>
                                <span>•</span>
                                <span>SECURE CLOUD</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="bg-slate-950 p-4 flex gap-3 shrink-0">
                        <Button
                            className="flex-1 bg-white text-slate-950 hover:bg-slate-100 font-black uppercase tracking-widest text-[10px] h-11"
                            onClick={() => window.print()}
                        >
                            <Download className="h-4 w-4 mr-2" /> Imprimer / PDF
                        </Button>
                        <Button
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10 font-black uppercase tracking-widest text-[10px] h-11"
                            onClick={() => setIsReceiptOpen(false)}
                        >
                            Fermer
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
