"use server";

import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSelectedAppId } from "./utils";

export async function getDashboardStats() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return null;

        const appId = await getSelectedAppId();
        if (!appId) return null;

        // Get total volume from successful payments
        const totalVolume = await prisma.paymentRecord.aggregate({
            where: { applicationId: appId, status: 'SUCCESS' },
            _sum: { amount: true }
        });

        // Get total successful transactions count
        const successfulTxCount = await prisma.paymentRecord.count({
            where: { applicationId: appId, status: 'SUCCESS' }
        });

        // Get total transactions count for conversion rate
        const totalTxCount = await prisma.paymentRecord.count({
            where: { applicationId: appId }
        });

        // Get active gateways count
        const activeGateways = await prisma.gateway.count({
            where: { applicationId: appId, status: 'active' }
        });

        const totalGateways = await prisma.gateway.count({
            where: { applicationId: appId }
        });

        const conversionRate = totalTxCount > 0
            ? ((successfulTxCount / totalTxCount) * 100).toFixed(1)
            : "0.0";

        return {
            totalVolume: totalVolume._sum.amount || 0,
            successfulTxCount,
            conversionRate,
            activeGateways,
            totalGateways,
            totalTxCount
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return null;
    }
}

export async function getRecentTransactions(limit = 5) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return [];

        const appId = await getSelectedAppId();
        if (!appId) return [];

        const transactions = await prisma.paymentRecord.findMany({
            where: { applicationId: appId },
            orderBy: { createdAt: 'desc' },
            take: limit
        });

        return transactions;
    } catch (error) {
        console.error("Error fetching recent transactions:", error);
        return [];
    }
}

export async function getWeeklyVolume() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return [];

        const appId = await getSelectedAppId();
        if (!appId) return [];

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const volumeData = await Promise.all(days.map(async (day, index) => {
            const dayStart = new Date(startOfWeek);
            dayStart.setDate(startOfWeek.getDate() + index);

            const dayEnd = new Date(dayStart);
            dayEnd.setHours(23, 59, 59, 999);

            const dayVolume = await prisma.paymentRecord.aggregate({
                where: {
                    applicationId: appId,
                    status: 'SUCCESS',
                    createdAt: {
                        gte: dayStart,
                        lte: dayEnd
                    }
                },
                _sum: { amount: true }
            });

            return {
                name: day,
                total: dayVolume._sum.amount || 0
            };
        }));

        return volumeData;
    } catch (error) {
        console.error("Error fetching weekly volume:", error);
        return [];
    }
}
