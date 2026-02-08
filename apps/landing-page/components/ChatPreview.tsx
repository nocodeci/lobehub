"use client";

import React, { useState } from "react";
import { Flexbox, Button } from "@lobehub/ui";
import { Zap, Database } from "lucide-react";

export const ChatPreview = ({ styles, cx }: { styles: any; cx: any }) => {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content:
                "Salut ! Je suis ton assistant Connect. Comment puis-je t'aider aujourd'hui ?",
        },
        {
            role: "user",
            content: "Peux-tu synchroniser mes ventes WhatsApp sur Google Sheets ?",
        },
        {
            role: "assistant",
            content:
                "Bien sûr ! J’ai configuré une automatisation qui extrait les noms, articles et montants de tes discussions pour les envoyer directement dans ton fichier 'Ventes 2024'.",
        },
    ]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;
        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setInput("");
        setTimeout(() => {
            setMessages([
                ...newMessages,
                {
                    role: "assistant",
                    content: "C'est noté ! Je traite ta demande avec l'agent spécialisé.",
                },
            ]);
        }, 1000);
    };

    return (
        <div className={styles.chatPreviewBox}>
            <div className={styles.chatSidebar}>
                <div className={cx(styles.chatSidebarItem, "active")}>
                    <Flexbox horizontal align="center" gap={8}>
                        <div
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
                        </div>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 700 }}>Sales Agent</div>
                            <div style={{ fontSize: 11, opacity: 0.5 }}>En ligne</div>
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
                <div className={styles.chatMessageList}>
                    {messages.map((m, i) => (
                        <div
                            key={i}
                            style={{
                                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                                maxWidth: "80%",
                            }}
                        >
                            <div
                                style={{
                                    padding: "12px 16px",
                                    borderRadius: 16,
                                    fontSize: 14,
                                    background:
                                        m.role === "user" ? "var(--brand-primary)" : "#f0f0f0",
                                    color: m.role === "user" ? "#fff" : "#000",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                                }}
                            >
                                {m.content}
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.chatInputWrapper}>
                    <Flexbox horizontal gap={12}>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Écrire à l'agent..."
                            style={{
                                flex: 1,
                                border: "1px solid #eee",
                                borderRadius: 12,
                                padding: "0 16px",
                                height: 44,
                                outline: "none",
                            }}
                        />
                        <Button
                            type="primary"
                            onClick={handleSend}
                            style={{
                                height: 44,
                                borderRadius: 12,
                                background: "var(--brand-primary)",
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
