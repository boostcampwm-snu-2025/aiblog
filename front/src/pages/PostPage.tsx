import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import ReactMarkdown from "react-markdown";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getApiBase } from "@/utils";
import { type PostDetail } from "@/types/post";
import { formatDate } from "@/utils/date";
import { useFetchJson } from "@/hooks/useFetchJson";

export const PostPage = () => {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const id = search.get("id");

  const apiBase = getApiBase();
  const url = id ? `${apiBase}/posts/${encodeURIComponent(id)}` : null;
  const { data: post, loading, error } = useFetchJson<PostDetail>(url);

  useEffect(() => {
    if (!id) {
      navigate("/", { replace: true });
    }
  }, [id, navigate]);

  useEffect(() => {
    if (error) {
      navigate("/", { replace: true });
    }
  }, [error, navigate]);

  return (
    <div className="space-y-6">
      {/* Back link */}
      <div className="mb-2">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 group font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to all posts
        </Link>
      </div>

      {/* Article */}
      <article className="bg-white p-6 sm:p-8 lg:p-10 rounded-xl shadow-sm border border-gray-100">
        {loading ? (
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              <Skeleton height={36} width="70%" />
            </h1>
            <div className="text-base text-gray-500 mb-8">
              <Skeleton width={180} />
            </div>
            <div className="space-y-4">
              <Skeleton count={6} />
            </div>
          </div>
        ) : post ? (
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              {post.title}
            </h1>
            <div className="text-base text-gray-500 mb-8">
              {formatDate(post.date)}
            </div>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <ReactMarkdown
                components={{
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      className="text-blue-600 hover:underline"
                      target={
                        props.href?.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        props.href?.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                    />
                  ),
                  h1: ({ node, ...props }) => (
                    <h1
                      {...props}
                      className="text-3xl lg:text-4xl font-bold text-gray-900 !mt-10 mb-4"
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      {...props}
                      className="text-2xl font-semibold text-gray-900 !mt-10 mb-4"
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      {...props}
                      className="text-xl font-semibold text-gray-900 !mt-10 mb-4"
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p {...props} className="text-gray-700 leading-relaxed" />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      {...props}
                      className="list-disc list-outside space-y-2 pl-6"
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      {...props}
                      className="list-decimal list-outside space-y-2 pl-6"
                    />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      {...props}
                      className="border-l-4 border-blue-500 bg-blue-50 p-4 my-6 rounded-r-lg text-blue-900 italic"
                    />
                  ),
                  pre: ({ node, ...props }) => (
                    <pre
                      {...props}
                      className="bg-gray-900 text-gray-50 p-4 rounded-lg overflow-x-auto"
                    />
                  ),
                  code: ({ node, inline, className, ...props }: any) => (
                    <code
                      {...props}
                      className={`font-mono ${inline ? "bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded" : ""} ${
                        className ?? ""
                      }`}
                    />
                  ),
                  hr: ({ node, ...props }) => (
                    <hr {...props} className="my-8 border-gray-200" />
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        ) : null}
      </article>
    </div>
  );
};
