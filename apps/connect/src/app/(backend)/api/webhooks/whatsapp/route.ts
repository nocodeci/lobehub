import { NextRequest, NextResponse } from 'next/server';

import { getServerDB } from '@/database/core/db-adaptor';
import { checkCredits, deductCredits } from '@/libs/subscription/credits';
import { agents, userSettings } from '@lobechat/database/schemas';
import { and, eq, isNotNull, like, ne, sql } from 'drizzle-orm';

// WhatsApp Bridge webhook endpoint
// Receives incoming WhatsApp messages and triggers the appropriate agent to respond

interface WhatsAppIncomingMessage {
    chat_jid: string;
    content: string;
    filename?: string;
    is_from_me: boolean;
    media_type?: string; // 'image' | 'audio' | 'video' | 'document'
    message_id?: string;
    sender: string;
    timestamp: string;
}

interface WhatsAppWebhookRequest {
    data: WhatsAppIncomingMessage;
    event: 'message' | 'status';
    sessionId?: string; // ID de la session/compte WhatsApp
}

interface Message {
    Content: string;
    Filename: string;
    IsFromMe: boolean;
    MediaType: string;
    Sender: string;
    Time: string;
}

const DEFAULT_WHATSAPP_BRIDGE_URL = process.env.WHATSAPP_BRIDGE_URL || 'http://localhost:8080';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
// SearXNG is accessible via Docker network or direct IP
const SEARXNG_URL = process.env.SEARXNG_URL || 'http://localhost:8888';
const OPRIEL_BASE_URL = 'https://opriel.com';

const resolveBridgeUrlFromRequest = (req: NextRequest): string => {
    try {
        const { searchParams } = req.nextUrl;
        const bridgeUrl = searchParams.get('bridgeUrl');
        const result = bridgeUrl || DEFAULT_WHATSAPP_BRIDGE_URL;

        // Validate the URL is a string, not an object
        if (typeof result !== 'string') {
            console.error('[WhatsApp Webhook] Invalid bridgeUrl type:', typeof result, result);
            return DEFAULT_WHATSAPP_BRIDGE_URL;
        }

        console.log('[WhatsApp Webhook] Using bridge URL:', result);
        return result;
    } catch (error) {
        console.error('[WhatsApp Webhook] Error resolving bridge URL:', error);
        return DEFAULT_WHATSAPP_BRIDGE_URL;
    }
};
/**
 * Send a message via WhatsApp Bridge
 */
