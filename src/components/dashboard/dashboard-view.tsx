"use client";

import { motion } from "framer-motion";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { TransactionList } from "@/components/dashboard/transaction-list";
import { GatewayList } from "@/components/dashboard/gateway-list";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export function DashboardView() {
    return (
        <div className="flex flex-col gap-10 pb-10">
            {/* Header */}
            <DashboardHeader />

            {/* Main Content with Staggered Entry */}
            <div className="space-y-10">
                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <StatsCards />
                </motion.div>

                {/* Analytical Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <motion.div
                        className="lg:col-span-4 h-full"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <OverviewChart />
                    </motion.div>

                    <motion.div
                        className="lg:col-span-3 h-full"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <TransactionList />
                    </motion.div>
                </div>

                {/* Gateways Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <GatewayList />
                </motion.div>
            </div>

            {/* Decorative Background Elements */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] bg-gradient-to-b from-primary/5 to-transparent blur-[120px] rounded-full opacity-50" />
                <div className="absolute bottom-0 left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[150px] rounded-full opacity-30" />
            </div>
        </div>
    );
}
