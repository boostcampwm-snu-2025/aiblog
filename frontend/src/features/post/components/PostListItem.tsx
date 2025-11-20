import { Link } from "react-router";

import { PATHS } from "@/constants/paths";
import type { Post } from "@/entities/post";
import { formatDate } from "@/shared/utils/format";
import { stripMarkdown } from "@/shared/utils/markdown";

type PostListItemProps = {
  post: Post;
};

export default function PostListItem({ post }: PostListItemProps) {
  const plainContent = stripMarkdown(post.content);

  return (
    <Link to={PATHS.post.detail.getHref(post.id)}>
      <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
        <Title title={post.title} />
        <Content content={plainContent} />
        <PostMetadata createdAt={post.createdAt} updatedAt={post.updatedAt} />
      </article>
    </Link>
  );
}

function Title({ title }: { title: string }) {
  return <h2 className="mb-3 text-2xl font-semibold text-gray-900">{title}</h2>;
}

function Content({ content }: { content: string }) {
  return <p className="mb-4 line-clamp-3 leading-relaxed text-gray-700">{content}</p>;
}

function PostMetadata({ createdAt, updatedAt }: { createdAt: string; updatedAt: string }) {
  return (
    <section className="flex gap-4 text-sm text-gray-500">
      <span>작성일: {formatDate(createdAt)}</span>
      {createdAt !== updatedAt && <span>수정일: {formatDate(updatedAt)}</span>}
    </section>
  );
}
