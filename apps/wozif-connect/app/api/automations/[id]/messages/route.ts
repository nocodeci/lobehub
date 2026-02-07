import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - List all messages for a specific automation
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const messages = await (prisma as any).message.findMany({
            where: { automationId: id },
            orderBy: { createdAt: "asc" },
        });

        return NextResponse.json({
            success: true,
            messages,
        });
    } catch (error: any) {
        console.error("Error fetching messages:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération des messages" },
            { status: 500 }
        );
    }
}

// POST - Create a new message for a specific automation
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const body = await request.json();
        const { role, content } = body;

        if (!role || !content) {
            return NextResponse.json(
                { error: "Role et contenu sont requis" },
                { status: 400 }
            );
        }

        const message = await (prisma as any).message.create({
            data: {
                automationId: id,
                role,
                content,
            },
        });

        return NextResponse.json({
            success: true,
            message,
        });
    } catch (error: any) {
        console.error("Error creating message:", error);
        return NextResponse.json(
            { error: "Erreur lors de la sauvegarde du message" },
            { status: 500 }
        );
    }
}
