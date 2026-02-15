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

    const form = await request.formData();
    const file = form.get("file");
    const title = String(form.get("title") || "").trim();

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Fichier manquant (file)" }, { status: 400 });
    }

    const fileName = file.name || title || "document.pdf";

    // PDF text extraction
    // We rely on 'pdf-parse'. If not installed yet, return a helpful error.
    let pdfParse: any;
    try {
      pdfParse = (await import("pdf-parse")).default;
    } catch (e) {
      return NextResponse.json(
        {
          error: "Dépendance manquante: pdf-parse",
          details: "Installez pdf-parse (npm i pdf-parse) puis relancez.",
        },
        { status: 500 },
      );
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const parsed = await pdfParse(buf);
    const content = String(parsed?.text || "").trim();

    if (!content) {
      return NextResponse.json(
        { error: "Impossible d'extraire du texte du PDF" },
        { status: 400 },
      );
    }

    const source = await prisma.knowledgeSource.create({
      data: {
        knowledgeBaseId,
        type: "pdf",
        name: "PDF Upload",
        status: "CONNECTED",
        lastSyncedAt: new Date(),
      },
      select: { id: true },
    });

    const doc = await prisma.knowledgeDocument.create({
      data: {
        knowledgeBaseId,
        sourceId: source.id,
        type: "pdf",
        title: title || fileName,
        metadata: {
          fileName,
          pageCount: parsed?.numpages,
        },
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
      document: {
        id: doc.id,
        title: doc.title,
        chunks: chunks.length,
      },
    });
  } catch (error: any) {
    console.error("Error uploading knowledge document:", error);
    return NextResponse.json(
      { error: "Erreur upload document", details: error?.message || String(error) },
      { status: 500 },
    );
  }
}