async function sendWhatsAppMessage(
    bridgeUrl: string,
    recipient: string,
    message: string,
    sessionId?: string
): Promise<boolean> {
    try {
        // Validate bridgeUrl is a proper string URL
        if (typeof bridgeUrl !== 'string' || !bridgeUrl.startsWith('http')) {
            console.error('[WhatsApp Webhook] Invalid bridgeUrl in sendWhatsAppMessage:', typeof bridgeUrl, bridgeUrl);
            return false;
        }

        // Build URL with sessionId if provided
        let url = `${bridgeUrl}/api/send`;
        if (sessionId) {
            url += `?sessionId=${encodeURIComponent(sessionId)}`;
        }
        console.log('[WhatsApp Webhook] Sending message to:', url, 'recipient:', recipient, 'sessionId:', sessionId || 'default');

        const response = await fetch(url, {
            body: JSON.stringify({
                message,
                recipient,
            }),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[WhatsApp Webhook] Failed to send message:', errorText);
            return false;
        }

        return true;
    } catch (error) {
        console.error('[WhatsApp Webhook] Error sending message:', error);
        return false;
    }
}

/**
 * Download media from WhatsApp Bridge via /api/download
 * Returns the local file path on the bridge server
 */
async function downloadMediaFromBridge(
    bridgeUrl: string,
    chatJid: string,
    messageId: string,
    sessionId?: string
): Promise<{ filename: string; mediaType: string; path: string } | null> {
    try {
        let url = `${bridgeUrl}/api/download`;
        if (sessionId) {
            url += `?sessionId=${encodeURIComponent(sessionId)}`;
        }

        const response = await fetch(url, {
            body: JSON.stringify({ chat_jid: chatJid, message_id: messageId }),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
        });

        if (!response.ok) {
            console.error('[WhatsApp Webhook] Failed to download media:', await response.text());
            return null;
        }

        const data = await response.json();
        if (!data.success) {
            console.error('[WhatsApp Webhook] Media download unsuccessful:', data.message);
            return null;
        }

        return { filename: data.filename, mediaType: data.message, path: data.path };
    } catch (error) {
        console.error('[WhatsApp Webhook] Error downloading media:', error);
        return null;
    }
}

/**
 * Read file from bridge server as base64
 * The bridge serves files from its local filesystem
 */
async function readMediaFileAsBase64(
    bridgeUrl: string,
    filePath: string,
    sessionId?: string
): Promise<string | null> {
    try {
        // Use the bridge's file serving endpoint
        let url = `${bridgeUrl}/api/file?path=${encodeURIComponent(filePath)}`;
        if (sessionId) {
            url += `&sessionId=${encodeURIComponent(sessionId)}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
            console.error('[WhatsApp Webhook] Failed to read file:', response.status);
            return null;
        }

        const buffer = await response.arrayBuffer();
        return Buffer.from(buffer).toString('base64');
    } catch (error) {
        console.error('[WhatsApp Webhook] Error reading media file:', error);
        return null;
    }
}

/**
 * Analyze an image using GPT-4o Vision API
 */
async function analyzeImageWithVision(
    imageBase64: string,
    mimeType: string,
    userCaption: string
): Promise<string | null> {
    if (!OPENAI_API_KEY) return null;

    try {
        console.log('[WhatsApp Webhook] Analyzing image with GPT-4o Vision...');

        const messages: any[] = [
            {
                content: 'Tu es un assistant IA qui analyse les images envoyées par WhatsApp. Décris le contenu de l\'image de manière claire et concise en français. Si l\'utilisateur a ajouté un message avec l\'image, réponds en tenant compte de ce message.',
                role: 'system',
            },
            {
                content: [
                    {
                        image_url: { url: `data:${mimeType};base64,${imageBase64}` },
                        type: 'image_url',
                    },
                    ...(userCaption ? [{ text: userCaption, type: 'text' }] : [{ text: 'Décris cette image.', type: 'text' }]),
                ],
                role: 'user',
            },
        ];

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            body: JSON.stringify({
                max_completion_tokens: 500,
                messages,
                model: 'gpt-4o-mini',
            }),
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            method: 'POST',
        });

        if (!response.ok) {
            console.error('[WhatsApp Webhook] Vision API error:', await response.text());
            return null;
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || null;
    } catch (error) {
        console.error('[WhatsApp Webhook] Error analyzing image:', error);
        return null;
    }
}

/**
 * Transcribe audio/voice message using OpenAI Whisper API
 */
async function transcribeAudioWithWhisper(
    audioBase64: string,
    filename: string
): Promise<string | null> {
    if (!OPENAI_API_KEY) return null;

    try {
        console.log('[WhatsApp Webhook] Transcribing audio with Whisper...');

        // Convert base64 to a File/Blob for FormData
        const audioBuffer = Buffer.from(audioBase64, 'base64');
        const blob = new Blob([audioBuffer], { type: 'audio/ogg' });

        const formData = new FormData();
        formData.append('file', blob, filename || 'audio.ogg');
        formData.append('model', 'whisper-1');
        formData.append('language', 'fr');

        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            body: formData,
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
            method: 'POST',
        });

        if (!response.ok) {
            console.error('[WhatsApp Webhook] Whisper API error:', await response.text());
            return null;
        }

        const data = await response.json();
        return data.text || null;
    } catch (error) {
        console.error('[WhatsApp Webhook] Error transcribing audio:', error);
        return null;
    }
}

/**
 * Get MIME type from filename extension
 */
function getMimeType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const mimeMap: Record<string, string> = {
        avi: 'video/avi',
        doc: 'application/msword',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        gif: 'image/gif',
        jpeg: 'image/jpeg',
        jpg: 'image/jpeg',
        m4a: 'audio/mp4',
        mov: 'video/quicktime',
        mp3: 'audio/mpeg',
        mp4: 'video/mp4',
        ogg: 'audio/ogg',
        pdf: 'application/pdf',
        png: 'image/png',
        wav: 'audio/wav',
        webp: 'image/webp',
        xls: 'application/vnd.ms-excel',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
    return mimeMap[ext] || 'application/octet-stream';
}

/**
 * Process incoming media: download, analyze, and return text description
 */
async function processIncomingMedia(
    bridgeUrl: string,
    chatJid: string,
    messageId: string,
    mediaType: string,
    filename: string,
    userCaption: string,
    sessionId?: string
): Promise<string | null> {
    console.log(`[WhatsApp Webhook] Processing incoming ${mediaType}: ${filename}`);

    // Step 1: Download the media via the bridge
    const download = await downloadMediaFromBridge(bridgeUrl, chatJid, messageId, sessionId);
    if (!download) {
        console.warn('[WhatsApp Webhook] Could not download media, skipping processing');
        return null;
    }

    // Step 2: Read the file content as base64
    const base64 = await readMediaFileAsBase64(bridgeUrl, download.path, sessionId);
    if (!base64) {
        console.warn('[WhatsApp Webhook] Could not read media file as base64');
        return null;
    }

    // Step 3: Process based on media type
    switch (mediaType) {
        case 'image': {
            const mimeType = getMimeType(filename);
            const description = await analyzeImageWithVision(base64, mimeType, userCaption);
            if (description) {
                return `[L'utilisateur a envoyé une image${userCaption ? ` avec le message: "${userCaption}"` : ''}]\nAnalyse de l'image: ${description}`;
            }
            return `[L'utilisateur a envoyé une image${userCaption ? ` avec le message: "${userCaption}"` : ''} mais l'analyse a échoué]`;
        }

        case 'audio': {
            const transcription = await transcribeAudioWithWhisper(base64, filename);
            if (transcription) {
                return `[L'utilisateur a envoyé un message vocal]\nTranscription: "${transcription}"`;
            }
            return `[L'utilisateur a envoyé un message vocal mais la transcription a échoué]`;
        }

        case 'video': {
            // For videos, we can't easily analyze the full content
            // Just note that a video was sent and include caption if any
            return `[L'utilisateur a envoyé une vidéo: ${filename}${userCaption ? ` avec le message: "${userCaption}"` : ''}. Le contenu vidéo ne peut pas être analysé automatiquement.]`;
        }

        case 'document': {
            // For documents, inform the agent about the document
            return `[L'utilisateur a envoyé un document: ${filename}${userCaption ? ` avec le message: "${userCaption}"` : ''}. Le contenu du document ne peut pas être extrait automatiquement pour le moment.]`;
        }

        default:
            return `[L'utilisateur a envoyé un fichier de type "${mediaType}": ${filename}]`;
    }
}

/**
 * Get conversation history from WhatsApp Bridge
 */
async function getConversationHistory(
    bridgeUrl: string,
    chatJid: string,
    limit: number = 10,
    sessionId?: string
): Promise<Message[]> {
    try {
        // Validate bridgeUrl is a proper string URL
        if (typeof bridgeUrl !== 'string' || !bridgeUrl.startsWith('http')) {
            console.error('[WhatsApp Webhook] Invalid bridgeUrl in getConversationHistory:', typeof bridgeUrl, bridgeUrl);
            return [];
        }

        let url = `${bridgeUrl}/api/messages?chat_jid=${encodeURIComponent(chatJid)}&limit=${limit}`;
        if (sessionId) {
            url += `&sessionId=${encodeURIComponent(sessionId)}`;
        }
        console.log('[WhatsApp Webhook] Fetching messages from:', url);

        const response = await fetch(url);

        if (!response.ok) {
            console.error('[WhatsApp Webhook] Failed to get messages:', await response.text());
            return [];
        }

        const messages: Message[] = await response.json();
        return messages || [];
    } catch (error) {
        console.error('[WhatsApp Webhook] Error getting conversation history:', error);
        return [];
    }
}

/**
 * Search for information using SearXNG or fetch directly from opriel.com
 */
async function searchOprielInfo(query: string): Promise<string | null> {
    try {
        console.log('[WhatsApp Webhook] Searching info for:', query);

        // Key pages to scan for product/policy info on Opriel.com
        const pagesToScan = [
            `${OPRIEL_BASE_URL}/`,
            `${OPRIEL_BASE_URL}/about`,
            `${OPRIEL_BASE_URL}/tarifs`,
            `${OPRIEL_BASE_URL}/legal/privacy`,
            // Adding contact to find service info
            `${OPRIEL_BASE_URL}/services/contact?service=automation`,
        ];

        let combinedContext = '--- DONNÉES TROUVÉES SUR OPRIEL.COM ---\n';
        let foundAny = false;

        // Fetch multiple pages in parallel
        const results = await Promise.all(pagesToScan.map(async (url) => {
            const content = await fetchPageContent(url);
            if (content) {
                return `URL: ${url}\nCONTENU: ${content.substring(0, 1500)}\n`;
            }
            return null;
        }));

        for (const res of results) {
            if (res) {
                combinedContext += res + '\n';
                foundAny = true;
            }
        }

        // Fallback: Use SearXNG if specific product info might be elsewhere
        if (query.length > 5 && !query.includes('livraison')) {
            const searchResults = await searchWithSearXNG(`site:opriel.com ${query}`);
            if (searchResults) {
                combinedContext += `RÉSULTATS DE RECHERCHE:\n${searchResults}\n`;
                foundAny = true;
            }
        }

        return foundAny ? combinedContext : null;
    } catch (error) {
        console.error('[WhatsApp Webhook] Error searching Opriel info:', error);
        return null;
    }
}

/**
 * Fetch page content from a URL
 */
async function fetchPageContent(url: string): Promise<string | null> {
    try {
        console.log(`[WhatsApp Webhook] Fetching: ${url}`);
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            },
        });

        if (!response.ok) {
            console.error(`[WhatsApp Webhook] Fetch failed for ${url}: ${response.status}`);
            return null;
        }

        const html = await response.text();
        console.log(`[WhatsApp Webhook] Received ${html.length} bytes from ${url}`);

        // Simple HTML to text conversion
        const text = html
            .replace(/<script[\s\S]*?<\/script>/gi, ' ')
            .replace(/<style[\s\S]*?<\/style>/gi, ' ')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        const cleanedText = text.substring(0, 3000);
        console.log(`[WhatsApp Webhook] Extracted ${cleanedText.length} characters of text`);

        return cleanedText;
    } catch (error) {
        console.error(`[WhatsApp Webhook] Error fetching ${url}:`, error);
        return null;
    }
}

