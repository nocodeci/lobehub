import debug from 'debug';

import { SMITHERY_NAMESPACE, getServerSmitheryApiKey } from '@/config/smithery';

const log = debug('lobe-server:smithery');

const SMITHERY_API_BASE = 'https://api.smithery.ai';

/**
 * Smithery Connect REST API Client
 *
 * Replaces the Klavis SDK with Smithery's managed MCP service.
 * Uses raw fetch calls to avoid extra dependencies.
 */
export class SmitheryClient {
  private apiKey: string;
  private namespace: string;

  constructor(options: { apiKey: string; namespace?: string }) {
    this.apiKey = options.apiKey;
    this.namespace = options.namespace || SMITHERY_NAMESPACE;
  }

  private async request(path: string, options: RequestInit = {}): Promise<any> {
    const url = `${SMITHERY_API_BASE}${path}`;
    log('request: %s %s', options.method || 'GET', url);

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      const error = new Error(`Smithery API error: ${response.status} ${response.statusText}`) as any;
      error.statusCode = response.status;
      error.body = body;
      log('request error: %s %s -> %d %s', options.method || 'GET', url, response.status, body);
      throw error;
    }

    const text = await response.text();
    if (!text) return {};
    try {
      return JSON.parse(text);
    } catch {
      return { text };
    }
  }

  /**
   * Create or update a connection to an MCP server
   * Maps to: Klavis createServerInstance
   *
   * @returns Connection with status (connected | auth_required)
   */
  async createConnection(params: {
    connectionId: string;
    mcpUrl: string;
    metadata?: Record<string, string>;
    name?: string;
  }): Promise<{
    authorizationUrl?: string;
    connectionId: string;
    serverInfo?: { name?: string; version?: string };
    status: { authorizationUrl?: string; state: 'connected' | 'auth_required' | 'error'; message?: string };
  }> {
    const { connectionId, mcpUrl, name, metadata } = params;

    const result = await this.request(`/connect/${this.namespace}`, {
      body: JSON.stringify({
        connectionId,
        mcpUrl,
        metadata,
        name,
      }),
      method: 'POST',
    });

    log('createConnection result: %O', result);
    return result;
  }

  /**
   * Get connection status
   * Maps to: Klavis getServerInstance
   */
  async getConnection(connectionId: string): Promise<{
    authorizationUrl?: string;
    connectionId: string;
    metadata?: Record<string, string>;
    name?: string;
    serverInfo?: { name?: string; version?: string };
    status: { authorizationUrl?: string; state: 'connected' | 'auth_required' | 'error'; message?: string };
  }> {
    return this.request(`/connect/${this.namespace}/${connectionId}`);
  }

  /**
   * Delete a connection
   * Maps to: Klavis deleteServerInstance
   */
  async deleteConnection(connectionId: string): Promise<void> {
    await this.request(`/connect/${this.namespace}/${connectionId}`, {
      method: 'DELETE',
    });
  }

  /**
   * List connections, optionally filtered by metadata
   * Maps to: Klavis getUserIntegrations
   */
  async listConnections(params?: {
    metadata?: Record<string, string>;
  }): Promise<{
    data: Array<{
      authorizationUrl?: string;
      connectionId: string;
      metadata?: Record<string, string>;
      name?: string;
      status: { state: 'connected' | 'auth_required' | 'error' };
    }>;
  }> {
    let path = `/connect/${this.namespace}`;
    if (params?.metadata) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params.metadata)) {
        searchParams.set(`metadata.${key}`, value);
      }
      path += `?${searchParams.toString()}`;
    }
    return this.request(path);
  }

  /**
   * Call an MCP method on a connection (tools/list or tools/call)
   * Maps to: Klavis callTools / listTools
   */
  async mcpCall(
    connectionId: string,
    method: string,
    params: Record<string, any> = {},
  ): Promise<any> {
    const result = await this.request(`/connect/${this.namespace}/${connectionId}/mcp`, {
      body: JSON.stringify({
        id: Date.now(),
        jsonrpc: '2.0',
        method,
        params,
      }),
      method: 'POST',
    });

    log('mcpCall %s/%s result: %O', connectionId, method, result);

    // Handle JSON-RPC response
    if (result.error) {
      throw new Error(result.error.message || JSON.stringify(result.error));
    }

    return result.result;
  }

  /**
   * List tools available on a connection
   * Maps to: Klavis listTools / getTools
   */
  async listTools(connectionId: string): Promise<{
    tools: Array<{
      description?: string;
      inputSchema?: any;
      name: string;
    }>;
  }> {
    const result = await this.mcpCall(connectionId, 'tools/list', {});
    return { tools: result?.tools || [] };
  }

  /**
   * Call a tool on a connection
   * Maps to: Klavis callTools
   */
  async callTool(
    connectionId: string,
    toolName: string,
    toolArgs?: Record<string, unknown>,
  ): Promise<{
    content?: any[];
    isError?: boolean;
  }> {
    const result = await this.mcpCall(connectionId, 'tools/call', {
      arguments: toolArgs || {},
      name: toolName,
    });

    return {
      content: result?.content || [],
      isError: result?.isError || false,
    };
  }
}

/**
 * Global Smithery Client instance cache (server-side only)
 */
let smitheryClientInstance: { apiKey: string; client: SmitheryClient } | undefined;

/**
 * Get or create Smithery Client instance (server-side only)
 * The instance is cached and reused if the API key hasn't changed
 */
export const getSmitheryClient = (): SmitheryClient => {
  const apiKey = getServerSmitheryApiKey();

  if (!apiKey) {
    throw new Error('Smithery API key is not configured on server');
  }

  if (!smitheryClientInstance || smitheryClientInstance.apiKey !== apiKey) {
    smitheryClientInstance = {
      apiKey,
      client: new SmitheryClient({ apiKey }),
    };
  }

  return smitheryClientInstance.client;
};

/**
 * Check if Smithery client is available (has API key configured)
 */
export const isSmitheryClientAvailable = (): boolean => {
  return !!getServerSmitheryApiKey();
};

/**
 * Generate a connection ID for a user+server combination
 */
export const makeConnectionId = (userId: string, identifier: string): string => {
  return `${userId}-${identifier}`;
};
