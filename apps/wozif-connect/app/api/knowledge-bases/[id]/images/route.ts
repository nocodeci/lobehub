import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY manquante" },
        { status: 500 },
      );
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

    const mimeType = file.type || "image/*";
    if (!mimeType.startsWith("image/")) {
      return NextResponse.json(
        { error: "Type de fichier invalide (image attendue)" },
        { status: 400 },
      );
    }

    const fileName = file.name || title || "image";
    const buf = Buffer.from(await file.arrayBuffer());
    const b64 = buf.toString("base64");
    const dataUrl = `data:${mimeType};base64,${b64}`;

    const result = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Tu es un OCR. Extrait uniquement le texte lisible de l'image. Si aucun texte n'est lisible, réponds avec une chaîne vide.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Extrait le texte de cette image." },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
      temperature: 0,
    });

    const content = String(result.choices?.[0]?.message?.content || "").trim();
    if (!content) {
      return NextResponse.json(
        { error: "Aucun texte détecté dans l'image" },
        { status: 400 },
      );
    }

    const source = await prisma.knowledgeSource.create({
      data: {
        knowledgeBaseId,
        type: "image",
        name: "Image Upload",
        status: "CONNECTED",
        lastSyncedAt: new Date(),
      },
      select: { id: true },
    });

    const doc = await prisma.knowledgeDocument.create({
      data: {
        knowledgeBaseId,
        sourceId: source.id,
        type: "image",
        title: title || fileName,
        metadata: {
          fileName,
          mimeType,
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
    console.error("Error uploading knowledge image:", error);
    return NextResponse.json(
      { error: "Erreur upload image", details: error?.message || String(error) },
      { status: 500 },
    );
  }
}
