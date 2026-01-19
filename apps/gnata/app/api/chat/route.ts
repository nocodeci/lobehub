import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages, tool, jsonSchema, stepCountIs } from 'ai';
import { prisma } from '@/lib/prisma';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages, chatId: existingChatId } = await req.json();

    // Helper to extract text from messages (handles both content and parts)
    const getTextContent = (msg: any): string => {
        if (typeof msg.content === 'string' && msg.content) return msg.content;
        if (Array.isArray(msg.parts)) {
            return msg.parts
                .filter((p: any) => p.type === 'text')
                .map((p: any) => p.text)
                .join('');
        }
        return "";
    };

    // --- PROACTIVE SAVE: Create chat and save user message BEFORE streaming ---
    // This ensures the conversation shows up in the sidebar immediately
    try {
        const firstMsgContent = getTextContent(messages[0]) || "Nouvelle Conversation";
        if (existingChatId) {
            await prisma.gnataChat.upsert({
                where: { id: existingChatId },
                update: { updatedAt: new Date() },
                create: {
                    id: existingChatId,
                    title: firstMsgContent.slice(0, 50) || "Nouvelle Conversation",
                    icon: "zap",
                }
            });

            const lastUserMsg = messages[messages.length - 1];
            if (lastUserMsg && (lastUserMsg.role === 'user' || (lastUserMsg as { sender?: string }).sender === 'user')) {
                await prisma.gnataMessage.create({
                    data: {
                        chatId: existingChatId,
                        role: 'user',
                        content: getTextContent(lastUserMsg),
                    }
                });
            }
        }
    } catch (e) {
        console.error("Proactive save error:", e);
    }

    const result = await streamText({
        model: openai('gpt-4o'),
        system: `Tu es Gnata AI, un assistant "Vibe Coder" expert et commercial.
    Ton but est de transformer l'idée du client en un site web professionnel prêt en moins de 2 heures.
    
    Ton : Professionnel, enthousiaste, persuasif et ultra-efficace.
    Langue : Français.
    
    Processus de vente obligatoire :
    1. **Clarification (Phase 1)** : Pose des questions courtes une par une sur le projet (nom, couleurs, logo, fonctionnalités). Si le client n'a pas beaucoup de détails, passe rapidement à la suite. Utilise l'outil "requestLogo" si le client a un logo.
    2. **Offre et Validation (Phase 2)** : Une fois les besoins de base compris, propose la création du site pour un tarif commençant à **30.000 F**. Insiste sur la livraison en **moins de 2 heures**. Demande au client de valider sa commande.
    3. **Paiement (Phase 3)** : Dès que le client valide ("OK", "Je valide", "On lance"), utilise OBLIGATOIREMENT l'outil \`createPaymentLink\` pour générer un lien de paiement. Affiche ce lien au client pour confirmer la commande.
    4. **Confirmation (Phase 4)** : Quand le client dit qu'il a payé ("C'est fait", "J'ai payé"), utilise l'outil \`verifyPayment\` avec l'ID du lien que tu as généré. Si le statut est SUCCESS, confirme la réception et dis au client que la création commence immédiatement.
    
    Règles d'or :
    - **INTERDICTION ABSOLUE** : Ne mentionne jamais de termes techniques comme "Next.js", "TailwindCSS", "Shadcn UI", "Supabase" ou toute autre technologie. Le client ne doit pas savoir comment c'est fait, seulement que c'est prêt en 2 heures.
    - Reste focalisé uniquement sur le résultat visuel, le prix et la rapidité.
    - Dès que tu sens que le client est prêt, passe à la validation de la commande à 30.000 F.
    - Quand le client valide, NE DIS PAS juste "Voici le lien", EXÉCUTE l'outil \`createPaymentLink\` avec le montant (30000) et le titre du projet.
    - Quand le client dit avoir payé, VÉRIFIE TOUJOURS avec \`verifyPayment\`. Ne fais pas confiance aveuglément.

    Info contextuelle : AfriFlow est notre partenaire de paiement sécurisé.`,
        messages: await convertToModelMessages(messages),
        stopWhen: stepCountIs(5),
        tools: {
            requestLogo: tool({
                description: "Demande à l'utilisateur d'uploader son logo lorsqu'il est prêt.",
                inputSchema: jsonSchema({
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: "Le message d'accompagnement pour la demande d'upload."
                        },
                    },
                    required: ['message'],
                }),
                execute: async () => {
                    return { success: true, message: "Interface d'upload affichée." };
                },
            }),
            createPaymentLink: tool({
                description: "Génère un lien de paiement AfriFlow pour valider la commande.",
                inputSchema: jsonSchema({
                    type: 'object',
                    properties: {
                        title: { type: 'string', description: "Le nom du projet ou du service (ex: 'Site Vitrine - Projet X')." },
                        amount: { type: 'number', description: "Le montant de la transaction en FCFA (ex: 30000)." },
                        description: { type: 'string', description: "Description courte." },
                        customerName: { type: 'string', description: "Nom du client (optionnel)." },
                    },
                    required: ['title', 'amount'],
                }),
                execute: async ({ title, amount, description, customerName }) => {
                    try {
                        const apiUrl = process.env.AFRIFLOW_API_URL || 'http://localhost:3000/api';
                        const secretKey = process.env.AFRIFLOW_SECRET_KEY;
                        const appId = process.env.AFRIFLOW_APP_ID;

                        if (!secretKey || !appId) {
                            throw new Error("Missing AfriFlow configuration");
                        }

                        const payload = {
                            applicationId: appId,
                            title: title,
                            description: description || `Payment for ${title}`,
                            amount: parseFloat(amount.toString()),
                            currency: "XOF",
                            type: "one_time",
                            metadata: {
                                customerName,
                                source: "Gnata AI"
                            }
                        };

                        const res = await fetch(`${apiUrl}/v1/payment-links`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${secretKey}`
                            },
                            body: JSON.stringify(payload)
                        });

                        const data = await res.json();

                        if (!res.ok) throw new Error(data.error || "Payment generation failed at Provider");

                        return {
                            success: true,
                            paymentUrl: data.url,
                            paymentId: data.id,
                            message: `Lien de paiement généré pour ${amount} FCFA.`
                        };
                    } catch (error: any) {
                        console.error("Tool execution failed (createPaymentLink):", error);
                        return { success: false, error: "Impossible de générer le lien de paiement pour le moment." };
                    }
                }
            }),
            verifyPayment: tool({
                description: "Vérifie le statut d'un paiement AfriFlow via son ID.",
                inputSchema: jsonSchema({
                    type: 'object',
                    properties: {
                        paymentId: { type: 'string', description: "L'ID du lien de paiement (retourné par createPaymentLink)." }
                    },
                    required: ['paymentId']
                }),
                execute: async ({ paymentId }) => {
                    try {
                        const apiUrl = process.env.AFRIFLOW_API_URL || 'http://localhost:3000/api';
                        const secretKey = process.env.AFRIFLOW_SECRET_KEY;

                        const res = await fetch(`${apiUrl}/v1/payment-links/${paymentId}/check`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${secretKey}`
                            }
                        });

                        const data = await res.json();

                        if (!res.ok) throw new Error(data.error || "Verification failed");

                        if (data.status === 'SUCCESS' || data.paid === true) {
                            return {
                                success: true,
                                paid: true,
                                message: "Paiement confirmé avec succès !"
                            };
                        } else {
                            return {
                                success: true,
                                paid: false,
                                message: "Le paiement n'est pas encore validé. Statut actuel : " + (data.status || 'En attente')
                            };
                        }
                    } catch (error: any) {
                        console.error("Tool execution failed (verifyPayment):", error);
                        return { success: false, error: "Erreur lors de la vérification du paiement." };
                    }
                }
            })
        },
        onFinish: async ({ text, toolCalls, toolResults }) => {
            try {
                if (!existingChatId) return;

                // Save AI response
                await prisma.gnataMessage.create({
                    data: {
                        chatId: existingChatId,
                        role: 'assistant',
                        content: text,
                        toolInvocations: toolCalls || toolResults ? JSON.parse(JSON.stringify({ toolCalls, toolResults })) : undefined,
                    }
                });

                console.log(`Saved AI response to DB: ${existingChatId}`);
            } catch (error) {
                console.error("Failed to save AI response to DB:", error);
            }
        }
    });

    return result.toUIMessageStreamResponse({
        originalMessages: messages,
    });
}
