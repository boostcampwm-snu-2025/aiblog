import { Navigate, useParams } from "react-router";

import { PATHS } from "@/constants/paths";
import { getPosts } from "@/features/post/api/getPosts";
import { formatDate } from "@/shared/utils/format";

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();

  const posts = getPosts();
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return <Navigate to={PATHS.notFound.getHref()} replace />;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8">
        <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>

        <div className="flex gap-4 text-sm text-gray-600">
          <span>작성일: {formatDate(post.createdAt)}</span>
          <span>최종 수정일: {formatDate(post.updatedAt)}</span>
        </div>
      </header>

      <article className="prose max-w-none">
        {/* 여기에 ToastUI Viewer가 들어갈 예정 */}
        <div>{post.content}</div>
      </article>
    </div>
  );
}
