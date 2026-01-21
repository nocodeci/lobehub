import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Get a single automation by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { id } = params;

    const automation = await prisma.automation.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!automation) {
      return NextResponse.json(
        { error: "Automatisation non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      automation,
    });
  } catch (error) {
    console.error("Error fetching automation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'automatisation" },
      { status: 500 }
    );
  }
}

// PUT - Update an automation
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { id } = params;
    const body = await request.json();

    // Check if automation exists and belongs to user
    const existingAutomation = await prisma.automation.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingAutomation) {
      return NextResponse.json(
        { error: "Automatisation non trouvée" },
        { status: 404 }
      );
    }

    const {
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
      status,
    } = body;

    const automation = await prisma.automation.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(nodes !== undefined && { nodes }),
        ...(template !== undefined && { template }),
        ...(products !== undefined && { products }),
        ...(currency !== undefined && { currency }),
        ...(triggerKeywords !== undefined && { triggerKeywords }),
        ...(aiInstructions !== undefined && { aiInstructions }),
        ...(whatsappNumber !== undefined && { whatsappNumber }),
        ...(telegramBotToken !== undefined && { telegramBotToken }),
        ...(isActive !== undefined && { isActive }),
        ...(status !== undefined && { status }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      automation: {
        id: automation.id,
        name: automation.name,
        status: automation.status,
        isActive: automation.isActive,
      },
      message: "Automatisation mise à jour avec succès",
    });
  } catch (error) {
    console.error("Error updating automation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'automatisation" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an automation
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { id } = params;

    // Check if automation exists and belongs to user
    const existingAutomation = await prisma.automation.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingAutomation) {
      return NextResponse.json(
        { error: "Automatisation non trouvée" },
        { status: 404 }
      );
    }

    await prisma.automation.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Automatisation supprimée avec succès",
    });
  } catch (error) {
    console.error("Error deleting automation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'automatisation" },
      { status: 500 }
    );
  }
}

// PATCH - Toggle automation active state or update specific fields
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { id } = params;
    const body = await request.json();

    // Check if automation exists and belongs to user
    const existingAutomation = await prisma.automation.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingAutomation) {
      return NextResponse.json(
        { error: "Automatisation non trouvée" },
        { status: 404 }
      );
    }

    const { action, ...updateData } = body;

    let automation;

    if (action === "toggle") {
      // Toggle active state
      automation = await prisma.automation.update({
        where: { id },
        data: {
          isActive: !existingAutomation.isActive,
          status: !existingAutomation.isActive ? "ACTIVE" : "PAUSED",
          updatedAt: new Date(),
        },
      });
    } else if (action === "activate") {
      automation = await prisma.automation.update({
        where: { id },
        data: {
          isActive: true,
          status: "ACTIVE",
          updatedAt: new Date(),
        },
      });
    } else if (action === "deactivate") {
      automation = await prisma.automation.update({
        where: { id },
        data: {
          isActive: false,
          status: "PAUSED",
          updatedAt: new Date(),
        },
      });
    } else if (action === "increment_trigger") {
      automation = await prisma.automation.update({
        where: { id },
        data: {
          triggerCount: { increment: 1 },
          lastTriggeredAt: new Date(),
        },
      });
    } else {
      // Generic partial update
      automation = await prisma.automation.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date(),
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
        triggerCount: automation.triggerCount,
      },
      message: "Automatisation mise à jour avec succès",
    });
  } catch (error) {
    console.error("Error patching automation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'automatisation" },
      { status: 500 }
    );
  }
}
