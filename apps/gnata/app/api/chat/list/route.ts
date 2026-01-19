import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const chats = await prisma.gnataChat.findMany({
            orderBy: { updatedAt: "desc" },
        });
        return NextResponse.json(chats);
    } catch (error) {
        console.error("Error fetching chats:", error);
        return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 });
    }
}
