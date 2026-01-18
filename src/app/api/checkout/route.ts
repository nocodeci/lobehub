import { NextRequest, NextResponse } from "next/server";
import { PaymentOrchestratorFactory } from "@/lib/orchestrator/factory";
import { PaymentRequest } from "@/lib/orchestrator/types";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { provider, amount, orderId, customerEmail, customerName, customerPhone, paymentType, userId: bodyUserId } = body;

        // 1. Get User ID (from body for testing OR session)
        let userId = bodyUserId;
        if (!userId) {
            // Check session if it's a browser call
            // Note: getServerSession might not work in Route Handlers without extra config 
            // but let's try or assume userId is provided for now in this dev stage
            userId = "test-user-id"; // Fallback for dev
        }

        // 2. Fetch User Gateway Config
        const gateway = await (prisma as any).gateway.findFirst({
            where: {
                userId,
                name: { contains: provider || "mock", mode: 'insensitive' }
            }
        });

        if (!gateway && provider !== "mock") {
            throw new Error(`No active gateway found for ${provider}`);
        }

        // 3. Get the requested provider from factory with LIVE config from DB
        const config = gateway?.config || (gateway?.apiKey ? {
            apiKey: gateway.apiKey,
            apiSecret: gateway.apiSecret
        } : {});

        const paymentProvider = PaymentOrchestratorFactory.getProvider(provider || "mock", config);

        // 4. Register transaction in DB (PENDING) pinned to the User
        const subTransaction = await (prisma as any).paymentRecord.create({
            data: {
                userId,
                orderId,
                amount,
                customerEmail,
                customerName,
                customerPhone,
                provider: paymentProvider.name,
                paymentType: paymentType || 'MOBILE_MONEY',
                status: 'PENDING',
            }
        });

        // 5. Prepare the standard request
        const paymentRequest: PaymentRequest = {
            amount,
            currency: "XOF",
            customerName,
            customerEmail,
            orderId,
            callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/${paymentProvider.name.toLowerCase()}`,
            returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?id=${orderId}`,
        };

        // 6. Initiate payment with the adapter
        const response = await paymentProvider.initiatePayment(paymentRequest);

        // 5. Update with provider reference and log response
        await prisma.paymentRecord.update({
            where: { id: subTransaction.id },
            data: {
                providerRef: response.providerReference,
                logs: {
                    create: {
                        type: 'PROVIDER_INIT_RESPONSE',
                        payload: response.rawData || {}
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: response
        });

    } catch (error: any) {
        console.error("Checkout Error:", error);
        return NextResponse.json({
            success: false,
            error: error.message || "An error occurred during checkout initiation"
        }, { status: 500 });
    }
}
