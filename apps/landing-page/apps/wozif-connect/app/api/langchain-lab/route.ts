import { NextRequest, NextResponse } from "next/server";
import {
  buildLangChainMessages,
  clearMemory,
  createChatModel,
  createSessionId,
  getOrCreateMemory,
  type LabMessage,
} from "@/lib/langchain/lab";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    const prompt = String(body?.prompt || "").trim();
    const systemPrompt = String(body?.systemPrompt || "").trim();
    const model = String(body?.model || "").trim() || "gpt-4o-mini";
    const temperature = typeof body?.temperature === "number" ? body.temperature : undefined;
    const useMemory = Boolean(body?.useMemory);
    const resetMemory = Boolean(body?.resetMemory);

    let sessionId = String(body?.sessionId || "").trim();
    if (!sessionId) sessionId = createSessionId();

    if (!prompt) {
      return NextResponse.json({ success: false, error: "Prompt requis" }, { status: 400 });
    }

    if (resetMemory) {
      clearMemory(sessionId);
    }

    const memory = getOrCreateMemory(sessionId);

    const messages = buildLangChainMessages({
      systemPrompt,
      memoryMessages: useMemory ? memory.messages : [],
      userPrompt: prompt,
    });

    const llm = createChatModel({ model, temperature });
    const res = await llm.invoke(messages);

    const output = String((res as any)?.content ?? "");

    if (useMemory) {
      const nextMessages: LabMessage[] = [];
      if (systemPrompt) {
        nextMessages.push({ role: "system", content: systemPrompt });
      }
      for (const m of memory.messages) nextMessages.push(m);
      nextMessages.push({ role: "user", content: prompt });
      nextMessages.push({ role: "assistant", content: output });

      memory.messages = nextMessages.slice(-30);
    }

    return NextResponse.json({
      success: true,
      sessionId,
      output,
      memorySize: useMemory ? getOrCreateMemory(sessionId).messages.length : 0,
    });
  } catch (error: any) {
    const message = error?.message || String(error);
    return NextResponse.json(
      { success: false, error: "Erreur LangChain", details: message },
      { status: 500 }
    );
  }
}
