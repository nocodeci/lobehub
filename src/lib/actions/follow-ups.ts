"use server";

import prisma from "@/lib/db";
const p = prisma as any;
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getSelectedAppId } from "./utils";

export async function getFollowUpCandidates() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const appId = await getSelectedAppId();
        if (!appId) return [];

        // Fetch failed or abandoned transactions for this app
        const records = await p.paymentRecord.findMany({
            where: {
                applicationId: appId,
                status: { in: ['FAILED', 'PENDING'] }
            },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        // 2. Fetch customers for these records to fill missing phone numbers
        const emails = records.map((r: any) => r.customerEmail).filter(Boolean);
        const customers = await p.customer.findMany({
            where: {
                applicationId: appId,
                email: { in: emails }
            }
        });

        const customerMap = new Map(customers.map((c: any) => [c.email, c.phone]));

        return records.map((record: any) => {
            const phone = record.customerPhone || customerMap.get(record.customerEmail) || "N/A";

            return {
                id: record.orderId,
                customer: record.customerName,
                email: record.customerEmail,
                phone: phone,
                amount: record.amount.toLocaleString() + " " + record.currency,
                status: record.status.toLowerCase(),
                lastCheck: new Date(record.updatedAt).toLocaleTimeString(),
                retrials: 0,
                type: record.status === 'FAILED' ? "Échec de Paiement" : "Panier Abandonné"
            };
        });

    } catch (error) {
        console.error("Failed to fetch follow-ups:", error);
        return [];
    }
}

export async function getFollowUpStats() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const appId = await getSelectedAppId();
        if (!appId) return {
            recoveryRate: "0%",
            recoveredAmount: "0 FCFA",
            pendingFollowups: "0"
        };

        const allRecords = await p.paymentRecord.findMany({
            where: { applicationId: appId }
        });

        const recoveredCount = allRecords.filter((r: any) => r.status === 'SUCCESS').length;
        const pendingCount = allRecords.filter((r: any) => ['FAILED', 'PENDING'].includes(r.status)).length;
        const total = allRecords.length || 1;

        const recoveredAmount = allRecords
            .filter((r: any) => r.status === 'SUCCESS')
            .reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);

        return {
            recoveryRate: ((recoveredCount / total) * 100).toFixed(1) + "%",
            recoveredAmount: recoveredAmount.toLocaleString() + " FCFA",
            pendingFollowups: pendingCount.toString()
        };
    } catch (error) {
        return {
            recoveryRate: "0%",
            recoveredAmount: "0 FCFA",
            pendingFollowups: "0"
        };
    }
}

