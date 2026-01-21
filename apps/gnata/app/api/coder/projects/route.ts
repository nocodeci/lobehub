import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/coder/projects - Get projects assigned to the coder (for their dashboard)
// Admin uses a separate endpoint to manage all projects
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const coderId = searchParams.get('coderId');
        const status = searchParams.get('status');

        // If coderId is provided, return projects for that coder
        if (coderId) {
            const where: any = { coderId };
            if (status) {
                where.status = status.toUpperCase();
            }

            const projects = await prisma.gnataProject.findMany({
                where,
                orderBy: [
                    { startedAt: 'desc' },
                ],
            });

            const formattedProjects = projects.map(project => ({
                id: project.id,
                reference: project.reference,
                name: project.name,
                description: project.description,
                type: project.type.toLowerCase(),
                priority: project.priority.toLowerCase(),
                requirements: project.requirements,
                colors: project.colors,
                client: {
                    name: project.clientName,
                    email: project.clientEmail,
                    phone: project.clientPhone,
                },
                price: project.price,
                commission: project.commission || project.price * 0.30,
                estimatedTime: `${Math.floor(project.estimatedTime / 60)}h${project.estimatedTime % 60 > 0 ? project.estimatedTime % 60 : ''}`,
                startedAt: project.startedAt,
                completedAt: project.completedAt,
                status: project.status,
                deployUrl: project.deployUrl,
                previewUrl: project.previewUrl,
            }));

            // Calculate stats
            const allProjects = await prisma.gnataProject.findMany({ where: { coderId } });
            const stats = {
                building: allProjects.filter(p => p.status === 'BUILDING').length,
                review: allProjects.filter(p => p.status === 'REVIEW').length,
                completed: allProjects.filter(p => p.status === 'COMPLETED').length,
                totalCommission: allProjects
                    .filter(p => p.status === 'COMPLETED')
                    .reduce((sum, p) => sum + (p.commission || 0), 0),
            };

            return NextResponse.json({
                success: true,
                projects: formattedProjects,
                stats,
                count: formattedProjects.length,
            });
        }

        // If no coderId, this is likely for showing pending count in sidebar
        // Return count of PAID projects waiting to be assigned (for informational purposes)
        const paidCount = await prisma.gnataProject.count({
            where: { status: 'PAID', coderId: null },
        });

        return NextResponse.json({
            success: true,
            projects: [],
            count: paidCount,
            message: 'Provide coderId to get your projects',
        });
    } catch (error: any) {
        console.error('Error fetching projects:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
