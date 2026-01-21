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
        <header className="h-16 border-b border-white/5 bg-background/60 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-40">
            {/* Breadcrumbs & Title */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-30">Connect</span>
                    <div className="h-4 w-px bg-white/10" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Console</span>
                </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-5">
                {/* Search - Minimal Icon */}
                <button className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-muted-foreground hover:text-white">
                    <Search className="h-4 w-4" />
                </button>

                {/* Notification Bell */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative cursor-pointer group h-9 w-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                    <Bell className="h-4 w-4 text-muted-foreground group-hover:text-white transition-colors" />
                    <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(37,211,102,1)]" />
                </motion.div>

                <div className="h-8 w-px bg-white/5 mx-1" />

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                        className="h-9 px-4 rounded-xl bg-white hover:bg-white/90 text-black font-black uppercase text-[9px] tracking-widest shadow-xl flex items-center gap-2"
                    >
                        <Plus className="h-3.5 w-3.5" /> Nouveau
                    </Button>
                </motion.div>
            </div>
        </header>
    );
}
