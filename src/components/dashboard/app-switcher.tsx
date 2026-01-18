"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Check,
    ChevronsUpDown,
    Plus,
    Layout
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getApplications, createApplication } from "@/lib/actions/applications";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export function AppSwitcher() {
    const [open, setOpen] = useState(false);
    const [apps, setApps] = useState<any[]>([]);
    const [currentApp, setCurrentApp] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        loadApps();
    }, []);

    const loadApps = async () => {
        try {
            const data = await getApplications();
            setApps(data);

            const savedAppId = typeof window !== 'undefined' ? localStorage.getItem('currentAppId') : null;
            const app = data.find((a: any) => a.id === savedAppId) || data[0];

            if (app) {
                setCurrentApp(app);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('currentAppId', app.id);
                    document.cookie = `applicationId=${app.id}; path=/; max-age=31536000`;
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelect = (app: any) => {
        setCurrentApp(app);
        localStorage.setItem('currentAppId', app.id);
        document.cookie = `applicationId=${app.id}; path=/; max-age=31536000`;
        setOpen(false);
        window.location.reload();
    };

    const handleCreateApp = () => {
        setOpen(false);
        router.push("/applications/new");
    };

    if (isLoading) return (
        <div className="h-12 w-full bg-secondary/30 rounded-xl animate-pulse" />
    );

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full h-12 justify-between px-3.5 bg-secondary/5 border border-border/40 hover:bg-secondary/20 hover:border-border transition-all rounded-[14px]",
                        open && "bg-secondary/40 border-border"
                    )}
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-lg border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                            <img
                                src={currentApp?.image || "/images/workspace-icon.png"}
                                alt="Workspace"
                                className="h-full w-full object-cover brightness-110 saturate-125"
                            />
                            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
                        </div>
                        <div className="flex flex-col items-start overflow-hidden">
                            <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none mb-0.5">Workspace</span>
                            <span className="text-[13px] font-bold text-foreground truncate max-w-[130px] tracking-tight">
                                {currentApp?.name || "Select app..."}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-0.5 opacity-20 group-hover:opacity-40 transition-opacity translate-x-1">
                        <ChevronsUpDown className="h-3.5 w-3.5" />
                    </div>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-[280px] bg-background/95 backdrop-blur-2xl border border-border/80 rounded-2xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] p-2"
                align="start"
                sideOffset={12}
            >
                <DropdownMenuLabel className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                    Mes Espaces de Travail
                </DropdownMenuLabel>

                <DropdownMenuGroup className="space-y-1">
                    {apps.map((app) => (
                        <DropdownMenuItem
                            key={app.id}
                            onClick={() => handleSelect(app)}
                            className={cn(
                                "flex items-center justify-between px-3.5 py-3 rounded-xl cursor-default outline-none transition-all duration-200",
                                currentApp?.id === app.id
                                    ? "bg-secondary text-foreground font-bold"
                                    : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-md border border-white/5 shadow-sm">
                                    <img
                                        src={app.image || "/images/workspace-icon.png"}
                                        alt="A"
                                        className={cn(
                                            "h-full w-full object-cover transition-all",
                                            currentApp?.id === app.id ? "brightness-110 saturate-125" : "grayscale opacity-40 brightness-75"
                                        )}
                                    />
                                    {currentApp?.id === app.id && (
                                        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
                                    )}
                                </div>
                                <span className="text-[13px] truncate max-w-[180px]">{app.name}</span>
                            </div>
                            {currentApp?.id === app.id && (
                                <motion.div layoutId="switcher-check">
                                    <Check className="h-4 w-4 text-primary" strokeWidth={3} />
                                </motion.div>
                            )}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="my-2 bg-border/40" />

                <DropdownMenuItem
                    onClick={handleCreateApp}
                    className="flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-default hover:bg-primary/5 transition-all text-primary font-bold outline-none group/new"
                >
                    <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center group-hover/new:scale-110 transition-transform">
                        <Plus className="h-4 w-4" />
                    </div>
                    <span className="text-[12px]">Ajouter un espace</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
