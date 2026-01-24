import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userId = await ensureUser(session);

    const knowledgeBases = await prisma.knowledgeBase.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            documents: true,
            sources: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, knowledgeBases });
  } catch (error: any) {
    console.error("Error fetching knowledge bases:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des bases", details: error?.message || String(error) },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userId = await ensureUser(session);

    const body = await request.json();
    const name = String(body?.name || "").trim();

    if (!name) {
      return NextResponse.json({ error: "Le nom est requis" }, { status: 400 });
    }

    const kb = await prisma.knowledgeBase.create({
      data: {
        userId,
        name,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, knowledgeBase: kb });
  } catch (error: any) {
    console.error("Error creating knowledge base:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la base", details: error?.message || String(error) },
      { status: 500 },
    );
  }
}
