import { NextRequest, NextResponse } from 'next/server';
import { PaymentOrchestratorFactory } from '@/lib/orchestrator/factory';
import prisma from '@/lib/db';

/**
 * Example: Initiate payment with PayDunya
 * POST /api/examples/paydunya-payment
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { amount, customerName, customerEmail, customerPhone, orderId } = body;

        // Validate input
        if (!amount || !customerEmail || !orderId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get PayDunya provider instance
        const paydunya = PaymentOrchestratorFactory.getProvider('paydunya', {
            masterKey: process.env.PAYDUNYA_MASTER_KEY!,
            privateKey: process.env.PAYDUNYA_PRIVATE_KEY!,
            publicKey: process.env.PAYDUNYA_PUBLIC_KEY!,
            token: process.env.PAYDUNYA_TOKEN!,
            mode: process.env.NODE_ENV === 'production' ? 'live' : 'test',
            storeId: 'AfriFlow Store',
        });

        // Prepare payment request
        const paymentRequest = {
            amount: parseFloat(amount),
            currency: 'XOF',
            customerName: customerName || 'Guest',
            customerEmail,
            customerPhone,
            orderId,
            callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/paydunya`,
            returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?order=${orderId}`,
            metadata: {
                source: 'AfriFlow Dashboard',
                timestamp: new Date().toISOString(),
            },
        };

        // Initiate payment
        const response = await paydunya.initiatePayment(paymentRequest);

        // Save transaction to database
        const transaction = await prisma.paymentRecord.create({
            data: {
                orderId,
                provider: 'paydunya',
                amount: paymentRequest.amount,
                currency: paymentRequest.currency,
                status: response.status as any,
                providerRef: response.providerReference,
                customerEmail,
                customerName: customerName || 'Guest',
                paymentType: 'MOBILE_MONEY',
                customerPhone: customerPhone || null,
                metadata: paymentRequest.metadata as any,
            },
        });

        // Log provider response
        await prisma.providerLog.create({
            data: {
                transactionId: transaction.id,
                type: 'INITIATE_PAYMENT',
                payload: {
                    request: paymentRequest,
                    response: response.rawData,
                    statusCode: response.status === 'PENDING' ? 200 : 400,
                } as any,
            },
        });

        if (response.status === 'PENDING' && response.checkoutUrl) {
            return NextResponse.json({
                success: true,
                transactionId: response.transactionId,
                checkoutUrl: response.checkoutUrl,
                message: 'Payment initiated successfully. Redirect customer to checkout URL.',
            });
        } else {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Failed to initiate payment',
                    error: response.rawData,
                },
                { status: 400 }
            );
        }
    } catch (error: any) {
        console.error('PayDunya payment error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}

/**
 * Example: Verify payment status
 * GET /api/examples/paydunya-payment?transactionId=xxx
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const transactionId = searchParams.get('transactionId');

        if (!transactionId) {
            return NextResponse.json(
                { error: 'Transaction ID is required' },
                { status: 400 }
            );
        }

        // Get PayDunya provider instance
        const paydunya = PaymentOrchestratorFactory.getProvider('paydunya', {
            masterKey: process.env.PAYDUNYA_MASTER_KEY!,
            privateKey: process.env.PAYDUNYA_PRIVATE_KEY!,
            publicKey: process.env.PAYDUNYA_PUBLIC_KEY!,
            token: process.env.PAYDUNYA_TOKEN!,
            mode: process.env.NODE_ENV === 'production' ? 'live' : 'test',
        });

        // Verify payment
        const verification = await paydunya.verifyPayment(transactionId);

        // Update transaction in database
        const transactionResult = await prisma.paymentRecord.updateMany({
            where: {
                providerRef: transactionId,
            },
            data: {
                status: verification.status as any,
                updatedAt: new Date(),
            },
        });

        // Log verification
        await prisma.providerLog.create({
            data: {
                transactionId: transactionResult.count > 0 ? transactionId : 'unknown',
                type: 'VERIFY_PAYMENT',
                payload: {
                    request: { transactionId },
                    response: verification.rawData,
                    statusCode: 200,
                } as any,
            },
        });

        return NextResponse.json({
            success: verification.status === 'SUCCESS',
            status: verification.status,
            transactionId: verification.transactionId,
            providerReference: verification.providerReference,
            message: verification.status === 'SUCCESS'
                ? 'Payment confirmed'
                : `Payment status: ${verification.status}`,
        });
    } catch (error: any) {
        console.error('PayDunya verification error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
