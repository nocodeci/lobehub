interface RouterInstance {
  apiType: string;
  models?: string[];
  options: {
    accessKeyId?: string;
    accessKeySecret?: string;
    apiKey?: string;
    apiVersion?: string;
    baseURL?: string;
    baseURLOrAccountID?: string;
    dangerouslyAllowBrowser?: boolean;
    region?: string;
    sessionToken?: string;
  };
}

interface LobehubRouterRuntimeOptions {
  id: string;
  routers: (options: any, runtimeContext: { model?: string }) => Promise<RouterInstance[]>;
}

/**
 * Connect provider router configuration.
 *
 * When a user selects "Connect" as their provider, this router dispatches
 * the request to the correct upstream API (OpenAI, Anthropic, Google, DeepSeek)
 * using the server-side API keys from environment variables.
 *
 * Model-to-provider mapping:
 *  - claude-*          → Anthropic
 *  - gemini-*          → Google
 *  - deepseek-*        → DeepSeek
 *  - gpt-*, o3*, o4*,
 *    chatgpt-*         → OpenAI (default fallback)
 */
export const lobehubRouterRuntimeOptions: LobehubRouterRuntimeOptions = {
  id: 'lobehub',

  routers: async (_options, { model: _model }) => {
    const routers: RouterInstance[] = [];

    // --- Anthropic ---
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (anthropicKey) {
      routers.push({
        apiType: 'anthropic',
        models: [
          'claude-sonnet-4-5-20250929',
          'claude-sonnet-4-20250514',
          'claude-3-7-sonnet-20250219',
          'claude-opus-4-5-20251101',
          'claude-opus-4-1-20250805',
          'claude-opus-4-20250514',
          'claude-haiku-4-5-20251001',
          'claude-3-5-haiku-20241022',
        ],
        options: { apiKey: anthropicKey },
      });
    }

    // --- Google ---
    const googleKey = process.env.GOOGLE_API_KEY;
    if (googleKey) {
      routers.push({
        apiType: 'google',
        models: [
          'gemini-3-pro-preview',
          'gemini-3-flash-preview',
          'gemini-2.5-pro',
          'gemini-2.5-flash',
          'gemini-3-pro-image-preview',
          'gemini-2.5-flash-image-preview',
          'gemini-2.0-flash-exp-image-generation',
        ],
        options: { apiKey: googleKey },
      });
    }

    // --- DeepSeek ---
    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    if (deepseekKey) {
      routers.push({
        apiType: 'deepseek',
        models: ['deepseek-chat', 'deepseek-reasoner'],
        options: { apiKey: deepseekKey },
      });
    }

    // --- OpenAI (default fallback — must be last) ---
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      routers.push({
        apiType: 'openai',
        options: { apiKey: openaiKey },
      });
    }

    return routers;
  },
};
