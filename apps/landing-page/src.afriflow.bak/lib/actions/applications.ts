"use server";

import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getApplications() {
    const p = prisma as any;
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return [];

        const user = await p.user.findUnique({
            where: { email: session.user.email },
            include: { applications: true }
        });

        if (!user) return [];

        return user.applications;
    } catch (error) {
        console.error("Error fetching applications:", error);
        return [];
    }
}

export async function createApplication(name: string, website?: string, category?: string) {
    console.log("🚀 createApplication action started:", { name, website, category });
    const p = prisma as any;
    console.log("📦 Target Application Delegate:", typeof p.application);
    try {
        const session = await getServerSession(authOptions);
        console.log("👤 Session retrieved:", session?.user?.email);

        if (!session?.user?.email) {
            console.error("❌ Unauthorized: No session or email");
            return { success: false, error: "Non autorisé" };
        }

        const user = await p.user.findUnique({
            where: { email: session.user.email }
        });
        console.log("🔍 User found in DB:", user?.id);

        if (!user) {
            console.error("❌ User not found for email:", session.user.email);
            return { success: false, error: "Utilisateur non trouvé" };
        }

        if (!p.application) {
            throw new Error("Le modèle Application n'est pas initialisé dans le client Prisma.");
        }

        const application = await p.application.create({
            data: {
                name,
                website,
                category,
                userId: user.id
            }
        });
        console.log("✅ Application created successfully:", application.id);

        revalidatePath("/");
        return { success: true, data: application };
    } catch (error: any) {
        console.error("🔥 Critical error in createApplication:", error);
        // Ensure we always return a serializable object to avoid 500s from non-serializable errors
        return {
            success: false,
            error: error instanceof Error ? error.message : "Une erreur inconnue est survenue"
        };
    }
}

export async function getCurrentApplication(applicationId?: string) {
    const p = prisma as any;
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return null;

        const user = await p.user.findUnique({
            where: { email: session.user.email }
        });
        if (!user) return null;

        if (applicationId) {
            return await p.application.findFirst({
                where: { id: applicationId, userId: user.id }
            });
        }

        // Default to first app
        return await p.application.findFirst({
            where: { userId: user.id }
        });
    } catch (error) {
        return null;
    }
}
