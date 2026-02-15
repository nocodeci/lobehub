import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont requis." },
        { status: 400 }
      );
    }

    const MAILTRAP_API_TOKEN = process.env.MAILTRAP_API_TOKEN;

    if (!MAILTRAP_API_TOKEN) {
      console.error("MAILTRAP_API_TOKEN is not set");
      return NextResponse.json(
        { error: "Configuration email manquante." },
        { status: 500 }
      );
    }

    const response = await fetch("https://send.api.mailtrap.io/api/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MAILTRAP_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: {
          email: "hello@wozif.com",
          name: "Wozif Contact",
        },
        to: [
          {
            email: "yohankoffik225@gmail.com",
          },
        ],
        subject: `Nouveau message de ${name}`,
        text: `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <div style="font-family: 'Outfit', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #1A1A1A; padding: 24px; border-radius: 12px 12px 0 0;">
              <h1 style="color: #FF7A00; margin: 0; font-size: 24px; font-weight: 800;">WOZIF</h1>
              <p style="color: #999; margin: 8px 0 0; font-size: 14px;">Nouveau message depuis le site</p>
            </div>
            <div style="background: #ffffff; padding: 24px; border: 1px solid #eee; border-top: none; border-radius: 0 0 12px 12px;">
              <p style="margin: 0 0 8px;"><strong>Nom:</strong> ${name}</p>
              <p style="margin: 0 0 8px;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
              <p style="margin: 0 0 8px;"><strong>Message:</strong></p>
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
        `,
        category: "Contact Form",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Mailtrap error:", errorData);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Email envoyé avec succès." });
  } catch (error) {
    console.error("Send email error:", error);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
