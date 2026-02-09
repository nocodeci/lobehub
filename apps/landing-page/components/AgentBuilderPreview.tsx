"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bot,
    Sparkles,
    MessageSquare,
    Calendar,
    Database,
    Mail,
    Globe,
    Headphones,
    Check,
    Wand2,
    Store,
    Plus,
    Send,
    Settings,
    Cpu,
    ArrowRight
} from "lucide-react";

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
        },
    },
};

const messageVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.3 }
    },
};

// Types
interface Message {
    id: number;
    role: "user" | "assistant";
    content: string;
}

interface Skill {
    id: string;
    name: string;
    icon: React.ReactNode;
    color: string;
    enabled: boolean;
}

// Toggle Switch (animated)
const Toggle = ({ checked }: { checked: boolean }) => (
    <motion.div
        style={{
            width: 32,
            height: 18,
            borderRadius: 9,
            background: checked ? "#075e54" : "#e5e7eb",
            padding: 2,
            display: "flex",
            alignItems: "center",
            transition: "background 0.3s ease",
        }}
    >
        <motion.div
            animate={{ x: checked ? 14 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "#fff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }}
        />
    </motion.div>
);

// Skill Card (animated)
const SkillCard = ({
    name,
    icon,
    color,
    enabled,
    isAnimating
}: {
    name: string;
    icon: React.ReactNode;
    color: string;
    enabled: boolean;
    isAnimating?: boolean;
}) => (
    <motion.div
        animate={isAnimating ? {
            background: ["rgba(0,0,0,0)", "rgba(7, 94, 84, 0.05)", "rgba(0,0,0,0)"],
            scale: [1, 1.02, 1]
        } : {}}
        transition={{ duration: 0.5 }}
        style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 0",
            borderBottom: "1px solid rgba(0,0,0,0.04)",
        }}
    >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <motion.div
                animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.4 }}
                style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: `${color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: color,
                }}
            >
                {icon}
            </motion.div>
            <div>
                <div style={{ fontWeight: 500, fontSize: 13, color: "#1f2937" }}>
                    {name}
                </div>
                <motion.div
                    animate={isAnimating ? { color: ["#9ca3af", "#10b981"] } : {}}
                    style={{
                        fontSize: 10,
                        color: enabled ? "#10b981" : "#9ca3af",
                        display: "flex",
                        alignItems: "center",
                        gap: 3
                    }}
                >
                    {enabled && <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#10b981" }} />}
                    {enabled ? "Activé" : "Désactivé"}
                </motion.div>
            </div>
        </div>
        <Toggle checked={enabled} />
    </motion.div>
);

// Chat Message
const ChatMessage = ({ message }: { message: Message }) => (
    <motion.div
        variants={messageVariants}
        initial="hidden"
        animate="visible"
        style={{
            display: "flex",
            justifyContent: message.role === "user" ? "flex-end" : "flex-start",
            marginBottom: 12,
        }}
    >
        {message.role === "assistant" && (
            <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg, #075e54, #25d366)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 8,
                flexShrink: 0,
            }}>
                <Wand2 size={16} color="#fff" />
            </div>
        )}
        <div style={{
            maxWidth: "75%",
            padding: "10px 14px",
            borderRadius: message.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
            background: message.role === "user" ? "#075e54" : "#f3f4f6",
            color: message.role === "user" ? "#fff" : "#1f2937",
            fontSize: 13,
            lineHeight: 1.5,
        }}>
            {message.content}
        </div>
    </motion.div>
);

// Typing Indicator
const TypingIndicator = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
        }}
    >
        <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "linear-gradient(135deg, #075e54, #25d366)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <Wand2 size={16} color="#fff" />
        </div>
        <div style={{
            padding: "10px 14px",
            borderRadius: "14px 14px 14px 4px",
            background: "#f3f4f6",
            display: "flex",
            gap: 4,
        }}>
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#9ca3af",
                    }}
                />
            ))}
        </div>
    </motion.div>
);

// Main Component - Fully Automated Animation
export const AgentBuilderPreview = ({ styles: _styles, cx: _cx }: { styles: any; cx: any }) => {
    const [activeTab, setActiveTab] = useState<"chat" | "config">("chat");
    const [animationStep, setAnimationStep] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [animatingSkillId, setAnimatingSkillId] = useState<string | null>(null);

    const [skills, setSkills] = useState<Skill[]>([
        { id: "whatsapp", name: "WhatsApp", icon: <MessageSquare size={16} />, color: "#25d366", enabled: false },
        { id: "calendar", name: "Calendrier", icon: <Calendar size={16} />, color: "#6366f1", enabled: false },
        { id: "database", name: "Base de données", icon: <Database size={16} />, color: "#f59e0b", enabled: false },
        { id: "email", name: "Emails", icon: <Mail size={16} />, color: "#ef4444", enabled: false },
        { id: "web", name: "Navigation Web", icon: <Globe size={16} />, color: "#3b82f6", enabled: false },
        { id: "support", name: "Support Client", icon: <Headphones size={16} />, color: "#ec4899", enabled: false },
    ]);

    const [messages, setMessages] = useState<Message[]>([]);

    const allMessages: Message[] = [
        { id: 1, role: "assistant", content: "👋 Bonjour ! Décrivez-moi l'agent que vous souhaitez créer." },
        { id: 2, role: "user", content: "Je veux un agent commercial pour WhatsApp" },
        { id: 3, role: "assistant", content: "Parfait ! Je configure les compétences WhatsApp, Calendrier et Support..." },
        { id: 4, role: "user", content: "Ajoute aussi la gestion des emails" },
        { id: 5, role: "assistant", content: "✅ Email activé ! Votre agent est prêt à être déployé." },
    ];

    // Enable skill with animation
    const enableSkill = useCallback((skillId: string) => {
        setAnimatingSkillId(skillId);
        setSkills(prev => prev.map(s => s.id === skillId ? { ...s, enabled: true } : s));
        setTimeout(() => setAnimatingSkillId(null), 500);
    }, []);

    // Reset animation
    const resetAnimation = useCallback(() => {
        setMessages([]);
        setAnimationStep(0);
        setActiveTab("chat");
        setSkills(prev => prev.map(s => ({ ...s, enabled: false })));
        setIsTyping(false);
    }, []);

    // Animation sequence
    useEffect(() => {
        let timer: NodeJS.Timeout;

        const runStep = () => {
            switch (animationStep) {
                case 0: // First message (assistant)
                    setIsTyping(true);
                    timer = setTimeout(() => {
                        setIsTyping(false);
                        setMessages([allMessages[0]]);
                        setAnimationStep(1);
                    }, 1500);
                    break;

                case 1: // User response
                    timer = setTimeout(() => {
                        setMessages(prev => [...prev, allMessages[1]]);
                        setAnimationStep(2);
                    }, 2000);
                    break;

                case 2: // Assistant configures + enable skills
                    setIsTyping(true);
                    timer = setTimeout(() => {
                        setIsTyping(false);
                        setMessages(prev => [...prev, allMessages[2]]);
                        // Enable skills one by one
                        setTimeout(() => enableSkill("whatsapp"), 300);
                        setTimeout(() => enableSkill("calendar"), 600);
                        setTimeout(() => enableSkill("support"), 900);
                        setAnimationStep(3);
                    }, 2000);
                    break;

                case 3: // User asks for email
                    timer = setTimeout(() => {
                        setMessages(prev => [...prev, allMessages[3]]);
                        setAnimationStep(4);
                    }, 2500);
                    break;

                case 4: // Assistant adds email
                    setIsTyping(true);
                    timer = setTimeout(() => {
                        setIsTyping(false);
                        setMessages(prev => [...prev, allMessages[4]]);
                        enableSkill("email");
                        setAnimationStep(5);
                    }, 1500);
                    break;

                case 5: // Switch to config tab
                    timer = setTimeout(() => {
                        setActiveTab("config");
                        setAnimationStep(6);
                    }, 2000);
                    break;

                case 6: // Show config for a moment then restart
                    timer = setTimeout(() => {
                        resetAnimation();
                    }, 5000);
                    break;
            }
        };

        runStep();
        return () => clearTimeout(timer);
    }, [animationStep, enableSkill, resetAnimation]);

    const enabledSkillsCount = skills.filter(s => s.enabled).length;

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            style={{
                background: "#fff",
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                overflow: "hidden",
                width: "100%",
                maxWidth: 1100,
                margin: "0 auto",
            }}
        >
            {/* Header */}
            <div style={{
                padding: "16px 20px",
                background: "linear-gradient(135deg, #075e54 0%, #128c7e 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#fff",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            background: "rgba(255,255,255,0.2)",
                            backdropFilter: "blur(10px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Wand2 size={22} />
                    </motion.div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>
                            Créateur d'Agent IA
                        </div>
                        <div style={{ fontSize: 12, opacity: 0.9 }}>
                            Décrivez votre agent, l'IA le construit
                        </div>
                    </div>
                </div>

                {/* Animated Tabs */}
                <div style={{ display: "flex", gap: 4, background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: 4 }}>
                    {[
                        { id: "chat" as const, label: "Chat", icon: MessageSquare },
                        { id: "config" as const, label: "Config", icon: Settings },
                    ].map((tab) => (
                        <motion.div
                            key={tab.id}
                            animate={{
                                background: activeTab === tab.id ? "rgba(255,255,255,0.25)" : "transparent",
                            }}
                            style={{
                                padding: "8px 14px",
                                borderRadius: 6,
                                color: "#fff",
                                fontSize: 12,
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                            }}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                        </motion.div>
                    ))}
                </div>
            </div>

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
                            display: "flex",
                            flexDirection: "column",
                            height: 400,
                        }}
                    >
                        {/* Welcome Banner */}
                        <div style={{
                            padding: "16px 24px",
                            background: "linear-gradient(135deg, rgba(7, 94, 84, 0.03), rgba(37, 211, 102, 0.03))",
                            borderBottom: "1px solid rgba(0,0,0,0.04)",
                            textAlign: "center",
                        }}>
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 12,
                                    background: "linear-gradient(135deg, #075e54, #25d366)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 10px",
                                    boxShadow: "0 4px 16px rgba(7, 94, 84, 0.2)",
                                }}
                            >
                                <Bot size={24} color="#fff" />
                            </motion.div>
                            <div style={{ fontWeight: 700, fontSize: 15, color: "#1f2937" }}>
                                Agent Builder
                            </div>
                            <div style={{ fontSize: 12, color: "#6b7280" }}>
                                Créez votre agent en langage naturel
                            </div>
                        </div>

                        {/* Messages */}
                        <div style={{
                            flex: 1,
                            padding: "16px 20px",
                            overflowY: "auto",
                        }}>
                            <AnimatePresence>
                                {messages.map((msg) => (
                                    <ChatMessage key={msg.id} message={msg} />
                                ))}
                            </AnimatePresence>
                            <AnimatePresence>
                                {isTyping && <TypingIndicator />}
                            </AnimatePresence>
                        </div>

                        {/* Input (decorative) */}
                        <div style={{
                            padding: "12px 20px",
                            borderTop: "1px solid rgba(0,0,0,0.06)",
                            display: "flex",
                            gap: 10,
                            background: "#fafafa",
                        }}>
                            <div
                                style={{
                                    flex: 1,
                                    padding: "12px 16px",
                                    borderRadius: 10,
                                    border: "1px solid #e5e7eb",
                                    fontSize: 14,
                                    color: "#9ca3af",
                                    background: "#fff",
                                }}
                            >
                                Décrivez l'agent que vous voulez créer...
                            </div>
                            <div
                                style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 10,
                                    background: "#075e54",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Send size={18} color="#fff" />
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="config"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            display: "flex",
                            height: 400,
                        }}
                    >
                        {/* Left - Agent Preview */}
                        <div style={{
                            width: 260,
                            borderRight: "1px solid rgba(0,0,0,0.06)",
                            padding: 20,
                            background: "#fafafa",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                        }}>
                            <motion.div
                                animate={{
                                    scale: [1, 1.05, 1],
                                    boxShadow: [
                                        "0 8px 24px rgba(7, 94, 84, 0.2)",
                                        "0 12px 32px rgba(7, 94, 84, 0.3)",
                                        "0 8px 24px rgba(7, 94, 84, 0.2)"
                                    ]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                style={{
                                    width: 72,
                                    height: 72,
                                    borderRadius: 18,
                                    background: "linear-gradient(135deg, #075e54, #25d366)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: 16,
                                }}
                            >
                                <Bot size={36} color="#fff" />
                            </motion.div>

                            <div style={{ fontWeight: 700, fontSize: 17, color: "#1f2937", marginBottom: 4 }}>
                                Agent Commercial
                            </div>
                            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 16 }}>
                                Ventes & Support Client
                            </div>

                            {/* Animated skill icons */}
                            <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap", justifyContent: "center" }}>
                                {skills.filter(s => s.enabled).map((skill, index) => (
                                    <motion.div
                                        key={skill.id}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: 8,
                                            background: `${skill.color}15`,
                                            color: skill.color,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {skill.icon}
                                    </motion.div>
                                ))}
                            </div>

                            {/* Animated Stats */}
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 10,
                                width: "100%",
                            }}>
                                <div style={{
                                    background: "#fff",
                                    borderRadius: 10,
                                    padding: 10,
                                    border: "1px solid rgba(0,0,0,0.06)",
                                }}>
                                    <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 2 }}>
                                        Compétences
                                    </div>
                                    <motion.div
                                        key={enabledSkillsCount}
                                        initial={{ scale: 1.3 }}
                                        animate={{ scale: 1 }}
                                        style={{ fontSize: 18, fontWeight: 700, color: "#075e54" }}
                                    >
                                        {enabledSkillsCount}
                                    </motion.div>
                                </div>
                                <div style={{
                                    background: "#fff",
                                    borderRadius: 10,
                                    padding: 10,
                                    border: "1px solid rgba(0,0,0,0.06)",
                                }}>
                                    <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 2 }}>
                                        Puissance
                                    </div>
                                    <motion.div
                                        key={enabledSkillsCount}
                                        initial={{ scale: 1.3 }}
                                        animate={{ scale: 1 }}
                                        style={{ fontSize: 18, fontWeight: 700, color: "#075e54" }}
                                    >
                                        {Math.min(100, enabledSkillsCount * 20 + 20)}%
                                    </motion.div>
                                </div>
                            </div>

                            <motion.div
                                animate={{
                                    boxShadow: [
                                        "0 4px 12px rgba(7, 94, 84, 0.2)",
                                        "0 6px 20px rgba(7, 94, 84, 0.35)",
                                        "0 4px 12px rgba(7, 94, 84, 0.2)"
                                    ]
                                }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                style={{
                                    width: "100%",
                                    marginTop: 16,
                                    padding: "11px 20px",
                                    borderRadius: 10,
                                    background: "linear-gradient(135deg, #075e54, #128c7e)",
                                    color: "#fff",
                                    fontWeight: 600,
                                    fontSize: 13,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 8,
                                }}
                            >
                                <Sparkles size={16} />
                                Déployer l'agent
                                <ArrowRight size={16} />
                            </motion.div>
                        </div>

                        {/* Right - Skills */}
                        <div style={{ flex: 1, padding: 16, overflowY: "auto" }}>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 12,
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <Cpu size={16} color="#075e54" />
                                    <span style={{ fontWeight: 600, fontSize: 13, color: "#1f2937" }}>
                                        Compétences
                                    </span>
                                    <motion.span
                                        key={enabledSkillsCount}
                                        initial={{ scale: 1.2 }}
                                        animate={{ scale: 1 }}
                                        style={{
                                            padding: "2px 6px",
                                            borderRadius: 8,
                                            background: "rgba(7, 94, 84, 0.1)",
                                            color: "#075e54",
                                            fontSize: 10,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {enabledSkillsCount} actives
                                    </motion.span>
                                </div>
                                <div style={{
                                    padding: "4px 8px",
                                    borderRadius: 6,
                                    background: "rgba(0,0,0,0.05)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                    fontSize: 11,
                                    color: "#6b7280",
                                }}>
                                    <Store size={12} />
                                    Store
                                </div>
                            </div>

                            {skills.map((skill) => (
                                <SkillCard
                                    key={skill.id}
                                    name={skill.name}
                                    icon={skill.icon}
                                    color={skill.color}
                                    enabled={skill.enabled}
                                    isAnimating={animatingSkillId === skill.id}
                                />
                            ))}

                            <div
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    marginTop: 10,
                                    borderRadius: 10,
                                    border: "1px dashed rgba(7, 94, 84, 0.3)",
                                    background: "transparent",
                                    color: "#075e54",
                                    fontSize: 12,
                                    fontWeight: 500,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 8,
                                }}
                            >
                                <Plus size={14} />
                                Ajouter une compétence
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default AgentBuilderPreview;
