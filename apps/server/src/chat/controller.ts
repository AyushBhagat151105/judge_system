import type { Request, Response, NextFunction } from "express";
import { createChatService } from "./service";
import logger from "@/lib/logger";
import asyncHandler from "@/lib/asyncHandler";
import { auth } from "@judge_system/auth";
import { fromNodeHeaders } from "better-auth/node";
import ApiError from "@/lib/ApiError";
import prisma from "@judge_system/db";

export const handleChat = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers)
  });

  const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";

  if (!session?.user) {
    // Enforce 1 free evaluation per IP address for anonymous users
    const anonymousCount = await prisma.evaluation.count({
      where: {
        ipAddress: clientIp,
        userId: null
      }
    });

    if (anonymousCount >= 1) {
      throw new ApiError(403, "Free limit reached. Please log in with Google to continue.");
    }
  }

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
    const stream = await createChatService(messages, session?.user?.id || null, clientIp);

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

export const handleGetHistory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers)
  });

  if (!session?.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const evaluations = await prisma.evaluation.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const history = evaluations.map((item) => {
    const report = item.report as any;
    return {
      id: item.id,
      prompt: item.prompt,
      businessName: report?.businessName || "Unknown Business",
      tagline: report?.tagline || "",
      verdict: report?.finalVerdict || "REJECTED",
      confidence: report?.confidenceScore || 0,
      createdAt: item.createdAt
    };
  });

  res.status(200).json({ history });
});

export const handleGetEvaluation = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers)
  });

  if (!session?.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const id = req.params.id as string;

  const evaluation = await prisma.evaluation.findFirst({
    where: {
      id,
      userId: session.user.id
    }
  });

  if (!evaluation) {
    throw new ApiError(404, "Evaluation not found");
  }

  res.status(200).json({ evaluation });
});

export const handleDeleteEvaluation = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers)
  });

  if (!session?.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const id = req.params.id as string;

  const evaluation = await prisma.evaluation.findFirst({
    where: {
      id,
      userId: session.user.id
    }
  });

  if (!evaluation) {
    throw new ApiError(404, "Evaluation not found");
  }

  await prisma.evaluation.delete({
    where: {
      id
    }
  });

  res.status(200).json({ message: "Evaluation deleted successfully" });
});
