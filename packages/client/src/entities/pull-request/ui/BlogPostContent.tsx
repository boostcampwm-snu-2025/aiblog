import { MarkdownContent } from "@shared/index";

type BlogPostContentProps = {
  blogPost: string | null;
  title?: string | null;
};

export function BlogPostContent({ blogPost, title }: BlogPostContentProps) {
  if (!blogPost) {
    return null;
  }

  return (
    <div className="space-y-4">
      {title && <h1 className="text-2xl font-bold text-gray-900">{title}</h1>}
      <MarkdownContent content={blogPost} />
    </div>
  );
}
