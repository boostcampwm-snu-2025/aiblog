import { useState } from "react";
import { useSavedBlogPosts } from "@features/saved";
import { BlogCard } from "@entities/blog-post";
import { QueryState, Modal, Button, MarkdownContent } from "@shared";
import type { BlogPostItem } from "@shared/api/types";

export function SavedPostsPage() {
  const query = useSavedBlogPosts();
  const [selected, setSelected] = useState<BlogPostItem | null>(null);
  const isOpen = selected !== null;
  const onClose = () => setSelected(null);

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
              onViewDetails={() => setSelected(post)}
            />
          ))}
        </div>
      </QueryState>
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl">
        {selected && (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {selected.title ?? "(제목 없음)"}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {selected.repository} · PR #{selected.prNumber}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <MarkdownContent content={selected.content} />
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <Button variant="outline" onClick={onClose}>
                닫기
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
