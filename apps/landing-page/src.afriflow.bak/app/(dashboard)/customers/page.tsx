"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Search,
    UserPlus,
    MoreHorizontal,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Filter,
    Download,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    X
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { getCustomers, getCustomerStats, createCustomer, exportCustomersAction } from "@/lib/actions/customers";
import { useDebounce } from "@/hooks/use-debounce";

export default function CustomersPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [open, setOpen] = useState(false);
    const [stats, setStats] = useState({
        totalCustomers: "0",
        customersThisMonth: "+0 ce mois",
        activeCustomers: "0",
        retentionRate: "0% de rétention",
        newCustomers24h: "0",
        basketLabel: "Global",
        avgBasket: "0 F"
    });
    const [data, setData] = useState<any>({
        customers: [],
        pagination: { total: 0, page: 1, pageSize: 10, totalPages: 0 }
    });
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const debouncedSearch = useDebounce(search, 500);

    const handleBlock = (email: string) => {
        if (confirm(`Voulez-vous vraiment bloquer ${email} ?\nCette action est irréversible pour le moment.`)) {
            alert("Cette fonctionnalité sera disponible prochainement.");
        }
    };

    const loadStats = useCallback(async () => {
        const s = await getCustomerStats();
        setStats(s);
    }, []);

    const loadCustomers = useCallback(async (isInitial = false) => {
        if (isInitial) setIsLoading(true);
        else setIsTableLoading(true);

        const res = await getCustomers({
            page,
            search: debouncedSearch
        });

        setData(res);
        setIsLoading(false);
        setIsTableLoading(false);
    }, [page, debouncedSearch]);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    useEffect(() => {
        loadCustomers(isLoading);
    }, [loadCustomers, page, debouncedSearch]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    async function handleAddCustomer(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const customerData = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            country: formData.get('country') as string || "Sénégal"
        };

        const res = await createCustomer(customerData);
        if (res.success) {
            setOpen(false);
            loadCustomers();
            loadStats();
        } else {
            setError(res.error || "Une erreur est survenue.");
        }
        setIsSubmitting(false);
    }

    async function handleExport() {
        setIsExporting(true);
        const res = await exportCustomersAction();
        if (res.success && res.csvContent) {
            const blob = new Blob([res.csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `customers_export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        setIsExporting(false);
    }

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
                <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-card/40 rounded-xl" />)}
                </div>
                <div className="h-96 bg-card/40 rounded-3xl" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-[900] tracking-tight uppercase italic">Clientèle</h1>
                    <p className="text-muted-foreground font-medium">
                        Visualisez et gérez votre base d'utilisateurs à travers le continent.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="gap-2 border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 font-bold h-11 rounded-xl"
                        onClick={handleExport}
                        disabled={isExporting}
                    >
                        {isExporting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                        {isExporting ? "Exportation..." : "Exporter"}
                    </Button>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 bg-primary shadow-lg shadow-primary/20 font-bold h-11 rounded-xl">
                                <UserPlus className="h-4 w-4" /> Ajouter un client
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card/90 backdrop-blur-3xl border-white/10 text-card-foreground sm:max-w-[425px] rounded-2xl overflow-hidden shadow-2xl">
                            <form onSubmit={handleAddCustomer}>
                                <DialogHeader className="pb-4">
                                    <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">Nouveau Client</DialogTitle>
                                    <DialogDescription className="text-muted-foreground font-medium">
                                        Remplissez les détails pour enregistrer un nouveau client manuellement.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-6 py-4">
                                    {error && (
                                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                                            <AlertCircle className="h-4 w-4" />
                                            {error}
                                        </div>
                                    )}
                                    <div className="grid gap-2">
                                        <Label htmlFor="name" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Nom complet</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="ex: Amadou Diallo"
                                            className="bg-white/5 border-white/10 h-11 rounded-xl font-bold"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Email professionnel</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="ex: amadou@teranga.sn"
                                            className="bg-white/5 border-white/10 h-11 rounded-xl font-bold"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="phone" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Téléphone</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                placeholder="+221 ..."
                                                className="bg-white/5 border-white/10 h-11 rounded-xl font-bold"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="country" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Pays</Label>
                                            <Input
                                                id="country"
                                                name="country"
                                                defaultValue="Sénégal"
                                                className="bg-white/5 border-white/10 h-11 rounded-xl font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter className="pt-2">
                                    <Button type="submit" disabled={isSubmitting} className="w-full bg-primary font-black h-12 rounded-xl shadow-lg shadow-primary/20">
                                        {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
                                        {isSubmitting ? "Création..." : "Enregistrer le client"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Analytics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Clients", value: stats.totalCustomers, sub: stats.customersThisMonth, color: "blue", bg: "bg-blue-500/5", glow: "bg-blue-500/10" },
                    { label: "Clients Actifs", value: stats.activeCustomers, sub: stats.retentionRate, color: "emerald", bg: "bg-emerald-500/5", glow: "bg-emerald-500/10" },
                    { label: "Nouveaux (24h)", value: stats.newCustomers24h, sub: "Développement stable", color: "purple", bg: "bg-purple-500/5", glow: "bg-purple-500/10" },
                    { label: "Panier Moyen", value: stats.avgBasket, sub: stats.basketLabel, color: "amber", bg: "bg-amber-500/5", glow: "bg-amber-500/10" },
                ].map((stat, i) => (
                    <Card key={i} className={`border border-white/10 ${stat.bg} backdrop-blur-xl group hover:border-primary/30 transition-all duration-300 rounded-xl relative overflow-hidden`}>
                        <div className={`absolute -right-4 -top-4 w-12 h-12 ${stat.glow} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                        <CardContent className="p-4 relative z-10">
                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{stat.label}</p>
                            <h3 className="text-2xl font-bold mt-1 tracking-tighter">{stat.value}</h3>
                            <p className={`text-[10px] mt-1 font-bold text-${stat.color}-500/80`}>{stat.sub}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search and Filters */}
            <Card className="border border-white/10 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden rounded-2xl relative">
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
                                placeholder="Rechercher par Nom, Email, Mobile..."
                                className="pl-10 h-11 bg-white/5 border-white/10 rounded-xl font-bold focus-visible:ring-primary/30"
                            />
                        </div>
                        <Button variant="outline" className="gap-2 border-white/10 bg-white/5 h-11 rounded-xl font-bold px-4">
                            <Filter className="h-4 w-4" /> Filtres avancés
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-white/[0.02]">
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead className="pl-6 font-black uppercase text-[10px] tracking-widest text-muted-foreground">Client</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Localisation</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Contact</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground text-center">Transactions</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Total Dépensé</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Dernière Activité</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground text-center">Statut</TableHead>
                                <TableHead className="pr-6"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <AnimatePresence mode="popLayout">
                                {data.customers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
                                                <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
                                                    <Search className="h-8 w-8 opacity-20" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-lg font-bold text-white/50 tracking-tight">Aucun client trouvé</p>
                                                    <p className="text-sm">Vérifiez vos critères de recherche.</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data.customers.map((customer: any, index: number) => (
                                        <motion.tr
                                            key={customer.email}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-white/5 hover:bg-white/[0.03] transition-colors group cursor-pointer"
                                        >
                                            <TableCell className="pl-6">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 border border-white/10 ring-4 ring-primary/5">
                                                        <AvatarFallback className="text-xs bg-primary/20 text-primary font-bold">
                                                            {customer.name.split(' ').map((n: string) => n[0]).join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm tracking-tight">{customer.name}</span>
                                                        <span className="text-[10px] text-muted-foreground uppercase font-mono">{customer.id}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-xs font-medium">
                                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                                    {customer.country}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
                                                        <Mail className="h-3 w-3" /> {customer.email}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
                                                        <Phone className="h-3 w-3" /> {customer.phone}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline" className="bg-white/5 border-white/10 font-black px-4 h-7 rounded-lg">
                                                    {customer.transactions}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5 font-bold text-sm text-emerald-500 tracking-tighter">
                                                    {customer.totalSpent}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                                    <Calendar className="h-3 w-3" /> {customer.lastActive}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge className={`
                                                    ${customer.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}
                                                    border-none px-3 h-6 text-[10px] font-black uppercase tracking-wider
                                                `}>
                                                    {customer.status === 'active' ? 'ACTIF' : 'INACTIF'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="group-hover:bg-white/10 rounded-xl h-9 w-9">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-card/90 backdrop-blur-2xl border-white/10 font-bold">
                                                        <DropdownMenuItem onClick={() => setSelectedCustomer(customer)}>
                                                            Voir le profil
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => setSelectedCustomer(customer)}>
                                                            Historique
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <a href={`mailto:${customer.email}`} className="w-full cursor-default">
                                                                Envoyer Email
                                                            </a>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
                                                            onClick={() => handleBlock(customer.email)}
                                                        >
                                                            Bloquer
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
                            `Affichage de ${(data.pagination.page - 1) * data.pagination.pageSize + 1}-${Math.min(data.pagination.page * data.pagination.pageSize, data.pagination.total)} sur ${data.pagination.total} clients`
                        ) : (
                            "Aucun client à afficher"
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

            <Sheet open={!!selectedCustomer} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
                <SheetContent className="overflow-y-auto bg-card border-l border-white/10 backdrop-blur-xl w-full sm:w-[500px]">
                    {selectedCustomer && (
                        <>
                            <SheetHeader className="pb-6 border-b border-white/5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center p-1 border border-white/10">
                                        <Avatar className="h-full w-full">
                                            <AvatarFallback className="text-xl bg-primary/20 text-primary font-bold">
                                                {selectedCustomer.name.split(' ').map((n: string) => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <Badge variant="outline" className={`${selectedCustomer.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'} px-3 py-1 text-xs font-black uppercase tracking-wider`}>
                                        {selectedCustomer.status === 'active' ? 'Compte Actif' : 'Compte Inactif'}
                                    </Badge>
                                </div>
                                <div>
                                    <SheetTitle className="text-3xl font-black italic tracking-tighter uppercase text-white">{selectedCustomer.name}</SheetTitle>
                                    <SheetDescription className="text-muted-foreground font-medium mt-1 flex flex-col gap-1">
                                        <span className="flex items-center gap-2"><Mail size={14} /> {selectedCustomer.email}</span>
                                        <span className="flex items-center gap-2"><Phone size={14} /> {selectedCustomer.phone}</span>
                                        <span className="flex items-center gap-2"><MapPin size={14} /> {selectedCustomer.country}</span>
                                    </SheetDescription>
                                </div>
                            </SheetHeader>

                            <div className="py-8 space-y-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Dépensé</p>
                                        <p className="text-xl font-black text-emerald-500 tracking-tight">{selectedCustomer.totalSpent}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Transactions</p>
                                        <p className="text-xl font-black text-white tracking-tight">{selectedCustomer.transactions} <span className="text-xs text-muted-foreground font-bold">CMD</span></p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Actions Rapides</h3>
                                    <div className="grid gap-3">
                                        <Button variant="outline" className="w-full justify-start h-12 rounded-xl text-left font-bold border-white/10 hover:bg-white/5 gap-3" onClick={() => window.location.href = `mailto:${selectedCustomer.email}`}>
                                            <Mail className="h-4 w-4" /> Envoyer un email
                                        </Button>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button variant="outline" className="w-full justify-start h-12 rounded-xl text-left font-bold border-white/10 hover:bg-white/5 gap-3">
                                                <Download className="h-4 w-4" /> Export KYB
                                            </Button>
                                            <Button variant="outline" className="w-full justify-start h-12 rounded-xl text-left font-bold border-white/10 hover:bg-white/5 gap-3 text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleBlock(selectedCustomer.email)}>
                                                <AlertCircle className="h-4 w-4" /> Bloquer
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div >
    );
}
