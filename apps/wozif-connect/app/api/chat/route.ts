import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

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
): void {
  context.logs.push({
    nodeId: node.id,
    nodeType: node.type,
    nodeName: node.name,
    status,
    message,
    duration,
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
          } catch (e) {}

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
          const systemMsg =
            node.config && node.config.length > 5
              ? `Tu es un expert en analyse d'intention GPT. Basé sur ces instructions : "${node.config}", analyse le message. Réponds en 2-3 mots max.`
              : "Analyse l'intention du client via GPT. Réponds en 2-3 mots max (ex: demande_produit, plainte, salutation, question_prix, confirmation_achat)";

          const intentResult = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemMsg },
              { role: "user", content: context.userMessage },
            ],
            max_tokens: 20,
          });
          const intent = intentResult.choices[0]?.message?.content?.trim();
          addLog(
            context,
            node,
            "success",
            `Intention détectée (GPT): ${intent}`,
            Date.now() - startTime,
          );
          return { ...context, intent: intent || "unknown" };
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
        } catch (e) {}

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
        } catch (e: any) {
          context.responses.push(`❌ Erreur GPT: ${e.message}`);
          addLog(
            context,
            node,
            "error",
            `Erreur génération GPT: ${e.message}`,
            Date.now() - startTime,
          );
        }
        return context;

      // ============ E-COMMERCE ============
      case "show_catalog":
        let cfgCat: any = {};
        try {
          cfgCat = JSON.parse(node.config);
        } catch (e) {}

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
          context.responses.push(
            "⚙️ Condition non remplie - branche alternative.",
          );
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
        context.responses.push("⏳ Pause de 2 secondes...");
        addLog(
          context,
          node,
          "success",
          "Délai de 2000ms appliqué",
          Date.now() - startTime,
        );
        return context;

      case "loop":
        context.responses.push("🔄 Boucle exécutée.");
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
        context.responses.push(
          `🛡️ Protection Anti-Ban : Pause aléatoire de ${(randomDelay / 1000).toFixed(1)}s appliquée.`,
        );
        addLog(
          context,
          node,
          "success",
          `Délai de sécurité : ${randomDelay}ms appliqué (Plage: ${minSec}s - ${maxSec}s)`,
          Date.now() - startTime,
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
          const translateResult = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `Traduis le message suivant en ${targetLang}. Réponds uniquement avec la traduction.`,
              },
              { role: "user", content: context.userMessage },
            ],
            max_tokens: 500,
          });
          const translated =
            translateResult.choices[0]?.message?.content || context.userMessage;
          context.responses.push(
            `🌐 [Traduction → ${targetLang.toUpperCase()}] ${translated}`,
          );
          addLog(
            context,
            node,
            "success",
            `Message traduit en ${targetLang}`,
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
          const summarizeResult = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "Résume la conversation/message en 2-3 phrases clés. Sois concis.",
              },
              { role: "user", content: context.userMessage },
            ],
            max_tokens: 150,
          });
          const summary =
            summarizeResult.choices[0]?.message?.content ||
            "Résumé non disponible";
          context.responses.push(`📋 [Résumé] ${summary}`);
          addLog(
            context,
            node,
            "success",
            "Conversation résumée",
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
        context.responses.push(`📝 Variable **${varName}** = "${varValue}"`);
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

    // VALIDATION: Check if workflow has minimum required structure
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
      ["whatsapp_message", "keyword", "new_contact"].includes(n.type),
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
      ["whatsapp_message", "keyword", "new_contact"].includes(n.type),
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
