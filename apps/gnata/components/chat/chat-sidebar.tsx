"use client";

import { useState, useEffect } from "react";
import {
  SearchIcon,
  PlusIcon,
  MessageSquareIcon,
  ArchiveIcon,
  ArchiveRestoreIcon,
  Trash2Icon,
  MoreHorizontalIcon,
  ClockIcon,
  ZapIcon,
  Settings2Icon,
  HistoryIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useChatStore } from "@/store/chat-store";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GnataLogo } from "../GnataLogo";

export function ChatSidebar() {
  const {
    chats,
    selectedChatId,
    selectChat,
    fetchChats,
    archiveChat,
    deleteChat,
    isLoading
  } = useChatStore();

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 8000); // More frequent polling
    return () => clearInterval(interval);
  }, [fetchChats]);

  const handleSelectChat = (chatId: string) => {
    selectChat(chatId);
    localStorage.setItem("gnata-chat-id", chatId);
    window.location.reload();
  };

  const handleNewChat = () => {
    localStorage.removeItem("gnata-chat-id");
    selectChat(null);
    window.location.reload();
  };

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentChats = filteredChats.filter((chat) => !chat.isArchived).slice(0, 15);
  const archivedChats = filteredChats.filter((chat) => chat.isArchived);

  return (
    <nav className="flex h-full w-full flex-col bg-[#0A0A0A] border-r border-white/5 text-zinc-300">
      {/* Header with New Chat & Search */}
      <div className="p-3 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 px-1">
            <GnataLogo className="size-6" />
            <span className="font-bold text-white tracking-tight">Gnata</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNewChat}
            className="size-8 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white"
          >
            <PlusIcon className="size-5" />
          </Button>
        </div>

        <div className="relative group">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 h-9 bg-white/[0.03] border-white/5 focus:bg-white/[0.05] focus:border-purple-500/30 transition-all rounded-xl text-sm"
          />
        </div>
      </div>

      <Separator className="bg-white/5" />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-2 space-y-6">

        {/* Navigation Items */}
        <div className="space-y-1">
          <Button
            variant="ghost"
            onClick={handleNewChat}
            className="w-full justify-start gap-3 px-3 h-10 rounded-xl hover:bg-white/5 group translate-y-0 transition-all"
          >
            <div className="size-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <PlusIcon className="size-4" />
            </div>
            <span className="text-sm font-medium">Lancer un projet</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 px-3 h-10 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-colors">
            <HistoryIcon className="size-4" />
            <span className="text-sm">Activités récentes</span>
          </Button>
        </div>

        {/* Chats History Section */}
        <div className="space-y-1">
          <div className="px-3 py-2 flex items-center justify-between group/header">
            <h2 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Vos chats</h2>
            {isLoading && <ClockIcon className="size-3 animate-spin text-zinc-600" />}
          </div>

          <div className="space-y-0.5">
            {recentChats.length === 0 && !isLoading && (
              <div className="px-3 py-8 text-center bg-white/[0.01] rounded-2xl border border-dashed border-white/5 mx-2 mt-2">
                <p className="text-xs text-zinc-600">Aucun projet en cours</p>
                <Button variant="link" onClick={handleNewChat} className="text-purple-400/70 text-xs h-auto p-0 mt-1">Créer le premier</Button>
              </div>
            )}

            {recentChats.map((chat) => {
              const isActive = selectedChatId === chat.id;
              return (
                <div
                  key={chat.id}
                  className={cn(
                    "group relative flex items-center rounded-xl overflow-hidden transition-all mx-1 mb-0.5",
                    isActive
                      ? "bg-purple-500/15 border border-purple-500/30 ring-1 ring-purple-500/20"
                      : "hover:bg-white/[0.04] border border-transparent"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-purple-500 rounded-full" />
                  )}
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex-1 justify-start gap-3 px-3 text-left h-10 py-1.5 min-w-0 pr-10",
                      isActive ? "text-white font-semibold" : "text-zinc-400 hover:text-zinc-200"
                    )}
                    onClick={() => handleSelectChat(chat.id)}
                  >
                    <MessageSquareIcon className={cn("size-4 shrink-0 transition-colors", isActive ? "text-purple-400" : "text-zinc-600")} />
                    <span className="text-sm truncate font-medium">
                      {chat.title}
                    </span>
                  </Button>

                  <div className="absolute right-1 flex opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 rounded-lg hover:bg-white/10 text-zinc-500"
                        >
                          <MoreHorizontalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-48 bg-[#1A1A1A] border-white/10 text-zinc-300"
                        side="right"
                        align="start"
                      >
                        <DropdownMenuItem className="gap-2 focus:bg-white/5 cursor-pointer">
                          <ZapIcon className="size-4 text-purple-400" />
                          <span>Prioriser</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => archiveChat(chat.id)} className="gap-2 focus:bg-white/5 cursor-pointer">
                          <ArchiveIcon className="size-4 text-zinc-400" />
                          <span>Archiver</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/5" />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => deleteChat(chat.id)}
                          className="gap-2 cursor-pointer"
                        >
                          <Trash2Icon className="size-4 text-red-400" />
                          <span className="text-red-400">Supprimer</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Archives if any */}
        {archivedChats.length > 0 && (
          <div className="space-y-1">
            <h2 className="px-3 py-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Archives</h2>
            {archivedChats.map((chat) => (
              <div key={chat.id} className="group flex items-center mx-1 rounded-xl hover:bg-white/[0.03] transition-all">
                <Button
                  variant="ghost"
                  className="flex-1 justify-start gap-3 px-3 text-left h-9 py-1 text-zinc-500"
                  onClick={() => handleSelectChat(chat.id)}
                >
                  <ArchiveRestoreIcon className="size-3.5" />
                  <span className="text-xs truncate">{chat.title}</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Profile */}
      <div className="p-4 mt-auto">
        <div className="rounded-2xl bg-gradient-to-br from-purple-500/10 via-transparent to-transparent p-px border border-white/5 overflow-hidden">
          <div className="bg-[#0D0D0D]/50 backdrop-blur-xl p-3 flex items-center gap-3">
            <Avatar className="size-9 rounded-xl border border-white/10 shadow-xl">
              <AvatarImage src="/avatar.png" alt="User" />
              <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xs">UK</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Yohan Koffi</p>
              <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                Plan Gratuit
              </p>
            </div>
            <Button variant="ghost" size="icon" className="size-8 text-zinc-600 hover:text-zinc-200">
              <Settings2Icon className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

