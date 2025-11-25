import type { Post } from "@/entities/post";

import PostListItem from "./PostListItem";

type PostListProps = {
  posts: Post[];
};

export default function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return <EmptyPostListFallback />;
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col space-y-6">
      {posts.map((post) => (
        <PostListItem key={post.id} post={post} />
      ))}
    </div>
  );
}

function EmptyPostListFallback() {
  return (
    <div className="py-16 text-center">
      <p className="text-lg text-gray-500">아직 작성된 포스트가 없습니다.</p>
    </div>
  );
}
