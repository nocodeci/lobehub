"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageSquare,
    Bot,
    Calendar,
    Database,
    Mail,
    Headphones,
    Zap,
    Sparkles,
    Check,
    Send,
    Play,
    Globe,
    Users,
    ArrowRight,
    Shield,
    Cpu,
} from "lucide-react";
import { WhatsAppLogo, GoogleCalendarLogo, GmailLogo, IntercomLogo } from "@/components/Logos";

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }
    },
};

// Step 1: Describe your agent animation
const DescribeAnimation = () => {
    const [textIndex, setTextIndex] = useState(0);
    const [showCursor, setShowCursor] = useState(true);
    const [showAiResponse, setShowAiResponse] = useState(false);
    const fullText = "Je veux un agent commercial...";

    useEffect(() => {
        if (textIndex < fullText.length) {
            const timer = setTimeout(() => setTextIndex(prev => prev + 1), 70);
            return () => clearTimeout(timer);
        } else {
            const responseTimer = setTimeout(() => setShowAiResponse(true), 800);
            const resetTimer = setTimeout(() => {
                setTextIndex(0);
                setShowAiResponse(false);
            }, 4500);
            return () => {
                clearTimeout(responseTimer);
                clearTimeout(resetTimer);
            };
        }
    }, [textIndex, fullText.length]);

    useEffect(() => {
        const cursorInterval = setInterval(() => setShowCursor(prev => !prev), 500);
        return () => clearInterval(cursorInterval);
    }, []);

    return (
        <div style={{
            background: "linear-gradient(145deg, #fafbfc, #fff)",
            borderRadius: 16,
            border: "1px solid rgba(0,0,0,0.06)",
            overflow: "hidden",
            height: 220,
        }}>
            {/* Chat Header */}
            <div style={{
                padding: "10px 14px",
                borderBottom: "1px solid rgba(0,0,0,0.05)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(7,94,84,0.02)",
            }}>
                <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        background: "linear-gradient(135deg, #075e54, #25d366)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 3px 8px rgba(7,94,84,0.2)",
                    }}
                >
                    <Bot size={16} color="#fff" />
                </motion.div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 12, color: "#1f2937", letterSpacing: "-0.3px" }}>Agent Builder</div>
                    <div style={{ fontSize: 9, color: "#10b981", display: "flex", alignItems: "center", gap: 3 }}>
                        <motion.span
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981" }}
                        />
                        En ligne
                    </div>
                </div>
                <div style={{
                    padding: "2px 8px",
                    borderRadius: 6,
                    background: "rgba(7,94,84,0.08)",
                    fontSize: 9,
                    fontWeight: 700,
                    color: "#075e54",
                }}>
                    GPT-4o
                </div>
            </div>

            {/* Chat Content */}
            <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                {/* AI Message */}
                <div style={{ display: "flex", gap: 6 }}>
                    <div style={{
                        padding: "8px 12px",
                        borderRadius: "12px 12px 12px 4px",
                        background: "#f3f4f6",
                        fontSize: 11,
                        color: "#1f2937",
                        maxWidth: "85%",
                        lineHeight: 1.4,
                    }}>
                        Décrivez l'agent que vous voulez créer 🤖
                    </div>
                </div>

                {/* User typing */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div style={{
                        padding: "8px 12px",
                        borderRadius: "12px 12px 4px 12px",
                        background: "linear-gradient(135deg, #075e54, #0a7a6e)",
                        color: "#fff",
                        fontSize: 11,
                        maxWidth: "85%",
                        lineHeight: 1.4,
                        boxShadow: "0 2px 8px rgba(7,94,84,0.15)",
                    }}>
                        {fullText.slice(0, textIndex)}
                        <span style={{ opacity: showCursor ? 1 : 0, fontWeight: 100 }}>|</span>
                    </div>
                </div>

                {/* AI Response */}
                <AnimatePresence>
                    {showAiResponse && (
                        <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.3 }}
                            style={{ display: "flex", gap: 6 }}
                        >
                            <div style={{
                                padding: "8px 12px",
                                borderRadius: "12px 12px 12px 4px",
                                background: "#f3f4f6",
                                fontSize: 11,
                                color: "#1f2937",
                                maxWidth: "85%",
                                lineHeight: 1.4,
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                            }}>
                                <Sparkles size={12} color="#075e54" />
                                Agent créé ! Configurons-le...
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Typing indicator */}
                {textIndex >= fullText.length && !showAiResponse && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ display: "flex", gap: 6 }}
                    >
                        <div style={{
                            padding: "8px 12px",
                            borderRadius: "12px 12px 12px 4px",
                            background: "#f3f4f6",
                            display: "flex",
                            gap: 3,
                        }}>
                            {[0, 1, 2].map(i => (
                                <motion.div
                                    key={i}
                                    animate={{ y: [0, -3, 0] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                                    style={{ width: 5, height: 5, borderRadius: "50%", background: "#9ca3af" }}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

// Step 2: Skills selection animation
const SkillsAnimation = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const skills = [
        { icon: <WhatsAppLogo size={14} />, color: "#25d366", label: "WhatsApp", bg: "rgba(37,211,102,0.08)" },
        { icon: <GoogleCalendarLogo size={14} />, color: "#4285F4", label: "Calendrier", bg: "rgba(66,133,244,0.08)" },
        { icon: <GmailLogo size={14} />, color: "#EA4335", label: "Gmail", bg: "rgba(234,67,53,0.08)" },
        { icon: <IntercomLogo size={14} />, color: "#1F8CEB", label: "Support", bg: "rgba(31,140,235,0.08)" },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % skills.length);
        }, 1200);
        return () => clearInterval(timer);
    }, [skills.length]);

    const progress = ((activeIndex + 1) / skills.length) * 100;

    return (
        <div style={{
            background: "linear-gradient(145deg, #fafbfc, #fff)",
            borderRadius: 16,
            border: "1px solid rgba(0,0,0,0.06)",
            overflow: "hidden",
            height: 220,
            padding: 16,
            display: "flex",
            flexDirection: "column",
        }}>
            {/* Header */}
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
            }}>
                <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: "linear-gradient(135deg, #075e54, #128c7e)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <Zap size={12} color="#fff" />
                </div>
                <span style={{ fontWeight: 700, fontSize: 12, color: "#1f2937" }}>
                    Compétences
                </span>
                <motion.span
                    key={activeIndex}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                        marginLeft: "auto",
                        padding: "2px 8px",
                        borderRadius: 8,
                        background: "rgba(7, 94, 84, 0.08)",
                        color: "#075e54",
                        fontSize: 10,
                        fontWeight: 700,
                    }}
                >
                    {activeIndex + 1}/{skills.length}
                </motion.span>
            </div>

            {/* Progress bar */}
            <div style={{
                height: 3,
                borderRadius: 2,
                background: "rgba(0,0,0,0.04)",
                marginBottom: 14,
                overflow: "hidden",
            }}>
                <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    style={{
                        height: "100%",
                        borderRadius: 2,
                        background: "linear-gradient(90deg, #075e54, #25d366)",
                    }}
                />
            </div>

            {/* Skills grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, flex: 1 }}>
                {skills.map((skill, index) => {
                    const isActive = index <= activeIndex;
                    const isCurrent = index === activeIndex;
                    return (
                        <motion.div
                            key={skill.label}
                            animate={{
                                background: isActive ? skill.bg : "rgba(247,248,251,0.8)",
                                borderColor: isActive ? `${skill.color}40` : "rgba(0,0,0,0.04)",
                                scale: isCurrent ? 1.02 : 1,
                            }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            style={{
                                padding: "8px 10px",
                                borderRadius: 10,
                                border: "1.5px solid",
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            {isCurrent && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.05 }}
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        background: skill.color,
                                    }}
                                />
                            )}
                            <div style={{
                                color: isActive ? skill.color : "#9ca3af",
                                transition: "color 0.3s",
                                display: "flex",
                                alignItems: "center",
                                position: "relative",
                                zIndex: 1,
                            }}>
                                {skill.icon}
                            </div>
                            <span style={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: isActive ? "#1f2937" : "#9ca3af",
                                position: "relative",
                                zIndex: 1,
                            }}>
                                {skill.label}
                            </span>
                            {isActive && (
                                <motion.div
                                    initial={{ scale: 0, rotate: -90 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                    style={{
                                        marginLeft: "auto",
                                        width: 16,
                                        height: 16,
                                        borderRadius: "50%",
                                        background: skill.color,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        position: "relative",
                                        zIndex: 1,
                                    }}
                                >
                                    <Check size={10} color="#fff" strokeWidth={3} />
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

// Step 3: Deploy animation
const DeployAnimation = () => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setStep(prev => (prev + 1) % 4);
        }, 1500);
        return () => clearInterval(timer);
    }, []);

    const channels = [
        { icon: <MessageSquare size={16} />, label: "WhatsApp", color: "#25d366" },
        { icon: <Globe size={16} />, label: "Website", color: "#3b82f6" },
        { icon: <Users size={16} />, label: "Équipe", color: "#8b5cf6" },
    ];

    return (
        <div style={{
            background: "linear-gradient(145deg, #fafbfc, #fff)",
            borderRadius: 16,
            border: "1px solid rgba(0,0,0,0.06)",
            overflow: "hidden",
            height: 220,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            position: "relative",
        }}>
            {/* Animated ring around agent */}
            <div style={{ position: "relative", marginBottom: 20 }}>
                <motion.div
                    animate={{
                        rotate: 360,
                        opacity: step > 0 ? 0.3 : 0,
                    }}
                    transition={{ rotate: { duration: 8, repeat: Infinity, ease: "linear" }, opacity: { duration: 0.5 } }}
                    style={{
                        position: "absolute",
                        inset: -8,
                        borderRadius: "50%",
                        border: "2px dashed rgba(7,94,84,0.2)",
                    }}
                />
                <motion.div
                    animate={{
                        scale: step === 0 ? [1, 1.08, 1] : 1,
                        boxShadow: step > 0
                            ? "0 0 30px rgba(7, 94, 84, 0.25)"
                            : "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                    transition={{ duration: 0.5 }}
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        background: "linear-gradient(135deg, #075e54, #25d366)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        zIndex: 2,
                    }}
                >
                    <Bot size={24} color="#fff" />
                </motion.div>
                {step > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{
                            position: "absolute",
                            top: -3,
                            right: -3,
                            width: 14,
                            height: 14,
                            borderRadius: "50%",
                            background: "#10b981",
                            border: "2px solid #fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 3,
                        }}
                    >
                        <Check size={8} color="#fff" strokeWidth={3} />
                    </motion.div>
                )}
            </div>

            {/* Connection lines + channels */}
            <div style={{
                display: "flex",
                gap: 24,
                alignItems: "flex-start",
            }}>
                {channels.map((channel, index) => (
                    <motion.div
                        key={channel.label}
                        animate={{
                            opacity: step > index ? 1 : 0.25,
                            y: step > index ? 0 : 8,
                        }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 6,
                            position: "relative",
                        }}
                    >
                        {/* Pulse effect */}
                        {step > index && (
                            <motion.div
                                animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                                style={{
                                    position: "absolute",
                                    top: 4,
                                    left: 4,
                                    width: 32,
                                    height: 32,
                                    borderRadius: 8,
                                    background: channel.color,
                                    pointerEvents: "none",
                                }}
                            />
                        )}
                        <motion.div
                            animate={{
                                background: step > index ? `${channel.color}12` : "#f3f4f6",
                                borderColor: step > index ? channel.color : "#e5e7eb",
                            }}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 10,
                                border: "1.5px solid",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: step > index ? channel.color : "#9ca3af",
                                position: "relative",
                                zIndex: 1,
                                transition: "color 0.3s",
                            }}
                        >
                            {channel.icon}
                        </motion.div>
                        <span style={{
                            fontSize: 9,
                            color: step > index ? "#1f2937" : "#9ca3af",
                            fontWeight: 600,
                            letterSpacing: "-0.2px",
                        }}>
                            {channel.label}
                        </span>
                    </motion.div>
                ))}
            </div>

            {/* Status bar */}
            <motion.div
                animate={{
                    opacity: step > 0 ? 1 : 0,
                    y: step > 0 ? 0 : 5,
                }}
                transition={{ duration: 0.3, delay: 0.3 }}
                style={{
                    marginTop: 12,
                    padding: "3px 10px",
                    borderRadius: 6,
                    background: "rgba(16,185,129,0.08)",
                    border: "1px solid rgba(16,185,129,0.15)",
                    fontSize: 9,
                    fontWeight: 700,
                    color: "#10b981",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                }}
            >
                <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ width: 4, height: 4, borderRadius: "50%", background: "#10b981" }}
                />
                {step} / 3 connectés
            </motion.div>
        </div>
    );
};

