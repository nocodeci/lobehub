import { z } from 'zod';

import { authedProcedure, router } from '@/libs/trpc/lambda';
import { getSmitheryClient, makeConnectionId } from '@/libs/smithery';
import { MCPService } from '@/server/services/mcp';

/**
 * Klavis/Smithery procedure with client initialized in context
 */
const klavisProcedure = authedProcedure.use(async (opts) => {
  const smitheryClient = getSmitheryClient();

  return opts.next({
    ctx: { ...opts.ctx, smitheryClient },
  });
});

/**
 * Klavis router for tools (now backed by Smithery)
 * Contains callTool and listTools which call Smithery MCP API
 */
export const klavisRouter = router({
  /**
   * Call a tool via Smithery MCP connection
   */
  callTool: klavisProcedure
    .input(
      z.object({
        connectionId: z.string().optional(),
        serverUrl: z.string(),
        toolArgs: z.record(z.unknown()).optional(),
        toolName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Use connectionId if provided, otherwise derive from serverUrl
        const connId = input.connectionId || input.serverUrl;

        const result = await ctx.smitheryClient.callTool(
          connId,
          input.toolName,
          input.toolArgs as Record<string, unknown> | undefined,
        );

        // Process the response using the common MCP tool call result processor
        const processedResult = await MCPService.processToolCallResult({
          content: (result.content || []) as any[],
          isError: result.isError,
        });

        return processedResult;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        return {
          content: errorMsg,
          state: {
            content: [{ text: errorMsg, type: 'text' }],
            isError: true,
          },
          success: false,
        };
      }
    }),

  /**
   * List tools available on a Smithery MCP connection
   */
  listTools: klavisProcedure
    .input(
      z.object({
        connectionId: z.string().optional(),
        serverUrl: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const connId = input.connectionId || input.serverUrl;
      const response = await ctx.smitheryClient.listTools(connId);

      return {
        tools: response.tools,
      };
    }),
});
