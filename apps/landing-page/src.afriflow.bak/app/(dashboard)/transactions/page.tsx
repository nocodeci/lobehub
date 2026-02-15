"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    ArrowUpDown,
    Calendar,
    ChevronRight,
    Download,
    Filter,
    MoreHorizontal,
    Search,
    CheckCircle2,
    Clock,
    XCircle,
    CreditCard,
    Smartphone,
    RefreshCw,
    ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { getTransactions, getTransactionStats, syncAllPendingTransactions } from "@/lib/actions/transactions";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";

export default function TransactionsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [stats, setStats] = useState({
        successToday: "0 FCFA",
        pending: "0 FCFA",
        failed24h: "0 FCFA"
    });
    const [data, setData] = useState<any>({
        transactions: [],
        pagination: { total: 0, page: 1, pageSize: 10, totalPages: 0 }
    });
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search, 500);

    const loadStats = useCallback(async () => {
        const s = await getTransactionStats();
        setStats(s);
    }, []);

    const loadTransactions = useCallback(async (isInitial = false) => {
        if (isInitial) setIsLoading(true);
        else setIsTableLoading(true);

        const res = await getTransactions({
            page,
            search: debouncedSearch,
            status: statusFilter === "ALL" ? undefined : statusFilter
        });

        setData(res);
        setIsLoading(false);
        setIsTableLoading(false);
    }, [page, debouncedSearch, statusFilter]);

    const handleGlobalSync = async () => {
        setIsSyncing(true);
        try {
            await syncAllPendingTransactions();
            await Promise.all([loadStats(), loadTransactions(false)]);
            toast.success("Synchronisation effectuée");
        } catch (e) {
            toast.error("Échec de la synchronisation");
        } finally {
            setIsSyncing(false);
        }
    };

    useEffect(() => {
        loadStats();

        // Auto-sync on page load
        const autoSync = async () => {
            const res = await syncAllPendingTransactions();
            if (res && res.count > 0) {
                await Promise.all([loadStats(), loadTransactions(false)]);
            }
        };
        autoSync();
    }, [loadStats]);

    useEffect(() => {
        loadTransactions(isLoading);
    }, [loadTransactions, page, debouncedSearch, statusFilter]);

    useEffect(() => {
        setPage(1); // Reset page on filter change
    }, [debouncedSearch, statusFilter]);

    if (isLoading) {
        return (
            <div className="p-8 animate-pulse space-y-8">
                <div className="flex justify-between items-center">
                    <div className="h-10 w-48 bg-card/40 rounded-lg" />
                    <div className="flex gap-2">
                        <div className="h-10 w-24 bg-card/40 rounded-lg" />
                        <div className="h-10 w-24 bg-card/40 rounded-lg" />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                    <div className="h-24 bg-card/40 rounded-xl" />
                    <div className="h-24 bg-card/40 rounded-xl" />
                    <div className="h-24 bg-card/40 rounded-xl" />
                </div>
                <div className="h-96 bg-card/40 rounded-3xl" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto flex flex-col gap-8">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-[900] tracking-tight uppercase italic">
                        Transactions
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        Historique complet des flux financiers à travers vos passerelles.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2 border-white/10 bg-white/5 backdrop-blur-md font-bold h-12 rounded-xl">
                        <Calendar className="h-4 w-4" /> Période
                    </Button>
                    <Button variant="outline" className="gap-2 border-white/10 bg-white/5 backdrop-blur-md font-bold h-12 rounded-xl">
                        <Download className="h-4 w-4" /> Exporter CSV
                    </Button>
                </div>
            </div>

            {/* Stats Summary Area */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Réussies aujourd'hui", value: stats.successToday, icon: CheckCircle2, color: "emerald", bg: "bg-emerald-500/5", glow: "bg-emerald-500/10", accent: "bg-emerald-500/20", text: "text-emerald-500" },
                    { label: "En attente", value: stats.pending, icon: Clock, color: "amber", bg: "bg-amber-500/5", glow: "bg-amber-500/10", accent: "bg-amber-500/20", text: "text-amber-500" },
                    { label: "Échecs (24h)", value: stats.failed24h, icon: XCircle, color: "red", bg: "bg-red-500/5", glow: "bg-red-500/10", accent: "bg-red-500/20", text: "text-red-500" },
                ].map((stat, i) => (
                    <div key={i} className={`text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm border border-white/10 ${stat.bg} backdrop-blur-xl relative overflow-hidden group`}>
                        <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.glow} rounded-full blur-3xl group-hover:bg-opacity-20 transition-all`} />
                        <div className="px-6 flex items-center gap-4 relative z-10">
                            <div className={`h-12 w-12 rounded-2xl ${stat.accent} flex items-center justify-center`}>
                                <stat.icon className={`h-6 w-6 ${stat.text}`} />
                            </div>
                            <div>
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{stat.label}</p>
                                <p className="text-2xl font-bold tracking-tighter">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <Card className="border border-white/10 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden relative">
                {isTableLoading && (
                    <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px] z-20 flex items-center justify-center">
                        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
                <CardHeader className="flex-row items-center justify-between border-b border-white/5 pb-6">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Filtrer par ID, client, montant..."
                                className="pl-10 h-11 bg-white/5 border-white/10 rounded-xl font-bold"
                            />
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleGlobalSync}
                            disabled={isSyncing}
                            className="border border-white/10 bg-white/5 h-11 w-11 rounded-xl hover:bg-white/10 transition-all"
                            title="Synchroniser les statuts"
                        >
                            <RefreshCw className={`h-4 w-4 text-muted-foreground ${isSyncing ? 'animate-spin' : ''}`} />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="border border-white/10 bg-white/5 h-11 w-11 rounded-xl">
                                    <Filter className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56 bg-card/90 backdrop-blur-2xl border-white/10 focus:outline-none">
                                <DropdownMenuItem onClick={() => setStatusFilter("ALL")} className="font-bold">Tout voir</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter("SUCCESS")} className="text-emerald-500 font-bold">Réussi uniquement</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter("PENDING")} className="text-amber-500 font-bold">En attente uniquement</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter("FAILED")} className="text-red-500 font-bold">Échecs uniquement</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter("CANCELLED")} className="text-zinc-500 font-bold">Annulés uniquement</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="h-9 px-4 rounded-lg bg-primary/10 text-primary border-none font-bold">
                            {statusFilter === "ALL" ? "Toutes les transactions" : statusFilter === "SUCCESS" ? "Transactions Réussies" : statusFilter === "FAILED" ? "Transactions Échouées" : statusFilter === "CANCELLED" ? "Transactions Annulées" : "Transactions en Attente"}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-white/[0.02]">
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead className="w-[120px] pl-6 font-black uppercase text-[10px] tracking-widest text-muted-foreground">ID Transaction</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Client</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Date & Heure</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Méthode</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Passerelle</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Montant</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground text-center">Statut</TableHead>
                                <TableHead className="pr-6"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <AnimatePresence mode="popLayout">
                                {data.transactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
                                                <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
                                                    <Search className="h-8 w-8 opacity-20" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-lg font-bold text-white/50 tracking-tight">Aucune transaction trouvée</p>
                                                    <p className="text-sm">Modifiez vos filtres ou effectuez une nouvelle recherche.</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data.transactions.map((tx: any, index: number) => (
                                        <motion.tr
                                            key={tx.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-white/5 hover:bg-white/[0.03] transition-colors cursor-pointer group"
                                        >
                                            <TableCell className="pl-6 font-mono text-[11px] text-muted-foreground uppercase">{tx.id}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8 border border-white/10 ring-4 ring-primary/5">
                                                        <AvatarFallback className="text-[10px] bg-primary/20 text-primary font-bold">
                                                            {tx.customer ? tx.customer.split(' ').map((n: any) => n[0]).join('') : '??'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm tracking-tight">{tx.customer}</span>
                                                        <span className="text-[10px] text-muted-foreground">{tx.email}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground font-medium">{tx.date}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-xs">
                                                    {tx.method === "Mobile Money" ? <Smartphone className="h-3.5 w-3.5 text-blue-400" /> : <CreditCard className="h-3.5 w-3.5 text-purple-400" />}
                                                    <span className="font-bold">{tx.method}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-[10px] border-white/10 bg-white/5 font-bold uppercase tracking-wider px-2">
                                                    {tx.gateway}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-black text-sm tracking-tighter text-white">{tx.amount}</span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    className={`
                                                        ${tx.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' : ''}
                                                        ${tx.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : ''}
                                                        ${tx.status === 'failed' ? 'bg-red-500/10 text-red-500' : ''}
                                                        ${tx.status === 'cancelled' ? 'bg-zinc-500/10 text-zinc-500' : ''}
                                                        border-none px-3 py-0.5 h-6 text-[10px] font-black uppercase tracking-wider
                                                    `}
                                                >
                                                    {tx.status === 'success' ? 'Réussi' : tx.status === 'pending' ? 'Attente' : tx.status === 'cancelled' ? 'Annulé' : 'Échoué'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="group-hover:bg-white/10 rounded-xl h-9 w-9">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-card/90 backdrop-blur-2xl border-white/10">
                                                        <DropdownMenuItem
                                                            onSelect={() => router.push(`/transactions/${tx.id}`)}
                                                            className="font-bold cursor-pointer"
                                                        >
                                                            Voir le reçu
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onSelect={() => router.push(`/transactions/${tx.id}`)}
                                                            className="font-bold cursor-pointer"
                                                        >
                                                            Détails techniques
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onSelect={() => toast.info("Remboursement disponible prochainement.")}
                                                            className="text-red-500 font-bold cursor-pointer"
                                                        >
                                                            Rembourser
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </TableBody>
                    </Table>
                </CardContent>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-5 border-t border-white/5 bg-white/[0.01]">
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                        {data.pagination.total > 0 ? (
                            `Affichage de ${(data.pagination.page - 1) * data.pagination.pageSize + 1}-${Math.min(data.pagination.page * data.pagination.pageSize, data.pagination.total)} sur ${data.pagination.total} transactions`
                        ) : (
                            "Aucune transaction à afficher"
                        )}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="h-9 px-4 border-white/10 text-xs font-bold rounded-xl gap-2 hover:bg-white/10 transition-all"
                        >
                            <ChevronLeft className="h-4 w-4" /> Précédent
                        </Button>
                        <div className="flex items-center px-4 bg-primary/10 text-primary font-black text-xs rounded-xl border border-primary/20">
                            {page} / {data.pagination.totalPages || 1}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page >= data.pagination.totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="h-9 px-4 border-white/10 text-xs font-bold rounded-xl gap-2 hover:bg-white/10 transition-all"
                        >
                            Suivant <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
