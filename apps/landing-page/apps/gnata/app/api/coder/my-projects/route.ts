import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/coder/my-projects - Get coder's assigned projects
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const coderId = searchParams.get('coderId');
        const status = searchParams.get('status'); // building, review, completed

        if (!coderId) {
            return NextResponse.json(
                { success: false, error: 'coderId is required' },
                { status: 400 }
            );
        }

        const where: any = {
            coderId: coderId,
        };

        if (status) {
            where.status = status.toUpperCase();
        }

        const projects = await prisma.gnataProject.findMany({
            where,
            orderBy: { updatedAt: 'desc' },
            include: {
                payment: true,
            },
        });

        // Calculate progress for building projects
        const formattedProjects = projects.map(project => {
            let progress = 0;
            if (project.status === 'BUILDING' && project.startedAt) {
                const elapsed = Date.now() - project.startedAt.getTime();
                const estimatedMs = project.estimatedTime * 60 * 1000;
                progress = Math.min(Math.floor((elapsed / estimatedMs) * 100), 99);
            } else if (project.status === 'REVIEW' || project.status === 'COMPLETED') {
                progress = 100;
            }

            return {
                id: project.id,
                reference: project.reference,
                name: project.name,
                description: project.description,
                type: project.type.toLowerCase(),
                client: {
                    name: project.clientName,
                    email: project.clientEmail,
                },
                status: project.status.toLowerCase(),
                progress,
                price: project.price,
                commission: project.commission || project.price * 0.30,
                estimatedTime: project.estimatedTime,
                startedAt: project.startedAt,
                completedAt: project.completedAt,
                deployUrl: project.deployUrl,
                previewUrl: project.previewUrl,
            };
        });

        // Calculate stats
        const stats = {
            building: formattedProjects.filter(p => p.status === 'building').length,
            review: formattedProjects.filter(p => p.status === 'review').length,
            completed: formattedProjects.filter(p => p.status === 'completed').length,
            totalCommission: formattedProjects
                .filter(p => p.status === 'completed')
                .reduce((sum, p) => sum + p.commission, 0),
        };

        return NextResponse.json({
            success: true,
            projects: formattedProjects,
            stats,
        });
    } catch (error: any) {
        console.error('Error fetching my projects:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// PATCH /api/coder/my-projects - Update project status
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { projectId, status, deployUrl, previewUrl } = body;

        if (!projectId || !status) {
            return NextResponse.json(
                { success: false, error: 'projectId and status are required' },
                { status: 400 }
            );
        }

        const updateData: any = {
            status: status.toUpperCase(),
        };

        if (deployUrl) updateData.deployUrl = deployUrl;
        if (previewUrl) updateData.previewUrl = previewUrl;

        if (status.toUpperCase() === 'REVIEW' || status.toUpperCase() === 'COMPLETED') {
            updateData.completedAt = new Date();

            // Calculate actual build time
            const project = await prisma.gnataProject.findUnique({
                where: { id: projectId },
            });

            if (project?.startedAt) {
                updateData.actualTime = Math.floor(
                    (Date.now() - project.startedAt.getTime()) / 60000
                );
            }
        }

        const updatedProject = await prisma.gnataProject.update({
            where: { id: projectId },
            data: updateData,
        });

        // If completed, update coder stats and create earning
        if (status.toUpperCase() === 'COMPLETED') {
            await prisma.vibeCoder.update({
                where: { id: updatedProject.coderId! },
                data: {
                    totalProjects: { increment: 1 },
                    status: 'online',
                },
            });

            // Create earning record
            await prisma.coderEarning.create({
                data: {
                    coderId: updatedProject.coderId!,
                    projectRef: updatedProject.reference,
                    amount: updatedProject.commission || updatedProject.price * 0.30,
                    status: 'pending',
                },
            });
        }

        return NextResponse.json({
            success: true,
            project: updatedProject,
        });
    } catch (error: any) {
        console.error('Error updating project:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
