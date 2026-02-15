import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userId = (session.user as any).id as string;
    const { id: knowledgeBaseId } = await context.params;

    const kb = await prisma.knowledgeBase.findFirst({
      where: { id: knowledgeBaseId, userId },
      select: { id: true },
    });

    if (!kb) {
      return NextResponse.json({ error: "Base introuvable" }, { status: 404 });
    }

    const body = await request.json();
    const query = String(body?.query || "").trim();
    const limit = Number(body?.limit || 5);

    if (!query) {
      return NextResponse.json({ error: "Query manquante" }, { status: 400 });
    }

    // MVP search: ILIKE on chunk content (simple). Later: embeddings + pgvector.
    const chunks = await prisma.knowledgeChunk.findMany({
      where: {
        document: {
          knowledgeBaseId,
        },
        content: {
          contains: query,
          mode: "insensitive",
        },
      },
      take: Math.min(Math.max(limit, 1), 20),
      orderBy: { chunkIndex: "asc" },
      select: {
        id: true,
        content: true,
        chunkIndex: true,
        document: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      results: chunks.map((c: (typeof chunks)[number]) => ({
        id: c.id,
        content: c.content,
        chunkIndex: c.chunkIndex,
        document: c.document,
      })),
    });
  } catch (error: any) {
    console.error("Error searching knowledge base:", error);
    return NextResponse.json(
      { error: "Erreur recherche", details: error?.message || String(error) },
      { status: 500 },
    );
  }
}
