import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/admin/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
    try {
        // Get date ranges
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // User stats
        const totalUsers = await prisma.user.count();
        const usersThisMonth = await prisma.user.count({
            where: { createdAt: { gte: startOfMonth } },
        });
        const usersLastMonth = await prisma.user.count({
            where: {
                createdAt: { gte: startOfLastMonth, lt: startOfMonth },
            },
        });
        const userGrowth = usersLastMonth > 0
            ? ((usersThisMonth - usersLastMonth) / usersLastMonth * 100).toFixed(1)
            : 0;

        // Payment stats
        const successfulPayments = await prisma.paymentRecord.findMany({
            where: { status: 'SUCCESS' },
        });
        const totalRevenue = successfulPayments.reduce((sum, p) => sum + p.amount, 0);

        const paymentsThisMonth = await prisma.paymentRecord.findMany({
            where: {
                status: 'SUCCESS',
                createdAt: { gte: startOfMonth },
            },
        });
        const revenueThisMonth = paymentsThisMonth.reduce((sum, p) => sum + p.amount, 0);

        const paymentsLastMonth = await prisma.paymentRecord.findMany({
            where: {
                status: 'SUCCESS',
                createdAt: { gte: startOfLastMonth, lt: startOfMonth },
            },
        });
        const revenueLastMonth = paymentsLastMonth.reduce((sum, p) => sum + p.amount, 0);
        const revenueGrowth = revenueLastMonth > 0
            ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth * 100).toFixed(1)
            : 0;

        // Transaction stats
        const totalTransactions = await prisma.paymentRecord.count();
        const successfulTransactions = await prisma.paymentRecord.count({
            where: { status: 'SUCCESS' },
        });
        const transactionsToday = await prisma.paymentRecord.count({
            where: { createdAt: { gte: startOfToday } },
        });

        // Gnata project stats
        const gnataProjects = {
            total: await prisma.gnataProject.count(),
            pending: await prisma.gnataProject.count({ where: { status: 'PENDING' } }),
            paid: await prisma.gnataProject.count({ where: { status: 'PAID' } }),
            building: await prisma.gnataProject.count({ where: { status: 'BUILDING' } }),
            completed: await prisma.gnataProject.count({ where: { status: 'COMPLETED' } }),
        };

        // Vibe Coder stats
        const vibeCoders = {
            total: await prisma.vibeCoder.count(),
            online: await prisma.vibeCoder.count({ where: { status: 'online' } }),
            busy: await prisma.vibeCoder.count({ where: { status: 'busy' } }),
        };

        // Recent activity
        const recentPayments = await prisma.paymentRecord.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                orderId: true,
                amount: true,
                status: true,
                customerName: true,
                provider: true,
                createdAt: true,
            },
        });

        const recentProjects = await prisma.gnataProject.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                reference: true,
                name: true,
                status: true,
                clientName: true,
                createdAt: true,
            },
        });

        return NextResponse.json({
            success: true,
            stats: {
                users: {
                    total: totalUsers,
                    thisMonth: usersThisMonth,
                    growth: parseFloat(userGrowth as string),
                },
                revenue: {
                    total: totalRevenue,
                    thisMonth: revenueThisMonth,
                    growth: parseFloat(revenueGrowth as string),
                },
                transactions: {
                    total: totalTransactions,
                    successful: successfulTransactions,
                    today: transactionsToday,
                    successRate: totalTransactions > 0
                        ? ((successfulTransactions / totalTransactions) * 100).toFixed(1)
                        : 100,
                },
                gnataProjects,
                vibeCoders,
            },
            recentActivity: {
                payments: recentPayments,
                projects: recentProjects,
            },
        });
    } catch (error: any) {
        console.error('Error fetching admin stats:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
