"use client";

import { motion } from "framer-motion";
import { StatCard } from "@/components/dashboard/stat-card";
import { AppCard } from "@/components/dashboard/app-card";
import { RevenueChart, UsersChart } from "@/components/dashboard/charts";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import {
    Users,
    CreditCard,
    TrendingUp,
    Zap,
    Globe,
    MessageSquare,
    Shield,
} from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="p-8 space-y-8">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
            >
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    Tableau de bord
                </h1>
                <p className="text-zinc-500">
                    Vue d'ensemble de votre écosystème Wozif
                </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Utilisateurs"
                    value="12,847"
                    change={12.5}
                    changeLabel="vs mois dernier"
                    icon={Users}
                    color="purple"
                    delay={0}
                />
                <StatCard
                    title="Revenus ce mois"
                    value="8.4M F"
                    change={23.1}
                    changeLabel="vs mois dernier"
                    icon={CreditCard}
                    color="emerald"
                    delay={0.1}
                />
                <StatCard
                    title="Transactions"
                    value="1,234"
                    change={-5.2}
                    changeLabel="vs mois dernier"
                    icon={TrendingUp}
                    color="blue"
                    delay={0.2}
                />
                <StatCard
                    title="Sites créés"
                    value="156"
                    change={45}
                    changeLabel="nouveaux ce mois"
                    icon={Zap}
                    color="orange"
                    delay={0.3}
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <RevenueChart />
                <UsersChart />
            </div>

            {/* Applications Grid */}
            <div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-between mb-6"
                >
                    <div>
                        <h2 className="text-xl font-bold text-white">Applications</h2>
                        <p className="text-sm text-zinc-500">État de vos services</p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <AppCard
                        name="AfriFlow"
                        description="Plateforme de paiement"
                        icon={Globe}
                        status="online"
                        users={4521}
                        requests="1.2k"
                        color="#10b981"
                        url="http://localhost:3000"
                        delay={0}
                    />
                    <AppCard
                        name="Gnata"
                        description="Création de sites"
                        icon={Zap}
                        status="online"
                        users={2847}
                        requests="856"
                        color="#a855f7"
                        url="http://localhost:3002"
                        delay={0.1}
                    />
                    <AppCard
                        name="WhatsApp MCP"
                        description="Intégration WhatsApp"
                        icon={MessageSquare}
                        status="maintenance"
                        users={1203}
                        requests="423"
                        color="#22c55e"
                        url="http://localhost:3003"
                        delay={0.2}
                    />
                    <AppCard
                        name="Account Portal"
                        description="Authentification SSO"
                        icon={Shield}
                        status="online"
                        users={8974}
                        requests="2.1k"
                        color="#3b82f6"
                        url="http://localhost:3012"
                        delay={0.3}
                    />
                </div>
            </div>

            {/* Recent Transactions */}
            <RecentTransactions />
        </div>
    );
}
