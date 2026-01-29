"use client";

import React from "react";
import {
    LayoutDashboard,
    MessageSquare,
    Zap,
    Users,
    ShoppingBag,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Search,
    Bell,
    Share2,
    Database,
    ShieldCheck,
    Briefcase
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const navItems = [
    { icon: LayoutDashboard, label: "Vue d'ensemble", path: "/" },
    { icon: Briefcase, label: "Projet", path: "/projet" },
    { icon: MessageSquare, label: "Campagnes", path: "/campaigns" },
    { icon: ShoppingBag, label: "Produits", path: "/products" },
    { icon: Zap, label: "Automatisations", path: "/automations" },
    { icon: Database, label: "Connecteurs", path: "/connectors" },
    { icon: Users, label: "Audiences", path: "/audiences" },
    { icon: ShieldCheck, label: "Sécurité", path: "/security" },
    { icon: Settings, label: "Réglages", path: "/settings" },
];

export function DashboardSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    // Auto-collapse sidebar on workflow builder page for more canvas space
    const isWorkflowBuilder = pathname?.startsWith('/automations/new');
    const [isCollapsed, setIsCollapsed] = React.useState(isWorkflowBuilder);

    // Update collapse state when navigating to/from workflow builder
    React.useEffect(() => {
        if (isWorkflowBuilder) {
            setIsCollapsed(true);
        }
    }, [isWorkflowBuilder]);

    const handleLogout = () => {
        signOut({ callbackUrl: 'http://localhost:3012/auth/login' });
    };

    return (
        <aside className="hidden md:flex flex-col h-screen p-4 sticky top-0 z-50">
            <motion.div
                initial={false}
                animate={{ width: isCollapsed ? "72px" : "260px" }}
                className="h-full bg-card rounded-3xl border border-border flex flex-col relative shadow-sm"
            >
                {/* Logo Section */}
                <div className="p-4 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-xl shadow-primary/5 transition-all group-hover:scale-105">
                        <Share2 className="h-4 w-4 text-primary fill-none stroke-[2.5]" />
                    </div>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col"
                        >
                            <span className="text-white font-black tracking-tighter text-lg uppercase italic leading-none">CONNECT</span>
                            <span className="text-[7px] text-muted-foreground font-bold tracking-[0.2em] uppercase opacity-40">AUTOMATION v2.4</span>
                        </motion.div>
                    )}
                </div>

                {/* Navigation Section */}
                <div className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
                    {!isCollapsed && (
                        <div className="px-3 mb-4">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-30">Menu Principal</span>
                        </div>
                    )}

                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link key={item.path} href={item.path}>
                                <motion.div
                                    whileHover={{ x: isCollapsed ? 0 : 4 }}
                                    className={`flex items-center gap-2.5 p-2.5 rounded-xl transition-all group relative overflow-hidden ${isActive
                                        ? "bg-primary text-primary-foreground border-transparent"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent"
                                        }`}
                                >
                                    <item.icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-primary" : "group-hover:text-primary transition-colors"}`} />
                                    {!isCollapsed && (
                                        <span className="text-sm font-bold tracking-tight">{item.label}</span>
                                    )}
                                </motion.div>
                            </Link>
                        )
                    })}
                </div>

                {/* Bottom Actions */}
                <div className="p-3 border-t border-white/5 bg-black/20 rounded-b-3xl">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5 cursor-pointer group"
                    >
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-zinc-700 to-zinc-800 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-primary/50 transition-colors shadow-lg">
                            <Users className="h-4 w-4 text-white" />
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0 pr-2">
                                <p className="text-[10px] font-black text-white truncate uppercase tracking-tighter">
                                    {session?.user?.name || "Entrepreneur"}
                                </p>
                                <p className="text-[8px] text-muted-foreground font-medium truncate opacity-50 italic uppercase">
                                    {session?.user?.email || "Enterprise"}
                                </p>
                            </div>
                        )}
                    </motion.div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl text-red-500/60 hover:text-red-500 hover:bg-red-500/5 mt-2 transition-all group"
                    >
                        <LogOut className="h-4 w-4 shrink-0 group-hover:rotate-12 transition-transform" />
                        {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-widest">Sortir</span>}
                    </button>
                </div>

                {/* Collapse Toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-10 h-7 w-7 rounded-full bg-[#171717] border border-white/10 flex items-center justify-center text-white hover:border-primary transition-colors shadow-2xl z-[60]"
                >
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </button>
            </motion.div>
        </aside>
    );
}
