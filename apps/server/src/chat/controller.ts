import type { Request, Response, NextFunction } from "express";
import { createChatService } from "./service";
import logger from "@/lib/logger";
import asyncHandler from "@/lib/asyncHandler";

export const handleChat = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { messages } = req.body;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  });

  const abortController = new AbortController();

  res.on("close", () => {
    logger.info("[ChatController] Client closed connection early, aborting.");
    abortController.abort();
  });

  try {
    const stream = await createChatService(messages);

    for await (const chunk of stream) {
      if (abortController.signal.aborted) {
        break;
      }
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }

    logger.info("[ChatController] Stream finished successfully. Closing HTTP response.");
    res.end();
  } catch (error: any) {
    logger.error(`[ChatController] Error during streaming: ${error.message || error}`, { stack: error.stack });
    try {
      res.write(`data: ${JSON.stringify({
        type: "RUN_ERROR",
        timestamp: Date.now(),
        error: { message: error.message || String(error) }
      })}\n\n`);
      res.end();
    } catch {
      if (!res.headersSent) {
        next(error);
      }
    }
  }
});
