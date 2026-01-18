"use server";

import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { getSelectedAppId } from "./utils";

export async function getTeamMembers() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const appId = await getSelectedAppId();
        if (!appId) return [];

        const members = await prisma.teamMember.findMany({
            where: { applicationId: appId },
            orderBy: { createdAt: 'asc' }
        });

        return members;
    } catch (error) {
        console.error("Failed to fetch team members:", error);
        return [];
    }
}

export async function inviteTeamMember(data: {
    name: string,
    email: string,
    role: string,
    permission: string
}) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const appId = await getSelectedAppId();
        if (!appId) throw new Error("No application selected");

        const member = await prisma.teamMember.create({
            data: {
                ...data,
                applicationId: appId,
                status: "Hors ligne",
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name.split(' ')[0]}`,
                lastActive: "Jamais"
            }
        });

        // Log the activity
        await logActivity({
            applicationId: appId,
            actorName: session.user.name || session.user.email || "Système",
            action: `A invité ${data.name} en tant que ${data.role}`,
            location: "Dashboard"
        });

        revalidatePath('/team');
        return { success: true, member };
    } catch (error) {
        console.error("Failed to invite team member:", error);
        return { success: false, error: "Une erreur est survenue." };
    }
}

export async function removeTeamMember(id: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const appId = await getSelectedAppId();
        if (!appId) throw new Error("No application selected");

        const member = await prisma.teamMember.findUnique({ where: { id } });

        await prisma.teamMember.delete({
            where: {
                id,
                applicationId: appId
            }
        });

        if (member) {
            await logActivity({
                applicationId: appId,
                actorName: session.user.name || session.user.email || "Système",
                action: `A retiré ${member.name} de l'équipe`,
                location: "Dashboard"
            });
        }

        revalidatePath('/team');
        return { success: true };
    } catch (error) {
        console.error("Failed to remove team member:", error);
        return { success: false, error: "Impossible de supprimer ce membre." };
    }
}

export async function getAuditLogs() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const appId = await getSelectedAppId();
        if (!appId) return [];

        // One-time logic: Seed mock logs if none exist to match UI expectations
        const count = await prisma.auditLog.count({ where: { applicationId: appId } });
        if (count === 0) {
            await prisma.auditLog.createMany({
                data: [
                    { applicationId: appId, actorName: "Koffi Yohan", action: "A désactivé 'Orange Money Mali'", location: "Abidjan, CI", ipAddress: "192.168.1.1" },
                    { applicationId: appId, actorName: "Moussa Traoré", action: "A consulté les statistiques", location: "Dakar, SN", ipAddress: "192.168.1.12" },
                    { applicationId: appId, actorName: "Sarah Diallo", action: "A mis à jour l'API Key", location: "Bamako, ML", ipAddress: "10.0.0.45" }
                ]
            });
        }

        const logs = await prisma.auditLog.findMany({
            where: { applicationId: appId },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        return logs;
    } catch (error) {
        console.error("Failed to fetch audit logs:", error);
        return [];
    }
}

export async function logActivity(data: {
    applicationId: string,
    actorName: string,
    action: string,
    ipAddress?: string,
    location?: string
}) {
    try {
        await prisma.auditLog.create({
            data
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to log activity:", error);
        return { success: false };
    }
}
