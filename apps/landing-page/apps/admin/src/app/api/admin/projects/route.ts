import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/admin/projects - Get all Gnata projects
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        const where: any = {};
        if (status) {
            where.status = status.toUpperCase();
        }

        const [projects, total] = await Promise.all([
            prisma.gnataProject.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    coder: {
                        select: {
                            id: true,
                            name: true,
                            coderNumber: true,
                        },
                    },
                },
            }),
            prisma.gnataProject.count({ where }),
        ]);

        // Stats
        const stats = {
            total: await prisma.gnataProject.count(),
            pending: await prisma.gnataProject.count({ where: { status: 'PENDING' } }),
            paid: await prisma.gnataProject.count({ where: { status: 'PAID' } }),
            building: await prisma.gnataProject.count({ where: { status: 'BUILDING' } }),
            review: await prisma.gnataProject.count({ where: { status: 'REVIEW' } }),
            completed: await prisma.gnataProject.count({ where: { status: 'COMPLETED' } }),
        };

        return NextResponse.json({
            success: true,
            projects,
            stats,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error: any) {
        console.error('Error fetching projects:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST /api/admin/projects - Create a project (admin can create manually)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            name,
            description,
            type,
            priority,
            requirements,
            clientName,
            clientEmail,
            clientPhone,
            price,
            status,
        } = body;

        // Generate reference
        const year = new Date().getFullYear();
        const count = await prisma.gnataProject.count();
        const reference = `GNATA-${year}-${String(count + 1).padStart(4, '0')}`;

        const project = await prisma.gnataProject.create({
            data: {
                reference,
                name,
                description,
                type: (type || 'CUSTOM').toUpperCase(),
                priority: (priority || 'NORMAL').toUpperCase(),
                requirements: requirements || [],
                clientName,
                clientEmail,
                clientPhone,
                price: price || 30000,
                status: (status || 'PAID').toUpperCase(),
            },
        });

        return NextResponse.json({
            success: true,
            project,
        });
    } catch (error: any) {
        console.error('Error creating project:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
