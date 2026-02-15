"use client";

import { Bell, Search, Command, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function CoderHeader() {
    return (
        <header className="h-16 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-30">
            <div className="h-full px-6 flex items-center justify-between">
                {/* Search */}
                <div className="flex-1 max-w-xl">
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="relative group"
                    >
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Rechercher un projet..."
                            className="w-full h-11 pl-11 pr-20 rounded-xl bg-white/5 border border-white/5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500/30 focus:bg-white/[0.07] transition-all"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
                            <Command className="size-3 text-zinc-500" />
                            <span className="text-[10px] text-zinc-500 font-medium">K</span>
                        </div>
                    </motion.div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-3 ml-6">
                    {/* Status */}
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <Zap className="size-4 text-purple-400" />
                        <span className="text-xs font-medium text-purple-400">Prêt à coder</span>
                    </div>

                    {/* Notifications */}
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="size-5" />
                        <span className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-purple-500 text-[10px] font-bold text-white flex items-center justify-center">
                            2
                        </span>
                    </Button>

                    {/* CTA */}
                    <Button size="sm" className="hidden md:flex">
                        <Zap className="size-4 mr-2" />
                        Nouveau projet
                    </Button>
                </div>
            </div>
        </header>
    );
}
