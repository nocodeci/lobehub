"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    ArrowRight,
    Loader2,
    RefreshCw,
    MoreVertical,
    Receipt,
    Terminal,
    RotateCcw
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getRecentTransactions } from "@/lib/actions/dashboard";
import { syncAllPendingTransactions, getTransactionLogs } from "@/lib/actions/transactions";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export function TransactionList() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);

    // Modal states
    const [selectedTx, setSelectedTx] = useState<any>(null);
    const [logs, setLogs] = useState<any[]>([]);
    const [isLogsLoading, setIsLogsLoading] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    async function fetchTransactions() {
        const data = await getRecentTransactions(10);
        setTransactions(data);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchTransactions();

        // Auto-sync pending transactions on mount
        const autoSync = async () => {
            const result = await syncAllPendingTransactions();
            if (result && result.count > 0) {
                fetchTransactions();
            }
        };
        autoSync();
    }, []);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            await syncAllPendingTransactions();
            await fetchTransactions();
            toast.success("Synchronisation terminée");
        } catch (e) {
            toast.error("Échec de la synchronisation");
        } finally {
            setIsSyncing(false);
        }
    };

    const handleViewLogs = (tx: any) => {
        console.log("Navigating to logs for:", tx.id);
        router.push(`/transactions/${tx.id}`);
    };

    const handleRefund = (tx: any) => {
        toast.info("La fonction de remboursement sera disponible prochainement.");
    };

    const handleViewReceipt = (tx: any) => {
        if (tx.status !== 'SUCCESS') {
            toast.error("Le reçu n'est disponible que pour les transactions réussies.");
            return;
        }
        router.push(`/transactions/${tx.id}`);
    };

    if (isLoading) {
        return (
            <Card className="border border-white/5 bg-[#252525] backdrop-blur-md shadow-lg h-[400px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
            </Card>
        );
    }

    return (
        <>
            <Card className="border border-white/5 bg-[#252525] backdrop-blur-md shadow-lg h-full overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-bold">Transactions Récentes</CardTitle>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSync}
                            disabled={isSyncing}
                            className="p-2 rounded-full hover:bg-[#87a9ff]/10 text-muted-foreground hover:text-[#87a9ff] transition-colors disabled:opacity-50"
                            title="Synchroniser"
                        >
                            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                        </button>
                        <button className="text-sm font-medium text-[#87a9ff] hover:underline flex items-center gap-1">
                            Voir tout <ArrowRight className="h-3 w-3" />
                        </button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-5">
                        {transactions.length > 0 ? (
                            transactions.map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 border border-border/50 shadow-sm">
                                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                                {tx.customerName ? tx.customerName.split(' ').map((n: string) => n[0]).join('').toUpperCase() : '??'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-[13px] font-semibold leading-none">{tx.customerName}</p>
                                            <p className="text-[11px] text-muted-foreground mt-1">
                                                {format(new Date(tx.createdAt), "dd MMM HH:mm", { locale: fr })} • {tx.provider}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-[14px] font-black tracking-tight">{tx.amount.toLocaleString()} {tx.currency}</p>
                                            <div className="flex items-center justify-end mt-1">
                                                {tx.status === "SUCCESS" && (
                                                    <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-2 py-0 h-5 text-[9px] font-black uppercase tracking-wider">
                                                        Reussi
                                                    </Badge>
                                                )}
                                                {tx.status === "PENDING" && (
                                                    <Badge className="bg-amber-500/10 text-amber-500 border-none px-2 py-0 h-5 text-[9px] font-black uppercase tracking-wider">
                                                        Attente
                                                    </Badge>
                                                )}
                                                {tx.status === "FAILED" && (
                                                    <Badge className="bg-red-500/10 text-red-500 border-none px-2 py-0 h-5 text-[9px] font-black uppercase tracking-wider">
                                                        Echoué
                                                    </Badge>
                                                )}
                                                {tx.status === "CANCELLED" && (
                                                    <Badge className="bg-zinc-500/10 text-zinc-500 border-none px-2 py-0 h-5 text-[9px] font-black uppercase tracking-wider">
                                                        Annulé
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="p-2 rounded-lg hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all">
                                                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-card/90 backdrop-blur-2xl border-white/10 w-48">
                                                <DropdownMenuItem
                                                    onSelect={() => {
                                                        console.log("Viewing receipt for:", tx.id);
                                                        handleViewReceipt(tx);
                                                    }}
                                                    className="font-bold cursor-pointer"
                                                >
                                                    <Receipt className="mr-2 h-4 w-4" /> Voir le reçu
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onSelect={() => {
                                                        console.log("Viewing logs for:", tx.id);
                                                        handleViewLogs(tx);
                                                    }}
                                                    className="font-bold cursor-pointer"
                                                >
                                                    <Terminal className="mr-2 h-4 w-4" /> Détails techniques
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onSelect={() => {
                                                        console.log("Refunding tx:", tx.id);
                                                        handleRefund(tx);
                                                    }}
                                                    className="font-bold text-red-500 cursor-pointer focus:text-red-500"
                                                >
                                                    <RotateCcw className="mr-2 h-4 w-4" /> Rembourser
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
                                <p className="text-sm font-medium">Aucune transaction</p>
                                <p className="text-xs">Les paiements apparaîtront ici.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="max-w-2xl bg-[#0A0A0B] border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-black uppercase tracking-tight">
                            <Terminal className="h-5 w-5 text-primary" />
                            Audit Technique : {selectedTx?.orderId}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Provider ID</p>
                                <p className="text-sm font-mono truncate">{selectedTx?.providerRef || 'N/A'}</p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Status</p>
                                <p className="text-sm font-bold uppercase">{selectedTx?.status}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-muted-foreground uppercase px-1">Historique des Logs</p>
                            <div className="bg-black/50 rounded-xl border border-white/5 overflow-hidden">
                                <div className="h-[300px] w-full p-4 overflow-y-auto custom-scrollbar">
                                    {isLogsLoading ? (
                                        <div className="h-full flex items-center justify-center">
                                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                        </div>
                                    ) : logs.length > 0 ? (
                                        <div className="space-y-4">
                                            {logs.map((log, i) => (
                                                <div key={i} className="space-y-2 border-b border-white/5 pb-4 last:border-0">
                                                    <div className="flex justify-between items-center text-[10px] font-mono">
                                                        <span className="text-primary font-bold">{log.type}</span>
                                                        <span className="text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</span>
                                                    </div>
                                                    <pre className="text-[10px] text-slate-400 bg-black/30 p-2 rounded overflow-x-auto">
                                                        {JSON.stringify(log.payload, null, 2)}
                                                    </pre>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                                            <Terminal className="h-8 w-8 mb-2" />
                                            <p className="text-xs">Aucun log technique trouvé</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
