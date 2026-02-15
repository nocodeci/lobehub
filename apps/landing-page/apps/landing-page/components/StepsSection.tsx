"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
    ArrowRight
} from "lucide-react";
import { WhatsAppLogo, GoogleCalendarLogo, GmailLogo, IntercomLogo } from "@/components/Logos";

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 }
    },
};

// Step 1: Describe your agent animation
const DescribeAnimation = () => {
    const [textIndex, setTextIndex] = useState(0);
    const [showCursor, setShowCursor] = useState(true);
    const fullText = "Je veux un agent commercial...";

    useEffect(() => {
        if (textIndex < fullText.length) {
            const timer = setTimeout(() => setTextIndex(prev => prev + 1), 80);
            return () => clearTimeout(timer);
        } else {
            // Reset after a pause
            const timer = setTimeout(() => setTextIndex(0), 3000);
            return () => clearTimeout(timer);
        }
    }, [textIndex, fullText.length]);

    useEffect(() => {
        const cursorInterval = setInterval(() => setShowCursor(prev => !prev), 500);
        return () => clearInterval(cursorInterval);
    }, []);

    return (
        <div style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid rgba(0,0,0,0.08)",
            overflow: "hidden",
            height: 200,
        }}>
            {/* Chat Header */}
            <div style={{
                padding: "12px 16px",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
                display: "flex",
                alignItems: "center",
                gap: 10,
            }}>
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: "linear-gradient(135deg, #075e54, #25d366)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Bot size={18} color="#fff" />
                </motion.div>
                <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "#1f2937" }}>Agent Builder</div>
                    <div style={{ fontSize: 10, color: "#10b981", display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981" }} />
                        En ligne
                    </div>
                </div>
            </div>

            {/* Chat Content */}
            <div style={{ padding: 16 }}>
                {/* AI Message */}
                <div style={{
                    display: "flex",
                    gap: 8,
                    marginBottom: 12,
                }}>
                    <div style={{
                        padding: "10px 14px",
                        borderRadius: "14px 14px 14px 4px",
                        background: "#f3f4f6",
                        fontSize: 12,
                        color: "#1f2937",
                        maxWidth: "80%",
                    }}>
                        Décrivez l'agent que vous voulez créer 🤖
                    </div>
                </div>

                {/* User typing */}
                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                }}>
                    <div style={{
                        padding: "10px 14px",
                        borderRadius: "14px 14px 4px 14px",
                        background: "#075e54",
                        color: "#fff",
                        fontSize: 12,
                        maxWidth: "80%",
                    }}>
                        {fullText.slice(0, textIndex)}
                        <span style={{ opacity: showCursor ? 1 : 0 }}>|</span>
                    </div>
                </div>
            </div>
        </div>
    );
};



