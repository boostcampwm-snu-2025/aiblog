import { useQuery } from "@tanstack/react-query";
import { fetchAllBlogPosts } from "../../../shared/api/github";
import type { GetAllBlogPostsResponse } from "../../../shared/api/types";

export function useSavedBlogPosts() {
  return useQuery<GetAllBlogPostsResponse, Error>({
    queryKey: ["blog-posts", "all"],
    queryFn: fetchAllBlogPosts,
    staleTime: 30_000,
  });
}
