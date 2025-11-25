import type { Post } from "@/entities/post";
import Viewer from "@/shared/editor/Viewer";
import { formatDate } from "@/shared/utils/format";

type PostDetailProps = {
  post: Post;
};

export default function PostDetail({ post }: PostDetailProps) {
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
        <Viewer content={post.content} />
      </article>
    </div>
  );
}
