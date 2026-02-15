"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
    FolderKanban, Clock, CheckCircle, Search, Filter,
    Eye, ExternalLink, MoreVertical, Pause, Play, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface MyProject {
    id: string;
    name: string;
    client: string;
    type: string;
    status: "building" | "review" | "completed";
    progress: number;
    startedAt: string;
    estimatedEnd: string;
    commission: number;
    previewUrl?: string;
}

const myProjects: MyProject[] = [
    {
        id: "1",
        name: "E-commerce Mode Africaine",
        client: "Mamadou D.",
        type: "E-commerce",
        status: "building",
        progress: 65,
        startedAt: "Il y a 45 min",
        estimatedEnd: "55 min restantes",
        commission: 9000,
    },
    {
        id: "2",
        name: "Portfolio Photographe",
        client: "Aissatou B.",
        type: "Portfolio",
        status: "building",
        progress: 23,
        startedAt: "Il y a 1h30",
        estimatedEnd: "1h10 restantes",
        commission: 7500,
    },
    {
        id: "3",
        name: "Restaurant Le Maquis",
        client: "Oumar S.",
        type: "Restaurant",
        status: "review",
        progress: 100,
        startedAt: "Hier",
        estimatedEnd: "En attente validation",
        commission: 8400,
        previewUrl: "https://preview.gnata.io/restaurant-maquis"
    },
    {
        id: "4",
        name: "Blog Voyage Africain",
        client: "Fatou N.",
        type: "Blog",
        status: "completed",
        progress: 100,
        startedAt: "Il y a 2 jours",
        estimatedEnd: "Complété en 1h32",
        commission: 6000,
        previewUrl: "https://blog-voyage.gnata.io"
    },
    {
        id: "5",
        name: "Landing Startup Tech",
        client: "Ibrahim K.",
        type: "Landing",
        status: "completed",
        progress: 100,
        startedAt: "Il y a 3 jours",
        estimatedEnd: "Complété en 58min",
        commission: 5400,
        previewUrl: "https://startup-landing.gnata.io"
    },
];

const statusConfig = {
    building: {
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
        label: "En construction",
        icon: Clock
    },
    review: {
        color: "text-yellow-400",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/20",
        label: "En révision",
        icon: Eye
    },
    completed: {
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        label: "Terminé",
        icon: CheckCircle
    },
};

export default function MyProjectsPage() {
    const [filter, setFilter] = useState<"all" | "building" | "review" | "completed">("all");

    const filteredProjects = filter === "all"
        ? myProjects
        : myProjects.filter(p => p.status === filter);

    const stats = {
        building: myProjects.filter(p => p.status === "building").length,
        review: myProjects.filter(p => p.status === "review").length,
        completed: myProjects.filter(p => p.status === "completed").length,
        totalCommission: myProjects.filter(p => p.status === "completed").reduce((sum, p) => sum + p.commission, 0),
    };

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4"
                >
                    <div className="size-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                        <FolderKanban className="size-6 text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Mes projets</h1>
                        <p className="text-zinc-500">Gérez vos projets en cours et terminés</p>
                    </div>
                </motion.div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "En construction", value: stats.building, color: "purple", icon: Clock },
                    { label: "En révision", value: stats.review, color: "yellow", icon: Eye },
                    { label: "Terminés", value: stats.completed, color: "emerald", icon: CheckCircle },
                    { label: "Commissions", value: `${(stats.totalCommission / 1000).toFixed(0)}K F`, color: "blue", icon: CheckCircle },
                ].map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-4 rounded-xl border ${stat.color === "purple" ? "bg-purple-500/5 border-purple-500/20" :
                                stat.color === "yellow" ? "bg-yellow-500/5 border-yellow-500/20" :
                                    stat.color === "emerald" ? "bg-emerald-500/5 border-emerald-500/20" :
                                        "bg-blue-500/5 border-blue-500/20"
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                                <p className="text-xs text-zinc-500">{stat.label}</p>
                            </div>
                            <stat.icon className={`size-8 ${stat.color === "purple" ? "text-purple-400/30" :
                                    stat.color === "yellow" ? "text-yellow-400/30" :
                                        stat.color === "emerald" ? "text-emerald-400/30" :
                                            "text-blue-400/30"
                                }`} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Filters & Search */}
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
                        placeholder="Rechercher un projet..."
                        className="w-full h-11 pl-11 pr-4 rounded-xl bg-white/5 border border-white/5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500/30"
                    />
                </div>
                <div className="flex gap-1 p-1 rounded-lg bg-white/5">
                    {(["all", "building", "review", "completed"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-md text-xs font-medium transition-all ${filter === f ? "bg-purple-600 text-white" : "text-zinc-500 hover:text-white"
                                }`}
                        >
                            {f === "all" ? "Tous" :
                                f === "building" ? "En cours" :
                                    f === "review" ? "Révision" : "Terminés"}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredProjects.map((project, idx) => {
                    const status = statusConfig[project.status];
                    const StatusIcon = status.icon;

                    return (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            className={`rounded-2xl border bg-white/[0.02] overflow-hidden ${status.border}`}
                        >
                            {/* Header */}
                            <div className="p-5 border-b border-white/5">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1">{project.name}</h3>
                                        <p className="text-sm text-zinc-500">{project.client} • {project.type}</p>
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${status.bg}`}>
                                        <StatusIcon className={`size-3 ${status.color}`} />
                                        <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
                                    </div>
                                </div>

                                {/* Progress */}
                                {project.status === "building" && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-zinc-500">{project.estimatedEnd}</span>
                                            <span className="text-purple-400 font-medium">{project.progress}%</span>
                                        </div>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${project.progress}%` }}
                                                transition={{ duration: 1, delay: 0.3 }}
                                                className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                                            />
                                        </div>
                                    </div>
                                )}

                                {project.status === "review" && (
                                    <p className="text-xs text-yellow-400/70">En attente de la validation du client</p>
                                )}

                                {project.status === "completed" && (
                                    <p className="text-xs text-emerald-400/70">{project.estimatedEnd}</p>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-4 bg-white/[0.01] flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-zinc-500">Commission</p>
                                    <p className="text-lg font-bold text-white">{project.commission.toLocaleString()} F</p>
                                </div>
                                <div className="flex gap-2">
                                    {project.status === "building" && (
                                        <>
                                            <Button variant="outline" size="sm">
                                                <Pause className="size-3 mr-1" />
                                                Pause
                                            </Button>
                                            <Button size="sm">
                                                <Eye className="size-3 mr-1" />
                                                Continuer
                                            </Button>
                                        </>
                                    )}
                                    {project.status === "review" && (
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={project.previewUrl} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="size-3 mr-1" />
                                                Voir le site
                                            </a>
                                        </Button>
                                    )}
                                    {project.status === "completed" && (
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={project.previewUrl} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="size-3 mr-1" />
                                                Voir le site
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
