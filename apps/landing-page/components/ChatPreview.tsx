"use client";

import React, { useState, useEffect, useRef } from "react";
import { Flexbox, Button } from "@lobehub/ui";
import { Zap, Database } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const conversationScript = [
    {
        role: "assistant",
        content: "Salut ! Je suis ton assistant Connect. Comment puis-je t'aider aujourd'hui ?",
        delay: 1000,
    },
    {
        role: "user",
        content: "Peux-tu synchroniser mes ventes WhatsApp sur Google Sheets ?",
        delay: 2500,
    },
    {
        role: "assistant",
        content: "Bien sûr ! J'ai configuré une automatisation qui extrait les noms, articles et montants de tes discussions pour les envoyer directement dans ton fichier 'Ventes 2024'.",
        delay: 3000,
    },
    {
        role: "user",
        content: "Super ! Et tu peux m'envoyer un récap chaque soir ?",
        delay: 2500,
    },
    {
        role: "assistant",
        content: "C'est fait ! Tu recevras un rapport quotidien à 18h avec le total des ventes et le Top 5 des produits. 📊",
        delay: 2500,
    },
];

export const ChatPreview = ({ styles, cx }: { styles: any; cx: any }) => {
    const [visibleMessages, setVisibleMessages] = useState<typeof conversationScript>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [input, setInput] = useState("");
    const messageListRef = useRef<HTMLDivElement>(null);

    // Auto-play conversation
    useEffect(() => {
        if (currentIndex >= conversationScript.length) {
            // Reset after pause
            const resetTimer = setTimeout(() => {
                setVisibleMessages([]);
                setCurrentIndex(0);
            }, 5000);
            return () => clearTimeout(resetTimer);
        }

        const nextMessage = conversationScript[currentIndex];

        // Show typing indicator before assistant messages
        if (nextMessage.role === "assistant") {
            setIsTyping(true);
            const typingTimer = setTimeout(() => {
                setIsTyping(false);
                setVisibleMessages(prev => [...prev, nextMessage]);
                setCurrentIndex(prev => prev + 1);
            }, 1500);
            return () => clearTimeout(typingTimer);
        } else {
            // User messages appear after delay
            const messageTimer = setTimeout(() => {
                setVisibleMessages(prev => [...prev, nextMessage]);
                setCurrentIndex(prev => prev + 1);
            }, nextMessage.delay);
            return () => clearTimeout(messageTimer);
        }
    }, [currentIndex]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [visibleMessages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;
        setVisibleMessages(prev => [...prev, { role: "user", content: input, delay: 0 }]);
        setInput("");

        // Simulate response
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setVisibleMessages(prev => [...prev, {
                role: "assistant",
                content: "C'est noté ! Je traite ta demande avec l'agent spécialisé. 🚀",
                delay: 0,
            }]);
        }, 1500);
    };

    return (
        <div className={styles.chatPreviewBox}>
            <div className={styles.chatSidebar}>
                <div className={cx(styles.chatSidebarItem, "active")}>
                    <Flexbox horizontal align="center" gap={8}>
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                                background: "var(--brand-primary)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                            }}
                        >
                            <Zap size={16} />
                        </motion.div>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 700 }}>Sales Agent</div>
                            <div style={{ fontSize: 11, color: "#25d366", display: "flex", alignItems: "center", gap: 4 }}>
                                <motion.span
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    style={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: "50%",
                                        background: "#25d366",
                                    }}
                                />
                                En ligne
                            </div>
                        </div>
                    </Flexbox>
                </div>
                <div className={styles.chatSidebarItem}>
                    <Flexbox horizontal align="center" gap={8}>
                        <div
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                                background: "#eee",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Database size={16} />
                        </div>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 700 }}>Data Sync</div>
                            <div style={{ fontSize: 11, opacity: 0.5 }}>
                                Sync Google Sheets
                            </div>
                        </div>
                    </Flexbox>
                </div>
            </div>
            <div className={styles.chatContent}>
                <div className={styles.chatMessageList} ref={messageListRef}>
                    <AnimatePresence>
                        {visibleMessages.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                style={{
                                    alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                                    maxWidth: "min(80%, 400px)",
                                }}
                            >
                                <div
                                    style={{
                                        padding: "10px 14px",
                                        borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                                        fontSize: 13,
                                        lineHeight: 1.5,
                                        background: m.role === "user" ? "var(--brand-primary)" : "#f0f0f0",
                                        color: m.role === "user" ? "#fff" : "#000",
                                        boxShadow: m.role === "user"
                                            ? "0 2px 8px rgba(7, 94, 84, 0.2)"
                                            : "0 2px 4px rgba(0,0,0,0.05)",
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {m.content}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Typing indicator */}
                    <AnimatePresence>
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                style={{
                                    alignSelf: "flex-start",
                                    padding: "12px 16px",
                                    borderRadius: "16px 16px 16px 4px",
                                    background: "#f0f0f0",
                                    display: "flex",
                                    gap: 4,
                                }}
                            >
                                <motion.span
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                                    style={{ width: 6, height: 6, borderRadius: "50%", background: "#888" }}
                                />
                                <motion.span
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }}
                                    style={{ width: 6, height: 6, borderRadius: "50%", background: "#888" }}
                                />
                                <motion.span
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }}
                                    style={{ width: 6, height: 6, borderRadius: "50%", background: "#888" }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div className={styles.chatInputWrapper}>
                    <Flexbox horizontal gap={8} style={{ flexWrap: 'nowrap' }}>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Écrire à l'agent..."
                            style={{
                                flex: 1,
                                minWidth: 0,
                                border: "1px solid #eee",
                                borderRadius: 10,
                                padding: "0 12px",
                                height: 40,
                                outline: "none",
                                fontSize: 14,
                            }}
                        />
                        <Button
                            type="primary"
                            onClick={handleSend}
                            style={{
                                height: 40,
                                borderRadius: 10,
                                background: "var(--brand-primary)",
                                paddingInline: 16,
                                flexShrink: 0,
                                fontSize: 13,
                            }}
                        >
                            Envoyer
                        </Button>
                    </Flexbox>
                </div>
            </div>
        </div>
    );
};
