import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { chatId: string } }
) {
    try {
        const { chatId } = params;

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
