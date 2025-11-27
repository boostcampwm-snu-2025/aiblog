import type { Request, Response } from "express";
import { PostService } from "@/services/PostService.ts";
import type { CreatePostRequest, UpdatePostRequest } from "@/types/index.ts";

const postService = new PostService();

const handleFsError = (res: Response, err: unknown) => {
  const anyErr = err as any;
  if (anyErr?.code === "ENOENT") {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.status(500).json({ error: anyErr?.message ?? "Internal server error" });
};

export const listPosts = async (_req: Request, res: Response) => {
  try {
    const posts = await postService.list();
    res.status(200).json(posts);
  } catch (err) {
    handleFsError(res, err);
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const body = req.body as Partial<CreatePostRequest>;
    if (
      !body ||
      typeof body.title !== "string" ||
      typeof body.repo !== "string" ||
      typeof body.commit !== "string" ||
      typeof body.content !== "string" ||
      !Array.isArray(body.tags)
    ) {
      res.status(400).json({
        error: "Invalid body. Required: title, repo, commit, content, tags[].",
      });
      return;
    }

    const created = await postService.create({
      title: body.title,
      repo: body.repo,
      commit: body.commit,
      content: body.content,
      tags: body.tags as string[],
    });
    res.status(201).json(created);
  } catch (err) {
    handleFsError(res, err);
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const post = await postService.getById(id);
    res.status(200).json(post);
  } catch (err) {
    handleFsError(res, err);
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const body = req.body as Partial<UpdatePostRequest>;
    if (
      !body ||
      (typeof body.title !== "string" &&
        typeof body.content !== "string" &&
        !Array.isArray(body.tags))
    ) {
      res
        .status(400)
        .json({ error: "Provide at least one of: title, content, tags[]." });
      return;
    }
    const updated = await postService.update(id, {
      title: typeof body.title === "string" ? body.title : undefined,
      content: typeof body.content === "string" ? body.content : undefined,
      tags: Array.isArray(body.tags) ? (body.tags as string[]) : undefined,
    });
    res.status(200).json(updated);
  } catch (err) {
    handleFsError(res, err);
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    await postService.delete(id);
    res.status(204).send();
  } catch (err) {
    handleFsError(res, err);
  }
};
