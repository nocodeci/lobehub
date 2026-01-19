"use client";

import { useState } from "react";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatMain } from "@/components/chat/chat-main";
import { ChatHeader } from "@/components/chat/chat-header";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { GridPattern } from "@/components/ui/grid-pattern";

export default function ChatPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <div className="hidden md:block w-64 border-r border-border">
                <ChatSidebar />
            </div>

            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetContent
                    side="left"
                    className="w-64 p-0 border-none [&>button]:hidden"
                >
                    <ChatSidebar />
                </SheetContent>
            </Sheet>

            <div className="flex flex-1 flex-col overflow-hidden">
                <ChatHeader onMenuClick={() => setSidebarOpen(true)} />

                <div className="flex-1 overflow-hidden relative">
                    <GridPattern className="pointer-events-none" />

                    <div className="relative z-10 h-full">
                        <ChatMain />
                    </div>
                </div>
            </div>
        </div>
    );
}
