import { SendTextBlock } from "./definitions/send_text";
import { AgentBlock } from "./definitions/ai_agent";
import { ConditionBlock } from "./definitions/condition";
import { SwitchBlock } from "./definitions/switch";
import { WhatsAppTriggerBlock } from "./definitions/whatsapp_trigger";
import { WaitBlock } from "./definitions/wait";
import { WebhookBlock } from "./definitions/webhook";
import { HumanInTheLoopBlock } from "./definitions/human_review";
import { CatalogBlock } from "./definitions/catalog";
import { GPTAnalyzeBlock } from "./definitions/gpt_analyze";
import { Hub2BalanceBlock } from "./definitions/hub2";
import { BlockConfig } from "./types";

import {
    Zap,
    Bot,
    ShoppingCart,
    GitBranch,
    MessageSquare,
    Globe,
    Clock,
    Database
} from "lucide-react";

export const BLOCK_REGISTRY: Record<string, BlockConfig> = {
    send_text: SendTextBlock,
    ai_agent: AgentBlock,
    condition: ConditionBlock,
    switch: SwitchBlock,
    whatsapp_message: WhatsAppTriggerBlock,
    delay: WaitBlock,
    webhook: WebhookBlock,
    human_review: HumanInTheLoopBlock,
    show_catalog: CatalogBlock,
    gpt_analyze: GPTAnalyzeBlock,
    hub2_balance: Hub2BalanceBlock,
};


export const ALL_BLOCKS = Object.values(BLOCK_REGISTRY);

export const CATEGORIES = [
    { id: "triggers", name: "Déclencheurs", icon: Zap },
    { id: "messages", name: "Messages", icon: MessageSquare },
    { id: "ai", name: "Intelligence IA", icon: Bot },
    { id: "ecommerce", name: "E-Commerce", icon: ShoppingCart },
    { id: "logic", name: "Logique", icon: GitBranch },
    { id: "tools", name: "Outils", icon: Database },
];

export function getBlock(type: string): BlockConfig | undefined {
    return BLOCK_REGISTRY[type];
}

export function getBlocksByCategory(categoryId: string): BlockConfig[] {
    return ALL_BLOCKS.filter(block => block.category === categoryId);
}
