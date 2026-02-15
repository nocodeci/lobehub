"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Calendar, Plus } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function DashboardHeader() {
    const { data: session } = useSession();
    const [greeting, setGreeting] = useState("Bonjour");
    const [date, setDate] = useState<string>("");

    useEffect(() => {
        const now = new Date();
        const hour = now.getHours();
        if (hour >= 18) setGreeting("Bonsoir");
        else if (hour >= 12) setGreeting("Bonne après-midi");
        else setGreeting("Bonjour");

        setDate(now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }));
    }, []);

    const userFirstName = session?.user?.name?.split(" ")[0] || "Chef";

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-1"
            >
                <div className="flex items-center gap-2 text-[#87a9ff]/60 mb-2">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium uppercase tracking-widest">
                        {date || <span className="opacity-0">Chargement...</span>}
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                    {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#87a9ff] to-[#87a9ff]/60">{userFirstName}</span>.
                </h1>
                <p className="text-lg text-muted-foreground font-light max-w-md leading-relaxed">
                    Voici ce qui se passe sur votre espace <span className="font-medium text-[#87a9ff]">AfriFlow</span> aujourd'hui.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                className="flex items-center gap-3"
            >
                <Button variant="outline" size="sm" className="gap-2 h-10 px-4 rounded-xl">
                    <Download className="h-4 w-4" />
                    Exporter
                </Button>
                <Link href="/gateways/new">
                    <Button size="sm" className="gap-2 h-10 px-4 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                        <Plus className="h-4 w-4" />
                        Nouvelle passerelle
                    </Button>
                </Link>
            </motion.div>
        </div>
    );
}
