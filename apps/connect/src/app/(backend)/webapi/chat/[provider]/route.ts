import {
  AGENT_RUNTIME_ERROR_SET,
  type ChatCompletionErrorPayload,
  type ModelRuntime,
} from '@lobechat/model-runtime';
import { ChatErrorType } from '@lobechat/types';

import { checkAuth } from '@/app/(backend)/middleware/auth';
import { checkCredits, deductCredits } from '@/libs/subscription/credits';
import { createTraceOptions, initModelRuntimeFromDB } from '@/server/modules/ModelRuntime';
import { type ChatStreamPayload } from '@/types/openai/chat';
import { createErrorResponse } from '@/utils/errorResponse';
import { getTracePayload } from '@/utils/trace';

// If user don't use fluid compute, will build  failed
// this enforce user to enable fluid compute
export const maxDuration = 300;

export const POST = checkAuth(
  async (req: Request, { params, userId, serverDB, createRuntime, jwtPayload }) => {
    const provider = (await params)!.provider!;

    try {
      // ============  0. parse request to get model  ============ //
      const data = (await req.json()) as ChatStreamPayload;
      const model = data.model;

      // ============  1. check credit limit + provider restriction  ============ //
      const creditCheck = await checkCredits(serverDB, userId, model, provider);
      if (!creditCheck.allowed) {
        return createErrorResponse(ChatErrorType.SubscriptionPlanLimit, {
          error: { message: creditCheck.message },
          provider,
        });
      }

      // ============  2. init chat model   ============ //
      let modelRuntime: ModelRuntime;
      if (createRuntime) {
        // Legacy support for custom runtime creation
        modelRuntime = createRuntime(jwtPayload);
      } else {
        // Read user's provider config from database
        modelRuntime = await initModelRuntimeFromDB(serverDB, userId, provider);
      }

      // ============  3. deduct credits before LLM call (optimistic)  ============ //
      await deductCredits(serverDB, userId, model);

      // ============  4. create chat completion   ============ //

      const tracePayload = getTracePayload(req);

      let traceOptions = {};
      // If user enable trace
      if (tracePayload?.enabled) {
        traceOptions = createTraceOptions(data, { provider, trace: tracePayload });
      }

      const response = await modelRuntime.chat(data, {
        user: userId,
        ...traceOptions,
        signal: req.signal,
      });

      return response;
    } catch (e) {
      const {
        errorType = ChatErrorType.InternalServerError,
        error: errorContent,
        ...res
      } = e as ChatCompletionErrorPayload;

      const error = errorContent || e;

      const logMethod = AGENT_RUNTIME_ERROR_SET.has(errorType as string) ? 'warn' : 'error';
      // track the error at server side
      console[logMethod](`Route: [${provider}] ${errorType}:`, error);

      return createErrorResponse(errorType, { error, ...res, provider });
    }
  },
);
