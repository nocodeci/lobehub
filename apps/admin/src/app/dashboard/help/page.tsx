"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
    Search, Book, MessageCircle, Mail, ExternalLink, ChevronRight,
    FileText, Video, HelpCircle, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = [
    { id: "getting-started", label: "Démarrage", icon: Zap, count: 8 },
    { id: "users", label: "Utilisateurs", icon: HelpCircle, count: 12 },
    { id: "payments", label: "Paiements", icon: FileText, count: 15 },
    { id: "api", label: "API & Intégrations", icon: Book, count: 24 },
];

const articles = [
    { id: "1", title: "Comment ajouter un nouvel utilisateur administrateur ?", category: "Utilisateurs", views: 1234 },
    { id: "2", title: "Configuration des webhooks de paiement", category: "Paiements", views: 987 },
    { id: "3", title: "Intégration de l'API AfriFlow", category: "API", views: 2341 },
    { id: "4", title: "Personnalisation des emails de notification", category: "Démarrage", views: 567 },
    { id: "5", title: "Gestion des remboursements", category: "Paiements", views: 789 },
];

const faqs = [
    { q: "Comment réinitialiser le mot de passe d'un utilisateur ?", a: "Allez dans Utilisateurs > Sélectionnez l'utilisateur > Actions > Réinitialiser mot de passe." },
    { q: "Comment exporter les données de paiement ?", a: "Dans la section Paiements, cliquez sur le bouton 'Exporter' en haut à droite pour télécharger un CSV." },
    { q: "Où trouver mes clés API ?", a: "Paramètres > API & Clés. Vous pouvez créer de nouvelles clés et gérer celles existantes." },
];

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-2xl mx-auto"
            >
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Comment pouvons-nous vous aider ?</h1>
                <p className="text-zinc-500 mb-6">Recherchez dans notre base de connaissances ou contactez le support</p>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Rechercher dans la documentation..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500/50 text-lg"
                    />
                </div>
            </motion.div>

            {/* Categories */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
                {categories.map((cat, idx) => (
                    <motion.button
                        key={cat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + idx * 0.05 }}
                        className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-purple-500/20 transition-all text-left group"
                    >
                        <div className="size-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                            <cat.icon className="size-6 text-purple-400" />
                        </div>
                        <h3 className="text-white font-medium mb-1">{cat.label}</h3>
                        <p className="text-sm text-zinc-500">{cat.count} articles</p>
                    </motion.button>
                ))}
            </motion.div>

            {/* Popular Articles */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
            >
                <h2 className="text-lg font-bold text-white mb-4">Articles populaires</h2>
                <div className="space-y-2">
                    {articles.map((article) => (
                        <button
                            key={article.id}
                            className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/[0.03] transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <FileText className="size-5 text-zinc-600" />
                                <div className="text-left">
                                    <p className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors">
                                        {article.title}
                                    </p>
                                    <p className="text-xs text-zinc-500">{article.category}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-zinc-600">{article.views} vues</span>
                                <ChevronRight className="size-4 text-zinc-600 group-hover:text-purple-400 transition-colors" />
                            </div>
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* FAQ */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
            >
                <h2 className="text-lg font-bold text-white mb-4">Questions fréquentes</h2>
                <div className="space-y-2">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="rounded-xl border border-white/5 overflow-hidden"
                        >
                            <button
                                onClick={() => setExpandedFaq(expandedFaq === faq.q ? null : faq.q)}
                                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
                            >
                                <span className="text-sm font-medium text-white">{faq.q}</span>
                                <ChevronRight className={cn(
                                    "size-4 text-zinc-600 transition-transform",
                                    expandedFaq === faq.q && "rotate-90"
                                )} />
                            </button>
                            {expandedFaq === faq.q && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="px-4 pb-4"
                                >
                                    <p className="text-sm text-zinc-400">{faq.a}</p>
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Contact Support */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] text-center">
                    <div className="size-12 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="size-6 text-blue-400" />
                    </div>
                    <h3 className="text-white font-medium mb-2">Chat en direct</h3>
                    <p className="text-sm text-zinc-500 mb-4">Parlez à notre équipe en temps réel</p>
                    <Button variant="outline" className="w-full">Démarrer le chat</Button>
                </div>

                <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] text-center">
                    <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                        <Mail className="size-6 text-emerald-400" />
                    </div>
                    <h3 className="text-white font-medium mb-2">Email</h3>
                    <p className="text-sm text-zinc-500 mb-4">Envoyez-nous un message détaillé</p>
                    <Button variant="outline" className="w-full">support@wozif.com</Button>
                </div>

                <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] text-center">
                    <div className="size-12 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                        <Video className="size-6 text-purple-400" />
                    </div>
                    <h3 className="text-white font-medium mb-2">Tutoriels vidéo</h3>
                    <p className="text-sm text-zinc-500 mb-4">Guides pas à pas en vidéo</p>
                    <Button variant="outline" className="w-full">
                        <ExternalLink className="size-4 mr-2" />
                        YouTube
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
