"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn, formatNumber } from "@/lib/utils";
import { CreditCard, ArrowUpRight, ArrowDownRight, Minus, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Transaction {
    id: string;
    user: string;
    email: string;
    amount: number;
    status: "completed" | "pending" | "failed";
    type: "payment" | "refund" | "withdrawal";
    app: string;
    date: Date;
}

const transactions: Transaction[] = [
    {
        id: "TRX-001",
        user: "Mamadou Diallo",
        email: "mamadou@example.com",
        amount: 30000,
        status: "completed",
        type: "payment",
        app: "Gnata",
        date: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
        id: "TRX-002",
        user: "Aissatou Bah",
        email: "aissatou@example.com",
        amount: 75000,
        status: "completed",
        type: "payment",
        app: "AfriFlow",
        date: new Date(Date.now() - 1000 * 60 * 45),
    },
    {
        id: "TRX-003",
        user: "Oumar Sy",
        email: "oumar@example.com",
        amount: 15000,
        status: "pending",
        type: "payment",
        app: "Gnata",
        date: new Date(Date.now() - 1000 * 60 * 120),
    },
    {
        id: "TRX-004",
        user: "Fatou Ndiaye",
        email: "fatou@example.com",
        amount: 30000,
        status: "failed",
        type: "payment",
        app: "Gnata",
        date: new Date(Date.now() - 1000 * 60 * 180),
    },
    {
        id: "TRX-005",
        user: "Ibrahim Koné",
        email: "ibrahim@example.com",
        amount: 50000,
        status: "completed",
        type: "refund",
        app: "AfriFlow",
        date: new Date(Date.now() - 1000 * 60 * 240),
    },
];

const statusStyles = {
    completed: {
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        label: "Complété"
    },
    pending: {
        bg: "bg-yellow-500/10",
        text: "text-yellow-400",
        label: "En attente"
    },
    failed: {
        bg: "bg-red-500/10",
        text: "text-red-400",
        label: "Échoué"
    },
};

const typeIcons = {
    payment: ArrowUpRight,
    refund: ArrowDownRight,
    withdrawal: Minus,
};

export function RecentTransactions() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden"
        >
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-white">Transactions récentes</h3>
                        <p className="text-sm text-zinc-500">Dernières activités de paiement</p>
                    </div>
                    <Button variant="outline" size="sm">
                        Voir tout
                    </Button>
                </div>
            </div>

            <div className="divide-y divide-white/5">
                {transactions.map((tx, index) => {
                    const status = statusStyles[tx.status];
                    const TypeIcon = typeIcons[tx.type];

                    return (
                        <motion.div
                            key={tx.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="p-4 hover:bg-white/[0.02] transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                {/* Icon */}
                                <div className={cn(
                                    "size-10 rounded-xl flex items-center justify-center",
                                    tx.type === "payment" ? "bg-emerald-500/10 text-emerald-400" :
                                        tx.type === "refund" ? "bg-orange-500/10 text-orange-400" :
                                            "bg-zinc-500/10 text-zinc-400"
                                )}>
                                    <TypeIcon className="size-5" />
                                </div>

                                {/* User Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-white truncate">
                                            {tx.user}
                                        </p>
                                        <span className="text-xs text-zinc-600">•</span>
                                        <span className="text-xs text-zinc-500">{tx.app}</span>
                                    </div>
                                    <p className="text-xs text-zinc-500 truncate">{tx.email}</p>
                                </div>

                                {/* Amount */}
                                <div className="text-right">
                                    <p className={cn(
                                        "text-sm font-bold",
                                        tx.type === "refund" ? "text-orange-400" : "text-white"
                                    )}>
                                        {tx.type === "refund" ? "-" : "+"}{formatNumber(tx.amount)} F
                                    </p>
                                    <p className="text-xs text-zinc-500">
                                        {format(tx.date, "HH:mm", { locale: fr })}
                                    </p>
                                </div>

                                {/* Status */}
                                <div className={cn(
                                    "px-2.5 py-1 rounded-lg text-xs font-medium",
                                    status.bg,
                                    status.text
                                )}>
                                    {status.label}
                                </div>

                                {/* Actions */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 opacity-0 group-hover:opacity-100"
                                >
                                    <MoreVertical className="size-4" />
                                </Button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
