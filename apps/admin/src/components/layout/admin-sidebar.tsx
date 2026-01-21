"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Settings,
    Users,
    CreditCard,
    BarChart3,
    Layers,
    Globe,
    MessageSquare,
    Zap,
    Shield,
    Bell,
    HelpCircle,
    LogOut,
    ChevronLeft,
    ChevronRight,
    SmartphoneNfc
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

const mainNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: BarChart3, label: "Analytiques", href: "/dashboard/analytics" },
    { icon: SmartphoneNfc, label: "Instances SIM", href: "/dashboard/instances" },
    { icon: Users, label: "Utilisateurs", href: "/dashboard/users" },
    { icon: CreditCard, label: "Paiements", href: "/dashboard/payments" },
    { icon: Layers, label: "Applications", href: "/dashboard/applications" },
    { icon: Globe, label: "Projets Gnata", href: "/dashboard/gnata", badge: true },
];

const appsNavItems = [
    { icon: Globe, label: "AfriFlow", href: "/dashboard/apps/afriflow", color: "text-emerald-400" },
    { icon: Zap, label: "Gnata", href: "/dashboard/apps/gnata", color: "text-purple-400" },
    { icon: MessageSquare, label: "WhatsApp MCP", href: "/dashboard/apps/whatsapp", color: "text-green-400" },
    { icon: Shield, label: "Account Portal", href: "/dashboard/apps/account", color: "text-blue-400" },
];

const bottomNavItems = [
    { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
    { icon: Settings, label: "Paramètres", href: "/dashboard/settings" },
    { icon: HelpCircle, label: "Aide", href: "/dashboard/help" },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("wozif-admin-email");
        localStorage.removeItem("wozif-admin-logged");
        router.push("/login");
    };

    return (
        <TooltipProvider delayDuration={50}>
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 280 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="h-screen flex flex-col bg-[#0a0a0a] border-r border-white/5 relative overflow-hidden"
            >
                {/* Gradient Background Effect */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-[200px] -left-[100px] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
                    <div className="absolute top-1/2 -right-[100px] w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[80px]" />
                </div>

                {/* Header */}
                <div className={cn(
                    "relative z-10 h-20 flex items-center border-b border-white/5 px-6",
                    isCollapsed && "justify-center px-0"
                )}>
                    {!isCollapsed ? (
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                                <span className="text-xl font-black text-white">W</span>
                            </div>
                            <div>
                                <h1 className="font-bold text-white tracking-tight">Wozif Admin</h1>
                                <p className="text-[10px] text-zinc-500 font-medium">Control Panel</p>
                            </div>
                        </div>
                    ) : (
                        <div className="size-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <span className="text-xl font-black text-white">W</span>
                        </div>
                    )}
                </div>

                {/* Collapse Toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute right-0 top-[70px] translate-x-1/2 z-50 size-6 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"
                >
                    {isCollapsed ? <ChevronRight className="size-3" /> : <ChevronLeft className="size-3" />}
                </button>

                {/* Main Navigation */}
                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-6 relative z-10">
                    {/* Main Menu */}
                    <div className="space-y-1">
                        {!isCollapsed && (
                            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                                Menu Principal
                            </p>
                        )}
                        {mainNavItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                            const Icon = item.icon;

                            const linkContent = (
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                                        isActive
                                            ? "bg-gradient-to-r from-purple-600/20 to-blue-600/10 text-white border border-purple-500/20"
                                            : "text-zinc-400 hover:text-white hover:bg-white/5",
                                        isCollapsed && "justify-center px-0"
                                    )}
                                >
                                    <div className={cn(
                                        "size-8 rounded-lg flex items-center justify-center transition-all",
                                        isActive
                                            ? "bg-purple-500/20 text-purple-400"
                                            : "text-zinc-500 group-hover:text-zinc-300"
                                    )}>
                                        <Icon className="size-4" />
                                    </div>
                                    {!isCollapsed && (
                                        <span className="text-sm font-medium">{item.label}</span>
                                    )}
                                    {isActive && !isCollapsed && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="ml-auto size-1.5 rounded-full bg-purple-500"
                                        />
                                    )}
                                </Link>
                            );

                            if (isCollapsed) {
                                return (
                                    <Tooltip key={item.href}>
                                        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                                        <TooltipContent side="right">{item.label}</TooltipContent>
                                    </Tooltip>
                                );
                            }
                            return <div key={item.href}>{linkContent}</div>;
                        })}
                    </div>

                    {/* Applications */}
                    <div className="space-y-1">
                        {!isCollapsed && (
                            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                                Applications
                            </p>
                        )}
                        {appsNavItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                            const Icon = item.icon;

                            const linkContent = (
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                                        isActive
                                            ? "bg-white/5 text-white"
                                            : "text-zinc-400 hover:text-white hover:bg-white/5",
                                        isCollapsed && "justify-center px-0"
                                    )}
                                >
                                    <div className={cn(
                                        "size-8 rounded-lg flex items-center justify-center",
                                        item.color
                                    )}>
                                        <Icon className="size-4" />
                                    </div>
                                    {!isCollapsed && (
                                        <span className="text-sm font-medium">{item.label}</span>
                                    )}
                                </Link>
                            );

                            if (isCollapsed) {
                                return (
                                    <Tooltip key={item.href}>
                                        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                                        <TooltipContent side="right">{item.label}</TooltipContent>
                                    </Tooltip>
                                );
                            }
                            return <div key={item.href}>{linkContent}</div>;
                        })}
                    </div>
                </div>

                {/* Bottom Navigation */}
                <div className="relative z-10 border-t border-white/5 p-3 space-y-1">
                    {bottomNavItems.map((item) => {
                        const Icon = item.icon;
                        const linkContent = (
                            <Link
                                href={item.href}
                                className={cn(
                                    "group flex items-center gap-3 px-3 py-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all",
                                    isCollapsed && "justify-center px-0"
                                )}
                            >
                                <Icon className="size-4" />
                                {!isCollapsed && <span className="text-sm">{item.label}</span>}
                            </Link>
                        );

                        if (isCollapsed) {
                            return (
                                <Tooltip key={item.href}>
                                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                                    <TooltipContent side="right">{item.label}</TooltipContent>
                                </Tooltip>
                            );
                        }
                        return <div key={item.href}>{linkContent}</div>;
                    })}
                </div>

                {/* User Profile */}
                <div className={cn(
                    "relative z-10 p-4 border-t border-white/5",
                    isCollapsed && "p-3"
                )}>
                    <div className={cn(
                        "flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5",
                        isCollapsed && "justify-center"
                    )}>
                        <div className="size-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                            YK
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">Yohan Koffi</p>
                                <p className="text-xs text-zinc-500">Super Admin</p>
                            </div>
                        )}
                        {!isCollapsed && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 text-zinc-500 hover:text-red-400"
                                onClick={handleLogout}
                                title="Se déconnecter"
                            >
                                <LogOut className="size-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </motion.aside>
        </TooltipProvider>
    );
}
