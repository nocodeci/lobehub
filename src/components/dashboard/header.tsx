"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {
    Bell,
    Search,
    User,
    LogOut,
    UserCircle,
    CreditCard,
    Key,
    Settings,
    Command
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function Header() {
    const { data: session } = useSession();
    const [mounted, setMounted] = useState(false);
    const user = session?.user;

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border/40 bg-background/80 backdrop-blur-md px-6">
            <div className="flex flex-1 items-center">
                <div className="relative w-96 max-w-sm group">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-foreground" />
                    <Input
                        type="search"
                        placeholder="Recherche rapide..."
                        className="pl-9 pr-12 h-9 bg-secondary/30 border-transparent hover:bg-secondary/50 focus-visible:bg-secondary/50 focus-visible:ring-1 focus-visible:ring-border rounded-lg transition-all text-sm placeholder:text-muted-foreground/40"
                    />
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded border border-border/40 bg-background/50 text-[10px] font-bold text-muted-foreground/50 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none">
                        <Command className="h-2.5 w-2.5" />
                        <span>K</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Minimal Status */}
                <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-secondary/50 border border-border/50">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.3)]" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Live</span>
                </div>

                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg relative transition-all">
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-background" />
                </Button>

                {mounted && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-9 w-9 rounded-lg p-0 hover:ring-4 hover:ring-secondary/50 transition-all border border-border/50 overflow-hidden group">
                                <Avatar className="h-full w-full rounded-lg transition-transform group-hover:scale-105">
                                    <AvatarImage
                                        src={user?.image || ""}
                                        className="object-cover"
                                        alt={user?.name || "User"}
                                    />
                                    <AvatarFallback className="bg-secondary text-muted-foreground text-[10px] font-bold">
                                        {user?.name?.[0] || user?.email?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-64 mt-2 bg-background border border-border/80 rounded-xl shadow-lg p-1.5"
                            align="end"
                        >
                            <DropdownMenuLabel className="font-normal px-3 py-4">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-bold tracking-tight text-foreground">{user?.name || "Utilisateur"}</p>
                                    <p className="text-[10px] font-medium text-muted-foreground truncate tracking-wide">
                                        {user?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>

                            <DropdownMenuSeparator className="my-1.5 bg-border/50" />

                            <div className="space-y-0.5">
                                <Link href="/settings/profile">
                                    <DropdownMenuItem className="rounded-lg cursor-default h-10 px-3 outline-none transition-colors hover:bg-secondary/50 flex items-center gap-3">
                                        <UserCircle className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-xs font-semibold">Profil</span>
                                    </DropdownMenuItem>
                                </Link>
                                <Link href="/billing">
                                    <DropdownMenuItem className="rounded-lg cursor-default h-10 px-3 outline-none transition-colors hover:bg-secondary/50 flex items-center gap-3">
                                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-xs font-semibold">Abonnement</span>
                                    </DropdownMenuItem>
                                </Link>
                                <Link href="/security">
                                    <DropdownMenuItem className="rounded-lg cursor-default h-10 px-3 outline-none transition-colors hover:bg-secondary/50 flex items-center gap-3">
                                        <Key className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-xs font-semibold">Sécurité</span>
                                    </DropdownMenuItem>
                                </Link>
                                <Link href="/settings">
                                    <DropdownMenuItem className="rounded-xl cursor-default h-10 px-3 outline-none transition-colors hover:bg-secondary/50 flex items-center gap-3">
                                        <Settings className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-xs font-semibold">Paramètres</span>
                                    </DropdownMenuItem>
                                </Link>
                            </div>

                            <DropdownMenuSeparator className="my-1.5 bg-border/50" />

                            <DropdownMenuItem
                                onClick={() => signOut({ callbackUrl: "/login" })}
                                className="rounded-lg cursor-default h-10 px-3 outline-none transition-colors hover:bg-red-500/10 text-red-500 flex items-center gap-3"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="text-xs font-bold">Déconnexion</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </header>
    );
}
