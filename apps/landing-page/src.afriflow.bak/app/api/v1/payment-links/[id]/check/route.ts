import { NextResponse } from 'next/server';
import prisma from "@/lib/db";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const authHeader = req.headers.get('authorization');
        const apiKeyHeader = req.headers.get('x-api-key');

        let secretKey = '';
        if (authHeader && authHeader.startsWith('Bearer ')) {
            secretKey = authHeader.split(' ')[1];
        } else if (apiKeyHeader) {
            secretKey = apiKeyHeader;
        }

        if (!secretKey) {
            return NextResponse.json({ error: 'Missing Authorization' }, { status: 401 });
        }

        const config = await prisma.apiConfig.findFirst({
            where: { secretKey },
            include: { application: true }
        });

        if (!config || !config.applicationId) {
            return NextResponse.json({ error: 'Invalid API Key' }, { status: 401 });
        }

        // --- VIP SIMULATION LOGIC ---
        // Fetch the payment link to identify the user
        const paymentLink = await prisma.paymentLink.findUnique({
            where: { id },
            include: {
                application: {
                    include: {
                        user: true
                    }
                }
            }
        });

        const vipEmails = [
            "yohankoffik225@gmail.com",
            "yohankoffik@gmail.com",
            "koffiyohaneric225@gmail.com"
        ];

        if (paymentLink && (
            vipEmails.includes(paymentLink.application?.user?.email || "") ||
            paymentLink.applicationId === 'cmkki1url0000vxi8j8bjjgnl' // Allow Gnata App ID (Demo)
        )) {
            console.log("🌟 VIP/Demo Simulation triggered for:", paymentLink.application?.user?.email);
            return NextResponse.json({
                success: true,
                paid: true,
                status: 'SUCCESS',
                transaction: {
                    id: `sim_vip_${Math.random().toString(36).substring(7)}`,
                    amount: paymentLink.amount,
                    customerName: "Simulation VIP",
                    customerEmail: paymentLink.application?.user?.email || "vip@demo.com"
                }
            });
        }
        // -----------------------------

        // Original logic for non-VIP
        const successRecord = await prisma.paymentRecord.findFirst({
            where: {
                applicationId: config.applicationId,
                status: 'SUCCESS',
                metadata: {
                    path: ['paymentLinkId'],
                    equals: id
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        if (successRecord) {
            return NextResponse.json({
                success: true,
                paid: true,
                status: 'SUCCESS',
                transaction: {
                    id: successRecord.id,
                    amount: successRecord.amount,
                    customerName: successRecord.customerName,
                    customerEmail: successRecord.customerEmail
                }
            });
        }

        const pendingRecord = await prisma.paymentRecord.findFirst({
            where: {
                applicationId: config.applicationId,
                status: { not: 'FAILED' },
                metadata: {
                    path: ['paymentLinkId'],
                    equals: id
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            success: true,
            paid: false,
            status: pendingRecord ? pendingRecord.status : 'WAITING'
        });

    } catch (error) {
        console.error("Check Status Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
