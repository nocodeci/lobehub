"use client";

import { useState } from "react";
import {
    UserIcon,
    CreditCardIcon,
    BellIcon,
    GlobeIcon,
    ShieldCheckIcon,
    ArrowLeftIcon,
    ZapIcon,
    CheckIcon,
    CameraIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = useState("profile");

    const tabs = [
        { id: "profile", label: "Profil", icon: UserIcon },
        { id: "billing", label: "Facturation", icon: CreditCardIcon },
        { id: "notifications", label: "Notifications", icon: BellIcon },
        { id: "security", label: "Sécurité", icon: ShieldCheckIcon },
        { id: "general", label: "Général", icon: GlobeIcon },
    ];

    if (status === "loading") return null;

    const user = session?.user;
    const userInitials = user?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "??";

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-12">
                {/* Header */}
                <div className="mb-8 md:mb-12 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5">
                                <ArrowLeftIcon className="size-5" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Paramètres</h1>
                    </div>
                    <Button className="bg-purple-600 hover:bg-purple-700 rounded-xl px-6 h-10 text-sm font-semibold shadow-lg shadow-purple-500/20 transition-all active:scale-95">
                        Enregistrer
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 md:gap-12">
                    {/* Sidebar Tabs */}
                    <aside className="space-y-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all group",
                                        isActive
                                            ? "bg-white/10 text-white shadow-xl ring-1 ring-white/10"
                                            : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
                                    )}
                                >
                                    <Icon className={cn("size-4 transition-colors", isActive ? "text-purple-400 font-bold" : "text-zinc-600 group-hover:text-zinc-400")} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </aside>

                    {/* Tab Content */}
                    <main className="space-y-12">
                        {activeTab === "profile" && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                {/* Profile Picture */}
                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-zinc-100">Photo de profil</h3>
                                    <div className="flex items-center gap-6">
                                        <div className="relative group">
                                            <Avatar className="size-24 rounded-3xl border-2 border-white/5 shadow-2xl">
                                                <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                                                <AvatarFallback className="bg-zinc-800 text-xl">{userInitials}</AvatarFallback>
                                            </Avatar>
                                            <button className="absolute -bottom-2 -right-2 size-8 bg-purple-600 rounded-xl border-4 border-[#050505] flex items-center justify-center hover:bg-purple-500 transition-colors shadow-lg shadow-purple-900/40">
                                                <CameraIcon className="size-4" />
                                            </button>
                                        </div>
                                        <div className="space-y-1.5 text-sm">
                                            <p className="text-zinc-400">Pour de meilleurs résultats, utilisez un carré de 256x256.</p>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs hover:bg-white/5">Supprimer</Button>
                                                <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs text-purple-400 hover:bg-purple-400/10">Mettre à jour</Button>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <Separator className="bg-white/5" />

                                {/* Personal Info */}
                                <section className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-500 ml-1">Nom complet</label>
                                            <Input defaultValue={user?.name || ""} placeholder="Votre nom" className="bg-white/[0.03] border-white/5 rounded-xl h-11 focus:border-purple-500/30 transition-all font-medium" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-500 ml-1">Adresse email</label>
                                            <Input defaultValue={user?.email || ""} placeholder="votre@email.com" className="bg-white/[0.03] border-white/5 rounded-xl h-11 focus:border-purple-500/30 transition-all font-medium" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-500 ml-1">Bio courte</label>
                                        <textarea
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl p-3 h-24 text-sm focus:border-purple-500/30 outline-none resize-none transition-all placeholder:text-zinc-700 font-medium"
                                            placeholder="Décrivez votre entreprise ou vos projets en quelques mots..."
                                            defaultValue=""
                                        />
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === "billing" && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                {/* Current Plan Card */}
                                <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-white/5 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-20 group-hover:scale-110 transition-transform">
                                        <ZapIcon className="size-24 text-purple-400" />
                                    </div>
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">Plan Actuel</span>
                                            </div>
                                            <h3 className="text-3xl font-bold italic tracking-tight">Gnata <span className="text-purple-500">Free</span></h3>
                                            <p className="text-zinc-500 text-sm max-w-sm">Idéal pour tester Gnata et lancer vos premiers projets.</p>
                                        </div>
                                        <Button className="bg-white text-black hover:bg-zinc-200 rounded-xl px-8 h-12 text-sm font-bold transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:-translate-y-1 active:scale-95">
                                            Passer à la version Pro
                                        </Button>
                                    </div>
                                </div>

                                {/* Billing Summary */}
                                <section className="space-y-6">
                                    <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                                        <CheckIcon className="size-5 text-purple-400" />
                                        Votre abonnement
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                                            <p className="text-xs text-zinc-500 font-medium">Prochaine facture</p>
                                            <p className="text-lg font-bold">0 FCFA</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                                            <p className="text-xs text-zinc-500 font-medium">Sites créés</p>
                                            <p className="text-lg font-bold">3 <span className="text-sm font-normal text-zinc-500">/ 5</span></p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                                            <p className="text-xs text-zinc-500 font-medium">Mode de paiement</p>
                                            <p className="text-lg font-bold">N/A</p>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab !== "profile" && activeTab !== "billing" && (
                            <div className="h-64 flex flex-col items-center justify-center space-y-4 text-center animate-in fade-in duration-500">
                                <div className="size-16 rounded-3xl bg-white/5 flex items-center justify-center text-zinc-600">
                                    <ZapIcon className="size-8" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-lg font-medium text-zinc-300 italic">Bientôt disponible</h3>
                                    <p className="text-sm text-zinc-500 max-w-xs mx-auto">Nous peaufinons ces réglages pour vous offrir la meilleure expérience Gnata possible.</p>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
