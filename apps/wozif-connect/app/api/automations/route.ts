import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - List all automations for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const automations = await prisma.automation.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        isActive: true,
        whatsappNumber: true,
        template: true,
        triggerCount: true,
        lastTriggeredAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      automations,
    });
  } catch (error: any) {
    console.error("Error fetching automations:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la récupération des automatisations",
        details: error?.message || String(error)
      },
      { status: 500 }
    );
  }
}

// POST - Create a new automation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json(
        { error: "Utilisateur invalide (id manquant)" },
        { status: 400 },
      );
    }

    // Ensure the user exists in the local DB to satisfy FK constraints.
    // This app uses external/shared auth (JWT). The local DB may not have the user row yet.
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

    const body = await request.json();

    const {
      id, // automationId from frontend
      name,
      description,
      nodes,
      template,
      products,
      currency,
      triggerKeywords,
      aiInstructions,
      whatsappNumber,
      telegramBotToken,
      isActive,
    } = body;

    // Validate required fields
    if (!name || !nodes || !Array.isArray(nodes)) {
      return NextResponse.json(
        { error: "Nom et nodes sont requis" },
        { status: 400 }
      );
    }

    // Create the WhatsApp instance ID (unique per automation)
    const whatsappInstanceId = `${userId}_${id}`;

    // Check if automation with this ID already exists
    let targetId = id;
    let existingAutomation = await prisma.automation.findUnique({
      where: { id: targetId },
    });

    // Handle collision or ownership
    if (existingAutomation && existingAutomation.userId !== userId) {
      console.warn(`ID collision detected for ID: ${targetId}. Generating new ID.`);
      targetId = `auto_${Math.random().toString(36).substr(2, 9)}`;
      existingAutomation = null; // Proceed to create with new ID
    }

    let automation;

    if (existingAutomation) {
      // Update existing automation
      automation = await prisma.automation.update({
        where: { id: targetId },
        data: {
          name,
          description,
          nodes,
          template,
          products,
          currency,
          triggerKeywords: triggerKeywords || [],
          aiInstructions,
          whatsappNumber,
          whatsappInstanceId: `${userId}_${targetId}`, // Update instance ID with correct ID
          telegramBotToken,
          isActive: isActive ?? false,
          status: isActive ? "ACTIVE" : "DRAFT",
          updatedAt: new Date(),
        },
      });
      console.log("Automation updated successfully:", automation.id);
    } else {
      // Create new automation
      automation = await prisma.automation.create({
        data: {
          id: targetId && targetId.trim() !== "" ? targetId : undefined,
          userId,
          name,
          description,
          nodes,
          template,
          products,
          currency,
          triggerKeywords: triggerKeywords || [],
          aiInstructions,
          whatsappNumber,
          whatsappInstanceId: `${userId}_${targetId || 'new'}`,
          telegramBotToken,
          isActive: isActive ?? false,
          status: isActive ? "ACTIVE" : "DRAFT",
        },
      });
      console.log("Automation created successfully:", automation.id);
    }

    return NextResponse.json({
      success: true,
      automation: {
        id: automation.id,
        name: automation.name,
        status: automation.status,
        isActive: automation.isActive,
        whatsappInstanceId: automation.whatsappInstanceId,
      },
      message: existingAutomation
        ? "Automatisation mise à jour avec succès"
        : "Automatisation créée avec succès",
    });
  } catch (error: any) {
    console.error("CRITICAL ERROR in POST /api/automations:", error);
    // Log the payload for debugging (be careful with sensitive info, but here it's workflow data)
    try {
      const body = await request.json();
      console.log("FAILED PAYLOAD:", JSON.stringify(body, null, 2));
    } catch (e) { }

    return NextResponse.json(
      {
        error: "Erreur lors de la sauvegarde de l'automatisation",
        details: error?.message || String(error),
        code: error?.code // Prisma error codes (e.g. P2002)
      },
      { status: 500 }
    );
  }
}
