"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BarChart3,
    CreditCard,
    Globe,
    LayoutDashboard,
    LinkIcon,
    Settings,
    ShieldCheck,
    Terminal,
    Users,
    Users2,
    Zap,
    Search,
    ChevronRight,
    ChevronLeft,
    Command,
    Palette
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AppSwitcher } from "./app-switcher";
import { Separator } from "@/components/ui/separator";

const navigation = [
    {
        section: "Activité", items: [
            { name: "Vue d'ensemble", href: "/dashboard", icon: LayoutDashboard },
            { name: "Analytiques", href: "/analytics", icon: BarChart3 },
        ]
    },
    {
        section: "Gestion des Flux", items: [
            { name: "Passerelles", href: "/gateways", icon: Globe },
            { name: "Transactions", href: "/transactions", icon: CreditCard },
            { name: "Apparence Checkout", href: "/transactions/checkout-appearance", icon: Palette },
            { name: "Relances Automatiques", href: "/transactions/follow-ups", icon: Zap },
            { name: "Liens de Paiement", href: "/payment-links", icon: LinkIcon },
        ]
    },
    {
        section: "Relation Client", items: [
            { name: "Répertoire Clients", href: "/customers", icon: Users },
            { name: "Gestion d'Équipe", href: "/team", icon: Users2 },
        ]
    },
    {
        section: "Outils & Sécurité", items: [
            { name: "Centre de Sécurité", href: "/security", icon: ShieldCheck },
            { name: "API & Log", href: "/developer", icon: Terminal },
            { name: "Paramètres Globaux", href: "/settings", icon: Settings },
        ]
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside className="hidden md:flex flex-col h-screen p-4 sticky top-0 z-50">
            <motion.div
                initial={false}
                animate={{ width: isCollapsed ? "80px" : "280px" }}
                className="h-full bg-[#141414] rounded-3xl border border-white/10 flex flex-col relative shadow-2xl overflow-hidden"
            >
                {/* Header / Brand */}
                <div className="h-20 flex items-center px-6 gap-4 z-10 relative">
                    <div className="relative group cursor-pointer shrink-0">
                        <div className="absolute inset-0 bg-[#87a9ff]/40 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A0A0A] border border-white/10 text-[#87a9ff] shadow-2xl ring-1 ring-white/5 group-hover:scale-105 transition-transform duration-300">
                            <Zap className="h-5 w-5 fill-current" />
                        </div>
                    </div>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col"
                        >
                            <span className="text-base font-bold tracking-tight text-white mb-0.5">AfriFlow</span>
                            <div className="flex items-center gap-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-medium text-zinc-500 uppercase tracking-widest leading-none">Console</span>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Navigation Sections */}
                <nav className="flex-1 overflow-y-auto px-3 space-y-6 pb-8 no-scrollbar z-10 relative">
                    {navigation.map((section) => (
                        <div key={section.section} className="space-y-1.5">
                            {!isCollapsed && (
                                <h3 className="px-4 text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-3">
                                    {section.section}
                                </h3>
                            )}
                            <div className="space-y-0.5">
                                {section.items.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all relative overflow-hidden outline-none",
                                                isActive
                                                    ? "text-white bg-primary/10 border border-primary/20"
                                                    : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5 border border-transparent"
                                            )}
                                        >
                                            <item.icon className={cn(
                                                "h-4 w-4 shrink-0 transition-all duration-300 relative z-10",
                                                isActive
                                                    ? "text-[#87a9ff] drop-shadow-[0_0_8px_rgba(135,169,255,0.5)]"
                                                    : "text-zinc-600 group-hover:text-zinc-300"
                                            )} />

                                            {!isCollapsed && <span className="relative z-10">{item.name}</span>}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Floating Glass Profile Section */}
                <div className="p-3 bg-black/20 z-10 relative">
                    <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/10 transition-all cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                                {session?.user?.image ? (
                                    <img
                                        src={session.user.image}
                                        alt={session.user.name || "User"}
                                        className="h-full w-full object-cover rounded-xl"
                                    />
                                ) : (
                                    <span data-slot="avatar-fallback" className="flex size-full items-center justify-center rounded-full bg-secondary text-muted-foreground text-[10px] font-bold uppercase">
                                        {session?.user?.name?.[0] || session?.user?.email?.[0] || "Y"}
                                    </span>
                                )}
                                <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-[#141414]" />
                            </div>
                            {!isCollapsed && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-[12px] font-bold text-zinc-200 truncate group-hover:text-white transition-colors">
                                        {session?.user?.name || "Utilisateur"}
                                    </p>
                                    <p className="text-[9px] text-zinc-600 truncate font-medium">
                                        Compte Enterprise
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Collapse Toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-10 h-6 w-6 rounded-full bg-[#141414] border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:border-primary transition-all shadow-xl z-[60]"
                >
                    {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" size={12} />}
                </button>
            </motion.div>
        </aside>
    );
}