/**
 * Search using SearXNG
 */
async function searchWithSearXNG(query: string): Promise<string | null> {
    try {
        const searchUrl = `${SEARXNG_URL}/search?q=${encodeURIComponent(query)}&format=json&engines=google,bing`;

        const response = await fetch(searchUrl, {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            console.error('[WhatsApp Webhook] SearXNG search failed:', await response.text());
            return null;
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            return null;
        }

        // Format top 3 results
        const topResults = data.results.slice(0, 3).map((r: any) =>
            `- ${r.title}: ${r.content?.substring(0, 200) || 'Pas de description'} (${r.url})`
        ).join('\n');

        return topResults;
    } catch (error) {
        console.error('[WhatsApp Webhook] SearXNG error:', error);
        return null;
    }
}

/**
 * WhatsApp automation config stored in agent params.whatsappConfig
 */
interface WhatsAppAutomationConfig {
    /** If true, AI pauses when a human operator sends a message in the chat */
    humanTakeoverEnabled?: boolean;
    /** How many minutes to pause after human takeover (default: 30) */
    humanTakeoverMinutes?: number;
    /** Numbers the bot should NEVER respond to (string newline-separated or array) */
    blockedNumbers?: string | string[];
    /** If true, only respond to numbers in allowedNumbers list */
    allowedNumbersOnly?: boolean;
    /** Only respond to these numbers (string newline-separated or array) */
    allowedNumbers?: string | string[];
    /** Whether to respond in group chats (default: false) */
    respondToGroups?: boolean;
}

/**
 * Get the active agent with WhatsApp capability
 */
async function getActiveWhatsAppAgent(): Promise<{
    ecommerceConfig: { autoSellMode?: boolean; customSalesInstructions?: string; selectedProductIds?: string[] };
    id: string;
    model: string;
    provider: string;
    systemRole: string;
    title: string;
    userId: string;
    whatsappConfig: WhatsAppAutomationConfig;
} | null> {
    try {
        const db = await getServerDB();

        const result = await db
            .select({
                id: agents.id,
                marketIdentifier: agents.marketIdentifier,
                model: agents.model,
                params: agents.params,
                plugins: agents.plugins,
                provider: agents.provider,
                systemRole: agents.systemRole,
                title: agents.title,
                userId: agents.userId,
            })
            .from(agents)
            .where(
                like(sql`${agents.plugins}::text`, '%lobe-whatsapp-local%') as any
            )
            .limit(5);

        if (result.length === 0) {
            console.log('[WhatsApp Webhook] No WhatsApp agent found (no agent has the lobe-whatsapp-local plugin)');
            return null;
        }

        // Filter only ACTIVATED agents (marketIdentifier is set and not empty)
        const activeAgents = result.filter(a => a.marketIdentifier && a.marketIdentifier.trim() !== '');

        if (activeAgents.length === 0) {
            const deactivatedNames = result.map(a => a.title || a.id).join(', ');
            console.log(`[WhatsApp Webhook] Found ${result.length} agent(s) with WhatsApp plugin but ALL are DEACTIVATED: ${deactivatedNames}. Please activate an agent using the power button.`);
            return null;
        }

        const agent = activeAgents[0];
        const params = (agent.params || {}) as Record<string, any>;
        const whatsappConfig: WhatsAppAutomationConfig = params.whatsappConfig || {};
        const ecommerceConfig = params.ecommerceConfig || {};

        console.log(`[WhatsApp Webhook] Found active agent: ${agent.title} (${agent.id}), marketId: ${agent.marketIdentifier}, whatsappConfig:`, JSON.stringify(whatsappConfig));
        return {
            ecommerceConfig,
            id: agent.id,
            model: agent.model || 'gpt-4o-mini',
            provider: agent.provider || 'openai',
            systemRole: agent.systemRole || 'Tu es un assistant utile.',
            title: agent.title || 'Agent WhatsApp',
            userId: agent.userId,
            whatsappConfig,
        };
    } catch (error) {
        console.error('[WhatsApp Webhook] Error getting active agent:', error);
        return null;
    }
}

/**
 * Normalize a phone number for comparison (strip +, spaces, dashes)
 */
function normalizePhone(phone: string): string {
    return phone.replace(/[\s\-\+\(\)]/g, '').replace(/@.*$/, '');
}

/**
 * Parse a number list that can be either a string (newline/comma separated) or an array
 */
function parseNumberList(input: string | string[] | undefined): string[] {
    if (!input) return [];
    if (Array.isArray(input)) return input.filter(Boolean);
    // Split by newline, comma, semicolon, or space
    return input.split(/[\n,;\s]+/).map(s => s.trim()).filter(Boolean);
}

/**
 * Check if a sender/chat should be filtered out based on WhatsApp config
 */
function shouldSkipChat(
    chatJid: string,
    sender: string,
    config: WhatsAppAutomationConfig
): { reason: string; skip: boolean } {
    const isGroup = chatJid.endsWith('@g.us');

    // Group chat filtering
    if (isGroup && !config.respondToGroups) {
        return { reason: 'Group chats disabled', skip: true };
    }

    // Extract phone number from sender/chatJid
    const senderPhone = normalizePhone(sender || chatJid);

    // Blocked numbers check
    const blockedNumbers = parseNumberList(config.blockedNumbers);
    if (blockedNumbers.length > 0) {
        const isBlocked = blockedNumbers.some(num => {
            const normalized = normalizePhone(num);
            return normalized && senderPhone.includes(normalized);
        });
        if (isBlocked) {
            return { reason: `Number ${senderPhone} is blocked`, skip: true };
        }
    }

    // Allowed numbers only mode
    const allowedNumbers = parseNumberList(config.allowedNumbers);
    if (config.allowedNumbersOnly && allowedNumbers.length > 0) {
        const isAllowed = allowedNumbers.some(num => {
            const normalized = normalizePhone(num);
            return normalized && senderPhone.includes(normalized);
        });
        if (!isAllowed) {
            return { reason: `Number ${senderPhone} not in allowed list`, skip: true };
        }
    }

    return { reason: '', skip: false };
}

/**
 * Check if a human operator has recently taken over the conversation.
 * Looks at recent messages for any is_from_me=true messages within the takeover window.
 */
async function isHumanTakeover(
    bridgeUrl: string,
    chatJid: string,
    config: WhatsAppAutomationConfig,
    sessionId?: string
): Promise<boolean> {
    if (!config.humanTakeoverEnabled) return false;

    const takeoverMinutes = config.humanTakeoverMinutes || 30;

    try {
        const history = await getConversationHistory(bridgeUrl, chatJid, 20, sessionId);
        if (!history || history.length === 0) return false;

        const now = Date.now();
        const takeoverWindowMs = takeoverMinutes * 60 * 1000;

        // Check if any message from "me" (human operator) was sent within the window
        for (const msg of history) {
            if (!msg.IsFromMe) continue;

            // Parse the message time
            const msgTime = new Date(msg.Time).getTime();
            if (isNaN(msgTime)) continue;

            const timeSince = now - msgTime;
            if (timeSince <= takeoverWindowMs) {
                console.log(`[WhatsApp Webhook] Human takeover detected: message from operator ${Math.round(timeSince / 60000)}min ago (window: ${takeoverMinutes}min)`);
                return true;
            }
        }

        return false;
    } catch (error) {
        console.error('[WhatsApp Webhook] Error checking human takeover:', error);
        return false;
    }
}

/**
 * Fetch the user's product catalog from userSettings
 */
async function getUserProductCatalog(userId: string, ecommerceConfig?: { autoSellMode?: boolean; customSalesInstructions?: string; selectedProductIds?: string[] }): Promise<string | null> {
    try {
        const db = await getServerDB();
        const result = await db
            .select({ general: userSettings.general })
            .from(userSettings)
            .where(eq(userSettings.id, userId) as any)
            .limit(1);

        const general = (result?.[0]?.general as Record<string, any>) || {};
        const products = general?.ecommerce?.products;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return null;
        }

        let inStockProducts = products.filter((p: any) => p.inStock !== false && p.category !== '__system__');

        // Filter by selected product IDs if configured on the agent
        const selectedIds = ecommerceConfig?.selectedProductIds;
        if (selectedIds && Array.isArray(selectedIds) && selectedIds.length > 0) {
            inStockProducts = inStockProducts.filter((p: any) => selectedIds.includes(p.id));
        }
        if (inStockProducts.length === 0) return null;

        const catalog = inStockProducts.map((p: any) => {
            const price = typeof p.price === 'number' ? p.price : 0;
            const currency = p.currency || 'XOF';
            const stock = p.stockQuantity != null ? ` (${p.stockQuantity} en stock)` : '';
            const productLink = p.productUrl ? ` | Lien produit: ${p.productUrl}` : '';
            const paymentLink = p.paymentUrl ? ` | Paiement direct: ${p.paymentUrl}` : '';
            return `- ${p.name}: ${price.toLocaleString('fr-FR')} ${currency}${stock}${p.description ? ` — ${p.description}` : ''}${productLink}${paymentLink}`;
        }).join('\n');

        // Check for payment config from ecommerce.paymentConfig
        const paymentCfg = general?.ecommerce?.paymentConfig;
        let paymentInfo = '';
        if (paymentCfg) {
            const methods: string[] = [];
            if (paymentCfg.waveMerchantCode) methods.push(`Wave: ${paymentCfg.waveMerchantCode}`);
            if (paymentCfg.orangeMoneyCode) methods.push(`Orange Money: ${paymentCfg.orangeMoneyCode}`);
            if (methods.length > 0) {
                paymentInfo = `\n\n💳 MOYENS DE PAIEMENT DISPONIBLES:\n${methods.join('\n')}\nQuand un client veut payer, donne-lui ces informations de paiement.`;
            }
        }

        // Check for existing orders
        const orders = general?.ecommerce?.orders;
        let orderInfo = '';
        if (orders && Array.isArray(orders) && orders.length > 0) {
            orderInfo = '\n\nGESTION COMMANDES: Tu peux prendre des commandes. Quand un client veut acheter, confirme le produit, la quantité et demande son nom. Résume la commande avec le montant total et propose le moyen de paiement.';
        } else {
            orderInfo = '\n\nGESTION COMMANDES: Tu peux prendre des commandes. Quand un client veut acheter, confirme le produit, la quantité et demande son nom. Résume la commande avec le montant total et propose le moyen de paiement.';
        }

        console.log(`[WhatsApp Webhook] Loaded ${inStockProducts.length} products for user ${userId}`);

        // Add custom sales instructions if configured
        const customInstructions = ecommerceConfig?.customSalesInstructions
            ? `\n\nINSTRUCTIONS PERSONNALISÉES DU VENDEUR:\n${ecommerceConfig.customSalesInstructions}`
            : '';

        const autoSellNote = ecommerceConfig?.autoSellMode
            ? '\n\nMODE VENDEUR AUTOMATIQUE ACTIVÉ: Propose proactivement les produits du catalogue aux clients. Présente les produits dès le début de la conversation.'
            : '';

        return `\n\n---\n📦 CATALOGUE PRODUITS DISPONIBLES:\n${catalog}${paymentInfo}${orderInfo}\n\nINSTRUCTIONS VENTE: Quand un client demande un produit, présente-lui les produits du catalogue avec leurs prix. Sois commercial et aide-le à choisir. Si un produit n'est pas dans le catalogue, dis-le poliment. Tu peux proposer des produits similaires ou complémentaires du catalogue.${autoSellNote}${customInstructions}`;
    } catch (error) {
        console.error('[WhatsApp Webhook] Error fetching product catalog:', error);
        return null;
    }
}

