import { ChatOpenAI } from "@langchain/openai";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";

export type LabRole = "system" | "user" | "assistant";

export type LabMessage = {
  role: LabRole;
  content: string;
};

type MemoryState = {
  messages: LabMessage[];
};

const memoryBySessionId = new Map<string, MemoryState>();

export function createSessionId(): string {
  return `lab_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getOrCreateMemory(sessionId: string): MemoryState {
  const existing = memoryBySessionId.get(sessionId);
  if (existing) return existing;
  const created: MemoryState = { messages: [] };
  memoryBySessionId.set(sessionId, created);
  return created;
}

export function clearMemory(sessionId: string): void {
  memoryBySessionId.delete(sessionId);
}

export function buildLangChainMessages(params: {
  systemPrompt?: string;
  memoryMessages?: LabMessage[];
  userPrompt: string;
}): Array<SystemMessage | HumanMessage | AIMessage> {
  const out: Array<SystemMessage | HumanMessage | AIMessage> = [];

  const system = (params.systemPrompt || "").trim();
  if (system) out.push(new SystemMessage(system));

  for (const m of params.memoryMessages || []) {
    const content = String(m?.content || "");
    if (!content) continue;
    if (m.role === "system") out.push(new SystemMessage(content));
    if (m.role === "user") out.push(new HumanMessage(content));
    if (m.role === "assistant") out.push(new AIMessage(content));
  }

  out.push(new HumanMessage(params.userPrompt));
  return out;
}

export function createChatModel(params?: { model?: string; temperature?: number }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY manquante. Ajoute-la dans .env.local");
  }

  return new ChatOpenAI({
    apiKey,
    model: params?.model || "gpt-4o-mini",
    temperature: typeof params?.temperature === "number" ? params.temperature : 0.4,
  });
}
