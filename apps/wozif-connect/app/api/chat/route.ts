import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { ChatOpenAI } from "@langchain/openai";
import { DynamicTool, createAgent } from "langchain";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Node type definitions for workflow execution
interface WorkflowNode {
  id: number;
  type: string;
  name: string;
  config: string;
  x: number;
  y: number;
  connectedTo?: number;
}

interface NodeExecutionLog {
  nodeId: number;
  nodeType: string;
  nodeName: string;
  status: "success" | "error" | "skipped" | "warning";
  message: string;
  duration: number;
  waitDelay?: number;
  timestamp: string;
}

interface ExecutionContext {
  userMessage: string;
  sentiment?: "positive" | "neutral" | "negative";
  mood?: {
    emotion?: string;
    tone?: string;
    urgency?: string;
    language?: string;
    score?: number;
  };
  intent?: string;
  responses: string[];
  shouldContinue: boolean;
  keywordMatched?: boolean;
  cart: any[];
  orderStatus?: string;
  delayMs?: number;
  buttons?: string[];
  conditionMet?: boolean;
  logs: NodeExecutionLog[];
  translatedMessage?: string;
  originalMessage?: string;
  [key: string]: any;
}

// Sample products database
const PRODUCTS_DB = [
  { id: 1, name: "iPhone 15 Pro", price: 599000, emoji: "📱", stock: 50 },
  { id: 2, name: "MacBook Air M3", price: 899000, emoji: "💻", stock: 30 },
  { id: 3, name: "AirPods Pro 2", price: 149000, emoji: "🎧", stock: 100 },
  { id: 4, name: "Apple Watch Ultra", price: 450000, emoji: "⌚", stock: 25 },
  { id: 5, name: "iPad Pro M4", price: 750000, emoji: "📲", stock: 40 },
];

// Helper to add log entry
function addLog(
  context: ExecutionContext,
  node: WorkflowNode,
  status: "success" | "error" | "skipped" | "warning",
  message: string,
  duration: number,
  waitDelay?: number,
): void {
  context.logs.push({
    nodeId: node.id,
    nodeType: node.type,
    nodeName: node.name,
    status,
    message,
    duration,
    waitDelay,
    timestamp: new Date().toISOString(),
  });
}

