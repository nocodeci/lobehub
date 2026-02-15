import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages, tool, jsonSchema, stepCountIs } from 'ai';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const userName = session?.user?.name || "Client Gnata";
    const userEmail = session?.user?.email || "";
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
            await (prisma as any).gnataChat.upsert({
                where: { id: existingChatId },
                update: {
                    updatedAt: new Date(),
                    userId: userId || null
                },
                create: {
                    id: existingChatId,
                    userId: userId || null,
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
        system: `Tu es Gnata, une plateforme de conciergerie digitale où une équipe d'experts "Vibe Coders" (humains) conçoit des sites web ultra-rapides.
    Ton but est de transformer l'idée du client en un site web professionnel prêt en un temps record.
    
    Ton : Professionnel, enthousiaste, persuasif et ultra-efficace.
    Langue : Français.

    Grille Tarifaire (NE PAS donner la grille complète au client, l'utiliser pour calculer le prix) :
    1. Landing Page : 14 900 FCFA (Livraison < 2h)
    2. Portfolio : 19 900 FCFA (Livraison < 2h)
    3. Site Vitrine : 34 900 FCFA (Livraison < 2h)
    4. E-commerce : 59 900 FCFA (Livraison ~2h)
    5. SaaS / Web App : Dès 450 000 FCFA (Délai : 1 mois)
    6. App Mobile : Dès 750 000 FCFA (Délai : 1 mois)

    Règles de Tarification Dynamique :
    - Écoute ce que le client demande et donne-lui le prix correspondant.
    - Si le client demande des fonctionnalités supplémentaires (ex: un blog sur une landing page, un système de chat sur un site vitrine), augmente légèrement le prix de base.
    - FORMULE PSYCHOLOGIQUE : Explique toujours au client : "Le prix normal pour ce type de site est de [Prix de base] FCFA, mais avec l'ajout de [Fonctionnalité demandée], le tarif final est de [Nouveau Prix] FCFA."
    - CAP E-COMMERCE : Le prix de base est de 59 900 FCFA. Même avec des extras, essaie de rester proche de ce montant en expliquant bien que c'est une offre exceptionnelle.
    - Pour les projets complexes (SaaS, App Mobile), le délai est d'un mois car cela demande une architecture robuste.

    Spécificités E-commerce :
    - Pour tout site e-commerce, demande OBLIGATOIREMENT si le client souhaite :
        1. Paiement à la Livraison (Cash on Delivery).
        2. Paiement en Ligne (Mobile Money & Cartes locaux).
        3. Ou les deux.
    - Si le client veut le paiement en ligne, présente fièrement notre solution intégrée "AfriFlow" qui permet d'accepter tous les moyens de paiement locaux en Afrique de manière sécurisée.
    
    Processus de vente obligatoire :
    1. **Clarification (Phase 1)** : Pose des questions courtes une par une pour bien cerner le projet :
        - Quel est le but précis du site ? (Vendre ? Présenter un portfolio ? Informer ?)
        - Quel nom, quelles couleurs et as-tu un logo ? (Utilise OBLIGATOIREMENT l'outil "requestLogo" s'il a un logo).
        - OBLIGATOIRE : Demande s'il a des images spécifiques à intégrer (photos de produits, réalisations, photos de lui). (Utilise OBLIGATOIREMENT l'outil "requestImages" s'il a des images).
        Note : Ne pose pas trop de questions, sois efficace mais assure-toi que l'équipe de Vibe Coders aura assez d'éléments pour bosser.
    2. **Offre et Validation (Phase 2)** : Une fois les besoins de base compris, propose le tarif correspondant à la demande. Insiste sur la livraison ultra-rapide par un expert humain. Demande au client de valider sa commande.
    3. **Paiement (Phase 3)** : Dès que le client valide ("OK", "Je valide", "On lance"), utilise OBLIGATOIREMENT l'outil \`createPaymentLink\` pour générer un lien de paiement. Les informations du client (nom, email) sont automatiquement récupérées depuis son compte connecté.
    4. **Confirmation (Phase 4)** : Quand le client dit qu'il a payé ("C'est fait", "J'ai payé"), utilise l'outil \`verifyPayment\` avec l'ID du lien que tu as généré. Si le statut est SUCCESS, confirme la réception et annonce fièrement qu'un expert développeur vient de prendre la main et a commencé la création immédiate du site.
    
    Règles d'or :
    - **IMPORTANT** : Ne dis jamais que tu es une intelligence artificielle qui génère le site. Tu es l'interface de Gnata qui connecte le client à son développeur expert.
    - **INTERDICTION ABSOLUE** : Ne mentionne jamais de termes techniques comme "Next.js", "TailwindCSS", "Shadcn UI", "Supabase" ou toute autre technologie. Le client ne doit pas savoir comment c'est fait, seulement que c'est codé par un pro et prêt en 2 heures.
    - Reste focalisé uniquement sur le résultat visuel, le prix et la rapidité.
    - Dès que tu sens que le client est prêt, passe à la validation de la commande au tarif que tu as calculé.
    - Quand le client valide, NE DIS PAS juste "Voici le lien", EXÉCUTE l'outil \`createPaymentLink\` avec le montant exact calculé et le titre du projet.
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
                    return { success: true, message: "Interface d'upload de logo affichée." };
                },
            }),
            requestImages: tool({
                description: "Demande à l'utilisateur d'uploader ses images (produits, réalisations, etc.) lorsqu'il en mentionne l'existence.",
                inputSchema: jsonSchema({
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: "Le message pour inviter l'utilisateur à uploader ses images."
                        },
                    },
                    required: ['message'],
                }),
                execute: async () => {
                    return { success: true, message: "Interface d'upload d'images affichée." };
                },
            }),
            createPaymentLink: tool({
                description: "Génère un lien de paiement AfriFlow pour valider la commande. Les informations du client sont automatiquement récupérées depuis sa session.",
                inputSchema: jsonSchema({
                    type: 'object',
                    properties: {
                        title: { type: 'string', description: "Le nom du projet ou du service (ex: 'Site E-commerce Cosmétiques')." },
                        amount: { type: 'number', description: "Le montant de la transaction en FCFA (ex: 59900)." },
                        description: { type: 'string', description: "Description du projet." },
                    },
                    required: ['title', 'amount'],
                }),
                execute: async ({ title, amount, description }) => {
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
                                customerName: userName,
                                customerEmail: userEmail,
                                chatId: existingChatId,
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

                        // Create project IMMEDIATELY when payment link is generated
                        try {
                            const year = new Date().getFullYear();
                            const count = await prisma.gnataProject.count();
                            const reference = `GNATA-${year}-${String(count + 1).padStart(4, '0')}`;

                            // Determine project type from title
                            let projectType: 'ECOMMERCE' | 'PORTFOLIO' | 'LANDING' | 'BLOG' | 'RESTAURANT' | 'CUSTOM' = 'CUSTOM';
                            const titleLower = title.toLowerCase();
                            if (titleLower.includes('e-commerce') || titleLower.includes('ecommerce') || titleLower.includes('boutique') || titleLower.includes('cosmétique')) {
                                projectType = 'ECOMMERCE';
                            } else if (titleLower.includes('portfolio')) {
                                projectType = 'PORTFOLIO';
                            } else if (titleLower.includes('landing') || titleLower.includes('vitrine')) {
                                projectType = 'LANDING';
                            } else if (titleLower.includes('blog')) {
                                projectType = 'BLOG';
                            } else if (titleLower.includes('restaurant')) {
                                projectType = 'RESTAURANT';
                            }

                            await prisma.gnataProject.create({
                                data: {
                                    reference,
                                    name: title,
                                    description: description || `Projet créé via Gnata AI`,
                                    type: projectType,
                                    priority: 'NORMAL',
                                    requirements: [],
                                    clientName: userName,
                                    clientEmail: userEmail,
                                    price: parseFloat(amount.toString()),
                                    status: 'PENDING', // Waiting for payment
                                    chatId: existingChatId || null,
                                    externalPaymentId: data.id,
                                }
                            });

                            console.log(`Created Gnata project (PENDING): ${reference} - Payment ID: ${data.id}`);
                        } catch (projectError) {
                            console.error("Failed to create project:", projectError);
                        }

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
                            // Update project status to PAID when payment is confirmed
                            try {
                                const updatedProject = await prisma.gnataProject.updateMany({
                                    where: { externalPaymentId: paymentId },
                                    data: { status: 'PAID' }
                                });

                                if (updatedProject.count > 0) {
                                    console.log(`Updated Gnata project to PAID for payment: ${paymentId}`);
                                } else {
                                    console.log(`No project found for payment ID: ${paymentId}, creating new one...`);
                                    // Fallback: create project if it doesn't exist
                                    const year = new Date().getFullYear();
                                    const count = await prisma.gnataProject.count();
                                    const reference = `GNATA-${year}-${String(count + 1).padStart(4, '0')}`;

                                    await prisma.gnataProject.create({
                                        data: {
                                            reference,
                                            name: data.title || "Nouveau Projet Gnata",
                                            description: data.description || "Projet créé via Gnata AI",
                                            type: 'CUSTOM',
                                            priority: 'NORMAL',
                                            requirements: [],
                                            clientName: data.metadata?.customerName || "Client Gnata",
                                            clientEmail: data.metadata?.customerEmail || "",
                                            price: data.amount || 30000,
                                            status: 'PAID',
                                            chatId: existingChatId || null,
                                            externalPaymentId: paymentId,
                                        }
                                    });
                                    console.log(`Created Gnata project (PAID): ${reference}`);
                                }
                            } catch (projectError) {
                                console.error("Failed to update/create project:", projectError);
                            }

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
