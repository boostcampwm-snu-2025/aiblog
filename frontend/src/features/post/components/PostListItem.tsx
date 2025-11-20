import { Link } from "react-router";

import { PATHS } from "@/constants/paths";
import type { Post } from "@/entities/post";
import { formatDate } from "@/shared/utils/format";

type PostListItemProps = {
  post: Post;
};

export default function PostListItem({ post }: PostListItemProps) {
  return (
    <Link to={PATHS.post.detail.getHref(post.id)}>
      <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900 transition-colors hover:text-blue-600">
          {post.title}
        </h2>

        <p className="mb-4 line-clamp-3 leading-relaxed text-gray-700">{post.content}</p>

        <div className="flex gap-4 text-sm text-gray-500">
          <span>작성일: {formatDate(post.createdAt)}</span>
          {post.createdAt !== post.updatedAt && <span>수정일: {formatDate(post.updatedAt)}</span>}
        </div>
      </article>
    </Link>
  );
}
