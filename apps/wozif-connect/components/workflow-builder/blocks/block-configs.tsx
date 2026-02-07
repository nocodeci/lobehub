import * as Icons from '@/components/icons';
import { BlockConfig } from '../types';
import {
    Cpu,
    Zap,
    MessageSquare,
    Globe,
    Clock,
    Brain,
    Plus,
    Search,
    Mail,
    Slack,
    Github,
    Hash,
    FileText,
    MapPin,
    User,
    Headphones,
    Layers,
    Split,
    Repeat,
    Variable,
    Flag,
    Shield,
    ShoppingCart,
    Users,
    Calendar,
    Send
} from 'lucide-react';

export const triggerBlocks: BlockConfig[] = [
    {
        id: 'start', type: 'start', name: 'Start', description: 'Point de départ du workflow', icon: Icons.StartIcon, color: '#33b4ff', category: 'triggers',
        subBlocks: [
            { id: 'trigger_name', title: 'Trigger Name', type: 'short-input', placeholder: 'e.g. Inbound Message' }
        ]
    },
    {
        id: 'schedule', type: 'scheduled', name: 'Schedule', description: 'Exécution programmée', icon: Clock, color: '#8e4cfb', category: 'triggers',
        subBlocks: [
            { id: 'cron', title: 'Cron Expression', type: 'short-input', placeholder: '*/5 * * * *', required: true },
            { id: 'timezone', title: 'Timezone', type: 'dropdown', options: [{ label: 'UTC', id: 'utc' }, { label: 'Local', id: 'local' }], defaultValue: 'utc' }
        ]
    },
    {
        id: 'webhook', type: 'webhook_trigger', name: 'Webhook', description: 'Réception HTTP', icon: Icons.WebhookIcon, color: '#22c55e', category: 'triggers',
        subBlocks: [
            { id: 'path', title: 'Endpoint Path', type: 'short-input', placeholder: 'my-webhook-url', required: true },
            { id: 'method', title: 'Method', type: 'dropdown', options: [{ label: 'POST', id: 'post' }, { label: 'GET', id: 'get' }], defaultValue: 'post' }
        ]
    },
    {
        id: 'whatsapp_message', type: 'whatsapp_message', name: 'WhatsApp Message', description: 'Nouveau message WhatsApp', icon: Icons.WhatsAppIcon, color: '#25D366', category: 'triggers',
        subBlocks: [
            { id: 'phone_filter', title: 'Filter by Phone', type: 'short-input', placeholder: 'Optional phone filter' }
        ]
    },
    {
        id: 'telegram_message', type: 'telegram_message', name: 'Telegram Message', description: 'Nouveau message Telegram', icon: Icons.TelegramIcon || Send, color: '#24A1DE', category: 'triggers',
        subBlocks: [
            { id: 'chat_id', title: 'Chat ID', type: 'short-input', placeholder: 'Optional filter by Chat ID' }
        ]
    },
    { id: 'keyword', type: 'keyword', name: 'Keyword Detection', description: 'Mots clés spécifiques', icon: Hash, color: '#f59e0b', category: 'triggers', subBlocks: [{ id: 'keywords', title: 'Keywords', type: 'short-input', placeholder: 'Comma separated e.g. help, support' }] },
    { id: 'new_contact', type: 'new_contact', name: 'New Contact', description: 'Nouveau contact ajouté', icon: Users, color: '#3b82f6', category: 'triggers' },
];

