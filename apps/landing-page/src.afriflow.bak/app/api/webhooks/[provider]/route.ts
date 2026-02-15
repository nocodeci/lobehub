import { NextRequest, NextResponse } from "next/server";
import { PaymentOrchestratorFactory } from "@/lib/orchestrator/factory";
import prisma from "@/lib/db";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ provider: string }> }
) {
    try {
        const { provider: providerName } = await params;
        const payload = await req.json();
        const headers = Object.fromEntries(req.headers.entries());

        // 1. Identify the record to get the userId
        // (Note: This depends on the provider implementation. Most send a reference.)
        // For this orchestration, we'll try to find the record first.
        const tempPayload = payload.data || payload;
        const potentialRef = tempPayload.order_id || tempPayload.token || tempPayload.invoice_token;

        const record = await (prisma as any).paymentRecord.findFirst({
            where: {
                OR: [
                    { orderId: potentialRef },
                    { providerRef: potentialRef }
                ]
            }
        });

        if (!record) {
            console.error(`[Webhook] No record found for ref: ${potentialRef}`);
            return NextResponse.json({ received: false, error: "Record not found" }, { status: 404 });
        }

        // 2. Fetch User Gateway Config
        const gateway = await (prisma as any).gateway.findFirst({
            where: {
                userId: record.userId,
                name: { contains: providerName, mode: 'insensitive' }
            }
        });

        const config = gateway?.config || (gateway?.apiKey ? {
            apiKey: gateway.apiKey,
            apiSecret: gateway.apiSecret
        } : {});

        // 3. Get the provider adapter with user-specific config
        const provider = PaymentOrchestratorFactory.getProvider(providerName, config);

        // 4. Normalize the webhook data via adapter
        const result = await provider.handleWebhook(payload, headers);

        // 5. Update database with standardized status and log activity
        await (prisma as any).paymentRecord.update({
            where: { id: record.id },
            data: {
                status: result.status,
                completedAt: result.status === 'SUCCESS' ? new Date() : null,
                logs: {
                    create: {
                        type: 'WEBHOOK_RECEIVED',
                        payload: payload || {}
                    }
                }
            }
        });

        console.log(`[Webhook] DB Updated for Tx: ${result.transactionId}, New Status: ${result.status}`);

        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error("Webhook Error:", error);
        return NextResponse.json({
            success: false,
            error: error.message || "Webhook processing failed"
        }, { status: 400 });
    }
}
