import type { Post } from "@/entities/post";
import { customConsole } from "@/shared/utils/console";
import { getLocalStorage, setLocalStorage } from "@/shared/utils/localStorage";

import { STORAGE_KEY } from "./constants";

export const deletePost = (postId: string): boolean => {
  try {
    const posts = getLocalStorage<Post[]>(STORAGE_KEY) ?? [];
    const filteredPosts = posts.filter((post) => post.id !== postId);
    setLocalStorage(STORAGE_KEY, filteredPosts);
    return true;
  } catch (error) {
    customConsole.error(`Error deleting post with id "${postId}":`, error);
    return false;
  }
};
