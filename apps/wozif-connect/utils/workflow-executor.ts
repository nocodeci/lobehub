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

            return {
                success: true,
                waitDelay: 1500,
                message: `Message envoyé: ${finalText.slice(0, 50)}...`
            };
        }

        case 'gpt_analyze': {
            // STRICT intent classification - NO response generation
            const { categories, aiInstructions } = config;
            const userMessage = context.lastUserMessage;

            console.log(`🔍 Classification d'intention...`);

            const customCategories = categories || aiInstructions || "";

            // STRICT classification prompt
            const systemPrompt = `Tu es un classificateur d'intention. Tu dois UNIQUEMENT retourner UNE catégorie parmi:
- salutation (bonjour, salut, hello)
- question_prix (combien, prix, coût, tarif)
- demande_produit (article, produit, disponibilité)
- plainte (problème, insatisfait, erreur, retard)
- remerciement (merci, super, génial)
- confirmation (oui, ok, d'accord, je confirme)
- annulation (annuler, non, arrêter)
- demande_aide (aide, assistance, support)
- autre (tout le reste)
${customCategories ? `\nCatégories additionnelles: ${customCategories}` : ""}

RÈGLES STRICTES:
1. Réponds UNIQUEMENT par le nom de la catégorie (UN SEUL MOT)
2. NE JAMAIS répondre au message
3. NE JAMAIS générer de phrase complète`;

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: `Classifie: "${userMessage}"`,
                        systemPrompt,
                        model: 'gpt-4o-mini',
                        maxTokens: 10
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

                let intent = data.response?.trim()?.toLowerCase() || "autre";

                // Clean up: keep only the intent word
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

                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: userMessage,
                        systemPrompt,
                        model: model || 'gpt-4o'
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
                    data: { aiResponse }
                };
            } catch (error: any) {
                return {
                    success: false,
                    waitDelay: 0,
                    message: `Erreur API: ${error.message}`
                };
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
            const { field, operator, value } = config;
            const testValue = context[field] || context.lastUserMessage;

            let passed = false;
            const v1 = String(testValue).toLowerCase();
            const v2 = String(value).toLowerCase();

            switch (operator) {
                case 'contains':
                    passed = v1.includes(v2);
                    break;
                case 'equals':
                    passed = v1 === v2;
                    break;
                case 'starts':
                    passed = v1.startsWith(v2);
                    break;
                default:
                    passed = true;
            }

            return {
                success: true,
                waitDelay: 500,
                message: `Condition ${passed ? 'VRAIE ✅' : 'FAUSSE ❌'}`,
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
                    context.emotion = local.emotion;
                    return {
                        success: true,
                        waitDelay: 1000,
                        message: `Sentiment (local): ${local.score}/100 - ${local.emotion}`,
                        data: local
                    };
                }

                // Parse GPT response
                let result;
                try {
                    result = JSON.parse(data.response.trim());
                } catch (e) {
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

                context.sentimentScore = result.score;
                context.emotion = result.emotion;

                // Send analysis as bot message if configured
                const emoji = result.score >= 70 ? '😊' : result.score >= 50 ? '😐' : result.score >= 30 ? '😕' : '😤';

                return {
                    success: true,
                    waitDelay: 1500,
                    message: `Sentiment: ${result.score}/100 ${emoji} - ${result.emotion}`,
                    data: result
                };
            } catch (error: any) {
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
        }

        case 'keyword': {
            const kwString = config.keywords || "";
            const keywords = kwString.split('\n').map((k: string) => k.trim()).filter(Boolean);
            const userMsg = context.lastUserMessage?.toLowerCase() || '';
            const triggered = keywords.length === 0 || keywords.some((kw: string) => userMsg.includes(kw.toLowerCase()));

            return {
                success: triggered,
                waitDelay: 300,
                message: triggered ? `Mot-clé détecté ✅` : `Aucun mot-clé trouvé ❌`,
                data: { keywordTriggered: triggered }
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
            const { url } = config;
            return {
                success: true,
                waitDelay: 1000,
                message: `API ${url || 'externe'} appelée (Succès simulé)`,
                data: { apiResponse: { status: 'ok' } }
            };
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
            const { channel, message } = config;
            return {
                success: true,
                waitDelay: 800,
                message: `Slack: message envoyé${channel ? ` sur ${channel}` : ''}`
            };
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
            const { productId, quantity } = config;
            return {
                success: true,
                waitDelay: 500,
                message: `Produit ${productId} ajouté au panier (x${quantity || 1})`,
                data: { cartUpdated: true }
            };
        }

        case 'checkout': {
            const { gateway, currency } = config;
            context.addMessage({
                sender: 'bot',
                text: `💳 Lien de paiement ${gateway || 'sécurisé'}:\nhttps://pay.example.com/checkout`,
            });
            return {
                success: true,
                waitDelay: 1000,
                message: `Checkout initié (${gateway}, ${currency})`
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
    return result.replace(/{{(.*?)}}/g, (match, key) => {
        const value = context[key.trim()];
        return value !== undefined ? String(value) : match;
    });
}
