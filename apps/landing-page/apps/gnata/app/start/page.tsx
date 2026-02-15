"use client";

import { useState } from "react";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { MiniSidebar } from "@/components/chat/mini-sidebar";
import { ChatMain } from "@/components/chat/chat-main";
import { ChatHeader } from "@/components/chat/chat-header";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { GridPattern } from "@/components/ui/grid-pattern";
import { PreviewPane } from "@/components/chat/preview-pane";
import { useChatStore } from "@/store/chat-store";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { isPreviewOpen } = useChatStore();

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar - Switches between full and mini based on preview state */}
            <AnimatePresence mode="wait" initial={false}>
                {isPreviewOpen ? (
                    <motion.div
                        key="mini-sidebar"
                        initial={{ width: 256, opacity: 1 }}
                        animate={{ width: 64 }}
                        exit={{ width: 256, opacity: 1 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                        className="hidden md:block border-r border-border shrink-0 overflow-hidden"
                    >
                        <MiniSidebar />
                    </motion.div>
                ) : (
                    <motion.div
                        key="full-sidebar"
                        initial={{ width: 64, opacity: 1 }}
                        animate={{ width: 256 }}
                        exit={{ width: 64, opacity: 1 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                        className="hidden md:block border-r border-border shrink-0 overflow-hidden"
                    >
                        <ChatSidebar />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Sidebar Sheet */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetContent
                    side="left"
                    className="w-64 p-0 border-none [&>button]:hidden"
                >
                    <ChatSidebar />
                </SheetContent>
            </Sheet>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Main Chat Area */}
                <motion.div
                    layout
                    initial={false}
                    animate={{
                        width: isPreviewOpen ? "400px" : "100%",
                        borderRightWidth: isPreviewOpen ? "1px" : "0px"
                    }}
                    transition={{ type: "spring", bounce: 0, duration: 0.6 }}
                    className="flex flex-col h-full overflow-hidden relative border-border bg-background z-20"
                >
                    <ChatHeader onMenuClick={() => setSidebarOpen(true)} />
                    <div className="flex-1 overflow-hidden relative">
                        <GridPattern className="pointer-events-none" />
                        <div className="relative z-10 h-full">
                            <ChatMain />
                        </div>
                    </div>
                </motion.div>

                {/* Preview Pane */}
                <AnimatePresence>
                    {isPreviewOpen && (
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", bounce: 0, duration: 0.6 }}
                            className="flex-1 h-full bg-[#050505] relative overflow-hidden z-10"
                        >
                            {/* Background grid from user request */}
                            <div className="absolute inset-0 z-0 hidden dark:block pointer-events-none opacity-50" style={{
                                backgroundImage: `linear-gradient(to right, #1f1f23 1px, transparent 1px), linear-gradient(to bottom, #1f1f23 1px, transparent 1px)`,
                                backgroundSize: '20px 20px',
                                maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
                                WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)'
                            }} />

                            <PreviewPane />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
