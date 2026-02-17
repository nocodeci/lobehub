import { AIChatModelCard } from '../../../types/aiModel';
import { anthropicChatModels } from './anthropic';
import { deepseekChatModels } from './deepseek';
import { googleChatModels } from './google';
import { openaiChatModels } from './openai';

export const lobehubChatModels: AIChatModelCard[] = [
  ...anthropicChatModels,
  ...googleChatModels,
  ...openaiChatModels,
  ...deepseekChatModels,
];

export { anthropicChatModels } from './anthropic';
export { deepseekChatModels } from './deepseek';
export { googleChatModels } from './google';
export { openaiChatModels } from './openai';
