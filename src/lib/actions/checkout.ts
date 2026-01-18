"use server";

import prisma from "@/lib/db";
import { PaymentOrchestratorFactory } from "@/lib/orchestrator/factory";
import { PaymentRequest } from "@/lib/orchestrator/types";
import { PayDunyaAdapter } from "@/lib/orchestrator/adapters/paydunya.adapter";

console.log("🛠️ Checkout Actions module loaded");

export async function initiateSoftPayment(data: {
    transactionId: string;
    gatewayId: string;
    methodCode: string;
    customerDetails: {
        name: string;
        email: string;
        phone: string;
        country: string;
        otp?: string;
    }
}) {
    try {
        const { transactionId, gatewayId, methodCode, customerDetails } = data;
        console.log(`🚀 SOFT_PAY_INIT: tx=${transactionId} method=${methodCode}`);

        // 1. Fetch Transaction
        const transaction = await prisma.paymentRecord.findUnique({
            where: { id: transactionId }
        });

        if (!transaction) {
            console.error(`❌ SOFT_PAY_ERROR: Transaction ${transactionId} not found`);
            throw new Error("Transaction introuvable");
        }
        console.log(`✅ Transaction found: ${transaction.orderId}`);

        // 1.5 Update customer details immediately (even if pay fails, we want their phone for relances)
        await prisma.paymentRecord.update({
            where: { id: transactionId },
            data: {
                customerName: customerDetails.name,
                customerPhone: customerDetails.phone,
                customerEmail: customerDetails.email
            }
        });

        // 2. Fetch Gateway Config
        const gateway = await prisma.gateway.findUnique({
            where: { id: gatewayId }
        });

        if (!gateway) {
            console.error(`❌ SOFT_PAY_ERROR: Gateway ${gatewayId} not found`);
            throw new Error("Passerelle introuvable");
        }
        console.log(`✅ Gateway found: ${gateway.name}`);

        // 3. Prepare Config for Adapter
        const config = gateway.config as any;
        const adapterConfig = {
            masterKey: config?.masterKey || gateway.apiKey,
            privateKey: config?.privateKey || gateway.apiSecret,
            publicKey: config?.publicKey || "",
            token: config?.token || "",
            mode: config?.mode || 'live'
        };

        console.log(`🛠️ Using mode: ${adapterConfig.mode}`);

        const adapter = PaymentOrchestratorFactory.getProvider('paydunya', adapterConfig) as PayDunyaAdapter;

        // 4. Check if Invoice exists, if not create it
        let invoiceToken = transaction.providerRef;
        const rawBaseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3012';
        const baseUrl = (rawBaseUrl === 'undefined' || !rawBaseUrl) ? 'http://localhost:3012' : rawBaseUrl;

        // VERIFY EXISTING TOKEN: If token exists, check if it's still valid (not cancelled)
        if (invoiceToken) {
            console.log(`🔍 Checking validity of existing token: ${invoiceToken}`);
            const check = await adapter.verifyPayment(invoiceToken);
            if (check.status === 'SUCCESS') {
                console.log("✅ Token is already SUCCESS, skipping SoftPay.");
                return {
                    success: true,
                    status: 'SUCCESS',
                    rawData: check.rawData
                };
            }
            if (check.rawData?.status === 'cancelled' || check.rawData?.status === 'failed') {
                console.log(`⚠️ Existing token is ${check.rawData.status}, forcing new invoice...`);
                invoiceToken = null; // Force reset
            }
        }

        if (!invoiceToken) {
            console.log("📝 No valid invoice token found, creating invoice...");
            const paymentRequest: PaymentRequest = {
                amount: transaction.amount,
                currency: transaction.currency,
                customerName: customerDetails.name,
                customerEmail: customerDetails.email,
                customerPhone: customerDetails.phone,
                orderId: transaction.orderId,
                callbackUrl: `${baseUrl}/api/webhooks/paydunya`,
                returnUrl: `${baseUrl}/checkout/success?id=${transaction.id}`,
            };

            const initResponse = await adapter.initiatePayment(paymentRequest);

            if (initResponse.status === 'FAILED') {
                console.error("❌ PayDunya Invoice Init FAILED", initResponse.rawData);
                throw new Error("Impossible d'initialiser la facture PayDunya");
            }

            invoiceToken = initResponse.providerReference;

            // Save Token to Transaction
            await prisma.paymentRecord.update({
                where: { id: transactionId },
                data: { providerRef: invoiceToken }
            });
            console.log(`✅ New invoice created: ${invoiceToken}`);
        } else {
            console.log(`♻️ Using existing valid invoice token: ${invoiceToken}`);
        }

        // 5. Process SoftPay
        // For Orange Money CI and BF, the OTP is required in the FIRST SoftPay call.
        const requiresImmediateOtp = (methodCode.includes('orange') && ['CI', 'BF'].includes(customerDetails.country.toUpperCase()));

        if (requiresImmediateOtp && !customerDetails.otp) {
            console.log("⏸️ [SERVER] Waiting for OTP before SoftPay processing...");
            return {
                success: true,
                status: 'REQUIRE_OTP',
                rawData: { message: "Invoice created, waiting for user OTP" }
            };
        }

        console.log("⚡ [SERVER] Executing SoftPay process...");
        const softPayResponse = await adapter.processSoftPay(
            invoiceToken,
            methodCode,
            customerDetails
        );

        console.log(`🔍 [SERVER] SoftPay Status: ${softPayResponse.status}`);

        // Detect if payment was already initiated but not confirmed
        let isAlreadyInitiated = softPayResponse.rawData?.message?.includes("dejà été initié");

        if (isAlreadyInitiated) {
            console.log("🔍 [SERVER] Payment already initiated, verifying current status...");
            const verification = await adapter.verifyPayment(invoiceToken);
            console.log(`🔍 [SERVER] Verification raw data:`, JSON.stringify(verification.rawData));
            console.log(`🔍 [SERVER] Verification state: status=${verification.status} providerRef=${verification.providerReference}`);

            if (verification.status === 'SUCCESS') {
                softPayResponse.status = 'SUCCESS';
                softPayResponse.rawData = verification.rawData;
            }
        }

        // 6. Update database status based on SoftPay response
        if (softPayResponse.status === 'SUCCESS' || softPayResponse.status === 'FAILED') {
            try {
                await prisma.paymentRecord.update({
                    where: { id: transactionId },
                    data: {
                        status: softPayResponse.status === 'SUCCESS' ? 'SUCCESS' : 'FAILED',
                        completedAt: softPayResponse.status === 'SUCCESS' ? new Date() : null,
                        paymentType: 'mobile_money',
                        customerPhone: customerDetails.phone,
                        customerName: customerDetails.name
                    }
                });
                console.log(`📝 [SERVER] Database updated: ${softPayResponse.status}`);
            } catch (dbError) {
                console.error("⚠️ Failed to update transaction status:", dbError);
            }
        }

        // 7. Log Provider Response
        try {
            await (prisma as any).providerLog.create({
                data: {
                    transactionId: transactionId,
                    type: 'SOFTPAY_RESPONSE',
                    payload: JSON.parse(JSON.stringify(softPayResponse.rawData || { status: softPayResponse.status }))
                }
            });
        } catch (logError) {
            console.error("⚠️ Non-blocking log error:", logError);
        }

        if (softPayResponse.status === 'FAILED' && !isAlreadyInitiated) {
            console.error("❌ SoftPay Processing FAILED", softPayResponse.rawData);
            return {
                success: false,
                message: softPayResponse.rawData?.message || "Échec du traitement du paiement",
                error: JSON.parse(JSON.stringify(softPayResponse.rawData || {}))
            };
        }

        console.log(`✨ SOFT_PAY_DONE: ${softPayResponse.status}`);
        return {
            success: true,
            status: isAlreadyInitiated ? 'REQUIRE_OTP' : softPayResponse.status,
            redirectUrl: softPayResponse.checkoutUrl,
            rawData: JSON.parse(JSON.stringify(softPayResponse.rawData || {}))
        };

    } catch (error: any) {
        console.error("🚨 CRITICAL SOFT_PAY FAILURE", error);
        return {
            success: false,
            message: error.message || "Une erreur technique est survenue au niveau de la passerelle"
        };
    }
}
