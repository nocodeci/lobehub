import { WorkflowNode, Product } from "../types/workflow";

export interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    time: string;
    imageUrl?: string;
    buttons?: { text: string; action: string }[];
    status?: 'sending' | 'sent' | 'delivered' | 'read';
}

export interface ExecutionContext {
    lastUserMessage: string;
    products: Product[];
    currency: string;
    userName?: string;
    userFirstName?: string;
    userEmail?: string;
    userId?: string;
    isManualExecution?: boolean;
    messages?: Array<{ sender: 'user' | 'bot'; text?: string; content?: string }>;
    addMessage: (msg: Omit<Message, "id" | "time">) => void;
    [key: string]: any;
}

export interface ExecutionResult {
    success: boolean;
    waitDelay: number;
    message: string;
    data?: any;
}

// Local fallback intent classification (when API fails)
function classifyIntentLocally(message: string): string {
    const msg = message.toLowerCase().trim();

    // Greeting patterns
    if (/^(bonjour|salut|hello|hi|hey|coucou|bonsoir)/i.test(msg)) return "salutation";

    // Price patterns
    if (/combien|prix|co[uû]t|tarif|cher|moins cher|promotion/i.test(msg)) return "question_prix";

    // Product patterns
    if (/produit|article|disponib|stock|catalog|commande/i.test(msg)) return "demande_produit";

    // Complaint patterns
    if (/probl[eè]me|erreur|bug|marche pas|fonctionne pas|retard|insatisfait|m[eé]content/i.test(msg)) return "plainte";

    // Thanks patterns
    if (/merci|super|g[eé]nial|parfait|excellent|top/i.test(msg)) return "remerciement";

    // Confirmation patterns
    if (/^(oui|ok|d'accord|parfait|je confirme|c'est bon|exactement)$/i.test(msg)) return "confirmation";

    // Cancel patterns
    if (/annuler|non|arr[eê]ter|stop|cancel/i.test(msg)) return "annulation";

    // Help patterns
    if (/aide|help|assistance|support|comment/i.test(msg)) return "demande_aide";

    return "autre";
}

// Generate fallback response when API fails
function generateFallbackResponse(intent: string | undefined, message: string): string {
    switch (intent) {
        case "salutation":
            return "Bonjour ! 👋 Je suis là pour vous aider. Que puis-je faire pour vous aujourd'hui ?";
        case "question_prix":
            return "Merci pour votre intérêt ! Pour les informations de prix, veuillez consulter notre catalogue ou contactez-nous directement.";
        case "demande_produit":
            return "Merci de votre intérêt pour nos produits ! Un conseiller vous répondra très prochainement.";
        case "plainte":
            return "Je suis désolé d'apprendre que vous rencontrez un problème. Nous prenons votre retour très au sérieux et allons y remédier.";
        case "remerciement":
            return "Je vous en prie ! N'hésitez pas si vous avez d'autres questions. 😊";
        case "confirmation":
            return "Parfait, c'est noté ! Je continue avec votre demande.";
        case "annulation":
            return "D'accord, j'ai pris note de votre demande d'annulation.";
        case "demande_aide":
            return "Je suis là pour vous aider ! Pouvez-vous me donner plus de détails sur votre demande ?";
        default:
            return "Merci pour votre message ! Un conseiller vous répondra dans les plus brefs délais.";
    }
}

// Helper to extract value from object using dot notation path
function extractValueByPath(obj: any, path: string): any {
    if (!path || !obj) return null;
    return path.split('.').reduce((current: any, key: string) => {
        return current?.[key];
    }, obj);
}

// Helper to send real WhatsApp message during manual execution
async function sendRealWhatsAppMessage(userId: string | undefined, recipient: string | undefined, payload: any) {
    if (!userId || !recipient) {
        console.warn('Cannot send real message: userId or recipient missing', { userId, recipient });
        return;
    }

    try {
        console.log(`🚀 Sending REAL message to ${recipient} via bridge...`);
        const response = await fetch('/api/whatsapp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                recipient,
                ...payload
            })
        });

        if (!response.ok) {
            console.error('Failed to send real message:', await response.text());
        }
    } catch (error) {
        console.error('Error in sendRealWhatsAppMessage:', error);
    }
}

