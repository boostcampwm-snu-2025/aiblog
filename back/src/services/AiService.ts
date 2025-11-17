import { GoogleGenAI } from "@google/genai";
import type { CommitFile } from "../types/index.ts";

export interface AiGenerateRequest {
  commitMessage: string;
  commitDate: string; // ISO date-time
  files: CommitFile[];
}

export class AiService {
  private ai: GoogleGenAI;

  constructor() {
    // The client reads the API key from GEMINI_API_KEY env var
    this.ai = new GoogleGenAI({});
  }

  private buildPrompt = (input: AiGenerateRequest): string => {
    const header = [
      "You are an engineering blogger writing for experienced developers.",
      "Based on the provided commit details, craft a clear, engaging blog-post style article in Markdown.",
      "Focus on intent, impact, and technical nuance—not just a raw summary.",
    ].join(" \n");

    const outputReqs = [
      "Output must be valid GitHub-Flavored Markdown.",
      "Do NOT include YAML front matter.",
      "Structure:",
      "# Catchy title",
      "Short introduction (2–3 sentences)",
      "## What changed (bullet list)",
      "## Why it matters",
      "## Deep dive (subsections per key file/area; include short code snippets if helpful)",
      "## Next steps",
      "Friendly, blog-esque tone. Avoid raw diff dumps; summarize patches into explanations.",
    ].join(" \n- ");

    const context = `Commit metadata:\n- Message: ${input.commitMessage}\n- Date: ${input.commitDate}`;
    const filesJson = JSON.stringify(input.files ?? [], null, 2);

    return [
      header,
      "",
      "Constraints and output requirements:\n- " + outputReqs,
      "",
      "Context below. Use it to write the article:",
      context,
      "Changed files (JSON with filename, status, additions, deletions, changes, patch):",
      "```json",
      filesJson,
      "```",
      "",
      "Begin the Markdown article now.",
    ].join("\n\n");
  };

  public generateStream = async (
    input: AiGenerateRequest,
  ): Promise<AsyncIterable<{ text?: string }>> => {
    const contents = this.buildPrompt(input);
    const stream = await this.ai.models.generateContentStream({
      model: "gemini-2.5-pro",
      contents,
      config: {
        thinkingConfig: {
          thinkingBudget: 128,
        },
      },
    });

    return stream as AsyncIterable<{ text?: string }>;
  };
}