/**
 * Build messages array with conversation history
 */
function buildMessagesWithHistory(
    systemRole: string,
    history: Message[],
    currentMessage: string,
    webContext: string | null,
    productCatalog: string | null
): Array<{ content: string; role: 'assistant' | 'system' | 'user' }> {
    // Enhance system role with web context and product catalog if available
    let enhancedSystemRole = systemRole;
    if (webContext) {
        enhancedSystemRole += `\n\n---\n${webContext}`;
    }
    if (productCatalog) {
        enhancedSystemRole += productCatalog;
    }

    const messages: Array<{ content: string; role: 'assistant' | 'system' | 'user' }> = [
        {
            content: enhancedSystemRole,
            role: 'system',
        },
    ];

    // Add conversation history (oldest first)
    const reversedHistory = [...history].reverse();

    for (const msg of reversedHistory) {
        // Include media messages in history context
        if (!msg.Content && msg.MediaType) {
            messages.push({
                content: `[${msg.MediaType}: ${msg.Filename || 'fichier'}]`,
                role: msg.IsFromMe ? 'assistant' : 'user',
            });
            continue;
        }

        if (msg.Content) {
            messages.push({
                content: msg.Content,
                role: msg.IsFromMe ? 'assistant' : 'user',
            });
        }
    }

    // Add the current message if different from last
    const lastUserMessage = messages.filter(m => m.role === 'user').slice(-1)[0];
    if (!lastUserMessage || lastUserMessage.content !== currentMessage) {
        messages.push({
            content: currentMessage,
            role: 'user',
        });
    }

    return messages;
}

