"use server";

import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { logActivity } from "./team";
import crypto from "crypto";
import { getSelectedAppId } from "./utils";

function generateKey(prefix: string) {
    return `${prefix}_${crypto.randomBytes(24).toString("hex")}`;
}

export async function getApiConfig() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return null;

        const appId = await getSelectedAppId();
        if (!appId) return null;

        let config = await prisma.apiConfig.findUnique({
            where: { applicationId: appId }
        });

        if (!config) {
            try {
                config = await prisma.apiConfig.create({
                    data: {
                        applicationId: appId,
                        publicKey: generateKey("af_live_pub"),
                        secretKey: generateKey("af_live_sec"),
                        lastRotationAt: new Date(),
                        webhookUrl: ""
                    }
                });
            } catch (createError) {
                config = await prisma.apiConfig.findUnique({
                    where: { applicationId: appId }
                });
            }
        }

        return config;
    } catch (error) {
        console.error("SERVER ACTION: getApiConfig - Global failure:", error);
        return null;
    }
}

export async function rotateApiKeys() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) throw new Error("Unauthorized");

        const appId = await getSelectedAppId();
        if (!appId) throw new Error("No application selected");

        const config = await prisma.apiConfig.update({
            where: { applicationId: appId },
            data: {
                publicKey: generateKey("af_live_pub"),
                secretKey: generateKey("af_live_sec"),
                lastRotationAt: new Date()
            }
        });

        await logActivity({
            applicationId: appId,
            actorName: session.user.name || session.user.email || "Système",
            action: "A effectué une rotation des clés API",
            location: "Sécurité"
        });

        revalidatePath("/security");
        return { success: true, config };
    } catch (error) {
        console.error("Failed to rotate API keys:", error);
        return { success: false, error: "Erreur lors de la rotation des clés." };
    }
}

export async function updateWebhookUrl(url: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) throw new Error("Unauthorized");

        const appId = await getSelectedAppId();
        if (!appId) throw new Error("No application selected");

        await prisma.apiConfig.update({
            where: { applicationId: appId },
            data: { webhookUrl: url }
        });

        await logActivity({
            applicationId: appId,
            actorName: session.user.name || session.user.email || "Système",
            action: `A mis à jour l'URL du webhook vers: ${url}`,
            location: "Sécurité"
        });

        revalidatePath("/security");
        return { success: true };
    } catch (error) {
        console.error("Failed to update webhook URL:", error);
        return { success: false, error: "Impossible de mettre à jour le webhook." };
    }
}

export async function getSecurityLogs() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return [];

        const appId = await getSelectedAppId();
        if (!appId) return [];

        const logs = await prisma.auditLog.findMany({
            where: {
                applicationId: appId,
                OR: [
                    { action: { contains: "clé", mode: 'insensitive' } },
                    { action: { contains: "webhook", mode: 'insensitive' } },
                    { action: { contains: "accès", mode: 'insensitive' } },
                    { action: { contains: "Login", mode: 'insensitive' } },
                    { action: { contains: "rotation", mode: 'insensitive' } }
                ]
            },
            orderBy: { createdAt: "desc" },
            take: 5
        });

        return logs;
    } catch (error) {
        console.error("Failed to fetch security logs:", error);
        return [];
    }
}
