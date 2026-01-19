"use client";

import { useState, useEffect } from "react";
import { ChatWelcomeScreen } from "./chat-welcome-screen";
import { ChatConversationView } from "./chat-conversation-view";
import { useChat } from "@ai-sdk/react";
import { useChatStore } from "@/store/chat-store";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  toolInvocations?: unknown[];
}

interface DBMessage {
  id: string;
  role: string;
  content: string;
  timestamp: string;
  toolInvocations?: {
    toolCalls?: unknown[];
    toolResults?: unknown[];
  };
}

export function ChatMain() {
  const [input, setInput] = useState(""); // Manage input locally for stability
  const [selectedMode, setSelectedMode] = useState("fast");
  const [isConversationStarted, setIsConversationStarted] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);

  // Use Vercel AI SDK v6 for chat management
  const { messages, status, sendMessage, setMessages } = useChat();
  const { fetchChats, selectChat } = useChatStore();

  // Load chatId from session on mount
  useEffect(() => {
    const savedChatId = localStorage.getItem("gnata-chat-id");
    if (savedChatId) {
      setChatId(savedChatId);
      selectChat(savedChatId);
      // Fetch history for this chatId
      fetch(`/api/chat/history/${savedChatId}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch history');
          return res.json();
        })
        .then((data: DBMessage[]) => {
          if (Array.isArray(data)) {
            const history = data.map((m) => ({
              id: m.id,
              role: m.role as "user" | "assistant",
              content: m.content,
              parts: [{ type: 'text', text: m.content }],
              createdAt: new Date(m.timestamp),
              toolInvocations: m.toolInvocations ? (m.toolInvocations.toolCalls || m.toolInvocations.toolResults) : undefined
            }));
            const typedHistory = history as unknown as Parameters<typeof setMessages>[0];
            setMessages(typedHistory);
          }
        })
        .catch(err => console.error("Error loading history:", err));
    }
  }, [setMessages]);

  // Save chatId when it changes
  useEffect(() => {
    if (chatId) {
      localStorage.setItem("gnata-chat-id", chatId);
    } else {
      localStorage.removeItem("gnata-chat-id");
    }
  }, [chatId]);

  // Check if conversation has started
  useEffect(() => {
    if (messages.length > 0) {
      setIsConversationStarted(true);
    }
  }, [messages]);

  // Transform AI SDK messages to UI Message format
  const uiMessages: Message[] = messages.map(m => {
    const toolParts = (m.parts || []).filter(p =>
      p.type === 'tool-invocation' ||
      p.type === 'dynamic-tool' ||
      (typeof p.type === 'string' && p.type.startsWith('tool-'))
    );

    const contentText = (m as { text?: string }).text ||
      (m as { content?: string }).content ||
      (m.parts || [])
        .filter(p => p.type === 'text')
        .map(p => (p as { text?: string }).text || "")
        .join('');

    return {
      id: m.id,
      content: contentText,
      sender: m.role === 'user' ? 'user' : 'ai',
      timestamp: (m as { createdAt?: Date }).createdAt || new Date(),
      toolInvocations: toolParts.map(p => {
        let toolName = (p as { toolName?: string }).toolName;
        if (!toolName && typeof p.type === 'string' && p.type.startsWith('tool-') && p.type !== 'tool-invocation') {
          toolName = p.type.replace('tool-', '');
        }
        return { ...p, toolName };
      })
    };
  });

  const handleSend = async () => {
    if (!input?.trim()) return;
    if (status !== 'ready' && status !== undefined && status !== 'error') return;

    let currentChatId = chatId;
    const isNewChat = !currentChatId;
    if (isNewChat) {
      currentChatId = crypto.randomUUID();
      setChatId(currentChatId);
    }

    const currentInput = input;
    setInput(""); // Clear UI immediately
    await sendMessage({ text: currentInput }, { body: { chatId: currentChatId } });

    // Refresh sidebar after a short delay to let backend save
    if (isNewChat) {
      setTimeout(fetchChats, 500);
    }
  };

  const handleReset = () => {
    setIsConversationStarted(false);
    setMessages([]);
    setInput("");
    setChatId(null);
    localStorage.removeItem("gnata-chat-id");
  };

  const handleSendMessage = async (content: string) => {
    if (!content?.trim()) return;

    let currentChatId = chatId;
    const isNewChat = !currentChatId;
    if (isNewChat) {
      currentChatId = crypto.randomUUID();
      setChatId(currentChatId);
    }

    await sendMessage({ text: content }, { body: { chatId: currentChatId } });

    if (isNewChat) {
      setTimeout(fetchChats, 500);
    }
  };

  if (isConversationStarted) {
    return (
      <ChatConversationView
        messages={uiMessages}
        message={input}
        onMessageChange={setInput}
        onSend={handleSendMessage}
        isLoading={status === 'submitted' || status === 'streaming'}
      />
    );
  }

  return (
    <ChatWelcomeScreen
      onMessageChange={setInput}
      onSend={handleSend}
      selectedMode={selectedMode}
      onModeChange={setSelectedMode}
    />
  );
}
