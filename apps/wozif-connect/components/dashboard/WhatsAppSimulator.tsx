"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    ArrowLeft,
    MoreVertical,
    Phone,
    Video,
    Smile,
    Paperclip,
    Mic,
    Send,
    Check,
    CheckCheck,
    Loader2,
    QrCode,
    Share2,
    SendHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    time: string;
    imageUrl?: string;
    status?: 'sending' | 'sent' | 'delivered' | 'read';
}

interface WhatsAppSimulatorProps {
    isProduction?: boolean;
    userId?: string;
    onConnect?: () => void;
    onProcessingChange?: (isProcessing: boolean) => void;
    onExecutionResult?: (result: ExecutionResult) => void;
    template?: 'support' | 'ecommerce' | 'appointment' | 'default';
    nodes?: any[];
}

export interface NodeExecutionStatus {
    nodeId: number;
    nodeType: string;
    status: 'success' | 'error' | 'skipped';
    message?: string;
    duration?: number;
}

export interface ExecutionResult {
    success: boolean;
    executedNodes: NodeExecutionStatus[];
    logs: string[];
}

export function WhatsAppSimulator({
    isProduction = false,
    userId = "default",
    onConnect,
    onProcessingChange,
    onExecutionResult,
    template = 'default',
    nodes = []
}: WhatsAppSimulatorProps) {
    const isTelegram = nodes.some(n => n.type === 'telegram_message' || n.type === 'tg_buttons');

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: isProduction
                ? "Connectez votre WhatsApp pour tester en conditions réelles."
                : "Salut ! Comment puis-je vous aider ?",
            sender: 'bot',
            time: "09:41" // Stable time for hydration
        },
    ]);
    // Numéro simulé pour les tests
    const SIMULATED_USER_NUMBER = "0703324674";
    const [inputValue, setInputValue] = useState("");
    const [status, setStatus] = useState<'DISCONNECTED' | 'CONNECTED' | 'INITIALIZING'>('INITIALIZING');
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [isLinkedToPhone, setIsLinkedToPhone] = useState(false);
    const [connectedSession, setConnectedSession] = useState<{ name: string; jid: string; fullJid?: string; bridgeUserId?: string } | null>(null);
    // Client destinataire pour les messages réels (simule le client qui écrit)
    const [targetClient, setTargetClient] = useState<{ name: string; jid: string; bridgeUserId?: string } | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const isLoaded = useRef(false);

    // Fetch real sessions from bridge
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/sessions');
                const data = await response.json();
                if (data.success) {
                    // Trouver le master (la SIM qui envoie)
                    const connectedSessions = data.sessions.filter((s: any) => s.status === 'CONNECTED');
                    console.log("[WhatsApp Simulator] Bridge check - Connected sessions:", connectedSessions.length);

                    if (connectedSessions.length > 0) {
                        // On cherche en priorité la plateforme smbi pour le master
                        const masterNode = connectedSessions.find((s: any) => s.platform === 'smbi') || connectedSessions[0];

                        // Le client est la session qui n'est pas le master
                        const clientNode = connectedSessions.find((s: any) => s.userId !== masterNode.userId);

                        if (masterNode) {
                            setConnectedSession({
                                name: masterNode.pushName || (masterNode.userId === 'admin' ? 'Master SIM' : `SIM ${masterNode.userId.slice(-4)}`),
                                jid: masterNode.jid?.split(':')[0]?.split('@')[0] || "",
                                fullJid: masterNode.jid || "",
                                bridgeUserId: masterNode.userId
                            });
                        }

                        if (clientNode && clientNode.jid) {
                            console.log("[WhatsApp Simulator] Setting target client (Yohan):", clientNode.userId);
                            setTargetClient({
                                name: clientNode.pushName || `Client ${clientNode.jid?.split(':')[0]?.slice(-4) || ''}`,
                                jid: clientNode.jid.split(':')[0].split('@')[0],
                                bridgeUserId: clientNode.userId
                            });
                        } else {
                            if (connectedSessions.length > 1) {
                                console.warn("[WhatsApp Simulator] Found client node but JID is missing:", clientNode);
                            } else {
                                console.warn("[WhatsApp Simulator] Only one session connected. Need 2 for real link.");
                            }
                            setTargetClient(null);
                        }

                        if (!isProduction) setStatus('CONNECTED');
                    } else {
                        console.warn("[WhatsApp Simulator] No sessions connected.");
                        setConnectedSession(null);
                        setTargetClient(null);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch sessions for simulator:", error);
            }
        };

        fetchSessions();
        const interval = setInterval(fetchSessions, 5000); // Poll more frequently initially to get sessions
        return () => clearInterval(interval);
    }, [isProduction]);

    // Désactiver le lien réel si on perd le client cible
    useEffect(() => {
        if (isLinkedToPhone && !targetClient) {
            console.log("[WhatsApp Simulator] Client lost, disabling real link.");
            setIsLinkedToPhone(false);
        }
    }, [targetClient, isLinkedToPhone]);

    // Sync isTyping with parent
    useEffect(() => {
        if (onProcessingChange) {
            onProcessingChange(isTyping);
        }
    }, [isTyping, onProcessingChange]);

    // Load messages from localStorage on mount
    useEffect(() => {
        if (!userId) return;
        const savedMessages = localStorage.getItem(`whatsapp_messages_${userId}`);
        if (savedMessages) {
            try {
                setMessages(JSON.parse(savedMessages));
            } catch (e) {
                console.error("Failed to parse saved messages", e);
            }
        }
        isLoaded.current = true;
    }, [userId]);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        if (!isLoaded.current || !userId) return;
        localStorage.setItem(`whatsapp_messages_${userId}`, JSON.stringify(messages));
    }, [messages, userId]);

    // Initial status check
    useEffect(() => {
        if (!isProduction) {
            setStatus('CONNECTED');
            return;
        }

        const checkStatus = async () => {
            try {
                const res = await fetch(`/api/whatsapp?userId=${userId}`);
                const data = await res.json();
                if (data.success) {
                    setStatus(data.status);
                    if (data.qr) setQrCode(data.qr);
                    if (data.status === 'CONNECTED' && onConnect) onConnect();
                }
            } catch (err) {
                console.error("Status check failed:", err);
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 2000); // Poll faster for QR updates
        return () => clearInterval(interval);
    }, [isProduction, userId, onConnect]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const newMessage: Message = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sending'
        };

        setMessages(prev => [...prev, newMessage]);
        const userInput = inputValue;
        setInputValue("");

        // Real Transmission if it's production or if the user explicitly linked it
        // Le simulateur simule le CLIENT (Yohan) qui envoie au MASTER (Service)
        // On vérifie strictement que targetClient a les infos nécessaires
        const hasValidTarget = targetClient && targetClient.bridgeUserId && targetClient.jid;
        const shouldSendReal = (isProduction || isLinkedToPhone) && status === 'CONNECTED' && connectedSession && hasValidTarget;

        if (shouldSendReal && targetClient) {
            try {
                // Le MASTER (Service) envoie au CLIENT (Yohan)
                console.log(`[WhatsApp Simulator] MANUAL SEND: MASTER ${connectedSession.name} (${connectedSession.jid}) → CLIENT ${targetClient.name} (${targetClient.jid})`);
                const response = await fetch('/api/whatsapp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: connectedSession.bridgeUserId, // Envoie DEPUIS le master (Service)
                        recipient: `${targetClient.jid}@s.whatsapp.net`, // VERS le client (Yohan)
                        message: userInput
                    })
                });

                const data = await response.json();
                console.log(`[WhatsApp Simulator] Send Response:`, data);

                if (data.success) {
                    setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: 'sent' } : m));
                } else {
                    console.error("[WhatsApp Simulator] API Error:", data);
                }
            } catch (error) {
                console.error("[WhatsApp Simulator] Network Error:", error);
            }
        } else if (isLinkedToPhone && (!targetClient || !targetClient.bridgeUserId)) {
            console.warn("[WhatsApp Simulator] Lien réel activé mais client cible incomplet ou manquant !", targetClient);
        }

        // If not strictly production, also run the AI/Automation simulation to show it in the UI
        if (!isProduction) {
            // Use OpenAI for intelligent responses
            setIsTyping(true);

            try {
                // Build conversation history (last 10 messages for context)
                const conversationHistory = messages
                    .slice(-10)
                    .map(m => ({ sender: m.sender, text: m.text }));

                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: userInput,
                        template,
                        conversationHistory,
                        nodes // Sending nodes structure to make AI aware of every block
                    })
                });

                const data = await response.json();

                // Propagate execution results to parent for visual feedback
                if (onExecutionResult && data.executedNodes) {
                    onExecutionResult({
                        success: data.success,
                        executedNodes: data.executedNodes,
                        logs: data.logs || []
                    });
                }

                // Only add bot response if it's not empty (technical warnings are empty and logged elsewhere)
                if (data.success && data.response) {
                    const isImage = data.response.startsWith('🖼️');
                    let cleanText = data.response;
                    let imageUrl = undefined;

                    if (isImage) {
                        const parts = data.response.split('\n');
                        imageUrl = (parts[1] || "").trim(); // The second line is the URL
                        cleanText = parts[0]; // The first line is the emoji/text
                    }

                    const botResponse: Message = {
                        id: Date.now() + 1,
                        text: cleanText,
                        imageUrl: imageUrl,
                        sender: 'bot',
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    };
                    setMessages(prev => [...prev, botResponse]);

                    // Si le lien réel est activé, envoyer aussi la réponse de l'IA au master
                    // La réponse part du CLIENT (Yohan) vers le MASTER (Service)
                    if (isLinkedToPhone && targetClient && connectedSession) {
                        try {
                            if (!targetClient.bridgeUserId) {
                                console.error("[WhatsApp Simulator] AI Response: targetClient.bridgeUserId is missing");
                                return;
                            }

                            // La réponse part du CLIENT (Yohan) vers le MASTER (Service)
                            console.log(`[WhatsApp Simulator] AI RESPONSE: CLIENT ${targetClient.name} (${targetClient.jid}) → MASTER ${connectedSession.name} (${connectedSession.jid})`);
                            const aiResponse = await fetch('/api/whatsapp', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    userId: targetClient.bridgeUserId, // Envoie DEPUIS le client (Yohan)
                                    recipient: `${connectedSession.jid}@s.whatsapp.net`, // VERS le master (Service)
                                    message: cleanText
                                })
                            });

                            const aiData = await aiResponse.json();
                            console.log(`[WhatsApp Simulator] AI Send Response:`, aiData);

                            if (!aiData.success) {
                                console.error("[WhatsApp Simulator] AI API Error:", aiData);
                            }
                        } catch (aiError) {
                            console.error("[WhatsApp Simulator] AI Network Error:", aiError);
                        }
                    }
                } else if (!data.success) {
                    const botResponse: Message = {
                        id: Date.now() + 1,
                        text: "Désolé, une erreur s'est produite.",
                        sender: 'bot',
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    };
                    setMessages(prev => [...prev, botResponse]);
                }
            } catch (error) {
                console.error("AI response failed:", error);
                const errorMessage: Message = {
                    id: Date.now() + 1,
                    text: "Désolé, je ne suis pas disponible pour le moment.",
                    sender: 'bot',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };
                setMessages(prev => [...prev, errorMessage]);
            } finally {
                setIsTyping(false);
            }
        }
    };

    return (
        <div className="relative mx-auto" style={{ width: '300px' }}>
            {/* iPhone Frame */}
            <div className="relative">
                {/* Side Buttons */}
                <div className="absolute -left-[2px] top-[80px] w-[3px] h-[25px] bg-[#a8a8a8] rounded-l-sm" />
                <div className="absolute -left-[2px] top-[115px] w-[3px] h-[45px] bg-[#a8a8a8] rounded-l-sm" />
                <div className="absolute -left-[2px] top-[165px] w-[3px] h-[45px] bg-[#a8a8a8] rounded-l-sm" />
                <div className="absolute -right-[2px] top-[120px] w-[3px] h-[60px] bg-[#a8a8a8] rounded-r-sm" />

                <div
                    className="relative rounded-[42px] p-[10px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)]"
                    style={{ background: 'linear-gradient(145deg, #c0c0c0 0%, #a8a8a8 30%, #b8b8b8 50%, #909090 100%)' }}
                >
                    <div className={`relative ${isTelegram ? 'bg-[#0e212f]' : 'bg-[#111b21]'} rounded-[32px] overflow-hidden`} style={{ height: '560px' }}>
                        {/* Status Bar */}
                        <div className={`h-[44px] ${isTelegram ? 'bg-[#17212b]' : 'bg-[#202c33]'} flex items-end justify-between px-6 pb-1 text-[11px] text-white font-semibold`}>
                            <span>9:41</span>
                            <div className="flex items-center gap-1">
                                <div className="w-[22px] h-[10px] border border-white/40 rounded-[3px] relative p-[1px]">
                                    <div className="h-full bg-white rounded-[1px]" style={{ width: '80%' }} />
                                </div>
                            </div>
                        </div>

                        {/* Header */}
                        <header className={`${isTelegram ? 'bg-[#17212b] border-b border-white/5' : 'bg-[#202c33]'} px-3 py-2 flex items-center gap-3`}>
                            <div className={`w-8 h-8 rounded-full ${isTelegram ? 'bg-[#24a1de]' : 'bg-white'} flex items-center justify-center shrink-0 shadow-lg`}>
                                {isTelegram ? (
                                    <SendHorizontal className="w-4 h-4 text-white" />
                                ) : (
                                    <Share2 className="w-4 h-4 text-primary stroke-[2.5]" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-[#e9edef] text-[13px] font-black tracking-tighter uppercase truncate">
                                    {isLinkedToPhone && targetClient
                                        ? targetClient.name
                                        : (connectedSession ? connectedSession.name : (isProduction ? (isTelegram ? "TELEGRAM CONNECT" : "CONNECT PRO") : (isTelegram ? "TELEGRAM BOT ✨" : "CONNECT ✨")))}
                                </h3>
                                <div className="flex items-center gap-1.5">
                                    {connectedSession && (
                                        <div className="size-1 rounded-full bg-emerald-500 animate-pulse" />
                                    )}
                                    <span className={isTelegram ? "text-[#24a1de] text-[10px]" : (status === 'CONNECTED' ? "text-[#00a884] text-[10px]" : "text-orange-400 text-[10px]")}>
                                        {isLinkedToPhone && targetClient
                                            ? `ENVOI RÉEL → +${targetClient.jid}`
                                            : (connectedSession
                                                ? `+${connectedSession.jid}`
                                                : (isProduction
                                                    ? (status === 'CONNECTED' ? "Opérationnel" : "Déconnecté")
                                                    : (isTelegram ? "BOT EN TEST" : `Client: ${SIMULATED_USER_NUMBER}`)))
                                        }
                                    </span>
                                </div>
                            </div>

                            {/* Real Link Toggle */}
                            {!isProduction && status === 'CONNECTED' && connectedSession && (
                                <button
                                    onClick={() => setIsLinkedToPhone(!isLinkedToPhone)}
                                    disabled={!targetClient}
                                    className={`p-1.5 rounded-lg transition-all ${isLinkedToPhone ? 'bg-emerald-500/20 text-emerald-500' : 'bg-white/5 text-zinc-500'} ${!targetClient ? 'opacity-30 cursor-not-allowed' : ''}`}
                                    title={!targetClient ? "En attente d'une deuxième SIM (Client)..." : (isLinkedToPhone ? "Désactiver le lien réel" : "Relier à mon téléphone physique")}
                                >
                                    <ArrowLeft className={`w-4 h-4 transition-transform ${isLinkedToPhone ? 'rotate-180' : ''}`} />
                                </button>
                            )}
                        </header>

                        {/* Chat Area */}
                        <div className="flex-1 relative overflow-hidden h-[calc(560px-44px-48px-50px)]">
                            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `url("/whatsapp-bg.png")`, backgroundRepeat: 'repeat', backgroundSize: '300px' }} />

                            <div ref={scrollRef} className="absolute inset-0 overflow-y-auto px-2 py-2 custom-scrollbar">
                                <AnimatePresence>
                                    {messages.map((msg) => (
                                        <motion.div key={msg.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className={`flex mb-1 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] px-3 py-2 pb-1.5 shadow-sm ${msg.sender === 'user'
                                                ? (isTelegram ? 'bg-[#2b5278] rounded-2xl rounded-tr-sm' : 'bg-[#005c4b] rounded-lg rounded-tr-none')
                                                : (isTelegram ? 'bg-[#182533] rounded-2xl rounded-tl-sm' : 'bg-[#202c33] rounded-lg rounded-tl-none')
                                                }`}>
                                                {msg.imageUrl && (
                                                    <div className="mb-2 rounded-xl overflow-hidden">
                                                        <img src={msg.imageUrl} alt="Contenu" className="w-full h-auto object-cover max-h-48" />
                                                    </div>
                                                )}
                                                <p className="text-[#e9edef] text-[11.5px] leading-[15px]">{msg.text}</p>
                                                <div className="flex items-center justify-end gap-1 mt-1">
                                                    <span className="text-[8px] text-[#8696a0]/70">{msg.time}</span>
                                                    {msg.sender === 'user' && !isTelegram && <CheckCheck className="w-3 h-3 text-[#53bdeb]" />}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {/* Typing Indicator */}
                                    {isTyping && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex justify-start mb-1"
                                        >
                                            <div className={`${isTelegram ? 'bg-[#182533] rounded-2xl rounded-tl-sm' : 'bg-[#202c33] rounded-lg rounded-tl-none'} px-3 py-2`}>
                                                <div className="flex gap-1">
                                                    <span className={`w-1.5 h-1.5 ${isTelegram ? 'bg-[#24a1de]' : 'bg-[#8696a0]'} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }} />
                                                    <span className={`w-1.5 h-1.5 ${isTelegram ? 'bg-[#24a1de]' : 'bg-[#8696a0]'} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }} />
                                                    <span className={`w-1.5 h-1.5 ${isTelegram ? 'bg-[#24a1de]' : 'bg-[#8696a0]'} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* QR Code Overlay */}
                            {isProduction && status !== 'CONNECTED' && (
                                <div className="absolute inset-0 bg-[#0b141a]/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center">
                                    {qrCode ? (
                                        <div className="bg-white p-3 rounded-2xl mb-4 shadow-2xl">
                                            <QRCodeCanvas value={qrCode} size={180} />
                                        </div>
                                    ) : (
                                        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                                    )}
                                    <h4 className="text-white text-sm font-bold mb-2">Connectez votre WhatsApp</h4>
                                    <p className="text-white/60 text-[10px] leading-relaxed mb-4">
                                        Scannez ce code QR avec votre application WhatsApp (Réglages &gt; Appareils connectés)
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className={`absolute bottom-0 left-0 right-0 ${isTelegram ? 'bg-[#17212b]' : 'bg-[#202c33]'} px-2 py-2 flex items-center gap-2`}>
                            <div className={`flex-1 ${isTelegram ? 'bg-[#242f3d]' : 'bg-[#2a3942]'} rounded-full px-4 py-2 flex items-center`}>
                                <input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={isTelegram ? "Message..." : "Ecrivez un message..."}
                                    className="w-full bg-transparent text-[#e9edef] text-xs placeholder:text-[#8696a0] focus:outline-none"
                                    disabled={isProduction && status !== 'CONNECTED'}
                                />
                            </div>
                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim() || (isProduction && status !== 'CONNECTED')}
                                className={`p-2 rounded-full transition-transform active:scale-95 ${inputValue.trim() && (status === 'CONNECTED' || !isProduction) ? (isTelegram ? 'text-[#24a1de]' : 'bg-[#00a884] text-white') : 'text-[#8696a0]'}`}
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
