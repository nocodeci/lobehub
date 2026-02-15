"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Globe, Users, Clock, CheckCircle, AlertCircle, Search,
    Filter, Eye, UserPlus, Play, ChevronDown, X, Loader2,
    Mail, Phone, Calendar, Sparkles, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";
import { toast } from "sonner";

interface Project {
    id: string;
    reference: string;
    name: string;
    description: string;
    type: string;
    priority: string;
    requirements: string[];
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    status: string;
    price: number;
    commission?: number;
    estimatedTime: number;
    coderId?: string;
    coder?: {
        id: string;
        name: string;
        coderNumber: number;
    };
    createdAt: string;
    startedAt?: string;
    completedAt?: string;
    previewUrl?: string;
    deployUrl?: string;
}

interface VibeCoder {
    id: string;
    coderNumber: number;
    name: string;
    email: string;
    level: string;
    rating: number;
    status: string;
    totalProjects: number;
    specialty: string[];
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    PENDING: { label: "En attente paiement", color: "text-zinc-400", bg: "bg-zinc-500/10" },
    PAID: { label: "Payé - À attribuer", color: "text-yellow-400", bg: "bg-yellow-500/10" },
    ASSIGNED: { label: "Assigné", color: "text-blue-400", bg: "bg-blue-500/10" },
    BUILDING: { label: "En construction", color: "text-purple-400", bg: "bg-purple-500/10" },
    REVIEW: { label: "En révision", color: "text-orange-400", bg: "bg-orange-500/10" },
    COMPLETED: { label: "Terminé", color: "text-emerald-400", bg: "bg-emerald-500/10" },
    CANCELLED: { label: "Annulé", color: "text-red-400", bg: "bg-red-500/10" },
};

const priorityStyles: Record<string, { label: string; color: string; bg: string }> = {
    NORMAL: { label: "Normal", color: "text-zinc-400", bg: "bg-zinc-500/10" },
    HIGH: { label: "Priorité", color: "text-orange-400", bg: "bg-orange-500/10" },
    URGENT: { label: "Urgent", color: "text-red-400", bg: "bg-red-500/10" },
};

const typeIcons: Record<string, string> = {
    ECOMMERCE: "🛒",
    PORTFOLIO: "🎨",
    RESTAURANT: "🍽️",
    BLOG: "📝",
    LANDING: "🚀",
    CUSTOM: "⚡",
};

