import { NextRequest, NextResponse } from "next/server";

const BRIDGE_URL = "http://127.0.0.1:8080";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId is required" },
        { status: 400 },
      );
    }

    const attempts: Array<{
      endpoint: string;
      method: string;
      status: number;
      ok: boolean;
      body: string;
    }> = [];

    const tryRequest = async (endpoint: string, method: string) => {
      const resp = await fetch(`${BRIDGE_URL}${endpoint}`, { method });
      const bodyText = await resp.text();
      attempts.push({
        endpoint,
        method,
        status: resp.status,
        ok: resp.ok,
        body: bodyText,
      });
      return { resp, bodyText };
    };

    // Prefer the known supported endpoint used elsewhere in the repo (admin/settings):
    // DELETE /api/sessions?userId=...
    const encoded = encodeURIComponent(userId);
    const first = await tryRequest(`/api/sessions?userId=${encoded}`, "DELETE");
    if (first.resp.ok) {
      if (!first.bodyText) return NextResponse.json({ success: true });
      try {
        const data = JSON.parse(first.bodyText);
        if (typeof data === "object" && data && data.success === undefined) {
          return NextResponse.json({ success: true, ...data });
        }
        return NextResponse.json(data);
      } catch {
        return NextResponse.json({ success: true, message: first.bodyText });
      }
    }

    // Fallback for older bridges:
    const second = await tryRequest(`/api/disconnect?userId=${encoded}`, "POST");
    if (second.resp.ok) {
      if (!second.bodyText) return NextResponse.json({ success: true });
      try {
        const data = JSON.parse(second.bodyText);
        if (typeof data === "object" && data && data.success === undefined) {
          return NextResponse.json({ success: true, ...data });
        }
        return NextResponse.json(data);
      } catch {
        return NextResponse.json({ success: true, message: second.bodyText });
      }
    }

    console.log("[WA Disconnect Proxy] All attempts failed:", { userId, attempts });
    const last = attempts[attempts.length - 1];
    return NextResponse.json(
      {
        success: false,
        message: `Bridge disconnect failed (${attempts
          .map((a) => `${a.method} ${a.endpoint} -> ${a.status}`)
          .join(", ")})`,
        attempts,
      },
      { status: last?.status || 502 },
    );
  } catch (error) {
    console.error("Error disconnecting WhatsApp session via bridge:", error);
    return NextResponse.json(
      { success: false, message: "Bridge not reachable", error: String(error) },
      { status: 500 },
    );
  }
}
