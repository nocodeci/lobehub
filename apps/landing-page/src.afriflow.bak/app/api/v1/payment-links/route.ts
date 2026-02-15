import { NextResponse } from 'next/server';
import prisma from "@/lib/db";

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        const apiKeyHeader = req.headers.get('x-api-key');

        // Support both Bearer token and x-api-key
        let secretKey = '';
        if (authHeader && authHeader.startsWith('Bearer ')) {
            secretKey = authHeader.split(' ')[1];
        } else if (apiKeyHeader) {
            secretKey = apiKeyHeader;
        }

        if (!secretKey) {
            return NextResponse.json({ error: 'Missing Authorization header' }, { status: 401 });
        }

        // Validate Key
        const config = await prisma.apiConfig.findFirst({
            where: { secretKey },
            include: { application: true }
        });

        if (!config || !config.applicationId) {
            return NextResponse.json({ error: 'Invalid API Key' }, { status: 401 });
        }

        const body = await req.json();
        const { title, description, amount, currency = "XOF", metadata } = body;

        if (!title || !amount) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const slug = Math.random().toString(36).substring(2, 10);

        const paymentLink = await prisma.paymentLink.create({
            data: {
                applicationId: config.applicationId,
                title,
                description,
                amount: parseFloat(amount),
                currency,
                slug,
                status: "active",
                requestPhone: true, // Force phone collection for Mobile Money
                allowQuantity: false
            }
        });

        // Construct full URL for production/local
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const url = `${baseUrl}/pay/${slug}`;

        return NextResponse.json({
            success: true,
            id: paymentLink.id,
            url,
            slug,
            amount: paymentLink.amount,
            currency: paymentLink.currency
        });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
