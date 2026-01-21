import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/admin/coders - Get all Vibe Coders
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get('status');

        const where: any = {};
        if (status) {
            where.status = status;
        }

        const coders = await prisma.vibeCoder.findMany({
            where,
            orderBy: { totalProjects: 'desc' },
            include: {
                _count: {
                    select: {
                        projects: true,
                        earnings: true,
                    },
                },
            },
        });

        // Calculate total earnings for each coder
        const codersWithEarnings = await Promise.all(
            coders.map(async (coder) => {
                const earnings = await prisma.coderEarning.aggregate({
                    where: { coderId: coder.id },
                    _sum: { amount: true },
                });

                const pendingEarnings = await prisma.coderEarning.aggregate({
                    where: { coderId: coder.id, status: 'pending' },
                    _sum: { amount: true },
                });

                return {
                    id: coder.id,
                    coderNumber: coder.coderNumber,
                    name: coder.name,
                    email: coder.email,
                    phone: coder.phone,
                    level: coder.level,
                    rating: coder.rating,
                    status: coder.status,
                    specialty: coder.specialty,
                    totalProjects: coder.totalProjects,
                    avgBuildTime: coder.avgBuildTime,
                    commission: coder.commission,
                    paymentMethod: coder.paymentMethod,
                    paymentPhone: coder.paymentPhone,
                    totalEarnings: earnings._sum.amount || 0,
                    pendingEarnings: pendingEarnings._sum.amount || 0,
                    createdAt: coder.createdAt,
                };
            })
        );

        // Stats
        const stats = {
            total: coders.length,
            online: coders.filter(c => c.status === 'online').length,
            busy: coders.filter(c => c.status === 'busy').length,
            offline: coders.filter(c => c.status === 'offline').length,
        };

        return NextResponse.json({
            success: true,
            coders: codersWithEarnings,
            stats,
        });
    } catch (error: any) {
        console.error('Error fetching coders:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
