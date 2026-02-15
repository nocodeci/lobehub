"use client";

import React from "react";
import {
  MessageCircle,
  Share2,
  Zap,
  Users,
  LayoutGrid,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Search,
  Bell,
  Settings,
  Database,
  Phone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { MainChart } from "@/components/dashboard/MainChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Button } from "@/components/ui/button";

export default function DashboardPage({ userName }: { userName: string }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary selection:text-black">
      <DashboardSidebar />

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <DashboardHeader />

        <div className="flex-1 overflow-y-auto custom-scrollbar md:p-8 p-4">
          <div className="max-w-[1600px] mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-1"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-1 bg-primary rounded-full" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Vue d'ensemble</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
                  Content de vous revoir, <span className="text-primary not-italic">{userName}</span> 👋
                </h1>
                <p className="text-muted-foreground font-medium text-xs md:text-sm uppercase tracking-widest opacity-60">
                  Qu'est-ce que nous créons aujourd'hui ?
                </p>
              </motion.div>

              <div className="flex items-center gap-3">
                <Button className="h-10 px-6 rounded-xl bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-white/90">
                  <Sparkles className="h-4 w-4 mr-2" /> Upgrade Pro
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCard
                    title="Total Messages"
                    value="12.4k"
                    change="+14.2%"
                    icon={MessageCircle}
                    trend="up"
                  />
                  <StatCard
                    title="Connexions"
                    value="48"
                    change="+2"
                    icon={Share2}
                    trend="up"
                  />
                  <StatCard
                    title="Taux de Succès"
                    value="99.2%"
                    change="+0.4%"
                    icon={Zap}
                    trend="up"
                  />
                </div>

                <MainChart />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="p-6 rounded-3xl bg-card border border-white/10 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                      <Phone className="h-16 w-16 text-white" />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60 mb-2">WhatsApp Automation</h3>
                      <h2 className="text-xl font-black text-white italic tracking-tighter uppercase mb-4">Gérer vos Instances</h2>
                      <Button variant="outline" className="h-10 px-6 rounded-xl border-white/20 bg-white/5 font-black uppercase text-[9px] tracking-widest text-white hover:bg-white/10">
                        Lancer le Scanner <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -5 }}
                    className="p-6 rounded-3xl bg-card border border-white/10 relative overflow-hidden flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60 mb-2">Santé du Serveur</h3>
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                        <span className="text-xl font-black text-white italic tracking-tighter uppercase">Optimisé</span>
                      </div>
                      <p className="text-[9px] text-muted-foreground font-medium mt-1.5 opacity-70 uppercase tracking-widest">Latency: 24ms</p>
                    </div>
                    <div className="h-14 w-14 rounded-full border-4 border-emerald-500/10 border-t-emerald-500 animate-spin flex items-center justify-center">
                      <span className="text-[9px] font-black text-white uppercase italic">CPU</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="space-y-8">
                <RecentActivity />
              </div>
            </div>

            <div className="h-20" />
          </div>
        </div>
      </main>
    </div>
  );
}
