import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function chunkText(text: string, chunkSize = 1200, overlap = 150): string[] {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];

  const chunks: string[] = [];
  let start = 0;
  while (start < normalized.length) {
    const end = Math.min(start + chunkSize, normalized.length);
    chunks.push(normalized.slice(start, end).trim());
    if (end >= normalized.length) break;
    start = Math.max(0, end - overlap);
  }
  return chunks.filter(Boolean);
}

async function ensureUser(session: any) {
  const userId = (session.user as any).id as string;
  const sessionEmail = session.user.email || `${userId}@local.invalid`;
  const sessionName = session.user.name || "Utilisateur";

  const existingUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!existingUser) {
    await prisma.user.create({
      data: {
        id: userId,
        name: sessionName,
        email: sessionEmail,
        password: "EXTERNAL_AUTH",
      },
    });
  }

  return userId;
}

async function getOrCreateAutomationKb(userId: string, automationId: string) {
  const name = `automation:${automationId}`;

  const existing = await prisma.knowledgeBase.findFirst({
    where: { userId, name },
    select: { id: true, name: true, createdAt: true, updatedAt: true },
  });
  if (existing) return existing;

  return prisma.knowledgeBase.create({
    data: { userId, name },
    select: { id: true, name: true, createdAt: true, updatedAt: true },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id: automationId } = await params;
    const userId = await ensureUser(session);

    const automation = await prisma.automation.findFirst({
      where: { id: automationId, userId },
      select: { id: true },
    });

    if (!automation) {
      return NextResponse.json({ error: "Automatisation non trouvée" }, { status: 404 });
    }

    const kb = await getOrCreateAutomationKb(userId, automationId);

    const counts = await prisma.knowledgeBase.findUnique({
      where: { id: kb.id },
      select: {
        _count: {
          select: {
            documents: true,
            sources: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      knowledgeBase: {
        ...kb,
        _count: counts?._count,
      },
    });
  } catch (error: any) {
    console.error("Error fetching automation knowledge base:", error);
    return NextResponse.json(
      { error: "Erreur KB", details: error?.message || String(error) },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id: automationId } = await params;
    const userId = await ensureUser(session);

    const automation = await prisma.automation.findFirst({
      where: { id: automationId, userId },
      select: { id: true },
    });

    if (!automation) {
      return NextResponse.json({ error: "Automatisation non trouvée" }, { status: 404 });
    }

    const body = await request.json();
    const title = String(body?.title || "").trim();
    const content = String(body?.content || "").trim();

    if (!title || !content) {
      return NextResponse.json({ error: "Titre et contenu requis" }, { status: 400 });
    }

    const kb = await getOrCreateAutomationKb(userId, automationId);

    let source = await prisma.knowledgeSource.findFirst({
      where: { knowledgeBaseId: kb.id, type: "manual_text" },
      select: { id: true },
    });

    if (!source) {
      source = await prisma.knowledgeSource.create({
        data: {
          knowledgeBaseId: kb.id,
          type: "manual_text",
          name: "Manual Text",
          status: "CONNECTED",
          lastSyncedAt: new Date(),
        },
        select: { id: true },
      });
    }

    const doc = await prisma.knowledgeDocument.create({
      data: {
        knowledgeBaseId: kb.id,
        sourceId: source.id,
        type: "text",
        title,
        status: "READY",
      },
      select: { id: true, title: true },
    });

    const chunks = chunkText(content);
    await prisma.knowledgeChunk.createMany({
      data: chunks.map((c, idx) => ({
        documentId: doc.id,
        content: c,
        chunkIndex: idx,
      })),
    });

    return NextResponse.json({
      success: true,
      knowledgeBaseId: kb.id,
      document: {
        id: doc.id,
        title: doc.title,
        chunks: chunks.length,
      },
    });
  } catch (error: any) {
    console.error("Error adding text knowledge:", error);
    return NextResponse.json(
      { error: "Erreur ajout contenu", details: error?.message || String(error) },
      { status: 500 },
    );
  }
}
