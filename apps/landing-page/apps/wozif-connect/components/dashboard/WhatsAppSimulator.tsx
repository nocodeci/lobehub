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
    Clock,
    Bot,
    User,
    SendHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { executeNode, ExecutionContext, Message as ExecutorMessage } from "../../utils/workflow-executor";

// Move Message interface if necessary or use the one from executor
// For now, let's keep the internal Message interface but ensure compatibility
interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    time: string;
    imageUrl?: string;
    buttons?: { text: string; action: string }[];
    status?: 'sending' | 'sent' | 'delivered' | 'read';
}

interface WhatsAppSimulatorProps {
    isProduction?: boolean;
    userId?: string;
    onConnect?: () => void;
    onProcessingChange?: (isProcessing: boolean) => void;
    onExecutionResult?: (result: ExecutionResult) => void;
    setIsFlowAnimate?: (isAnimate: boolean) => void;
    setExecutionSequence?: (sequence: any[]) => void;
    setActiveStep?: (step: number | null) => void;
    setNodeStatuses?: (statuses: Record<number, "success" | "error" | "warning" | "skipped" | "running">) => void;
    template?: 'support' | 'ecommerce' | 'appointment' | 'default';
    nodes?: any[];
    products?: any[];
    currency?: string;
    targetPhoneNumber?: string | null;
    onNodeResult?: (nodeId: number, result: string, data?: any) => void;
    onNodeExecutionData?: (nodeId: number, input: any, output: any, context: any) => void;
}

export interface NodeExecutionStatus {
    nodeId: number;
    nodeType: string;
    nodeName: string;
    status: 'success' | 'error' | 'skipped' | 'warning';
    message?: string;
    data?: any;
    duration?: number;
    waitDelay?: number;
    timestamp: string;
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
    setIsFlowAnimate,
    setExecutionSequence,
    setActiveStep,
    setNodeStatuses,
    template = 'default',
    nodes = [],
    products = [],
    currency = "FCFA",
    targetPhoneNumber = null,
    onNodeResult,
    onNodeExecutionData
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
    const SIMULATED_USER_NUMBER = "2250703324674";
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

    const connectedSessionRef = useRef(connectedSession);
    const targetClientRef = useRef(targetClient);
    const statusRef = useRef(status);
    const isLinkedToPhoneRef = useRef(isLinkedToPhone);
    const isProductionRef = useRef(isProduction);
    const targetPhoneNumberRef = useRef<string | null>(targetPhoneNumber);

    useEffect(() => {
        connectedSessionRef.current = connectedSession;
    }, [connectedSession]);

    useEffect(() => {
        targetClientRef.current = targetClient;
    }, [targetClient]);

    useEffect(() => {
        statusRef.current = status;
    }, [status]);

    useEffect(() => {
        isLinkedToPhoneRef.current = isLinkedToPhone;
    }, [isLinkedToPhone]);

    useEffect(() => {
        isProductionRef.current = isProduction;
    }, [isProduction]);

    useEffect(() => {
        targetPhoneNumberRef.current = targetPhoneNumber;
    }, [targetPhoneNumber]);

    const digitsOnly = (value: string) => value.replace(/[^0-9]/g, "");

    // Côte d'Ivoire numbers are often displayed with an extra leading 0 after the country code
    // (+225 05xxxxxxxx), while WhatsApp JIDs can omit that 0 (2255xxxxxxxx).
    const ciVariants = (digits: string) => {
        const d = digitsOnly(digits);
        const variants = new Set<string>();
        if (!d) return [] as string[];

        variants.add(d);

        if (d.startsWith('2250')) {
            variants.add(`225${d.slice(4)}`);
        } else if (d.startsWith('225')) {
            variants.add(`2250${d.slice(3)}`);
        } else if (d.length === 10 && d.startsWith('0')) {
            // local -> E164 with CI prefix
            variants.add(`225${d}`);
            variants.add(`225${d.slice(1)}`);
        }

        return Array.from(variants);
    };

    const toBridgeRecipientDigits = (input: string) => {
        const d = digitsOnly(input);
        if (d.startsWith('2250')) return `225${d.slice(4)}`;
        return d;
    };

