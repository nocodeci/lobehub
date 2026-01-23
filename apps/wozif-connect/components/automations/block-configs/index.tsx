"use client";

import React from "react";
import { BlockConfigProps } from "./types";

// Import des composants par catégorie
import {
  WhatsAppTriggerConfig,
  NewContactConfig,
  ScheduledConfig,
  WebhookTriggerConfig,
  KeywordConfig,
} from "./TriggerBlocks";

import {
  GPTConfig,
  AITranslateConfig,
  AISummarizeConfig,
  SentimentConfig,
  AIModerationConfig,
  AIAnalyzeImageConfig,
  AIGenerateImageConfig,
  AIGenerateAudioConfig,
  AITranscribeConfig,
  AIGenerateVideoConfig,
} from "./AIBlocks";

import {
  DelayConfig,
  SendTextConfig,
  SendImageConfig,
  SendDocumentConfig,
  SendLocationConfig,
  SendContactConfig,
  SendAudioConfig,
  SendButtonsConfig,
} from "./MessageBlocks";

import {
  ConditionConfig,
  LoopConfig,
  SetVariableConfig,
  RandomChoiceConfig,
  EndFlowConfig,
} from "./LogicBlocks";

import {
  SaveContactConfig,
  TagConfig,
  UpdateContactConfig,
  AssignAgentConfig,
  AddNoteConfig,
} from "./CRMBlocks";

import {
  NotifyEmailConfig,
  NotifyWebhookConfig,
  NotifySlackConfig,
  NotifyInternalConfig,
} from "./NotificationBlocks";

import {
  CheckAvailabilityConfig,
  BookAppointmentConfig,
  CancelAppointmentConfig,
  SendReminderConfig,
} from "./AppointmentBlocks";

import {
  RateLimitConfig,
  BlockSpamConfig,
  VerifyHumanConfig,
  AntiBanConfig,
} from "./SecurityBlocks";

import {
  ShowCatalogConfig,
  AddToCartConfig,
  CheckoutConfig,
  OrderStatusConfig,
} from "./EcommerceBlocks";

import {
  CreateGroupConfig,
  ParticipantConfig,
  BulkAddMembersConfig,
  ExtractionConfig,
} from "./WhatsAppGroupBlocks";

// Mapping des types de blocs vers leurs composants
const blockConfigComponents: Record<string, React.FC<BlockConfigProps>> = {
  // Triggers
  whatsapp_message: WhatsAppTriggerConfig,
  telegram_message: WhatsAppTriggerConfig,
  new_contact: NewContactConfig,
  scheduled: ScheduledConfig,
  webhook_trigger: WebhookTriggerConfig,
  keyword: KeywordConfig,

  // AI
  gpt_analyze: GPTConfig,
  gpt_respond: GPTConfig,
  ai_translate: AITranslateConfig,
  ai_summarize: AISummarizeConfig,
  sentiment: SentimentConfig,
  ai_moderation: AIModerationConfig,
  ai_analyze_image: AIAnalyzeImageConfig,
  ai_generate_image: AIGenerateImageConfig,
  ai_generate_audio: AIGenerateAudioConfig,
  ai_transcribe: AITranscribeConfig,
  ai_generate_video: AIGenerateVideoConfig,

  // Messages
  delay: DelayConfig,
  send_text: SendTextConfig,
  send_image: SendImageConfig,
  send_document: SendDocumentConfig,
  send_location: SendLocationConfig,
  send_contact: SendContactConfig,
  send_audio: SendAudioConfig,
  send_buttons: SendButtonsConfig,

  // Logic
  condition: ConditionConfig,
  loop: LoopConfig,
  set_variable: SetVariableConfig,
  random_choice: RandomChoiceConfig,
  end_flow: EndFlowConfig,

  // CRM
  save_contact: SaveContactConfig,
  add_tag: TagConfig,
  remove_tag: TagConfig,
  update_contact: UpdateContactConfig,
  assign_agent: AssignAgentConfig,
  add_note: AddNoteConfig,

  // Notifications
  notify_email: NotifyEmailConfig,
  notify_webhook: NotifyWebhookConfig,
  notify_slack: NotifySlackConfig,
  notify_internal: NotifyInternalConfig,

  // Appointments
  check_availability: CheckAvailabilityConfig,
  book_appointment: BookAppointmentConfig,
  cancel_appointment: CancelAppointmentConfig,
  send_reminder: SendReminderConfig,

  // Security
  rate_limit: RateLimitConfig,
  block_spam: BlockSpamConfig,
  verify_human: VerifyHumanConfig,
  anti_ban: AntiBanConfig,

  // E-commerce
  show_catalog: ShowCatalogConfig,
  add_to_cart: AddToCartConfig,
  checkout: CheckoutConfig,
  order_status: OrderStatusConfig,
  chariow: ShowCatalogConfig, // alias

  // WhatsApp Groups
  create_group: CreateGroupConfig,
  add_participant: ParticipantConfig,
  remove_participant: ParticipantConfig,
  bulk_add_members: BulkAddMembersConfig,
  get_group_members: ExtractionConfig,
  chat_list_collector: ExtractionConfig,
};

// Composant principal qui rend la configuration appropriée
export function BlockConfigRenderer({ node, updateConfig, context }: BlockConfigProps) {
  const ConfigComponent = blockConfigComponents[node.type];

  if (!ConfigComponent) {
    return (
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
        <p className="text-[10px] text-muted-foreground">
          Configuration pour <span className="font-mono text-primary">{node.type}</span> non disponible
        </p>
      </div>
    );
  }

  return <ConfigComponent node={node} updateConfig={updateConfig} context={context} />;
}

// Exporter tout
export * from "./types";
export * from "./TriggerBlocks";
export * from "./AIBlocks";
export * from "./MessageBlocks";
export * from "./LogicBlocks";
export * from "./CRMBlocks";
export * from "./NotificationBlocks";
export * from "./AppointmentBlocks";
export * from "./SecurityBlocks";
export * from "./EcommerceBlocks";
export * from "./WhatsAppGroupBlocks";
