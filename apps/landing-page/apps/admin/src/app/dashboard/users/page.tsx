"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
    Search, Filter, MoreVertical, Mail, Shield, Clock,
    UserPlus, Download, Trash2, Edit, Eye, Ban, CheckCircle,
    ArrowUpDown, ChevronLeft, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: "admin" | "user" | "moderator";
    status: "active" | "inactive" | "banned";
    plan: "free" | "pro" | "enterprise";
    createdAt: string;
    lastActive: string;
}

const users: User[] = [
    { id: "1", name: "Mamadou Diallo", email: "mamadou@example.com", avatar: "MD", role: "admin", status: "active", plan: "enterprise", createdAt: "2024-01-15", lastActive: "Il y a 5 min" },
    { id: "2", name: "Aissatou Bah", email: "aissatou@example.com", avatar: "AB", role: "user", status: "active", plan: "pro", createdAt: "2024-02-20", lastActive: "Il y a 1h" },
    { id: "3", name: "Oumar Sy", email: "oumar@example.com", avatar: "OS", role: "user", status: "inactive", plan: "free", createdAt: "2024-03-10", lastActive: "Il y a 3 jours" },
    { id: "4", name: "Fatou Ndiaye", email: "fatou@example.com", avatar: "FN", role: "moderator", status: "active", plan: "pro", createdAt: "2024-04-05", lastActive: "Il y a 2h" },
    { id: "5", name: "Ibrahim Koné", email: "ibrahim@example.com", avatar: "IK", role: "user", status: "banned", plan: "free", createdAt: "2024-05-12", lastActive: "Il y a 1 mois" },
    { id: "6", name: "Aminata Traoré", email: "aminata@example.com", avatar: "AT", role: "user", status: "active", plan: "pro", createdAt: "2024-06-18", lastActive: "Il y a 30 min" },
    { id: "7", name: "Cheikh Diop", email: "cheikh@example.com", avatar: "CD", role: "user", status: "active", plan: "free", createdAt: "2024-07-22", lastActive: "Il y a 15 min" },
    { id: "8", name: "Mariama Sow", email: "mariama@example.com", avatar: "MS", role: "admin", status: "active", plan: "enterprise", createdAt: "2024-08-30", lastActive: "En ligne" },
];

const roleStyles = {
    admin: { bg: "bg-purple-500/10", text: "text-purple-400", label: "Admin" },
    moderator: { bg: "bg-blue-500/10", text: "text-blue-400", label: "Modérateur" },
    user: { bg: "bg-zinc-500/10", text: "text-zinc-400", label: "Utilisateur" },
};

const statusStyles = {
    active: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-500", label: "Actif" },
    inactive: { bg: "bg-yellow-500/10", text: "text-yellow-400", dot: "bg-yellow-500", label: "Inactif" },
    banned: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-500", label: "Banni" },
};

const planStyles = {
    free: { bg: "bg-zinc-500/10", text: "text-zinc-400", label: "Gratuit" },
    pro: { bg: "bg-blue-500/10", text: "text-blue-400", label: "Pro" },
    enterprise: { bg: "bg-purple-500/10", text: "text-purple-400", label: "Enterprise" },
};

export default function UsersPage() {
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const toggleSelect = (id: string) => {
        setSelectedUsers(prev =>
            prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        setSelectedUsers(prev =>
            prev.length === users.length ? [] : users.map(u => u.id)
        );
    };

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Utilisateurs</h1>
                    <p className="text-zinc-500">Gérez tous les utilisateurs de la plateforme</p>
                </motion.div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">
                        <Download className="size-4 mr-2" />
                        Exporter
                    </Button>
                    <Button size="sm">
                        <UserPlus className="size-4 mr-2" />
                        Ajouter
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Total utilisateurs", value: "12,847", color: "purple" },
                    { label: "Actifs", value: "10,234", color: "emerald" },
                    { label: "Pro & Enterprise", value: "3,456", color: "blue" },
                    { label: "Nouveaux ce mois", value: "+847", color: "orange" },
                ].map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-4 rounded-xl border border-white/5 bg-white/[0.02]"
                    >
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-sm text-zinc-500">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4"
            >
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Rechercher un utilisateur..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-11 pl-11 pr-4 rounded-xl bg-white/5 border border-white/5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500/30"
                    />
                </div>
                <Button variant="outline" size="sm">
                    <Filter className="size-4 mr-2" />
                    Filtres
                </Button>
            </motion.div>

            {/* Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden"
            >
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                    <div className="col-span-1 flex items-center">
                        <input
                            type="checkbox"
                            checked={selectedUsers.length === users.length}
                            onChange={toggleSelectAll}
                            className="size-4 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-purple-500"
                        />
                    </div>
                    <div className="col-span-3 flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Utilisateur <ArrowUpDown className="size-3" />
                    </div>
                    <div className="col-span-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">Rôle</div>
                    <div className="col-span-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">Statut</div>
                    <div className="col-span-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">Plan</div>
                    <div className="col-span-1 text-xs font-medium text-zinc-500 uppercase tracking-wider">Activité</div>
                    <div className="col-span-1"></div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-white/5">
                    {users.map((user, idx) => {
                        const role = roleStyles[user.role];
                        const status = statusStyles[user.status];
                        const plan = planStyles[user.plan];

                        return (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * idx }}
                                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors group"
                            >
                                <div className="col-span-1 flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => toggleSelect(user.id)}
                                        className="size-4 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-purple-500"
                                    />
                                </div>
                                <div className="col-span-3 flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                                        {user.avatar}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{user.name}</p>
                                        <p className="text-xs text-zinc-500">{user.email}</p>
                                    </div>
                                </div>
                                <div className="col-span-2 flex items-center">
                                    <span className={cn("px-2.5 py-1 rounded-lg text-xs font-medium", role.bg, role.text)}>
                                        {role.label}
                                    </span>
                                </div>
                                <div className="col-span-2 flex items-center gap-2">
                                    <div className={cn("size-2 rounded-full", status.dot)} />
                                    <span className={cn("text-sm", status.text)}>{status.label}</span>
                                </div>
                                <div className="col-span-2 flex items-center">
                                    <span className={cn("px-2.5 py-1 rounded-lg text-xs font-medium", plan.bg, plan.text)}>
                                        {plan.label}
                                    </span>
                                </div>
                                <div className="col-span-1 flex items-center text-xs text-zinc-500">
                                    {user.lastActive}
                                </div>
                                <div className="col-span-1 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="size-8">
                                        <Eye className="size-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="size-8">
                                        <Edit className="size-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="size-8 text-red-400">
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
                    <p className="text-sm text-zinc-500">Affichage de 1-8 sur 12,847 utilisateurs</p>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="size-8">
                            <ChevronLeft className="size-4" />
                        </Button>
                        {[1, 2, 3, "...", 1606].map((page, idx) => (
                            <Button
                                key={idx}
                                variant={page === 1 ? "default" : "outline"}
                                size="sm"
                                className={cn("size-8 p-0", page === "..." && "pointer-events-none")}
                            >
                                {page}
                            </Button>
                        ))}
                        <Button variant="outline" size="icon" className="size-8">
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
