"use client";

import React from "react";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/Header";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NewProjectPage() {
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [isCreating, setIsCreating] = React.useState(false);
    const router = useRouter();

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;

        setIsCreating(true);
        try {
            const id = `proj_${Math.random().toString(36).substr(2, 9)}`;

            // Default nodes for a new project
            const defaultNodes = [
                {
                    id: 1,
                    type: "whatsapp_message",
                    name: "Trigger WhatsApp",
                    config: "{}",
                    x: 100,
                    y: 100,
                    connectedTo: 2
                },
                {
                    id: 2,
                    type: "gpt_respond",
                    name: "Réponse IA",
                    config: JSON.stringify({
                        system: description || "Tu es un assistant utile.",
                        model: "gpt-4o-mini",
                        tokens: 200,
                        creativity: 0.7
                    }),
                    x: 400,
                    y: 100
                }
            ];

            const response = await fetch("/api/automations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id,
                    name,
                    description,
                    nodes: defaultNodes,
                    aiInstructions: description,
                    isActive: true,
                    status: "ACTIVE"
                }),
            });

            const data = await response.json();
            if (data.success) {
                router.push(`/projet/${data.automation.id}`);
            } else {
                alert("Erreur lors de la création du projet: " + data.error);
            }
        } catch (error) {
            console.error("Error creating project:", error);
            alert("Erreur lors de la création du projet.");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-background text-foreground selection:bg-primary selection:text-black">
            <DashboardSidebar />

            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <DashboardHeader />

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mx-auto min-h-full max-w-lg px-4 pb-8 pt-24"
                    >
                        <h1 className="font-season text-[var(--sim-text-primary)] mb-4 text-3xl font-medium">
                            <div className="flex">Créer un projet personnel</div>
                        </h1>

                        <form className="grid grid-cols-1 gap-4 mt-8" onSubmit={handleCreateProject}>
                            <div className="space-y-1">
                                <label htmlFor="name" className="text-[var(--sim-text-primary)] mb-1 block font-medium">
                                    Sur quoi travaillez-vous ?
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nommez votre projet"
                                    className="bg-[var(--sim-surface-1)] border border-[var(--sim-border)] hover:border-[var(--sim-text-muted)] transition-colors placeholder:text-zinc-500 focus:outline-none focus:border-[var(--sim-brand)] h-11 px-3 rounded-[0.6rem] w-full text-[var(--sim-text-primary)]"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="description" className="text-[var(--sim-text-primary)] mb-1 block font-medium">
                                    Qu’essayez-vous de faire ?
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Décrivez votre projet, vos objectifs, le sujet, etc..."
                                    className="bg-[var(--sim-surface-1)] border border-[var(--sim-border)] p-3 rounded-[0.6rem] transition-colors hover:border-[var(--sim-text-muted)] placeholder:text-zinc-500 focus:outline-none focus:border-[var(--sim-brand)] w-full text-[var(--sim-text-primary)] resize-none"
                                />
                            </div>

                            <div className="mt-2 flex justify-end gap-2">
                                <Link href="/projet">
                                    <Button
                                        variant="ghost"
                                        className="h-9 px-4 rounded-lg bg-transparent border-none font-bold text-[var(--sim-text-secondary)] hover:bg-[var(--sim-surface-2)] min-w-[5rem]"
                                    >
                                        Annuler
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={!name || isCreating}
                                    className="h-9 px-4 rounded-lg bg-[var(--sim-brand)] hover:opacity-90 text-white font-bold min-w-[5rem] transition-transform active:scale-[0.985]"
                                >
                                    {isCreating ? "Création..." : "Créer un projet"}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
