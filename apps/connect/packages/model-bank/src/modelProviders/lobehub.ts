import { type ModelProviderCard } from '@/types/llm';

const LobeHub: ModelProviderCard = {
  chatModels: [],
  description:
    'Connect Cloud uses official APIs to access AI models and measures usage with Credits tied to model tokens.',
  enabled: true,
  id: 'lobehub',
  modelsUrl: 'https://connect.wozif.com',
  name: 'Connect',
  settings: {
    modelEditable: false,
    showAddNewModel: false,
    showModelFetcher: false,
  },
  showConfig: false,
  url: 'https://connect.wozif.com',
};

export default LobeHub;

export const planCardModels = ['gpt-4o-mini', 'deepseek-reasoner', 'claude-3-5-sonnet-latest'];
