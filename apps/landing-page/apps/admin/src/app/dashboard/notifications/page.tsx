"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
    Bell, CheckCircle, AlertTriangle, Info, XCircle, Settings,
    Trash2, CheckCheck, Filter, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Notification {
    id: string;
    type: "success" | "warning" | "info" | "error";
    title: string;
    message: string;
    app: string;
    time: string;
    read: boolean;
}

const notifications: Notification[] = [
    { id: "1", type: "success", title: "Paiement reçu", message: "Mamadou Diallo a effectué un paiement de 30,000 F sur Gnata", app: "Gnata", time: "Il y a 5 min", read: false },
    { id: "2", type: "warning", title: "Charge CPU élevée", message: "Le serveur AfriFlow utilise 85% du CPU. Considérez une mise à l'échelle.", app: "AfriFlow", time: "Il y a 15 min", read: false },
    { id: "3", type: "info", title: "Nouvel utilisateur", message: "Aissatou Bah vient de créer un compte sur Account Portal", app: "Portal", time: "Il y a 30 min", read: false },
    { id: "4", type: "error", title: "Échec de paiement", message: "Transaction PAY-2024-004 échouée pour Fatou Ndiaye", app: "AfriFlow", time: "Il y a 1h", read: true },
    { id: "5", type: "success", title: "Déploiement réussi", message: "Gnata v1.2.0 a été déployé avec succès", app: "Gnata", time: "Il y a 5h", read: true },
    { id: "6", type: "info", title: "Maintenance planifiée", message: "WhatsApp MCP sera en maintenance le 20 Jan de 02h à 04h", app: "WhatsApp", time: "Il y a 1 jour", read: true },
    { id: "7", type: "success", title: "Site terminé", message: "Le site de Oumar Sy est prêt et publié", app: "Gnata", time: "Il y a 2 jours", read: true },
];

const typeConfig = {
    success: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    warning: { icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
    info: { icon: Info, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    error: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
};

export default function NotificationsPage() {
    const [filter, setFilter] = useState<"all" | "unread">("all");
    const [notifs, setNotifs] = useState(notifications);

    const unreadCount = notifs.filter(n => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    };

    const deleteNotif = (id: string) => {
        setNotifs(prev => prev.filter(n => n.id !== id));
    };

    const filteredNotifs = filter === "unread" ? notifs.filter(n => !n.read) : notifs;

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Notifications</h1>
                    <p className="text-zinc-500">
                        {unreadCount > 0 ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}` : "Toutes les notifications sont lues"}
                    </p>
                </motion.div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={markAllAsRead}>
                        <CheckCheck className="size-4 mr-2" />
                        Tout marquer comme lu
                    </Button>
                    <Button variant="outline" size="sm">
                        <Settings className="size-4 mr-2" />
                        Préférences
                    </Button>
                </div>
            </div>

            {/* Filter Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex gap-1 p-1 rounded-lg bg-white/5 w-fit"
            >
                <button
                    onClick={() => setFilter("all")}
                    className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium transition-all",
                        filter === "all" ? "bg-purple-600 text-white" : "text-zinc-500 hover:text-white"
                    )}
                >
                    Toutes ({notifs.length})
                </button>
                <button
                    onClick={() => setFilter("unread")}
                    className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                        filter === "unread" ? "bg-purple-600 text-white" : "text-zinc-500 hover:text-white"
                    )}
                >
                    Non lues
                    {unreadCount > 0 && (
                        <span className="size-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </button>
            </motion.div>

            {/* Notifications List */}
            <div className="space-y-3">
                {filteredNotifs.map((notif, idx) => {
                    const config = typeConfig[notif.type];
                    const Icon = config.icon;

                    return (
                        <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * idx }}
                            className={cn(
                                "group p-4 rounded-2xl border transition-all",
                                notif.read
                                    ? "bg-white/[0.01] border-white/5"
                                    : "bg-white/[0.03] border-white/10",
                                config.border
                            )}
                        >
                            <div className="flex items-start gap-4">
                                {/* Icon */}
                                <div className={cn(
                                    "size-10 rounded-xl flex items-center justify-center shrink-0",
                                    config.bg
                                )}>
                                    <Icon className={cn("size-5", config.color)} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className={cn(
                                            "text-sm font-medium",
                                            notif.read ? "text-zinc-400" : "text-white"
                                        )}>
                                            {notif.title}
                                        </h4>
                                        {!notif.read && (
                                            <div className="size-2 rounded-full bg-purple-500" />
                                        )}
                                    </div>
                                    <p className="text-sm text-zinc-500 mb-2">{notif.message}</p>
                                    <div className="flex items-center gap-3 text-xs text-zinc-600">
                                        <span className="px-2 py-0.5 rounded bg-white/5">{notif.app}</span>
                                        <div className="flex items-center gap-1">
                                            <Clock className="size-3" />
                                            {notif.time}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {!notif.read && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8"
                                            onClick={() => markAsRead(notif.id)}
                                        >
                                            <CheckCircle className="size-4" />
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8 text-red-400"
                                        onClick={() => deleteNotif(notif.id)}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {filteredNotifs.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <div className="size-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                            <Bell className="size-8 text-zinc-600" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">Aucune notification</h3>
                        <p className="text-sm text-zinc-500">Vous êtes à jour !</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
