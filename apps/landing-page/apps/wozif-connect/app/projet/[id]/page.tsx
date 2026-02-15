"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";
import {
    MoreHorizontal,
    Star,
    FileText,
    FileImage,
    File,
    Plus,
    Brain,
    ChevronDown,
    ArrowUp,
    MoreVertical,
    Cable,
    Zap,
    X,
    Mic,
    Search,
    Copy,
    SquareArrowOutUpRight,
    Settings,
    Play,
    MonitorPlay,
    Share,
    RotateCw,
    HelpCircle,
    QrCode,
    Square,
    ArrowLeft,
    BrainIcon,
    ChevronDownIcon
} from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { Reasoning, ReasoningTrigger, ReasoningContent } from "@/components/ai/reasoning";
import { Streamdown } from "streamdown";

// Mocking some icons that were in the HTML
const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path></svg>
);

const AIModelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" width="16" height="16" color="currentColor" className="flex-shrink-0">
        <g clipPath="url(#ai_icon_clip)">
            <path d="M1.99462 10.8951C2.09265 11.1424 2.11447 11.4133 2.05729 11.6731L1.34729 13.8664C1.32441 13.9777 1.33033 14.0929 1.36447 14.2012C1.39862 14.3095 1.45987 14.4073 1.5424 14.4853C1.62494 14.5633 1.72603 14.6189 1.83609 14.6469C1.94615 14.6749 2.06153 14.6742 2.17129 14.6451L4.44662 13.9798C4.69177 13.9312 4.94564 13.9524 5.17929 14.0411C6.60288 14.7059 8.21553 14.8466 9.73272 14.4383C11.2499 14.0299 12.5741 13.0989 13.4718 11.8094C14.3694 10.5198 14.7827 8.95472 14.6388 7.39015C14.4949 5.82557 13.8031 4.36209 12.6853 3.25791C11.5676 2.15373 10.0958 1.47981 8.52955 1.35504C6.96333 1.23028 5.40338 1.6627 4.12492 2.57601C2.84646 3.48931 1.93164 4.82481 1.54189 6.34687C1.15213 7.86894 1.31247 9.47975 1.99462 10.8951Z" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M5.5 6.5V9.16667M8.16667 5.5V10.1667M10.8333 7.16667V8.5" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round"></path>
        </g>
        <defs>
            <clipPath id="ai_icon_clip"><rect width="16" height="16" fill="white"></rect></clipPath>
        </defs>
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 16 16" fill="none">
        <path d="M7.91699 15.0642C7.53125 15.0642 7.22119 14.9397 6.98682 14.6907C6.75244 14.4465 6.63525 14.1218 6.63525 13.7166V6.39966L6.77441 3.34546L7.48486 3.89478L5.62451 6.12134L3.99121 7.76196C3.87402 7.87915 3.73975 7.97681 3.58838 8.05493C3.44189 8.13306 3.271 8.17212 3.07568 8.17212C2.73389 8.17212 2.4458 8.05981 2.21143 7.83521C1.98193 7.60571 1.86719 7.3103 1.86719 6.94897C1.86719 6.60229 1.99902 6.29712 2.2627 6.03345L6.97949 1.30933C7.0918 1.19214 7.2334 1.10181 7.4043 1.03833C7.5752 0.969971 7.74609 0.935791 7.91699 0.935791C8.08789 0.935791 8.25879 0.969971 8.42969 1.03833C8.60059 1.10181 8.74463 1.19214 8.86182 1.30933L13.5786 6.03345C13.8423 6.29712 13.9741 6.60229 13.9741 6.94897C13.9741 7.3103 13.8569 7.60571 13.6226 7.83521C13.3931 8.05981 13.1074 8.17212 12.7656 8.17212C12.5703 8.17212 12.397 8.13306 12.2456 8.05493C12.0991 7.97681 11.9673 7.87915 11.8501 7.76196L10.2095 6.12134L8.34912 3.89478L9.05957 3.34546L9.19141 6.39966V13.7166C9.19141 14.1218 9.07422 14.4465 8.83984 14.6907C8.60547 14.9397 8.29785 15.0642 7.91699 15.0642Z" fill="currentColor"></path>
    </svg>
);

