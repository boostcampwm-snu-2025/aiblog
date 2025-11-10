import fs from "fs";

import type { PostMeta } from "../types/index.ts";

const FRONT_MATTER_DELIM_RE = /^---\s*$/gm;

export const readFrontMatterPartial = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath, { encoding: "utf8", highWaterMark: 4096 });
    let buf = "";
    let found = false;

    const onChunk = (chunk: string | Buffer) => {
      buf += typeof chunk === "string" ? chunk : chunk.toString("utf8");
      const matches = [...buf.matchAll(FRONT_MATTER_DELIM_RE)].map((m) => m.index ?? 0);
      if (matches.length >= 2) {
        const first = matches[0]!;
        const second = matches[1]!;
        // Extract between the two delimiter lines
        const head = buf.slice(0, first);
        // Ensure front matter starts at top of file; otherwise, reject
        if (first !== 0) {
          cleanup();
          reject(new Error("No front matter at file start"));
          return;
        }
        // Find end-of-line after first delimiter
        const firstEol = buf.indexOf("\n", first);
        const secondLineStart = firstEol >= 0 ? firstEol + 1 : first + 4;
        const secondEol = buf.indexOf("\n", second);
        const secondLineEnd = secondEol >= 0 ? second : second;
        const fm = buf.slice(secondLineStart, secondLineEnd).trim();
        found = true;
        cleanup();
        resolve(fm);
      }
    };

    const onEnd = () => {
      if (!found) {
        reject(new Error("Front matter not found"));
      }
    };

    const onError = (err: unknown) => {
      cleanup();
      reject(err);
    };

    const cleanup = () => {
      stream.off("data", onChunk);
      stream.off("end", onEnd);
      stream.off("error", onError);
      try {
        stream.destroy();
      } catch {}
    };

    stream.on("data", onChunk);
    stream.on("end", onEnd);
    stream.on("error", onError);
  });
};

export const parseFrontMatter = (fmText: string): PostMeta => {
  // Simple line-based parsing per project’s front matter structure
  const meta: PostMeta = {
    title: "",
    date: "",
    repo: "",
    commit: "",
    tags: [],
  };

  const lines = fmText.split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    if (line.startsWith("title:")) {
      meta.title = line.slice("title:".length).trim();
    } else if (line.startsWith("date:")) {
      meta.date = line.slice("date:".length).trim();
    } else if (line.startsWith("repo:")) {
      meta.repo = line.slice("repo:".length).trim();
    } else if (line.startsWith("commit:")) {
      meta.commit = line.slice("commit:".length).trim();
    } else if (line.startsWith("tags:")) {
      const rest = line.slice("tags:".length).trim();
      const match = rest.match(/^\[(.*)\]$/);
      if (match) {
        const inner = match[1] ?? "";
        meta.tags = inner
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0);
      } else if (rest.length > 0) {
        // Fallback: space-separated
        meta.tags = rest.split(/\s+/).filter(Boolean);
      }
    }
  }

  return meta;
};

export const parseMarkdownWhole = (
  fullText: string
): { meta: PostMeta; content: string } => {
  const matches = [...fullText.matchAll(FRONT_MATTER_DELIM_RE)].map((m) => m.index ?? 0);
  if (matches.length >= 2 && matches[0] === 0) {
    const first = matches[0]!;
    const second = matches[1]!;
    const firstEol = fullText.indexOf("\n", first);
    const secondLineStart = firstEol >= 0 ? firstEol + 1 : first + 4;
    const secondEol = fullText.indexOf("\n", second);
    const secondLineEnd = secondEol >= 0 ? second : second;
    const fm = fullText.slice(secondLineStart, secondLineEnd).trim();

    const afterSecondEol = secondEol >= 0 ? secondEol + 1 : second + 4;
    const body = fullText.slice(afterSecondEol);
    return { meta: parseFrontMatter(fm), content: body };
  }
  // No front matter; return defaults
  return {
    meta: { title: "", date: "", repo: "", commit: "", tags: [] },
    content: fullText,
  };
};

export const serializeMarkdown = (meta: PostMeta, content: string): string => {
  const tags = (meta.tags ?? []).join(", ");
  const header = [
    "---",
    `title: ${meta.title}`,
    `date: ${meta.date}`,
    `repo: ${meta.repo}`,
    `commit: ${meta.commit}`,
    `tags: [${tags}]`,
    "---",
  ].join("\n");
  return `${header}\n\n${content ?? ""}`;
};
