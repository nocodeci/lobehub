"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
};

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function Home() {
  const initialConversations = useMemo<Conversation[]>(
    () => [
      {
        id: "default",
        title: "New Chat",
        messages: [
          {
            id: uid(),
            role: "assistant",
            content:
              "Salut. C’est un starter UI type LobeChat. Écris un message en bas pour tester.",
          },
        ],
      },
    ],
    []
  );

  const [conversations, setConversations] = useState<Conversation[]>(
    initialConversations
  );
  const [activeConversationId, setActiveConversationId] =
    useState<string>("default");
  const [input, setInput] = useState<string>("");
  const [isThinking, setIsThinking] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);

  const activeConversation = useMemo(() => {
    return (
      conversations.find((c) => c.id === activeConversationId) ||
      conversations[0]
    );
  }, [activeConversationId, conversations]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [activeConversation?.messages.length]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: uid(),
      role: "user",
      content: trimmed,
    };

    setInput("");
    setIsThinking(true);

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId
          ? { ...c, messages: [...c.messages, userMsg] }
          : c
      )
    );

    await new Promise((r) => setTimeout(r, 350));

    const assistantMsg: ChatMessage = {
      id: uid(),
      role: "assistant",
      content:
        "OK. Prochaine étape: brancher cet input sur ton endpoint `/api/chat` de wozif-connect (ou un backend dédié).",
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId
          ? { ...c, messages: [...c.messages, assistantMsg] }
          : c
      )
    );
    setIsThinking(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl">
        <aside className="hidden w-[280px] flex-col border-r border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-950 md:flex">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-semibold">Wozif Lobe UI</div>
            <button
              className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-medium hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-white/5"
              onClick={() => {
                const id = uid();
                const conv: Conversation = {
                  id,
                  title: "New Chat",
                  messages: [
                    {
                      id: uid(),
                      role: "assistant",
                      content: "Nouveau chat créé.",
                    },
                  ],
                };
                setConversations((prev) => [conv, ...prev]);
                setActiveConversationId(id);
              }}
              type="button"
            >
              New
            </button>
          </div>

          <div className="flex flex-col gap-1">
            {conversations.map((c) => {
              const active = c.id === activeConversationId;
              return (
                <button
                  key={c.id}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    active
                      ? "bg-zinc-100 text-zinc-950 dark:bg-white/10 dark:text-white"
                      : "hover:bg-zinc-50 dark:hover:bg-white/5"
                  }`}
                  onClick={() => setActiveConversationId(c.id)}
                  type="button"
                >
                  <div className="truncate font-medium">{c.title}</div>
                  <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {c.messages[c.messages.length - 1]?.content || ""}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="flex flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-zinc-950">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">
                {activeConversation?.title || "Chat"}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Starter UI (local)
              </div>
            </div>

            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {isThinking ? "Thinking…" : "Ready"}
            </div>
          </header>

          <div
            ref={listRef}
            className="flex-1 overflow-y-auto px-4 py-6"
          >
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
              {activeConversation?.messages.map((m) => {
                const isUser = m.role === "user";
                return (
                  <div
                    key={m.id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                        isUser
                          ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                          : "bg-white text-zinc-900 ring-1 ring-zinc-200 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-white/10"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-zinc-200 bg-white px-4 py-4 dark:border-white/10 dark:bg-zinc-950">
            <div className="mx-auto flex w-full max-w-3xl gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!isThinking) void sendMessage();
                  }
                }}
                className="h-11 flex-1 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-400 dark:border-white/10 dark:bg-zinc-950 dark:focus:border-white/20"
                placeholder="Écris un message…"
              />
              <button
                className="h-11 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                onClick={() => void sendMessage()}
                disabled={isThinking || !input.trim()}
                type="button"
              >
                Send
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
