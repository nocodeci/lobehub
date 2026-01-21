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

    // Check if automation with this ID already exists (update case)
    const existingAutomation = await prisma.automation.findFirst({
      where: {
        id,
        userId,
      },
    });

    let automation;

    if (existingAutomation) {
      // Update existing automation
      automation = await prisma.automation.update({
        where: { id: existingAutomation.id },
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
          whatsappInstanceId,
          telegramBotToken,
          isActive: isActive ?? false,
          status: isActive ? "ACTIVE" : "DRAFT",
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new automation
      automation = await prisma.automation.create({
        data: {
          id, // Use the automationId from frontend
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
          whatsappInstanceId,
          telegramBotToken,
          isActive: isActive ?? false,
          status: isActive ? "ACTIVE" : "DRAFT",
        },
      });
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
    console.error("Error creating/updating automation:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la sauvegarde de l'automatisation",
        details: error?.message || String(error)
      },
      { status: 500 }
    );
  }
}