export async function sendFollowUp(type: 'whatsapp' | 'email', orderId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const appId = await getSelectedAppId();
        if (!appId) throw new Error("No application selected");

        // 1. Fetch record
        const record = await p.paymentRecord.findFirst({
            where: { orderId, applicationId: appId }
        });

        if (!record) throw new Error("Transaction not found");

        const customer = record.customerName || "Client";
        const amount = record.amount.toLocaleString() + " " + record.currency;
        const link = `${process.env.NEXTAUTH_URL}/checkout/${record.id}`;

        if (type === 'whatsapp') {
            // Check WhatsApp Status first
            const status = await getWhatsAppStatus();
            if (status.status !== 'CONNECTED') {
                return { success: false, error: "WhatsApp n'est pas connecté. Veuillez scanner le code QR d'abord." };
            }

            const message = `Bonjour ${customer}, c'est l'équipe AfriFlow. Nous avons remarqué que votre paiement de ${amount} n'a pas pu aboutir. Vous pouvez finaliser votre commande ici : ${link}`;

            const phone = record.customerPhone || "";
            let cleanPhone = phone.replace(/\D/g, '');

            if (cleanPhone.length >= 8 && cleanPhone.length <= 10) {
                cleanPhone = "225" + cleanPhone;
            }

            const resp = await fetch(`http://localhost:8080/api/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: session.user.email, // Bridge still uses email or specific ID
                    recipient: cleanPhone,
                    message
                })
            });

            const data = await resp.json();
            if (!data.success) throw new Error(data.message || "Échec de l'envoi WhatsApp");

        } else {
            console.log(`[Email FollowUp] Sending to ${record.customerEmail}...`);
        }

        return { success: true };

    } catch (error: any) {
        console.error("Follow-up error:", error);
        return { success: false, error: error.message };
    }
}

export async function getWhatsAppStatus() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const appId = await getSelectedAppId();
        if (!appId) return { status: "DISCONNECTED" };

        const config = await p.whatsAppConfig.findUnique({
            where: { applicationId: appId }
        });

        // Check live bridge status (Bridge uses a stable identifier, let's keep appId for isolation)
        try {
            const resp = await fetch(`http://localhost:8080/api/qr?userId=${appId}`, { cache: 'no-store' });
            if (resp.ok) {
                const data = await resp.json();
                if (data.status) {
                    const liveStatus = data.status.toUpperCase();
                    const livePhoneRaw = data.phone || data.phoneNumber || null;
                    const livePhone = livePhoneRaw ? livePhoneRaw.replace(/\D/g, '') : null;

                    // EXCLUSIVITY RULE: Check if this phone number is already used by another application
                    if (livePhone) {
                        const existingConfig = await p.whatsAppConfig.findFirst({
                            where: {
                                phoneNumber: livePhone,
                                NOT: { applicationId: appId }
                            },
                        });

                        if (existingConfig) {
                            console.warn(`⚠️ Exclusivity breach: Phone ${livePhone} already used by app ${existingConfig.applicationId}`);
                            // Force disconnect in bridge for this appId if already used elsewhere
                            await fetch(`http://localhost:8080/api/disconnect?userId=${appId}`, { method: 'POST' });

                            return {
                                status: "ERROR_ALREADY_USED",
                                error: "Ce compte WhatsApp est déjà utilisé par une autre application.",
                                phoneNumber: livePhone,
                                autoFollowupEnabled: config?.autoFollowupEnabled || false
                            };
                        }
                    }

                    // Sync to DB
                    const updatedConfig = await p.whatsAppConfig.upsert({
                        where: { applicationId: appId },
                        update: {
                            status: liveStatus,
                            phoneNumber: livePhone // Update phone number when it becomes available
                        },
                        create: {
                            applicationId: appId,
                            status: liveStatus,
                            phoneNumber: livePhone
                        }
                    });

                    return {
                        status: liveStatus,
                        phoneNumber: updatedConfig.phoneNumber || null,
                        autoFollowupEnabled: updatedConfig.autoFollowupEnabled || false
                    };
                }
            }
        } catch (e) {
            console.error("Bridge sync error:", e);
        }

        return {
            status: config?.status || "DISCONNECTED",
            phoneNumber: config?.phoneNumber || null,
            autoFollowupEnabled: config?.autoFollowupEnabled || false
        };
    } catch (error) {
        return { status: "DISCONNECTED" };
    }
}

export async function generateWhatsAppQR() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const appId = await getSelectedAppId();
        if (!appId) return { error: "Aucune application sélectionnée." };

        const resp = await fetch(`http://localhost:8080/api/qr?userId=${appId}`, { cache: 'no-store' });
        const data = await resp.json();

        if (data.success && data.qr) {
            return {
                qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data.qr)}&ecc=M&margin=2`,
                expiresIn: 60
            };
        }

        return { error: data.message || "Le serveur WhatsApp n'est pas prêt ou déjà connecté." };
    } catch (error) {
        return { error: "Le serveur WhatsApp est hors ligne." };
    }
}

export async function disconnectWhatsApp() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const appId = await getSelectedAppId();
        if (!appId) throw new Error("No application selected");

        // 1. Clear state in DB
        await p.whatsAppConfig.update({
            where: { applicationId: appId },
            data: { status: "DISCONNECTED", autoFollowupEnabled: false, phoneNumber: null }
        });

        // 2. Clear state in bridge
        try {
            await fetch(`http://localhost:8080/api/disconnect?userId=${appId}`, { method: 'POST' });
        } catch (e) {
            console.error("Failed to disconnect bridge:", e);
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to disconnect WhatsApp:", error);
        return { success: false };
    }
}

export async function toggleWhatsAppAutomation() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const appId = await getSelectedAppId();
        if (!appId) throw new Error("No application selected");

        const config = await p.whatsAppConfig.findUnique({
            where: { applicationId: appId }
        });

        const newStatus = !config?.autoFollowupEnabled;

        await p.whatsAppConfig.upsert({
            where: { applicationId: appId },
            update: { autoFollowupEnabled: newStatus },
            create: { applicationId: appId, autoFollowupEnabled: newStatus, status: "DISCONNECTED" }
        });

        return { success: true, enabled: newStatus };
    } catch (error) {
        console.error("Failed to toggle automation:", error);
        return { success: false };
    }
}
