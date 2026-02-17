/**
 * Klavis Client Compatibility Layer
 *
 * This module re-exports the Smithery client as the "Klavis" client
 * to maintain backward compatibility with existing code that imports from '@/libs/klavis'.
 * The actual API calls now go through Smithery instead of Klavis.
 */
export {
  SmitheryClient as KlavisClient,
  getSmitheryClient as getKlavisClient,
  isSmitheryClientAvailable as isKlavisClientAvailable,
  makeConnectionId,
} from '@/libs/smithery';
