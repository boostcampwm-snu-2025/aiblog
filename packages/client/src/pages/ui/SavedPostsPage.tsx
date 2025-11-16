import { useSavedBlogPosts } from "../../features/saved/model/useSavedBlogPosts";
import { BlogCard } from "../../entities/blog-post";
import { QueryState } from "../../shared";

export function SavedPostsPage() {
  const query = useSavedBlogPosts();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Saved Posts</h1>
      <QueryState
        isLoading={query.isLoading}
        error={query.error}
        isEmpty={(query.data?.posts.length ?? 0) === 0}
        loadingMessage="Loading saved posts..."
        emptyMessage="No saved blog posts found"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {query.data?.posts.map((post) => (
            <BlogCard
              key={post.id}
              title={post.title ?? "(제목 없음)"}
              content={post.content}
              onViewDetails={() => {}}
            />
          ))}
        </div>
      </QueryState>
    </div>
  );
}
