"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageSquare,
    Bot,
    Zap,
    Calendar,
    Settings,
    MoreHorizontal,
    Send,
    Sparkles,
    Check,
    Clock,
    ChevronRight
} from "lucide-react";

// Types
interface Message {
    id: number;
    role: "user" | "assistant";
    content: string;
    timestamp: string;
}

interface ScheduleDay {
    day: string;
    shortDay: string;
    active: boolean;
    startTime: string;
    endTime: string;
}

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    },
};

const messageVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.95 },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: { duration: 0.3 }
    },
    exit: { opacity: 0, x: 20, scale: 0.95 }
};

// Toggle Component
const Toggle = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
    <motion.div
        onClick={onToggle}
        style={{
            width: 36,
            height: 20,
            borderRadius: 100,
            background: active ? "#075e54" : "#e5e7eb",
            padding: 2,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
    >
        <motion.div
            animate={{ x: active ? 16 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "#fff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }}
        />
    </motion.div>
);

// Schedule Row Component
const ScheduleRow = ({
    day,
    active,
    startTime,
    endTime,
    onToggle,
    index
}: {
    day: string;
    active: boolean;
    startTime: string;
    endTime: string;
    onToggle: () => void;
    index: number;
}) => (
    <motion.div
        variants={itemVariants}
        custom={index}
        style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 12px",
            borderRadius: 10,
            background: active ? "rgba(7, 94, 84, 0.05)" : "transparent",
        }}
        whileHover={{ background: "rgba(0,0,0,0.02)" }}
    >
        <Toggle active={active} onToggle={onToggle} />

        <span style={{
            color: active ? "#075e54" : "#9ca3af",
            fontSize: 13,
            fontWeight: 600,
            width: 35,
            transition: "color 0.2s"
        }}>
            {day}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
            <motion.div
                style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                    fontSize: 12,
                    color: active ? "#374151" : "#9ca3af",
                    fontWeight: 500,
                }}
                whileHover={{ borderColor: "#075e54" }}
            >
                {startTime}
            </motion.div>

            <div style={{
                width: 12,
                height: 2,
                background: active ? "#075e54" : "#d1d5db",
                borderRadius: 1,
                transition: "background 0.2s"
            }} />

            <motion.div
                style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                    fontSize: 12,
                    color: active ? "#374151" : "#9ca3af",
                    fontWeight: 500,
                }}
                whileHover={{ borderColor: "#075e54" }}
            >
                {endTime}
            </motion.div>
        </div>

        <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ cursor: "pointer", opacity: 0.5 }}
        >
            <MoreHorizontal size={16} />
        </motion.div>
    </motion.div>
);

