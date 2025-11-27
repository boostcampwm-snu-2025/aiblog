import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { v7 as uuidv7 } from "uuid";
import { POSTS_DIR } from "@/constants/index.ts";
import {
  type PostListItem,
  type PostDetail,
  type CreatePostRequest,
  type UpdatePostRequest,
  type PostMeta,
} from "@/types/index.ts";
import {
  readFrontMatterPartial,
  parseFrontMatter,
  parseMarkdownWhole,
  serializeMarkdown,
} from "@/utils/markdown.ts";

export class PostService {
  private ensurePostsDir = async () => {
    await fsp.mkdir(POSTS_DIR, { recursive: true });
  };

  private idToPath = (id: string): string => path.join(POSTS_DIR, `${id}.md`);

  public list = async (): Promise<PostListItem[]> => {
    await this.ensurePostsDir();
    const files = await fsp.readdir(POSTS_DIR);
    const mdFiles = files.filter((f) => f.toLowerCase().endsWith(".md"));

    const items: PostListItem[] = [];
    for (const file of mdFiles) {
      const id = path.basename(file, ".md");
      const fullPath = path.join(POSTS_DIR, file);
      try {
        const fmText = await readFrontMatterPartial(fullPath);
        const meta: PostMeta = parseFrontMatter(fmText);
        if (!meta.title || !meta.date) {
          continue; // skip malformed entries
        }
        items.push({
          id,
          title: meta.title,
          tags: meta.tags ?? [],
          date: meta.date,
        });
      } catch {
        // skip unreadable/malformed file
        continue;
      }
    }

    // Sort by date desc (newest first)
    items.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    return items;
  };

  public getById = async (id: string): Promise<PostDetail> => {
    const filePath = this.idToPath(id);
    const content = await fsp.readFile(filePath, "utf8");
    const parsed = parseMarkdownWhole(content);
    return {
      id,
      title: parsed.meta.title ?? "",
      content: parsed.content ?? "",
      tags: parsed.meta.tags ?? [],
      date: parsed.meta.date ?? new Date(0).toISOString(),
    };
  };

  public create = async (req: CreatePostRequest): Promise<PostListItem> => {
    await this.ensurePostsDir();
    const id = uuidv7();
    const meta: PostMeta = {
      title: req.title,
      date: new Date().toISOString(),
      repo: req.repo,
      commit: req.commit,
      tags: req.tags ?? [],
    };
    const body = serializeMarkdown(meta, req.content ?? "");
    const filePath = this.idToPath(id);
    await fsp.writeFile(filePath, body, "utf8");
    return { id, title: meta.title, tags: meta.tags, date: meta.date };
  };

  public update = async (
    id: string,
    req: UpdatePostRequest,
  ): Promise<PostListItem> => {
    const filePath = this.idToPath(id);
    // Read existing
    const raw = await fsp.readFile(filePath, "utf8");
    const parsed = parseMarkdownWhole(raw);

    // Keep creation date, repo, commit
    const updatedMeta: PostMeta = {
      title: req.title ?? parsed.meta.title ?? "",
      date: parsed.meta.date ?? new Date().toISOString(),
      repo: parsed.meta.repo ?? "",
      commit: parsed.meta.commit ?? "",
      tags: Array.isArray(req.tags) ? req.tags : (parsed.meta.tags ?? []),
    };
    const updatedContent =
      typeof req.content === "string" ? req.content : (parsed.content ?? "");

    const newBody = serializeMarkdown(updatedMeta, updatedContent);
    await fsp.writeFile(filePath, newBody, "utf8");
    return {
      id,
      title: updatedMeta.title,
      tags: updatedMeta.tags ?? [],
      date: updatedMeta.date,
    };
  };

  public delete = async (id: string): Promise<void> => {
    const filePath = this.idToPath(id);
    // If file doesn't exist, this will throw ENOENT which controller maps to 404
    await fsp.unlink(filePath);
  };
}
