import fs from "fs";

import type { PostMeta } from "@/types/index.ts";

const FRONT_MATTER_DELIM_RE = /^---\s*$/gm;
const parseTags = (s: string): string[] => {
  const arrayMatch = s.match(/^\[(.*)\]$/);
  if (arrayMatch) {
    const inner = arrayMatch[1] ?? "";
    return inner
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  }
  return s.length > 0 ? s.split(/\s+/).filter(Boolean) : [];
};

export const readFrontMatterPartial = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath, {
      encoding: "utf8",
      highWaterMark: 4096,
    });
    let buf = "";
    let found = false;

    const onChunk = (chunk: string | Buffer) => {
      buf += typeof chunk === "string" ? chunk : chunk.toString("utf8");
      const matches = [...buf.matchAll(FRONT_MATTER_DELIM_RE)].map(
        (m) => m.index ?? 0,
      );
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

    const [key, ...vals] = line.split(":");
    const val = vals.join(":");
    switch (key) {
      case "title":
        meta.title = val;
        break;
      case "date":
        meta.date = val;
        break;
      case "repo":
        meta.repo = val;
        break;
      case "commit":
        meta.commit = val;
        break;
      case "tags":
        meta.tags = parseTags(val);
        break;
    }
  }

  return meta;
};

export const parseMarkdownWhole = (
  fullText: string,
): { meta: PostMeta; content: string } => {
  const matches = [...fullText.matchAll(FRONT_MATTER_DELIM_RE)].map(
    (m) => m.index ?? 0,
  );
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
