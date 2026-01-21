import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST /api/admin/projects/assign - Assign a project to a Vibe Coder
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { projectId, coderId } = body;

        if (!projectId || !coderId) {
            return NextResponse.json(
                { success: false, error: 'projectId and coderId are required' },
                { status: 400 }
            );
        }

        // Get the project
        const project = await prisma.gnataProject.findUnique({
            where: { id: projectId },
        });

        if (!project) {
            return NextResponse.json(
                { success: false, error: 'Project not found' },
                { status: 404 }
            );
        }

        if (project.coderId) {
            return NextResponse.json(
                { success: false, error: 'Project is already assigned' },
                { status: 400 }
            );
        }

        // Get the coder
        const coder = await prisma.vibeCoder.findUnique({
            where: { id: coderId },
        });

        if (!coder) {
            return NextResponse.json(
                { success: false, error: 'Coder not found' },
                { status: 404 }
            );
        }

        // Calculate commission (30%)
        const commission = Math.floor(project.price * 0.3);

        // Update project
        const updatedProject = await prisma.gnataProject.update({
            where: { id: projectId },
            data: {
                coderId,
                status: 'BUILDING',
                commission,
                startedAt: new Date(),
            },
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

        // Update coder status to busy
        await prisma.vibeCoder.update({
            where: { id: coderId },
            data: { status: 'busy' },
        });

        return NextResponse.json({
            success: true,
            project: updatedProject,
            message: `Project assigned to ${coder.name}`,
        });
    } catch (error: any) {
        console.error('Error assigning project:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
