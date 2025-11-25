import { getPosts } from "./getPosts";

export const getPost = (id: string) => {
  const posts = getPosts();
  return posts.find((p) => p.id === id);
};
