import { NextRequest, NextResponse } from 'next/server';

/**
 * AfriFlow Payment API - Verify Payment
 * GET /api/afriflow/verify?paymentId=xxx
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const paymentId = searchParams.get('paymentId');

        if (!paymentId) {
            return NextResponse.json(
                { error: 'Payment ID is required' },
                { status: 400 }
            );
        }

        const apiUrl = process.env.AFRIFLOW_API_URL || 'http://localhost:3000/api';
        const secretKey = process.env.AFRIFLOW_SECRET_KEY;

        if (!secretKey) {
            return NextResponse.json(
                { error: 'AfriFlow not configured' },
                { status: 500 }
            );
        }

        const res = await fetch(`${apiUrl}/v1/payment-links/${paymentId}/check`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${secretKey}`
            }
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { error: data.error || 'Failed to verify payment' },
                { status: res.status }
            );
        }

        return NextResponse.json({
            success: true,
            paid: data.status === 'SUCCESS' || data.paid === true,
            status: data.status,
            amount: data.amount,
            currency: data.currency,
            title: data.title,
            metadata: data.metadata
        });

    } catch (error: any) {
        console.error('AfriFlow verify error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
