import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { chatId, newTitle } = await req.json();

        if (!chatId || !newTitle) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const updatedChat = await prisma.gnataChat.update({
            where: { id: chatId },
            data: { title: newTitle },
        });

        return NextResponse.json(updatedChat);
    } catch (error) {
        console.error("Error renaming chat:", error);
        return NextResponse.json({ error: "Failed to rename chat" }, { status: 500 });
    }
}