export default function GnataProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [coders, setCoders] = useState<VibeCoder[]>([]);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        paid: 0,
        building: 0,
        review: 0,
        completed: 0,
    });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [assigning, setAssigning] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            setLoading(true);

            // Fetch projects
            const projectsRes = await fetch('/api/admin/projects');
            const projectsData = await projectsRes.json();
            if (projectsData.success) {
                setProjects(projectsData.projects);
                setStats(projectsData.stats);
            }

            // Fetch coders
            const codersRes = await fetch('/api/admin/coders');
            const codersData = await codersRes.json();
            if (codersData.success) {
                setCoders(codersData.coders);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    async function assignProject(coderId: string) {
        if (!selectedProject) return;

        try {
            setAssigning(true);
            const res = await fetch('/api/admin/projects/assign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId: selectedProject.id,
                    coderId,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setShowAssignModal(false);
                setSelectedProject(null);
                fetchData();
                toast.success("Projet assigné avec succès !");
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            console.error('Error assigning project:', error);
        } finally {
            setAssigning(false);
        }
    }
    async function completeProject(projectId: string) {
        if (!confirm("Êtes-vous sûr de vouloir marquer ce projet comme terminé ?")) return;

        try {
            const res = await fetch(`/api/admin/projects/${projectId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'COMPLETED' }),
            });
            const data = await res.json();
            if (data.success) {
                fetchData();
                toast.success("Projet marqué comme terminé !");
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            console.error('Error completing project:', error);
            toast.error("Erreur lors de la validation");
        }
    }

    const filteredProjects = projects.filter(p => {
        const matchesFilter = filter === "all" || p.status === filter;
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.clientName.toLowerCase().includes(search.toLowerCase()) ||
            p.reference.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <Loader2 className="size-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Globe className="size-7 text-purple-500" />
                        Projets Gnata
                    </h1>
                    <p className="text-zinc-500">Gérez les commandes de sites et attribuez-les aux Vibe Coders</p>
                </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-6 gap-4">
                {[
                    { label: "Total", value: stats.total, icon: Globe, color: "purple" },
                    { label: "En attente", value: stats.pending, icon: Clock, color: "zinc" },
                    { label: "À attribuer", value: stats.paid, icon: UserPlus, color: "yellow" },
                    { label: "En cours", value: stats.building, icon: Play, color: "blue" },
                    { label: "Révision", value: stats.review, icon: Eye, color: "orange" },
                    { label: "Terminés", value: stats.completed, icon: CheckCircle, color: "emerald" },
                ].map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`p-4 rounded-xl border border-white/5 bg-white/[0.02] cursor-pointer hover:bg-white/[0.04] transition-colors ${filter === (stat.label === "À attribuer" ? "PAID" : stat.label === "Total" ? "all" : stat.label.toUpperCase())
                            ? "ring-2 ring-purple-500/50" : ""
                            }`}
                        onClick={() => {
                            if (stat.label === "Total") setFilter("all");
                            else if (stat.label === "À attribuer") setFilter("PAID");
                            else if (stat.label === "En attente") setFilter("PENDING");
                            else if (stat.label === "En cours") setFilter("BUILDING");
                            else if (stat.label === "Révision") setFilter("REVIEW");
                            else if (stat.label === "Terminés") setFilter("COMPLETED");
                        }}
                    >
                        <div className={`size-10 rounded-lg flex items-center justify-center mb-3 ${stat.color === "purple" ? "bg-purple-500/10 text-purple-400" :
                            stat.color === "yellow" ? "bg-yellow-500/10 text-yellow-400" :
                                stat.color === "blue" ? "bg-blue-500/10 text-blue-400" :
                                    stat.color === "emerald" ? "bg-emerald-500/10 text-emerald-400" :
                                        "bg-zinc-500/10 text-zinc-400"
                            }`}>
                            <stat.icon className="size-5" />
                        </div>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-xs text-zinc-500">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Search & Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Rechercher un projet, client..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500/50"
                    />
                </div>
                <div className="flex gap-2">
                    {["all", "PAID", "BUILDING", "REVIEW", "COMPLETED"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f
                                ? "bg-purple-600 text-white"
                                : "bg-white/5 text-zinc-400 hover:bg-white/10"
                                }`}
                        >
                            {f === "all" ? "Tous" :
                                f === "PAID" ? "À attribuer" :
                                    f === "BUILDING" ? "En cours" :
                                        f === "REVIEW" ? "En révision" : "Terminés"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Projects Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden"
            >
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase">Projet</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase">Client</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase">Statut</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase">Vibe Coder</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase">Prix</th>
                            <th className="px-6 py-4 text-right text-xs font-medium text-zinc-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredProjects.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                                    Aucun projet trouvé
                                </td>
                            </tr>
                        ) : (
                            filteredProjects.map((project) => {
                                const status = statusConfig[project.status] || statusConfig.PENDING;
                                const priority = priorityStyles[project.priority] || priorityStyles.NORMAL;

                                return (
                                    <tr key={project.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{typeIcons[project.type] || "📁"}</span>
                                                <div>
                                                    <p className="text-sm font-medium text-white">{project.name}</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-zinc-500">{project.reference}</span>
                                                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${priority.bg} ${priority.color}`}>
                                                            {priority.label}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-white">{project.clientName}</p>
                                            <p className="text-xs text-zinc-500">{project.clientEmail}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${status.bg} ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {project.coder ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="size-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                                                        {project.coder.coderNumber}
                                                    </div>
                                                    <span className="text-sm text-zinc-300">{project.coder.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-zinc-500">Non assigné</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-white">{formatNumber(project.price)} F</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {project.status === "PAID" && !project.coder && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedProject(project);
                                                            setShowAssignModal(true);
                                                        }}
                                                    >
                                                        <UserPlus className="size-4 mr-1" />
                                                        Attribuer
                                                    </Button>
                                                )}

                                                {project.status === "REVIEW" && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                                        onClick={() => completeProject(project.id)}
                                                    >
                                                        <CheckCircle className="size-4 mr-1" />
                                                        Valider
                                                    </Button>
                                                )}

                                                {project.previewUrl && (
                                                    <Button variant="outline" size="sm" asChild title="Voir la preview">
                                                        <a href={project.previewUrl} target="_blank" rel="noopener noreferrer">
                                                            <Globe className="size-4" />
                                                        </a>
                                                    </Button>
                                                )}

                                                <Button variant="outline" size="sm" onClick={() => setSelectedProject(project)}>
                                                    <Eye className="size-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </motion.div>

            {/* Assign Modal */}
            <AnimatePresence>
                {showAssignModal && selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowAssignModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-lg font-bold text-white">Attribuer le projet</h2>
                                    <p className="text-sm text-zinc-500">{selectedProject.name}</p>
                                </div>
                                <button
                                    onClick={() => setShowAssignModal(false)}
                                    className="p-2 rounded-lg hover:bg-white/5 text-zinc-500"
                                >
                                    <X className="size-5" />
                                </button>
                            </div>

                            {/* Project Summary */}
                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 mb-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl">{typeIcons[selectedProject.type] || "📁"}</span>
                                    <div>
                                        <p className="font-medium text-white">{selectedProject.name}</p>
                                        <p className="text-xs text-zinc-500">{selectedProject.reference}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-sm font-bold text-white">{formatNumber(selectedProject.price)} F</p>
                                        <p className="text-xs text-zinc-500">Prix</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-purple-400">{formatNumber(selectedProject.price * 0.3)} F</p>
                                        <p className="text-xs text-zinc-500">Commission</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{Math.floor(selectedProject.estimatedTime / 60)}h{selectedProject.estimatedTime % 60 || ''}</p>
                                        <p className="text-xs text-zinc-500">Estimé</p>
                                    </div>
                                </div>
                            </div>

                            {/* Coders List */}
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                <p className="text-sm font-medium text-zinc-400 mb-3">Sélectionnez un Vibe Coder</p>
                                {coders
                                    .sort((a, b) => {
                                        // Prioritize online coders first, then busy, then offline
                                        const statusOrder: Record<string, number> = { online: 0, busy: 1, offline: 2 };
                                        return (statusOrder[a.status] || 2) - (statusOrder[b.status] || 2);
                                    })
                                    .map((coder) => (
                                        <button
                                            key={coder.id}
                                            onClick={() => assignProject(coder.id)}
                                            disabled={assigning}
                                            className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all text-left group"
                                        >
                                            <div className="size-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                                                #{coder.coderNumber}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-white">{coder.name}</p>
                                                <div className="flex items-center gap-3 text-xs text-zinc-500">
                                                    <span className="text-purple-400">{coder.level}</span>
                                                    <span>•</span>
                                                    <span>⭐ {coder.rating}</span>
                                                    <span>•</span>
                                                    <span>{coder.totalProjects} projets</span>
                                                </div>
                                            </div>
                                            <div className={`size-2 rounded-full ${coder.status === 'online' ? 'bg-emerald-500' :
                                                coder.status === 'busy' ? 'bg-orange-500' : 'bg-zinc-500'
                                                }`} />
                                            <ArrowRight className="size-5 text-zinc-500 group-hover:text-purple-400 transition-colors" />
                                        </button>
                                    ))}
                                {coders.length === 0 && (
                                    <p className="text-center text-zinc-500 py-4">
                                        Aucun Vibe Coder disponible
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
