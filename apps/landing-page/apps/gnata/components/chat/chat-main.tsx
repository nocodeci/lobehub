"use client";

import { useState, useEffect } from "react";
import { ChatWelcomeScreen } from "./chat-welcome-screen";
import { ChatConversationView } from "./chat-conversation-view";
import { useChat } from "@ai-sdk/react";
import { useChatStore } from "@/store/chat-store";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;

  const [input, setInput] = useState(""); // Manage input locally for stability
  const [selectedMode, setSelectedMode] = useState("ecommerce");
  const [isConversationStarted, setIsConversationStarted] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);

  // Use Vercel AI SDK v6 for chat management
  const { messages, status, sendMessage, setMessages } = useChat();
  const { fetchChats, selectChat, setPreviewState } = useChatStore();

  const handleReset = () => {
    setIsConversationStarted(false);
    setMessages([]);
    setInput("");
    setChatId(null);
    localStorage.removeItem("gnata-chat-id");
  };

  // Load chatId from session on mount
  useEffect(() => {
    const savedChatId = localStorage.getItem("gnata-chat-id");
    if (savedChatId) {
      setChatId(savedChatId);
      selectChat(savedChatId);

      // Fetch history with ownership check
      fetch(`/api/chat/history/${savedChatId}`)
        .then(async res => {
          if (res.status === 403 || res.status === 401) {
            // Not our chat! Clear it and redirect to welcome
            handleReset();
            throw new Error('Unauthorized or expired session');
          }
          if (!res.ok) throw new Error('Failed to fetch history');
          return res.json();
        })
        .then((data: DBMessage[]) => {
          if (Array.isArray(data) && data.length > 0) {
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
        .catch(err => {
          console.warn("Chat init info:", err.message);
        });
    }
  }, [setMessages, selectChat]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle initial prompt from URL
  useEffect(() => {
    if (!isConversationStarted && !chatId) {
      const initialPrompt = searchParams?.get('prompt');
      if (initialPrompt && initialPrompt.trim() && initialPrompt !== "Je veux un site e-commerce pour ") {
        console.log("Found initial prompt in URL:", initialPrompt);
        // Clear param from URL without refreshing
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);

        // Start conversation
        handleSendMessage(initialPrompt);
      }
    }
  }, [isConversationStarted, chatId, searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // Save chatId when it changes
  useEffect(() => {
    if (chatId) {
      localStorage.setItem("gnata-chat-id", chatId);
    } else {
      localStorage.removeItem("gnata-chat-id");
    }
  }, [chatId]);

  // Check if conversation has started and detect payment success
  useEffect(() => {
    if (messages.length > 0) {
      setIsConversationStarted(true);

      // Detect verifyPayment success to trigger preview
      messages.forEach((m: any) => {
        // Check in parts (AI SDK v6 structure)
        if (m.parts && Array.isArray(m.parts)) {
          m.parts.forEach((part: any) => {
            if (part.type === 'tool-invocation' && part.toolName === 'verifyPayment') {
              if (part.state === 'result' && part.result && part.result.paid === true) {
                console.log("Payment confirmed! Triggering preview...");
                setPreviewState('building', true);
              }
            }
          });
        }
        // Also check legacy toolInvocations property
        if (m.toolInvocations && Array.isArray(m.toolInvocations)) {
          m.toolInvocations.forEach((ti: any) => {
            if (ti.toolName === 'verifyPayment' && ti.state === 'result') {
              if (ti.result && ti.result.paid === true) {
                console.log("Payment confirmed (legacy)! Triggering preview...");
                setPreviewState('building', true);
              }
            }
          });
        }

        // Fallback: Check if AI message text contains payment confirmation
        const messageText = (m as any).text || (m as any).content ||
          (m.parts || [])
            .filter((p: any) => p.type === 'text')
            .map((p: any) => p.text || '')
            .join('');

        if (m.role === 'assistant' &&
          messageText &&
          (messageText.includes('Paiement confirmé') ||
            messageText.includes('a commencé la création'))) {
          console.log("Payment confirmation detected in text! Triggering preview...");
          setPreviewState('building', true);
        }
      });
    }
  }, [messages, setPreviewState]);

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
      selectChat(currentChatId); // Sync store immediately
    }

    const currentInput = input;
    setInput(""); // Clear UI immediately
    await sendMessage({ text: currentInput }, { body: { chatId: currentChatId } });

    // Refresh sidebar after a short delay to let backend save
    if (isNewChat) {
      setTimeout(fetchChats, 500);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content?.trim()) return;

    let currentChatId = chatId;
    const isNewChat = !currentChatId;
    if (isNewChat) {
      currentChatId = crypto.randomUUID();
      setChatId(currentChatId);
      selectChat(currentChatId); // Sync store immediately
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
