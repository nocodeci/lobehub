import { NextRequest, NextResponse } from 'next/server';

/**
 * AfriFlow Payment API - Create Payment Link
 * POST /api/afriflow/create-link
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, amount, description, customerId, metadata } = body;

        // Validate required fields
        if (!title || !amount) {
            return NextResponse.json(
                { error: 'Title and amount are required' },
                { status: 400 }
            );
        }

        const apiUrl = process.env.AFRIFLOW_API_URL || 'http://localhost:3000/api';
        const secretKey = process.env.AFRIFLOW_SECRET_KEY;
        const appId = process.env.AFRIFLOW_APP_ID;

        if (!secretKey || !appId) {
            return NextResponse.json(
                { error: 'AfriFlow not configured' },
                { status: 500 }
            );
        }

        const payload = {
            applicationId: appId,
            title,
            description: description || `Payment for ${title}`,
            amount: parseFloat(amount.toString()),
            currency: "XOF",
            type: "one_time",
            customerId,
            metadata: {
                ...metadata,
                source: "Account Portal"
            }
        };

        const res = await fetch(`${apiUrl}/v1/payment-links`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${secretKey}`
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { error: data.error || 'Failed to create payment link' },
                { status: res.status }
            );
        }

        return NextResponse.json({
            success: true,
            paymentUrl: data.url,
            paymentId: data.id,
            amount: data.amount,
            currency: data.currency
        });

    } catch (error: any) {
        console.error('AfriFlow create-link error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
