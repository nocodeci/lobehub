import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { projectId: string } }
) {
    try {
        const { projectId } = params;
        const body = await request.json();
        const { status } = body;

        if (!projectId) {
            return NextResponse.json({ success: false, error: 'Project ID is required' }, { status: 400 });
        }

        const project = await prisma.gnataProject.findUnique({
            where: { id: projectId },
            include: { coder: true }
        });

        if (!project) {
            return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
        }

        const updateData: any = { status };

        if (status === 'COMPLETED') {
            updateData.completedAt = new Date();
            updateData.deliveredAt = new Date();

            // Update coder status back to online and increment projects
            if (project.coderId) {
                await prisma.vibeCoder.update({
                    where: { id: project.coderId },
                    data: {
                        status: 'online',
                        totalProjects: { increment: 1 }
                    }
                });

                // Create or update earning record
                const commission = project.commission || project.price * 0.30;
                await prisma.coderEarning.create({
                    data: {
                        coderId: project.coderId,
                        projectRef: project.reference,
                        amount: commission,
                        status: 'pending'
                    }
                });
            }
        }

        const updatedProject = await prisma.gnataProject.update({
            where: { id: projectId },
            data: updateData,
            include: {
                coder: {
                    select: {
                        id: true,
                        name: true,
                        coderNumber: true,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            project: updatedProject,
            message: `Project status updated to ${status}`
        });
    } catch (error: any) {
        console.error('Error updating project:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
