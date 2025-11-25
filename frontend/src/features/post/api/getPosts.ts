import type { Post } from "@/entities/post";

import { getLocalStorage } from "@/shared/utils/localStorage";

import { STORAGE_KEY } from "./constants";

export const getPosts = (): Post[] => {
  return getLocalStorage<Post[]>(STORAGE_KEY) ?? [];
};
