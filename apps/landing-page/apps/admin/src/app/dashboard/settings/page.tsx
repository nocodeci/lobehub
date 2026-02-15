"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
    User, Shield, Bell, Palette, Database, Key, Globe, Mail,
    Save, Eye, EyeOff, Plus, Trash2, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "security", label: "Sécurité", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Apparence", icon: Palette },
    { id: "api", label: "API & Clés", icon: Key },
    { id: "database", label: "Base de données", icon: Database },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold text-white tracking-tight">Paramètres</h1>
                <p className="text-zinc-500">Configurez votre panneau d'administration</p>
            </motion.div>

            <div className="grid grid-cols-12 gap-8">
                {/* Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="col-span-3"
                >
                    <nav className="space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all",
                                    activeTab === tab.id
                                        ? "bg-purple-600/20 text-white border border-purple-500/20"
                                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <tab.icon className="size-5" />
                                <span className="text-sm font-medium">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </motion.div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="col-span-9"
                >
                    {activeTab === "profile" && (
                        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-6">
                            <div>
                                <h2 className="text-lg font-bold text-white mb-1">Informations du profil</h2>
                                <p className="text-sm text-zinc-500">Mettez à jour votre photo et vos informations</p>
                            </div>

                            <div className="flex items-center gap-6 py-4">
                                <div className="size-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                                    YK
                                </div>
                                <div>
                                    <Button variant="outline" size="sm">Changer la photo</Button>
                                    <p className="text-xs text-zinc-500 mt-2">JPG, PNG ou GIF. Max 2MB</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Prénom</label>
                                    <input
                                        type="text"
                                        defaultValue="Yohan"
                                        className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Nom</label>
                                    <input
                                        type="text"
                                        defaultValue="Koffi"
                                        className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
                                    <input
                                        type="email"
                                        defaultValue="yohan@wozif.com"
                                        className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Rôle</label>
                                    <select className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50">
                                        <option value="admin">Super Administrateur</option>
                                        <option value="moderator">Modérateur</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-white/5">
                                <Button>
                                    <Save className="size-4 mr-2" />
                                    Sauvegarder
                                </Button>
                            </div>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="space-y-6">
                            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-6">
                                <div>
                                    <h2 className="text-lg font-bold text-white mb-1">Changer le mot de passe</h2>
                                    <p className="text-sm text-zinc-500">Assurez-vous d'utiliser un mot de passe fort</p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">Mot de passe actuel</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="w-full h-11 px-4 pr-12 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                                            />
                                            <button
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                                            >
                                                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">Nouveau mot de passe</label>
                                        <input
                                            type="password"
                                            className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">Confirmer le mot de passe</label>
                                        <input
                                            type="password"
                                            className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t border-white/5">
                                    <Button>Mettre à jour</Button>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-6">
                                <div>
                                    <h2 className="text-lg font-bold text-white mb-1">Authentification à deux facteurs</h2>
                                    <p className="text-sm text-zinc-500">Ajoutez une couche de sécurité supplémentaire</p>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                            <Check className="size-5 text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">2FA Activée</p>
                                            <p className="text-xs text-zinc-500">Via Google Authenticator</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">Désactiver</Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "api" && (
                        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-white mb-1">Clés API</h2>
                                    <p className="text-sm text-zinc-500">Gérez vos clés d'accès à l'API admin</p>
                                </div>
                                <Button size="sm">
                                    <Plus className="size-4 mr-2" />
                                    Nouvelle clé
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { name: "Production Key", key: "wozif_live_***********************8f4a", created: "15 Jan 2024" },
                                    { name: "Development Key", key: "wozif_test_***********************2b7c", created: "10 Dec 2023" },
                                ].map((apiKey, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                        <div>
                                            <p className="text-sm font-medium text-white">{apiKey.name}</p>
                                            <p className="text-xs font-mono text-zinc-500">{apiKey.key}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-zinc-600">Créé le {apiKey.created}</span>
                                            <Button variant="ghost" size="icon" className="size-8 text-red-400">
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {(activeTab === "notifications" || activeTab === "appearance" || activeTab === "database") && (
                        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-12 text-center">
                            <div className="size-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                                {activeTab === "notifications" && <Bell className="size-8 text-zinc-600" />}
                                {activeTab === "appearance" && <Palette className="size-8 text-zinc-600" />}
                                {activeTab === "database" && <Database className="size-8 text-zinc-600" />}
                            </div>
                            <h3 className="text-lg font-medium text-white mb-2">
                                {activeTab === "notifications" && "Préférences de notification"}
                                {activeTab === "appearance" && "Personnalisation de l'apparence"}
                                {activeTab === "database" && "Configuration de la base de données"}
                            </h3>
                            <p className="text-sm text-zinc-500">Cette section sera disponible prochainement</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
