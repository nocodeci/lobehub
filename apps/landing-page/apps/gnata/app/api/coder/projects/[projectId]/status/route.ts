import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { projectId: string } }
) {
    try {
        const { projectId } = params;
        const body = await request.json();
        const { status, previewUrl, deployUrl } = body;

        // Validation
        if (!projectId) {
            return NextResponse.json({ success: false, error: 'Project ID is required' }, { status: 400 });
        }

        // Check if project exists
        const project = await prisma.gnataProject.findUnique({
            where: { id: projectId },
        });

        if (!project) {
            return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
        }

        // Prepare update data
        const updateData: any = {};
        if (status) updateData.status = status;
        if (previewUrl) updateData.previewUrl = previewUrl;
        if (deployUrl) updateData.deployUrl = deployUrl;

        // If marking as complete (by admin, but we'll put it here for now or separate it later)
        if (status === 'COMPLETED') {
            updateData.completedAt = new Date();

            // If it has a coder, update their stats
            if (project.coderId) {
                await prisma.vibeCoder.update({
                    where: { id: project.coderId },
                    data: {
                        status: 'online', // Back to online after being busy
                        totalProjects: { increment: 1 }
                    }
                });

                // Create earning record
                await prisma.coderEarning.create({
                    data: {
                        coderId: project.coderId,
                        projectRef: project.reference,
                        amount: project.commission || project.price * 0.30,
                        status: 'pending'
                    }
                });
            }
        }

        const updatedProject = await prisma.gnataProject.update({
            where: { id: projectId },
            data: updateData,
        });

        return NextResponse.json({
            success: true,
            project: updatedProject,
            message: `Project status updated to ${status}`,
        });
    } catch (error: any) {
        console.error('Error updating project status:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
