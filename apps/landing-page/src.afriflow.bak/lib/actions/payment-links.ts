"use server";

import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { getSelectedAppId } from "./utils";

export async function getPaymentLinks() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const appId = await getSelectedAppId();
        if (!appId) return [];

        return await prisma.paymentLink.findMany({
            where: { applicationId: appId },
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        console.error("Failed to fetch payment links:", error);
        return [];
    }
}

export async function createPaymentLink(data: {
    title: string;
    description?: string;
    amount: number;
    currency: string;
    requestPhone?: boolean;
    allowQuantity?: boolean;
    webhookUrl?: string;
    facebookPixelId?: string;
    googleAdsId?: string;
    customSuccessMessage?: string;
    expiresAt?: Date;
}) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const appId = await getSelectedAppId();
        if (!appId) throw new Error("No application selected");

        const slug = Math.random().toString(36).substring(2, 10);

        const paymentLink = await prisma.paymentLink.create({
            data: {
                ...data,
                applicationId: appId,
                slug,
                status: "active"
            }
        });

        revalidatePath("/payment-links");
        return { success: true, data: paymentLink };
    } catch (error) {
        console.error("Failed to create payment link:", error);
        return { success: false, error: "Erreur lors de la création du lien." };
    }
}

export async function getPaymentLinkBySlug(slug: string) {
    try {
        return await prisma.paymentLink.findUnique({
            where: { slug },
            include: {
                application: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                image: true
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error("Failed to fetch payment link:", error);
        return null;
    }
}

export async function initializePaymentLinkTransaction(data: {
    slug: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    quantity: number;
}) {
    try {
        const link = await prisma.paymentLink.findUnique({
            where: { slug: data.slug }
        });

        if (!link || link.status !== 'active') {
            throw new Error("Lien de paiement introuvable ou inactif");
        }

        const orderId = `ORD-${Math.random().toString(36).substring(2, 15).toUpperCase()}`;
        const totalAmount = link.amount * data.quantity;

        const transaction = await prisma.paymentRecord.create({
            data: {
                applicationId: link.applicationId,
                orderId,
                amount: totalAmount,
                currency: link.currency,
                status: 'PENDING',
                customerName: data.customerName,
                customerEmail: data.customerEmail,
                customerPhone: data.customerPhone || null,
                paymentType: 'MOBILE_MONEY',
                provider: 'afriflow', // Routed via AfriFlow
                metadata: {
                    paymentLinkId: link.id,
                    quantity: data.quantity,
                    source: 'Payment Link'
                } as any
            }
        });

        return { success: true, transactionId: transaction.id };
    } catch (error: any) {
        console.error("Failed to initialize transaction:", error);
        return { success: false, error: error.message || "Erreur d'initialisation" };
    }
}
