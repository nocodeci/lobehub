"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { MenuIcon, ShareIcon, SparklesIcon } from "lucide-react";
import { useChatStore } from "@/store/chat-store";


interface ChatHeaderProps {
    onMenuClick: () => void;
}

export function ChatHeader({ onMenuClick }: ChatHeaderProps) {
    const { chats, selectedChatId } = useChatStore();

    const currentChat = chats.find(c => c.id === selectedChatId);

    return (
        <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-white/5 bg-background/50 backdrop-blur-xl px-4 md:px-6">
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden size-9 rounded-xl hover:bg-white/5"
                onClick={onMenuClick}
            >
                <MenuIcon className="size-5 text-zinc-400" />
            </Button>

            <div className="flex-1 flex items-center gap-3 min-w-0">


                {currentChat && (
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="h-4 w-px bg-white/10 hidden md:block mx-1" />
                        <EditableTitle chat={currentChat} />
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:flex h-8 gap-2 px-3 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all text-xs border border-white/5"
                >
                    <ShareIcon className="size-3.5" />
                    Partager le projet
                </Button>

                <ThemeToggle />
            </div>
        </header>
    );
}

import { useState, useRef, useEffect } from "react";
import { Chat } from "@/store/chat-store";
import { Input } from "@/components/ui/input";
import { PencilIcon } from "lucide-react";

function EditableTitle({ chat }: { chat: Chat }) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(chat.title);
    const { renameChat } = useChatStore();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setTitle(chat.title);
    }, [chat.title]);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
        }
    }, [isEditing]);

    const handleSave = async () => {
        if (!title.trim() || title === chat.title) {
            setTitle(chat.title);
            setIsEditing(false);
            return;
        }
        await renameChat(chat.id, title);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSave();
        } else if (e.key === "Escape") {
            setTitle(chat.title);
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <Input
                ref={inputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="h-8 w-full max-w-[300px] text-sm bg-background/50"
            />
        );
    }

    return (
        <div
            className="group flex items-center gap-2 cursor-pointer hover:bg-white/5 px-2 py-1 rounded-md transition-colors max-w-full"
            onClick={() => setIsEditing(true)}
        >
            <h1 className="text-sm font-medium text-white truncate max-w-[200px] md:max-w-[400px]">
                {title}
            </h1>
            <PencilIcon className="size-3 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
}