// Step 2: Skills selection animation
const SkillsAnimation = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const skills = [
        { icon: <WhatsAppLogo size={16} />, color: "#25d366", label: "WhatsApp" },
        { icon: <GoogleCalendarLogo size={16} />, color: "#4285F4", label: "Calendrier" },
        { icon: <GmailLogo size={16} />, color: "#EA4335", label: "Gmail" },
        { icon: <IntercomLogo size={16} />, color: "#1F8CEB", label: "Support" },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % skills.length);
        }, 1200);
        return () => clearInterval(timer);
    }, [skills.length]);

    return (
        <div style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid rgba(0,0,0,0.08)",
            overflow: "hidden",
            height: 200,
            padding: 20,
        }}>
            {/* Header */}
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
            }}>
                <Zap size={16} color="#075e54" />
                <span style={{ fontWeight: 600, fontSize: 13, color: "#1f2937" }}>
                    Compétences
                </span>
                <motion.span
                    key={activeIndex}
                    initial={{ scale: 1.3 }}
                    animate={{ scale: 1 }}
                    style={{
                        marginLeft: "auto",
                        padding: "2px 8px",
                        borderRadius: 10,
                        background: "rgba(7, 94, 84, 0.1)",
                        color: "#075e54",
                        fontSize: 11,
                        fontWeight: 600,
                    }}
                >
                    {activeIndex + 1} actives
                </motion.span>
            </div>

            {/* Skills grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {skills.map((skill, index) => {
                    const isActive = index <= activeIndex;
                    return (
                        <motion.div
                            key={skill.label}
                            animate={{
                                background: isActive ? `${skill.color}15` : "rgba(247, 248, 251, 0.984)",
                                borderColor: isActive ? skill.color : "rgba(13, 13, 31, 0.075)",
                                scale: index === activeIndex ? [1, 1.003, 1] : 1,
                            }}
                            transition={{ duration: 0.3 }}
                            style={{
                                padding: "10px 12px",
                                borderRadius: 10,
                                border: "1px solid",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <div style={{
                                color: isActive ? skill.color : "#9ca3af",
                                transition: "color 0.3s",
                                display: "flex",
                                alignItems: "center",
                            }}>
                                {skill.icon}
                            </div>
                            <span style={{
                                fontSize: 12,
                                fontWeight: 500,
                                color: isActive ? "rgb(31, 41, 55)" : "rgb(156, 163, 175)",
                            }}>
                                {skill.label}
                            </span>
                            {isActive && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    style={{ marginLeft: "auto" }}
                                >
                                    <Check size={14} color={skill.color} />
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
        { icon: <MessageSquare size={18} />, label: "WhatsApp", color: "#25d366" },
        { icon: <Globe size={18} />, label: "Website", color: "#3b82f6" },
        { icon: <Users size={18} />, label: "Équipe", color: "#8b5cf6" },
    ];

    return (
        <div style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid rgba(0,0,0,0.08)",
            overflow: "hidden",
            height: 200,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
        }}>
            {/* Agent avatar */}
            <motion.div
                animate={{
                    scale: step === 0 ? [1, 1.1, 1] : 1,
                    boxShadow: step > 0
                        ? "0 0 40px rgba(7, 94, 84, 0.3)"
                        : "0 4px 12px rgba(0,0,0,0.1)",
                }}
                transition={{ duration: 0.5 }}
                style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: "linear-gradient(135deg, #075e54, #25d366)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                }}
            >
                <Bot size={28} color="#fff" />
            </motion.div>

            {/* Connection lines */}
            <div style={{
                display: "flex",
                gap: 20,
                alignItems: "center",
            }}>
                {channels.map((channel, index) => (
                    <motion.div
                        key={channel.label}
                        animate={{
                            opacity: step > index ? 1 : 0.3,
                            scale: step === index + 1 ? [1, 1.15, 1] : 1,
                            y: step > index ? 0 : 10,
                        }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 6,
                        }}
                    >
                        <motion.div
                            animate={{
                                background: step > index ? `${channel.color}15` : "#f3f4f6",
                                borderColor: step > index ? channel.color : "#e5e7eb",
                            }}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 10,
                                border: "1px solid",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: step > index ? channel.color : "#9ca3af",
                            }}
                        >
                            {channel.icon}
                        </motion.div>
                        <span style={{
                            fontSize: 10,
                            color: step > index ? "#1f2937" : "#9ca3af",
                            fontWeight: 500,
                        }}>
                            {channel.label}
                        </span>
                        {step > index && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                style={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: "50%",
                                    background: "#10b981",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    position: "absolute",
                                    top: -4,
                                    right: -4,
                                }}
                            >
                                <Check size={10} color="#fff" />
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// Step Card Component
const StepCard = ({
    number,
    title,
    description,
    animation,
}: {
    number: string;
    title: string;
    description: string;
    animation: React.ReactNode;
}) => (
    <motion.div
        variants={cardVariants}
        style={{
            background: "#fff",
            borderRadius: 20,
            border: "1px solid rgba(0,0,0,0.08)",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        }}
    >
        {/* Content */}
        <div style={{ padding: 24 }}>
            {/* Number */}
            <div style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: 6,
                background: "rgba(7, 94, 84, 0.08)",
                marginBottom: 16,
            }}>
                <span style={{
                    fontFamily: "monospace",
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#075e54",
                }}>
                    {number}
                </span>
            </div>

            {/* Title */}
            <h3 style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#1f2937",
                marginBottom: 8,
                lineHeight: 1.3,
            }}>
                {title}
            </h3>

            {/* Description */}
            <p style={{
                fontSize: 14,
                color: "#6b7280",
                lineHeight: 1.6,
                marginBottom: 20,
            }}>
                {description}
            </p>
        </div>

        {/* Animation */}
        <div style={{
            padding: "0 24px 24px",
        }}>
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
        },
        {
            number: "02",
            title: "Choisissez les compétences",
            description: "Sélectionnez les outils et intégrations que votre agent utilisera pour accomplir ses tâches.",
            animation: <SkillsAnimation />,
        },
        {
            number: "03",
            title: "Déployez en un clic",
            description: "Connectez votre agent à WhatsApp, votre site web ou votre équipe. Il est prêt à travailler.",
            animation: <DeployAnimation />,
        },
    ];

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 24,
                width: "100%",
                maxWidth: 1200,
                margin: "0 auto",
            }}
        >
            {steps.map((step) => (
                <StepCard
                    key={step.number}
                    number={step.number}
                    title={step.title}
                    description={step.description}
                    animation={step.animation}
                />
            ))}
        </motion.div>
    );
};

export default StepsSection;
