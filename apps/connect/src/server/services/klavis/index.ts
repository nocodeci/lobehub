import type { LobeToolManifest } from '@lobechat/context-engine';
import type { LobeChatDatabase } from '@lobechat/database';
import debug from 'debug';

import { PluginModel } from '@/database/models/plugin';
import { getSmitheryClient, isSmitheryClientAvailable } from '@/libs/smithery';
import { type ToolExecutionResult } from '@/server/services/toolExecution/types';

const log = debug('lobe-server:klavis-service');

export interface KlavisToolExecuteParams {
  args: Record<string, any>;
  /** Tool identifier (same as server identifier, e.g., 'google-calendar') */
  identifier: string;
  toolName: string;
}

export interface KlavisServiceOptions {
  db?: LobeChatDatabase;
  userId?: string;
}

/**
 * Klavis Service (now backed by Smithery)
 *
 * Provides a unified interface for MCP tool execution via Smithery Connect.
 * Kept as "KlavisService" for backward compatibility with existing code.
 */
export class KlavisService {
  private db?: LobeChatDatabase;
  private userId?: string;
  private pluginModel?: PluginModel;

  constructor(options: KlavisServiceOptions = {}) {
    const { db, userId } = options;

    this.db = db;
    this.userId = userId;

    if (db && userId) {
      this.pluginModel = new PluginModel(db, userId);
    }

    log(
      'KlavisService initialized: hasDB=%s, hasUserId=%s, isClientAvailable=%s',
      !!db,
      !!userId,
      isSmitheryClientAvailable(),
    );
  }

  /**
   * Execute a tool via Smithery MCP connection
   * @param params - Tool execution parameters
   * @returns Tool execution result
   */
  async executeKlavisTool(params: KlavisToolExecuteParams): Promise<ToolExecutionResult> {
    const { identifier, toolName, args } = params;

    log('executeKlavisTool: %s/%s with args: %O', identifier, toolName, args);

    if (!isSmitheryClientAvailable()) {
      return {
        content: 'Smithery service is not configured on server',
        error: { code: 'SMITHERY_NOT_CONFIGURED', message: 'Smithery API key not found' },
        success: false,
      };
    }

    if (!this.pluginModel) {
      return {
        content: 'Service is not properly initialized',
        error: {
          code: 'SERVICE_NOT_INITIALIZED',
          message: 'Database and userId are required for tool execution',
        },
        success: false,
      };
    }

    try {
      const plugin = await this.pluginModel.findById(identifier);
      if (!plugin) {
        return {
          content: `Server "${identifier}" not found in database`,
          error: { code: 'SERVER_NOT_FOUND', message: `Server ${identifier} not found` },
          success: false,
        };
      }

      const klavisParams = plugin.customParams?.klavis;
      if (!klavisParams || !klavisParams.instanceId) {
        return {
          content: `Configuration not found for server "${identifier}"`,
          error: {
            code: 'CONFIG_NOT_FOUND',
            message: `Configuration missing for ${identifier}`,
          },
          success: false,
        };
      }

      const { instanceId } = klavisParams;

      log('executeKlavisTool: calling Smithery MCP with connectionId=%s', instanceId);

      const smitheryClient = getSmitheryClient();
      const result = await smitheryClient.callTool(instanceId, toolName, args);

      log('executeKlavisTool: result: %O', result);

      const content = result.content || [];
      const isError = result.isError || false;

      // Convert content array to string
      let resultContent = '';
      if (Array.isArray(content)) {
        resultContent = content
          .map((item: any) => {
            if (typeof item === 'string') return item;
            if (item.type === 'text' && item.text) return item.text;
            return JSON.stringify(item);
          })
          .join('\n');
      } else if (typeof content === 'string') {
        resultContent = content;
      } else {
        resultContent = JSON.stringify(content);
      }

      return {
        content: resultContent,
        success: !isError,
      };
    } catch (error) {
      const err = error as Error;
      console.error('KlavisService.executeKlavisTool error %s/%s: %O', identifier, toolName, err);

      return {
        content: err.message,
        error: { code: 'SMITHERY_ERROR', message: err.message },
        success: false,
      };
    }
  }

  /**
   * Fetch tool manifests from database
   * Gets user's connected servers and builds tool manifests for agent execution
   */
  async getKlavisManifests(): Promise<LobeToolManifest[]> {
    if (!this.pluginModel) {
      log('getKlavisManifests: pluginModel not available, returning empty array');
      return [];
    }

    try {
      const allPlugins = await this.pluginModel.query();

      const klavisPlugins = allPlugins.filter(
        (plugin) => plugin.customParams?.klavis?.isAuthenticated === true,
      );

      log('getKlavisManifests: found %d authenticated plugins', klavisPlugins.length);

      const manifests: LobeToolManifest[] = klavisPlugins
        .map((plugin) => {
          if (!plugin.manifest) return null;

          return {
            api: plugin.manifest.api || [],
            author: 'Smithery',
            homepage: 'https://smithery.ai',
            identifier: plugin.identifier,
            meta: plugin.manifest.meta || {
              avatar: '☁️',
              description: `Smithery MCP Server: ${plugin.customParams?.klavis?.serverName}`,
              tags: ['smithery', 'mcp'],
              title: plugin.customParams?.klavis?.serverName || plugin.identifier,
            },
            type: 'builtin',
            version: '1.0.0',
          };
        })
        .filter(Boolean) as LobeToolManifest[];

      log('getKlavisManifests: returning %d manifests', manifests.length);

      return manifests;
    } catch (error) {
      console.error('KlavisService.getKlavisManifests error: %O', error);
      return [];
    }
  }
}