// Step Card Component
const StepCard = ({
    number,
    title,
    description,
    animation,
    gradient,
}: {
    number: string;
    title: string;
    description: string;
    animation: React.ReactNode;
    gradient: string;
}) => (
    <motion.div
        variants={cardVariants}
        whileHover={{
            y: -6,
            boxShadow: "0 24px 48px rgba(0,0,0,0.08)",
            borderColor: "rgba(7,94,84,0.12)",
        }}
        transition={{ duration: 0.3 }}
        style={{
            background: "#fff",
            borderRadius: 24,
            border: "1px solid rgba(0,0,0,0.06)",
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(0,0,0,0.03)",
            position: "relative",
            cursor: "default",
        }}
    >
        {/* Gradient top accent */}
        <div style={{
            height: 3,
            background: gradient,
            borderRadius: "24px 24px 0 0",
        }} />

        {/* Content */}
        <div style={{ padding: "20px 22px 16px" }}>
            {/* Number badge */}
            <motion.div
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: gradient,
                    marginBottom: 14,
                    boxShadow: `0 4px 12px ${gradient.includes("#075e54") ? "rgba(7,94,84,0.2)" : gradient.includes("#1890ff") ? "rgba(24,144,255,0.2)" : "rgba(114,46,209,0.2)"}`,
                }}
            >
                <span style={{
                    fontFamily: "monospace",
                    fontWeight: 800,
                    fontSize: 14,
                    color: "#fff",
                    letterSpacing: "-0.5px",
                }}>
                    {number}
                </span>
            </motion.div>

            {/* Title */}
            <h3 style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#111827",
                marginBottom: 6,
                lineHeight: 1.3,
                letterSpacing: "-0.3px",
            }}>
                {title}
            </h3>

            {/* Description */}
            <p style={{
                fontSize: 13,
                color: "#6b7280",
                lineHeight: 1.6,
                marginBottom: 16,
            }}>
                {description}
            </p>
        </div>

        {/* Animation */}
        <div style={{ padding: "0 20px 20px" }}>
            {animation}
        </div>
    </motion.div>
);

