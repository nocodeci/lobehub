import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

/**
 * Smithery Service Configuration
 *
 * Architecture:
 * - Server-side: SMITHERY_API_KEY is stored and used only on the server
 * - Client-side: Smithery enabled status is provided via serverConfig store (enableKlavis)
 * - Client calls server APIs which use the API key
 *
 * Security:
 * - API key is NEVER exposed to the client
 * - Client gets enabled status from server config
 */
export const getSmitheryConfig = () => {
  return createEnv({
    client: {},
    runtimeEnv: {
      SMITHERY_API_KEY: process.env.SMITHERY_API_KEY,
    },
    server: {
      SMITHERY_API_KEY: z.string().optional(),
    },
  });
};

export const smitheryEnv = getSmitheryConfig();

/**
 * Smithery namespace for Connect app
 */
export const SMITHERY_NAMESPACE = 'wozif-connect';

/**
 * Get Smithery API Key (server-side only)
 * IMPORTANT: This should only be called from server-side code
 */
export const getServerSmitheryApiKey = (): string | undefined => {
  if (typeof window !== 'undefined') {
    console.error('[Smithery] Attempted to access API key from client-side!');
    return undefined;
  }
  return smitheryEnv.SMITHERY_API_KEY;
};