/**
 * Detect if message needs web search for product info
 */
function needsWebSearch(message: string): boolean {
    const keywords = [
        'prix', 'price', 'coût', 'cost', 'fcfa', 'euro', 'dollar',
        'livraison', 'delivery', 'expédition', 'shipping', 'frais',
        'retour', 'return', 'remboursement', 'refund',
        'stock', 'disponible', 'available', 'vendre', 'achat',
        'produit', 'product', 'article', 'objet', 'canapé', 'lit', 'meuble',
        'garantie', 'warranty', 'sav',
        'commande', 'order', 'panier',
        'acheter', 'buy', 'commander', 'payer', 'paiement',
        'site', 'website', 'opriel', 'boutique', 'magasin',
        'faq', 'question', 'comment', 'pourquoi', 'où',
    ];

    const lowerMessage = message.toLowerCase();
    return keywords.some(keyword => lowerMessage.includes(keyword));
}
/**
 * Generate agent response using OpenAI with conversation context
 */
async function generateAgentResponse(
    agent: { id: string; model: string; systemRole: string; title: string; userId: string },
    bridgeUrl: string,
    chatJid: string,
    currentMessage: string,
    sessionId?: string
): Promise<string | null> {
    if (!OPENAI_API_KEY) {
        console.error('[WhatsApp Webhook] OPENAI_API_KEY not configured');
        return null;
    }

    try {
        // Get conversation history
        const history = await getConversationHistory(bridgeUrl, chatJid, 15, sessionId);
        console.log(`[WhatsApp Webhook] Found ${history.length} messages in conversation history`);

        // Search for relevant web info if message seems to need it
        let webContext: string | null = null;
        if (needsWebSearch(currentMessage)) {
            console.log('[WhatsApp Webhook] Message needs web search, fetching Opriel info...');
            webContext = await searchOprielInfo(currentMessage);
            if (webContext) {
                console.log('[WhatsApp Webhook] Got web context:', webContext.substring(0, 100) + '...');
            }
        }

        // Fetch user's product catalog for e-commerce integration
        const productCatalog = await getUserProductCatalog(agent.userId, (agent as any).ecommerceConfig);

        // Build messages with context
        const messages = buildMessagesWithHistory(agent.systemRole, history, currentMessage, webContext, productCatalog);
        console.log(`[WhatsApp Webhook] Sending ${messages.length} messages to OpenAI`);

        const modelName = (agent.model || '').toLowerCase();
        const isReasoningModel = modelName.includes('o1') ||
            modelName.includes('o3') ||
            modelName.startsWith('o1') ||
            modelName.startsWith('o3');

        console.log(`[WhatsApp Webhook] Model original: ${agent.model}, Model normalized: ${modelName}, isReasoning: ${isReasoningModel}`);

        // Use max_completion_tokens for ALL models (OpenAI deprecated max_tokens for newer models)
        const apiBody: any = {
            max_completion_tokens: 1000,
            messages,
            model: agent.model,
        };

        // Reasoning models (o1, o3) don't support temperature
        if (!isReasoningModel) {
            apiBody.temperature = 0.7;
        }

        console.log('[WhatsApp Webhook] Request body:', JSON.stringify({ ...apiBody, messages: '...' }));

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            body: JSON.stringify(apiBody),
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            method: 'POST',
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[WhatsApp Webhook] OpenAI API error:', errorText);
            return null;
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || null;
    } catch (error) {
        console.error('[WhatsApp Webhook] Error generating response:', error);
        return null;
    }
}

