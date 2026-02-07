"use client";

import React from "react";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/Header";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProjetsPage() {
    const [automations, setAutomations] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchAutomations = async () => {
            try {
                const response = await fetch("/api/automations");
                const data = await response.json();
                if (data.success) {
                    setAutomations(data.automations);
                }
            } catch (error) {
                console.error("Error fetching automations:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAutomations();
    }, []);

    return (
        <div className="flex min-h-screen bg-background text-foreground selection:bg-primary selection:text-black">
            <DashboardSidebar />

            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <DashboardHeader />

                <div className="flex-1 overflow-y-auto custom-scrollbar md:p-8 p-4">
                    <div className="max-w-[1600px] mx-auto space-y-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-1"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-6 w-1 bg-primary rounded-full" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Gestion</span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
                                    Mes <span className="text-primary not-italic">Projets</span> 🚀
                                </h1>
                                <p className="text-muted-foreground font-medium text-xs md:text-sm uppercase tracking-widest opacity-60">
                                    Gérer et organiser vos initiatives
                                </p>
                            </motion.div>

                            <div className="flex items-center gap-3">
                                <Link href="/projet/new">
                                    <Button className="h-10 px-6 rounded-xl bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-white/90">
                                        <Plus className="h-4 w-4 mr-2" /> Nouveau Projet
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="h-48 rounded-3xl bg-white/[0.02] border border-white/5 animate-pulse" />
                                ))
                            ) : (
                                <>
                                    {automations.map((automation) => (
                                        <Link key={automation.id} href={`/projet/${automation.id}`} className="block">
                                            <motion.div
                                                whileHover={{ y: -5 }}
                                                className="p-6 rounded-3xl border border-white/5 bg-white/[0.02] flex flex-col justify-between space-y-4 group cursor-pointer h-full transition-colors hover:bg-white/[0.04]"
                                            >
                                                <div className="space-y-3">
                                                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                                        <Briefcase className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-black text-white uppercase italic tracking-tighter truncate">{automation.name}</h3>
                                                        <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">
                                                            {automation.description || "Aucune description"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${automation.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                        {automation.status}
                                                    </span>
                                                    <span className="text-[9px] text-muted-foreground uppercase">
                                                        {new Date(automation.updatedAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        </Link>
                                    ))}

                                    <Link href="/projet/new" className="block">
                                        <motion.div
                                            whileHover={{ y: -5 }}
                                            className="p-8 rounded-3xl border border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center text-center space-y-4 group cursor-pointer h-full"
                                        >
                                            <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                <Plus className="h-8 w-8 text-white/20 group-hover:text-primary transition-colors" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">Nouveau Projet</h3>
                                                <p className="text-xs text-muted-foreground uppercase tracking-widest opacity-60">Commencer une nouvelle aventure</p>
                                            </div>
                                        </motion.div>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