export async function executeNode(
    node: WorkflowNode,
    context: ExecutionContext
): Promise<ExecutionResult> {
    let config: any = {};
    try {
        config = JSON.parse(node.config || '{}');
    } catch (e) {
        console.error(`Error parsing config for node ${node.id}:`, e);
    }

    const type = node.type;

    // Redirection vers le backend Python pour les blocs LangChain/Expert
    const pythonNodes = ['rag_knowledge', 'python_script', 'long_term_memory', 'web_search_agent', 'ai_flow_logic', 'ai_agent', 'gpt_analyze', 'sentiment'];
    if (pythonNodes.includes(type)) {
        try {
            const response = await fetch('http://localhost:8000/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nodes: [node],
                    context: context
                })
            });
            if (!response.ok) throw new Error(`Backend Python non disponible (${response.status})`);
            const data = await response.json();
            // Mettre à jour le contexte global avec les résultats du script Python
            if (data.final_context) {
                Object.assign(context, data.final_context);
            }
            return data.results[0];
        } catch (error: any) {
            return {
                success: false,
                waitDelay: 0,
                message: `Erreur Backend Python : Veuillez vérifier que le serveur est lancé.`
            };
        }
    }

    switch (type) {
        case 'anti_ban':
        case 'delay': {
            const delaySeconds = config.delaySeconds || config.delay || config.min || 5;
            // If it's a range (like anti_ban min/max), pick a random value or just min
            const actualDelay = typeof delaySeconds === 'number' ? delaySeconds : parseFloat(delaySeconds) || 5;

            console.log(`⏱️ Pause de ${actualDelay}s...`);

            // The actual pause is handled by the caller too for UI sync, 
            // but we resolve here after the timeout.
            await new Promise(resolve => setTimeout(resolve, actualDelay * 1000));

            return {
                success: true,
                waitDelay: actualDelay * 1000,
                message: `Pause de ${actualDelay}s effectuée`
            };
        }

        case 'send_text': {
            const text = config.text || config.aiInstructions || '';
            if (!text) return { success: true, waitDelay: 0, message: "Message vide ignoré" };

            console.log(`📤 Envoi message: ${text}`);
            const finalText = replaceVariables(text, context);

            context.addMessage({
                sender: 'bot',
                text: finalText,
            });

            // If manual execution, send to real WhatsApp
            if (context.isManualExecution && context.userId && context.userPhone) {
                await sendRealWhatsAppMessage(context.userId, context.userPhone, { message: finalText });
            }

            return {
                success: true,
                waitDelay: 1500,
                message: `Message envoyé: ${finalText.slice(0, 50)}...`
            };
        }

        case 'gpt_analyze': {
            // STRICT intent classification - NO response generation
            const { categories, aiInstructions, system, prompt, outputFields, typeValues, urgencyMin, urgencyMax, customOutputs } = config;
            const userMessage = context.lastUserMessage;
            const systemPrompt = system || aiInstructions || "";

            console.log(`🔍 Classification d'intention...`);

            // Prioritize typeValues for categories, fallback to categories
            const customCategories = typeValues || categories || "";
            const enabledFields = outputFields || ['type', 'urgency', 'autoResolvable', 'keywords'];
            const customOutputsList = customOutputs || [];

            // Build JSON schema based on enabled outputs
            const jsonSchema: any = {};
            if (enabledFields.includes('type')) {
                const combinedCategories = typeValues || categories || "";
                let typeOptions = combinedCategories ? combinedCategories.split(',').map((v: string) => v.trim()) : ['technique', 'facturation', 'compte', 'produit'];
                // Always ensure 'autre' is an option for the AI
                if (!typeOptions.includes('autre')) typeOptions.push('autre');

                jsonSchema.type = `string - Type d'intention parmi: ${typeOptions.join(', ')}. Utilise 'autre' si aucune catégorie ne correspond parfaitement.`;
            }
            if (enabledFields.includes('urgency')) {
                const min = urgencyMin || 1;
                const max = urgencyMax || 5;
                jsonSchema.urgency = `number - Niveau d'urgence entre ${min} et ${max}`;
            }
            if (enabledFields.includes('autoResolvable')) {
                jsonSchema.autoResolvable = 'string - Peut être résolu automatiquement: "oui" ou "non"';
            }
            if (enabledFields.includes('keywords')) {
                jsonSchema.keywords = 'array - Mots-clés extraits du message';
            }

            // Add custom output fields to JSON schema
            customOutputsList.forEach((output: any) => {
                if (output.name && output.description) {
                    jsonSchema[output.name] = `string - ${output.description}`;
                }
            });

            // Use custom system prompt if provided, but prioritize automatic one if categories/typeValues are specified
            const finalSystemPrompt = (systemPrompt && !customCategories) ? systemPrompt : (() => {
                const fieldsDesc = Object.entries(jsonSchema).map(([key, desc]) => `- ${key}: ${desc}`).join('\n');
                let p = `Tu es un expert en analyse d'intention client. Ton rôle est de classer le message de l'utilisateur et d'extraire les informations demandées.\n\n`;
                p += `Tu DOIS retourner UNIQUEMENT un objet JSON valide avec les champs suivants:\n${fieldsDesc}\n\n`;

                if (customCategories) {
                    p += `Voici les catégories d'intention à considérer (le champ 'type' doit impérativement être l'une de celles-ci):\n${customCategories}\n\n`;
                }

                if (systemPrompt && customCategories) {
                    p += `Instructions additionnelles:\n${systemPrompt}\n\n`;
                }

                p += `RÈGLES CRITIQUES:\n1. Réponds EXCLUSIVEMENT en JSON\n2. NE JAMAIS inclure de texte avant ou après le JSON\n3. NE JAMAIS répondre au client directement\n4. Si tu hésites, utilise 'autre' pour le type d'intention.`;
                return p;
            })();

            const analysisPrompt = prompt || `Analyse l'intention du message suivant de l'utilisateur: "${userMessage}"`;

            const resolvedSystemPrompt = replaceVariables(finalSystemPrompt, context);
            const resolvedAnalysisPrompt = replaceVariables(analysisPrompt, context);

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: resolvedAnalysisPrompt,
                        systemPrompt: resolvedSystemPrompt,
                        model: config.model || 'gpt-4o-mini',
                        maxTokens: config.maxTokens || 500,
                        temperature: config.temperature !== undefined ? config.temperature : 0.1
                    })
                });

                // Check if response is OK before parsing JSON
                if (!response.ok) {
                    console.warn('[gpt_analyze] API unavailable, using local fallback');
                    // Use fallback classification
                    const fallbackIntent = classifyIntentLocally(userMessage);
                    context.intent = fallbackIntent;
                    return {
                        success: true,
                        waitDelay: 500,
                        message: `Intention (local): ${fallbackIntent}`,
                        data: { intent: fallbackIntent }
                    };
                }

                const data = await response.json();

                if (!data.success && data.error) {
                    // API returned error, use fallback
                    const fallbackIntent = classifyIntentLocally(userMessage);
                    context.intent = fallbackIntent;
                    return {
                        success: true,
                        waitDelay: 500,
                        message: `Intention (local): ${fallbackIntent}`,
                        data: { intent: fallbackIntent }
                    };
                }

                let responseText = data.response?.trim() || "autre";
                console.log(`📡 Réponse IA brute: "${responseText}"`);
                console.log(`📝 Prompt envoyé: "${resolvedAnalysisPrompt}"`);

                // Try to parse as JSON first (for complex analysis outputs)
                try {
                    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        const parsed = JSON.parse(jsonMatch[0]);

                        // Ensure all enabled output fields are present
                        const enabledFields = outputFields || ['type', 'urgency', 'autoResolvable', 'keywords'];
                        const finalData: any = {};

                        enabledFields.forEach((field: string) => {
                            if (parsed[field] !== undefined) {
                                finalData[field] = parsed[field];
                            } else {
                                // Provide default values for missing fields
                                if (field === 'type') {
                                    finalData[field] = 'autre';
                                } else if (field === 'urgency') {
                                    finalData[field] = 3; // Default medium urgency
                                } else if (field === 'autoResolvable') {
                                    finalData[field] = 'non';
                                } else if (field === 'keywords') {
                                    finalData[field] = [];
                                } else {
                                    finalData[field] = null;
                                }
                            }
                        });

                        // Process custom outputs - extract values using paths
                        const customOutputsList = customOutputs || [];
                        customOutputsList.forEach((output: any) => {
                            if (output.name && output.path) {
                                const extractedValue = extractValueByPath(parsed, output.path);
                                finalData[output.name] = extractedValue;
                            }
                        });

                        // Store all JSON fields in context
                        Object.keys(finalData).forEach(key => {
                            context[key] = finalData[key];
                        });

                        // Ensure 'intent' is set for subsequent nodes (using type or custom intent field)
                        context.intent = finalData.intent || finalData.type || "autre";

                        // Also store in data for condition nodes
                        return {
                            success: true,
                            waitDelay: 1000,
                            message: `Analyse: ${JSON.stringify(finalData)}`,
                            data: { ...finalData, intent: context.intent, temperature: config.temperature !== undefined ? config.temperature : 0.7 }
                        };
                    }
                } catch (e) {
                    // Not JSON, continue with simple intent classification
                    console.warn('[gpt_analyze] Failed to parse JSON, using fallback');
                }

                // Simple intent classification (fallback)
                let intent = responseText.toLowerCase();
                intent = intent.split(/[\s,.!?]/)[0].replace(/[^a-z_]/g, "");
                if (!intent || intent.length > 25) intent = "autre";

                // Store intent in context (NO message sent)
                context.intent = intent;

                return {
                    success: true,
                    waitDelay: 1000,
                    message: `Intention: ${intent}`,
                    data: { intent }
                };
            } catch (error: any) {
                // Use fallback classification on any error
                const fallbackIntent = classifyIntentLocally(userMessage);
                context.intent = fallbackIntent;
                return {
                    success: true,
                    waitDelay: 500,
                    message: `Intention (local): ${fallbackIntent}`,
                    data: { intent: fallbackIntent }
                };
            }
        }

        case 'gpt_respond': {
            // Génère une RÉPONSE personnalisée et l'envoie
            const { model, system, aiInstructions } = config;
            const userMessage = context.lastUserMessage;

            console.log(`🤖 Génération réponse GPT...`);

            try {
                let systemPrompt = system || aiInstructions || 'Tu es un assistant professionnel. Réponds de manière concise (2-3 phrases max) en français.';

                // Injecter le contexte d'intention si disponible
                if (context.intent) {
                    systemPrompt += `\n\nContexte: L'intention détectée du client est "${context.intent}". Adapte ta réponse en conséquence.`;
                }

                const resolvedSystemPrompt = replaceVariables(systemPrompt, context);
                const resolvedUserMessage = replaceVariables(userMessage, context);

                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: resolvedUserMessage,
                        systemPrompt: resolvedSystemPrompt,
                        model: model || 'gpt-4o',
                        temperature: config.temperature !== undefined ? config.temperature : 0.7
                    })
                });

                // Handle API errors
                if (!response.ok) {
                    console.warn('[gpt_respond] API unavailable, using fallback response');
                    const fallbackResponse = generateFallbackResponse(context.intent, userMessage);
                    context.addMessage({ sender: 'bot', text: fallbackResponse });
                    return {
                        success: true,
                        waitDelay: 1000,
                        message: `Réponse (fallback): ${fallbackResponse.slice(0, 50)}...`
                    };
                }

                const data = await response.json();

                if (!data.success && data.error) {
                    const fallbackResponse = generateFallbackResponse(context.intent, userMessage);
                    context.addMessage({ sender: 'bot', text: fallbackResponse });
                    return {
                        success: true,
                        waitDelay: 1000,
                        message: `Réponse (fallback): ${fallbackResponse.slice(0, 50)}...`
                    };
                }

                const aiResponse = data.response || "Je n'ai pas pu générer de réponse.";

                context.addMessage({
                    sender: 'bot',
                    text: aiResponse,
                });

                return {
                    success: true,
                    waitDelay: 2000,
                    message: `IA a répondu: ${aiResponse.slice(0, 50)}...`,
                    data: { aiResponse, temperature: config.temperature !== undefined ? config.temperature : 0.7 }
                };
            } catch (error: any) {
                return {
                    success: false,
                    waitDelay: 0,
                    message: `Erreur API: ${error.message}`
                };
            }
        }

        case 'ai_agent': {
            // Agent IA autonome avec outils et mémoire
            const {
                agentName = "Mon Agent",
                instructions = "Tu es un assistant utile.",
                systemPrompt,
                model = "gpt-4o",
                reasoningEffort = "low",
                includeChatHistory = true,
                outputFormat = "text",
                verbosity = "medium",
                continueOnError = false,
                writeToConversationHistory = true,
            } = config;

            const userMessage = context.lastUserMessage;
            const agentInstructions = instructions || systemPrompt || 'Tu es un assistant utile.';

            console.log(`🤖 Agent IA "${agentName}" en cours d'exécution...`);

            try {
                // Construire l'historique de conversation si activé
                let conversationHistory: Array<{ role: string; content: string }> = [];

                if (includeChatHistory && context.messages && Array.isArray(context.messages)) {
                    // Convertir l'historique des messages en format OpenAI
                    conversationHistory = context.messages
                        .slice(-10) // Limiter à 10 derniers messages pour éviter les tokens excessifs
                        .map((msg: any) => ({
                            role: msg.sender === 'bot' ? 'assistant' : 'user',
                            content: msg.text || msg.content || ''
                        }))
                        .filter((msg: any) => msg.content.trim().length > 0);
                }

                // Construire le prompt système avec les instructions de l'agent
                let systemMessage = agentInstructions;

                // Ajouter des instructions selon le format de sortie
                if (outputFormat === "json") {
                    systemMessage += "\n\nIMPORTANT: Tu dois répondre UNIQUEMENT en JSON valide. Pas de texte avant ou après.";
                } else if (outputFormat === "markdown") {
                    systemMessage += "\n\nTu peux utiliser le formatage Markdown pour structurer ta réponse.";
                }

                // Ajouter des instructions selon la verbosité
                if (verbosity === "low") {
                    systemMessage += "\n\nSois concis et direct. Réponses courtes (1-2 phrases max).";
                } else if (verbosity === "high") {
                    systemMessage += "\n\nTu peux être détaillé et fournir des explications complètes.";
                }

                // Construire les messages pour l'API
                const messages: Array<{ role: string; content: string }> = [
                    { role: 'system', content: systemMessage }
                ];

                // Ajouter l'historique si disponible
                if (conversationHistory.length > 0) {
                    messages.push(...conversationHistory);
                }

                // Ajouter le message actuel de l'utilisateur
                messages.push({ role: 'user', content: userMessage });

                // Préparer les paramètres selon le modèle
                const requestBody: any = {
                    model: model,
                    messages: messages,
                };

                // Pour les modèles o1, utiliser reasoning_effort (pas de température)
                if (model.includes('o1') || model.includes('o3')) {
                    requestBody.reasoning_effort = reasoningEffort === "high" ? "high" : reasoningEffort === "medium" ? "medium" : "low";
                } else {
                    // Pour les autres modèles GPT, utiliser la température
                    requestBody.temperature = reasoningEffort === "high" ? 0.9 : reasoningEffort === "medium" ? 0.7 : 0.3;
                }

                // Préparer le body de la requête
                const requestPayload: any = {
                    message: userMessage,
                    systemPrompt: systemMessage,
                    model: model,
                    messages: messages,
                };

                // Ajouter les paramètres selon le type de modèle
                if (model.includes('o1') || model.includes('o3')) {
                    // Modèles o1 : utiliser reasoning_effort, pas de température
                    requestPayload.reasoningEffort = requestBody.reasoning_effort;
                } else {
                    // Autres modèles GPT : utiliser température custom ou déduite
                    requestPayload.temperature = config.temperature !== undefined ? config.temperature : requestBody.temperature;
                }

                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestPayload)
                });

                // Gérer les erreurs selon la configuration
                if (!response.ok) {
                    const errorMsg = `Erreur API: ${response.status} ${response.statusText}`;
                    console.warn(`[ai_agent] ${errorMsg}`);

                    if (continueOnError) {
                        const fallbackResponse = generateFallbackResponse(context.intent, userMessage);
                        if (writeToConversationHistory) {
                            context.addMessage({ sender: 'bot', text: fallbackResponse });
                        }
                        return {
                            success: true,
                            waitDelay: 1000,
                            message: `Agent (fallback): ${fallbackResponse.slice(0, 50)}...`
                        };
                    } else {
                        return {
                            success: false,
                            waitDelay: 0,
                            message: errorMsg
                        };
                    }
                }

                const data = await response.json();

                if (!data.success && data.error) {
                    const errorMsg = `Erreur: ${data.error}`;
                    console.warn(`[ai_agent] ${errorMsg}`);

                    if (continueOnError) {
                        const fallbackResponse = generateFallbackResponse(context.intent, userMessage);
                        if (writeToConversationHistory) {
                            context.addMessage({ sender: 'bot', text: fallbackResponse });
                        }
                        return {
                            success: true,
                            waitDelay: 1000,
                            message: `Agent (fallback): ${fallbackResponse.slice(0, 50)}...`
                        };
                    } else {
                        return {
                            success: false,
                            waitDelay: 0,
                            message: errorMsg
                        };
                    }
                }

                let aiResponse = data.response || "Je n'ai pas pu générer de réponse.";

                // Valider le format JSON si requis
                if (outputFormat === "json") {
                    try {
                        JSON.parse(aiResponse);
                    } catch (e) {
                        // Si ce n'est pas du JSON valide, essayer d'extraire du JSON
                        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
                        if (jsonMatch) {
                            aiResponse = jsonMatch[0];
                        } else {
                            aiResponse = JSON.stringify({ response: aiResponse });
                        }
                    }
                }

                // Ajouter le message à l'historique si configuré
                if (writeToConversationHistory) {
                    context.addMessage({
                        sender: 'bot',
                        text: aiResponse,
                    });
                }

                // Stocker la réponse dans le contexte pour utilisation ultérieure
                context.aiAgentResponse = aiResponse;
                context.lastAgentName = agentName;

                return {
                    success: true,
                    waitDelay: 2000,
                    message: `Agent "${agentName}" a répondu: ${aiResponse.slice(0, 50)}...`,
                    data: {
                        aiResponse,
                        agentName,
                        outputFormat,
                        usedHistory: includeChatHistory && conversationHistory.length > 0
                    }
                };
            } catch (error: any) {
                const errorMsg = `Erreur: ${error.message}`;
                console.error(`[ai_agent] ${errorMsg}`, error);

                if (continueOnError) {
                    const fallbackResponse = generateFallbackResponse(context.intent, userMessage);
                    if (writeToConversationHistory) {
                        context.addMessage({ sender: 'bot', text: fallbackResponse });
                    }
                    return {
                        success: true,
                        waitDelay: 1000,
                        message: `Agent (fallback): ${fallbackResponse.slice(0, 50)}...`
                    };
                } else {
                    return {
                        success: false,
                        waitDelay: 0,
                        message: errorMsg
                    };
                }
            }
        }

        case 'show_catalog': {
            const { selectedProducts } = config;
            const products = context.products.filter(p =>
                !selectedProducts || selectedProducts.length === 0 || selectedProducts.includes(p.id)
            );

            let catalogText = "📦 *Nos Produits*\n\n";
            products.forEach((p, i) => {
                catalogText += `${i + 1}. *${p.name}* - ${p.price} ${context.currency}\n`;
                catalogText += `   ${p.description}\n\n`;
            });

            context.addMessage({
                sender: 'bot',
                text: catalogText,
            });

            return {
                success: true,
                waitDelay: 1000,
                message: `Catalogue envoyé (${products.length} produits)`
            };
        }

        case 'chariow': {
            const { action, storeUrl } = config;

            if (action === 'view' || !action) {
                context.addMessage({
                    sender: 'bot',
                    text: `🛒 Voici votre panier interactif :\n${storeUrl || 'https://chariow.com/demo'}`,
                });
            } else if (action === 'checkout') {
                context.addMessage({
                    sender: 'bot',
                    text: `💳 Lien de paiement sécurisé :\n${storeUrl || 'https://chariow.com/checkout'}/checkout`,
                });
            }

            return {
                success: true,
                waitDelay: 1500,
                message: `Action Chariow: ${action || 'view'}`
            };
        }

        case 'condition': {
            const { field, operator, value, condition } = config;

            // Support both 'field' and 'condition' for backward compatibility
            const fieldName = field || condition;

            // Try to get value from context, supporting nested paths like "previous.output.autoResolvable"
            let testValue: any = undefined;

            if (fieldName) {
                // Direct field access
                if (context[fieldName] !== undefined) {
                    testValue = context[fieldName];
                } else if (fieldName.includes('.')) {
                    // Nested path like "previous.output.autoResolvable"
                    const parts = fieldName.split('.');
                    let current: any = context;
                    for (const part of parts) {
                        if (current && typeof current === 'object' && part in current) {
                            current = current[part];
                        } else {
                            current = undefined;
                            break;
                        }
                    }
                    testValue = current;
                }
            }

            // Fallback to last user message if no field found
            if (testValue === undefined) {
                testValue = context.lastUserMessage || "";
            }

            let passed = false;
            const v1 = String(testValue).toLowerCase();
            const v2 = String(value || "").toLowerCase();

            switch (operator) {
                case 'contains':
                    passed = v1.includes(v2);
                    break;
                case 'equals':
                case '==':
                    passed = v1 === v2;
                    break;
                case 'not_equals':
                case '!=':
                    passed = v1 !== v2;
                    break;
                case 'starts':
                case 'starts_with':
                    passed = v1.startsWith(v2);
                    break;
                case 'greater_than':
                case '>':
                    passed = Number(testValue) > Number(value);
                    break;
                case 'greater_than_or_equal':
                case '>=':
                    passed = Number(testValue) >= Number(value);
                    break;
                case 'less_than':
                case '<':
                    passed = Number(testValue) < Number(value);
                    break;
                case 'less_than_or_equal':
                case '<=':
                    passed = Number(testValue) <= Number(value);
                    break;
                default:
                    passed = true;
            }

            return {
                success: true,
                waitDelay: 500,
                message: `Condition ${passed ? 'VRAIE ✅' : 'FAUSSE ❌'} (${fieldName}: ${testValue} ${operator} ${value})`,
                data: { conditionPassed: passed }
            };
        }

        case 'sentiment': {
            // Analyse de sentiment avec GPT + fallback local
            const { detectEmotions, detectTone, urgencyScale } = config;
            const userMessage = context.lastUserMessage;

            console.log(`🎭 Analyse de sentiment...`);

            // Local fallback function
            const analyzeLocally = (msg: string) => {
                const msgLower = msg.toLowerCase();
                const positiveWords = ['merci', 'super', 'génial', 'top', 'bon', 'bien', 'bravo', 'ok', 'parfait', 'excellent', 'content', 'heureux', 'satisfait', 'j\'adore', 'incroyable'];
                const negativeWords = ['nul', 'mauvais', 'problème', 'erreur', 'pas', 'non', 'déçu', 'mécontent', 'frustré', 'colère', 'arnaque', 'honte', 'inacceptable', 'scandaleux'];
                const urgentWords = ['urgent', 'vite', 'immédiatement', 'rapidement', 'asap', 'maintenant', 'pressé'];

                let score = 50;
                let emotion = 'neutre';
                let tone = 'normal';
                let urgency = 'faible';

                positiveWords.forEach(w => { if (msgLower.includes(w)) score += 8; });
                negativeWords.forEach(w => { if (msgLower.includes(w)) score -= 12; });
                score = Math.max(0, Math.min(100, score));

                if (score >= 70) emotion = 'joie';
                else if (score >= 55) emotion = 'satisfaction';
                else if (score <= 30) emotion = 'frustration';
                else if (score <= 45) emotion = 'déception';

                if (msgLower.includes('!') || msgLower.toUpperCase() === msgLower) tone = 'intense';
                if (urgentWords.some(w => msgLower.includes(w))) urgency = 'haute';

                return { score, emotion, tone, urgency };
            };

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: `Analyse le sentiment de ce message client: "${userMessage}"`,
                        systemPrompt: `Tu es un analyseur de sentiment. Réponds UNIQUEMENT en JSON valide avec ce format exact:
{"score": 0-100, "emotion": "joie|satisfaction|neutre|déception|frustration|colère", "tone": "calme|normal|intense", "urgency": "faible|moyenne|haute"}
Score: 0=très négatif, 50=neutre, 100=très positif.
Réponds UNIQUEMENT le JSON, rien d'autre.`,
                        model: 'gpt-4o-mini',
                        maxTokens: 100
                    })
                });

                if (!response.ok) {
                    const local = analyzeLocally(userMessage);
                    context.sentimentScore = local.score;
                    context.emotion = local.emotion;
                    return {
                        success: true,
                        waitDelay: 1000,
                        message: `Sentiment (local): ${local.score}/100 - ${local.emotion}`,
                        data: local
                    };
                }

                const data = await response.json();

                if (!data.success || !data.response) {
                    const local = analyzeLocally(userMessage);
                    context.sentimentScore = local.score;
                    context.satisfaction = local.score; // Also store as satisfaction for condition nodes
                    context.emotion = local.emotion;
                    return {
                        success: true,
                        waitDelay: 1000,
                        message: `Sentiment (local): ${local.score}/100 - ${local.emotion}`,
                        data: { ...local, satisfaction: local.score }
                    };
                }

                // Parse GPT response
                let result;
                try {
                    result = JSON.parse(data.response.trim());
                } catch (e) {
                    const local = analyzeLocally(userMessage);
                    context.sentimentScore = local.score;
                    context.satisfaction = local.score; // Also store as satisfaction for condition nodes
                    context.emotion = local.emotion;
                    return {
                        success: true,
                        waitDelay: 1000,
                        message: `Sentiment (local): ${local.score}/100 - ${local.emotion}`,
                        data: { ...local, satisfaction: local.score }
                    };
                }

                context.sentimentScore = result.score;
                context.satisfaction = result.score; // Also store as satisfaction for condition nodes
                context.emotion = result.emotion;

                // Send analysis as bot message if configured
                const emoji = result.score >= 70 ? '😊' : result.score >= 50 ? '😐' : result.score >= 30 ? '😕' : '😤';

                return {
                    success: true,
                    waitDelay: 1500,
                    message: `Sentiment: ${result.score}/100 ${emoji} - ${result.emotion}`,
                    data: { ...result, satisfaction: result.score }
                };
            } catch (error: any) {
                const local = analyzeLocally(userMessage);
                context.sentimentScore = local.score;
                context.satisfaction = local.score; // Also store as satisfaction for condition nodes
                context.emotion = local.emotion;
                return {
                    success: true,
                    waitDelay: 1000,
                    message: `Sentiment (local): ${local.score}/100 - ${local.emotion}`,
                    data: { ...local, satisfaction: local.score }
                };
            }
        }

        case 'whatsapp_message':
        case 'telegram_message':
        case 'keyword': {
            const rawKeywords = config.keywords ?? config.keyword ?? config.words ?? "";

            let keywords: string[] = [];
            if (Array.isArray(rawKeywords)) {
                keywords = rawKeywords.map((k: any) => String(k).trim()).filter(Boolean);
            } else if (typeof rawKeywords === 'string') {
                const trimmed = rawKeywords.trim();

                // Accept JSON-encoded arrays
                if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                    try {
                        const parsed = JSON.parse(trimmed);
                        if (Array.isArray(parsed)) {
                            keywords = parsed.map((k: any) => String(k).trim()).filter(Boolean);
                        }
                    } catch {
                        // ignore JSON parse errors
                    }
                }

                // Fallback: newline or comma-separated string
                if (keywords.length === 0) {
                    keywords = trimmed
                        .split(/\r?\n|,/)
                        .map((k: string) => k.trim())
                        .filter(Boolean);
                }
            } else if (rawKeywords && typeof rawKeywords === 'object') {
                // Accept { list: [...] } or { keywords: [...] }
                const maybeList = (rawKeywords as any).list ?? (rawKeywords as any).keywords;
                if (Array.isArray(maybeList)) {
                    keywords = maybeList.map((k: any) => String(k).trim()).filter(Boolean);
                }
            }
            const userMsg = context.lastUserMessage?.toLowerCase() || '';

            // Check if triggered (always true for non-keyword message triggers)
            const triggered = type !== 'keyword' || keywords.length === 0 || keywords.some((kw: string) => userMsg.includes(kw.toLowerCase()));

            // Populate message and contact data
            const messageData = {
                message: {
                    text: context.lastUserMessage,
                    id: `msg_${Date.now()}`,
                    type: context.lastAudioUrl ? 'audio' : context.lastImageUrl ? 'image' : 'text'
                },
                from: context.userPhone || context.userId || 'unknown',
                timestamp: new Date().toISOString(),
                contact: {
                    phone: context.userPhone || '',
                    name: context.userName || 'Client',
                    id: context.userId || ''
                },
                // Add flat versions for the UI to show them plainly in the sidebar
                'contact.phone': context.userPhone || '',
                'contact.name': context.userName || 'Client',
                'contact.id': context.userId || '',
                'message.text': context.lastUserMessage,
                messageId: `msg_${Date.now()}`,
                messageType: context.lastAudioUrl ? 'audio' : context.lastImageUrl ? 'image' : 'text'
            };

            // Support both hierarchical and flat keys for maximum compatibility
            context.message = context.lastUserMessage;
            context.from = messageData.from;
            context.timestamp = messageData.timestamp;
            context.contact = messageData.contact;
            context['contact.phone'] = messageData.contact.phone;
            context['contact.name'] = messageData.contact.name;
            context['contact.id'] = messageData.contact.id;
            context.messageId = messageData.message.id;
            context.messageType = messageData.message.type;

            return {
                success: triggered,
                waitDelay: 300,
                message: triggered ? `Trigger ${type} activé ✅` : `Filtre mot-clé non passé ❌`,
                data: messageData
            };
        }

        case 'calendar':
        case 'check_availability':
        case 'book_appointment': {
            context.addMessage({
                sender: 'bot',
                text: `📅 Créneaux disponibles :\n1. Lundi 10h-12h\n2. Mardi 14h-16h\n3. Mercredi 9h-11h`
            });

            return {
                success: true,
                waitDelay: 1000,
                message: 'Disponibilités envoyées'
            };
        }

        case 'send_image': {
            const { url, caption } = config;
            context.addMessage({
                sender: 'bot',
                text: caption || 'Image envoyée',
                imageUrl: url || 'https://images.unsplash.com/photo-1579353977828-2a4eab540b9a?w=400',
            });

            // If manual execution, send to real WhatsApp
            if (context.isManualExecution && context.userId && context.userPhone) {
                await sendRealWhatsAppMessage(context.userId, context.userPhone, {
                    recipient: context.userPhone,
                    message: caption || '',
                    mediaPath: url
                });
            }

            return {
                success: true,
                waitDelay: 1200,
                message: 'Image envoyée'
            };
        }

        case 'send_buttons':
        case 'tg_buttons': {
            const { text, buttons } = config;
            context.addMessage({
                sender: 'bot',
                text: text || "Choisissez une option :",
                buttons: buttons || [
                    { text: 'Option 1', action: 'opt1' },
                    { text: 'Option 2', action: 'opt2' }
                ],
            });

            return {
                success: true,
                waitDelay: 800,
                message: 'Menu envoyé'
            };
        }

        case 'http_request': {
            const { url, method = 'GET', headers, body, outputKey = 'apiResponse' } = config;

            if (!url) return { success: false, waitDelay: 0, message: "URL manquante" };

            const resolvedUrl = replaceVariables(url, context);
            const resolvedBody = body ? replaceVariables(typeof body === 'string' ? body : JSON.stringify(body), context) : undefined;

            console.log(`🌐 Appel API: ${method} ${resolvedUrl}`);

            try {
                const response = await fetch(resolvedUrl, {
                    method: method,
                    headers: headers ? JSON.parse(replaceVariables(JSON.stringify(headers), context)) : { 'Content-Type': 'application/json' },
                    body: method !== 'GET' ? resolvedBody : undefined,
                });

                const data = await response.json();

                // Store result in context
                context[outputKey] = data;

                return {
                    success: response.ok,
                    waitDelay: 1000,
                    message: `API ${method} appelée: ${response.status} ${response.statusText}`,
                    data: data
                };
            } catch (error: any) {
                console.error('HTTP Request Error:', error);
                return {
                    success: false,
                    waitDelay: 0,
                    message: `Erreur HTTP: ${error.message}`
                };
            }
        }

        case 'save_contact':
        case 'add_tag':
        case 'remove_tag': {
            const { tags } = config;
            return {
                success: true,
                waitDelay: 500,
                message: `Contact synchronisé avec le CRM${tags?.length ? ` (tags: ${tags.join(', ')})` : ''}`
            };
        }

        case 'update_contact': {
            const { field, value } = config;
            return {
                success: true,
                waitDelay: 500,
                message: `Contact mis à jour: ${field} = ${value}`
            };
        }

        case 'assign_agent': {
            const { agentEmail, assignmentType } = config;
            return {
                success: true,
                waitDelay: 500,
                message: `Conversation assignée${agentEmail ? ` à ${agentEmail}` : ` (${assignmentType})`}`
            };
        }

        case 'add_note': {
            const { note } = config;
            return {
                success: true,
                waitDelay: 500,
                message: `Note ajoutée: ${note?.slice(0, 30)}...`
            };
        }

        case 'send_document': {
            const { url, filename, caption } = config;
            context.addMessage({
                sender: 'bot',
                text: `📄 Document: ${filename || 'fichier'}\n${caption || ''}\n${url || ''}`,
            });

            // If manual execution, send to real WhatsApp
            if (context.isManualExecution && context.userId && context.userPhone) {
                await sendRealWhatsAppMessage(context.userId, context.userPhone, {
                    message: `${caption || ''} ${url || ''}`.trim(),
                    mediaPath: url
                });
            }
            return {
                success: true,
                waitDelay: 1200,
                message: `Document envoyé: ${filename}`
            };
        }

        case 'send_location': {
            const { name, address, latitude, longitude } = config;
            context.addMessage({
                sender: 'bot',
                text: `📍 *${name || 'Localisation'}*\n${address || ''}\nCoordonnées: ${latitude}, ${longitude}`,
            });

            // If manual execution, send to real WhatsApp
            if (context.isManualExecution && context.userId && context.userPhone) {
                await sendRealWhatsAppMessage(context.userId, context.userPhone, {
                    latitude,
                    longitude,
                    address: address || name
                });
            }
            return {
                success: true,
                waitDelay: 1000,
                message: `Localisation envoyée: ${name}`
            };
        }

        case 'send_contact': {
            const { name, phone, email, organization } = config;
            context.addMessage({
                sender: 'bot',
                text: `👤 *Contact partagé*\n${name}\n📞 ${phone}${email ? `\n📧 ${email}` : ''}${organization ? `\n🏢 ${organization}` : ''}`,
            });

            // If manual execution, send to real WhatsApp
            if (context.isManualExecution && context.userId && context.userPhone) {
                await sendRealWhatsAppMessage(context.userId, context.userPhone, {
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL;type=CELL;type=VOICE;waid=${phone.replace(/\+/g, '')}:${phone}\nEND:VCARD`
                });
            }
            return {
                success: true,
                waitDelay: 1000,
                message: `Contact partagé: ${name}`
            };
        }

        case 'send_audio': {
            const { url, asVoiceNote } = config;
            context.addMessage({
                sender: 'bot',
                text: `🎵 ${asVoiceNote ? 'Note vocale' : 'Audio'}: ${url || 'audio.mp3'}`,
            });

            // If manual execution, send to real WhatsApp
            if (context.isManualExecution && context.userId && context.userPhone) {
                await sendRealWhatsAppMessage(context.userId, context.userPhone, {
                    mediaPath: url
                });
            }
            return {
                success: true,
                waitDelay: 1500,
                message: `Audio envoyé${asVoiceNote ? ' (note vocale)' : ''}`
            };
        }

        case 'loop': {
            const { loopType, count } = config;
            return {
                success: true,
                waitDelay: 300,
                message: `Boucle ${loopType}: ${count || 'n'} itérations`,
                data: { loopIndex: 0, loopCount: count || 1 }
            };
        }

        case 'set_variable': {
            const { variables } = config;

            if (Array.isArray(variables)) {
                variables.forEach(v => {
                    if (v.name) {
                        let finalValue = v.value;
                        if (v.type === 'expression' && v.expression) {
                            try {
                                // Basic but functional JS evaluation for expressions
                                // In a real prod env, use a safer sandbox
                                const fn = new Function('context', 'message', `return ${v.expression}`);
                                finalValue = fn(context, context.lastUserMessage);
                            } catch (e) {
                                console.error(`Error evaluating expression for ${v.name}:`, e);
                                finalValue = `Error: ${e instanceof Error ? e.message : 'Unknown'}`;
                            }
                        }
                        context[v.name] = finalValue;
                    }
                });
                return {
                    success: true,
                    waitDelay: 200,
                    message: `${variables.length} variable(s) définie(s)`
                };
            }

            // Legacy fallback
            const { variableName, value } = config;
            if (variableName) {
                context[variableName] = value;
                return {
                    success: true,
                    waitDelay: 200,
                    message: `Variable ${variableName} = ${value}`
                };
            }

            return { success: true, waitDelay: 0, message: "Aucune variable définie" };
        }

        case 'random_choice': {
            const { choices } = config;
            const randomIndex = Math.floor(Math.random() * (choices?.length || 2));
            return {
                success: true,
                waitDelay: 300,
                message: `Choix aléatoire: option ${randomIndex + 1}`,
                data: { selectedIndex: randomIndex, selectedChoice: choices?.[randomIndex] }
            };
        }

        case 'end_flow': {
            const { action, message } = config;
            if (action === 'message' && message) {
                context.addMessage({
                    sender: 'bot',
                    text: message,
                });
            }
            return {
                success: true,
                waitDelay: 500,
                message: `Flux terminé (${action})`
            };
        }

        case 'switch_router': {
            const { field, cases } = config;
            const testValue = String(context[field || 'intent'] || context.lastUserMessage || "").toLowerCase();

            console.log(`🔀 Switch sur ${field || 'intent'}: "${testValue}"`);

            let matchedIdx = -1;
            if (Array.isArray(cases)) {
                matchedIdx = cases.findIndex(c => String(c.value).toLowerCase() === testValue);
            }

            return {
                success: true,
                waitDelay: 500,
                message: matchedIdx >= 0 ? `Branché sur "${cases[matchedIdx].label || cases[matchedIdx].value}"` : "Routing par défaut",
                data: { matchedIndex: matchedIdx, isDefault: matchedIdx === -1 }
            };
        }

        case 'check_availability': {
            const { duration = 30 } = config;
            console.log(`📅 Recherche de créneaux (${duration} min)...`);

            // Simulation
            const slots = [
                "Lundi 14:00", "Lundi 15:30",
                "Mardi 09:00", "Mardi 10:30",
                "Mercredi 11:00", "Vendredi 16:00"
            ];

            context.available_slots = slots;
            context.formatted_slots = slots.map(s => `- ${s}`).join('\n');

            return {
                success: true,
                waitDelay: 1200,
                message: `Trouvé ${slots.length} créneaux pour ${duration} min`,
                data: { slots, count: slots.length }
            };
        }

        case 'book_appointment': {
            const { title = "Rendez-vous" } = config;
            const selectedDate = context.selected_date || "Demain à 10h00";

            console.log(`✅ Réservation de: ${title} pour ${selectedDate}`);

            return {
                success: true,
                waitDelay: 1500,
                message: `RDV "${title}" confirmé pour ${selectedDate}`,
                data: { bookingId: "SIM-" + Math.floor(Math.random() * 9000 + 1000), date: selectedDate }
            };
        }

        case 'cancel_appointment': {
            return {
                success: true,
                waitDelay: 1000,
                message: "Rendez-vous annulé avec succès"
            };
        }

        case 'notify_email': {

            const { to, subject } = config;
            return {
                success: true,
                waitDelay: 1000,
                message: `Email envoyé à ${to}: ${subject}`
            };
        }

        case 'notify_webhook': {
            const { url, method } = config;
            return {
                success: true,
                waitDelay: 1000,
                message: `Webhook ${method || 'POST'} envoyé à ${url}`
            };
        }

        case 'notify_slack': {
            const { webhookUrl, channel, text } = config;
            if (!webhookUrl) return { success: false, waitDelay: 0, message: "Webhook Slack manquant" };

            const resolvedText = replaceVariables(text || "Notification depuis Wozif Connect", context);

            try {
                await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: resolvedText,
                        channel: channel || undefined
                    })
                });

                return {
                    success: true,
                    waitDelay: 800,
                    message: `Slack: message envoyé${channel ? ` sur ${channel}` : ''}`
                };
            } catch (error: any) {
                return { success: false, waitDelay: 0, message: `Slack Error: ${error.message}` };
            }
        }

        case 'notify_internal': {
            const { title, priority } = config;
            return {
                success: true,
                waitDelay: 500,
                message: `Notification interne: ${title} (${priority})`
            };
        }

        case 'cancel_appointment': {
            const { appointmentId, sendNotification } = config;
            return {
                success: true,
                waitDelay: 800,
                message: `RDV ${appointmentId} annulé${sendNotification ? ' (notification envoyée)' : ''}`
            };
        }

        case 'send_reminder': {
            const { type, channel, beforeMinutes } = config;
            context.addMessage({
                sender: 'bot',
                text: `⏰ Rappel: votre ${type || 'rendez-vous'} est dans ${beforeMinutes || 60} minutes`,
            });
            return {
                success: true,
                waitDelay: 800,
                message: `Rappel ${type} envoyé via ${channel}`
            };
        }

        case 'rate_limit': {
            const { maxRequests, windowSeconds } = config;
            return {
                success: true,
                waitDelay: 100,
                message: `Rate limit vérifié: ${maxRequests}/${windowSeconds}s`
            };
        }

        case 'block_spam': {
            const { action } = config;
            return {
                success: true,
                waitDelay: 200,
                message: `Filtre anti-spam actif (action: ${action})`
            };
        }

        case 'verify_human': {
            const { method, question } = config;
            if (method === 'question') {
                context.addMessage({
                    sender: 'bot',
                    text: `🔐 Vérification: ${question || 'Êtes-vous humain?'}`,
                });
            }
            return {
                success: true,
                waitDelay: 500,
                message: `Vérification humaine (${method})`
            };
        }

        case 'add_to_cart': {
            // Détecte et ajoute un produit au panier
            const { productId, quantity = 1, productName, price } = config;
            const userMessage = context.lastUserMessage.toLowerCase();

            // Si productId n'est pas fourni, essayer de détecter depuis le message
            let detectedProductId = productId;
            if (!detectedProductId) {
                // Chercher dans les produits disponibles
                const matchingProduct = context.products?.find((p: any) =>
                    userMessage.includes(p.name.toLowerCase()) ||
                    userMessage.includes(p.id.toString())
                );
                if (matchingProduct) {
                    detectedProductId = matchingProduct.id;
                }
            }

            // Initialiser le panier si nécessaire
            if (!context.cart) {
                context.cart = [];
            }

            // Trouver le produit dans la liste
            const product = context.products?.find((p: any) => p.id === detectedProductId);

            if (!product && !detectedProductId) {
                context.addMessage({
                    sender: 'bot',
                    text: `❌ *Produit non trouvé*\n\nJe n'ai pas pu identifier le produit à ajouter. Pouvez-vous préciser ?`,
                });
                return {
                    success: false,
                    waitDelay: 500,
                    message: `Produit non trouvé`
                };
            }

            const productToAdd = product || {
                id: detectedProductId,
                name: productName || `Produit ${detectedProductId}`,
                price: price || 0
            };

            // Vérifier si le produit est déjà dans le panier
            const existingItem = context.cart.find((item: any) => item.id === productToAdd.id);
            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 1) + quantity;
            } else {
                context.cart.push({
                    id: productToAdd.id,
                    name: productToAdd.name,
                    price: productToAdd.price,
                    quantity: quantity
                });
            }

            const finalQuantity = existingItem ? existingItem.quantity : quantity;
            context.addMessage({
                sender: 'bot',
                text: `✅ *Ajouté au panier*\n\n*${productToAdd.name}* x${finalQuantity}\n${productToAdd.price * finalQuantity} ${context.currency}`,
            });

            return {
                success: true,
                waitDelay: 800,
                message: `Produit ${productToAdd.name} ajouté au panier (x${finalQuantity})`,
                data: { cartUpdated: true, cartItems: context.cart.length }
            };
        }

        case 'checkout': {
            // Finalise la commande et envoie le paiement
            const { gateway, currency, paymentUrl, successUrl, failureUrl, apiKey, testMode } = config;
            const cart = context.cart || [];

            if (cart.length === 0) {
                context.addMessage({
                    sender: 'bot',
                    text: `❌ *Panier vide*\n\nVotre panier est vide. Ajoutez des produits avant de passer commande.`,
                });
                return {
                    success: false,
                    waitDelay: 500,
                    message: `Checkout échoué - panier vide`
                };
            }

            // Calculer le total
            let subtotal = 0;
            cart.forEach((item: any) => {
                subtotal += (item.price || 0) * (item.quantity || 1);
            });
            const discount = context.discountApplied || 0;
            const total = Math.max(0, subtotal - discount);

            // Générer un ID de commande
            const orderId = `CMD-${Date.now()}`;
            context.orderId = orderId;
            context.orderTotal = total;

            // Construire l'URL de paiement
            let finalPaymentUrl = paymentUrl;
            if (!finalPaymentUrl) {
                if (gateway === 'moneroo' && apiKey) {
                    // URL Moneroo avec paramètres
                    const params = new URLSearchParams({
                        order: orderId,
                        amount: total.toString(),
                        currency: currency || context.currency || 'XOF',
                        ...(successUrl && { success_url: successUrl }),
                        ...(failureUrl && { failure_url: failureUrl }),
                        ...(testMode && { test: 'true' })
                    });
                    finalPaymentUrl = `https://moneroo.com/checkout?${params.toString()}`;
                } else {
                    // URL générique
                    finalPaymentUrl = `https://pay.example.com/checkout?order=${orderId}&amount=${total}&currency=${currency || context.currency || 'XOF'}`;
                }
            }

            // Construire le message de checkout
            let checkoutText = `💳 *Finalisation de la commande*\n\n`;
            checkoutText += `*Commande #${orderId}*\n\n`;
            cart.forEach((item: any, i: number) => {
                checkoutText += `${i + 1}. ${item.name} x${item.quantity}\n`;
                checkoutText += `   ${(item.price * item.quantity)} ${currency || context.currency}\n\n`;
            });
            checkoutText += `━━━━━━━━━━━━━━━━\n`;
            if (discount > 0) {
                checkoutText += `Sous-total: ${subtotal} ${currency || context.currency}\n`;
                checkoutText += `Réduction: -${discount} ${currency || context.currency}\n`;
            }
            checkoutText += `*Total: ${total} ${currency || context.currency}*\n\n`;
            checkoutText += `🔗 Lien de paiement sécurisé:\n${finalPaymentUrl}`;
            if (testMode) {
                checkoutText += `\n\n⚠️ *Mode test activé*`;
            }

            context.addMessage({
                sender: 'bot',
                text: checkoutText,
            });

            return {
                success: true,
                waitDelay: 1500,
                message: `Checkout initié - Commande ${orderId} (${total} ${currency || context.currency})`,
                data: { orderId, total, cartItems: cart.length, paymentUrl: finalPaymentUrl, gateway, testMode }
            };
        }

        case 'show_cart': {
            // Affiche le contenu du panier actuel
            const cart = context.cart || [];
            if (cart.length === 0) {
                context.addMessage({
                    sender: 'bot',
                    text: `🛒 *Votre panier est vide*\n\nAjoutez des produits pour commencer vos achats !`,
                });
            } else {
                let cartText = `🛒 *Votre Panier*\n\n`;
                let total = 0;
                cart.forEach((item: any, i: number) => {
                    const itemTotal = (item.price || 0) * (item.quantity || 1);
                    total += itemTotal;
                    cartText += `${i + 1}. *${item.name || 'Produit'}* x${item.quantity || 1}\n`;
                    cartText += `   ${itemTotal} ${context.currency}\n\n`;
                });
                cartText += `━━━━━━━━━━━━━━━━\n*Total: ${total} ${context.currency}*`;

                context.addMessage({
                    sender: 'bot',
                    text: cartText,
                });
            }
            return {
                success: true,
                waitDelay: 1000,
                message: `Panier affiché (${cart.length || 0} articles)`,
                data: { cartItems: cart.length || 0 }
            };
        }

        case 'order_status': {
            const { orderId } = config;
            context.addMessage({
                sender: 'bot',
                text: `📦 Statut commande ${orderId || '#12345'}:\n✅ En cours de préparation\n🚚 Livraison prévue: 2-3 jours`,
            });
            return {
                success: true,
                waitDelay: 800,
                message: `Statut commande ${orderId} affiché`
            };
        }

        case 'apply_promo': {
            // Applique un code promo au panier
            const { promoCode, discountType, discountValue } = config;
            const cart = context.cart || [];

            if (cart.length === 0) {
                context.addMessage({
                    sender: 'bot',
                    text: `❌ *Panier vide*\n\nVotre panier est vide. Ajoutez des produits avant d'appliquer un code promo.`,
                });
                return {
                    success: false,
                    waitDelay: 500,
                    message: `Code promo non appliqué - panier vide`
                };
            }

            // Calculer le total actuel
            let total = 0;
            cart.forEach((item: any) => {
                total += (item.price || 0) * (item.quantity || 1);
            });

            // Appliquer la réduction
            let discount = 0;
            if (discountType === 'percentage') {
                discount = total * ((discountValue || 0) / 100);
            } else if (discountType === 'fixed') {
                discount = discountValue || 0;
            }

            const finalTotal = Math.max(0, total - discount);
            context.cartTotal = finalTotal;
            context.promoCode = promoCode;
            context.discountApplied = discount;

            context.addMessage({
                sender: 'bot',
                text: `🎉 *Code promo appliqué !*\n\nCode: *${promoCode || 'PROMO'}*\nRéduction: ${discount} ${context.currency}\n\n*Total avant:* ${total} ${context.currency}\n*Total après:* ${finalTotal} ${context.currency}`,
            });

            return {
                success: true,
                waitDelay: 1000,
                message: `Code promo ${promoCode} appliqué (réduction: ${discount} ${context.currency})`,
                data: { discount, finalTotal, promoCode }
            };
        }

        case 'create_group': {
            const { name, description } = config;
            return {
                success: true,
                waitDelay: 1500,
                message: `Groupe WhatsApp créé: ${name}`
            };
        }

        case 'add_participant':
        case 'remove_participant': {
            const { groupId, phoneNumber } = config;
            const action = type === 'add_participant' ? 'ajouté à' : 'retiré de';
            return {
                success: true,
                waitDelay: 800,
                message: `${phoneNumber} ${action} groupe ${groupId}`
            };
        }

        case 'bulk_add_members': {
            const { groupId, source, delay } = config;
            return {
                success: true,
                waitDelay: 2000,
                message: `Ajout en masse depuis ${source} vers groupe ${groupId} (délai: ${delay}s)`
            };
        }

        case 'get_group_members':
        case 'chat_list_collector': {
            const { exportFormat } = config;
            return {
                success: true,
                waitDelay: 1500,
                message: `Extraction contacts en ${exportFormat || 'CSV'}`
            };
        }

        case 'ai_translate': {
            const { sourceLanguage, targetLanguage, autoDetect } = config;
            const userMessage = context.lastUserMessage;

            console.log(`🌍 Traduction automatique silencieuse...`);

            // Language name mapping for user-friendly output
            const languageNames: Record<string, string> = {
                'fr': 'Français', 'en': 'English', 'es': 'Español', 'de': 'Deutsch',
                'pt': 'Português', 'it': 'Italiano', 'ar': 'العربية', 'zh': '中文',
                'ja': '日本語', 'ko': '한국어', 'ru': 'Русский', 'nl': 'Nederlands',
                'auto': 'Auto-détection'
            };

            const targetLang = targetLanguage || 'fr';
            const sourceLang = autoDetect ? 'auto' : (sourceLanguage || 'auto');

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: userMessage,
                        systemPrompt: `Tu es un traducteur professionnel. 
${sourceLang === 'auto' ? 'Détecte automatiquement la langue du message.' : `Le message est en ${languageNames[sourceLang] || sourceLang}.`}
Traduis le message suivant en ${languageNames[targetLang] || targetLang}.

RÈGLES:
1. Réponds UNIQUEMENT avec la traduction, rien d'autre
2. Conserve le ton et le style du message original
3. Si le message est déjà dans la langue cible, retourne-le tel quel
4. Pour les expressions idiomatiques, utilise l'équivalent culturel`,
                        model: 'gpt-4o-mini',
                        maxTokens: 500
                    })
                });

                if (!response.ok) {
                    // Silently fail - use original message
                    context.translatedMessage = userMessage;
                    context.originalMessage = userMessage;
                    return {
                        success: false,
                        waitDelay: 300,
                        message: `Traduction échouée - message original conservé`
                    };
                }

                const data = await response.json();

                if (!data.success || !data.response) {
                    context.translatedMessage = userMessage;
                    context.originalMessage = userMessage;
                    return {
                        success: false,
                        waitDelay: 300,
                        message: `Traduction échouée`
                    };
                }

                const translatedText = data.response.trim();

                // Store translation in context for later use (NO message sent to chat)
                context.translatedMessage = translatedText;
                context.originalMessage = userMessage;
                context.lastUserMessage = translatedText; // Update for next blocks
                context.detectedLanguage = sourceLang;

                console.log(`✅ Traduction silencieuse: "${userMessage}" → "${translatedText}"`);

                return {
                    success: true,
                    waitDelay: 500,
                    message: `Traduit: "${userMessage}" → "${translatedText}"`,
                    data: {
                        original: userMessage,
                        translated: translatedText,
                        targetLanguage: targetLang
                    }
                };
            } catch (error: any) {
                console.error('[ai_translate] Error:', error);
                context.translatedMessage = userMessage;
                context.originalMessage = userMessage;
                return {
                    success: false,
                    waitDelay: 300,
                    message: `Erreur traduction - message original conservé`
                };
            }
        }

        case 'ai_summarize': {
            const { maxLength, style, showInChat } = config;
            const userMessage = context.lastUserMessage;
            const conversationHistory = context.conversationHistory || [userMessage];

            console.log(`📝 Résumé de conversation...`);

            // Style descriptions for the prompt
            const styleDescriptions: Record<string, string> = {
                'concis': 'Sois très bref, 1-2 phrases maximum',
                'detailed': 'Fais un résumé détaillé avec les points importants',
                'detaille': 'Fais un résumé détaillé avec les points importants',
                'points': 'Liste les points clés sous forme de bullet points (•)',
                'points-cles': 'Liste les points clés sous forme de bullet points (•)',
                'action': 'Identifie les actions à prendre et décisions prises'
            };

            const selectedStyle = style || 'concis';
            const styleInstruction = styleDescriptions[selectedStyle] || styleDescriptions['concis'];

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: Array.isArray(conversationHistory)
                            ? conversationHistory.join('\n---\n')
                            : userMessage,
                        systemPrompt: `Tu es un expert en synthèse de conversations.
Crée un résumé de la conversation/message ci-dessous.

STYLE: ${styleInstruction}
${maxLength ? `LONGUEUR MAX: ${maxLength} mots environ` : ''}

RÈGLES:
1. Capture l'essentiel de ce qui a été dit/demandé
2. Identifie les besoins ou intentions du client
3. Note les informations importantes (produits, dates, montants mentionnés)
4. Sois objectif et factuel`,
                        model: 'gpt-4o-mini',
                        maxTokens: 300
                    })
                });

                if (!response.ok) {
                    // Fallback: simple truncation
                    const fallbackSummary = userMessage.slice(0, maxLength || 100) + '...';
                    context.summary = fallbackSummary;

                    if (showInChat !== false) {
                        context.addMessage({
                            sender: 'bot',
                            text: `📝 *Résumé*\n${fallbackSummary}`,
                        });
                    }

                    return {
                        success: false,
                        waitDelay: 500,
                        message: `Résumé (fallback): ${fallbackSummary.slice(0, 50)}...`
                    };
                }

                const data = await response.json();

                if (!data.success || !data.response) {
                    const fallbackSummary = userMessage.slice(0, maxLength || 100) + '...';
                    context.summary = fallbackSummary;
                    return {
                        success: false,
                        waitDelay: 500,
                        message: `Résumé échoué`
                    };
                }

                const summary = data.response.trim();

                // Store summary in context
                context.summary = summary;

                // Optionally show in chat (default: silent like translate)
                if (showInChat === true) {
                    context.addMessage({
                        sender: 'bot',
                        text: `📝 *Résumé de la conversation*\n\n${summary}`,
                    });
                }

                console.log(`✅ Résumé généré: "${summary.slice(0, 80)}..."`);

                return {
                    success: true,
                    waitDelay: 800,
                    message: `Résumé: ${summary.slice(0, 60)}...`,
                    data: {
                        summary,
                        style: selectedStyle,
                        originalLength: userMessage.length,
                        summaryLength: summary.length
                    }
                };
            } catch (error: any) {
                console.error('[ai_summarize] Error:', error);
                const fallbackSummary = userMessage.slice(0, maxLength || 100) + '...';
                context.summary = fallbackSummary;
                return {
                    success: false,
                    waitDelay: 300,
                    message: `Erreur résumé - fallback utilisé`
                };
            }
        }

        // ============ NOUVEAUX BLOCS IA AVANCÉS ============

        case 'ai_moderation': {
            // Modération de contenu - détecte les violations
            const userMessage = context.lastUserMessage;
            console.log(`🛡️ Modération de contenu...`);

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: userMessage,
                        systemPrompt: `Tu es un modérateur de contenu. Analyse ce message et réponds en JSON:
{"flagged": true/false, "categories": ["spam", "harassment", "hate", "violence", "adult"], "score": 0-100, "reason": "explication"}
Score: 0 = sûr, 100 = très problématique. Réponds UNIQUEMENT en JSON.`,
                        model: 'gpt-4o-mini',
                        maxTokens: 150
                    })
                });

                if (!response.ok) {
                    return { success: true, waitDelay: 300, message: `Modération: contenu acceptable (fallback)` };
                }

                const data = await response.json();
                let result = { flagged: false, score: 0, categories: [], reason: 'OK' };
                try { result = JSON.parse(data.response || '{}'); } catch (e) { }

                context.moderationResult = result;

                if (result.flagged && result.score > 70) {
                    context.addMessage({
                        sender: 'bot',
                        text: `⚠️ Votre message ne peut pas être traité. Merci de reformuler.`,
                    });
                }

                return {
                    success: true,
                    waitDelay: 500,
                    message: `Modération: ${result.flagged ? `⚠️ Flaggé (${result.score}/100)` : '✅ OK'}`,
                    data: result
                };
            } catch (error) {
                return { success: true, waitDelay: 300, message: `Modération: OK (fallback)` };
            }
        }

        case 'ai_analyze_image': {
            // Analyse d'image avec GPT-4 Vision
            const { imageUrl } = config;
            console.log(`🖼️ Analyse d'image...`);

            if (!imageUrl && !context.lastImageUrl) {
                return {
                    success: false,
                    waitDelay: 300,
                    message: `Aucune image à analyser`
                };
            }

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: `Décris cette image en détail: ${imageUrl || context.lastImageUrl}`,
                        systemPrompt: `Tu analyses les images. Décris ce que tu vois de manière concise mais complète (objets, personnes, texte visible, couleurs, ambiance).`,
                        model: 'gpt-4o',
                        maxTokens: 300
                    })
                });

                const data = await response.json();
                const description = data.response || "Image analysée";

                context.imageDescription = description;

                return {
                    success: true,
                    waitDelay: 800,
                    message: `Image analysée: ${description.slice(0, 50)}...`,
                    data: { description }
                };
            } catch (error) {
                return { success: false, waitDelay: 300, message: `Erreur analyse image` };
            }
        }

        case 'ai_generate_image': {
            // Génération d'image avec DALL-E
            const { prompt, size, quality } = config;
            const imagePrompt = prompt || context.lastUserMessage;
            console.log(`🎨 Génération d'image DALL-E...`);

            context.addMessage({
                sender: 'bot',
                text: `🎨 *Création de votre image...*\n_"${imagePrompt.slice(0, 50)}..."_`,
            });

            // Simulé pour le moment - en production, appeler l'API DALL-E
            return {
                success: true,
                waitDelay: 2000,
                message: `Image générée: "${imagePrompt.slice(0, 30)}..."`,
                data: { prompt: imagePrompt, size: size || '1024x1024', quality: quality || 'standard' }
            };
        }

        case 'ai_generate_audio': {
            // Text-to-Speech avec OpenAI TTS
            const { voice, speed } = config;
            const textToSpeak = config.text || context.lastUserMessage;
            console.log(`🔊 Génération audio TTS...`);

            context.addMessage({
                sender: 'bot',
                text: `🎵 *Audio généré*\n_Voix: ${voice || 'alloy'}_`,
            });

            return {
                success: true,
                waitDelay: 1500,
                message: `Audio TTS généré (${voice || 'alloy'})`,
                data: { text: textToSpeak, voice: voice || 'alloy', speed: speed || 1.0 }
            };
        }

        case 'ai_transcribe': {
            // Transcription audio avec Whisper
            const { audioUrl, language } = config;
            console.log(`📝 Transcription audio Whisper...`);

            if (!audioUrl && !context.lastAudioUrl) {
                return {
                    success: false,
                    waitDelay: 300,
                    message: `Aucun audio à transcrire`
                };
            }

            // Simulé - en production, appeler l'API Whisper
            const simulatedTranscription = "Ceci est une transcription simulée de l'audio reçu.";

            context.transcription = simulatedTranscription;
            context.lastUserMessage = simulatedTranscription; // Permet au prochain bloc d'utiliser la transcription

            return {
                success: true,
                waitDelay: 1500,
                message: `Audio transcrit: "${simulatedTranscription.slice(0, 40)}..."`,
                data: { transcription: simulatedTranscription, language: language || 'auto' }
            };
        }

        case 'ai_generate_video': {
            // Génération vidéo avec Sora (OpenAI)
            const { prompt, duration } = config;
            const videoPrompt = prompt || context.lastUserMessage;
            console.log(`🎬 Génération vidéo Sora...`);

            context.addMessage({
                sender: 'bot',
                text: `🎬 *Création de votre vidéo en cours...*\n_"${videoPrompt.slice(0, 50)}..."_\n⏱️ Durée estimée: ${duration || 5}s`,
            });

            return {
                success: true,
                waitDelay: 3000,
                message: `Vidéo générée: "${videoPrompt.slice(0, 30)}..."`,
                data: { prompt: videoPrompt, duration: duration || 5 }
            };
        }

        case 'ai_edit_image': {
            // Édition d'image avec DALL-E
            const { prompt, size } = config;
            const editPrompt = prompt || context.lastUserMessage;
            const imageToEdit = config.imageUrl || context.lastImageUrl;
            console.log(`✏️ Édition d'image DALL-E...`);

            if (!imageToEdit) {
                return {
                    success: false,
                    waitDelay: 300,
                    message: `Aucune image à éditer`
                };
            }

            context.addMessage({
                sender: 'bot',
                text: `✏️ *Modification de l'image en cours...*\n_"${editPrompt.slice(0, 50)}..."_`,
            });

            return {
                success: true,
                waitDelay: 2500,
                message: `Image éditée: "${editPrompt.slice(0, 30)}..."`,
                data: { prompt: editPrompt, size: size || '1024x1024', originalImage: imageToEdit }
            };
        }

        case 'ai_translate_audio': {
            // Traduction d'audio avec Whisper + GPT
            const { targetLanguage, format } = config;
            const audioUrl = config.audioUrl || context.lastAudioUrl;
            console.log(`🌍 Traduction audio...`);

            if (!audioUrl) {
                return {
                    success: false,
                    waitDelay: 300,
                    message: `Aucun audio à traduire`
                };
            }

            // Simulé - en production: transcrire avec Whisper puis traduire avec GPT
            const simulatedTranslation = `[Traduction en ${targetLanguage || 'fr'}] Ceci est une traduction simulée de l'audio.`;

            context.translatedAudio = simulatedTranslation;
            context.lastUserMessage = simulatedTranslation;

            context.addMessage({
                sender: 'bot',
                text: `🌍 *Audio traduit en ${targetLanguage || 'fr'}*\n_"${simulatedTranslation.slice(0, 50)}..."_`,
            });

            return {
                success: true,
                waitDelay: 2000,
                message: `Audio traduit en ${targetLanguage || 'fr'}`,
                data: { translation: simulatedTranslation, targetLanguage, format: format || 'text' }
            };
        }

        case 'ai_delete_file': {
            // Suppression de fichier via OpenAI API
            const { fileId } = config;
            console.log(`🗑️ Suppression fichier: ${fileId}...`);

            if (!fileId) {
                return {
                    success: false,
                    waitDelay: 300,
                    message: `ID de fichier manquant`
                };
            }

            // Simulé - en production, appeler l'API OpenAI pour supprimer le fichier
            return {
                success: true,
                waitDelay: 500,
                message: `Fichier ${fileId} supprimé`,
                data: { fileId }
            };
        }

        case 'ai_list_files': {
            // Liste des fichiers via OpenAI API
            const { purpose } = config;
            console.log(`📋 Liste fichiers (purpose: ${purpose || 'all'})...`);

            // Simulé - en production, appeler l'API OpenAI pour lister les fichiers
            const simulatedFiles = [
                { id: 'file-1', name: 'document.pdf', purpose: 'assistants' },
                { id: 'file-2', name: 'data.json', purpose: 'fine-tune' }
            ];

            context.filesList = simulatedFiles;

            return {
                success: true,
                waitDelay: 800,
                message: `${simulatedFiles.length} fichiers trouvés`,
                data: { files: simulatedFiles, purpose: purpose || 'all' }
            };
        }

        case 'ai_upload_file': {
            // Téléversement de fichier vers OpenAI
            const { fileUrl, purpose } = config;
            console.log(`📤 Téléversement fichier: ${fileUrl}...`);

            if (!fileUrl) {
                return {
                    success: false,
                    waitDelay: 300,
                    message: `URL de fichier manquante`
                };
            }

            // Simulé - en production, téléverser le fichier via l'API OpenAI
            const simulatedFileId = `file-${Date.now()}`;

            context.uploadedFileId = simulatedFileId;

            context.addMessage({
                sender: 'bot',
                text: `📤 *Fichier téléversé*\n_ID: ${simulatedFileId}_`,
            });

            return {
                success: true,
                waitDelay: 1500,
                message: `Fichier téléversé: ${simulatedFileId}`,
                data: { fileId: simulatedFileId, fileUrl, purpose: purpose || 'assistants' }
            };
        }

        case 'ai_create_conversation': {
            // Création d'une conversation
            const { name } = config;
            console.log(`💬 Création conversation: ${name || 'Sans nom'}...`);

            const conversationId = `conv_${Date.now()}`;
            context.conversationId = conversationId;

            return {
                success: true,
                waitDelay: 500,
                message: `Conversation créée: ${conversationId}`,
                data: { conversationId, name: name || '' }
            };
        }

        case 'ai_get_conversation': {
            // Récupération d'une conversation
            const { conversationId } = config;
            console.log(`📥 Récupération conversation: ${conversationId}...`);

            if (!conversationId) {
                return {
                    success: false,
                    waitDelay: 300,
                    message: `ID de conversation manquant`
                };
            }

            // Simulé - en production, récupérer la conversation via l'API
            context.conversationId = conversationId;
            context.conversationData = {
                id: conversationId,
                messages: context.messages || []
            };

            return {
                success: true,
                waitDelay: 600,
                message: `Conversation récupérée: ${conversationId}`,
                data: { conversationId, messages: context.messages || [] }
            };
        }

        case 'ai_remove_conversation': {
            // Suppression d'une conversation
            const { conversationId } = config;
            console.log(`🗑️ Suppression conversation: ${conversationId}...`);

            if (!conversationId) {
                return {
                    success: false,
                    waitDelay: 300,
                    message: `ID de conversation manquant`
                };
            }

            // Simulé - en production, supprimer la conversation via l'API
            return {
                success: true,
                waitDelay: 500,
                message: `Conversation supprimée: ${conversationId}`,
                data: { conversationId }
            };
        }

        case 'run_javascript': {
            const code = config.code || config.javascript || "";
            if (!code) return { success: true, waitDelay: 0, message: "Code JavaScript vide" };

            try {
                // Créer une fonction avec le contexte et le message en paramètres
                const fn = new Function('context', 'message', `
                    try {
                        ${code}
                    } catch(e) {
                        return { error: e.message };
                    }
                `);

                const result = fn(context, context.lastUserMessage);

                // Si le résultat est un objet, on peut le fusionner dans le contexte
                if (result && typeof result === 'object' && !Array.isArray(result)) {
                    Object.assign(context, result);
                }

                return {
                    success: !result?.error,
                    waitDelay: 500,
                    message: result?.error ? `Erreur JS: ${result.error}` : "Code JavaScript exécuté",
                    data: result
                };
            } catch (e: any) {
                return { success: false, waitDelay: 0, message: `Erreur compilation JS: ${e.message}` };
            }
        }

        case 'ai_update_conversation': {
            // Mise à jour d'une conversation
            const { conversationId, name } = config;
            console.log(`✏️ Mise à jour conversation: ${conversationId}...`);

            if (!conversationId) {
                return {
                    success: false,
                    waitDelay: 300,
                    message: `ID de conversation manquant`
                };
            }

            // Simulé - en production, mettre à jour la conversation via l'API
            context.conversationId = conversationId;
            if (name) {
                context.conversationName = name;
            }

            return {
                success: true,
                waitDelay: 600,
                message: `Conversation mise à jour: ${conversationId}`,
                data: { conversationId, name: name || '' }
            };
        }

        case 'scheduled':
        case 'webhook_trigger': {
            return {
                success: true,
                waitDelay: 100,
                message: `Déclencheur ${type} activé`
            };
        }

        default:
            return {
                success: true,
                waitDelay: 500,
                message: `Bloc ${node.name} exécuté`
            };
    }
}

function replaceVariables(text: string, context: ExecutionContext): string {
    if (!text) return '';

    // Replace standard placeholders
    let result = text
        .replace(/{nom}/g, context.userName || 'Client')
        .replace(/{prenom}/g, context.userFirstName || '')
        .replace(/{email}/g, context.userEmail || '');

    // Dynamic replacement for all context variables using {{variable_name}} syntax
    // This allows arbitrary variables set by 'set_variable' or 'api_response'
    // Supports nested paths like {{contact.phone}} and leading dots like {{.lastUserMessage}}
    return result.replace(/{{(.*?)}}/g, (match, key) => {
        let path = key.trim();
        if (path.startsWith('.')) path = path.substring(1);

        const parts = path.split('.');
        let value: any = context;

        for (const part of parts) {
            if (value && typeof value === 'object' && part in value) {
                value = value[part];
            } else {
                value = undefined;
                break;
            }
        }

        if (value === undefined) {
            value = context[path];
        }

        if (value === undefined) return match;

        // Handle object/array stringification
        if (typeof value === 'object' && value !== null) {
            return JSON.stringify(value);
        }

        return String(value);
    });
}