export const actionBlocks: BlockConfig[] = [
    // --- AI CATEGORY ---
    {
        id: 'ai_agent',
        type: 'ai_agent',
        name: 'AI Agent',
        description: 'Advanced autonomous AI agent with tools and memory',
        icon: Icons.AgentIcon,
        color: '#8e4cfb',
        category: 'ai',
        subBlocks: [
            { id: 'prompt', title: 'System Instructions', type: 'template', required: true, placeholder: 'You are a helpful assistant...' },
            {
                id: 'model', title: 'LLM Model', type: 'dropdown', options: [
                    { label: 'GPT-4o (OpenAI)', id: 'gpt-4o' },
                    { label: 'Claude 3.5 Sonnet', id: 'claude-sonnet' },
                    { label: 'Llama 3 70B', id: 'llama-3' }
                ], defaultValue: 'gpt-4o'
            },
            { id: 'temperature', title: 'Creativity (Temp)', type: 'number', defaultValue: 0.7 },
            { id: 'json_mode', title: 'Strict JSON Output', type: 'checkbox', defaultValue: false }
        ]
    },
    {
        id: 'gpt_analyze', type: 'gpt_analyze', name: 'GPT Analyze', description: 'Intention and entity extraction', icon: Brain, color: '#10a37f', category: 'ai',
        subBlocks: [
            { id: 'text', title: 'Input Text', type: 'template', required: true },
            { id: 'goal', title: 'Analysis Goal', type: 'short-input', placeholder: 'e.g. extract dates' }
        ]
    },
    {
        id: 'gpt_respond', type: 'gpt_respond', name: 'GPT Respond', description: 'Generate smart context-aware replies', icon: MessageSquare, color: '#10a37f', category: 'ai',
        subBlocks: [
            { id: 'context', title: 'Contextual Data', type: 'template', placeholder: 'Previous conversation...' },
            { id: 'style', title: 'Writing Style', type: 'short-input', placeholder: 'Professional, friendly...' }
        ]
    },
    { id: 'ai_translate', type: 'ai_translate', name: 'AI Translate', description: 'Multi-language translation', icon: Globe, color: '#4285f4', category: 'ai', subBlocks: [{ id: 'target_lang', title: 'Target Language', type: 'short-input', placeholder: 'French, Spanish...' }] },
    { id: 'ai_summarize', type: 'ai_summarize', name: 'AI Summarize', description: 'Shorten content effectively', icon: FileText, color: '#10a37f', category: 'ai', subBlocks: [{ id: 'length', title: 'Summary Length', type: 'dropdown', options: [{ id: 'brief', label: 'Brief' }, { id: 'detailed', label: 'Detailed' }] }] },
    { id: 'sentiment', type: 'sentiment', name: 'Sentiment Analysis', description: 'Detect user mood/emotion', icon: Zap, color: '#ec4899', category: 'ai' },
    { id: 'ai_generate_image', type: 'ai_generate_image', name: 'Generate Image', description: 'Create visuals from text', icon: Layers, color: '#f59e0b', category: 'ai', subBlocks: [{ id: 'prompt', title: 'Visual Prompt', type: 'template', required: true }] },
    { id: 'ai_transcribe', type: 'ai_transcribe', name: 'AI Transcribe', description: 'Audio to text conversion', icon: Headphones, color: '#6366f1', category: 'ai' },

    // --- MESSAGING CATEGORY ---
    {
        id: 'send_text',
        type: 'send_text',
        name: 'Send Text',
        description: 'Send a via WhatsApp or Telegram',
        icon: Icons.MessagesIcon,
        color: '#25D366',
        category: 'messages',
        subBlocks: [
            { id: 'phone', title: 'To (Recipient)', type: 'short-input', required: true, placeholder: '+33612345678' },
            { id: 'message', title: 'Message Text', type: 'template', required: true, placeholder: 'Hello world!' }
        ]
    },
    { id: 'send_image', type: 'send_image', name: 'Send Image', description: 'Media message with caption', icon: Layers, color: '#25D366', category: 'messages', subBlocks: [{ id: 'url', title: 'Image URL', type: 'short-input' }, { id: 'caption', title: 'Caption', type: 'short-input' }] },
    { id: 'send_document', type: 'send_document', name: 'Send Document', description: 'PDF, Word, or other files', icon: FileText, color: '#25D366', category: 'messages', subBlocks: [{ id: 'url', title: 'File URL', type: 'short-input' }] },
    { id: 'send_location', type: 'send_location', name: 'Send Location', description: 'GPS coordinates', icon: MapPin, color: '#25D366', category: 'messages', subBlocks: [{ id: 'lat', title: 'Latitude', type: 'number' }, { id: 'lng', title: 'Longitude', type: 'number' }] },
    { id: 'send_buttons', type: 'send_buttons', name: 'Interactive Buttons', description: 'Clickable response options', icon: Icons.CursorIcon, color: '#25D366', category: 'messages' },
    { id: 'delay', type: 'delay', name: 'Wait / Delay', description: 'Pause flow execution', icon: Clock, color: '#94a3b8', category: 'messages', subBlocks: [{ id: 'duration', title: 'Duration (sec)', type: 'number', defaultValue: 5 }] },

    // --- LOGIC CATEGORY ---
    { id: 'condition', type: 'condition', name: 'Condition (If/Else)', description: 'Path branching based on data', icon: Icons.ConditionalIcon, color: '#ef4444', category: 'logic', subBlocks: [{ id: 'expression', title: 'Condition Expression', type: 'template', placeholder: '{{value}} > 10' }] },
    { id: 'loop', type: 'loop', name: 'Loop / Iterator', description: 'Repeat steps for each item', icon: Repeat, color: '#f59e0b', category: 'logic', subBlocks: [{ id: 'items', title: 'Items to Loop', type: 'template', placeholder: '{{my_list}}' }] },
    { id: 'set_variable', type: 'set_variable', name: 'Set Variable', description: 'Store data for later use', icon: Variable, color: '#6366f1', category: 'logic', subBlocks: [{ id: 'name', title: 'Variable Name', type: 'short-input' }, { id: 'value', title: 'Value', type: 'template' }] },
    { id: 'random_choice', type: 'random_choice', name: 'Random Choice', description: 'A/B testing or random paths', icon: Split, color: '#ec4899', category: 'logic' },
    { id: 'end_flow', type: 'end_flow', name: 'End Session', description: 'Terminate the current flow', icon: Flag, color: '#000000', category: 'logic' },

    // --- CRM & DATA CATEGORY ---
    { id: 'save_contact', type: 'save_contact', name: 'Save Contact', description: 'Upsert into CRM', icon: User, color: '#3b82f6', category: 'crm', subBlocks: [{ id: 'name', title: 'Full Name', type: 'short-input' }, { id: 'email', title: 'Email Address', type: 'short-input' }] },
    { id: 'add_tag', type: 'add_tag', name: 'Add Tag', description: 'Categorize user for segments', icon: Hash, color: '#3b82f6', category: 'crm', subBlocks: [{ id: 'tag', title: 'Tag Name', type: 'short-input' }] },
    { id: 'update_contact', type: 'update_contact', name: 'Update Profile', description: 'Modify existing contact info', icon: Users, color: '#3b82f6', category: 'crm' },
    { id: 'assign_agent', type: 'assign_agent', name: 'Assign to Agent', description: 'Handover to human support', icon: Headphones, color: '#3b82f6', category: 'crm' },

    // --- INTEGRATIONS CATEGORY ---
    { id: 'notify_slack', type: 'notify_slack', name: 'Slack Notify', description: 'Internal team alert', icon: Slack, color: '#4a154b', category: 'integrations', subBlocks: [{ id: 'channel', title: 'Slack Channel', type: 'short-input' }, { id: 'message', title: 'Message', type: 'template' }] },
    { id: 'notify_email', type: 'notify_email', name: 'Send Email', description: 'SMTP or Gmail outbound', icon: Mail, color: '#ea4335', category: 'integrations', subBlocks: [{ id: 'to', title: 'Recipient', type: 'short-input' }, { id: 'subject', title: 'Subject', type: 'short-input' }, { id: 'body', title: 'Body', type: 'template' }] },
    { id: 'hubspot', type: 'hubspot', name: 'HubSpot Sync', description: 'Connect with HubSpot CRM', icon: Icons.HubspotIcon, color: '#ff7a59', category: 'integrations' },
    { id: 'github_action', type: 'github', name: 'GitHub Sync', description: 'Trigger repos or issues', icon: Github, color: '#181717', category: 'integrations' },
    { id: 'notion_sync', type: 'notion', name: 'Notion Database', description: 'Write or read from Notion', icon: Icons.NotionIcon, color: '#000000', category: 'integrations' },

    // --- TOOLS & E-COMMERCE CATEGORY ---
    { id: 'book_appointment', type: 'book_appointment', name: 'Book Appointment', description: 'Calendar integration', icon: Calendar, color: '#8e4cfb', category: 'tools' },
    { id: 'show_catalog', type: 'show_catalog', name: 'Product Catalog', description: 'Display e-commerce items', icon: ShoppingCart, color: '#ff7a59', category: 'tools' },
    { id: 'checkout', type: 'checkout', name: 'Smart Checkout', description: 'Handle payments in flow', icon: Zap, color: '#22c55e', category: 'tools' },
    { id: 'rate_limit', type: 'rate_limit', name: 'Rate Limiter', description: 'Prevent spam and overflow', icon: Shield, color: '#ef4444', category: 'tools' },

    // --- UTILITIES CATEGORY ---
    { id: 'api_request', type: 'api_request', name: 'HTTP Request', description: 'Generic REST API call', icon: Icons.ApiIcon, color: '#33b4ff', category: 'tools', subBlocks: [{ id: 'url', title: 'API URL', type: 'short-input', required: true }, { id: 'method', title: 'Method', type: 'dropdown', options: [{ id: 'get', label: 'GET' }, { id: 'post', label: 'POST' }] }, { id: 'headers', title: 'Headers', type: 'template', placeholder: '{"Auth": "..."}' }] },
    { id: 'knowledge_search', type: 'knowledge_search', name: 'Knowledge Search', description: 'Search base documents', icon: Icons.SearchIcon, color: '#6366f1', category: 'tools', subBlocks: [{ id: 'query', title: 'Search Query', type: 'template', required: true }] },
    { id: 'custom_code', type: 'custom_code', name: 'Custom Code', description: 'Run JS/TS snippets', icon: Icons.CodeIcon, color: '#f59e0b', category: 'tools', subBlocks: [{ id: 'code', title: 'JavaScript Code', type: 'template', required: true, placeholder: 'return input * 2;' }] },
];

// Fallback icons if some are missing in the component library
function HeadsetIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 11c0-4.97 4.03-9 9-9s9 4.03 9 9" />
            <rect x="2" y="11" width="4" height="8" rx="2" />
            <rect x="18" y="11" width="4" height="8" rx="2" />
            <path d="M18 19v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1" />
        </svg>
    );
}

export const allBlocks = [...triggerBlocks, ...actionBlocks];

export const getBlockById = (id: string) =>
    allBlocks.find((block) => block.id === id || block.type === id);

