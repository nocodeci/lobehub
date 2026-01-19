import { create } from "zustand";

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolInvocations?: unknown[];
}

export interface Chat {
  id: string;
  title: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
  messages?: Message[];
}

interface ChatState {
  chats: Chat[];
  selectedChatId: string | null;
  isLoading: boolean;
  selectChat: (chatId: string | null) => void;
  fetchChats: () => Promise<void>;
  archiveChat: (chatId: string) => Promise<void>;
  unarchiveChat: (chatId: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  renameChat: (chatId: string, newTitle: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  selectedChatId: typeof window !== "undefined" ? localStorage.getItem("gnata-chat-id") : null,
  isLoading: false,

  selectChat: (chatId) => set({ selectedChatId: chatId }),

  fetchChats: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/chat/list");
      if (!res.ok) throw new Error("Failed to fetch chats");
      const data = await res.json();
      set({ chats: Array.isArray(data) ? data : [] });
    } catch (error) {
      console.error("Store: Error fetching chats:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  archiveChat: async (chatId) => {
    // Optimistic update
    set((state) => ({
      chats: state.chats.map((c) => c.id === chatId ? { ...c, isArchived: true } : c)
    }));
    // We would call a real API here for permanence
  },

  unarchiveChat: async (chatId) => {
    set((state) => ({
      chats: state.chats.map((c) => c.id === chatId ? { ...c, isArchived: false } : c)
    }));
  },

  deleteChat: async (chatId) => {
    set((state) => ({
      chats: state.chats.filter((c) => c.id !== chatId),
      selectedChatId: state.selectedChatId === chatId ? null : state.selectedChatId
    }));
  },

  renameChat: async (chatId, newTitle) => {
    // Optimistic update
    set((state) => ({
      chats: state.chats.map((c) => c.id === chatId ? { ...c, title: newTitle } : c)
    }));

    try {
      await fetch("/api/chat/rename", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, newTitle }),
      });
    } catch (error) {
      console.error("Store: Error renaming chat:", error);
      // Revert if failed (optional, but good practice)
    }
  },
}));

