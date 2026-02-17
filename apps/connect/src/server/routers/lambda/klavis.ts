import type { LobeChatPluginManifest } from '@lobehub/chat-plugin-sdk';
import { z } from 'zod';

import { PluginModel } from '@/database/models/plugin';
import { authedProcedure, router } from '@/libs/trpc/lambda';
import { serverDatabase } from '@/libs/trpc/lambda/middleware';
import { getSmitheryClient, makeConnectionId } from '@/libs/smithery';

/**
 * Klavis procedure with Smithery client and database access
 * (kept as "klavis" name for backward compatibility with frontend store)
 */
const klavisProcedure = authedProcedure.use(serverDatabase).use(async (opts) => {
  const smitheryClient = getSmitheryClient();
  const pluginModel = new PluginModel(opts.ctx.serverDB, opts.ctx.userId);

  return opts.next({
    ctx: { ...opts.ctx, pluginModel, smitheryClient },
  });
});

export const klavisRouter = router({
  /**
   * Create a Smithery MCP connection and save to database
   * Returns: { serverUrl, instanceId, oauthUrl?, identifier, serverName }
   */
  createServerInstance: klavisProcedure
    .input(
      z.object({
        /** Identifier for storage (e.g., 'google-calendar') */
        identifier: z.string(),
        /** Smithery MCP URL for this server */
        mcpUrl: z.string().optional(),
        /** Server name for display (e.g., 'Google Calendar') */
        serverName: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { serverName, userId, identifier, mcpUrl } = input;

      // Generate a connection ID for this user+server
      const connectionId = makeConnectionId(userId, identifier);

      // Determine the MCP URL - use provided or fallback to Smithery pattern
      const resolvedMcpUrl = mcpUrl || `https://server.smithery.ai/${identifier}`;

      // Create connection via Smithery Connect API
      const response = await ctx.smitheryClient.createConnection({
        connectionId,
        mcpUrl: resolvedMcpUrl,
        metadata: { userId },
        name: serverName,
      });

      const isAuthenticated = response.status?.state === 'connected';
      const oauthUrl = response.status?.state === 'auth_required'
        ? response.status.authorizationUrl
        : undefined;

      // Try to get tools if connected
      let tools: any[] = [];
      if (isAuthenticated) {
        try {
          const toolsResponse = await ctx.smitheryClient.listTools(connectionId);
          tools = toolsResponse.tools || [];
        } catch {
          // Tools may not be available yet
        }
      }

      // Save to database
      const manifest: LobeChatPluginManifest = {
        api: tools.map((tool: any) => ({
          description: tool.description || '',
          name: tool.name,
          parameters: tool.inputSchema || { properties: {}, type: 'object' },
        })),
        identifier,
        meta: {
          avatar: '🔌',
          description: `Smithery MCP Server: ${serverName}`,
          title: serverName,
        },
        type: 'default',
      };

      await ctx.pluginModel.create({
        customParams: {
          klavis: {
            instanceId: connectionId,
            isAuthenticated,
            oauthUrl,
            serverName,
            serverUrl: resolvedMcpUrl,
          },
        },
        identifier,
        manifest,
        source: 'klavis',
        type: 'plugin',
      });

      return {
        identifier,
        instanceId: connectionId,
        isAuthenticated,
        oauthUrl,
        serverName,
        serverUrl: resolvedMcpUrl,
      };
    }),

  /**
   * Delete a server connection
   */
  deleteServerInstance: klavisProcedure
    .input(
      z.object({
        /** Identifier for storage (e.g., 'google-calendar') */
        identifier: z.string(),
        instanceId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Delete Smithery connection
      try {
        await ctx.smitheryClient.deleteConnection(input.instanceId);
      } catch (error) {
        // Connection may already be deleted on Smithery side
        console.warn('[Smithery] Failed to delete connection:', error);
      }

      // Delete from database (using identifier)
      await ctx.pluginModel.delete(input.identifier);

      return { success: true };
    }),

  /**
   * Get Klavis/Smithery plugins from database
   */
  getKlavisPlugins: klavisProcedure.query(async ({ ctx }) => {
    const allPlugins = await ctx.pluginModel.query();
    return allPlugins.filter((plugin) => plugin.customParams?.klavis);
  }),

  /**
   * Get server instance status from Smithery API
   */
  getServerInstance: klavisProcedure
    .input(
      z.object({
        instanceId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        const response = await ctx.smitheryClient.getConnection(input.instanceId);
        const isAuthenticated = response.status?.state === 'connected';
        const authNeeded = response.status?.state === 'auth_required';

        return {
          authNeeded,
          error: undefined,
          externalUserId: undefined,
          instanceId: response.connectionId,
          isAuthenticated,
          oauthUrl: response.status?.authorizationUrl,
          platform: undefined,
          serverName: response.name,
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const isAuthError =
          errorMessage.includes('401') ||
          errorMessage.includes('403') ||
          errorMessage.includes('not found');

        if (isAuthError) {
          return {
            authNeeded: true,
            error: 'AUTH_ERROR',
            externalUserId: undefined,
            instanceId: input.instanceId,
            isAuthenticated: false,
            oauthUrl: undefined,
            platform: undefined,
            serverName: undefined,
          };
        }

        throw error;
      }
    }),

  getUserIntergrations: klavisProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const response = await ctx.smitheryClient.listConnections({
        metadata: { userId: input.userId },
      });

      return {
        integrations: (response.data || []).map((conn) => ({
          connectionId: conn.connectionId,
          name: conn.name,
          status: conn.status?.state,
        })),
      };
    }),

  /**
   * Remove plugin from database by identifier
   */
  removeKlavisPlugin: klavisProcedure
    .input(
      z.object({
        /** Identifier for storage (e.g., 'google-calendar') */
        identifier: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.pluginModel.delete(input.identifier);
      return { success: true };
    }),

  /**
   * Update plugin with tools and auth status in database
   */
  updateKlavisPlugin: klavisProcedure
    .input(
      z.object({
        /** Identifier for storage (e.g., 'google-calendar') */
        identifier: z.string(),
        instanceId: z.string(),
        isAuthenticated: z.boolean(),
        oauthUrl: z.string().optional(),
        /** Server name for display (e.g., 'Google Calendar') */
        serverName: z.string(),
        serverUrl: z.string(),
        tools: z.array(
          z.object({
            description: z.string().optional(),
            inputSchema: z.any().optional(),
            name: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { identifier, serverName, serverUrl, instanceId, tools, isAuthenticated, oauthUrl } =
        input;

      const existingPlugin = await ctx.pluginModel.findById(identifier);

      const manifest: LobeChatPluginManifest = {
        api: tools.map((tool) => ({
          description: tool.description || '',
          name: tool.name,
          parameters: tool.inputSchema || { properties: {}, type: 'object' },
        })),
        identifier,
        meta: existingPlugin?.manifest?.meta || {
          avatar: '🔌',
          description: `Smithery MCP Server: ${serverName}`,
          title: serverName,
        },
        type: 'default',
      };

      const customParams = {
        klavis: {
          instanceId,
          isAuthenticated,
          oauthUrl,
          serverName,
          serverUrl,
        },
      };

      if (existingPlugin) {
        await ctx.pluginModel.update(identifier, { customParams, manifest });
      } else {
        await ctx.pluginModel.create({
          customParams,
          identifier,
          manifest,
          source: 'klavis',
          type: 'plugin',
        });
      }

      return { savedCount: tools.length };
    }),
});

export type KlavisRouter = typeof klavisRouter;
