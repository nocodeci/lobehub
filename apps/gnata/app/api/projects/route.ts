import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Generate unique reference
function generateReference(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 9000) + 1000;
    return `GNATA-${year}-${random}`;
}

// POST /api/projects - Create a new website project (after payment)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            name,
            description,
            type,
            priority,
            requirements,
            colors,
            clientName,
            clientEmail,
            clientPhone,
            price,
            paymentRef,
        } = body;

        // Validate required fields
        if (!name || !clientName || !clientEmail) {
            return NextResponse.json(
                { success: false, error: 'name, clientName, and clientEmail are required' },
                { status: 400 }
            );
        }

        // Generate unique reference
        let reference = generateReference();
        let attempts = 0;
        while (attempts < 10) {
            const existing = await prisma.gnataProject.findUnique({
                where: { reference },
            });
            if (!existing) break;
            reference = generateReference();
            attempts++;
        }

        // Create the project
        const project = await prisma.gnataProject.create({
            data: {
                reference,
                name,
                description: description || '',
                type: (type || 'CUSTOM').toUpperCase(),
                priority: (priority || 'NORMAL').toUpperCase(),
                requirements: requirements || [],
                colors: colors || { primary: '#8B5CF6', secondary: '#3B82F6' },
                clientName,
                clientEmail,
                clientPhone,
                price: price || 30000,
                status: paymentRef ? 'PAID' : 'PENDING',
                estimatedTime: getEstimatedTime(type),
            },
        });

        // If payment reference provided, create payment record
        if (paymentRef) {
            await prisma.gnataPayment.create({
                data: {
                    reference: `PAY-${reference}`,
                    amount: price || 30000,
                    status: 'SUCCESS',
                    provider: 'moneroo',
                    providerRef: paymentRef,
                    clientName,
                    clientEmail,
                    clientPhone,
                    completedAt: new Date(),
                },
            });
        }

        return NextResponse.json({
            success: true,
            project: {
                id: project.id,
                reference: project.reference,
                name: project.name,
                status: project.status,
            },
            message: 'Project created successfully',
        });
    } catch (error: any) {
        console.error('Error creating project:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// GET /api/projects - Get all projects (for admin dashboard)
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get('status');
        const limit = parseInt(searchParams.get('limit') || '50');

        const where: any = {};
        if (status) {
            where.status = status.toUpperCase();
        }

        const projects = await prisma.gnataProject.findMany({
            where,
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
        });

        // Get stats
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
        });
    } catch (error: any) {
        console.error('Error fetching projects:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

function getEstimatedTime(type: string): number {
    const times: Record<string, number> = {
        ECOMMERCE: 180, // 3 hours
        PORTFOLIO: 90,  // 1.5 hours
        RESTAURANT: 120, // 2 hours
        BLOG: 75,       // 1h15
        LANDING: 60,    // 1 hour
        CUSTOM: 120,    // 2 hours default
    };
    return times[(type || 'CUSTOM').toUpperCase()] || 120;
}
