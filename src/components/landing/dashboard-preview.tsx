"use client";

import { motion } from "framer-motion";
import {
    ArrowUpRight,
    CreditCard,
    DollarSign,
    TrendingUp,
    Zap,
    Search,
    Bell,
    Settings,
    MoreHorizontal,
    Download
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

// --- MOCK DATA ---
const chartData = [
    { name: 'Lun', total: 154000 },
    { name: 'Mar', total: 210000 },
    { name: 'Mer', total: 120500 },
    { name: 'Jeu', total: 320000 },
    { name: 'Ven', total: 280000 },
    { name: 'Sam', total: 195000 },
    { name: 'Dim', total: 140000 },
];

const transactions = [
    { id: "TX-9821", amount: "25.000", currency: "FCFA", status: "success", method: "Wave", date: "Il y a 2 min", customer: "Jean D." },
    { id: "TX-9820", amount: "10.000", currency: "FCFA", status: "success", method: "Orange Money", date: "Il y a 5 min", customer: "Awa S." },
    { id: "TX-9819", amount: "50.000", currency: "FCFA", status: "pending", method: "Visa", date: "Il y a 12 min", customer: "Pierre K." },
    { id: "TX-9818", amount: "15.000", currency: "FCFA", status: "success", method: "Wave", date: "Il y a 15 min", customer: "Moussa D." },
    { id: "TX-9817", amount: "100.000", currency: "FCFA", status: "failed", method: "MTN MoMo", date: "Il y a 25 min", customer: "Sarah L." },
];

export function LandingDashboardPreview() {
    return (
        <div className="w-full h-full bg-[#09090B] text-foreground font-sans overflow-hidden flex flex-col">
            {/* Fake Browser Headers (Optional, but user asked for 'iframe style') */}
            {/* We will skip the browser chrome to keep it clean, as the 'iframe' request usually means 'embedded view' */}

            {/* Dashboard Header */}
            <header className="px-6 py-4 border-b border-white/5 bg-[#09090B] flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <div className="relative group cursor-pointer">
                        <div className="absolute inset-0 bg-emerald-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A0A0A] border border-white/10 text-emerald-500 shadow-2xl ring-1 ring-white/5 group-hover:scale-105 transition-transform duration-300">
                            <Zap className="h-5 w-5 fill-current" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold tracking-tight text-white mb-0.5">AfriFlow</span>
                        <div className="flex items-center gap-1.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest leading-none">Console</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                        <div className="h-9 w-64 bg-white/5 border border-white/10 rounded-full text-xs text-zinc-400 flex items-center pl-9">
                            Rechercher...
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost" className="rounded-full text-zinc-400 hover:text-white hover:bg-white/5">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <Avatar className="h-8 w-8 border border-white/10">
                            <AvatarImage src="/avatars/01.png" />
                            <AvatarFallback className="bg-emerald-900 text-emerald-200 text-xs">AD</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </header>

            {/* Dashboard Content */}
            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1 bg-[#020202]">
                {/* Greeting */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Vue d'ensemble</h1>
                        <p className="text-sm text-zinc-500">Voici ce qui se passe sur votre boutique aujourdhui.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="hidden sm:flex border-white/10 text-zinc-400 hover:text-white hover:bg-white/5">
                            <Download className="mr-2 h-4 w-4" /> Export
                        </Button>
                        <Button size="sm" className="bg-white text-black hover:bg-zinc-200 font-medium">
                            + Nouvelle Transaction
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { title: "Volume Total", value: "25.040.000", label: "FCFA", trend: "+12.5%", icon: DollarSign, color: "text-emerald-500", bg: "/backgrounds/emerald.png" },
                        { title: "Transactions", value: "1,240", label: "", trend: "+5.2%", icon: Zap, color: "text-amber-500", bg: "/backgrounds/amber.png" },
                        { title: "Taux de Succès", value: "98.5", label: "%", trend: "+1.1%", icon: TrendingUp, color: "text-blue-500", bg: "/backgrounds/blue.png" },
                        { title: "Passerelles", value: "4", label: "Actives", trend: "Stable", icon: CreditCard, color: "text-purple-500", bg: "/backgrounds/purple.png" }
                    ].map((stat, i) => (
                        <Card key={i} className="relative overflow-hidden border-none bg-zinc-900/40 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 group">
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
                            <div className="absolute inset-0 z-0 bg-gradient-to-br from-zinc-950/80 via-transparent to-zinc-950/20" />

                            <div className="relative z-10">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-zinc-400 group-hover:text-white transition-colors">{stat.title}</CardTitle>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white flex items-baseline gap-1">
                                        {stat.value}
                                        <span className="text-sm font-normal text-zinc-500">{stat.label}</span>
                                    </div>
                                    <p className="text-xs text-emerald-500 flex items-center mt-1">
                                        <ArrowUpRight className="h-3 w-3 mr-1" />
                                        {stat.trend}
                                        <span className="text-zinc-500 ml-1">vs hier</span>
                                    </p>
                                </CardContent>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                    {/* Visual Chart Mockup */}
                    <Card className="lg:col-span-4 bg-[#09090B] border-white/5 shadow-none">
                        <CardHeader>
                            <CardTitle className="text-base text-white">Revenus</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#666"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#666"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `${value / 1000}k`}
                                        />
                                        <Bar
                                            dataKey="total"
                                            fill="#10B981"
                                            radius={[4, 4, 0, 0]}
                                            barSize={30}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Transactions List */}
                    <Card className="lg:col-span-3 bg-[#09090B] border-white/5 shadow-none flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-base text-white">Récemment</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 flex-1 overflow-hidden">
                            {transactions.map((tx, i) => (
                                <div key={i} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-9 w-9 rounded-full flex items-center justify-center border ${tx.status === 'success' ? 'bg-emerald-500/10 border-emerald-500/20' : tx.status === 'pending' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                                            {tx.status === 'success' ? <ArrowUpRight className="h-4 w-4 text-emerald-500" /> : <MoreHorizontal className="h-4 w-4 text-zinc-500" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">{tx.customer}</p>
                                            <p className="text-xs text-zinc-500">{tx.method} • {tx.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-white">{tx.amount} <span className="text-[10px] text-zinc-500">{tx.currency}</span></p>
                                        <p className={`text-[10px] font-medium ${tx.status === 'success' ? 'text-emerald-500' : tx.status === 'pending' ? 'text-amber-500' : 'text-red-500'}`}>
                                            {tx.status === 'success' ? 'Payé' : tx.status === 'pending' ? 'En cours' : 'Échoué'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