    const forwardBotMessageToRealClient = async (text: string) => {
        const cs = connectedSessionRef.current;
        const tc = targetClientRef.current;
        const st = statusRef.current;

        // IMPORTANT: Always prefer targetClient.jid (the real client session) over targetPhoneNumber.
        // targetPhoneNumber may incorrectly point to the automation's WhatsApp, not the real client.
        const recipientJid = tc?.jid ? digitsOnly(tc.jid) : "";

        console.log("[WhatsApp Simulator] Bot forwarding to client:", {
            master: cs?.jid,
            masterUserId: cs?.bridgeUserId,
            client: recipientJid,
            clientUserId: tc?.bridgeUserId,
        });

        // On envoie en réel uniquement si le lien réel est activé (ou prod) ET qu'on a une session master + un client cible.
        const shouldSendReal = (isProductionRef.current || isLinkedToPhoneRef.current)
            && st === 'CONNECTED'
            && !!cs?.bridgeUserId
            && !!recipientJid;

        if (!shouldSendReal || !cs) return;

        try {
            await fetch('/api/whatsapp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: cs.bridgeUserId,
                    recipient: `${recipientJid}@s.whatsapp.net`,
                    message: text
                })
            });
        } catch (error) {
            console.error('[WhatsApp Simulator] Failed to forward bot message to real client:', error);
        }
    };

    // Fetch real sessions from bridge
    useEffect(() => {
        const fetchSessions = async () => {
            // Créer un AbortController pour gérer le timeout manuellement
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 secondes de timeout

            try {
                const response = await fetch('http://localhost:8080/api/sessions', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (data.success) {
                    // Trouver le master (la SIM qui envoie)
                    const connectedSessions = data.sessions.filter((s: any) => s.status === 'CONNECTED');
                    console.log("[WhatsApp Simulator] Bridge check - Connected sessions:", connectedSessions.length);

                    if (connectedSessions.length > 0) {
                        const isNumericUserId = (id: any) => /^\d+$/.test(String(id || ""));
                        const isSimSession = (s: any) =>
                            s?.platform === 'smbi' || s?.userId === 'admin' || isNumericUserId(s?.userId);

                        // targetPhoneNumber is treated as the preferred CLIENT number when provided.
                        const desiredClientDigits = targetPhoneNumberRef.current
                            ? digitsOnly(targetPhoneNumberRef.current)
                            : "";
                        const desiredVariants = desiredClientDigits ? ciVariants(desiredClientDigits) : [];

                        const findSessionByJid = (desiredList: string[]) => {
                            if (!desiredList.length) return null;
                            return (
                                connectedSessions.find((s: any) => {
                                    const jidDigits = digitsOnly(
                                        String(s?.jid || "").split(':')[0].split('@')[0],
                                    );
                                    return desiredList.includes(jidDigits);
                                }) || null
                            );
                        };

                        const explicitClientNode = findSessionByJid(desiredVariants);

                        // Roles Inversion according to user request:
                        // Admin Dashboard nodes = Simulator User (Person talking to bot)
                        // Builder/Client Dashboard nodes = Bot (Responder)

                        // 1. Identify the BOT (The node connected in the builder matching targetPhoneNumberRef)
                        const botNode = explicitClientNode || connectedSessions.find((s: any) => !isSimSession(s)) || connectedSessions[0];

                        // 2. Identify the PERSON (The node connected in Admin dashboard / SIM)
                        const personNode = connectedSessions.find((s: any) => isSimSession(s) && s.userId !== botNode?.userId) ||
                            connectedSessions.find((s: any) => s.userId !== botNode?.userId) ||
                            connectedSessions[0];

                        if (botNode) {
                            console.log(
                                "[WhatsApp Simulator] Bot Node (Responder):",
                                botNode.userId,
                                botNode.jid ? `(+${digitsOnly(String(botNode.jid).split(':')[0].split('@')[0])})` : ""
                            );
                            setConnectedSession({
                                name: botNode.pushName || (botNode.userId === 'admin' ? 'Master SIM' : `BOT-${botNode.userId.slice(-4)}`),
                                jid: botNode.jid?.split(':')[0]?.split('@')[0] || "",
                                fullJid: botNode.jid || "",
                                bridgeUserId: botNode.userId
                            });
                        }

                        if (personNode) {
                            const personDigits = digitsOnly(
                                String(personNode.jid || "").split(':')[0].split('@')[0],
                            );
                            console.log(
                                "[WhatsApp Simulator] Person Node (Simulator):",
                                personNode.userId,
                                personDigits ? `(+${personDigits})` : ""
                            );
                            setTargetClient({
                                name: personNode.pushName || `Client ${personNode.jid?.split(':')[0]?.slice(-4) || ''}`,
                                jid: personNode.jid?.split(':')[0]?.split('@')[0] || personNode.userId,
                                bridgeUserId: personNode.userId
                            });
                        } else {
                            if (connectedSessions.length > 1) {
                                console.warn("[WhatsApp Simulator] No suitable person node found.");
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
            } catch (error: any) {
                clearTimeout(timeoutId);
                // Ignorer silencieusement les erreurs de connexion si le serveur n'est pas disponible
                // Cela permet au simulateur de fonctionner même sans le serveur WhatsApp
                if (error.name === 'AbortError' || error.name === 'TypeError' || error.message?.includes('Failed to fetch') || error.message?.includes('network')) {
                    // Le serveur WhatsApp n'est pas disponible, on désactive les fonctionnalités réelles
                    setConnectedSession(null);
                    setTargetClient(null);
                    // Ne pas logger l'erreur en production pour éviter le spam dans la console
                    if (process.env.NODE_ENV === 'development') {
                        console.warn("WhatsApp server not available, simulator running in offline mode");
                    }
                } else {
                    console.error("Failed to fetch sessions for simulator:", error);
                }
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

    // Helper logic to execute the whole workflow
    const executeWorkflow = async (userMsg: string) => {
        setIsTyping(true);
        const executedNodes: NodeExecutionStatus[] = [];
        const logs: string[] = [];

        // Find trigger nodes or starting node
        // Priority: Current active trigger if we had one, otherwise find any trigger node
        let currentNode = nodes.find(n => n.type === 'whatsapp_message' || n.type === 'keyword' || n.type === 'telegram_message' || n.type === 'webhook_trigger');
        if (!currentNode && nodes.length > 0) currentNode = nodes[0];

        // Extraire la dernière image et audio des messages pour le contexte
        const lastUserMessageObj = messages.filter(m => m.sender === 'user').slice(-1)[0];
        const lastImageUrl = lastUserMessageObj?.imageUrl || messages.filter(m => m.sender === 'user' && m.imageUrl).slice(-1)[0]?.imageUrl;
        const lastAudioUrl = messages.filter(m => m.sender === 'user' && m.text?.includes('audio:')).slice(-1)[0]?.text?.match(/audio:(.+)/)?.[1];

        const context: ExecutionContext = {
            lastUserMessage: userMsg,
            lastImageUrl, // Image reçue via WhatsApp/Telegram
            lastAudioUrl, // Audio reçu via WhatsApp/Telegram
            products,
            currency,
            userPhone: targetClient?.jid || '22500000000',
            userId: targetClient?.bridgeUserId || 'guest',
            userName: targetClient?.name || 'Client',
            cart: [], // Panier d'achat (sera mis à jour par les nœuds add_to_cart)
            // Ajouter l'historique des messages pour les agents IA
            messages: messages.map((msg: Message) => ({
                sender: msg.sender,
                text: msg.text || '',
                content: msg.text || '',
                imageUrl: msg.imageUrl // Inclure les images dans l'historique
            })),
            addMessage: (newMsg: Omit<ExecutorMessage, "id" | "time">) => {
                const resolvedText = (newMsg as any)?.text;

                setMessages(prev => [...prev, {
                    ...newMsg,
                    id: Date.now() + Math.random(),
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                } as Message]);

                // Si on est en mode réel, on forward aussi les messages BOT (réponses automation)
                if (newMsg.sender === 'bot' && typeof resolvedText === 'string' && resolvedText.trim()) {
                    void forwardBotMessageToRealClient(resolvedText);
                }
            }
        };

        // 🔥 Déclencher l'animation AVANT l'exécution
        if (setIsFlowAnimate) setIsFlowAnimate(true);

        const nodeStatusMap: Record<number, "success" | "error" | "warning" | "skipped" | "running"> = {};
        const loopCounters = new Map<number, number>();

        const isPlainObject = (v: any) => {
            return v !== null && typeof v === 'object' && !Array.isArray(v);
        };

        const deepMergeInPlace = (target: any, source: any) => {
            if (!isPlainObject(source) || !isPlainObject(target)) return;
            for (const [key, value] of Object.entries(source)) {
                if (isPlainObject(value)) {
                    if (!isPlainObject((target as any)[key])) (target as any)[key] = {};
                    deepMergeInPlace((target as any)[key], value);
                } else {
                    (target as any)[key] = value;
                }
            }
        };

        let nodeIndex = 0;
        while (currentNode) {
            const startTime = Date.now();

            // Find the visual index of current node in the nodes array
            const visualNodeIndex = nodes.findIndex(n => n.id === currentNode!.id);

            // 🔥 STEP 1: Set node as RUNNING (blue pulsing) BEFORE execution
            console.log(`🔄 [${nodeIndex}] Running: ${currentNode.name}`);
            if (setActiveStep) setActiveStep(visualNodeIndex);
            nodeStatusMap[currentNode.id] = "running";
            if (setNodeStatuses) setNodeStatuses({ ...nodeStatusMap });

            // Safely capture input context for debugging (without functions/circular refs)
            let inputContext = {};
            try {
                inputContext = JSON.parse(JSON.stringify(context, (key, value) =>
                    typeof value === 'function' ? undefined : value
                ));
            } catch (e) {
                console.warn("[Simulator] Could not stringify context", e);
            }

            // Execute the node
            const result = await executeNode(currentNode, context);
            const duration = Date.now() - startTime;

            // Store node output data in context for next nodes to access (automatic mode A)
            if (result.data && typeof result.data === 'object') {
                deepMergeInPlace(context, result.data);
            }

            // Safely capture output context
            let outputContext = {};
            try {
                outputContext = JSON.parse(JSON.stringify(context, (key, value) =>
                    typeof value === 'function' ? undefined : value
                ));
            } catch (e) { }

            // Notify about node execution data for inspection
            if (onNodeExecutionData) {
                onNodeExecutionData(
                    currentNode.id,
                    inputContext,
                    result.data || {},
                    outputContext
                );
            }

            // 🔥 STEP 2: Update to final status (success/error) AFTER execution
            console.log(`✓ [${nodeIndex}] Completed: ${currentNode.name} -> ${result.success ? 'success' : 'error'}`);
            nodeStatusMap[currentNode.id] = result.success ? 'success' : 'error';
            if (setNodeStatuses) setNodeStatuses({ ...nodeStatusMap });
            if (onNodeResult && result.message) onNodeResult(currentNode.id, result.message, result.data);

            const nodeStatus: NodeExecutionStatus = {
                nodeId: currentNode.id,
                nodeType: currentNode.type,
                nodeName: currentNode.name,
                status: result.success ? 'success' : 'error',
                message: result.message,
                data: result.data,
                duration,
                waitDelay: result.waitDelay || 600,
                timestamp: new Date().toISOString()
            };

            executedNodes.push(nodeStatus);
            const statusEmoji = result.success ? '✅' : '❌';
            logs.push(`${statusEmoji} [${currentNode.name}] ${result.message || (result.success ? 'Succès' : 'Erreur')}`);

            // Update execution sequence for logs
            if (setExecutionSequence) {
                setExecutionSequence([...executedNodes]);
            }

            // Brief pause to show status change
            await new Promise(resolve => setTimeout(resolve, 300));

            // Decide where to go next
            // IMPORTANT: -1 means "not connected", treat it as undefined
            let nextNodeId: number | undefined = (currentNode.connectedTo !== undefined && currentNode.connectedTo !== -1) ? currentNode.connectedTo : undefined;

            // Debug: log connection info
            console.log(`[Simulator] Node ${currentNode.id} (${currentNode.type}) connectedTo:`, currentNode.connectedTo, '-> nextNodeId:', nextNodeId);

            if (currentNode.type === 'condition' || currentNode.type === 'random_choice' || currentNode.type === 'loop' || currentNode.type === 'switch_router') {
                if (currentNode.type === 'switch_router') {
                    const matchedIdx = result.data?.matchedIndex;
                    if (matchedIdx !== undefined && matchedIdx !== -1) {
                        nextNodeId = currentNode.conditionalConnections?.[`case_${matchedIdx}`];
                    } else {
                        nextNodeId = currentNode.conditionalConnections?.default;
                    }
                } else if (currentNode.type === 'loop') {
                    const loopId = currentNode.id;
                    const currentCount = loopCounters.get(loopId) || 0;
                    const maxCount = result.data?.loopCount || 3;

                    if (currentCount < maxCount) {
                        nextNodeId = currentNode.connectedToTrue || currentNode.conditionalConnections?.true;
                        loopCounters.set(loopId, currentCount + 1);
                        logs.push(`[${currentNode.name}] Itération ${currentCount + 1}/${maxCount}`);
                    } else {
                        nextNodeId = currentNode.connectedToFalse || currentNode.conditionalConnections?.false;
                        loopCounters.delete(loopId);
                        logs.push(`[${currentNode.name}] Boucle terminée`);
                    }
                } else {
                    const passed = result.data?.conditionPassed || (currentNode.type === 'random_choice' && result.data?.selectedIndex === 0);
                    if (passed) {
                        nextNodeId = currentNode.conditionalConnections?.true || currentNode.connectedToTrue;
                    } else {
                        nextNodeId = currentNode.conditionalConnections?.false || currentNode.connectedToFalse;
                    }
                }

                // If nextNodeId is -1 or undefined, fallback to general connectedTo
                if (nextNodeId === undefined || nextNodeId === -1) {
                    nextNodeId = (currentNode.connectedTo !== -1) ? currentNode.connectedTo : undefined;
                }
            }


            if (!result.success && currentNode.type === 'keyword') {
                logs.push(`[${currentNode.name}] Mot-clé non trouvé - Arrêt du workflow`);
                break;
            }

            // Determine the next node
            let nextNode = null;
            if (nextNodeId !== undefined && nextNodeId !== -1) {
                // Find node by ID, ensuring type-agnostic comparison
                nextNode = nodes.find(n => String(n.id) === String(nextNodeId));

                if (!nextNode) {
                    logs.push(`⚠️ Bloc suivant (ID: ${nextNodeId}) non trouvé sur le canevas.`);
                }
            }

            // FALLBACK: If no explicit connection, try to find the next node by X position (left to right flow)
            if (!nextNode && nodeIndex === 0) {
                const currentX = currentNode.x || 0;
                const nodesAfter = nodes.filter(n => n.id !== currentNode.id && (n.x || 0) > currentX);
                if (nodesAfter.length > 0) {
                    nodesAfter.sort((a, b) => (a.x || 0) - (b.x || 0));
                    nextNode = nodesAfter[0];
                    logs.push(`↪️ Connexion automatique vers [${nextNode.name}] (par position)`);
                    console.log(`[Simulator] Fallback: found next node by position:`, nextNode.id, nextNode.name);
                }
            }

            // 🔥 STEP 3: Animate wire to next node BEFORE moving to next
            if (nextNode) {
                console.log(`→ [${nodeIndex}] Wire animation to next node`);
                if (setActiveStep) setActiveStep(visualNodeIndex + 0.5);
                await new Promise(resolve => setTimeout(resolve, 500));
            } else if (currentNode.type === 'condition' || currentNode.type === 'random_choice') {
                // Determine if we stopped because a branch wasn't connected
                const passed = result.data?.conditionPassed || (currentNode.type === 'random_choice' && result.data?.selectedIndex === 0);
                logs.push(`[${currentNode.name}] Branche ${passed ? 'VRAI' : 'FAUX'} non connectée - Arrêt du flux`);
                break;
            }

            // Move to next node
            currentNode = nextNode || undefined;
            nodeIndex++;

            if (executedNodes.length > 20) {
                logs.push('[SYSTEM] Limite de 20 nodes atteinte - Arrêt de sécurité');
                break;
            }
        }

        if (onExecutionResult) {
            onExecutionResult({
                success: true,
                executedNodes,
                logs
            });
        }

        setIsTyping(false);

        // 🔥 Animation terminée - reset activeStep mais garder les statuts
        if (setActiveStep) setActiveStep(null);

        // Garder les statuts visibles quelques secondes
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Puis reset
        if (setNodeStatuses) setNodeStatuses({});
        if (setIsFlowAnimate) setIsFlowAnimate(false);
    };

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
                // Le simulateur simule le CLIENT qui écrit au MASTER (entrant réel)
                console.log(`[WhatsApp Simulator] MANUAL SEND: CLIENT ${targetClient.name} (${targetClient.jid}) → MASTER ${connectedSession.name} (${connectedSession.jid})`);
                const response = await fetch('/api/whatsapp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: targetClient.bridgeUserId, // Envoie DEPUIS le client
                        recipient: `${connectedSession.jid}@s.whatsapp.net`, // VERS le master
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
            if (nodes && nodes.length > 0) {
                // Use the new local workflow executor
                await executeWorkflow(userInput);
            } else {
                // Fallback to legacy AI assistant if no nodes
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
                            conversationHistory
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

                        // Si le lien réel est activé, forward la réponse IA vers le client cible (même logique que les nodes)
                        if (isLinkedToPhone || isProduction) {
                            void forwardBotMessageToRealClient(cleanText);
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
        }
    };

    return (
        <div className="relative mx-auto w-full max-w-[280px] scale-95 origin-top">
            {/* iPhone Frame */}
            <div className="relative">
                {/* Side Buttons */}
                <div className="absolute -left-[2px] top-[80px] w-[3px] h-[25px] bg-[#a8a8a8] rounded-l-sm" />
                <div className="absolute -left-[2px] top-[115px] w-[3px] h-[45px] bg-[#a8a8a8] rounded-l-sm" />
                <div className="absolute -left-[2px] top-[165px] w-[3px] h-[45px] bg-[#a8a8a8] rounded-l-sm" />
                <div className="absolute -right-[2px] top-[120px] w-[3px] h-[60px] bg-[#a8a8a8] rounded-r-sm" />

                <div
                    className="relative rounded-[42px] p-[8px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)]"
                    style={{ background: 'linear-gradient(145deg, #c0c0c0 0%, #a8a8a8 30%, #b8b8b8 50%, #909090 100%)' }}
                >
                    <div className={`relative ${isTelegram ? 'bg-[#0e212f]' : 'bg-[#111b21]'} rounded-[32px] overflow-hidden`} style={{ height: '520px' }}>
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
                                        ? `CONNECT ✨ ${targetClient.name || `Client: ${targetClient.jid || SIMULATED_USER_NUMBER}`}`
                                        : (connectedSession ? connectedSession.name : (isProduction ? (isTelegram ? "TELEGRAM CONNECT" : "CONNECT PRO") : (isTelegram ? "TELEGRAM BOT ✨" : `CONNECT ✨ Client: ${SIMULATED_USER_NUMBER}`)))}
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

                            {/* Real Link Toggle - Bouton pour basculer entre mode demo et envoi réel */}
                            {!isProduction && (
                                <button
                                    onClick={() => {
                                        if (targetClient && status === 'CONNECTED' && connectedSession) {
                                            setIsLinkedToPhone(!isLinkedToPhone);
                                        }
                                    }}
                                    disabled={!targetClient || status !== 'CONNECTED' || !connectedSession}
                                    className={`relative w-11 h-6 rounded-full transition-colors flex items-center shrink-0 ${isLinkedToPhone && targetClient && status === 'CONNECTED' && connectedSession ? 'bg-[#00a884]' : 'bg-[#8696a0]'
                                        } ${(!targetClient || status !== 'CONNECTED' || !connectedSession) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}`}
                                    title={
                                        !connectedSession || status !== 'CONNECTED'
                                            ? "En attente de connexion WhatsApp..."
                                            : !targetClient
                                                ? "En attente d'une deuxième SIM (Client) pour activer l'envoi réel..."
                                                : isLinkedToPhone
                                                    ? 'Mode envoi réel activé - Cliquez pour passer en mode demo'
                                                    : 'Mode demo - Cliquez pour activer l\'envoi réel'
                                    }
                                >
                                    <span
                                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${isLinkedToPhone && targetClient && status === 'CONNECTED' && connectedSession ? 'left-6' : 'left-1'
                                            }`}
                                    />
                                </button>
                            )}
                        </header>

                        {/* Chat Area */}
                        <div className="flex-1 relative overflow-hidden h-[calc(520px-44px-48px-50px)]">
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