// Chat Message Component
const ChatMessage = ({ message, index }: { message: Message; index: number }) => (
    <motion.div
        variants={messageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        custom={index}
        style={{
            alignSelf: message.role === "user" ? "flex-end" : "flex-start",
            maxWidth: "80%",
        }}
    >
        <motion.div
            style={{
                padding: "10px 14px",
                borderRadius: message.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: message.role === "user" ? "#075e54" : "#f3f4f6",
                color: message.role === "user" ? "#fff" : "#1f2937",
                fontSize: 13,
                lineHeight: 1.5,
                boxShadow: message.role === "user"
                    ? "0 2px 8px rgba(7, 94, 84, 0.2)"
                    : "0 1px 3px rgba(0,0,0,0.05)",
            }}
            whileHover={{ scale: 1.02 }}
        >
            {message.content}
            <div style={{
                fontSize: 10,
                opacity: 0.6,
                marginTop: 4,
                textAlign: message.role === "user" ? "right" : "left"
            }}>
                {message.timestamp}
            </div>
        </motion.div>
    </motion.div>
);

// Main Component
export const PlatformPreview = ({ styles, cx }: { styles: any; cx: any }) => {
    const [activeTab, setActiveTab] = useState<"chat" | "schedule">("chat");
    const [scheduleData, setScheduleData] = useState<ScheduleDay[]>([
        { day: "Lun", shortDay: "L", active: true, startTime: "8h30", endTime: "17h00" },
        { day: "Mar", shortDay: "M", active: true, startTime: "9h00", endTime: "18h30" },
        { day: "Mer", shortDay: "M", active: true, startTime: "10h00", endTime: "19h00" },
        { day: "Jeu", shortDay: "J", active: true, startTime: "8h30", endTime: "17h00" },
        { day: "Ven", shortDay: "V", active: true, startTime: "8h00", endTime: "16h00" },
        { day: "Sam", shortDay: "S", active: false, startTime: "—", endTime: "—" },
        { day: "Dim", shortDay: "D", active: false, startTime: "—", endTime: "—" },
    ]);

    const [messages, setMessages] = useState<Message[]>([
        { id: 1, role: "assistant", content: "👋 Bonjour ! Je suis votre assistant Connect. Comment puis-je vous aider ?", timestamp: "10:30" },
        { id: 2, role: "user", content: "Je voudrais configurer mes horaires de disponibilité", timestamp: "10:31" },
    ]);

    const [isTyping, setIsTyping] = useState(false);

    // Simulate typing effect
    useEffect(() => {
        if (messages.length === 2) {
            setIsTyping(true);
            const timeout = setTimeout(() => {
                setIsTyping(false);
                setMessages(prev => [...prev, {
                    id: 3,
                    role: "assistant",
                    content: "Parfait ! J'ai préparé vos horaires. Vous pouvez les modifier en cliquant sur l'onglet \"Horaires\" ci-dessus.",
                    timestamp: "10:32"
                }]);
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [messages.length]);

    const toggleDay = (index: number) => {
        setScheduleData(prev => prev.map((item, i) =>
            i === index ? { ...item, active: !item.active } : item
        ));
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            style={{
                background: "#fff",
                borderRadius: 20,
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                overflow: "hidden",
                width: "100%",
                maxWidth: 500,
            }}
        >
            {/* Header */}
            <motion.div
                variants={itemVariants}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 20px",
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                    background: "linear-gradient(to right, rgba(7, 94, 84, 0.03), transparent)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <motion.div
                        whileHover={{ rotate: 10 }}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 12,
                            background: "linear-gradient(135deg, #075e54, #25d366)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                        }}
                    >
                        <Bot size={20} />
                    </motion.div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#1f2937" }}>
                            Agent Commercial
                        </div>
                        <div style={{ fontSize: 12, color: "#10b981", display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
                            En ligne
                        </div>
                    </div>
                </div>
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{ cursor: "pointer" }}
                >
                    <Settings size={18} color="#9ca3af" />
                </motion.div>
            </motion.div>

            {/* Tab Navigation */}
            <motion.div
                variants={itemVariants}
                style={{
                    display: "flex",
                    gap: 4,
                    padding: "12px 16px",
                    background: "#f9fafb",
                }}
            >
                {[
                    { id: "chat" as const, label: "Chat", icon: MessageSquare },
                    { id: "schedule" as const, label: "Horaires", icon: Calendar },
                ].map((tab) => (
                    <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            padding: "10px 16px",
                            borderRadius: 10,
                            border: "none",
                            background: activeTab === tab.id ? "#fff" : "transparent",
                            color: activeTab === tab.id ? "#075e54" : "#6b7280",
                            fontWeight: 600,
                            fontSize: 13,
                            cursor: "pointer",
                            boxShadow: activeTab === tab.id ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
                            transition: "all 0.2s",
                        }}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </motion.button>
                ))}
            </motion.div>

            {/* Content */}
            <AnimatePresence mode="wait">
                {activeTab === "chat" ? (
                    <motion.div
                        key="chat"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            height: 320,
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {/* Messages */}
                        <div style={{
                            flex: 1,
                            padding: 16,
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                            overflowY: "auto",
                        }}>
                            <AnimatePresence>
                                {messages.map((msg, i) => (
                                    <ChatMessage key={msg.id} message={msg} index={i} />
                                ))}
                            </AnimatePresence>

                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{
                                        alignSelf: "flex-start",
                                        padding: "12px 16px",
                                        borderRadius: "16px 16px 16px 4px",
                                        background: "#f3f4f6",
                                    }}
                                >
                                    <motion.div
                                        style={{ display: "flex", gap: 4 }}
                                    >
                                        {[0, 1, 2].map((i) => (
                                            <motion.span
                                                key={i}
                                                animate={{ y: [0, -4, 0] }}
                                                transition={{
                                                    duration: 0.6,
                                                    repeat: Infinity,
                                                    delay: i * 0.15,
                                                }}
                                                style={{
                                                    width: 6,
                                                    height: 6,
                                                    borderRadius: "50%",
                                                    background: "#9ca3af",
                                                }}
                                            />
                                        ))}
                                    </motion.div>
                                </motion.div>
                            )}
                        </div>

                        {/* Input */}
                        <div style={{
                            padding: "12px 16px",
                            borderTop: "1px solid rgba(0,0,0,0.06)",
                            display: "flex",
                            gap: 8,
                        }}>
                            <input
                                placeholder="Écrire un message..."
                                style={{
                                    flex: 1,
                                    padding: "10px 14px",
                                    borderRadius: 10,
                                    border: "1px solid #e5e7eb",
                                    fontSize: 13,
                                    outline: "none",
                                }}
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 10,
                                    border: "none",
                                    background: "#075e54",
                                    color: "#fff",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Send size={16} />
                            </motion.button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="schedule"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        variants={containerVariants}
                        style={{
                            padding: 16,
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                            height: 320,
                            overflowY: "auto",
                        }}
                    >
                        <motion.div
                            variants={itemVariants}
                            style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#6b7280",
                                marginBottom: 8,
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                            }}
                        >
                            <Clock size={14} />
                            Horaires de disponibilité
                        </motion.div>

                        {scheduleData.map((day, index) => (
                            <ScheduleRow
                                key={day.day}
                                day={day.day}
                                active={day.active}
                                startTime={day.startTime}
                                endTime={day.endTime}
                                onToggle={() => toggleDay(index)}
                                index={index}
                            />
                        ))}

                        <motion.button
                            variants={itemVariants}
                            whileHover={{ scale: 1.02, background: "rgba(7, 94, 84, 0.08)" }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                marginTop: 8,
                                padding: "12px 16px",
                                borderRadius: 10,
                                border: "1px dashed #075e54",
                                background: "rgba(7, 94, 84, 0.03)",
                                color: "#075e54",
                                fontWeight: 600,
                                fontSize: 13,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                            }}
                        >
                            <Sparkles size={16} />
                            Enregistrer les modifications
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default PlatformPreview;
