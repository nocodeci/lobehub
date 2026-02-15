import { NextRequest, NextResponse } from 'next/server';

/**
 * AfriFlow Webhook Handler
 * POST /api/afriflow/webhook
 * 
 * This endpoint receives payment notifications from AfriFlow
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as { event: string; data: Record<string, any> };
        const { event, data } = body;

        console.log(`[AfriFlow Webhook] Event: ${event}`, data);

        switch (event) {
            case 'payment.success':
                // Handle successful payment
                console.log(`Payment ${data.paymentId} completed successfully`);
                // TODO: Update order status, send confirmation email, etc.
                break;

            case 'payment.failed':
                // Handle failed payment
                console.log(`Payment ${data.paymentId} failed`);
                break;

            case 'payment.pending':
                // Handle pending payment
                console.log(`Payment ${data.paymentId} is pending`);
                break;

            default:
                console.log(`Unknown event: ${event}`);
        }

        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error('AfriFlow webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        );
    }
}
