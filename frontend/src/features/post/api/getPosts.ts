import type { Post } from "@/entities/post";

import { STORAGE_KEY } from "./constants";

export const getPosts = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? (JSON.parse(data) as Post[]) : [];
};
