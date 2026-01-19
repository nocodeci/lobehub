"use client";

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

    return (
        <aside className="w-[280px] h-full flex flex-col bg-[#0a0a0a] border-r border-white/[0.06] relative overflow-hidden group/sidebar">
            {/* Soft subtle gradient for effortless depth - No noise, no blobs */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

            {/* Header / Brand */}
            <div className="h-24 flex items-center px-6 gap-4 z-10 relative">
                <div className="relative group cursor-pointer">
                    <div className="absolute inset-0 bg-primary/40 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0A0A0A] border border-white/10 text-primary shadow-2xl ring-1 ring-white/5 group-hover:scale-105 transition-transform duration-300">
                        <Zap className="h-5 w-5 fill-current" />
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-[17px] font-bold tracking-tight text-white mb-0.5">AfriFlow</span>
                    <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest leading-none">Console</span>
                    </div>
                </div>
            </div>

            {/* Premium App Context Switcher */}
            <div className="px-5 mb-8 z-10 relative">
                <AppSwitcher />
            </div>

            {/* Navigation Sections */}
            <nav className="flex-1 overflow-y-auto px-4 space-y-8 pb-8 no-scrollbar z-10 relative">
                {navigation.map((section) => (
                    <div key={section.section} className="space-y-2">
                        <h3 className="px-4 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-3">
                            {section.section}
                        </h3>
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
                                                ? "text-white"
                                                : "text-zinc-500 hover:text-zinc-200"
                                        )}
                                    >
                                        {/* Active Background Glow */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="active-nav-glow"
                                                className="absolute inset-0 bg-white/[0.03] border border-white/[0.05] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-xl"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            />
                                        )}

                                        <item.icon className={cn(
                                            "h-4 w-4 transition-all duration-300 relative z-10",
                                            isActive
                                                ? "text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]"
                                                : "text-zinc-600 group-hover:text-zinc-300"
                                        )} />

                                        <span className="relative z-10">{item.name}</span>

                                        {isActive && (
                                            <motion.div
                                                layoutId="active-indicator"
                                                className="absolute left-0 w-0.5 h-full bg-gradient-to-b from-transparent via-primary to-transparent opacity-80"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 0.8 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Floating Glass Profile Section */}
            <div className="p-4 z-10 relative">
                <div className="mx-2 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer group shadow-2xl shadow-black/50">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-zinc-800 to-black border border-white/10 flex items-center justify-center text-zinc-400 font-bold text-xs shadow-inner group-hover:text-white transition-colors">
                                {session?.user?.name?.[0] || "U"}
                            </div>
                            <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-[#050505]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-bold text-zinc-200 truncate group-hover:text-white transition-colors">
                                {session?.user?.name || "Utilisateur"}
                            </p>
                            <p className="text-[10px] text-zinc-600 truncate font-medium">
                                {session?.user?.email}
                            </p>
                        </div>
                        <Settings className="h-4 w-4 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                    </div>
                </div>
            </div>
        </aside>
    );
}
