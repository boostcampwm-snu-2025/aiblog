import { getPosts } from "@/features/post/api/getPosts";
import PostList from "@/features/post/components/PostList";

export default function HomePage() {
  const posts = getPosts();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <PostList posts={posts} />
    </div>
  );
}
