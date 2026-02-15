"use server";

import { cookies } from "next/headers";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getSelectedAppId() {
    const cookieStore = await cookies();
    const appId = cookieStore.get("applicationId")?.value;

    if (appId) return appId;

    // Fallback: Get the first application for the user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { applications: { take: 1 } }
    });

    if (user?.applications?.[0]) {
        return user.applications[0].id;
    }

    return null;
}

export async function validateAppOwnership(appId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return false;

    const app = await prisma.application.findFirst({
        where: {
            id: appId,
            user: { email: session.user.email }
        }
    });

    return !!app;
}