/**
 * POST handler - receives incoming WhatsApp messages
 */
export async function POST(req: NextRequest) {
    try {
        const bridgeUrl = resolveBridgeUrlFromRequest(req);
        const body: WhatsAppWebhookRequest = await req.json();

        // Extract sessionId from webhook body or query params
        const { searchParams } = req.nextUrl;
        const sessionId = body.sessionId || searchParams.get('sessionId') || undefined;

        console.log('[WhatsApp Webhook] Received event:', body.event, 'sessionId:', sessionId || 'default');

        // Only process incoming messages (not from ourselves)
        if (body.event !== 'message' || body.data.is_from_me) {
            return NextResponse.json({ status: 'ignored' });
        }

        const { chat_jid, content, sender, media_type, message_id, filename } = body.data;

        // Ignore status broadcast messages (WhatsApp Stories/Status updates)
        if (chat_jid && (chat_jid.includes('status@broadcast') || chat_jid.endsWith('@broadcast'))) {
            return NextResponse.json({ status: 'ignored_broadcast' });
        }

        const hasMedia = !!media_type && !!message_id;
        const hasText = !!content && content.trim() !== '';

        // Ignore if there's neither text nor media
        if (!hasText && !hasMedia) {
            return NextResponse.json({ status: 'empty_message' });
        }

        console.log(
            `[WhatsApp Webhook] Processing message from ${sender}: "${(content || '').substring(0, 50)}..."${hasMedia ? ` [media: ${media_type}, file: ${filename}]` : ''}`
        );

        // Verify the WhatsApp session is actually connected before processing
        try {
            let statusUrl = `${bridgeUrl}/api/status`;
            if (sessionId) {
                statusUrl += `?sessionId=${encodeURIComponent(sessionId)}`;
            }
            const statusRes = await fetch(statusUrl);
            if (statusRes.ok) {
                const statusData = await statusRes.json();
                if (!statusData.paired) {
                    console.warn(`[WhatsApp Webhook] Session ${sessionId || 'default'} is NOT paired/connected. Skipping response.`);
                    return NextResponse.json({ status: 'session_not_connected' });
                }
            } else {
                console.warn('[WhatsApp Webhook] Could not verify session status, bridge may be down. Skipping.');
                return NextResponse.json({ status: 'bridge_unreachable' });
            }
        } catch (statusError) {
            console.warn('[WhatsApp Webhook] Failed to check session status:', statusError);
            return NextResponse.json({ status: 'bridge_unreachable' });
        }

        // Get the active WhatsApp agent
        const agent = await getActiveWhatsAppAgent();

        if (!agent) {
            console.warn('[WhatsApp Webhook] No active agent found with "lobe-whatsapp-local" plugin. Please check your agent settings in Connect.');
            return NextResponse.json({ status: 'no_active_agent' });
        }

        console.log(`[WhatsApp Webhook] Using agent: ${agent.title} (${agent.id})`);

        // --- WhatsApp Automation Filters ---
        const waConfig = agent.whatsappConfig;

        // 1. Number filtering (blocked numbers, allowed-only mode, group chats)
        const filterResult = shouldSkipChat(chat_jid, sender, waConfig);
        if (filterResult.skip) {
            console.log(`[WhatsApp Webhook] Skipping message: ${filterResult.reason}`);
            return NextResponse.json({ reason: filterResult.reason, status: 'filtered' });
        }

        // 2. Human takeover detection
        const humanTookOver = await isHumanTakeover(bridgeUrl, chat_jid, waConfig, sessionId);
        if (humanTookOver) {
            console.log(`[WhatsApp Webhook] Human takeover active for chat ${chat_jid}, AI paused for ${waConfig.humanTakeoverMinutes || 30}min`);
            return NextResponse.json({ status: 'human_takeover' });
        }

        // Check credit limits before making AI call
        const db = await getServerDB();
        const creditCheck = await checkCredits(db, agent.userId, agent.model, agent.provider);
        if (!creditCheck.allowed) {
            console.warn(`[WhatsApp Webhook] Credit limit reached for user ${agent.userId}: ${creditCheck.message}`);
            return NextResponse.json({ error: 'Credit limit reached', status: 'credit_limit_reached' }, { status: 429 });
        }

        // Process media if present (image → vision, audio → whisper, etc.)
        let messageForAI = content || '';
        if (hasMedia && media_type && message_id) {
            console.log(`[WhatsApp Webhook] Processing media: ${media_type} (${filename})`);
            const mediaDescription = await processIncomingMedia(
                bridgeUrl,
                chat_jid,
                message_id,
                media_type,
                filename || 'unknown',
                content || '',
                sessionId
            );
            if (mediaDescription) {
                messageForAI = mediaDescription;
                console.log(`[WhatsApp Webhook] Media processed: "${mediaDescription.substring(0, 80)}..."`);
            } else if (!hasText) {
                // Media processing failed and there's no text — inform user
                messageForAI = `[L'utilisateur a envoyé un ${media_type}: ${filename || 'fichier'}]`;
            }
        }

        // Generate response using the agent with conversation context
        const response = await generateAgentResponse(agent, bridgeUrl, chat_jid, messageForAI, sessionId);

        if (!response) {
            console.error('[WhatsApp Webhook] Failed to generate response');
            return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
        }

        console.log(`[WhatsApp Webhook] Generated response: "${response.substring(0, 50)}..."`);

        // --- Anti-Ban / Human Simulation ---
        // Calculate a realistic delay based on message length
        const words = response.split(/\s+/).length;
        const totalDelayMs = Math.min(Math.max((2000 + Math.random() * 3000) + (words * (150 + Math.random() * 250)), 4000), 25000);

        console.log(`[WhatsApp Webhook] Human simulation: Waiting ${Math.round(totalDelayMs / 1000)}s before sending...`);

        // Start typing signal immediately and keep it active during the delay
        const typingInterval = setInterval(() => {
            // Sending an empty message to the bridge will trigger the typed signal
            sendWhatsAppMessage(bridgeUrl, chat_jid, "", sessionId).catch(() => { });
        }, 8000);

        await new Promise(resolve => setTimeout(resolve, totalDelayMs));
        clearInterval(typingInterval);

        // Send the response back via WhatsApp
        const sent = await sendWhatsAppMessage(bridgeUrl, chat_jid, response, sessionId);

        if (!sent) {
            console.error(`[WhatsApp Webhook] Failed to send response back to bridge at ${bridgeUrl}. Check if WHATSAPP_BRIDGE_URL is correct.`);
            return NextResponse.json({ error: 'Failed to send response' }, { status: 500 });
        }

        console.log('[WhatsApp Webhook] Response sent successfully');

        // Deduct credits after successful response
        deductCredits(db, agent.userId, agent.model).catch((err) => {
            console.error('[WhatsApp Webhook] Failed to deduct credits:', err);
        });

        return NextResponse.json({
            response: response.substring(0, 100),
            status: 'responded',
        });
    } catch (error) {
        console.error('[WhatsApp Webhook] Error processing webhook:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

/**
 * GET handler - health check
 */
export async function GET() {
    const agent = await getActiveWhatsAppAgent();

    return NextResponse.json({
        active_agent: agent ? { id: agent.id, title: agent.title } : null,
        openai_configured: !!OPENAI_API_KEY,
        searxng_url: SEARXNG_URL,
        status: 'ok',
        whatsapp_bridge_url: DEFAULT_WHATSAPP_BRIDGE_URL,
    });
}