// Main Steps Section
export const StepsSection = () => {
    const steps = [
        {
            number: "01",
            title: "Décrivez votre agent",
            description: "Expliquez en langage naturel ce que vous voulez que votre agent fasse. L'IA comprend vos besoins.",
            animation: <DescribeAnimation />,
            gradient: "linear-gradient(135deg, #075e54, #25d366)",
        },
        {
            number: "02",
            title: "Choisissez les compétences",
            description: "Sélectionnez les outils et intégrations que votre agent utilisera pour accomplir ses tâches.",
            animation: <SkillsAnimation />,
            gradient: "linear-gradient(135deg, #1890ff, #096dd9)",
        },
        {
            number: "03",
            title: "Déployez en un clic",
            description: "Connectez votre agent à WhatsApp, votre site web ou votre équipe. Il est prêt à travailler.",
            animation: <DeployAnimation />,
            gradient: "linear-gradient(135deg, #722ed1, #eb2f96)",
        },
    ];

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={containerVariants}
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 20,
                width: "100%",
                maxWidth: 1200,
                margin: "0 auto",
                padding: "0 16px",
            }}
        >
            {steps.map((step) => (
                <StepCard
                    key={step.number}
                    number={step.number}
                    title={step.title}
                    description={step.description}
                    animation={step.animation}
                    gradient={step.gradient}
                />
            ))}
        </motion.div>
    );
};

export default StepsSection;
