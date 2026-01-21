"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Inbox,
    FolderKanban,
    Clock,
    CheckCircle,
    Settings,
    LogOut,
    Zap,
    User,
    Star,
    TrendingUp,
    Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const mainNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/coder" },
    { icon: Inbox, label: "Projets assignés", href: "/coder/projects", badge: true },
    { icon: Clock, label: "En cours", href: "/coder/projects?filter=building" },
    { icon: Eye, label: "En révision", href: "/coder/projects?filter=review" },
    { icon: CheckCircle, label: "Terminés", href: "/coder/projects?filter=completed" },
];

const bottomNavItems = [
    { icon: Settings, label: "Paramètres", href: "/coder/settings" },
];

interface CoderInfo {
    name: string;
    email: string;
    level?: string;
    totalProjects?: number;
    rating?: number;
}

export function CoderSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [coder, setCoder] = useState<CoderInfo | null>(null);
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        // Get coder info from localStorage
        if (typeof window !== 'undefined') {
            const name = localStorage.getItem("gnata-coder-name");
            const email = localStorage.getItem("gnata-coder-email");

            if (name && email) {
                setCoder({ name, email });
            }
        }

        // Fetch pending projects count
        fetch('/api/coder/projects')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setPendingCount(data.count);
                }
            })
            .catch(console.error);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("gnata-coder-id");
        localStorage.removeItem("gnata-coder-name");
        localStorage.removeItem("gnata-coder-email");
        router.push("/coder/login");
    };

    // Get initials from name
    const getInitials = (name: string) => {
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    return (
        <aside className="w-72 h-screen flex flex-col bg-[#0a0a0a] border-r border-white/5 relative overflow-hidden">
            {/* Gradient Background Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[200px] -left-[100px] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 -right-[100px] w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[80px]" />
            </div>

            {/* Header */}
            <div className="relative z-10 h-20 flex items-center border-b border-white/5 px-6">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <Zap className="size-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-white tracking-tight">Gnata Coder</h1>
                        <p className="text-[10px] text-zinc-500 font-medium">Vibe Coder Dashboard</p>
                    </div>
                </div>
            </div>

            {/* Stats Banner */}
            <div className="relative z-10 mx-4 mt-4 p-4 rounded-xl bg-gradient-to-r from-purple-600/20 to-blue-600/10 border border-purple-500/20">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Star className="size-4 text-yellow-400" />
                        <span className="text-sm font-medium text-white">Top Coder</span>
                    </div>
                    <span className="text-xs text-purple-400 font-medium">Niveau Pro</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                        <p className="text-lg font-bold text-white">47</p>
                        <p className="text-[10px] text-zinc-500">Sites créés</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-white">4.9</p>
                        <p className="text-[10px] text-zinc-500">Note</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-white">1h42</p>
                        <p className="text-[10px] text-zinc-500">Temps moy.</p>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 relative z-10">
                {mainNavItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== "/coder" && pathname.startsWith(item.href.split("?")[0]));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                                isActive
                                    ? "bg-gradient-to-r from-purple-600/20 to-blue-600/10 text-white border border-purple-500/20"
                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <div className={cn(
                                "size-9 rounded-lg flex items-center justify-center transition-all",
                                isActive
                                    ? "bg-purple-500/20 text-purple-400"
                                    : "text-zinc-500 group-hover:text-zinc-300"
                            )}>
                                <Icon className="size-5" />
                            </div>
                            <span className="text-sm font-medium flex-1">{item.label}</span>
                            {item.badge && pendingCount > 0 && (
                                <span className="size-5 rounded-full bg-purple-500 text-white text-xs font-bold flex items-center justify-center">
                                    {pendingCount}
                                </span>
                            )}
                            {isActive && (
                                <motion.div
                                    layoutId="coderActiveIndicator"
                                    className="size-1.5 rounded-full bg-purple-500"
                                />
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Bottom Navigation */}
            <div className="relative z-10 border-t border-white/5 p-3 space-y-1">
                {bottomNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="group flex items-center gap-3 px-4 py-2.5 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <Icon className="size-4" />
                            <span className="text-sm">{item.label}</span>
                        </Link>
                    );
                })}
            </div>

            {/* User Profile */}
            <div className="relative z-10 p-4 border-t border-white/5">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="size-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                        {coder ? getInitials(coder.name) : "VC"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                            {coder?.name || "Vibe Coder"}
                        </p>
                        <div className="flex items-center gap-1">
                            <div className="size-1.5 rounded-full bg-emerald-500" />
                            <p className="text-xs text-emerald-400">En ligne</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-zinc-500 hover:text-red-400"
                        onClick={handleLogout}
                        title="Se déconnecter"
                    >
                        <LogOut className="size-4" />
                    </Button>
                </div>
            </div>
        </aside>
    );
}
