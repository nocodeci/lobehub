import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/coder/stats - Get coder statistics
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const coderId = searchParams.get('coderId');

        if (!coderId) {
            return NextResponse.json(
                { success: false, error: 'coderId is required' },
                { status: 400 }
            );
        }

        // Get coder info
        const coder = await prisma.vibeCoder.findUnique({
            where: { id: coderId },
            include: {
                earnings: true,
                projects: true,
            },
        });

        if (!coder) {
            return NextResponse.json(
                { success: false, error: 'Coder not found' },
                { status: 404 }
            );
        }

        // Calculate stats
        const pendingProjects = await prisma.gnataProject.count({
            where: { status: 'PAID', coderId: null },
        });

        const buildingProjects = coder.projects.filter(p => p.status === 'BUILDING').length;
        const completedProjects = coder.projects.filter(p => p.status === 'COMPLETED').length;

        const totalEarnings = coder.earnings.reduce((sum, e) => sum + e.amount, 0);
        const pendingEarnings = coder.earnings
            .filter(e => e.status === 'pending')
            .reduce((sum, e) => sum + e.amount, 0);
        const paidEarnings = coder.earnings
            .filter(e => e.status === 'paid')
            .reduce((sum, e) => sum + e.amount, 0);

        // Get this month's stats
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const thisMonthProjects = coder.projects.filter(
            p => p.completedAt && p.completedAt >= startOfMonth
        ).length;

        const thisMonthEarnings = coder.earnings
            .filter(e => e.createdAt >= startOfMonth)
            .reduce((sum, e) => sum + e.amount, 0);

        // Format average build time
        const avgMinutes = coder.avgBuildTime;
        const avgHours = Math.floor(avgMinutes / 60);
        const avgMins = avgMinutes % 60;
        const avgBuildTimeFormatted = `${avgHours}h${avgMins > 0 ? avgMins : ''}`;

        return NextResponse.json({
            success: true,
            coder: {
                id: coder.id,
                coderNumber: coder.coderNumber,
                name: coder.name,
                email: coder.email,
                level: coder.level,
                rating: coder.rating,
                status: coder.status,
                specialty: coder.specialty,
            },
            stats: {
                pendingProjects,
                buildingProjects,
                completedProjects,
                totalProjects: coder.totalProjects,
                avgBuildTime: avgBuildTimeFormatted,
                rating: coder.rating,
            },
            earnings: {
                total: totalEarnings,
                pending: pendingEarnings,
                paid: paidEarnings,
                thisMonth: thisMonthEarnings,
            },
            performance: {
                thisMonthProjects,
                thisMonthEarnings,
                rank: 3, // Mock - would calculate from all coders
                totalCoders: 25, // Mock
            },
        });
    } catch (error: any) {
        console.error('Error fetching coder stats:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