// Execute a single node and return updated context
async function executeNode(
  node: WorkflowNode,
  context: ExecutionContext,
): Promise<ExecutionContext> {
  const startTime = Date.now();

  try {
    switch (node.type) {
      // ============ DÉCLENCHEURS ============
      case "whatsapp_message":
        addLog(
          context,
          node,
          "success",
          "Message reçu - workflow déclenché",
          Date.now() - startTime,
        );
        return { ...context, shouldContinue: true };

      case "new_contact":
        context.responses.push("👋 Bienvenue ! C'est votre première visite.");
        addLog(
          context,
          node,
          "success",
          "Nouveau contact détecté - message de bienvenue ajouté",
          Date.now() - startTime,
        );
        return { ...context, shouldContinue: true };

      case "keyword":
        const keywords = [
          "bonjour",
          "aide",
          "commande",
          "produit",
          "prix",
          "problème",
          "support",
          "acheter",
          "catalogue",
          "panier",
        ];
        const messageWords = context.userMessage.toLowerCase();
        const matchedKeyword = keywords.find((kw) => messageWords.includes(kw));

        if (!matchedKeyword) {
          context.responses.push("🔇 Message ignoré - aucun mot-clé détecté.");
          addLog(
            context,
            node,
            "warning",
            `Aucun mot-clé trouvé dans "${context.userMessage.slice(0, 30)}..."`,
            Date.now() - startTime,
          );
          return { ...context, shouldContinue: false, keywordMatched: false };
        }
        addLog(
          context,
          node,
          "success",
          `Mot-clé détecté: "${matchedKeyword}"`,
          Date.now() - startTime,
        );
        return { ...context, shouldContinue: true, keywordMatched: true };

      // ============ INTELLIGENCE IA ============
      case "sentiment":
        if (!process.env.OPENAI_API_KEY) {
          addLog(
            context,
            node,
            "error",
            "Clé API OpenAI manquante",
            Date.now() - startTime,
          );
          return { ...context, sentiment: "neutral" };
        }

        try {
          let cfg: any = {};
          try {
            cfg = JSON.parse(node.config);
          } catch (e) { }

          const systemPrompt = `Tu es un expert en psychologie client et analyse de sentiment.
Analyse le message de l'utilisateur et réponds UNIQUEMENT par un objet JSON avec les champs suivants:
- sentiment: (positive, neutral, negative)
- score: (0-100, 100 étant très positif)
${cfg.detectEmotions ? "- emotion: (joie, tristesse, colère, frustration, peur, surprise)" : ""}
${cfg.detectTone ? "- tone: (professionnel, décontracté, ironique, agressif, poli)" : ""}
${cfg.detectLanguage ? "- language: (le code de la langue ISO 2 lettres)" : ""}
${cfg.urgencyScale ? "- urgency: (faible, moyenne, haute, critique)" : ""}

${cfg.instructions ? `CONSIGNES SPÉCIFIQUES: ${cfg.instructions}` : ""}`;

          const sentimentResult = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: context.userMessage },
            ],
            response_format: { type: "json_object" },
          });

          const data = JSON.parse(
            sentimentResult.choices[0]?.message?.content || "{}",
          );

          addLog(
            context,
            node,
            "success",
            `Analyse émotionnelle : ${data.sentiment} (${data.emotion || "n/a"})`,
            Date.now() - startTime,
          );

          return {
            ...context,
            sentiment: data.sentiment || "neutral",
            mood: {
              emotion: data.emotion,
              tone: data.tone,
              urgency: data.urgency,
              language: data.language,
              score: data.score,
            },
          };
        } catch (e: any) {
          addLog(
            context,
            node,
            "error",
            `Erreur Analyse : ${e.message}`,
            Date.now() - startTime,
          );
          return { ...context, sentiment: "neutral" };
        }

      case "gpt_analyze":
        if (!process.env.OPENAI_API_KEY) {
          addLog(
            context,
            node,
            "error",
            "Clé API OpenAI manquante",
            Date.now() - startTime,
          );
          return { ...context, intent: "unknown" };
        }

        try {
          // Parse config for custom categories and output fields
          let analyzeConfig: any = {};
          try {
            analyzeConfig = JSON.parse(node.config || "{}");
          } catch (e) { }

          // Get custom categories from config
          let categoriesList = analyzeConfig.categories || analyzeConfig.aiInstructions || "";
          const typeValues = analyzeConfig.typeValues || "";

          // If custom categories are defined in typeValues (comma-separated), use them as priority
          if (typeValues && typeValues.length > 0) {
            categoriesList = typeValues.split(',').map((v: string) => v.trim()).join(', ');
          }

          // STRICT intent classification prompt - NO response generation
          // Build JSON schema based on enabled outputs
          const enabledFields = analyzeConfig.outputFields || ['type', 'urgency', 'autoResolvable', 'keywords'];
          const jsonSchema: any = {};
          if (enabledFields.includes('type')) {
            const typeOptions = typeValues ? typeValues.split(',').map((v: string) => v.trim()) : ['technique', 'facturation', 'compte', 'produit', 'autre'];
            jsonSchema.type = `string - Type d'intention parmi: ${typeOptions.join(', ')}`;
          }
          if (enabledFields.includes('urgency')) {
            jsonSchema.urgency = "number - Niveau d'urgence entre 1 et 5";
          }
          if (enabledFields.includes('autoResolvable')) {
            jsonSchema.autoResolvable = 'string - "oui" ou "non"';
          }
          if (enabledFields.includes('keywords')) {
            jsonSchema.keywords = 'array - Mots-clés extraits';
          }

          const fieldsDesc = Object.entries(jsonSchema).map(([key, desc]) => `- ${key}: ${desc}`).join('\n');

          const systemMsg = `Tu es un expert en analyse d'intention client. Analyse le message et retourne UNIQUEMENT un JSON avec les champs suivants:
${fieldsDesc}

${categoriesList ? `Voici les catégories d'intention à considérer en priorité:
${categoriesList}` : ""}

RÈGLES STRICTES:
1. Réponds UNIQUEMENT en JSON valide
2. NE JAMAIS répondre au message du client
3. Si aucune catégorie ne correspond, utilise 'autre'`;

          const intentResult = await openai.chat.completions.create({
            model: analyzeConfig.model || "gpt-4o-mini",
            messages: [
              { role: "system", content: systemMsg },
              { role: "user", content: `Analyse ce message: "${context.userMessage}"` },
            ],
            response_format: { type: "json_object" },
            temperature: analyzeConfig.temperature || 0.1,
          });

          const data = JSON.parse(intentResult.choices[0]?.message?.content || "{}");
          const intent = data.type || "autre";

          addLog(
            context,
            node,
            "success",
            `Intention détectée: ${intent}`,
            Date.now() - startTime,
          );

          // Inject raw data into context
          return {
            ...context,
            intent,
            urgency: data.urgency,
            autoResolvable: data.autoResolvable,
            keywords: data.keywords,
            analysisResults: data
          };
        } catch (e: any) {
          addLog(
            context,
            node,
            "error",
            `Erreur OpenAI GPT: ${e.message}`,
            Date.now() - startTime,
          );
          return { ...context, intent: "unknown" };
        }

      case "gpt_respond":
        if (!process.env.OPENAI_API_KEY) {
          context.responses.push("❌ Erreur: Clé API OpenAI non configurée.");
          addLog(
            context,
            node,
            "error",
            "Clé API OpenAI manquante - impossible de générer une réponse",
            Date.now() - startTime,
          );
          return context;
        }

        let cfgResp: any = {};
        try {
          cfgResp = JSON.parse(node.config);
        } catch (e) { }

        let systemPromptResp =
          cfgResp.system && cfgResp.system.length > 5
            ? cfgResp.system
            : `Tu es un assistant GPT professionnel pour une boutique en ligne. Réponds de manière concise (2-3 phrases max) en français.`;

        // Injection du contexte émotionnel
        if (context.mood || context.sentiment) {
          systemPromptResp += `\nCONTEXTE ÉMOTIONNEL ACTUEL:`;
          if (context.sentiment)
            systemPromptResp += `\n- Sentiment global: ${context.sentiment}`;
          if (context.mood?.emotion)
            systemPromptResp += `\n- Émotion détectée: ${context.mood.emotion}`;
          if (context.mood?.tone)
            systemPromptResp += `\n- Ton employé par le client: ${context.mood.tone}`;
          if (context.mood?.urgency)
            systemPromptResp += `\n- Niveau d'urgence: ${context.mood.urgency}`;

          if (cfgResp.moodInstructions) {
            systemPromptResp += `\n\nDIRECTIVES RÉACTIONNELLES (À SUIVRE IMPÉRATIVEMENT): ${cfgResp.moodInstructions}`;
          } else if (context.sentiment === "negative") {
            systemPromptResp += `\n\nIMPORTANT: Le client semble mécontent. Sois très empathique.`;
          }
        }

        if (context.intent) {
          systemPromptResp += `\nIntention du client : ${context.intent}.`;
        }

        try {
          const aiResult = await openai.chat.completions.create({
            model: cfgResp.model || "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPromptResp },
              { role: "user", content: context.userMessage },
            ],
            max_tokens: cfgResp.tokens || 200,
            temperature: cfgResp.creativity || 0.7,
          });
          const aiResponse =
            aiResult.choices[0]?.message?.content ||
            "Je n'ai pas pu générer une réponse GPT.";
          context.responses.push(aiResponse);
          addLog(
            context,
            node,
            "success",
            `Réponse GPT générée (${aiResponse.length} caractères)`,
            Date.now() - startTime,
          );
          return context;
        } catch (e: any) {
          context.responses.push(`❌ Erreur GPT: ${e.message}`);
          addLog(
            context,
            node,
            "error",
            `Erreur génération GPT: ${e.message}`,
            Date.now() - startTime,
          );
          return context;
        }

      case "ai_agent": {
        if (!process.env.OPENAI_API_KEY) {
          context.responses.push("❌ Erreur: Clé API OpenAI non configurée.");
          addLog(context, node, "error", "Clé API OpenAI manquante", Date.now() - startTime);
          return context;
        }

        let agentCfg: any = {};
        try {
          agentCfg = JSON.parse(node.config || "{}");
        } catch (e) { }

        // 1. Define Tools
        const tools = [
          new DynamicTool({
            name: "recherche_catalogue",
            description: "Recherche des produits dans le catalogue (iPhone, MacBook, etc.). Retourne les prix et stocks. Entrée: requête de recherche.",
            func: async (query) => {
              const results = PRODUCTS_DB.filter(p =>
                p.name.toLowerCase().includes(query.toLowerCase())
              );
              return results.length > 0 ? JSON.stringify(results) : "Aucun produit trouvé.";
            },
          }),
          new DynamicTool({
            name: "statut_commande",
            description: "Vérifie le statut d'une commande. Entrée: ID de la commande (#12345).",
            func: async (orderId) => {
              return `La commande ${orderId} est en cours de livraison. Arrivée prévue demain.`;
            },
          }),
        ];

        let contextInfo = "";

        // RAG Logic
        if (agentCfg.knowledgeBaseId) {
          try {
            const chunks = await prisma.knowledgeChunk.findMany({
              where: {
                document: { knowledgeBaseId: agentCfg.knowledgeBaseId },
                content: { contains: context.userMessage, mode: "insensitive" },
              },
              take: 5,
              select: { content: true },
            });
            if (chunks.length > 0) {
              contextInfo = "\n\nCONTEXTE BASE DE CONNAISSANCES:\n" +
                chunks.map((c: any) => `- ${c.content}`).join("\n");
            }
          } catch (e) { }
        }

        // 2. Persona & Prompt
        const personalityPresets: Record<string, string> = {
          Expert: "Sois précis, technique et professionnel.",
          Vendeur: "Sois persuasif, chaleureux et orienté vers la vente.",
          Support: "Sois patient, aidant et empathique.",
          Amical: "Sois relaxé, informel et utilise des emojis."
        };
        const personalityInstructions = personalityPresets[agentCfg.personality as string] || "";

        const systemPrompt = `Tu es ${agentCfg.agentName || "un assistant IA"}.
${agentCfg.instructions || "Réponds de manière utile."}
${personalityInstructions}
${agentCfg.strictMode ? "IMPORTANT: Réponds UNIQUEMENT via le contexte ou les outils fournis. Si absent, dis que tu ne sais pas." : ""}

${contextInfo}`;

        // 3. Create & Run LangChain Agent (v1.x style)
        try {
          const model = new ChatOpenAI({
            modelName: agentCfg.model || "gpt-4o-mini",
            temperature: agentCfg.temperature || 0.4,
            apiKey: process.env.OPENAI_API_KEY,
          });

          // In LangChain v1.x (ReactAgent), createAgent is the main entry point
          const agent = createAgent({
            model,
            tools,
            systemPrompt,
          });

          // Run the agent
          // @ts-ignore - messages might be expecting specific BaseMessage classes
          const result = await agent.invoke({
            messages: [{ role: "user", content: context.userMessage }]
          });

          // Extract response from result messages
          const lastMsg = result.messages[result.messages.length - 1];
          let aiResponse = "Aucune réponse générée.";

          if (typeof lastMsg?.content === "string") {
            aiResponse = lastMsg.content;
          } else if (Array.isArray(lastMsg?.content)) {
            aiResponse = lastMsg.content.map((c: any) => (typeof c === 'string' ? c : (c.text || ""))).join("");
          }

          context.responses.push(aiResponse);
          addLog(context, node, "success", `Agent LangChain (ReAct) a répondu`, Date.now() - startTime);
        } catch (e: any) {
          console.error("LangChain Error:", e);
          context.responses.push(`❌ Erreur Agent IA: ${e.message}`);
          addLog(context, node, "error", `Erreur Agent: ${e.message}`, Date.now() - startTime);
        }
        return context;
      }

      // ============ E-COMMERCE ============
      case "show_catalog":
        let cfgCat: any = {};
        try {
          cfgCat = JSON.parse(node.config);
        } catch (e) { }

        let catalogMsg = "📦 **Notre Catalogue:**\n";
        const selectedIds = cfgCat.selectedProducts || [];
        const productsToShow =
          selectedIds.length > 0
            ? PRODUCTS_DB.filter((p) => selectedIds.includes(p.id))
            : PRODUCTS_DB;

        productsToShow.forEach((p) => {
          catalogMsg += `${p.emoji} ${p.name} - ${p.price.toLocaleString()} FCFA\n`;
        });

        context.responses.push(catalogMsg);
        addLog(
          context,
          node,
          "success",
          `Catalogue affiché (${productsToShow.length} produits sélectionnés)`,
          Date.now() - startTime,
        );
        return context;

      case "add_to_cart":
        const productMention = context.userMessage.toLowerCase();
        const foundProduct = PRODUCTS_DB.find(
          (p) =>
            productMention.includes(p.name.toLowerCase()) ||
            productMention.includes(p.emoji),
        );

        if (foundProduct) {
          context.cart.push(foundProduct);
          context.responses.push(
            `✅ ${foundProduct.emoji} ${foundProduct.name} ajouté au panier ! (${foundProduct.price.toLocaleString()} FCFA)`,
          );
          addLog(
            context,
            node,
            "success",
            `Produit ajouté: ${foundProduct.name}`,
            Date.now() - startTime,
          );
        } else {
          const defaultProduct = PRODUCTS_DB[0];
          context.cart.push(defaultProduct);
          context.responses.push(
            `🛒 ${defaultProduct.emoji} ${defaultProduct.name} ajouté au panier !`,
          );
          addLog(
            context,
            node,
            "warning",
            `Aucun produit spécifique trouvé, ajout par défaut: ${defaultProduct.name}`,
            Date.now() - startTime,
          );
        }
        return context;

      case "order_status":
        const statuses = [
          "En préparation 📦",
          "Expédié 🚚",
          "En livraison 🏃",
          "Livré ✅",
        ];
        const randomStatus =
          statuses[Math.floor(Math.random() * statuses.length)];
        context.responses.push(
          `📋 Statut de votre commande: **${randomStatus}**\nNuméro de suivi: TRK-${Date.now().toString().slice(-8)}`,
        );
        addLog(
          context,
          node,
          "success",
          `Statut commande: ${randomStatus}`,
          Date.now() - startTime,
        );
        return context;

      case "calendar":
        const date = new Date();
        date.setDate(date.getDate() + 1); // Tomorrow
        const tomorrow = date.toLocaleDateString("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
        });
        const time = "14:30";

        context.responses.push(
          `📅 **Planification Connect**\n\nNous avons une disponibilité pour vous le **${tomorrow} à ${time}**.\n\nSouhaitez-vous confirmer ?`,
        );
        addLog(
          context,
          node,
          "success",
          "Créneau de rendez-vous suggéré",
          Date.now() - startTime,
        );
        return context;

      // ============ MESSAGES ============
      case "send_text":
        const textToSend = node.config || "Message vide";
        context.responses.push(textToSend);
        addLog(
          context,
          node,
          "success",
          `Texte envoyé: ${textToSend.slice(0, 20)}...`,
          Date.now() - startTime,
        );
        return context;

      case "send_image":
        const imageUrl =
          node.config ||
          "https://images.unsplash.com/photo-1611746872915-64382b5c76da";
        context.responses.push(`🖼️ [Image]\n${imageUrl}`);
        addLog(
          context,
          node,
          "success",
          "Image envoyée",
          Date.now() - startTime,
        );
        return context;

      case "send_document":
        context.responses.push(
          "📄 [Document PDF envoyé]\nCatalogue_Produits_2024.pdf",
        );
        addLog(
          context,
          node,
          "success",
          "Document PDF envoyé",
          Date.now() - startTime,
        );
        return context;

      case "send_location":
        context.responses.push(
          "📍 [Localisation envoyée]\nSiège Connect: 5.3484, -4.0305",
        );
        addLog(
          context,
          node,
          "success",
          "Localisation GPS envoyée",
          Date.now() - startTime,
        );
        return context;

      case "send_contact":
        context.responses.push("👤 [Fiche Contact envoyée]\nSupport Connect");
        addLog(
          context,
          node,
          "success",
          "Fiche contact VCard envoyée",
          Date.now() - startTime,
        );
        return context;

      case "telegram_message":
        context.responses.push("📲 [Telegram] Message reçu via Telegram.");
        addLog(
          context,
          node,
          "success",
          "Déclencheur Telegram actif",
          Date.now() - startTime,
        );
        return context;

      case "send_buttons":
        context.buttons = ["Voir Catalogue", "Mon Panier", "Aide"];
        context.responses.push(
          "Choisissez une option (WhatsApp):\n🔘 Voir Catalogue\n🔘 Mon Panier\n🔘 Aide",
        );
        addLog(
          context,
          node,
          "success",
          "Boutons simulés WhatsApp envoyés",
          Date.now() - startTime,
        );
        return context;

      case "tg_buttons":
        context.buttons = [
          "Produits 🛍️",
          "Nos Services 🛠️",
          "Contacter Humain 👤",
        ];
        context.responses.push("🤖 [Telegram] Clavier interactif envoyé.");
        addLog(
          context,
          node,
          "success",
          "Boutons interactifs Telegram envoyés",
          Date.now() - startTime,
        );
        return context;

      // ============ LOGIQUE ============
      case "condition":
        const hasPositiveSentiment = context.sentiment === "positive";
        const hasPurchaseIntent =
          context.intent?.includes("achat") ||
          context.intent?.includes("acheter");
        context.conditionMet = hasPositiveSentiment || hasPurchaseIntent;

        if (!context.conditionMet) {
          addLog(
            context,
            node,
            "warning",
            "Condition non remplie (sentiment négatif ou pas d'intention d'achat)",
            Date.now() - startTime,
          );
        } else {
          addLog(
            context,
            node,
            "success",
            "Condition remplie - continuer le flux principal",
            Date.now() - startTime,
          );
        }
        return context;

      case "delay":
        context.delayMs = 2000;
        addLog(
          context,
          node,
          "success",
          "Délai de 2000ms appliqué",
          Date.now() - startTime,
          2000,
        );
        return context;

      case "loop":
        addLog(
          context,
          node,
          "success",
          "Boucle exécutée",
          Date.now() - startTime,
        );
        return context;

      case "anti_ban":
        let minSec = 1;
        let maxSec = 5;

        try {
          const cfg = JSON.parse(node.config);
          minSec = cfg.min || 1;
          maxSec = cfg.max || 5;
        } catch (e) {
          // Fallback to defaults
        }

        const minDelay = minSec * 1000;
        const maxDelay = maxSec * 1000;
        const randomDelay =
          Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

        context.delayMs = randomDelay;
        addLog(
          context,
          node,
          "success",
          `Délai de sécurité : ${randomDelay}ms appliqué (Plage: ${minSec}s - ${maxSec}s)`,
          Date.now() - startTime,
          randomDelay,
        );
        return context;

      // ============ GROUPES ============
      case "create_group":
        const groupName = node.config || "Nouveau Groupe";
        context.responses.push(
          `👥 **Groupe Créé:** "${groupName}"\nVous êtes maintenant administrateur du groupe.`,
        );
        addLog(
          context,
          node,
          "success",
          `Groupe "${groupName}" créé avec succès`,
          Date.now() - startTime,
        );
        return context;

      case "add_participant":
        context.responses.push("➕ [Système] Nouveau membre ajouté au groupe.");
        addLog(
          context,
          node,
          "success",
          "Participant ajouté au groupe",
          Date.now() - startTime,
        );
        return context;

      case "remove_participant":
        context.responses.push(
          "➖ [Système] Un membre a été retiré du groupe.",
        );
        addLog(
          context,
          node,
          "success",
          "Participant retiré du groupe",
          Date.now() - startTime,
        );
        return context;

      case "group_announcement":
        const isAnnouncement = node.config === "on";
        context.responses.push(
          `📢 **Mode Annonce:** ${isAnnouncement ? "Activé" : "Désactivé"}\n${isAnnouncement ? "Seuls les admins peuvent envoyer des messages." : "Tout le monde peut écrire."}`,
        );
        addLog(
          context,
          node,
          "success",
          `Mode annonce ${isAnnouncement ? "activé" : "désactivé"}`,
          Date.now() - startTime,
        );
        return context;

      case "bulk_add_members":
        context.responses.push(
          "🚀 [Mass-Action] Processus d'ajout massif lancé pour 50 contacts...",
        );
        addLog(
          context,
          node,
          "success",
          "Ajout massif de participants initialisé",
          Date.now() - startTime,
        );
        return context;

      // ============ EXTRACTION & DATA ============
      case "get_group_members":
        context.responses.push(
          "📋 [Extraction] 142 membres extraits du groupe vers votre base de données.",
        );
        addLog(
          context,
          node,
          "success",
          "Extraction des membres réussie",
          Date.now() - startTime,
        );
        return context;

      case "google_maps_extract":
        context.responses.push(
          "📍 [G-Maps] 12 nouveaux prospects trouvés (Boucheries à Abidjan) avec numéros WhatsApp.",
        );
        addLog(
          context,
          node,
          "success",
          "Extraction Google Maps terminée",
          Date.now() - startTime,
        );
        return context;

      case "group_link_finder":
        context.responses.push(
          "🔗 [Finder] 5 liens de groupes WhatsApp publics trouvés sur le web.",
        );
        addLog(
          context,
          node,
          "success",
          "Recherche de liens terminée",
          Date.now() - startTime,
        );
        return context;

      case "chat_list_collector":
        context.responses.push(
          "💬 [System] Liste de 250 conversations récupérée.",
        );
        addLog(
          context,
          node,
          "success",
          "Collecte de la liste de chats réussie",
          Date.now() - startTime,
        );
        return context;

      case "web_email_extract":
        context.responses.push(
          "🌐 [Web-Scraper] 3 emails et 2 numéros extraits du site cible.",
        );
        addLog(
          context,
          node,
          "success",
          "Scraping web terminé",
          Date.now() - startTime,
        );
        return context;

      // ============ MARKETING PRO ============
      case "number_filter":
        context.responses.push(
          "🔍 [Filtre] Analyse de 100 numéros : 78 valides sur WhatsApp, 22 invalides.",
        );
        addLog(
          context,
          node,
          "success",
          "Filtrage des numéros terminé",
          Date.now() - startTime,
        );
        return context;

      case "whatsapp_warmer":
        context.responses.push(
          "🔥 [Warm-up] Session d'interaction automatique lancée pour augmenter le score de confiance.",
        );
        addLog(
          context,
          node,
          "success",
          "Mode chauffage de compte actif",
          Date.now() - startTime,
        );
        return context;

      case "mass_group_gen":
        context.responses.push(
          "🏗️ [Builder] 10 groupes créés automatiquement avec paramétrage complet.",
        );
        addLog(
          context,
          node,
          "success",
          "Génération massive de groupes terminée",
          Date.now() - startTime,
        );
        return context;

      // ============ NOUVEAUX DÉCLENCHEURS ============
      case "scheduled":
        const scheduledCfg = JSON.parse(node.config || "{}");
        const scheduleTime = scheduledCfg.time || "09:00";
        context.responses.push(
          `⏰ [Programmé] Workflow déclenché à ${scheduleTime}`,
        );
        addLog(
          context,
          node,
          "success",
          `Déclencheur programmé activé (${scheduleTime})`,
          Date.now() - startTime,
        );
        return { ...context, shouldContinue: true };

      case "webhook_trigger":
        const webhookCfg = JSON.parse(node.config || "{}");
        context.responses.push(
          `🔗 [Webhook] Requête reçue sur l'endpoint ${webhookCfg.endpoint || "/webhook"}`,
        );
        addLog(
          context,
          node,
          "success",
          "Webhook entrant traité",
          Date.now() - startTime,
        );
        return { ...context, shouldContinue: true };

      // ============ NOUVELLES FONCTIONS IA ============
      case "ai_translate":
        if (!process.env.OPENAI_API_KEY) {
          addLog(
            context,
            node,
            "error",
            "Clé API OpenAI manquante",
            Date.now() - startTime,
          );
          return context;
        }
        try {
          const translateCfg = JSON.parse(node.config || "{}");
          const targetLang = translateCfg.targetLanguage || "fr";
          const sourceLang = translateCfg.autoDetect ? "auto" : (translateCfg.sourceLanguage || "auto");

          const languageNames: Record<string, string> = {
            'fr': 'Français', 'en': 'English', 'es': 'Español', 'de': 'Deutsch',
            'pt': 'Português', 'it': 'Italiano', 'ar': 'العربية', 'zh': '中文',
            'ja': '日本語', 'ko': '한국어', 'ru': 'Русский', 'nl': 'Nederlands'
          };

          const translateResult = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `Tu es un traducteur professionnel. 
${sourceLang === 'auto' ? 'Détecte automatiquement la langue du message.' : `Le message est en ${languageNames[sourceLang] || sourceLang}.`}
Traduis le message suivant en ${languageNames[targetLang] || targetLang}.

RÈGLES:
1. Réponds UNIQUEMENT avec la traduction, rien d'autre
2. Conserve le ton et le style du message original
3. Si le message est déjà dans la langue cible, retourne-le tel quel`,
              },
              { role: "user", content: context.userMessage },
            ],
            max_tokens: 500,
          });

          const translated = translateResult.choices[0]?.message?.content || context.userMessage;

          // Silent translation - only store in context, no message visible
          context.translatedMessage = translated;
          context.originalMessage = context.userMessage;
          context.userMessage = translated; // Update userMessage for next blocks

          addLog(
            context,
            node,
            "success",
            `Traduit vers ${languageNames[targetLang] || targetLang}`,
            Date.now() - startTime,
          );
        } catch (e: any) {
          addLog(
            context,
            node,
            "error",
            `Erreur traduction: ${e.message}`,
            Date.now() - startTime,
          );
        }
        return context;

      case "ai_summarize":
        if (!process.env.OPENAI_API_KEY) {
          addLog(
            context,
            node,
            "error",
            "Clé API OpenAI manquante",
            Date.now() - startTime,
          );
          return context;
        }
        try {
          const summarizeCfg = JSON.parse(node.config || "{}");
          const style = summarizeCfg.style || "concis";
          const showInChat = summarizeCfg.showInChat === true;
          const maxLength = summarizeCfg.maxLength;

          const styleDescriptions: Record<string, string> = {
            'concis': 'Sois très bref, 1-2 phrases maximum',
            'detailed': 'Fais un résumé détaillé avec les points importants',
            'detaille': 'Fais un résumé détaillé avec les points importants',
            'points': 'Liste les points clés sous forme de bullet points (•)',
            'points-cles': 'Liste les points clés sous forme de bullet points (•)',
            'action': 'Identifie les actions à prendre et décisions prises'
          };

          const styleInstruction = styleDescriptions[style] || styleDescriptions['concis'];

          const summarizeResult = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `Tu es un expert en synthèse de conversations.
Crée un résumé de la conversation/message ci-dessous.

STYLE: ${styleInstruction}
${maxLength ? `LONGUEUR MAX: ${maxLength} mots environ` : ''}

RÈGLES:
1. Capture l'essentiel de ce qui a été dit/demandé
2. Identifie les besoins ou intentions du client
3. Note les informations importantes (produits, dates, montants mentionnés)
4. Sois objectif et factuel`,
              },
              { role: "user", content: context.userMessage },
            ],
            max_tokens: 300,
          });

          const summary = summarizeResult.choices[0]?.message?.content || "Résumé non disponible";

          // Store in context (silent by default)
          (context as any).summary = summary;

          // Only show in chat if explicitly requested
          if (showInChat) {
            context.responses.push(`📝 *Résumé de la conversation*\n\n${summary}`);
          }

          addLog(
            context,
            node,
            "success",
            `Résumé (${style}): ${summary.slice(0, 50)}...`,
            Date.now() - startTime,
          );
        } catch (e: any) {
          addLog(
            context,
            node,
            "error",
            `Erreur résumé: ${e.message}`,
            Date.now() - startTime,
          );
        }
        return context;

      // ============ NOUVEAUX BLOCS E-COMMERCE ============
      case "show_cart":
        if (context.cart.length === 0) {
          context.responses.push("🛒 Votre panier est vide.");
        } else {
          let cartMsg = "🛒 **Votre Panier:**\n";
          let total = 0;
          context.cart.forEach((item, i) => {
            cartMsg += `${i + 1}. ${item.emoji || "📦"} ${item.name} - ${item.price.toLocaleString()} FCFA\n`;
            total += item.price;
          });
          cartMsg += `\n**Total: ${total.toLocaleString()} FCFA**`;
          context.responses.push(cartMsg);
        }
        addLog(
          context,
          node,
          "success",
          `Panier affiché (${context.cart.length} articles)`,
          Date.now() - startTime,
        );
        return context;

      case "checkout":
        if (context.cart.length === 0) {
          context.responses.push(
            "❌ Impossible de passer commande - votre panier est vide.",
          );
          addLog(
            context,
            node,
            "warning",
            "Checkout échoué - panier vide",
            Date.now() - startTime,
          );
        } else {
          const total = context.cart.reduce((sum, item) => sum + item.price, 0);
          const orderId = `ORD-${Date.now().toString().slice(-8)}`;
          context.responses.push(
            `✅ **Commande confirmée!**\n\n📦 Numéro: ${orderId}\n💰 Total: ${total.toLocaleString()} FCFA\n\n💳 Lien de paiement envoyé par SMS.`,
          );
          addLog(
            context,
            node,
            "success",
            `Commande ${orderId} créée - ${total} FCFA`,
            Date.now() - startTime,
          );
          context.cart = []; // Vider le panier
        }
        return context;

      case "apply_promo":
        const promoCfg = JSON.parse(node.config || "{}");
        const promoCode = promoCfg.code || "PROMO10";
        const discount = promoCfg.discount || 10;
        context.responses.push(
          `🎁 Code promo **${promoCode}** appliqué! Réduction de ${discount}% sur votre commande.`,
        );
        addLog(
          context,
          node,
          "success",
          `Code promo ${promoCode} (-${discount}%) appliqué`,
          Date.now() - startTime,
        );
        return context;

      // ============ NOUVEAUX BLOCS MESSAGES ============
      case "send_audio":
        const audioCfg = JSON.parse(node.config || "{}");
        const audioUrl = audioCfg.url || "audio_message.ogg";
        context.responses.push(`🎵 [Message vocal envoyé]\n${audioUrl}`);
        addLog(
          context,
          node,
          "success",
          "Message audio envoyé",
          Date.now() - startTime,
        );
        return context;

      // ============ NOUVEAUX BLOCS LOGIQUE ============
      case "set_variable":
        const varCfg = JSON.parse(node.config || "{}");
        const varName = varCfg.name || "variable";
        const varValue = varCfg.value || "";
        (context as any)[`var_${varName}`] = varValue;
        addLog(
          context,
          node,
          "success",
          `Variable ${varName} définie`,
          Date.now() - startTime,
        );
        return context;

      case "random_choice":
        const choices = ["A", "B", "C"];
        const randomIdx = Math.floor(Math.random() * choices.length);
        const chosen = choices[randomIdx];
        context.responses.push(
          `🎲 Choix aléatoire: Branche **${chosen}** sélectionnée`,
        );
        addLog(
          context,
          node,
          "success",
          `Branche aléatoire: ${chosen}`,
          Date.now() - startTime,
        );
        return context;

      case "end_flow":
        context.responses.push("🏁 [Fin du workflow]");
        addLog(
          context,
          node,
          "success",
          "Workflow terminé",
          Date.now() - startTime,
        );
        return { ...context, shouldContinue: false };

      // ============ CRM & CONTACTS ============
      case "save_contact":
        const saveCfg = JSON.parse(node.config || "{}");
        context.responses.push(
          `👤 [CRM] Contact sauvegardé dans la base de données.`,
        );
        addLog(
          context,
          node,
          "success",
          "Contact enregistré dans le CRM",
          Date.now() - startTime,
        );
        return context;

      case "add_tag":
        const tagCfg = JSON.parse(node.config || "{}");
        const tagName = tagCfg.tag || "Client";
        context.responses.push(`🏷️ [CRM] Tag "${tagName}" ajouté au contact.`);
        addLog(
          context,
          node,
          "success",
          `Tag "${tagName}" ajouté`,
          Date.now() - startTime,
        );
        return context;

      case "remove_tag":
        const removeTagCfg = JSON.parse(node.config || "{}");
        const tagToRemove = removeTagCfg.tag || "Client";
        context.responses.push(
          `🏷️ [CRM] Tag "${tagToRemove}" retiré du contact.`,
        );
        addLog(
          context,
          node,
          "success",
          `Tag "${tagToRemove}" retiré`,
          Date.now() - startTime,
        );
        return context;

      case "update_contact":
        const updateCfg = JSON.parse(node.config || "{}");
        context.responses.push(
          `📝 [CRM] Informations du contact mises à jour.`,
        );
        addLog(
          context,
          node,
          "success",
          "Contact mis à jour",
          Date.now() - startTime,
        );
        return context;

      case "assign_agent":
        const agentCfg = JSON.parse(node.config || "{}");
        const agentName = agentCfg.agent || "Support Team";
        context.responses.push(
          `👨‍💼 [CRM] Conversation transférée à **${agentName}**. Un agent vous répondra sous peu.`,
        );
        addLog(
          context,
          node,
          "success",
          `Assigné à ${agentName}`,
          Date.now() - startTime,
        );
        return context;

      case "add_note":
        const noteCfg = JSON.parse(node.config || "{}");
        const noteText = noteCfg.note || "Note ajoutée";
        context.responses.push(
          `📝 [CRM] Note interne ajoutée: "${noteText.slice(0, 50)}..."`,
        );
        addLog(
          context,
          node,
          "success",
          "Note ajoutée au contact",
          Date.now() - startTime,
        );
        return context;

      // ============ NOTIFICATIONS ============
      case "notify_email":
        const emailCfg = JSON.parse(node.config || "{}");
        const emailTo = emailCfg.to || "team@company.com";
        context.responses.push(`📧 [Notification] Email envoyé à ${emailTo}`);
        addLog(
          context,
          node,
          "success",
          `Email envoyé à ${emailTo}`,
          Date.now() - startTime,
        );
        return context;

      case "notify_webhook":
        const webhookOutCfg = JSON.parse(node.config || "{}");
        const webhookUrl = webhookOutCfg.url || "https://webhook.site/...";
        context.responses.push(
          `🔗 [Webhook] Requête POST envoyée à ${webhookUrl}`,
        );
        addLog(
          context,
          node,
          "success",
          `Webhook appelé: ${webhookUrl}`,
          Date.now() - startTime,
        );
        return context;

      case "notify_slack":
        const slackCfg = JSON.parse(node.config || "{}");
        const slackChannel = slackCfg.channel || "#general";
        context.responses.push(
          `💬 [Slack] Message envoyé dans ${slackChannel}`,
        );
        addLog(
          context,
          node,
          "success",
          `Notification Slack → ${slackChannel}`,
          Date.now() - startTime,
        );
        return context;

      case "notify_internal":
        context.responses.push(
          `🔔 [Alerte] Notification interne créée dans le tableau de bord.`,
        );
        addLog(
          context,
          node,
          "success",
          "Alerte interne créée",
          Date.now() - startTime,
        );
        return context;

      // ============ RENDEZ-VOUS ============
      case "check_availability":
        const slots = [
          "Lundi 10h",
          "Mardi 14h",
          "Mercredi 16h",
          "Jeudi 09h",
          "Vendredi 11h",
        ];
        const availableSlots = slots.slice(0, 3).join("\n• ");
        context.responses.push(
          `📅 **Créneaux disponibles:**\n• ${availableSlots}\n\nRépondez avec le créneau souhaité.`,
        );
        addLog(
          context,
          node,
          "success",
          `${slots.length} créneaux affichés`,
          Date.now() - startTime,
        );
        return context;

      case "book_appointment":
        const bookCfg = JSON.parse(node.config || "{}");
        const appointmentDate = new Date();
        appointmentDate.setDate(appointmentDate.getDate() + 1);
        const formattedDate = appointmentDate.toLocaleDateString("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
        });
        context.responses.push(
          `✅ **Rendez-vous confirmé!**\n\n📅 ${formattedDate} à 14h00\n📍 Lieu: Bureau principal\n\nUn rappel vous sera envoyé 1h avant.`,
        );
        addLog(context, node, "success", "RDV réservé", Date.now() - startTime);
        return context;

      case "cancel_appointment":
        context.responses.push(
          `❌ **Rendez-vous annulé.**\n\nSouhaitez-vous reprogrammer?`,
        );
        addLog(context, node, "success", "RDV annulé", Date.now() - startTime);
        return context;

      case "send_reminder":
        const reminderCfg = JSON.parse(node.config || "{}");
        const reminderTime = reminderCfg.before || "1h";
        context.responses.push(
          `⏰ **Rappel:** Vous avez un rendez-vous dans ${reminderTime}. N'oubliez pas!`,
        );
        addLog(
          context,
          node,
          "success",
          `Rappel RDV envoyé (${reminderTime} avant)`,
          Date.now() - startTime,
        );
        return context;

      // ============ SÉCURITÉ AVANCÉE ============
      case "rate_limit":
        const rateCfg = JSON.parse(node.config || "{}");
        const maxMessages = rateCfg.max || 10;
        const perMinutes = rateCfg.minutes || 1;
        context.responses.push(
          `🚦 [Rate Limit] Limite: ${maxMessages} messages par ${perMinutes} minute(s)`,
        );
        addLog(
          context,
          node,
          "success",
          `Rate limit: ${maxMessages}/${perMinutes}min`,
          Date.now() - startTime,
        );
        return context;

      case "block_spam":
        const spamKeywords = ["crypto", "gratuit", "gagnez", "urgent"];
        const isSpam = spamKeywords.some((kw) =>
          context.userMessage.toLowerCase().includes(kw),
        );
        if (isSpam) {
          context.responses.push(
            `🚫 [Anti-Spam] Message bloqué - contenu suspect détecté.`,
          );
          addLog(
            context,
            node,
            "warning",
            "Message spam bloqué",
            Date.now() - startTime,
          );
          return { ...context, shouldContinue: false };
        }
        addLog(
          context,
          node,
          "success",
          "Message validé (pas de spam)",
          Date.now() - startTime,
        );
        return context;

      case "verify_human":
        const verifyCfg = JSON.parse(node.config || "{}");
        const question = verifyCfg.question || "Combien font 2 + 3 ?";
        context.responses.push(
          `🤖 **Vérification humaine**\n\n${question}\n\n(Répondez correctement pour continuer)`,
        );
        addLog(
          context,
          node,
          "success",
          "Question de vérification posée",
          Date.now() - startTime,
        );
        return context;

      // ============ AVANCÉ ============
      case "http_request":
        const httpCfg = JSON.parse(node.config || "{}");
        const method = httpCfg.method || "GET";
        const url = httpCfg.url || "https://api.example.com";
        context.responses.push(
          `🌐 [HTTP ${method}] Requête envoyée à ${url}\n📥 Réponse: { "status": "ok", "data": {...} }`,
        );
        addLog(
          context,
          node,
          "success",
          `${method} ${url} - 200 OK`,
          Date.now() - startTime,
        );
        return context;

      case "run_javascript":
        const jsCfg = JSON.parse(node.config || "{}");
        const code = jsCfg.code || 'return "Hello World";';
        context.responses.push(
          `⚡ [JavaScript] Code exécuté.\nRésultat: "Hello World"`,
        );
        addLog(
          context,
          node,
          "success",
          "Code JavaScript exécuté",
          Date.now() - startTime,
        );
        return context;

      case "google_sheets":
        const sheetsCfg = JSON.parse(node.config || "{}");
        const action = sheetsCfg.action || "read";
        const sheetName = sheetsCfg.sheet || "Contacts";
        context.responses.push(
          `📊 [Google Sheets] ${action === "read" ? "Lecture" : "Écriture"} dans "${sheetName}" effectuée.`,
        );
        addLog(
          context,
          node,
          "success",
          `Sheets: ${action} sur ${sheetName}`,
          Date.now() - startTime,
        );
        return context;

      case "database_query":
        const dbCfg = JSON.parse(node.config || "{}");
        const query = dbCfg.query || "SELECT * FROM users LIMIT 10";
        context.responses.push(
          `🗄️ [Database] Requête exécutée.\nRésultat: 10 lignes retournées.`,
        );
        addLog(
          context,
          node,
          "success",
          "Requête SQL exécutée",
          Date.now() - startTime,
        );
        return context;

      // ============ MESSAGES ADDITIONNELS ============
      case "send_document": {
        const docCfg = JSON.parse(node.config || "{}");
        context.responses.push(`📄 Document: ${docCfg.filename || "fichier"}\n${docCfg.caption || ""}`);
        addLog(context, node, "success", `Document envoyé: ${docCfg.filename}`, Date.now() - startTime);
        return context;
      }

      case "send_location": {
        const locCfg = JSON.parse(node.config || "{}");
        context.responses.push(`📍 *${locCfg.name || "Localisation"}*\n${locCfg.address || ""}`);
        addLog(context, node, "success", `Localisation envoyée: ${locCfg.name}`, Date.now() - startTime);
        return context;
      }

      case "send_contact": {
        const contactCfg = JSON.parse(node.config || "{}");
        context.responses.push(`👤 *Contact*\n${contactCfg.name}\n📞 ${contactCfg.phone}`);
        addLog(context, node, "success", `Contact partagé: ${contactCfg.name}`, Date.now() - startTime);
        return context;
      }

      case "send_audio": {
        const audioCfg = JSON.parse(node.config || "{}");
        context.responses.push(`🎵 ${audioCfg.asVoiceNote ? "Note vocale" : "Audio"} envoyé`);
        addLog(context, node, "success", "Audio envoyé", Date.now() - startTime);
        return context;
      }

      // ============ LOGIQUE ============
      case "loop": {
        const loopCfg = JSON.parse(node.config || "{}");
        addLog(context, node, "success", `Boucle ${loopCfg.loopType}: ${loopCfg.count} itérations`, Date.now() - startTime);
        return context;
      }

      case "set_variable": {
        const varCfg = JSON.parse(node.config || "{}");
        (context as any)[varCfg.variableName] = varCfg.value;
        addLog(context, node, "success", `Variable ${varCfg.variableName} = ${varCfg.value}`, Date.now() - startTime);
        return context;
      }

      case "random_choice": {
        const randCfg = JSON.parse(node.config || "{}");
        const choices = randCfg.choices || [];
        const selected = choices[Math.floor(Math.random() * choices.length)];
        addLog(context, node, "success", `Choix aléatoire: ${selected?.label || "option"}`, Date.now() - startTime);
        return context;
      }

      case "end_flow": {
        const endCfg = JSON.parse(node.config || "{}");
        if (endCfg.action === "message" && endCfg.message) {
          context.responses.push(endCfg.message);
        }
        addLog(context, node, "success", `Flux terminé (${endCfg.action})`, Date.now() - startTime);
        return { ...context, shouldContinue: false };
      }

      // ============ CRM ============
      case "update_contact": {
        const updCfg = JSON.parse(node.config || "{}");
        addLog(context, node, "success", `Contact mis à jour: ${updCfg.field} = ${updCfg.value}`, Date.now() - startTime);
        return context;
      }

      case "assign_agent": {
        const assignCfg = JSON.parse(node.config || "{}");
        addLog(context, node, "success", `Assigné à ${assignCfg.agentEmail || assignCfg.assignmentType}`, Date.now() - startTime);
        return context;
      }

      case "add_note": {
        const noteCfg = JSON.parse(node.config || "{}");
        addLog(context, node, "success", `Note ajoutée: ${noteCfg.note?.slice(0, 30)}...`, Date.now() - startTime);
        return context;
      }

      // ============ NOTIFICATIONS ============
      case "notify_email": {
        const emailCfg = JSON.parse(node.config || "{}");
        addLog(context, node, "success", `Email envoyé à ${emailCfg.to}: ${emailCfg.subject}`, Date.now() - startTime);
        return context;
      }

      case "notify_webhook": {
        const whCfg = JSON.parse(node.config || "{}");
        addLog(context, node, "success", `Webhook ${whCfg.method || "POST"} envoyé à ${whCfg.url}`, Date.now() - startTime);
        return context;
      }

      case "notify_slack": {
        const slackCfg = JSON.parse(node.config || "{}");
        addLog(context, node, "success", `Slack: message envoyé sur ${slackCfg.channel}`, Date.now() - startTime);
        return context;
      }

      case "notify_internal": {
        const intCfg = JSON.parse(node.config || "{}");
        addLog(context, node, "success", `Notification interne: ${intCfg.title}`, Date.now() - startTime);
        return context;
      }

      // ============ RENDEZ-VOUS ============
      case "cancel_appointment": {
        const cancelCfg = JSON.parse(node.config || "{}");
        addLog(context, node, "success", `RDV ${cancelCfg.appointmentId} annulé`, Date.now() - startTime);
        return context;
      }

      case "send_reminder": {
        const remCfg = JSON.parse(node.config || "{}");
        context.responses.push(`⏰ Rappel: votre ${remCfg.type || "rendez-vous"} est dans ${remCfg.beforeMinutes || 60} minutes`);
        addLog(context, node, "success", `Rappel ${remCfg.type} envoyé`, Date.now() - startTime);
        return context;
      }

      // ============ SÉCURITÉ ============
      case "rate_limit": {
        const rlCfg = JSON.parse(node.config || "{}");
        addLog(context, node, "success", `Rate limit: ${rlCfg.maxRequests}/${rlCfg.windowSeconds}s`, Date.now() - startTime);
        return context;
      }

      case "block_spam": {
        const spamCfg = JSON.parse(node.config || "{}");
        addLog(context, node, "success", `Anti-spam actif (${spamCfg.action})`, Date.now() - startTime);
        return context;
      }

      case "verify_human": {
        const verifCfg = JSON.parse(node.config || "{}");
        if (verifCfg.method === "question") {
          context.responses.push(`🔐 ${verifCfg.question || "Êtes-vous humain?"}`);
        }
        addLog(context, node, "success", `Vérification humaine (${verifCfg.method})`, Date.now() - startTime);
        return context;
      }

      // ============ E-COMMERCE ============
      case "add_to_cart": {
        const cartCfg = JSON.parse(node.config || "{}");
        addLog(context, node, "success", `Produit ${cartCfg.productId} ajouté (x${cartCfg.quantity || 1})`, Date.now() - startTime);
        return context;
      }

      case "order_status": {
        const orderCfg = JSON.parse(node.config || "{}");
        context.responses.push(`📦 Commande ${orderCfg.orderId || "#12345"}: En préparation`);
        addLog(context, node, "success", `Statut commande ${orderCfg.orderId}`, Date.now() - startTime);
        return context;
      }

      // ============ GROUPES WHATSAPP ============
      case "create_group": {
        const grpCfg = JSON.parse(node.config || "{}");
        addLog(context, node, "success", `Groupe créé: ${grpCfg.name}`, Date.now() - startTime);
        return context;
      }

      case "add_participant":
      case "remove_participant": {
        const partCfg = JSON.parse(node.config || "{}");
        const action = node.type === "add_participant" ? "ajouté" : "retiré";
        addLog(context, node, "success", `${partCfg.phoneNumber} ${action}`, Date.now() - startTime);
        return context;
      }

      case "bulk_add_members": {
        const bulkCfg = JSON.parse(node.config || "{}");
        addLog(context, node, "success", `Ajout en masse depuis ${bulkCfg.source}`, Date.now() - startTime);
        return context;
      }

      case "get_group_members":
      case "chat_list_collector": {
        const extCfg = JSON.parse(node.config || "{}");
        addLog(context, node, "success", `Extraction en ${extCfg.exportFormat || "CSV"}`, Date.now() - startTime);
        return context;
      }

      // ============ IA ADDITIONNELLE ============
      case "ai_translate": {
        const transCfg = JSON.parse(node.config || "{}");
        context.responses.push(`[Traduction ${transCfg.sourceLanguage} → ${transCfg.targetLanguage}]: ${context.userMessage}`);
        addLog(context, node, "success", `Traduit vers ${transCfg.targetLanguage}`, Date.now() - startTime);
        return context;
      }

      case "ai_summarize": {
        const sumCfg = JSON.parse(node.config || "{}");
        context.responses.push(`📝 Résumé: ${context.userMessage.slice(0, sumCfg.maxLength || 200)}...`);
        addLog(context, node, "success", `Résumé généré (${sumCfg.style})`, Date.now() - startTime);
        return context;
      }

      case "scheduled":
      case "webhook_trigger": {
        addLog(context, node, "success", `Déclencheur ${node.type} activé`, Date.now() - startTime);
        return context;
      }

      default:
        addLog(
          context,
          node,
          "error",
          `Type de bloc inconnu: ${node.type}`,
          Date.now() - startTime,
        );
        return context;
    }
  } catch (error: any) {
    addLog(
      context,
      node,
      "error",
      `Exception: ${error.message}`,
      Date.now() - startTime,
    );
    return context;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const nodes: WorkflowNode[] = body.nodes || [];
    const { message, conversationHistory = [] } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 },
      );
    }

    // NEW: Handle direct AI prompt (bypass workflow) if systemPrompt is provided
    if (nodes.length === 0 && body.systemPrompt) {
      if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json({
          success: false,
          error: "Clé API OpenAI non configurée",
          response: ""
        }, { status: 200 }); // Return 200 so client can parse JSON
      }

      try {
        // Utiliser les messages fournis si disponibles (pour l'historique), sinon construire
        let messages: Array<{ role: string; content: string }> = [];

        if (body.messages && Array.isArray(body.messages) && body.messages.length > 0) {
          // Utiliser les messages fournis (incluant l'historique)
          messages = body.messages;
        } else {
          // Construire les messages de base
          messages = [
            { role: "system", content: body.systemPrompt },
            { role: "user", content: message }
          ];
        }

        // Préparer les paramètres de la requête
        const requestParams: any = {
          model: body.model || "gpt-4o-mini",
          messages: messages,
          max_tokens: body.maxTokens || 500,
        };

        // Ajouter la température si fournie
        if (body.temperature !== undefined) {
          requestParams.temperature = body.temperature;
        }

        // Ajouter reasoning_effort pour les modèles o1
        if (body.reasoningEffort && (body.model?.includes('o1') || body.model?.includes('o3'))) {
          requestParams.reasoning_effort = body.reasoningEffort;
        }

        // Note: Les modèles o1 ne supportent pas la température, la retirer si c'est un modèle o1
        if (body.model?.includes('o1') || body.model?.includes('o3')) {
          delete requestParams.temperature;
        }

        const response = await openai.chat.completions.create(requestParams);

        return NextResponse.json({
          success: true,
          response: response.choices[0]?.message?.content || ""
        });
      } catch (error: any) {
        console.warn("[API/chat] OpenAI API error:", error.message);
        return NextResponse.json({
          success: false,
          error: error.message || "Erreur OpenAI",
          response: ""
        }, { status: 200 }); // Return 200 so client can parse JSON
      }
    }

    if (nodes.length === 0) {
      return NextResponse.json({
        success: true,
        response: "",
        executed: false,
        executedNodes: [],
        logs: ["[WARNING] Workflow vide! Ajoutez des blocs sur le canvas."],
      });
    }

    const hasTriggerNode = nodes.some((n: WorkflowNode) =>
      ["whatsapp_message", "keyword", "new_contact", "telegram_message", "webhook_trigger"].includes(n.type),
    );

    if (!hasTriggerNode) {
      return NextResponse.json({
        success: true,
        response: "",
        executed: false,
        executedNodes: [],
        logs: [
          "[WARNING] Déclencheur manquant! Votre workflow a besoin d'un point de départ.",
        ],
      });
    }

    // Initialize execution context
    let context: ExecutionContext = {
      userMessage: message,
      responses: [],
      shouldContinue: true,
      cart: [],
      logs: [],
    };

    // Sort nodes by X position to establish default sequence and find the first trigger
    const sortedNodes = [...nodes].sort(
      (a: WorkflowNode, b: WorkflowNode) => a.x - b.x,
    );
    const nodeMap = new Map(nodes.map((n: WorkflowNode) => [n.id, n]));

    // Find the starting trigger (the leftmost trigger)
    const startNode = sortedNodes.find((n: WorkflowNode) =>
      ["whatsapp_message", "keyword", "new_contact", "telegram_message", "webhook_trigger"].includes(n.type),
    );

    if (!startNode) {
      // Should not happen due to validation above, but safety first
      return NextResponse.json({
        success: true,
        response: "⚠️ **Déclencheur non trouvé!**",
        executed: false,
        executedNodes: [],
        logs: [],
      });
    }

    // Execution path following
    let currentNode: WorkflowNode | undefined = startNode;
    const visited = new Set<number>();

    while (currentNode && context.shouldContinue) {
      if (visited.has(currentNode.id)) break; // Prevent loops
      visited.add(currentNode.id);

      // Execute current node
      context = await executeNode(currentNode, context);

      // Determine next node
      let nextNode: WorkflowNode | undefined;

      if (currentNode.connectedTo === -1) {
        // Explicitly disconnected - stop flow
        nextNode = undefined;
      } else if (currentNode.connectedTo !== undefined) {
        // Explicit connection to a specific node
        nextNode = nodeMap.get(currentNode.connectedTo);
        if (!nextNode) {
          addLog(
            context,
            currentNode,
            "warning",
            `Lien brisé vers le nœud ID ${currentNode.connectedTo}`,
            0,
          );
        }
      } else {
        // Sequential default (next node in X-sorted list)
        const currentIndex = sortedNodes.findIndex(
          (n) => n.id === currentNode!.id,
        );
        if (currentIndex < sortedNodes.length - 1) {
          nextNode = sortedNodes[currentIndex + 1];
        }
      }

      currentNode = nextNode;
    }

    // Add skipped logs for nodes not reached
    for (const node of nodes) {
      if (!visited.has(node.id)) {
        addLog(context, node, "skipped", "Nœud non atteint par le flux", 0);
      }
    }

    // If no responses were generated, return empty response but log it
    if (context.responses.length === 0) {
      const warningMsg =
        "[WARNING] Aucune réponse générée! Ajoutez un bloc 'Réponse IA' ou 'Envoyer texte'.";
      return NextResponse.json({
        success: true,
        response: "",
        executed: true,
        executedNodes: context.logs,
        logs: [
          ...context.logs.map(
            (l) => `[${l.status.toUpperCase()}] ${l.nodeName}: ${l.message}`,
          ),
          warningMsg,
        ],
      });
    }

    // Combine all responses
    const finalResponse = context.responses.join("\n\n---\n\n");

    return NextResponse.json({
      success: true,
      response: finalResponse,
      executed: true,
      executedNodes: context.logs,
      logs: context.logs.map(
        (l) => `[${l.status.toUpperCase()}] ${l.nodeName}: ${l.message}`,
      ),
      analysis: {
        sentiment: context.sentiment,
        intent: context.intent,
        cartItems: context.cart.length,
      },
    });
  } catch (error: any) {
    console.error("Workflow Execution Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to execute workflow",
        response: "❌ Erreur lors de l'exécution du workflow.",
        executedNodes: [],
        logs: [`[ERROR] System: ${error.message}`],
      },
      { status: 500 },
    );
  }
}
