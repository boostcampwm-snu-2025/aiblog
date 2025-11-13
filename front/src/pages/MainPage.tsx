import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getApiBase } from "../utils";

interface PostSummary {
  id: string;
  title: string;
  tags: string[];
  date: string; // ISO string
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
};

export const MainPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiBase = getApiBase();

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${apiBase}/posts`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error(`Failed to load posts (${res.status})`);
        }
        const data = (await res.json()) as PostSummary[];
        setPosts(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (e?.name !== "AbortError") {
          setError(e?.message || "Failed to load posts");
        }
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [apiBase]);

  const handleOpen = (id: string) => {
    navigate(`/post?id=${encodeURIComponent(id)}`);
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
          <div className="text-sm text-red-600">{error}</div>
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
              to={`/post?id=${encodeURIComponent(post.id)}`}
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
            to={`/post?id=${encodeURIComponent(post.id)}`}
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