import { useParams, useRouter } from "next/navigation";

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [prompt, setPrompt] = useState("");
    const [showConnectors, setShowConnectors] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [showTextModal, setShowTextModal] = useState(false);
    const [textTitle, setTextTitle] = useState("");
    const [textContent, setTextContent] = useState("");
    const [projectInstructions, setProjectInstructions] = useState("");
    const [automation, setAutomation] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("applications");
    const [selectedApp, setSelectedApp] = useState<Record<string, any> | null>(null);
    const [whatsappQR, setWhatsappQR] = useState<string | null>(null);
    const [isPaired, setIsPaired] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [showWhatsappPreview, setShowWhatsappPreview] = useState(false);
    const [isGmailConnected, setIsGmailConnected] = useState(false);
    const [isCalendarConnected, setIsCalendarConnected] = useState(false);
    const [isDriveConnected, setIsDriveConnected] = useState(false);
    const [isGithubConnected, setIsGithubConnected] = useState(false);
    const [isSlackConnected, setIsSlackConnected] = useState(false);
    const [isNotionConnected, setIsNotionConnected] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [simulatorMessages, setSimulatorMessages] = useState<any[]>([]);
    const [simulatorPrompt, setSimulatorPrompt] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [currentThinking, setCurrentThinking] = useState<string | null>(null);
    const [knowledgeBaseId, setKnowledgeBaseId] = useState<string | null>(null);
    const [knowledgeAttachments, setKnowledgeAttachments] = useState<
        Array<{ id: string; title: string; kind: "text" | "pdf" | "image"; chunks?: number }>
    >([]);
    const [rightPanelWidth, setRightPanelWidth] = useState(0);
    const [isResizingPanels, setIsResizingPanels] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const simulatorEndRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const mainContentRef = useRef<HTMLDivElement>(null);
    const resizeStartRef = useRef<{ x: number; width: number } | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const scrollSimulatorToBottom = () => {
        simulatorEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isThinking]);

    useEffect(() => {
        scrollSimulatorToBottom();
    }, [simulatorMessages, isSimulating]);

    useEffect(() => {
        let interval: any;
        const check = async () => {
            try {
                // Check WhatsApp (handled via interval at line 341)

                // Check Gmail
                const gmailRes = await fetch("http://127.0.0.1:3004/auth/status", { method: "GET" }).catch(() => null);
                if (gmailRes) {
                    const gmailData = await gmailRes.json();
                    setIsGmailConnected(Boolean(gmailData?.connected));
                }

                // Check Calendar
                const calRes = await fetch("http://localhost:3500/auth/status", { method: "GET", cache: "no-store" }).catch(() => null);
                if (calRes) {
                    const calData = await calRes.json();
                    setIsCalendarConnected(Boolean(calData?.connected));
                }
            } catch (err) {
                console.error("Connection check failed:", err);
            }
        };

        check();
        interval = setInterval(check, 5000);

        if (typeof window !== "undefined") {
            window.addEventListener("focus", check);
        }

        return () => {
            clearInterval(interval);
            if (typeof window !== "undefined") {
                window.removeEventListener("focus", check);
            }
        };
    }, []);

    // Fetch automation details and messages on mount
    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch automation details
                const autoRes = await fetch(`/api/automations/${id}`);
                const autoData = await autoRes.json();
                if (autoData.success) {
                    setAutomation(autoData.automation);
                    setProjectInstructions(autoData.automation.aiInstructions || "");
                } else if (autoRes.status === 404) {
                    router.push("/projet");
                    return;
                }

                // Fetch existing messages
                const msgRes = await fetch(`/api/automations/${id}/messages`);
                const msgData = await msgRes.json();
                if (msgData.success && msgData.messages.length > 0) {
                    setMessages(msgData.messages);
                    setHasStarted(true);
                } else {
                    // Default initial message
                    const initialMessage = {
                        role: "assistant",
                        content: `Bonjour ! Je suis votre assistant Connect pour le projet "${autoData.automation?.name}". Comment puis-je vous aider aujourd'hui ?`,
                        createdAt: new Date()
                    };

                    setMessages([initialMessage]);

                    try {
                        await fetch(`/api/automations/${id}/messages`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ role: "assistant", content: initialMessage.content }),
                        });
                    } catch (e) {
                        console.error("Error saving initial message:", e);
                    }
                }
            } catch (error) {
                console.error("Error fetching project data:", error);
            } finally {
                setIsLoading(false);
                // Initialize simulator with a welcome message
                setSimulatorMessages([
                    {
                        role: "assistant",
                        content: "Simulateur WhatsApp prêt. Testez votre automatisation ici ! 👋",
                        createdAt: new Date()
                    }
                ]);
            }
        };

        fetchData();
    }, [id, router]);

    useEffect(() => {
        if (!id) return;
        const fetchKb = async () => {
            try {
                const res = await fetch(`/api/automations/${id}/knowledge`);
                const data = await res.json();
                if (data?.success && data?.knowledgeBase?.id) {
                    setKnowledgeBaseId(data.knowledgeBase.id);
                }
            } catch {
                // ignore
            }
        };
        fetchKb();
    }, [id]);

    useEffect(() => {
        if (!hasStarted) return;

        const containerWidth =
            mainContentRef.current?.getBoundingClientRect().width || window.innerWidth;

        const stored = window.localStorage.getItem("wozif-connect:rightPanelWidth");
        const storedWidth = stored ? Number(stored) : NaN;
        const defaultWidth = Math.round(containerWidth * 0.6);

        const minRight = 520;
        const minMain = 420;
        const maxRight = Math.max(minRight, containerWidth - minMain);

        const initial = Number.isFinite(storedWidth) ? storedWidth : defaultWidth;
        const clamped = Math.min(maxRight, Math.max(minRight, initial));
        setRightPanelWidth(clamped);
    }, [hasStarted]);

    useEffect(() => {
        if (!hasStarted) return;
        if (!rightPanelWidth) return;
        window.localStorage.setItem("wozif-connect:rightPanelWidth", String(rightPanelWidth));
    }, [hasStarted, rightPanelWidth]);

    useEffect(() => {
        if (!isResizingPanels) return;

        const onMove = (clientX: number) => {
            const start = resizeStartRef.current;
            if (!start) return;

            const containerWidth =
                mainContentRef.current?.getBoundingClientRect().width || window.innerWidth;

            const minRight = 520;
            const minMain = 420;
            const maxRight = Math.max(minRight, containerWidth - minMain);

            const deltaX = clientX - start.x;
            const next = Math.min(maxRight, Math.max(minRight, start.width - deltaX));
            setRightPanelWidth(next);
        };

        const onMouseMove = (e: MouseEvent) => onMove(e.clientX);
        const onTouchMove = (e: TouchEvent) => {
            const t = e.touches[0];
            if (!t) return;
            onMove(t.clientX);
        };

        const onEnd = () => {
            setIsResizingPanels(false);
            resizeStartRef.current = null;
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };

        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onEnd);
        window.addEventListener("touchmove", onTouchMove, { passive: true });
        window.addEventListener("touchend", onEnd);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onEnd);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onEnd);
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };
    }, [isResizingPanels]);

    useEffect(() => {
        let interval: any;
        if ((showQR || showWhatsappPreview) && !isPaired) {
            interval = setInterval(async () => {
                try {
                    const res = await fetch("http://localhost:8080/api/qr");
                    const data = await res.json();
                    setWhatsappQR(data.qr);
                    setIsPaired(data.paired);
                    if (data.paired) {
                        setShowQR(false);
                    }
                } catch (err) {
                    console.error("Failed to fetch WhatsApp QR:", err);
                }
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [showQR, showWhatsappPreview, isPaired]);

    const handleConnectClick = () => {
        setShowConnectors(true);
    };

    const addKnowledgeAttachment = (att: { id: string; title: string; kind: "text" | "pdf" | "image"; chunks?: number }) => {
        setKnowledgeAttachments((prev) => {
            const next = [att, ...prev.filter((p) => p.id !== att.id)];
            return next.slice(0, 5);
        });
    };

    const getAttachmentIcon = (kind: "text" | "pdf" | "image") => {
        if (kind === "text") return <FileText size={14} className="text-[var(--icon-secondary)]" />;
        if (kind === "image") return <FileImage size={14} className="text-[var(--icon-secondary)]" />;
        return <File size={14} className="text-[var(--icon-secondary)]" />;
    };

    const formatLastMessageAgo = (value: any) => {
        const d = value ? new Date(value) : new Date();
        const ms = Date.now() - d.getTime();
        if (!Number.isFinite(ms) || ms < 0) return "à l'instant";
        const minutes = Math.floor(ms / 60000);
        if (minutes < 1) return "à l'instant";
        if (minutes < 60) return `il y a ${minutes} min`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `il y a ${hours} heure${hours > 1 ? "s" : ""}`;
        const days = Math.floor(hours / 24);
        return `il y a ${days} jour${days > 1 ? "s" : ""}`;
    };

    const handleSaveInstructions = async () => {
        try {
            const res = await fetch(`/api/automations/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ aiInstructions: projectInstructions }),
            });
            if (res.ok) {
                setShowInstructions(false);
            }
        } catch (error) {
            console.error("Error saving instructions:", error);
        }
    };

    const handleStopGeneration = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setIsThinking(false);
            setMessages(prev => {
                const newMessages = [...prev];
                if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === "assistant" && newMessages[newMessages.length - 1].content === "...") {
                    newMessages.pop();
                }
                return newMessages;
            });
        }
    };

    const handleSendMessage = async () => {
        if (!prompt.trim() || isThinking) return;

        const userContent = prompt;
        const userMsg = { role: "user", content: userContent };

        // Optimistic update
        setMessages(prev => [...prev, userMsg]);
        setPrompt("");
        setHasStarted(true);

        const editable = document.querySelector('[contenteditable="true"]');
        if (editable) editable.textContent = "";

        setIsThinking(true);

        try {
            // Save user message
            await fetch(`/api/automations/${id}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userMsg),
            });

            // Create placeholder for assistant message
            let assistantIndex = -1;
            setMessages(prev => {
                const next = [...prev, { role: "assistant", content: "" }];
                assistantIndex = next.length - 1;
                return next;
            });

            const chatRes = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "build",
                    stream: true,
                    message: userContent,
                    messages: [...messages, userMsg],
                    nodes: automation?.nodes || [],
                    aiInstructions: projectInstructions,
                    automationId: id,
                    knowledgeBaseId,
                }),
            });

            const contentType = chatRes.headers.get("content-type") || "";
            let finalAssistantContent = "";

            if (contentType.includes("text/event-stream") && chatRes.body) {
                const reader = chatRes.body.getReader();
                const decoder = new TextDecoder();
                let buffer = "";

                const updateAssistantMessage = (content: string) => {
                    setMessages(prev => {
                        const next = [...prev];
                        const idx = assistantIndex >= 0 ? assistantIndex : next.length - 1;
                        if (next[idx]?.role === "assistant") {
                            next[idx] = { ...next[idx], content };
                        }
                        return next;
                    });
                };

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    buffer += decoder.decode(value, { stream: true });

                    let sepIndex = buffer.indexOf("\n\n");
                    while (sepIndex !== -1) {
                        const rawEvent = buffer.slice(0, sepIndex);
                        buffer = buffer.slice(sepIndex + 2);
                        sepIndex = buffer.indexOf("\n\n");

                        let eventName = "message";
                        const dataLines: string[] = [];
                        for (const line of rawEvent.split("\n")) {
                            if (line.startsWith("event:")) {
                                eventName = line.slice("event:".length).trim();
                            } else if (line.startsWith("data:")) {
                                dataLines.push(line.slice("data:".length).trim());
                            }
                        }

                        const dataStr = dataLines.join("");
                        if (!dataStr) continue;

                        let payload: any;
                        try {
                            payload = JSON.parse(dataStr);
                        } catch {
                            continue;
                        }

                        if (eventName === "thought") {
                            const thought = String(payload?.thought || "");
                            if (thought) {
                                setCurrentThinking(prev => (prev || "") + thought);
                            }
                        } else if (eventName === "delta") {
                            const delta = String(payload?.delta || "");
                            if (delta) {
                                finalAssistantContent += delta;
                                updateAssistantMessage(finalAssistantContent);
                            }
                        } else if (eventName === "done") {
                            const resp = payload?.response || finalAssistantContent;
                            const finalThinking = payload?.thinking || "";
                            finalAssistantContent = resp;

                            setMessages(prev => {
                                const next = [...prev];
                                const idx = assistantIndex >= 0 ? assistantIndex : next.length - 1;
                                if (next[idx]?.role === "assistant") {
                                    next[idx] = { ...next[idx], content: finalAssistantContent, thinking: finalThinking };
                                }
                                return next;
                            });

                            if (payload.newNodes) {
                                const updatedAutomation = { ...automation, nodes: payload.newNodes };
                                setAutomation(updatedAutomation);
                                await fetch(`/api/automations/${id}`, {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ nodes: payload.newNodes }),
                                });
                            }

                            // Save final assistant message
                            await fetch(`/api/automations/${id}/messages`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    role: "assistant",
                                    content: finalAssistantContent,
                                    thinking: finalThinking
                                }),
                            });
                            setCurrentThinking(null);
                        } else if (eventName === "error") {
                            const errMsg = payload?.error || "Désolé, une erreur est survenue.";
                            updateAssistantMessage(errMsg);
                        }
                    }
                }
            } else {
                // Fallback non-streaming
                const chatData = await chatRes.json();
                if (!chatRes.ok) throw new Error(chatData?.error || "Erreur serveur");

                finalAssistantContent = chatData.response || "Je n'ai pas pu générer de réponse.";
                const finalThinking = chatData.thinking || "";

                setMessages(prev => {
                    const next = [...prev];
                    const idx = assistantIndex >= 0 ? assistantIndex : next.length - 1;
                    if (next[idx]?.role === "assistant") {
                        next[idx] = { ...next[idx], content: finalAssistantContent, thinking: finalThinking };
                    }
                    return next;
                });

                if (chatData.newNodes) {
                    const updatedAutomation = { ...automation, nodes: chatData.newNodes };
                    setAutomation(updatedAutomation);
                    await fetch(`/api/automations/${id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ nodes: chatData.newNodes }),
                    });
                }

                await fetch(`/api/automations/${id}/messages`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        role: "assistant",
                        content: finalAssistantContent,
                        thinking: finalThinking
                    }),
                });
            }
        } catch (error) {
            console.error("Error in chat process:", error);
            setMessages(prev => [...prev, { role: "assistant", content: "Désolé, une erreur est survenue lors du traitement de votre message." }]);
        } finally {
            setIsThinking(false);
        }
    };

    const handleSimulatorSendMessage = async () => {
        if (!simulatorPrompt.trim() || isSimulating) return;

        const userContent = simulatorPrompt;
        const userMsg = { role: "user", content: userContent, createdAt: new Date() };
        setSimulatorMessages(prev => [...prev, userMsg]);
        setSimulatorPrompt("");
        setIsSimulating(true);

        try {
            // Create a placeholder assistant message that we will progressively fill
            let assistantIndex = -1;
            setSimulatorMessages(prev => {
                const next = [...prev, { role: "assistant", content: "", createdAt: new Date() }];
                assistantIndex = next.length - 1;
                return next;
            });

            const execRes = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "execute",
                    stream: true,
                    message: userContent,
                    nodes: automation?.nodes || [],
                    aiInstructions: projectInstructions,
                    automationId: id,
                    knowledgeBaseId,
                }),
            });

            const contentType = execRes.headers.get("content-type") || "";
            if (contentType.includes("text/event-stream") && execRes.body) {
                const reader = execRes.body.getReader();
                const decoder = new TextDecoder();
                let buffer = "";
                let finalResponse = "";

                const applyDelta = (delta: string) => {
                    finalResponse += delta;
                    setSimulatorMessages(prev => {
                        const next = [...prev];
                        const idx = assistantIndex >= 0 ? assistantIndex : next.length - 1;
                        if (next[idx]?.role === "assistant") {
                            next[idx] = { ...next[idx], content: finalResponse };
                        }
                        return next;
                    });
                };

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    buffer += decoder.decode(value, { stream: true });

                    let sepIndex = buffer.indexOf("\n\n");
                    while (sepIndex !== -1) {
                        const rawEvent = buffer.slice(0, sepIndex);
                        buffer = buffer.slice(sepIndex + 2);
                        sepIndex = buffer.indexOf("\n\n");

                        let eventName = "message";
                        const dataLines: string[] = [];
                        for (const line of rawEvent.split("\n")) {
                            if (line.startsWith("event:")) {
                                eventName = line.slice("event:".length).trim();
                            } else if (line.startsWith("data:")) {
                                dataLines.push(line.slice("data:".length).trim());
                            }
                        }

                        const dataStr = dataLines.join("");
                        if (!dataStr) continue;

                        let payload: any;
                        try {
                            payload = JSON.parse(dataStr);
                        } catch {
                            continue;
                        }

                        if (eventName === "delta") {
                            const delta = String(payload?.delta || "");
                            if (delta) applyDelta(delta);
                        } else if (eventName === "done") {
                            const resp = String(payload?.response || "");
                            if (resp && resp !== finalResponse) {
                                finalResponse = resp;
                            }
                            setSimulatorMessages(prev => {
                                const next = [...prev];
                                const idx = assistantIndex >= 0 ? assistantIndex : next.length - 1;
                                if (next[idx]?.role === "assistant") {
                                    next[idx] = { ...next[idx], content: finalResponse };
                                }
                                return next;
                            });
                        } else if (eventName === "error") {
                            const errMsg = String(payload?.error || "Erreur simulateur.");
                            setSimulatorMessages(prev => {
                                const next = [...prev];
                                const idx = assistantIndex >= 0 ? assistantIndex : next.length - 1;
                                if (next[idx]?.role === "assistant") {
                                    next[idx] = { ...next[idx], content: errMsg };
                                }
                                return next;
                            });
                        }
                    }
                }
            } else {
                // Fallback non-streaming
                const raw = await execRes.text();
                let execData: any;
                try {
                    execData = JSON.parse(raw);
                } catch {
                    throw new Error(`Réponse /api/chat invalide (HTTP ${execRes.status}): ${raw.slice(0, 200)}`);
                }

                const assistantContent = execData.response || execData.responses?.join("\n\n") || "";
                setSimulatorMessages(prev => {
                    const next = [...prev];
                    const idx = assistantIndex >= 0 ? assistantIndex : next.length - 1;
                    if (next[idx]?.role === "assistant") {
                        next[idx] = { ...next[idx], content: assistantContent };
                    } else {
                        next.push({ role: "assistant", content: assistantContent, createdAt: new Date() });
                    }
                    return next;
                });
            }
        } catch (error) {
            console.error("Error in simulator process:", error);
            setSimulatorMessages(prev => [...prev, { role: "assistant", content: "Erreur simulateur.", createdAt: new Date() }]);
        } finally {
            setIsSimulating(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-background text-foreground selection:bg-primary selection:text-black">
            {isLoading && (
                <div className="bprogress">
                    <div className="bar" style={{ width: '70%', transition: 'width 0.4s ease' }}>
                        <div className="peg"></div>
                    </div>
                    <div className="spinner">
                        <div className="spinner-icon"></div>
                    </div>
                </div>
            )}

            <DashboardSidebar />

            <div ref={mainContentRef} id="main-content" className="w-full relative min-w-0 flex flex-col h-screen overflow-hidden">
                <div className="flex-1 overflow-hidden focus:outline-none flex flex-row">
                    {!hasStarted ? (
                        <main className="flex-1 flex flex-col h-full bg-[var(--sim-bg)] overflow-y-auto custom-scrollbar">
                            <div className="flex flex-col w-full max-w-7xl mx-auto px-4 md:px-8">
                                {/* Navigation Header */}
                                <header className="flex w-full bg-[var(--sim-bg)]/80 backdrop-blur-sm sticky top-0 z-40 mx-auto md:h-24 md:items-end pb-4 pt-4">
                                    <div className="flex w-full items-center justify-between gap-4">
                                        <Link
                                            className="text-[var(--sim-text-secondary)] hover:text-[var(--sim-text-primary)] flex items-center gap-2 font-medium transition-colors"
                                            href="/projet"
                                        >
                                            <ArrowLeftIcon />
                                            Tous les projets
                                        </Link>
                                    </div>
                                </header>

                                <div className="grid grid-cols-7 xl:grid-cols-12 gap-12 mt-8 flex-1 pb-20">
                                    {/* Left Column (7/12) */}
                                    <div className="col-span-12 xl:col-span-7 flex flex-col gap-8">
                                        {/* Project Title and Actions */}
                                        <div className="space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex flex-col gap-1">
                                                    <h1 className="font-bold text-3xl tracking-tight text-[var(--sim-text-primary)] uppercase">
                                                        {automation?.name || "Projet"}
                                                    </h1>
                                                    <p className="text-[var(--sim-text-muted)] font-medium text-sm uppercase tracking-[0.1em] opacity-80">
                                                        pour des automatisation whatsapp
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-[var(--sim-surface-2)] transition-colors text-[var(--sim-text-secondary)]">
                                                        <MoreHorizontal size={20} />
                                                    </button>
                                                    <button className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-[var(--sim-surface-2)] transition-colors text-[var(--sim-text-secondary)]">
                                                        <Star size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Chat Input Area */}
                                        <div className="flex flex-col w-full relative z-20">
                                            <div className="relative">
                                                <div className="flex flex-col gap-3 rounded-[22px] relative bg-[var(--fill-input-chat)] py-3 w-full z-[10] shadow-[0px_12px_32px_0px_rgba(0,0,0,0.02)] border border-black/5 dark:border-[var(--border-main)] focus-within:border-black/20 focus-within:dark:border-[var(--border-dark)] transition-all">
                                                    <div className="overflow-auto ps-4 pe-2 bg-transparent pt-[1px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full placeholder:text-[var(--text-disable)] text-[15px] leading-[24px] min-h-[50px] max-h-[216px]">
                                                        <div
                                                            contentEditable="true"
                                                            enterKeyHint="enter"
                                                            className="outline-none min-h-[24px] text-[var(--text-primary)]"
                                                            onInput={(e) => setPrompt(e.currentTarget.textContent || "")}
                                                            data-placeholder="Répondre..."
                                                        ></div>
                                                    </div>

                                                    <div className="px-3">
                                                        <div className="mb-[8px]"></div>
                                                        <div className="flex gap-2 items-center">
                                                            <div className="flex gap-2 items-center shrink-0">
                                                                <button className="rounded-full border border-[var(--border-main)] inline-flex items-center justify-center clickable cursor-pointer text-[var(--text-secondary)] hover:bg-[var(--fill-tsp-gray-main)] w-8 h-8 p-0 shrink-0 transition-colors">
                                                                    <Plus size={18} />
                                                                </button>
                                                                <button
                                                                    onClick={handleConnectClick}
                                                                    className="flex items-center gap-[4px] p-[8px] cursor-pointer rounded-[100px] border border-[var(--border-main)] hover:bg-[var(--fill-tsp-gray-main)] transition-colors"
                                                                >
                                                                    <div className="flex items-center gap-[4px] text-[var(--icon-secondary)]">
                                                                        <Cable size={16} />
                                                                    </div>
                                                                </button>
                                                            </div>

                                                            <div className="min-w-0 flex gap-2 ml-auto shrink items-center">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex items-center">
                                                                        <button className="flex items-center gap-1.5 rounded-full clickable px-2 h-[32px] text-[var(--icon-primary)] hover:bg-[var(--fill-tsp-gray-main)] transition-colors text-xs font-semibold">
                                                                            <AIModelIcon />
                                                                        </button>
                                                                        <div className="flex items-center justify-center cursor-pointer hover:bg-[var(--fill-tsp-gray-main)] size-8 shrink-0 rounded-full transition-colors">
                                                                            <Mic size={16} className="text-[var(--icon-primary)]" />
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        onClick={handleSendMessage}
                                                                        disabled={!prompt || isThinking}
                                                                        className={`inline-flex items-center justify-center whitespace-nowrap font-medium transition-all hover:opacity-90 active:scale-95 bg-[var(--Button-primary-black)] text-[var(--text-onblack)] size-8 rounded-full p-0 disabled:bg-[var(--fill-tsp-white-dark)] disabled:opacity-30 disabled:hover:opacity-30`}
                                                                    >
                                                                        <SendIcon />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Bottom Banner */}
                                                <div className="bg-[rgba(55,53,47,0.02)] dark:bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(240,239,237,1)] dark:hover:bg-[rgba(255,255,255,0.02)] border-x border-b border-[var(--border-light)] rounded-b-[22px] pb-[7px] px-5 pt-[29px] -mt-[22px] transition-colors cursor-pointer group">
                                                    <div className="flex items-center gap-2" onClick={handleConnectClick}>
                                                        <div className="flex items-center gap-[6px]">
                                                            <Cable size={16} className="text-[var(--icon-secondary)]" />
                                                        </div>
                                                        <span className="text-[13px] leading-[18px] text-[var(--text-secondary)] tracking-[-0.091px] flex-1 truncate font-medium">Connectez vos outils à Manus</span>
                                                        <div className="flex-shrink-0 flex items-center justify-end gap-2">
                                                            <img
                                                                alt="Aperçu des connecteurs"
                                                                className="h-[22px] w-auto opacity-80 group-hover:opacity-100 transition-opacity"
                                                                src="https://files.manuscdn.com/webapp/_next/static/media/connectorsDark.0f49332b.png"
                                                            />
                                                            <button className="flex items-center justify-center hover:opacity-70 p-1">
                                                                <X size={16} className="text-[var(--icon-tertiary)]" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Recent Conversations */}
                                        <div className="space-y-4 mt-8">
                                            <div className="space-y-0.5">
                                                <div
                                                    className="group block py-4 px-4 rounded-xl border-t border-b border-[var(--border-main)] hover:bg-[var(--sim-surface-1)] transition-all cursor-pointer"
                                                    onClick={() => setHasStarted(true)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="space-y-1 min-w-0">
                                                            <div className="font-bold text-[var(--sim-text-primary)] uppercase leading-none truncate">
                                                                {automation?.name || "Conversation"}
                                                            </div>
                                                            <div className="text-[var(--sim-text-muted)] text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 mt-1">
                                                                <span>
                                                                    Dernier message {formatLastMessageAgo(messages?.[messages.length - 1]?.createdAt)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <MoreHorizontal size={18} className="text-[var(--sim-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column (5/12) */}
                                    <div className="col-span-12 xl:col-span-5 flex flex-col gap-6">
                                        <div className="bg-[var(--background-card-gray)] rounded-2xl border border-[var(--border-main)] flex flex-col overflow-hidden shadow-sm">
                                            <div className="px-6 py-5 flex flex-col gap-3">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Instructions</h3>
                                                    <button
                                                        onClick={() => setShowInstructions(true)}
                                                        className="size-8 flex items-center justify-center hover:bg-[var(--fill-tsp-gray-main)] rounded-lg transition-colors"
                                                    >
                                                        <Plus size={16} className="text-[var(--icon-tertiary)]" />
                                                    </button>
                                                </div>
                                                <p className="text-xs text-[var(--text-tertiary)] opacity-60">Ajouter des instructions pour personnaliser les réponses de Claude.</p>
                                            </div>

                                            <div className="h-[0.5px] bg-[var(--border-main)] w-full opacity-50" />

                                            <div className="px-6 py-5 flex flex-col gap-3">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Fichiers</h3>
                                                    <button
                                                        onClick={() => setShowTextModal(true)}
                                                        className="size-8 flex items-center justify-center hover:bg-[var(--fill-tsp-gray-main)] rounded-lg transition-colors"
                                                    >
                                                        <Plus size={16} className="text-[var(--icon-tertiary)]" />
                                                    </button>
                                                </div>
                                                <div className="bg-[var(--background-gray-main)]/50 rounded-2xl h-44 flex flex-col items-center justify-center gap-3 border border-dashed border-[var(--border-main)] p-6 transition-colors hover:border-black/20">
                                                    <div className="size-12 bg-[var(--sim-surface-1)] rounded-xl flex items-center justify-center shadow-sm">
                                                        <Cable size={24} className="text-[var(--icon-tertiary)]" />
                                                    </div>
                                                    <p className="text-xs text-[var(--text-tertiary)] text-center max-w-[180px]">Ajoutez des PDF, des documents ou autres textes à référencer dans ce projet.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                    ) : (
                        <>
                            <main className="flex-1 flex flex-col h-full bg-[var(--sim-bg)] transition-all duration-500 max-w-4xl mx-auto overflow-hidden">
                                {/* Sticky Header */}
                                <div className="sticky top-0 z-20 bg-[var(--sim-bg)]/80 backdrop-blur-md px-4 md:px-8 py-3 border-b border-[var(--border-main)]">
                                    <div className="max-w-3xl mx-auto flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => setHasStarted(false)}
                                                className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors group"
                                            >
                                                <ArrowLeft size={18} className="text-[var(--icon-secondary)] group-hover:text-[var(--text-primary)]" />
                                            </button>
                                            <div className="flex items-center gap-2">
                                                <div className="size-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                                                    <Zap size={14} className="text-white" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <h2 className="text-sm font-bold text-[var(--text-primary)] leading-none tracking-tight">
                                                        {automation?.name || "Connect"} 1.6 Lite
                                                    </h2>
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                                        <span className="text-[10px] font-medium text-emerald-500 uppercase tracking-wider">Session Active</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                                                <Settings size={16} className="text-[var(--icon-secondary)]" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full flex-1 flex flex-col overflow-y-auto custom-scrollbar">
                                    <div className="flex-1 flex flex-col w-full max-w-3xl mx-auto px-4 md:px-8 py-6 mt-4">
                                        <div className="flex-1 space-y-6">
                                            <AnimatePresence initial={false}>
                                                {messages.map((msg, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                                    >
                                                        <div className={`max-w-[85%] flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                                            {msg.role === 'assistant' && msg.thinking && (
                                                                <Reasoning defaultOpen={false} className="w-full">
                                                                    <ReasoningTrigger
                                                                        className="justify-start px-0 py-0 hover:bg-transparent"
                                                                        getThinkingMessage={() => (
                                                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6366f1]/80">
                                                                                Génération
                                                                            </span>
                                                                        )}
                                                                    />
                                                                    <ReasoningContent className="mt-2 text-[12px] leading-[18px] text-[var(--text-secondary)] font-serif italic border-l-2 border-[#6366f1]/30 pl-4 py-1">
                                                                        {msg.thinking}
                                                                    </ReasoningContent>
                                                                </Reasoning>
                                                            )}
                                                            <div className={`px-4 py-3 rounded-[20px] text-[14px] leading-[22px] shadow-sm ${msg.role === 'user'
                                                                ? 'bg-[var(--Button-primary-black)] text-[var(--text-onblack)] rounded-tr-none'
                                                                : 'bg-[var(--fill-input-chat)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-tl-none'
                                                                }`}>
                                                                {msg.role === 'assistant'
                                                                    ? <Streamdown>{String(msg.content || "")}</Streamdown>
                                                                    : msg.content
                                                                }
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                                {isThinking && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="w-full max-w-2xl px-0"
                                                    >
                                                        <Reasoning isStreaming={isThinking} defaultOpen={true}>
                                                            <ReasoningTrigger
                                                                className="justify-start px-0 py-0 hover:bg-transparent"
                                                                getThinkingMessage={() => (
                                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#6366f1]/80">
                                                                        Génération
                                                                    </span>
                                                                )}
                                                            />
                                                            <ReasoningContent className="mt-2 text-[12px] leading-[18px] text-[var(--text-secondary)] font-serif italic border-l-2 border-[#6366f1]/30 pl-4 py-1">
                                                                {currentThinking || "Connect prépare votre automatisation..."}
                                                            </ReasoningContent>
                                                        </Reasoning>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                            <div ref={messagesEndRef} />
                                        </div>
                                    </div>
                                </div>

                                {/* Sticky Input Area */}
                                <div className="sticky bottom-0 bg-[var(--sim-bg)]/80 backdrop-blur-md border-t border-[var(--border-main)] px-4 md:px-8 py-3">
                                    <div className="max-w-3xl mx-auto">
                                        <div className="relative bg-[var(--background-gray-main)] pb-1">
                                            <div className="flex flex-col rounded-[22px] relative bg-[var(--fill-input-chat)] w-full z-[2] shadow-[0px_12px_32px_0px_rgba(0,0,0,0.02)] border border-black/8 dark:border-[var(--border-main)] overflow-visible focus-within:border-black/20 focus-within:dark:border-[var(--border-dark)]">
                                                {knowledgeAttachments.length > 0 && (
                                                    <div className="bg-[var(--background-gray-main)] px-3 pt-1 pb-1 border-b border-black/8 dark:border-[var(--border-main)]">
                                                        <div className="flex flex-col gap-1 p-0.5 max-h-[72px] sm:max-h-[88px] overflow-y-auto custom-scrollbar">
                                                            {knowledgeAttachments.map((att) => (
                                                                <div
                                                                    key={att.id}
                                                                    className="w-full flex flex-row items-center justify-between gap-2 px-2 py-[3px] relative group border border-black/5 dark:border-[var(--border-main)] bg-[var(--background-menu-white)] rounded-[999px] shadow-sm"
                                                                >
                                                                    <div className="flex items-center gap-2 min-w-0">
                                                                        <div className="flex items-center justify-center size-4 bg-green-500 rounded-full shrink-0">
                                                                            <Zap size={9} className="text-white fill-current" />
                                                                        </div>
                                                                        <div className="min-w-0 flex items-center gap-2">
                                                                            <div className="text-[11px] truncate font-medium text-[var(--text-primary)]" title={att.title}>
                                                                                {att.title}
                                                                            </div>
                                                                            <div className="text-[9px] text-[var(--text-tertiary)] truncate whitespace-nowrap">
                                                                                {att.kind === "text" ? "Texte" : att.kind === "pdf" ? "PDF" : "Image"}
                                                                                {typeof att.chunks === "number" ? ` · ${att.chunks}` : ""}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setKnowledgeAttachments((prev) => prev.filter((p) => p.id !== att.id))
                                                                        }
                                                                        className="flex items-center justify-center size-6 rounded-full hover:bg-black/5 transition-colors shrink-0"
                                                                        aria-label="Retirer"
                                                                    >
                                                                        <X size={11} className="text-[var(--icon-tertiary)]" />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex flex-col gap-2 py-2">
                                                    <div className="overflow-auto ps-4 pe-2 bg-transparent pt-[1px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full placeholder:text-[var(--text-disable)] text-[15px] leading-[24px] min-h-[28px] max-h-[216px]">
                                                        <div
                                                            contentEditable="true"
                                                            enterKeyHint="enter"
                                                            className="outline-none min-h-[24px] text-[var(--text-primary)] relative after:content-[attr(data-placeholder)] after:pointer-events-none after:opacity-50 after:absolute after:left-0 empty:after:block after:hidden"
                                                            data-placeholder="Envoyez un message à Connect"
                                                            onInput={(e) => setPrompt(e.currentTarget.textContent || "")}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                                    e.preventDefault();
                                                                    handleSendMessage();
                                                                }
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <div className="px-3">
                                                        <div className="flex gap-2 items-center justify-between">
                                                            <div className="flex gap-2 items-center shrink-0">
                                                                <button
                                                                    onClick={handleConnectClick}
                                                                    className="flex items-center gap-[4px] p-[8px] cursor-pointer rounded-full border border-[var(--border-main)] hover:bg-[var(--fill-tsp-gray-main)] transition-colors"
                                                                >
                                                                    <Cable size={16} className="text-[var(--icon-primary)]" />
                                                                </button>
                                                            </div>
                                                            <div className="flex gap-2 items-center">
                                                                <div className="flex items-center justify-center cursor-pointer hover:bg-[var(--fill-tsp-gray-main)] size-8 shrink-0 rounded-full transition-colors">
                                                                    <Mic size={16} className="text-[var(--icon-primary)]" />
                                                                </div>
                                                                <button
                                                                    onClick={isThinking ? handleStopGeneration : handleSendMessage}
                                                                    disabled={!prompt && !isThinking}
                                                                    className="size-8 rounded-full bg-[var(--Button-primary-black)] text-[var(--text-onblack)] flex items-center justify-center transition-all active:scale-95 disabled:opacity-30"
                                                                >
                                                                    {isThinking ? <Square size={14} fill="currentColor" /> : <ArrowUp size={16} />}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </main>

                            <div
                                role="separator"
                                aria-orientation="vertical"
                                onMouseDown={(e) => {
                                    if (!rightPanelWidth) return;
                                    setIsResizingPanels(true);
                                    resizeStartRef.current = { x: e.clientX, width: rightPanelWidth };
                                }}
                                onTouchStart={(e) => {
                                    const t = e.touches[0];
                                    if (!t || !rightPanelWidth) return;
                                    setIsResizingPanels(true);
                                    resizeStartRef.current = { x: t.clientX, width: rightPanelWidth };
                                }}
                                className="h-full w-[8px] shrink-0 cursor-col-resize flex items-center justify-center bg-transparent"
                            >
                                <div className="h-12 w-[2px] rounded-full bg-[var(--border-main)] opacity-60" />
                            </div>

                            <AnimatePresence>
                                <motion.aside
                                    initial={{ opacity: 0, x: 20, width: 0 }}
                                    animate={{ opacity: 1, x: 0, width: rightPanelWidth ? `${rightPanelWidth}px` : '60%' }}
                                    exit={{ opacity: 0, x: 20, width: 0 }}
                                    className="h-full border-l border-[var(--border-main)] bg-[var(--background-gray-main)] flex flex-col pb-[12px] pl-[2px] overflow-hidden relative shrink-0"
                                >
                                    <div className="flex items-center justify-between pb-[10px] px-4 overflow-x-auto pt-[12px]">
                                        <div className="bg-[var(--fill-tsp-gray-main)] border border-[var(--border-main)] rounded-[8px] p-[2px] flex items-center">
                                            <button className="inline-flex items-center justify-center whitespace-nowrap transition-colors active:opacity-80 text-sm hover:opacity-80 p-0 h-[28px] min-w-[48px] px-[12px] py-[4px] rounded-[6px] gap-[6px] bg-white dark:bg-[#2c2c2c] shadow-[0px_0.5px_3px_0px_rgba(0,0,0,0.05)] text-[var(--text-primary)] font-medium">
                                                <MonitorPlay size={18} className="text-[var(--icon-primary)]" />
                                                Aperçu
                                                <ChevronDown size={16} className="text-[var(--icon-tertiary)]" />
                                            </button>
                                            <button className="inline-flex items-center justify-center whitespace-nowrap transition-colors active:opacity-80 text-sm hover:opacity-80 p-0 h-[28px] min-w-[48px] px-[12px] py-[4px] rounded-[6px] gap-[6px] text-[var(--text-tertiary)] font-medium">
                                                Secrets
                                            </button>
                                            <button className="inline-flex items-center justify-center whitespace-nowrap transition-colors active:opacity-80 text-sm hover:opacity-80 p-0 h-[28px] min-w-[48px] px-[12px] py-[4px] rounded-[6px] gap-[6px] text-[var(--text-tertiary)] font-medium">
                                                Utilisation
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-[4px] pr-[4px]">
                                            <div className="flex items-center gap-[8px]">
                                                <button className="size-[32px] flex items-center justify-center rounded-[8px] border border-[var(--border-btn-main)] hover:bg-[var(--fill-tsp-white-light)] transition-colors">
                                                    <MoreHorizontal size={16} className="text-[var(--icon-secondary)]" />
                                                </button>
                                                <button className="flex items-center justify-center whitespace-nowrap font-medium transition-colors hover:opacity-90 active:opacity-80 bg-black dark:bg-white text-white dark:text-black h-[32px] px-[12px] rounded-[8px] gap-[4px] text-[14px] leading-[18px]">
                                                    <Share size={16} />
                                                    Publier
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-center cursor-pointer rounded-md hover:bg-[var(--fill-tsp-gray-main)] size-[32px]">
                                                <X size={16} className="text-[var(--icon-secondary)]" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 min-h-0 bg-[var(--background-card-gray)] rounded-[12px] overflow-hidden border border-[var(--border-main)] mx-3 mb-3 flex flex-col">
                                        <div className="flex items-center justify-between gap-[24px] py-[10px] px-[12px] border-b border-[var(--border-light)] bg-white dark:bg-[#1a1a1a]">
                                            <div className="flex items-center justify-center cursor-pointer rounded-md hover:bg-[var(--fill-tsp-gray-main)] size-[24px]">
                                                <RotateCw size={14} className="text-[var(--icon-tertiary)]" />
                                            </div>
                                            <div className="flex items-center justify-center gap-[6px] flex-1 overflow-hidden">
                                                <img className="size-[24px] rounded-[6px]" alt="" src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" />
                                                <span className="text-[14px] text-[var(--text-primary)] font-medium truncate">WhatsApp Simulator</span>
                                                <HelpCircle size={14} className="text-[var(--icon-tertiary)]" />
                                            </div>
                                            <div
                                                onClick={() => setShowWhatsappPreview(true)}
                                                className="flex items-center justify-center cursor-pointer size-[32px] border border-[var(--border-btn-main)] rounded-[8px] hover:bg-[var(--fill-tsp-gray-main)] transition-colors relative"
                                            >
                                                <QrCode size={16} className="text-[var(--icon-tertiary)]" />
                                            </div>
                                        </div>

                                        <div className="flex-1 min-h-0 w-full bg-white dark:bg-[#121212] relative flex items-center justify-center p-2 sm:p-4 overflow-hidden">
                                            <div className="relative h-full max-h-full w-auto max-w-[340px] aspect-[9/19] flex items-center justify-center drop-shadow-[0_24px_60px_rgba(0,0,0,0.32)]">
                                                <div className="absolute inset-0 rounded-[70px] bg-black/5 dark:bg-white/5 blur-[14px]" />
                                                <svg className="absolute inset-0 size-full overflow-hidden shrink-0 pointer-events-none select-none" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 475 998">
                                                    <rect x="9.6" y="9.6" width="455.6" height="978.4" rx="70" stroke="black" strokeWidth="10" />
                                                    <rect x="2.8" y="2.8" width="469.3" height="992.1" rx="76" stroke="black" strokeWidth="5.6" />
                                                    <rect x="164.5" y="26.5" width="142.3" height="41.7" rx="20.8" fill="black" />
                                                    <text x="78" y="53" fontFamily="SF Pro Text;Inter;sans-serif" fontSize="18" fill="#ffffff" fontWeight="550">9:41</text>
                                                    <rect opacity="0.35" x="394.1" y="39.2" width="27.3" height="13.6" rx="4.3" stroke="#ffffff" strokeWidth="1.1" />
                                                    <path opacity="0.4" d="M423 44v4.5c0.9-0.3 1.5-1.2 1.5-2.2 0-1-0.6-1.9-1.5-2.3" fill="#ffffff" />
                                                    <rect x="395.8" y="40.9" width="23.9" height="10.2" rx="2.8" fill="#ffffff" />
                                                </svg>
                                                <div className="absolute inset-[12px] sm:inset-[14px] rounded-[58px] overflow-hidden flex flex-col bg-[#e5ddd5] ring-1 ring-black/10">
                                                    <div className="absolute inset-0 pointer-events-none opacity-[0.14] bg-gradient-to-br from-white via-white/0 to-black" />
                                                    <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.8),rgba(255,255,255,0)_55%)]" />
                                                    <div className="bg-[#075e54] text-white p-3 flex items-center gap-3 shrink-0 shadow-sm relative z-10 pt-8">
                                                        <div className="size-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/20">
                                                            <div className="bg-[#25D366] size-full flex items-center justify-center text-white">
                                                                <Brain size={18} />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-bold text-[13px] truncate">Connect Simulator</div>
                                                            <div className="text-[10px] text-[#cfdfdb]">en ligne</div>
                                                        </div>
                                                        <div className="flex items-center gap-3 opacity-80">
                                                            <Settings size={14} />
                                                        </div>
                                                    </div>
                                                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundSize: 'contain' }}></div>
                                                    <div className="flex-1 overflow-y-auto p-3 space-y-3 relative custom-scrollbar pt-4">
                                                        <div className="space-y-3">
                                                            {simulatorMessages.map((msg, idx) => (
                                                                <motion.div
                                                                    key={idx}
                                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                                                >
                                                                    <div className={`max-w-[85%] p-2 rounded-xl shadow-sm text-[12px] leading-[16px] relative ${msg.role === 'user' ? 'bg-[#dcf8c6] text-gray-800 rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none'}`}>
                                                                        {msg.role === 'assistant'
                                                                            ? <Streamdown>{String(msg.content || "")}</Streamdown>
                                                                            : msg.content
                                                                        }
                                                                        <div className="text-[8px] text-gray-400 mt-1 flex justify-end gap-1 items-center">
                                                                            <span>{new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                                                                            <div className="flex">
                                                                                <div className={`size-[10px] ${msg.role === 'user' ? 'text-blue-500' : 'text-gray-400'}`}>✓✓</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </motion.div>
                                                            ))}
                                                            {isSimulating && (
                                                                <div className="flex justify-start">
                                                                    <div className="bg-white p-2.5 rounded-xl shadow-sm rounded-tl-none">
                                                                        <div className="flex gap-1">
                                                                            <div className="size-1 bg-gray-300 rounded-full animate-bounce" />
                                                                            <div className="size-1 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                                                                            <div className="size-1 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <div ref={simulatorEndRef} />
                                                        </div>
                                                    </div>

                                                    <div className="bg-[#f0f0f0] pt-2 pb-6 flex flex-col items-center gap-2 shrink-0 border-t border-black/5">
                                                        <div className="w-full flex items-center justify-between px-3 gap-2">
                                                            <input
                                                                type="text"
                                                                value={simulatorPrompt}
                                                                onChange={(e) => setSimulatorPrompt(e.target.value)}
                                                                onKeyDown={(e) => e.key === 'Enter' && handleSimulatorSendMessage()}
                                                                placeholder="Message..."
                                                                className="flex-1 bg-white rounded-full h-8 px-4 outline-none text-[12px] text-gray-800 shadow-sm border border-black/5"
                                                            />
                                                            <button
                                                                onClick={handleSimulatorSendMessage}
                                                                disabled={!simulatorPrompt.trim() || isSimulating}
                                                                className="size-8 bg-[#128C7E] rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform disabled:opacity-50"
                                                            >
                                                                <ArrowUp size={16} />
                                                            </button>
                                                        </div>
                                                        <div className="w-24 h-1 bg-black/20 rounded-full mt-1"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.aside>
                            </AnimatePresence>
                        </>
                    )}
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showInstructions && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowInstructions(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-[4px]"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-2xl bg-[var(--background-gray-main)] rounded-2xl border border-[var(--border-main)] shadow-2xl p-8"
                        >
                            <h2 className="text-xl font-bold mb-4">Instructions du projet</h2>
                            <textarea
                                value={projectInstructions}
                                onChange={(e) => setProjectInstructions(e.target.value)}
                                className="w-full h-72 p-4 bg-white border border-[var(--border-main)] rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 resize-none text-[15px]"
                                placeholder="Écrivez vos instructions ici..."
                            />
                            <div className="flex justify-end gap-3 mt-6">
                                <button onClick={() => setShowInstructions(false)} className="px-6 py-2 rounded-lg border border-[var(--border-main)] hover:bg-gray-50">Annuler</button>
                                <button onClick={() => setShowInstructions(false)} className="px-6 py-2 bg-black text-white rounded-lg font-semibold hover:opacity-90">Enregistrer</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Connectors Dialog */}
            <AnimatePresence>
                {
                    showConnectors && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowConnectors(false)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-[4px]"
                            />
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="relative w-full max-w-[800px] h-[680px] bg-[var(--background-gray-main)] rounded-[20px] border border-white/5 flex flex-col overflow-hidden shadow-2xl"
                            >
                                <div className="pt-5 pe-14 pb-[16px] ps-[24px] relative">
                                    <h3 className="text-[var(--text-primary)] text-[18px] leading-[24px] font-semibold flex items-center">Connecteurs</h3>
                                    <button
                                        onClick={() => setShowConnectors(false)}
                                        className="flex h-7 w-7 items-center justify-center cursor-pointer rounded-md hover:bg-[var(--fill-tsp-gray-main)] absolute top-[20px] end-[24px] transition-colors"
                                    >
                                        <X size={20} className="text-[var(--icon-tertiary)]" />
                                    </button>
                                </div>

                                <div className="flex flex-col flex-1 min-h-0 overflow-hidden pt-[8px]">
                                    {/* Featured Connector */}
                                    <div className="px-6 pb-4">
                                        <div className="flex items-center gap-6 px-4 py-3 min-h-[76px] bg-[var(--background-menu-white)] rounded-[12px] border border-[var(--border-main)] group relative">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className="flex items-center justify-center size-10 bg-[var(--background-menu-white)] rounded-lg border border-[var(--border-main)] shrink-0">
                                                    <img alt="WhatsApp" src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="size-6" />
                                                </div>
                                                <div className="flex flex-col gap-[2px] flex-1 min-w-0">
                                                    <div className="text-[14px] font-medium leading-[20px] text-[var(--text-primary)] tracking-[-0.154px] truncate">WhatsApp</div>
                                                    <div className="text-[12px] font-normal leading-[16px] text-[var(--text-tertiary)] truncate">Automatisez vos conversations et envoyez des messages directement via Connect.</div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSelectedApp({
                                                        name: "WhatsApp",
                                                        desc: "Automatisez vos conversations et envoyez des messages directement via Connect.",
                                                        icon: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
                                                        type: "Messagerie",
                                                        author: "Connect",
                                                        url: "https://whatsapp.com",
                                                        privacy: "https://whatsapp.com/privacy"
                                                    });
                                                    setShowQR(true);
                                                }}
                                                className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors hover:bg-[var(--fill-tsp-gray-main)] h-[36px] min-w-[72px] px-[12px] gap-[6px] border border-[var(--border-btn-main)] text-[var(--text-primary)] rounded-[8px] bg-white dark:bg-[#242424] text-[14px] leading-[20px]"
                                            >
                                                {isPaired ? "Connecté" : (
                                                    <>
                                                        <Plus size={16} />
                                                        Connecter
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Tabs & Search */}
                                    <div className="px-6">
                                        <div className="flex flex-col gap-2 py-2 sm:py-0 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--border-main)]">
                                            <div className="flex items-center gap-[8px] h-[44px]">
                                                <button
                                                    onClick={() => setActiveTab("applications")}
                                                    className={`relative px-2 py-3 text-[14px] font-medium transition-colors ${activeTab === "applications" ? 'text-[var(--text-primary)] border-b-2 border-[var(--Button-primary-black)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}`}
                                                >
                                                    Applications
                                                </button>
                                                <button
                                                    onClick={() => setActiveTab("api")}
                                                    className={`relative px-2 py-3 text-[14px] font-medium transition-colors ${activeTab === "api" ? 'text-[var(--text-primary)] border-b-2 border-[var(--Button-primary-black)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}`}
                                                >
                                                    API personnalisée
                                                </button>
                                                <button
                                                    onClick={() => setActiveTab("mcp")}
                                                    className={`relative px-2 py-3 text-[14px] font-medium transition-colors ${activeTab === "mcp" ? 'text-[var(--text-primary)] border-b-2 border-[var(--Button-primary-black)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}`}
                                                >
                                                    MCP personnalisé
                                                </button>
                                            </div>
                                            <div className="flex items-center bg-[var(--fill-tsp-white-main)] rounded-[8px] px-3 py-1.5 gap-2 w-full sm:w-[200px]">
                                                <Search size={16} className="text-[var(--icon-secondary)]" />
                                                <input placeholder="Rechercher" className="bg-transparent border-none outline-none text-[13px] w-full" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Grid of Connectors */}
                                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                                        {activeTab === "applications" && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-6">
                                                {[
                                                    {
                                                        name: "Gmail",
                                                        desc: "Accédez facilement à vos e-mails, recherchez, organisez et répondez-y avec Connect pour une productivité améliorée.",
                                                        icon: "https://d1oupeiobkpcny.cloudfront.net/assets/dashboard/materials/2025/08/29/67030616adb5e0ee57ead43394db33e557c56158e0047655fd695f353a9454ae.webp",
                                                        type: "Application",
                                                        author: "Connect",
                                                        url: "https://mail.google.com",
                                                        privacy: "https://policies.google.com/privacy"
                                                    },
                                                    {
                                                        name: "Google Agenda",
                                                        desc: "Planifiez des réunions, gérez votre calendrier et recevez des rappels intelligents directement.",
                                                        icon: "https://d1oupeiobkpcny.cloudfront.net/assets/dashboard/materials/2025/08/29/4ea9c5a92002d43fa460de537cd79c9f325d6aa22c4a82a7ba4cf6f50dd3303a.webp",
                                                        type: "Application",
                                                        author: "Connect",
                                                        url: "https://calendar.google.com",
                                                        privacy: "https://policies.google.com/privacy"
                                                    },
                                                    {
                                                        name: "Google Drive",
                                                        desc: "Accédez à vos documents, feuilles de calcul et présentations pour une analyse contextuelle.",
                                                        icon: "https://d1oupeiobkpcny.cloudfront.net/assets/dashboard/materials/2025/11/20/e1b2e58265cb7a57264764d6184467e67b69e83e424cae854a9bb93ac5ddc6c2.webp",
                                                        type: "Application",
                                                        author: "Connect",
                                                        url: "https://drive.google.com",
                                                        privacy: "https://policies.google.com/privacy"
                                                    },
                                                    {
                                                        name: "GitHub",
                                                        desc: "Gérez vos dépôts, suivez les commits et gérez les problèmes de manière automatisée.",
                                                        icon: "https://d1oupeiobkpcny.cloudfront.net/assets/dashboard/materials/2025/08/29/929f4a07401e2208f3ed494ad8268fd86e5c8091080ab3c2aabf5b2eeac88eba.webp",
                                                        type: "Application",
                                                        author: "Connect",
                                                        url: "https://github.com",
                                                        privacy: "https://docs.github.com/privacy"
                                                    },
                                                    {
                                                        name: "Slack",
                                                        desc: "Lisez et rédigez des messages Slack, gérez les notifications et les canaux.",
                                                        icon: "https://files.manuscdn.com/assets/image/slack.png",
                                                        type: "Application",
                                                        author: "Connect",
                                                        url: "https://slack.com",
                                                        privacy: "https://slack.com/privacy"
                                                    },
                                                    {
                                                        name: "Notion",
                                                        desc: "Recherchez dans votre base de connaissances et synchronisez vos pages Notion.",
                                                        icon: "https://d1oupeiobkpcny.cloudfront.net/assets/dashboard/materials/2025/08/29/dafefc2ce61fde1fb5310d4542403bc866bfa70c931d8b2ff3d9f8788fd6cfcf.webp",
                                                        type: "Application",
                                                        author: "Connect",
                                                        url: "https://notion.so",
                                                        privacy: "https://notion.so/privacy-policy"
                                                    }
                                                ].map((app, i) => (
                                                    <div
                                                        key={i}
                                                        onClick={() => setSelectedApp(app)}
                                                        className="flex items-center gap-3 px-4 py-3 min-h-[76px] bg-[var(--background-menu-white)] rounded-[12px] border border-[var(--border-main)] cursor-pointer hover:bg-[var(--fill-tsp-white-light)] transition-colors"
                                                    >
                                                        <div className="flex items-center justify-center size-10 bg-[var(--background-menu-white)] rounded-lg border border-[var(--border-main)] shrink-0">
                                                            <img alt={app.name} src={app.icon} className="size-6" />
                                                        </div>
                                                        <div className="flex flex-col items-start justify-center min-w-0 flex-1">
                                                            <div className="text-[14px] font-medium text-[var(--text-primary)] truncate">{app.name}</div>
                                                            <div className="text-[12px] text-[var(--text-tertiary)] line-clamp-2">{app.desc}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {activeTab === "api" && (
                                            <div className="space-y-6 pb-6">
                                                <div className="flex gap-2.5 items-start p-3 bg-[var(--fill-tsp-white-light)] rounded-xl">
                                                    <div className="flex items-center justify-center size-4 shrink-0 mt-0.5">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-key-round" aria-hidden="true"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle></svg>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[13px] leading-[18px] text-[var(--text-secondary)] tracking-[-0.091px]">Connectez Connect de manière programmatique à tout service tiers en utilisant vos propres clés API.</p>
                                                    </div>
                                                </div>

                                                <div className="grid gap-3 md:grid-cols-2 justify-center">
                                                    <div className="flex items-center justify-center gap-3 px-4 py-3 min-h-[76px] bg-[var(--background-menu-white)] rounded-xl cursor-pointer hover:bg-[var(--fill-tsp-white-light)] border border-[var(--border-main)]">
                                                        <div className="flex items-center gap-1.5 text-[var(--text-primary)]">
                                                            <Plus size={20} />
                                                            <span className="text-[14px] font-medium leading-[20px] tracking-[-0.154px]">Ajouter une API personnalisée</span>
                                                        </div>
                                                    </div>

                                                    {[
                                                        {
                                                            name: "OpenAI",
                                                            desc: "Exploitez la série de modèles GPT pour la génération et le traitement intelligents de texte.",
                                                            icon: "https://d1oupeiobkpcny.cloudfront.net/assets/dashboard/materials/2025/08/29/e0568781bf237872ccc0e37e2a473016904886c9c9f4c1938bdcf2e477652e97.webp",
                                                            type: "API personnalisée",
                                                            author: "Connect",
                                                            url: "https://openai.com",
                                                            privacy: "https://openai.com/policies/privacy-policy"
                                                        },
                                                        {
                                                            name: "Anthropic",
                                                            desc: "Accédez à des services d'assistant AI fiables avec des conversations sûres et intelligentes",
                                                            icon: "https://d1oupeiobkpcny.cloudfront.net/assets/dashboard/materials/2025/08/29/e294daa9bbb965e50193c91790cf3c46effd9d2a9c2d5b03c05815f67d045486.webp",
                                                            type: "API personnalisée",
                                                            author: "Connect",
                                                            url: "https://anthropic.com",
                                                            privacy: "https://anthropic.com/privacy"
                                                        },
                                                        {
                                                            name: "Google Gemini",
                                                            desc: "Traitez du contenu multimodal, notamment du texte, des images et du code, de manière transparente.",
                                                            icon: "https://d1oupeiobkpcny.cloudfront.net/assets/dashboard/materials/2025/08/29/5defb3e712ef68ad178f579320b9281cd095e8acc54d3c9657f6a4d98ef75ece.webp",
                                                            type: "API personnalisée",
                                                            author: "Connect",
                                                            url: "https://deepmind.google/technologies/gemini/",
                                                            privacy: "https://policies.google.com/privacy"
                                                        },
                                                        {
                                                            name: "Perplexity",
                                                            desc: "Recherchez des informations en temps réel et obtenez des réponses précises avec des citations fiables",
                                                            icon: "https://d1oupeiobkpcny.cloudfront.net/assets/dashboard/materials/2025/08/29/d24b6cb7ee2fe60309d7da4b7e07cada08c8621a207a39e14096e0adb8a9364c.webp",
                                                            type: "API personnalisée",
                                                            author: "Connect",
                                                            url: "https://perplexity.ai",
                                                            privacy: "https://perplexity.ai/privacy"
                                                        },
                                                        {
                                                            name: "Cohere",
                                                            desc: "Créez des applications d'IA pour les entreprises et optimisez les flux de travail de traitement de texte",
                                                            icon: "https://d1oupeiobkpcny.cloudfront.net/assets/dashboard/materials/2025/08/28/cfa97d813ee274435ea3511171067325506da91c9bc0aa3d8a6a322578cd092b.webp",
                                                            type: "API personnalisée",
                                                            author: "Connect",
                                                            url: "https://cohere.com",
                                                            privacy: "https://cohere.com/privacy"
                                                        },
                                                        {
                                                            name: "ElevenLabs",
                                                            desc: "Générez des voix réalistes, clonez des voix et créez du contenu audio personnalisé",
                                                            icon: "https://d1oupeiobkpcny.cloudfront.net/assets/dashboard/materials/2025/08/29/5730cce1fa2bd7a794b7830970ca246dd19d51df3520366b4752472b80c6a9aa.webp",
                                                            type: "API personnalisée",
                                                            author: "Connect",
                                                            url: "https://elevenlabs.io",
                                                            privacy: "https://elevenlabs.io/privacy"
                                                        },
                                                        {
                                                            name: "Grok",
                                                            desc: "Accédez à des informations en temps réel et engagez des conversations intelligentes",
                                                            icon: "https://d1oupeiobkpcny.cloudfront.net/assets/dashboard/materials/2025/09/05/026b4d5d8cf7fb6276e0df0fd1a7c79a0be9fd0004e867e59a93dc672fd63117.webp",
                                                            type: "API personnalisée",
                                                            author: "Connect",
                                                            url: "https://x.ai",
                                                            privacy: "https://x.ai/privacy"
                                                        },
                                                        {
                                                            name: "OpenRouter",
                                                            desc: "Accédez à plusieurs modèles d'IA et gérez les appels API via une interface unifiée",
                                                            icon: "https://d1oupeiobkpcny.cloudfront.net/assets/dashboard/materials/2025/08/29/626bf5dc828e205a75af343157209b3b64138434c2a796a6b1bf76013e0b12f5.webp",
                                                            type: "API personnalisée",
                                                            author: "Connect",
                                                            url: "https://openrouter.ai",
                                                            privacy: "https://openrouter.ai/privacy"
                                                        },
                                                        {
                                                            name: "Ahrefs",
                                                            desc: "Optimisez les stratégies SEO, analysez les mots-clés et suivez les performances des liens retour.",
                                                            icon: "https://d1oupeiobkpcny.cloudfront.net/assets/dashboard/materials/2025/09/02/56f4348fe7ca6cfd784320a1ec79095b226efe569f066d8d6914e2a881b0b8cd.webp",
                                                            type: "API personnalisée",
                                                            author: "Connect",
                                                            url: "https://ahrefs.com",
                                                            privacy: "https://ahrefs.com/privacy-policy"
                                                        },
                                                        {
                                                            name: "Similarweb",
                                                            desc: "Analysez le trafic de site web et obtenez des informations sur l'intelligence concurrentielle du marché.",
                                                            icon: "https://d1oupeiobkpcny.cloudfront.net/assets/dashboard/materials/2025/09/05/28761bd902ade928ad94afe4fba2badb922625e8017b5badd1d063e0e25ba15b.webp",
                                                            type: "API personnalisée",
                                                            author: "Connect",
                                                            url: "https://similarweb.com",
                                                            privacy: "https://similarweb.com/privacy-policy"
                                                        },
                                                        {
                                                            name: "Dropbox",
                                                            desc: "Gérez les fichiers, dossiers et partages dans Dropbox",
                                                            icon: "https://d1oupeiobkpcny.cloudfront.net/assets/dashboard/materials/2025/12/08/2dfe85a8a302af4faf2615a75bf679eb39b9a53836f06f2ec7d6b419eb805c78.webp",
                                                            type: "API personnalisée",
                                                            author: "Connect",
                                                            url: "https://dropbox.com",
                                                            privacy: "https://dropbox.com/privacy"
                                                        },
                                                        {
                                                            name: "Flux",
                                                            desc: "Créez des images générées par IA avec des styles artistiques et des concepts variés.",
                                                            icon: "https://d1oupeiobkpcny.cloudfront.net/assets/dashboard/materials/2025/09/01/417b88f954c464dae388d41e498e0a94a513e74ca34fa9fa7f96e1f43b652559.webp",
                                                            type: "API personnalisée",
                                                            author: "Connect",
                                                            url: "https://blackforestlabs.ai",
                                                            privacy: "https://blackforestlabs.ai/privacy"
                                                        },
                                                        {
                                                            name: "Kling",
                                                            desc: "Générez un contenu vidéo AI de haute qualité et donnez vie à des concepts visuels créatifs.",
                                                            icon: "https://d1oupeiobkpcny.cloudfront.net/assets/dashboard/materials/2025/08/29/47e077b7a189f573c2e6fadc619135ef5d4840392c6d4a3f1fd0b995eab7e084.webp",
                                                            type: "API personnalisée",
                                                            author: "Connect",
                                                            url: "https://klingai.com",
                                                            privacy: "https://klingai.com/privacy"
                                                        },
                                                        {
                                                            name: "Tripo AI",
                                                            desc: "Transformez rapidement du texte ou des images en modèles 3D détaillés",
                                                            icon: "https://d1oupeiobkpcny.cloudfront.net/assets/dashboard/materials/2025/08/29/f351b021c47ff9e0e7ffe153c36f7ee8ef7bc1d846335653b659b0c1ea3dc6d8.webp",
                                                            type: "API personnalisée",
                                                            author: "Connect",
                                                            url: "https://tripo3d.ai",
                                                            privacy: "https://tripo3d.ai/privacy"
                                                        },
                                                        {
                                                            name: "n8n",
                                                            desc: "Créez des workflows automatisés et connectez facilement différentes applications",
                                                            icon: "https://d1oupeiobkpcny.cloudfront.net/assets/dashboard/materials/2025/08/29/1e399dd42cc91ed26957533b17598018c766c84943582de857db90713016a092.webp",
                                                            type: "API personnalisée",
                                                            author: "Connect",
                                                            url: "https://n8n.io",
                                                            privacy: "https://n8n.io/privacy"
                                                        },
                                                        {
                                                            name: "API Stripe",
                                                            desc: "Gérez les transactions de manière programmatique et automatisez la facturation pour votre entreprise.",
                                                            icon: "https://d1oupeiobkpcny.cloudfront.net/assets/dashboard/materials/2025/08/29/b309dee4acc93698682b295bcefdb2e398f3c2a368b6e063b08457863ffb4652.webp",
                                                            type: "API personnalisée",
                                                            author: "Connect",
                                                            url: "https://stripe.com",
                                                            privacy: "https://stripe.com/privacy"
                                                        },
                                                        {
                                                            name: "API Cloudflare",
                                                            desc: "Automatisez et gérez votre infrastructure web avec l'API Cloudflare",
                                                            icon: "https://d1oupeiobkpcny.cloudfront.net/assets/dashboard/materials/2025/08/29/bead2275e1f603c9958585b26af76c0ac0a33ae7a75b4a9d054ec4dbd8c53239.webp",
                                                            type: "API personnalisée",
                                                            author: "Connect",
                                                            url: "https://cloudflare.com",
                                                            privacy: "https://cloudflare.com/privacypolicy"
                                                        },
                                                        {
                                                            name: "API Supabase",
                                                            desc: "Gérez des bases de données Postgres avec authentification, stockage de fichiers et plus encore",
                                                            icon: "https://d1oupeiobkpcny.cloudfront.net/assets/dashboard/materials/2025/08/29/178c50ad48998d8331a9667ef3dcd1638355bc2f4933e61f35bf9c7140d141c8.webp",
                                                            type: "API personnalisée",
                                                            author: "Connect",
                                                            url: "https://supabase.com",
                                                            privacy: "https://supabase.com/privacy"
                                                        },
                                                        {
                                                            name: "Polygon.io",
                                                            desc: "Accédez à des données de marché en temps réel et historiques pour les actions, les devises, les crypto-monnaies et les options",
                                                            icon: "https://d1oupeiobkpcny.cloudfront.net/assets/dashboard/materials/2025/08/29/2bfbf460efac8b399a2d456df37781a9609ff3c03849de13a6f239495d593171.webp",
                                                            type: "API personnalisée",
                                                            author: "Connect",
                                                            url: "https://polygon.io",
                                                            privacy: "https://polygon.io/privacy-policy"
                                                        },
                                                        {
                                                            name: "Marketing Mailchimp",
                                                            desc: "Gérez les audiences, envoyez des campagnes et suivez les performances de votre marketing par e-mail",
                                                            icon: "https://d1oupeiobkpcny.cloudfront.net/assets/dashboard/materials/2025/11/14/880b4067bec129175734c8e201e1f2c709cdcfabc9e468b1eaec601ffcbd4f9c.webp",
                                                            type: "API personnalisée",
                                                            author: "Connect",
                                                            url: "https://mailchimp.com",
                                                            privacy: "https://mailchimp.com/legal/privacy"
                                                        },
                                                        {
                                                            name: "Apollo",
                                                            desc: "Automatisez la prospection de ventes B2B, la génération de leads et l'exécution des transactions",
                                                            icon: "https://d1oupeiobkpcny.cloudfront.net/assets/dashboard/materials/2025/10/31/ae3858c1ec05034fc5c7de83131b84167961dd512b348a2df4ed97ca9f7ac428.webp",
                                                            type: "API personnalisée",
                                                            author: "Connect",
                                                            url: "https://apollo.io",
                                                            privacy: "https://apollo.io/privacy-policy"
                                                        },
                                                        {
                                                            name: "JSONBin.io",
                                                            desc: "Stockez et gérez des données JSON avec un accès rapide à l'API pour les projets de développement",
                                                            icon: "https://d1oupeiobkpcny.cloudfront.net/assets/dashboard/materials/2025/08/29/9c5f01c1242e14c15cda99afd8c985795ee4c795074b87f3371a3fae59714847.webp",
                                                            type: "API personnalisée",
                                                            author: "Connect",
                                                            url: "https://jsonbin.io",
                                                            privacy: "https://jsonbin.io/privacy-policy"
                                                        },
                                                        {
                                                            name: "Typeform",
                                                            desc: "Créez des formulaires, collectez des réponses et gérez les webhooks",
                                                            icon: "https://d1oupeiobkpcny.cloudfront.net/assets/dashboard/materials/2025/10/03/16e863ab4f4a87080d4caa725fd3a20edd7bf207129b50d9d9cbd99b219e1b93.webp",
                                                            type: "API personnalisée",
                                                            author: "Connect",
                                                            url: "https://typeform.com",
                                                            privacy: "https://typeform.com/privacy-policy"
                                                        },
                                                        {
                                                            name: "API HeyGen",
                                                            desc: "Générez des vidéos alimentées par l'IA avec des avatars réalistes grâce à l'API HeyGen",
                                                            icon: "https://d1oupeiobkpcny.cloudfront.net/assets/dashboard/materials/2026/01/23/2e16a94911f20fbbfb6d6c31c8b086c868d4e8097555100a1cab6eea2dbb858a.webp",
                                                            type: "API personnalisée",
                                                            author: "Connect",
                                                            url: "https://heygen.com",
                                                            privacy: "https://heygen.com/privacy"
                                                        }
                                                    ].map((app, i) => (
                                                        <div
                                                            key={i}
                                                            onClick={() => setSelectedApp(app)}
                                                            className="flex items-center gap-3 px-4 py-3 min-h-[80px] bg-[var(--background-menu-white)] rounded-[12px] border border-[var(--border-main)] cursor-pointer hover:bg-[var(--fill-tsp-white-light)] transition-colors"
                                                        >
                                                            <div className="flex items-center justify-center size-10 bg-[var(--background-menu-white)] rounded-lg border border-[var(--border-main)] shrink-0">
                                                                <img alt={app.name} src={app.icon} style={{ width: 24, height: 24 }} />
                                                            </div>
                                                            <div className="flex flex-col items-start justify-center min-w-0 flex-1">
                                                                <div className="text-[14px] font-medium text-[var(--text-primary)] truncate tracking-[-0.154px]">{app.name}</div>
                                                                <div className="text-[12px] text-[var(--text-tertiary)] line-clamp-2 leading-[16px] tracking-[-0.091px]">{app.desc}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="text-center text-[14px] leading-[20px] text-[var(--text-tertiary)] pt-2 pb-6">
                                                    Vous ne trouvez pas ce que vous cherchez ? <a href="#" className="underline">Dites-le-nous !</a>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === "mcp" && (
                                            <div className="flex flex-col w-full h-full items-center justify-center gap-2.5 py-12">
                                                <div className="flex size-8 items-center justify-center">
                                                    <Cable size={32} className="text-[var(--icon-tertiary)]" />
                                                </div>
                                                <p className="text-center text-[13px] leading-[22px] text-[var(--text-tertiary)]">Aucun MCP personnalisé ajouté pour l&apos;instant.</p>
                                                <button className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-all bg-[var(--Button-primary-black)] text-[var(--text-onblack)] h-[36px] min-w-[72px] px-[12px] text-sm gap-1.5 rounded-[10px] hover:opacity-90 active:scale-95">
                                                    <Plus size={16} />
                                                    <span className="text-nowrap text-[14px] font-medium leading-[20px] tracking-[-0.154px]">Ajouter un MCP personnalisé</span>
                                                    <ChevronDown size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )
                }
            </AnimatePresence>

            {/* App Detail Modal */}
            <AnimatePresence>
                {
                    selectedApp && (
                        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedApp(null)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-[4px]"
                            />
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="relative w-[500px] max-w-[95%] max-h-[95%] bg-[var(--background-gray-main)] rounded-[20px] border border-[var(--border-main)] overflow-auto shadow-2xl"
                            >
                                <div className="flex flex-col items-start justify-start relative w-full h-full">
                                    <div className="bg-[var(--background-gray-main)] flex gap-6 items-center justify-end px-6 py-5 relative shrink-0 w-full sticky top-0 z-10">
                                        <button
                                            onClick={() => setSelectedApp(null)}
                                            className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors active:opacity-80 text-[var(--text-primary)] hover:opacity-80 p-0"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <div className="flex flex-col gap-12 items-center justify-center pb-8 pt-0 px-6 relative shrink-0 w-full">
                                        <div className="flex flex-col gap-4 items-center justify-center max-w-[600px] p-0 relative shrink-0 w-full text-center">
                                            <div className="bg-[var(--background-menu-white)] flex items-center justify-center p-[8px] relative rounded-xl shrink-0 size-16 border border-[var(--border-main)]">
                                                <img alt={selectedApp.name} src={selectedApp.icon} className="size-10" />
                                            </div>
                                            <div className="flex flex-col gap-2 items-start justify-center p-0 relative shrink-0 text-center w-full">
                                                <div className="font-semibold text-[var(--text-primary)] text-[20px] tracking-[-0.44px] w-full leading-[26px]">
                                                    {selectedApp.name}
                                                </div>
                                                <div className="font-normal text-[var(--text-tertiary)] tracking-[-0.154px] w-full text-[14px] leading-[20px]">
                                                    {selectedApp.desc}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    if (selectedApp.name === "WhatsApp") {
                                                        setShowQR(true);
                                                    }

                                                    if (selectedApp.name === "Gmail") {
                                                        const returnTo = typeof window !== "undefined" ? window.location.href : "";
                                                        const url = `http://127.0.0.1:3004/auth/start?returnTo=${encodeURIComponent(returnTo)}`;
                                                        const popup = typeof window !== "undefined" ? window.open(url, "_blank") : null;
                                                        if (!popup && typeof window !== "undefined") {
                                                            window.location.href = url;
                                                        }
                                                    }

                                                    if (selectedApp.name === "Google Agenda") {
                                                        const returnTo = typeof window !== "undefined" ? window.location.href : "";
                                                        const url = `http://localhost:3500?returnTo=${encodeURIComponent(returnTo)}`;
                                                        const popup = typeof window !== "undefined" ? window.open(url, "_blank") : null;
                                                        if (!popup && typeof window !== "undefined") {
                                                            window.location.href = url;
                                                        }
                                                    }

                                                    if (["Google Drive", "GitHub", "Slack", "Notion"].includes(selectedApp.name)) {
                                                        // Simulation de connexion pour les apps sans pont réel implémenté
                                                        const setters: Record<string, any> = {
                                                            "Google Drive": setIsDriveConnected,
                                                            "GitHub": setIsGithubConnected,
                                                            "Slack": setIsSlackConnected,
                                                            "Notion": setIsNotionConnected,
                                                        };
                                                        const setter = setters[selectedApp.name];
                                                        if (setter) {
                                                            setter(true);
                                                            // On pourrait aussi ouvrir une URL de doc ou un placeholder
                                                        }
                                                    }
                                                }}
                                                className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors hover:bg-[var(--fill-tsp-gray-main)] h-[36px] min-w-[72px] px-[12px] gap-[6px] border border-[var(--border-btn-main)] text-[var(--text-primary)] rounded-[8px] bg-white dark:bg-[#242424] text-[14px] leading-[20px]"
                                            >
                                                {(isPaired && selectedApp.name === "WhatsApp") ||
                                                    (isGmailConnected && selectedApp.name === "Gmail") ||
                                                    (isCalendarConnected && selectedApp.name === "Google Agenda") ||
                                                    (isDriveConnected && selectedApp.name === "Google Drive") ||
                                                    (isGithubConnected && selectedApp.name === "GitHub") ||
                                                    (isSlackConnected && selectedApp.name === "Slack") ||
                                                    (isNotionConnected && selectedApp.name === "Notion") ? "Connecté" : (
                                                    <>
                                                        <Plus size={16} />
                                                        Connecter
                                                    </>
                                                )}
                                            </button>

                                            {/* WhatsApp QR Code Section */}
                                            <AnimatePresence>
                                                {showQR && selectedApp.name === "WhatsApp" && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 10 }}
                                                        className="w-full flex flex-col items-center gap-6 p-6 mt-4 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-[var(--border-main)] shadow-sm"
                                                    >
                                                        <div className="flex flex-col items-center gap-2">
                                                            <h4 className="text-[16px] font-semibold text-[var(--text-primary)]">Scannez le code QR</h4>
                                                            <p className="text-[13px] text-[var(--text-tertiary)] text-center">
                                                                Ouvrez WhatsApp sur votre téléphone, accédez aux paramètres {">"} Appareils connectés, et scannez ce code.
                                                            </p>
                                                        </div>

                                                        <div className="relative p-4 bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center justify-center">
                                                            {whatsappQR ? (
                                                                <QRCodeSVG
                                                                    value={whatsappQR || ""}
                                                                    size={200}
                                                                    level="H"
                                                                    includeMargin={false}
                                                                />
                                                            ) : (
                                                                <div className="size-[200px] flex items-center justify-center bg-gray-50 rounded-lg animate-pulse">
                                                                    <div className="text-[12px] text-gray-400">Chargement du code...</div>
                                                                </div>
                                                            )}
                                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                                                                <img src={selectedApp.icon} className="size-12" alt="" />
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={() => setShowQR(false)}
                                                            className="text-[13px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                                                        >
                                                            Annuler
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <div className="flex flex-col gap-3 items-start justify-start p-[12px] relative rounded-xl shrink-0 w-full bg-[var(--background-gray-main)] border border-[var(--border-main)]">
                                            <div className="flex items-center justify-start p-0 relative shrink-0 w-full text-[14px] tracking-[-0.091px]">
                                                <div className="basis-0 grow relative shrink-0 text-[var(--text-tertiary)]">
                                                    <p className="leading-[20px]">Type de connecteur</p>
                                                </div>
                                                <div className="relative shrink-0 text-[var(--text-primary)] text-right">
                                                    <p className="leading-[20px]">{selectedApp.type}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between p-0 relative shrink-0 w-full text-[14px] tracking-[-0.091px]">
                                                <div className="basis-0 grow relative shrink-0 text-[var(--text-tertiary)]">
                                                    <p className="leading-[20px] capitalize">Auteur</p>
                                                </div>
                                                <span className="text-[var(--text-primary)]">{selectedApp.author}</span>
                                            </div>
                                            <div className="flex items-center justify-start p-0 relative shrink-0 w-full text-[14px] tracking-[-0.091px]">
                                                <div className="basis-0 grow relative shrink-0 text-[var(--text-tertiary)]">
                                                    <p className="leading-[20px]">UUID</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button className="flex items-center justify-center shrink-0 cursor-pointer hover:opacity-80">
                                                        <Copy size={14} className="text-blue-500" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between p-0 relative shrink-0 w-full text-[14px] tracking-[-0.091px]">
                                                <div className="basis-0 grow relative shrink-0 text-[var(--text-tertiary)]">
                                                    <p className="leading-[20px] capitalize">Site web</p>
                                                </div>
                                                <a href={selectedApp.url} target="_blank" rel="noopener noreferrer" className="flex gap-1 items-center">
                                                    <SquareArrowOutUpRight size={14} className="text-blue-500" />
                                                </a>
                                            </div>
                                            <div className="flex items-center justify-between p-0 relative shrink-0 w-full text-[14px] tracking-[-0.091px]">
                                                <div className="basis-0 grow relative shrink-0 text-[var(--text-tertiary)]">
                                                    <p className="leading-[20px] capitalize">Politique de confidentialité</p>
                                                </div>
                                                <a href={selectedApp.privacy} target="_blank" rel="noopener noreferrer" className="flex gap-1 items-center">
                                                    <SquareArrowOutUpRight size={14} className="text-blue-500" />
                                                </a>
                                            </div>
                                        </div>

                                        <div className="text-center w-full pb-2">
                                            <a className="text-[13px] text-[var(--text-tertiary)] underline" href="#" target="_blank" rel="noopener noreferrer">
                                                Fournir des retours
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )
                }
            </AnimatePresence>

            {/* Instructions Modal */}
            <AnimatePresence>
                {
                    showInstructions && (
                        <div className="fixed inset-0 z-[120] grid items-center justify-items-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowInstructions(false)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-[4px]"
                            />
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="relative flex flex-col w-full max-w-3xl bg-[var(--background-gray-main)] rounded-2xl border border-[var(--border-main)] overflow-hidden shadow-2xl"
                            >
                                <div className="p-6 md:p-8 flex flex-col gap-6">
                                    <div className="flex flex-col gap-1">
                                        <h2 className="text-xl font-bold text-[var(--text-primary)]">Définir les instructions du projet</h2>
                                        <p className="text-[var(--text-tertiary)] text-sm">
                                            Fournissez à l&apos;IA des instructions et des informations pertinentes pour les conversations dans whatsapp.&nbsp;
                                            Cela fonctionnera en parallèle des <a className="inline underline underline-offset-[3px] decoration-black/20 cursor-pointer" href="#">préférences utilisateur</a> et du style sélectionné dans une conversation.
                                        </p>
                                    </div>

                                    <div className="relative group">
                                        <textarea
                                            value={projectInstructions}
                                            onChange={(e) => setProjectInstructions(e.target.value)}
                                            className="w-full bg-[var(--background-menu-white)] border border-[var(--border-main)] p-4 leading-relaxed rounded-[0.6rem] transition-colors focus:border-black/20 focus:outline-none placeholder:text-[var(--text-disable)] text-[var(--text-primary)] resize-none"
                                            rows={12}
                                            placeholder="Écrivez vos instructions ici..."
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3 pt-2">
                                        <button
                                            onClick={() => setShowInstructions(false)}
                                            className="px-5 py-2 rounded-lg text-sm font-semibold border border-[var(--border-main)] hover:bg-[var(--fill-tsp-gray-main)] transition-colors"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            onClick={handleSaveInstructions}
                                            className="px-5 py-2 bg-[var(--Button-primary-black)] text-[var(--text-onblack)] rounded-lg text-sm font-semibold hover:opacity-90 transition-all active:scale-95"
                                        >
                                            Enregistrer les instructions
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )
                }
            </AnimatePresence>

            {/* Add Text Content Modal */}
            <AnimatePresence>
                {
                    showTextModal && (
                        <div className="fixed inset-0 z-[120] grid items-center justify-items-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowTextModal(false)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-[4px]"
                            />
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="relative flex flex-col w-full max-w-3xl bg-[var(--background-gray-main)] rounded-2xl border border-[var(--border-main)] overflow-hidden shadow-2xl p-8 pt-7"
                            >
                                <form
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        try {
                                            const res = await fetch(`/api/automations/${id}/knowledge`, {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({
                                                    title: textTitle,
                                                    content: textContent,
                                                }),
                                            });
                                            const data = await res.json();
                                            if (data?.success && data?.knowledgeBaseId) {
                                                setKnowledgeBaseId(data.knowledgeBaseId);
                                            }

                                            if (data?.success && data?.document?.id) {
                                                addKnowledgeAttachment({
                                                    id: String(data.document.id),
                                                    title: String(data.document.title || textTitle || "Texte"),
                                                    kind: "text",
                                                    chunks: typeof data.document.chunks === "number" ? data.document.chunks : undefined,
                                                });
                                            }
                                        } catch (err) {
                                            console.error("Failed to save knowledge:", err);
                                        } finally {
                                            setShowTextModal(false);
                                            setTextTitle("");
                                            setTextContent("");
                                        }
                                    }}
                                    className="flex flex-col gap-5"
                                >
                                    <h2 className="text-xl font-medium text-[var(--text-primary)]">Ajouter du contenu textuel</h2>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[var(--text-secondary)] text-sm font-medium">Titre</label>
                                        <input
                                            type="text"
                                            placeholder="Nommez votre contenu"
                                            required
                                            value={textTitle}
                                            onChange={(e) => setTextTitle(e.target.value)}
                                            className="w-full h-11 px-3 bg-[var(--background-menu-white)] border border-[var(--border-main)] rounded-[0.6rem] text-[var(--text-primary)] focus:outline-none focus:border-black/20 transition-colors"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[var(--text-secondary)] text-sm font-medium">Contenu</label>
                                        <textarea
                                            placeholder="Tapez ou collez du contenu..."
                                            required
                                            rows={12}
                                            value={textContent}
                                            onChange={(e) => setTextContent(e.target.value)}
                                            className="w-full p-3 bg-[var(--background-menu-white)] border border-[var(--border-main)] rounded-[0.6rem] text-[var(--text-primary)] focus:outline-none focus:border-black/20 transition-colors resize-none max-h-[40vh] overflow-y-auto"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3 mt-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowTextModal(false)}
                                            className="px-5 py-2 rounded-lg text-sm font-semibold border border-[var(--border-main)] hover:bg-[var(--fill-tsp-gray-main)] transition-colors"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-5 py-2 bg-[var(--Button-primary-black)] text-[var(--text-onblack)] rounded-lg text-sm font-semibold hover:opacity-90 transition-all active:scale-[0.985]"
                                        >
                                            Ajouter du contenu
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )
                }
            </AnimatePresence>

            {/* WhatsApp Preview Popover */}
            <AnimatePresence>
                {showWhatsappPreview && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowWhatsappPreview(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 10 }}
                            className="relative"
                        >
                            <div className="backdrop-blur-2xl bg-[var(--background-menu-white)] p-[12px] rounded-[16px] border border-[var(--border-main)] shadow-[0px_4px_11px_0px_rgba(0,0,0,0.1)]">
                                <div className="flex flex-col gap-4 items-center w-[274px]">
                                    <p className="text-[16px] font-[500] text-[var(--text-primary)] leading-6 tracking-[-0.45px]">Prévisualiser sur votre téléphone</p>
                                    <div className="bg-[var(--fill-tsp-white-light)] rounded-2xl p-3 pb-4 flex flex-col gap-4 w-full">
                                        <div className="flex flex-col gap-3">
                                            <div className="size-[250px] flex items-center justify-center bg-[var(--background-menu-white)] rounded-[12px] border-[0.5px] border-[var(--border-main)]">
                                                <div className="rounded-[4px] overflow-hidden p-0 bg-transparent">
                                                    {whatsappQR ? (
                                                        <QRCodeSVG
                                                            value={whatsappQR}
                                                            size={217}
                                                            level="H"
                                                            includeMargin={false}
                                                        />
                                                    ) : (
                                                        <div className="size-[217px] flex items-center justify-center bg-gray-50/50">
                                                            <div className="text-[12px] text-gray-400">Génération...</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
