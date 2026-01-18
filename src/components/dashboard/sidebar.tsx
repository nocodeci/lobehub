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
    Command
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AppSwitcher } from "./app-switcher";
import { Separator } from "@/components/ui/separator";

const navigation = [
    {
        section: "Activité", items: [
            { name: "Vue d'ensemble", href: "/", icon: LayoutDashboard },
            { name: "Analytiques", href: "/analytics", icon: BarChart3 },
        ]
    },
    {
        section: "Gestion des Flux", items: [
            { name: "Passerelles", href: "/gateways", icon: Globe },
            { name: "Transactions", href: "/transactions", icon: CreditCard },
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
        <aside className="w-[280px] h-full flex flex-col bg-background border-r border-border/60 select-none overflow-hidden">
            {/* Header / Brand */}
            <div className="h-20 flex items-center px-6 gap-3 group">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
                    <Zap className="h-5 w-5 fill-current" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[15px] font-bold tracking-tight text-foreground">AfriFlow</span>
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest leading-none mt-0.5">Console</span>
                </div>
            </div>

            {/* Premium App Context Switcher */}
            <div className="px-5 mb-8">
                <AppSwitcher />
            </div>

            <Separator className="mx-6 w-auto bg-border/40 opacity-50 mb-6" />

            {/* Navigation Sections */}
            <nav className="flex-1 overflow-y-auto px-4 space-y-7 pb-8 no-scrollbar">
                {navigation.map((section) => (
                    <div key={section.section} className="space-y-1">
                        <h3 className="px-4 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.12em] mb-2.5">
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
                                            "group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all relative overflow-hidden",
                                            isActive
                                                ? "text-foreground bg-secondary/80 shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-border/20"
                                                : "text-muted-foreground/80 hover:bg-secondary/40 hover:text-foreground"
                                        )}
                                    >
                                        <item.icon className={cn(
                                            "h-4 w-4 transition-colors",
                                            isActive ? "text-primary" : "text-muted-foreground/60 group-hover:text-foreground"
                                        )} />
                                        <span>{item.name}</span>

                                        {isActive && (
                                            <AnimatePresence>
                                                <motion.div
                                                    layoutId="soft-indicator"
                                                    className="absolute left-0 w-1 h-4 bg-primary rounded-full ml-1"
                                                    initial={{ height: 0 }}
                                                    animate={{ height: 16 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                />
                                            </AnimatePresence>
                                        )}

                                        <ChevronRight className={cn(
                                            "ml-auto h-3.5 w-3.5 opacity-0 -translate-x-2 transition-all group-hover:opacity-30 group-hover:translate-x-0",
                                            isActive && "opacity-0" // Hide for active to keep it clean
                                        )} />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Sophisticated Profile Section */}
            <div className="p-4 bg-secondary/10 border-t border-border/40 backdrop-blur-sm">
                <div className="flex items-center gap-3 p-2.5 rounded-[14px] hover:bg-secondary/50 transition-all cursor-pointer group/profile border border-transparent hover:border-border/40">
                    <div className="relative">
                        <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs ring-2 ring-transparent group-hover/profile:ring-primary/10 transition-all">
                            {session?.user?.name?.[0] || session?.user?.email?.[0]?.toUpperCase() || "A"}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-1.5">
                            <p className="text-[13px] font-bold text-foreground truncate">{session?.user?.name || "Membre"}</p>
                            <div className="h-1 w-1 rounded-full bg-muted-foreground/30 shrink-0" />
                            <Settings className="h-3 w-3 text-muted-foreground/30 group-hover/profile:rotate-45 transition-transform" />
                        </div>
                        <p className="text-[10px] text-muted-foreground/60 truncate tracking-wide leading-none">{session?.user?.email}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
