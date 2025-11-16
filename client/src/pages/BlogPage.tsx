import BlogView from "../component/BlogView";

export default function BlogPage({ content }: { content: string }) {
  return <BlogView content={content} />;
}
