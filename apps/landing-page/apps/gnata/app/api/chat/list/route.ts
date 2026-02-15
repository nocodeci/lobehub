import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const specificChatId = searchParams.get('chatId');

        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        let chats: any[] = [];

        if (userId) {
            // Return chats for this user
            chats = await (prisma as any).gnataChat.findMany({
                where: { userId },
                orderBy: { updatedAt: "desc" },
            });
        }

        // If a specific chatId is requested (for Guest survival), add it to the list if not already there
        if (specificChatId && !chats.some(c => c.id === specificChatId)) {
            const extraChat = await (prisma as any).gnataChat.findUnique({
                where: { id: specificChatId }
            });
            if (extraChat) {
                chats.unshift(extraChat);
            }
        }

        if (!userId && !specificChatId) {
            return NextResponse.json([]);
        }

        return NextResponse.json(chats);
    } catch (error) {
        console.error("Critical error in Chat List API:", error);
        return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 });
    }
}
