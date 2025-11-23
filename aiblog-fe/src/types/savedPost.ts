import type { PromptLang, PromptTone } from "./promptSettings";
import type { PostGenerateResponse } from "./githubPostData";

export type SavedPost = {
  id: string;
  createdAt: string;
  repo: string;
  lang: PromptLang;
  tone: PromptTone;
  content: string;
  sources: PostGenerateResponse["sources"];
};
