import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
    req: Request,
    { params }: { params: { chatId: string } }
) {
    try {
        const { chatId } = await params;
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        // Verify or claim chat ownership
        let chat = await (prisma as any).gnataChat.findUnique({
            where: { id: chatId },
        });

        if (!chat) {
            return NextResponse.json({ error: "Chat not found" }, { status: 404 });
        }

        // Claim anonymous chat if user is logged in
        if (!(chat as any).userId && userId) {
            chat = await (prisma as any).gnataChat.update({
                where: { id: chatId },
                data: { userId }
            });
        }

        // If chat has an owner, verify it's the current user
        if ((chat as any).userId && (chat as any).userId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const messages = await prisma.gnataMessage.findMany({
            where: { chatId },
            orderBy: { timestamp: "asc" },
        });

        return NextResponse.json(messages);
    } catch (error) {
        console.error("Error fetching chat history:", error);
        return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
    }
}
