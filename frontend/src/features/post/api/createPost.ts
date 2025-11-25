import type { Post } from "@/entities/post";

import { setLocalStorage } from "@/shared/utils/localStorage";
import { generateUUID } from "@/shared/utils/uuid";

import { STORAGE_KEY } from "./constants";
import { getPosts } from "./getPosts";

export const createPost = (post: Omit<Post, "id" | "createdAt" | "updatedAt">): Post => {
  const posts = getPosts();
  const now = new Date().toISOString();

  const newPost: Post = {
    ...post,
    id: generateUUID(),
    createdAt: now,
    updatedAt: now,
  };

  const newPosts = [newPost, ...posts];
  setLocalStorage(STORAGE_KEY, newPosts);

  return newPost;
};
