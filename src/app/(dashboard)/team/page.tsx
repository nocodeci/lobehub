"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    UserPlus,
    Search,
    MoreVertical,
    Mail,
    Shield,
    UserCircle2,
    Lock,
    MessageSquare,
    Globe,
    Star,
    RefreshCw,
    X,
    AlertCircle,
    Trash2
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { getTeamMembers, inviteTeamMember, removeTeamMember, getAuditLogs } from "@/lib/actions/team";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export default function TeamPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [members, setMembers] = useState<any[]>([]);
    const [logs, setLogs] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [logSearch, setLogSearch] = useState("");

    const loadData = useCallback(async () => {
        setIsLoading(true);
        const [memberData, logData] = await Promise.all([
            getTeamMembers(),
            getAuditLogs()
        ]);
        setMembers(memberData);
        setLogs(logData);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    async function handleInvite(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            role: formData.get('role') as string,
            permission: formData.get('permission') as string
        };

        const res = await inviteTeamMember(data);
        if (res.success) {
            setOpen(false);
            loadData();
        } else {
            setError(res.error || "Une erreur est survenue.");
        }
        setIsSubmitting(false);
    }

    async function handleDeleteMember(id: string) {
        if (!confirm("Êtes-vous sûr de vouloir retirer ce collaborateur ?")) return;

        const res = await removeTeamMember(id);
        if (res.success) {
            loadData();
        }
    }

    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase())
    );

    const filteredLogs = logs.filter(l =>
        l.actorName.toLowerCase().includes(logSearch.toLowerCase()) ||
        l.action.toLowerCase().includes(logSearch.toLowerCase())
    );

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
                <div className="grid grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-card/40 rounded-3xl" />)}
                </div>
                <div className="h-96 bg-card/40 rounded-3xl mt-8" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-[900] tracking-tight uppercase italic">Gestion de l'Équipe</h1>
                    <p className="text-muted-foreground font-medium mt-1">
                        Gérez les accès et les rôles des collaborateurs de votre organisation.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="border-white/10 bg-white/5 uppercase text-[10px] font-black tracking-widest px-6 h-12 rounded-xl">
                        Rôles & Permissions
                    </Button>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-12 px-6 gap-2 rounded-xl shadow-lg shadow-primary/20 font-bold">
                                <UserPlus className="h-5 w-5" /> Inviter un membre
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card/90 backdrop-blur-3xl border-white/10 text-card-foreground sm:max-w-[425px] rounded-2xl shadow-2xl">
                            <form onSubmit={handleInvite}>
                                <DialogHeader className="pb-4">
                                    <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-gradient">Invitation Équipe</DialogTitle>
                                    <DialogDescription className="text-muted-foreground font-medium">
                                        Envoyez une invitation pour collaborer sur votre espace.
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
                                        <Label htmlFor="name" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Nom du collaborateur</Label>
                                        <Input id="name" name="name" placeholder="ex: Sarah Diallo" className="bg-white/5 border-white/10 h-11 rounded-xl font-bold" required />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Email</Label>
                                        <Input id="email" name="email" type="email" placeholder="ex: s.diallo@domain.com" className="bg-white/5 border-white/10 h-11 rounded-xl font-bold" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="role" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Poste / Rôle</Label>
                                            <Input id="role" name="role" placeholder="ex: Dev Senior" className="bg-white/5 border-white/10 h-11 rounded-xl font-bold" required />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="permission" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Permission</Label>
                                            <select name="permission" className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold outline-none focus:ring-1 focus:ring-primary/50">
                                                <option value="Super Admin" className="bg-card">Super Admin</option>
                                                <option value="Manager" className="bg-card">Manager</option>
                                                <option value="Développeur" className="bg-card">Développeur</option>
                                                <option value="Support" className="bg-card">Support</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter className="pt-2">
                                    <Button type="submit" disabled={isSubmitting} className="w-full bg-primary font-black h-12 rounded-xl shadow-lg shadow-primary/20">
                                        {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
                                        Inviter le membre
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Grid of Team Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <AnimatePresence mode="popLayout">
                    {filteredMembers.map((member, i) => (
                        <motion.div
                            key={member.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card className="border border-white/10 bg-card/60 backdrop-blur-xl hover:bg-card/80 transition-all duration-300 group rounded-3xl overflow-hidden relative h-full">
                                <div className={`absolute top-0 right-0 h-1 w-full ${member.status === 'En ligne' ? 'bg-emerald-500' :
                                    member.status === 'Absent' ? 'bg-amber-500' : 'bg-white/10'
                                    }`} />

                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="relative">
                                            <div className="h-20 w-20 rounded-2xl overflow-hidden border-2 border-white/10 bg-white/5 p-1 group-hover:scale-105 transition-transform duration-500">
                                                <img src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} alt={member.name} className="h-full w-full object-cover rounded-xl" />
                                            </div>
                                            <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-4 border-background ${member.status === 'En ligne' ? 'bg-emerald-500' :
                                                member.status === 'Absent' ? 'bg-amber-500' : 'bg-muted-foreground'
                                                }`} />
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-muted-foreground hover:bg-white/10">
                                                    <MoreVertical className="h-5 w-5" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-card/90 backdrop-blur-xl border-white/10 font-bold">
                                                <DropdownMenuItem>Modifier le rôle</DropdownMenuItem>
                                                <DropdownMenuItem>Suspendre l'accès</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-500" onClick={() => handleDeleteMember(member.id)}>
                                                    <Trash2 className="h-4 w-4 mr-2" /> Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold tracking-tight line-clamp-1">{member.name}</h3>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Shield className="h-3 w-3 text-primary" /> {member.permission}
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <Mail className="h-4 w-4 shrink-0" />
                                            <span className="truncate">{member.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <UserCircle2 className="h-4 w-4 shrink-0" />
                                            <span>{member.role}</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex gap-2">
                                        <Button variant="ghost" className="flex-1 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold">
                                            Profil
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-primary/10 text-primary hover:bg-primary/20">
                                            <MessageSquare className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}

                    {/* Empty Invite Slot */}
                    <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => setOpen(true)}
                    >
                        <Card className="h-full border-2 border-dashed border-white/5 bg-transparent hover:border-primary/30 transition-all group flex flex-col items-center justify-center py-12 px-6 text-center cursor-pointer rounded-3xl min-h-[300px]">
                            <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                                <UserPlus className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <p className="font-bold text-muted-foreground group-hover:text-white transition-colors">Ajouter un collaborateur</p>
                            <p className="text-[10px] text-muted-foreground mt-1 px-4 leading-relaxed">
                                Partagez l'accès à ce tableau de bord avec vos collègues.
                            </p>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Access Log Section */}
            <Card className="border border-white/10 bg-card/60 backdrop-blur-xl rounded-3xl overflow-hidden mt-4">
                <CardHeader className="p-8 border-b border-white/5 bg-white/5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                                <Lock className="h-6 w-6 text-amber-500" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-black uppercase italic tracking-tighter">Journaux d'Accès</CardTitle>
                                <CardDescription className="font-medium">Consultez les dernières connexions et actions de l'équipe.</CardDescription>
                            </div>
                        </div>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={logSearch}
                                onChange={(e) => setLogSearch(e.target.value)}
                                placeholder="Filtrer par membre..."
                                className="h-11 pl-10 bg-white/5 border-white/10 rounded-xl font-bold"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="p-8 space-y-6">
                        <AnimatePresence mode="popLayout">
                            {filteredLogs.length === 0 ? (
                                <p className="text-center text-muted-foreground font-medium py-8">Aucun journal d'accès trouvé.</p>
                            ) : (
                                filteredLogs.map((log, i) => (
                                    <motion.div
                                        key={log.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="flex items-center justify-between group hover:pl-2 transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-xs font-black text-muted-foreground">
                                                {log.actorName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">{log.actorName} <span className="text-muted-foreground font-normal ml-2">{log.action}</span></p>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 uppercase font-bold tracking-widest">
                                                        <Star className="h-3 w-3" />
                                                        {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true, locale: fr })}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground italic font-medium flex items-center gap-1">
                                                        <Globe className="h-3 w-3" />
                                                        {log.location || "Inconnu"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant="secondary" className="bg-white/10 border-none text-[10px] font-mono group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            {log.ipAddress || "0.0.0.0"}
                                        </Badge>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
