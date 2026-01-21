"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
    Search, Clock, User, Mail, Phone, Sparkles,
    Play, Loader2, Inbox, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Project {
    id: string;
    reference: string;
    name: string;
    description: string;
    type: string;
    priority: string;
    requirements: string[];
    colors: { primary: string; secondary: string };
    client: {
        name: string;
        email: string;
        phone?: string;
    };
    price: number;
    commission: number;
    estimatedTime: string;
    startedAt: Date;
    completedAt: Date;
    status: string;
    previewUrl?: string;
    deployUrl?: string;
}

const priorityStyles: Record<string, { bg: string; text: string; label: string; border: string }> = {
    normal: { bg: "bg-zinc-500/10", text: "text-zinc-400", label: "Normal", border: "border-zinc-500/20" },
    high: { bg: "bg-orange-500/10", text: "text-orange-400", label: "Priorité haute", border: "border-orange-500/20" },
    urgent: { bg: "bg-red-500/10", text: "text-red-400", label: "Urgent", border: "border-red-500/20" },
};

const typeIcons: Record<string, string> = {
    ecommerce: "🛒",
    portfolio: "🎨",
    restaurant: "🍽️",
    blog: "📝",
    landing: "🚀",
    custom: "⚡",
};


function formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const searchParams = useSearchParams();
    const initialFilter = (searchParams.get('filter') as "all" | "building" | "review" | "completed") || "all";
    const [filter, setFilter] = useState<"all" | "building" | "review" | "completed">(initialFilter);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [submitData, setSubmitData] = useState({
        previewUrl: "",
        deployUrl: ""
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    async function handleSubmitForReview() {
        if (!selectedProject) return;

        try {
            setIsSubmitting(true);
            const res = await fetch(`/api/coder/projects/${selectedProject.id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'REVIEW',
                    previewUrl: submitData.previewUrl,
                    deployUrl: submitData.deployUrl
                }),
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Projet soumis pour révision !");
                setShowSubmitModal(false);
                fetchProjects(); // Refresh list
            } else {
                toast.error(data.error || "Erreur lors de la soumission");
            }
        } catch (error) {
            console.error('Error submitting project:', error);
            toast.error("Une erreur est survenue");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function fetchProjects() {
        try {
            setLoading(true);
            const coderId = localStorage.getItem('gnata-coder-id');

            if (!coderId) {
                setLoading(false);
                return;
            }

            const res = await fetch(`/api/coder/projects?coderId=${coderId}`);
            const data = await res.json();
            if (data.success) {
                // Show projects that are actively assigned or completed
                const activeProjects = data.projects.filter(
                    (p: Project) => p.status === 'BUILDING' || p.status === 'REVIEW' || p.status === 'COMPLETED'
                );
                setProjects(activeProjects);
                if (activeProjects.length > 0) {
                    setSelectedProject(activeProjects[0]);
                }
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    }

    const filteredProjects = projects.filter((project) => {
        const matchesFilter = filter === "all" || project.status.toLowerCase() === filter;
        const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.client.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <Loader2 className="size-8 animate-spin text-purple-500" />
            </div>
        );
    }

    // No projects assigned
    if (projects.length === 0) {
        return (
            <div className="h-[calc(100vh-80px)] flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-md mx-auto p-8"
                >
                    <div className="size-20 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-6">
                        <Inbox className="size-10 text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">
                        Aucun projet assigné
                    </h2>
                    <p className="text-zinc-500 mb-6">
                        L&apos;administrateur vous attribuera de nouveaux projets clients.
                        Vous serez notifié dès qu&apos;un projet vous sera assigné.
                    </p>
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-left">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="size-5 text-blue-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-blue-400 font-medium mb-1">Comment ça fonctionne</p>
                                <p className="text-xs text-zinc-400">
                                    1. Les clients commandent des sites sur Gnata<br />
                                    2. L&apos;admin reçoit les commandes et vous les attribue<br />
                                    3. Vous recevez le projet ici et commencez à construire
                                </p>
                            </div>
                        </div>
                    </div>
                    <Button className="mt-6" asChild>
                        <Link href="/coder">
                            Retour au dashboard
                        </Link>
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-80px)] flex">
            {/* Project List */}
            <div className="w-[400px] border-r border-white/5 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-white/5">
                    <h2 className="text-lg font-bold text-white mb-1">Projets assignés</h2>
                    <p className="text-xs text-zinc-500">Projets que l&apos;admin vous a attribués</p>
                </div>

                {/* Search & Filter */}
                <div className="p-4 border-b border-white/5 space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500/50"
                        />
                    </div>
                    <div className="flex gap-2">
                        {(["all", "building", "review", "completed"] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f
                                    ? "bg-purple-600 text-white"
                                    : "bg-white/5 text-zinc-400 hover:bg-white/10"
                                    }`}
                            >
                                {f === "all" ? "Tous" : f === "building" ? "En cours" : f === "review" ? "Révision" : "Terminés"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Project List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredProjects.map((project) => {
                        const priority = priorityStyles[project.priority] || priorityStyles.normal;
                        const isSelected = selectedProject?.id === project.id;
                        return (
                            <motion.button
                                key={project.id}
                                onClick={() => setSelectedProject(project)}
                                className={`w-full p-4 text-left border-b border-white/5 transition-colors ${isSelected ? "bg-purple-600/10 border-l-2 border-l-purple-500" : "hover:bg-white/[0.02]"
                                    }`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{typeIcons[project.type] || "📁"}</span>
                                        <h4 className="text-sm font-medium text-white">{project.name}</h4>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${priority.bg} ${priority.text}`}>
                                        {priority.label}
                                    </span>
                                </div>
                                <p className="text-xs text-zinc-500 mb-2 line-clamp-1">{project.description}</p>
                                <div className="flex items-center justify-between text-xs text-zinc-600">
                                    <span>{project.client.name}</span>
                                    <span className={`px-2 py-0.5 rounded ${project.status === 'BUILDING'
                                        ? 'bg-purple-500/10 text-purple-400'
                                        : project.status === 'REVIEW'
                                            ? 'bg-orange-500/10 text-orange-400'
                                            : 'bg-emerald-500/10 text-emerald-400'
                                        }`}>
                                        {project.status === 'BUILDING' ? 'En cours' : project.status === 'REVIEW' ? 'Révision' : 'Terminé'}
                                    </span>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Project Details */}
            <div className="flex-1 p-8 overflow-y-auto">
                {selectedProject ? (
                    <motion.div
                        key={selectedProject.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-2xl mx-auto space-y-6"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-3xl">{typeIcons[selectedProject.type] || "📁"}</span>
                                    <div>
                                        <h1 className="text-2xl font-bold text-white">{selectedProject.name}</h1>
                                        <p className="text-sm text-zinc-500">{selectedProject.reference}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${selectedProject.status === 'BUILDING'
                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                : selectedProject.status === 'REVIEW'
                                    ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                }`}>
                                {selectedProject.status === 'BUILDING' ? 'En construction' : selectedProject.status === 'REVIEW' ? 'En révision' : 'Terminé'}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                            <h3 className="text-sm font-medium text-white mb-2">Description</h3>
                            <p className="text-sm text-zinc-400">{selectedProject.description}</p>
                        </div>

                        {/* Client Info */}
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                            <h3 className="text-sm font-medium text-white mb-3">Informations client</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 text-sm">
                                    <User className="size-4 text-zinc-500" />
                                    <span className="text-zinc-400">{selectedProject.client.name}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="size-4 text-zinc-500" />
                                    <span className="text-zinc-400">{selectedProject.client.email}</span>
                                </div>
                                {selectedProject.client.phone && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone className="size-4 text-zinc-500" />
                                        <span className="text-zinc-400">{selectedProject.client.phone}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Requirements */}
                        {selectedProject.requirements && selectedProject.requirements.length > 0 && (
                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                <h3 className="text-sm font-medium text-white mb-3">Fonctionnalités demandées</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedProject.requirements.map((req, idx) => (
                                        <span key={idx} className="px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 text-xs">
                                            {req}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Pricing & Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                                <Clock className="size-6 text-blue-400 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-white">{selectedProject.estimatedTime}</p>
                                <p className="text-xs text-zinc-500">Temps estimé</p>
                            </div>
                            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center">
                                <Sparkles className="size-6 text-emerald-400 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-emerald-400">{formatNumber(selectedProject.commission)} F</p>
                                <p className="text-xs text-zinc-500">Votre commission</p>
                            </div>
                        </div>

                        {/* CLI Instructions */}
                        <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                            <h3 className="text-sm font-medium text-purple-400 mb-3 flex items-center gap-2">
                                <Play className="size-4" />
                                Commandes CLI
                            </h3>
                            <div className="space-y-2 font-mono text-xs text-zinc-400">
                                <div className="p-2 rounded bg-black/30">
                                    <span className="text-zinc-500">$</span>{" "}
                                    <span className="text-purple-300">gnata init {selectedProject.reference}</span>
                                </div>
                                <div className="p-2 rounded bg-black/30">
                                    <span className="text-zinc-500">$</span>{" "}
                                    <span className="text-purple-300">gnata dev</span>
                                </div>
                                <div className="p-2 rounded bg-black/30">
                                    <span className="text-zinc-500">$</span>{" "}
                                    <span className="text-purple-300">gnata deploy</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        {selectedProject.status === 'BUILDING' && (
                            <div className="pt-4">
                                <Button
                                    className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20"
                                    onClick={() => {
                                        setSubmitData({
                                            previewUrl: selectedProject.previewUrl || "",
                                            deployUrl: selectedProject.deployUrl || ""
                                        });
                                        setShowSubmitModal(true);
                                    }}
                                >
                                    Soumettre pour révision
                                </Button>
                                <p className="text-[10px] text-zinc-500 text-center mt-3">
                                    En soumettant, vous confirmez que le projet est prêt à être testé par l&apos;admin et le client.
                                </p>
                            </div>
                        )}

                        {selectedProject.status === 'REVIEW' && (
                            <div className="pt-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                                <div className="flex items-center gap-3 text-orange-400 mb-2">
                                    <Clock className="size-4" />
                                    <span className="text-sm font-medium">En cours de révision</span>
                                </div>
                                <p className="text-xs text-zinc-400">
                                    Le projet est en cours d&apos;examen par l&apos;administrateur.
                                    Vous serez notifié si des modifications sont demandées ou si le projet est validé.
                                </p>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <div className="h-full flex items-center justify-center text-zinc-500">
                        Sélectionnez un projet pour voir les détails
                    </div>
                )}
            </div>

            {/* Submission Modal */}
            <Dialog open={showSubmitModal} onOpenChange={setShowSubmitModal}>
                <DialogContent className="bg-zinc-950 border-white/10 text-white max-w-md">
                    <DialogHeader>
                        <DialogTitle>Soumettre le projet</DialogTitle>
                        <DialogDescription className="text-zinc-500">
                            Veuillez fournir les URLs de votre travail pour la révision.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="previewUrl">URL de Preview</Label>
                            <Input
                                id="previewUrl"
                                placeholder="https://preview.gnata.io/..."
                                value={submitData.previewUrl}
                                onChange={(e) => setSubmitData({ ...submitData, previewUrl: e.target.value })}
                                className="bg-white/5 border-white/10 text-white"
                            />
                            <p className="text-[10px] text-zinc-500">L&apos;URL temporaire de développement.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deployUrl">URL de Déploiement (Optionnel)</Label>
                            <Input
                                id="deployUrl"
                                placeholder="https://project.gnata.io"
                                value={submitData.deployUrl}
                                onChange={(e) => setSubmitData({ ...submitData, deployUrl: e.target.value })}
                                className="bg-white/5 border-white/10 text-white"
                            />
                            <p className="text-[10px] text-zinc-500">L&apos;URL finale de production si déjà déployé.</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowSubmitModal(false)}
                            className="bg-transparent border-white/10 hover:bg-white/5 text-white"
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleSubmitForReview}
                            disabled={isSubmitting || !submitData.previewUrl}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Soumission...
                                </>
                            ) : (
                                "Confirmer la soumission"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
