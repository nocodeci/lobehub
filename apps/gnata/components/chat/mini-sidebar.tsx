"use client";

import { GnataLogo } from "../GnataLogo";
import { Button } from "@/components/ui/button";
import { PlusIcon, HistoryIcon, Settings2Icon, MessageSquareIcon } from "lucide-react";
import { useChatStore } from "@/store/chat-store";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export function MiniSidebar() {
    const { chats, selectedChatId, selectChat } = useChatStore();

    const handleNewChat = () => {
        localStorage.removeItem("gnata-chat-id");
        selectChat(null);
        window.location.reload();
    };

    const handleSelectChat = (chatId: string) => {
        selectChat(chatId);
        localStorage.setItem("gnata-chat-id", chatId);
        window.location.reload();
    };

    const recentChats = chats.filter((chat) => !chat.isArchived).slice(0, 5);

    return (
        <TooltipProvider delayDuration={100}>
            <nav className="flex h-full w-full flex-col items-center bg-[#0A0A0A] border-r border-white/5 py-4 gap-4">
                {/* Logo */}
                <div className="mb-2">
                    <GnataLogo className="size-8" />
                </div>

                {/* Quick Actions */}
                <div className="flex flex-col gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleNewChat}
                                className="size-10 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
                            >
                                <PlusIcon className="size-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>Nouveau projet</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-10 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5"
                            >
                                <HistoryIcon className="size-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>Activités récentes</p>
                        </TooltipContent>
                    </Tooltip>
                </div>

                {/* Separator */}
                <div className="w-6 h-px bg-white/10" />

                {/* Recent Chats */}
                <div className="flex flex-col gap-1">
                    {recentChats.map((chat) => {
                        const isActive = selectedChatId === chat.id;
                        return (
                            <Tooltip key={chat.id}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleSelectChat(chat.id)}
                                        className={cn(
                                            "size-10 rounded-xl",
                                            isActive
                                                ? "bg-purple-500/20 text-purple-400"
                                                : "text-zinc-500 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <MessageSquareIcon className="size-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p className="max-w-[200px] truncate">{chat.title}</p>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Settings */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href="/settings">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-10 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5"
                            >
                                <Settings2Icon className="size-5" />
                            </Button>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>Paramètres</p>
                    </TooltipContent>
                </Tooltip>
            </nav>
        </TooltipProvider>
    );
}
