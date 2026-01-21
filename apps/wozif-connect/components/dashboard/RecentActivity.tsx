"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, UserPlus, Zap, ArrowUpRight } from "lucide-react";

const activities = [
    {
        id: 1,
        type: "message",
        user: "Sarah Koné",
        target: "Campagne Promo Janvier",
        time: "Il y a 2 min",
        icon: MessageSquare,
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        id: 2,
        type: "connection",
        user: "Nouveau Client",
        target: "Instance WA #04",
        time: "Il y a 15 min",
        icon: UserPlus,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10"
    },
    {
        id: 3,
        type: "automation",
        user: "Wozif AI",
        target: "Réponse automatique générée",
        time: "Il y a 1h",
        icon: Zap,
        color: "text-amber-500",
        bg: "bg-amber-500/10"
    },
    {
        id: 4,
        type: "message",
        user: "Mamadou Sylla",
        target: "Relance Facture #102",
        time: "Il y a 3h",
        icon: MessageSquare,
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    }
];

export function RecentActivity() {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-3xl bg-[#0A0A0A] border border-white/5 shadow-xl relative overflow-hidden h-full"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-40 mb-1">Journal en temps réel</h3>
                    <h2 className="text-lg font-black text-white italic tracking-tighter uppercase leading-tight">Activités récentes</h2>
                </div>
                <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-white transition-colors">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
            </div>

            <div className="space-y-3">
                {activities.map((activity, idx) => (
                    <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group cursor-pointer"
                    >
                        <div className={`h-9 w-9 rounded-lg ${activity.bg} flex items-center justify-center shrink-0`}>
                            <activity.icon className={`h-4 w-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1 min-w-0 pr-2">
                            <h4 className="text-[12px] font-black text-white uppercase tracking-tight truncate">{activity.user}</h4>
                            <p className="text-[9px] text-muted-foreground font-medium truncate opacity-60 tracking-wide uppercase">{activity.target}</p>
                        </div>
                        <div className="text-[9px] font-bold text-muted-foreground opacity-30 whitespace-nowrap uppercase tracking-widest">{activity.time}</div>
                    </motion.div>
                ))}
            </div>

            <button className="w-full mt-5 py-3 rounded-xl border border-dashed border-white/10 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-white hover:border-white/20 transition-all">
                Voir tout l'historique
            </button>
        </motion.div>
    );
}
