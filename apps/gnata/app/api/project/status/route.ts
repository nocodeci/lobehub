import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const chatId = searchParams.get('chatId');

        if (!chatId) {
            return NextResponse.json({ error: "Missing chatId" }, { status: 400 });
        }

        // Find the project associated with this chat
        const project = await prisma.gnataProject.findFirst({
            where: { chatId },
            include: {
                coder: {
                    select: {
                        name: true
                    }
                }
            }
        });

        if (!project) {
            // No project yet, return PENDING status
            return NextResponse.json({
                status: 'PENDING',
                coderName: null,
                previewUrl: null,
                deployUrl: null
            });
        }

        return NextResponse.json({
            status: project.status,
            coderName: project.coder?.name || null,
            previewUrl: project.previewUrl || null,
            deployUrl: project.deployUrl || null
        });
    } catch (error) {
        console.error("Error fetching project status:", error);
        return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
    }
}
