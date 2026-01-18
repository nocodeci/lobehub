"use server";

import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { getSelectedAppId } from "./utils";
import { logActivity } from "./team";

const p = prisma as any;

export async function updateApplicationImage(imageUrl: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const appId = await getSelectedAppId();
        if (!appId) throw new Error("No application selected");

        const application = await p.application.update({
            where: { id: appId },
            data: { image: imageUrl }
        });

        await logActivity({
            applicationId: appId,
            actorName: session.user.name || session.user.email || "Système",
            action: "A mis à jour l'image de l'espace de travail",
            location: "Paramètres"
        });

        revalidatePath("/");
        revalidatePath("/settings");

        return { success: true, application };
    } catch (error) {
        console.error("Failed to update application image:", error);
        return { success: false, error: "Impossible de mettre à jour l'image." };
    }
}

export async function updateApplicationDetails(data: { name: string; website?: string }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const appId = await getSelectedAppId();
        if (!appId) throw new Error("No application selected");

        const application = await p.application.update({
            where: { id: appId },
            data
        });

        await logActivity({
            applicationId: appId,
            actorName: session.user.name || session.user.email || "Système",
            action: `A modifié les informations de l'entreprise : ${data.name}`,
            location: "Paramètres"
        });

        revalidatePath("/");
        revalidatePath("/settings");

        return { success: true, application };
    } catch (error) {
        console.error("Failed to update application details:", error);
        return { success: false, error: "Impossible de mettre à jour les informations." };
    }
}

export async function getFullCurrentApplication() {
    try {
        const appId = await getSelectedAppId();
        if (!appId) return null;

        return await p.application.findUnique({
            where: { id: appId }
        });
    } catch (error) {
        return null;
    }
}
