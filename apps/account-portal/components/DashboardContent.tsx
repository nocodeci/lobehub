"use client";

import Link from "next/link";
import { Zap, Globe, CreditCard, Activity, ArrowUpRight, Plus, Settings, ShieldCheck, Sparkles, Bell, Search, LayoutDashboard, Database, HardDrive, Cpu } from "lucide-react";
import Logo from "@/components/Logo";
import SignOutButton from "@/components/SignOutButton";
import { motion } from "framer-motion";

interface DashboardContentProps {
    userName: string;
    initials: string;
}

export default function DashboardContent({ userName, initials }: DashboardContentProps) {
    const firstName = userName.split(" ")[0];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-indigo-500/10">
            {/* Sidebar Slim - Elite Style */}
            <aside className="hidden lg:flex w-24 flex-col items-center py-10 border-r border-slate-200 bg-white sticky top-0 h-screen">
                <Link href="/" className="mb-12 hover:scale-110 transition-transform">
                    <Logo variant="icon" height={36} />
                </Link>

                <nav className="flex-1 flex flex-col gap-8">
                    {[
                        { icon: LayoutDashboard, active: true },
                        { icon: Database, active: false },
                        { icon: CreditCard, active: false },
                        { icon: Bell, active: false },
                    ].map((nav, i) => (
                        <button
                            key={i}
                            className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${nav.active
                                    ? "bg-slate-950 text-white shadow-xl shadow-slate-200"
                                    : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                                }`}
                        >
                            <nav.icon size={20} />
                        </button>
                    ))}
                </nav>

                <div className="mt-auto">
                    <button className="h-12 w-12 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
                        <Settings size={20} />
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="lg:hidden">
                            <Logo height={28} />
                        </div>
                        <div className="hidden md:flex items-center bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200/50 w-72 group focus-within:border-indigo-500/50 transition-all">
                            <Search size={16} className="text-slate-400 group-focus-within:text-indigo-500" />
                            <input
                                type="text"
                                placeholder="Rechercher un service..."
                                className="bg-transparent border-none outline-none text-sm font-bold ml-3 w-full text-slate-900 placeholder:text-slate-400 placeholder:font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status Système</span>
                            <div className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">Tout est vert</span>
                            </div>
                        </div>

                        <div className="h-10 w-px bg-slate-200 mx-2 hidden sm:block"></div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="hidden md:block text-right">
                                    <div className="text-sm font-black text-slate-900 leading-none">{userName}</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Plan Entreprise</div>
                                </div>
                                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white font-black text-sm shadow-xl shadow-indigo-200 border-2 border-white">
                                    {initials}
                                </div>
                            </div>
                            <SignOutButton />
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-8 lg:p-12">
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="max-w-7xl mx-auto"
                    >
                        {/* Welcome Section */}
                        <motion.div variants={item} className="mb-12">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">
                                    Tableau de Bord
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                    <ShieldCheck size={12} /> Sécurité Maximale
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-[900] text-slate-950 tracking-[-0.05em] leading-[0.9]">
                                Content de vous voir, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500">{firstName}.</span>
                            </h1>
                        </motion.div>

                        {/* Top Stats - Quick Infrastructure Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            {[
                                { label: "Uptime Global", val: "99.99%", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50" },
                                { label: "CPU Usage", val: "12.4%", icon: Cpu, color: "text-indigo-500", bg: "bg-indigo-50" },
                                { label: "Nodes Actifs", val: "24/24", icon: HardDrive, color: "text-blue-500", bg: "bg-blue-50" },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    variants={item}
                                    className="p-6 rounded-[2rem] bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center gap-5"
                                >
                                    <div className={`h-12 w-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
                                        <div className="text-2xl font-[900] text-slate-900 tracking-tight">{stat.val}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Apps Grid */}
                        <motion.div variants={item} className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-black text-slate-950 uppercase tracking-widest flex items-center gap-3">
                                <Sparkles className="text-indigo-500" size={20} /> Vos Applications
                            </h2>
                            <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Gérer les accès</button>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                            {/* AfriFlow - Fintech Premium Card */}
                            <motion.div
                                variants={item}
                                className="group relative rounded-[2.5rem] bg-slate-950 p-10 overflow-hidden shadow-2xl shadow-indigo-900/10"
                            >
                                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                    <Zap size={200} className="text-indigo-500" />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-16">
                                        <div className="flex items-center gap-6">
                                            <div className="h-16 w-16 rounded-[1.25rem] bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shadow-inner">
                                                <Zap className="h-8 w-8 text-indigo-400 fill-indigo-400/20" />
                                            </div>
                                            <div>
                                                <h3 className="text-3xl font-[900] text-white tracking-tight">AfriFlow</h3>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Souverain & Actif</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Link
                                            href="http://localhost:3000"
                                            target="_blank"
                                            className="h-14 px-8 rounded-2xl bg-white text-slate-950 text-sm font-black flex items-center gap-3 hover:bg-indigo-400 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5"
                                        >
                                            Ouvrir <ArrowUpRight className="h-4 w-4" />
                                        </Link>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-10">
                                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                            <div className="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] mb-2">Flux de Trésorerie</div>
                                            <div className="text-3xl font-[900] text-white tracking-tighter">2.4M <span className="text-xs text-indigo-400 ml-1">XOF</span></div>
                                        </div>
                                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                            <div className="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] mb-2">Taux Conversion</div>
                                            <div className="text-3xl font-[900] text-white tracking-tighter">94.2<span className="text-xs text-indigo-400 ml-1">%</span></div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex -space-x-3">
                                            {[1, 2, 3].map(n => (
                                                <div key={n} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[10px] font-black text-white/30">API</div>
                                            ))}
                                            <div className="w-10 h-10 rounded-full border-2 border-slate-950 bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white">+5</div>
                                        </div>
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Dernière MAJ: 2min ago</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Gnata - Minimalist Premium Card */}
                            <motion.div
                                variants={item}
                                className="group relative rounded-[2.5rem] bg-white border border-slate-200 p-10 overflow-hidden shadow-sm hover:border-indigo-500/20 transition-all hover:shadow-2xl hover:shadow-slate-200/50"
                            >
                                <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                                    <Globe size={200} className="text-indigo-600" />
                                </div>

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex items-start justify-between mb-16">
                                        <div className="flex items-center gap-6">
                                            <div className="h-16 w-16 rounded-[1.25rem] bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                                                <Globe className="h-8 w-8 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                            </div>
                                            <div>
                                                <h3 className="text-3xl font-[900] text-slate-950 tracking-tight">Gnata</h3>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-slate-200 group-hover:bg-amber-500 transition-colors"></span>
                                                    <span className="text-[10px] font-black text-slate-400 group-hover:text-amber-600 uppercase tracking-[0.2em] transition-colors">Prêt à démarrer</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col items-center justify-center text-center py-6 px-4 rounded-3xl bg-slate-50 border border-slate-100 border-dashed group-hover:bg-white group-hover:border-indigo-200 transition-all">
                                        <div className="mb-4 h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-100 group-hover:shadow-indigo-100 transition-all">
                                            <LayoutDashboard className="h-6 w-6 text-slate-300 group-hover:text-indigo-500" />
                                        </div>
                                        <h4 className="text-sm font-black text-slate-900 mb-2 uppercase tracking-tight">Configuration Requise</h4>
                                        <p className="text-[13px] text-slate-500 font-medium max-w-[240px] leading-relaxed mb-6">Connectez votre domaine pour activer la puissance de Gnata.</p>
                                        <button className="h-11 px-6 rounded-xl bg-slate-950 text-white text-[11px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-200">
                                            Démarrer le Setup
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Recent Activity Table - Dark/Light Mix */}
                        <motion.div variants={item} className="rounded-[2.5rem] bg-white border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="text-xl font-black text-slate-950 tracking-tight flex items-center gap-3">
                                    <Activity size={20} className="text-indigo-500" /> Journal de Sécurité
                                </h3>
                                <button className="h-10 px-6 rounded-xl bg-slate-50 border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all">
                                    Filtrer les Logs
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Événement</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Application</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valeur</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Horodatage</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {[
                                            { ev: "Paiement Checkout", app: "AfriFlow", val: "+25,000 XOF", time: "Il y a 2m", status: "success" },
                                            { ev: "Nouvelle Clé API", app: "Système", val: "****42FA", time: "Il y a 12m", status: "neutral" },
                                            { ev: "Webhook Déclenché", app: "AfriFlow", val: "Envoi réussi", time: "Il y a 45m", status: "success" },
                                            { ev: "Connexion Élite", app: "Account", val: "IP: 197.***.***", time: "Il y a 1h", status: "neutral" },
                                        ].map((log, i) => (
                                            <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`h-2 w-2 rounded-full ${log.status === 'success' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                                        <span className="font-black text-slate-900 tracking-tight">{log.ev}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className="px-3 py-1 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                        {log.app}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 font-black text-slate-900 tracking-tighter">{log.val}</td>
                                                <td className="px-8 py-5 text-xs text-slate-400 font-bold">{log.time}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
