"use client";

import {
    ArrowDownRight,
    ArrowUpRight,
    CreditCard,
    DollarSign,
    TrendingUp,
    Zap,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getDashboardStats } from "@/lib/actions/dashboard";

export function StatsCards() {
    const [statsData, setStatsData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            const data = await getDashboardStats();
            setStatsData(data);
            setIsLoading(false);
        }
        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="h-32 flex items-center justify-center bg-card/40 border-none backdrop-blur-xl">
                        <Loader2 className="h-6 w-6 animate-spin text-primary/40" />
                    </Card>
                ))}
            </div>
        );
    }

    const cards = [
        {
            title: "Volume Total (XOF)",
            value: statsData?.totalVolume?.toLocaleString() + " FCFA",
            change: "0%",
            trend: "up",
            icon: DollarSign,
            color: "emerald",
            bg: "/backgrounds/emerald.png",
        },
        {
            title: "Transactions Réussies",
            value: statsData?.successfulTxCount?.toLocaleString() || "0",
            change: "0%",
            trend: "up",
            icon: Zap,
            color: "amber",
            bg: "/backgrounds/amber.png",
        },
        {
            title: "Taux de Conversion",
            value: (statsData?.conversionRate || "0") + "%",
            change: "0%",
            trend: "up",
            icon: TrendingUp,
            color: "blue",
            bg: "/backgrounds/blue.png",
        },
        {
            title: "Passerelles Actives",
            value: `${statsData?.activeGateways || 0} / ${statsData?.totalGateways || 0}`,
            change: "0",
            trend: "up",
            icon: CreditCard,
            color: "purple",
            bg: "/backgrounds/purple.png",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((stat, index) => (
                <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Card className="relative overflow-hidden border border-white/5 bg-[#252525] backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 group">
                        {/* Background Image with Overlay */}
                        <div
                            className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500 scale-110 group-hover:scale-100"
                            style={{
                                backgroundImage: `url(${stat.bg})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        />
                        {/* Gradient Overlay for better readability */}
                        <div className="absolute inset-0 z-0 bg-gradient-to-br from-background/80 via-transparent to-background/20" />

                        <div className="relative z-10">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-[#87a9ff] transition-colors">
                                    {stat.title}
                                </CardTitle>
                                <div className="p-2 rounded-lg bg-[#87a9ff]/10 text-[#87a9ff] group-hover:bg-[#87a9ff] group-hover:text-black transition-all duration-300 shadow-lg shadow-[#87a9ff]/20">
                                    <stat.icon className="h-4 w-4" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                                <div className="flex items-center mt-1">
                                    <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
                                    <p className="text-xs text-emerald-500 font-medium">
                                        {stat.change} <span className="text-muted-foreground/60 ml-1 font-normal">vs mois dernier</span>
                                    </p>
                                </div>
                            </CardContent>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
