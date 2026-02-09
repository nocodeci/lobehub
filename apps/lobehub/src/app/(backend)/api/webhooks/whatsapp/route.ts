import { NextRequest, NextResponse } from 'next/server';

import { getServerDB } from '@/database/core/db-adaptor';
import { agents } from '@lobechat/database/schemas';
import { and, isNotNull, like, ne, sql } from 'drizzle-orm';

// WhatsApp Bridge webhook endpoint
// Receives incoming WhatsApp messages and triggers the appropriate agent to respond

interface WhatsAppIncomingMessage {
    chat_jid: string;
    content: string;
    is_from_me: boolean;
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
 * Get the active agent with WhatsApp capability
 */
async function getActiveWhatsAppAgent(): Promise<{
    id: string;
    model: string;
    provider: string;
    systemRole: string;
    title: string;
} | null> {
    try {
        const db = await getServerDB();

        const result = await db
            .select({
                id: agents.id,
                marketIdentifier: agents.marketIdentifier,
                model: agents.model,
                plugins: agents.plugins,
                provider: agents.provider,
                systemRole: agents.systemRole,
                title: agents.title,
            })
            .from(agents)
            .where(
                like(sql`${agents.plugins}::text`, '%lobe-whatsapp-local%')
            )
            .limit(1);

        if (result.length === 0) {
            console.log('[WhatsApp Webhook] No active WhatsApp agent found');
            return null;
        }

        const agent = result[0];
        return {
            id: agent.id,
            model: agent.model || 'gpt-4o-mini',
            provider: agent.provider || 'openai',
            systemRole: agent.systemRole || 'Tu es un assistant utile.',
            title: agent.title || 'Agent WhatsApp',
        };
    } catch (error) {
        console.error('[WhatsApp Webhook] Error getting active agent:', error);
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
    webContext: string | null
): Array<{ content: string; role: 'assistant' | 'system' | 'user' }> {
    // Enhance system role with web context if available
    let enhancedSystemRole = systemRole;
    if (webContext) {
        enhancedSystemRole += `\n\n---\n${webContext}`;
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
        if (!msg.Content && msg.MediaType) {
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
    agent: { id: string; model: string; systemRole: string; title: string },
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

        // Build messages with context
        const messages = buildMessagesWithHistory(agent.systemRole, history, currentMessage, webContext);
        console.log(`[WhatsApp Webhook] Sending ${messages.length} messages to OpenAI`);

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            body: JSON.stringify({
                max_tokens: 1000,
                messages,
                model: agent.model,
                temperature: 0.7,
            }),
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

        const { chat_jid, content, sender } = body.data;

        if (!content || content.trim() === '') {
            return NextResponse.json({ status: 'empty_message' });
        }

        console.log(
            `[WhatsApp Webhook] Processing message from ${sender}: "${content.substring(0, 50)}..."`
        );

        // Get the active WhatsApp agent
        const agent = await getActiveWhatsAppAgent();

        if (!agent) {
            console.warn('[WhatsApp Webhook] No active agent found with "lobe-whatsapp-local" plugin. Please check your agent settings in Connect.');
            return NextResponse.json({ status: 'no_active_agent' });
        }

        console.log(`[WhatsApp Webhook] Using agent: ${agent.title} (${agent.id})`);

        // Generate response using the agent with conversation context
        const response = await generateAgentResponse(agent, bridgeUrl, chat_jid, content, sessionId);

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
