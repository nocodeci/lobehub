"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
    Inbox, Clock, CheckCircle, TrendingUp, Zap, Star,
    ArrowUpRight, Eye, Loader2, Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Format number without locale dependency
function formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) return `Il y a ${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Il y a ${diffDays}j`;
}

interface Project {
    id: string;
    reference: string;
    name: string;
    description: string;
    type: string;
    priority: string;
    client: {
        name: string;
        email: string;
        phone?: string;
    };
    price: number;
    commission: number;
    estimatedTime: string;
    startedAt: Date;
    status: string;
}

const priorityStyles: Record<string, { bg: string; text: string; label: string }> = {
    normal: { bg: "bg-zinc-500/10", text: "text-zinc-400", label: "Normal" },
    high: { bg: "bg-orange-500/10", text: "text-orange-400", label: "Priorité" },
    urgent: { bg: "bg-red-500/10", text: "text-red-400", label: "Urgent" },
};

export default function CoderDashboardPage() {
    const [myProjects, setMyProjects] = useState<Project[]>([]);
    const [stats, setStats] = useState({
        building: 0,
        review: 0,
        completed: 0,
        totalCommission: 0,
    });
    const [loading, setLoading] = useState(true);
    const [coderName, setCoderName] = useState("");

    useEffect(() => {
        const coderId = localStorage.getItem('gnata-coder-id');
        const name = localStorage.getItem('gnata-coder-name');
        if (name) setCoderName(name);

        if (!coderId) {
            setLoading(false);
            return;
        }

        async function fetchData() {
            try {
                // Fetch my assigned projects
                const res = await fetch(`/api/coder/projects?coderId=${coderId}`);
                const data = await res.json();

                if (data.success) {
                    setMyProjects(data.projects);
                    setStats(data.stats);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const activeProjects = myProjects.filter(p => p.status === 'BUILDING');
    const recentCompleted = myProjects.filter(p => p.status === 'COMPLETED').slice(0, 3);

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <Loader2 className="size-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Bonjour, {coderName || "Vibe Coder"} ! 👋
                    </h1>
                    <p className="text-zinc-500">
                        {stats.building > 0 ? (
                            <>Vous avez <span className="text-purple-400 font-medium">{stats.building} projet{stats.building > 1 ? 's' : ''}</span> en cours</>
                        ) : (
                            <>En attente de nouveaux projets assignés</>
                        )}
                    </p>
                </div>
                <Button size="lg" asChild>
                    <Link href="/coder/projects">
                        <Zap className="size-5 mr-2" />
                        Mes projets
                    </Link>
                </Button>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "En construction", value: String(stats.building), icon: Clock, color: "purple", change: "Projets actifs" },
                    { label: "En révision", value: String(stats.review), icon: Eye, color: "orange", change: "À valider" },
                    { label: "Terminés", value: String(stats.completed), icon: CheckCircle, color: "emerald", change: "Sites livrés" },
                    { label: "Gains totaux", value: `${formatNumber(stats.totalCommission)} F`, icon: TrendingUp, color: "blue", change: "Commission 30%" },
                ].map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                    >
                        <div className={`size-12 rounded-xl flex items-center justify-center mb-4 ${stat.color === "purple" ? "bg-purple-500/10 text-purple-400" :
                            stat.color === "orange" ? "bg-orange-500/10 text-orange-400" :
                                stat.color === "emerald" ? "bg-emerald-500/10 text-emerald-400" :
                                    "bg-blue-500/10 text-blue-400"
                            }`}>
                            <stat.icon className="size-6" />
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                        <p className="text-sm text-zinc-500 mb-2">{stat.label}</p>
                        <p className="text-xs text-zinc-600">{stat.change}</p>
                    </motion.div>
                ))}
            </div>

            {/* Active Projects */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Projects */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden"
                >
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                <Zap className="size-5 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Projets en cours</h3>
                                <p className="text-xs text-zinc-500">Sites en construction</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/coder/projects?filter=building">Voir tout</Link>
                        </Button>
                    </div>
                    <div className="divide-y divide-white/5">
                        {activeProjects.length === 0 ? (
                            <div className="p-8 text-center">
                                <Bell className="size-12 text-zinc-600 mx-auto mb-3" />
                                <p className="text-zinc-500 mb-2">Aucun projet en cours</p>
                                <p className="text-xs text-zinc-600">
                                    L&apos;admin vous attribuera de nouveaux projets
                                </p>
                            </div>
                        ) : (
                            activeProjects.slice(0, 3).map((project) => {
                                const priority = priorityStyles[project.priority] || priorityStyles.normal;
                                return (
                                    <div key={project.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-medium text-white">{project.name}</h4>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${priority.bg} ${priority.text}`}>
                                                    {priority.label}
                                                </span>
                                            </div>
                                            <Link href={`/coder/projects?filter=${project.status.toLowerCase()}`}>
                                                <Button size="sm" variant="outline">
                                                    <Eye className="size-3 mr-1" />
                                                    Continuer
                                                </Button>
                                            </Link>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-zinc-500">
                                            <span>{project.client.name}</span>
                                            <span>•</span>
                                            <span className="capitalize">{project.type}</span>
                                            <span>•</span>
                                            <span>{formatTimeAgo(project.startedAt)}</span>
                                            <span className="ml-auto text-emerald-400">{formatNumber(project.commission)} F</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </motion.div>

                {/* Recent Completed */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden"
                >
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <CheckCircle className="size-5 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Projets terminés</h3>
                                <p className="text-xs text-zinc-500">Derniers sites livrés</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/coder/projects?filter=completed">Voir tout</Link>
                        </Button>
                    </div>
                    <div className="divide-y divide-white/5">
                        {recentCompleted.length === 0 ? (
                            <div className="p-8 text-center">
                                <CheckCircle className="size-12 text-zinc-600 mx-auto mb-3" />
                                <p className="text-zinc-500">Aucun projet terminé</p>
                                <p className="text-xs text-zinc-600">
                                    Vos projets livrés apparaîtront ici
                                </p>
                            </div>
                        ) : (
                            recentCompleted.map((project) => (
                                <div key={project.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-medium text-white">{project.name}</h4>
                                        <span className="text-emerald-400 text-sm font-medium">
                                            +{formatNumber(project.commission)} F
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                                        <span>{project.client.name}</span>
                                        <span>•</span>
                                        <span className="capitalize">{project.type}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Performance */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                            <Star className="size-5 text-yellow-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Vos performances</h3>
                            <p className="text-xs text-zinc-500">Statistiques globales</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                        { label: "Sites livrés", value: String(stats.completed), unit: "" },
                        { label: "En cours", value: String(stats.building), unit: "" },
                        { label: "Note moyenne", value: "4.9", unit: "/5" },
                        { label: "Gains totaux", value: formatNumber(stats.totalCommission), unit: " F" },
                        { label: "Taux réussite", value: "100", unit: "%" },
                    ].map((metric) => (
                        <div key={metric.label} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                            <p className="text-2xl font-bold text-white">
                                {metric.value}<span className="text-sm text-zinc-500">{metric.unit}</span>
                            </p>
                            <p className="text-xs text-zinc-500 mt-1">{metric.label}</p>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
