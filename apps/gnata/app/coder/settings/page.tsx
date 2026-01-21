"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
    Settings, User, Bell, Palette, Shield, CreditCard,
    Save, Eye, EyeOff, Check, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";

const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "payments", label: "Paiements", icon: CreditCard },
    { id: "security", label: "Sécurité", icon: Shield },
];

export default function CoderSettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white tracking-tight">Paramètres</h1>
                <p className="text-zinc-500">Gérez votre profil et vos préférences</p>
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
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${activeTab === tab.id
                                        ? "bg-purple-600/20 text-white border border-purple-500/20"
                                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <tab.icon className="size-5" />
                                <span className="text-sm font-medium">{tab.label}</span>
                            </button>
                        ))}
                    </nav>

                    {/* Stats Card */}
                    <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/10 border border-purple-500/20">
                        <h3 className="text-sm font-medium text-white mb-3">Vos statistiques</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-zinc-400">Sites créés</span>
                                <span className="text-sm font-bold text-white">47</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-zinc-400">Note moyenne</span>
                                <span className="text-sm font-bold text-white">4.9/5</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-zinc-400">Temps moyen</span>
                                <span className="text-sm font-bold text-white">1h42</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-zinc-400">Membre depuis</span>
                                <span className="text-sm font-bold text-white">Jan 2024</span>
                            </div>
                        </div>
                    </div>
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
                                <p className="text-sm text-zinc-500">Mettez à jour vos informations personnelles</p>
                            </div>

                            <div className="flex items-center gap-6 py-4">
                                <div className="size-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                                    VC
                                </div>
                                <div>
                                    <Button variant="outline" size="sm">Changer la photo</Button>
                                    <p className="text-xs text-zinc-500 mt-2">JPG, PNG ou GIF. Max 2MB</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Pseudo Coder</label>
                                    <input
                                        type="text"
                                        defaultValue="Vibe Coder #12"
                                        className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Spécialité</label>
                                    <select className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50">
                                        <option value="all">Tous types de sites</option>
                                        <option value="ecommerce">E-commerce</option>
                                        <option value="portfolio">Portfolio</option>
                                        <option value="restaurant">Restaurant</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
                                    <input
                                        type="email"
                                        defaultValue="coder12@gnata.io"
                                        className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Bio</label>
                                    <textarea
                                        rows={3}
                                        defaultValue="Expert en création de sites e-commerce et portfolios. Plus de 2 ans d'expérience en développement web."
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 resize-none"
                                    />
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

                    {activeTab === "notifications" && (
                        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-6">
                            <div>
                                <h2 className="text-lg font-bold text-white mb-1">Préférences de notification</h2>
                                <p className="text-sm text-zinc-500">Gérez comment vous recevez les notifications</p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { label: "Nouveau projet disponible", desc: "Recevez une alerte quand un nouveau projet est soumis", enabled: true },
                                    { label: "Projet urgent", desc: "Notification pour les projets marqués comme urgents", enabled: true },
                                    { label: "Validation client", desc: "Quand un client valide votre travail", enabled: true },
                                    { label: "Rappels de délai", desc: "Rappel avant la fin du temps estimé", enabled: false },
                                    { label: "Résumé hebdomadaire", desc: "Résumé de vos performances chaque semaine", enabled: true },
                                ].map((notif, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                        <div>
                                            <p className="text-sm font-medium text-white">{notif.label}</p>
                                            <p className="text-xs text-zinc-500">{notif.desc}</p>
                                        </div>
                                        <button className={`relative w-12 h-6 rounded-full transition-colors ${notif.enabled ? "bg-purple-600" : "bg-white/10"
                                            }`}>
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${notif.enabled ? "translate-x-7" : "translate-x-1"
                                                }`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "payments" && (
                        <div className="space-y-6">
                            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-6">
                                <div>
                                    <h2 className="text-lg font-bold text-white mb-1">Informations de paiement</h2>
                                    <p className="text-sm text-zinc-500">Configurez comment vous recevez vos commissions</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">Méthode de paiement</label>
                                        <select className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50">
                                            <option value="momo">Orange Money</option>
                                            <option value="mtn">MTN Mobile Money</option>
                                            <option value="wave">Wave</option>
                                            <option value="bank">Virement bancaire</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">Numéro de téléphone</label>
                                        <input
                                            type="tel"
                                            defaultValue="+225 07 00 00 00"
                                            className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t border-white/5">
                                    <Button>
                                        <Save className="size-4 mr-2" />
                                        Sauvegarder
                                    </Button>
                                </div>
                            </div>

                            {/* Earnings Summary */}
                            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Résumé des gains</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-4 rounded-xl bg-white/5">
                                        <p className="text-xs text-zinc-500 mb-1">Ce mois</p>
                                        <p className="text-2xl font-bold text-emerald-400">345K F</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/5">
                                        <p className="text-xs text-zinc-500 mb-1">En attente</p>
                                        <p className="text-2xl font-bold text-yellow-400">24.6K F</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/5">
                                        <p className="text-xs text-zinc-500 mb-1">Total perçu</p>
                                        <p className="text-2xl font-bold text-white">1.2M F</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-6">
                            <div>
                                <h2 className="text-lg font-bold text-white mb-1">Sécurité du compte</h2>
                                <p className="text-sm text-zinc-500">Protégez votre compte</p>
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
                    )}
                </motion.div>
            </div>
        </div>
    );
}
