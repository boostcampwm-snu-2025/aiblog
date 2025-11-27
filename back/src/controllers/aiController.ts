import type { Request, Response } from "express";
import { AiService, type AiGenerateRequest } from "@/services/AiService.ts";

const aiService = new AiService();

const sendSseData = (res: Response, data: string) => {
  // Split lines per SSE spec and send each line with a data: prefix
  for (const line of data.split(/\n/)) {
    res.write(`data: ${line}\n`);
  }
  res.write("\n");
};

export const generatePost = async (req: Request, res: Response) => {
  try {
    const body = req.body as Partial<AiGenerateRequest>;

    if (
      !body ||
      typeof body.commitMessage !== "string" ||
      typeof body.commitDate !== "string" ||
      !Array.isArray(body.files)
    ) {
      res
        .status(400)
        .json({
          error:
            "Invalid request body. Expected commitMessage, commitDate, files[].",
        });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");

    // Optional initial retry directive for SSE clients
    res.write("retry: 500\n\n");

    let stream: AsyncIterable<{ text?: string }>;
    try {
      stream = await aiService.generateStream({
        commitMessage: body.commitMessage,
        commitDate: body.commitDate,
        files: body.files as AiGenerateRequest["files"],
      });
    } catch (makeStreamErr) {
      res.write("event: error\n");
      sendSseData(
        res,
        (makeStreamErr as any)?.message ?? "Failed to start AI stream",
      );
      res.end();
      return;
    }

    try {
      for await (const chunk of stream) {
        const text = (chunk as any)?.text as string | undefined;
        if (text && text.length > 0) {
          sendSseData(res, text);
        }
      }
      // Signal end of stream
      res.write("event: end\n");
      res.write("data: [DONE]\n\n");
      res.end();
    } catch (streamErr) {
      res.write("event: error\n");
      sendSseData(res, (streamErr as any)?.message ?? "Stream error");
      res.end();
    }
  } catch (err) {
    const message = (err as any)?.message ?? "Internal server error";
    res.status(500).json({ error: message });
  }
};
