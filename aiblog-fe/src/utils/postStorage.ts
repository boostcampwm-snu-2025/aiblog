import type { PromptLang, PromptTone } from "../types/promptSettings";
import type { PostGenerateResponse } from "../types/githubPostData";

import { STORAGE_KEY } from "../constants/storage";

export type SavedPost = {
  id: string;
  createdAt: string;
  repo: string;
  lang: PromptLang;
  tone: PromptTone;
  content: string;
  sources: PostGenerateResponse["sources"];
};

const isBrowser = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export function loadSavedPosts(): SavedPost[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveSavedPosts(posts: SavedPost[]) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch {
    // Do nothing
  }
}

export function addSavedPost(input: {
  repo: string;
  lang: PromptLang;
  tone: PromptTone;
  content: string;
  sources: PostGenerateResponse["sources"];
}): SavedPost[] {
  const prev = loadSavedPosts();

  const id =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : String(Date.now());

  const newPost: SavedPost = {
    id,
    createdAt: new Date().toISOString(),
    repo: input.repo,
    lang: input.lang,
    tone: input.tone,
    content: input.content,
    sources: input.sources,
  };

  const next = [newPost, ...prev];
  saveSavedPosts(next);
  return next;
}

export function clearSavedPosts() {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Do nothing
  }
}
