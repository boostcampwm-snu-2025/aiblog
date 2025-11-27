import { Link, useNavigate } from "react-router";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getApiBase } from "@/utils";
import { type PostSummary } from "@/types/post";
import { formatDate } from "@/utils/date";
import { getPostHref } from "@/utils/routes";
import { useFetchJson } from "@/hooks/useFetchJson";

export const MainPage = () => {
  const navigate = useNavigate();
  const apiBase = getApiBase();
  const { data, loading, error } = useFetchJson<PostSummary[]>(
    `${apiBase}/posts`,
  );
  const posts = Array.isArray(data) ? data : [];

  const handleOpen = (id: string) => {
    navigate(getPostHref(id));
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {Array.from({ length: 3 }).map((_, idx) => (
          <article
            key={idx}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              <Skeleton height={28} width="80%" />
            </h2>
            <div className="text-sm text-gray-500 mb-3">
              <Skeleton width={160} />
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              <Skeleton count={2} />
            </p>
            <Skeleton width={100} height={20} />
          </article>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-white p-6 rounded-xl border border-red-200">
          <div className="text-red-700 font-semibold mb-1">Failed to load</div>
          <div className="text-sm text-red-600">{error.message}</div>
        </div>
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="space-y-4">
        <div className="bg-white p-6 rounded-xl border border-gray-100 text-gray-600">
          No posts yet. Create one from the Edit page.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <article
          key={post.id}
          onClick={() => handleOpen(post.id)}
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 cursor-pointer"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            <Link
              to={getPostHref(post.id)}
              className="hover:text-blue-600 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {post.title}
            </Link>
          </h2>

          <div className="text-sm text-gray-500 mb-3">
            {formatDate(post.date)}
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            {post.tags && post.tags.length
              ? post.tags.map((t) => `#${t}`).join(" ")
              : ""}
          </p>

          <Link
            to={getPostHref(post.id)}
            className="text-blue-600 font-medium hover:underline inline-flex items-center"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Read more about ${post.title}`}
          >
            Read more
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              ></path>
            </svg>
          </Link>
        </article>
      ))}
    </div>
  );
};
