"use client";

import React from "react";
import {
    Search,
    Bell,
    Calendar,
    ChevronDown,
    Plus,
    LayoutGrid,
    Sparkles,
    Command
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
    return (
        <header className="h-16 border-b border-border bg-background px-8 flex items-center justify-between sticky top-0 z-40">
            {/* Breadcrumbs & Title */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-30">Connect</span>
                    <div className="h-4 w-px bg-border" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">Console</span>
                </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-5">
                {/* Search - Minimal Icon */}
                <button className="h-9 w-9 rounded-xl border border-border bg-muted/50 flex items-center justify-center hover:bg-muted transition-all text-muted-foreground hover:text-foreground">
                    <Search className="h-4 w-4" />
                </button>

                {/* Notification Bell */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative cursor-pointer group h-9 w-9 rounded-xl border border-border bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
                >
                    <Bell className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 bg-primary rounded-full shadow-none" />
                </motion.div>

                <div className="h-8 w-px bg-border mx-1" />

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                        className="h-9 px-4 rounded-xl bg-primary text-primary-foreground font-bold uppercase text-[9px] tracking-widest shadow-none flex items-center gap-2"
                    >
                        <Plus className="h-3.5 w-3.5" /> Nouveau
                    </Button>
                </motion.div>
            </div>
        </header>
    );
}
