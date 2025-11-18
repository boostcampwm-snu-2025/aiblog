import { useState } from "react";
import type { CSSProperties } from "react";
import type {
  PostGenerateResponse,
  PostGenerateRequest,
} from "../../types/githubPostData";
import type { PromptLang, PromptTone } from "../../types/promptSettings";
import { generatePost } from "../../utils/api/post";
import PostForm from "./PostForm";
import PostResult from "./PostResult";
import {
  loadSavedPosts,
  addSavedPost,
  clearSavedPosts,
  type SavedPost,
} from "../../utils/postStorage";

const postsPageStyles: Record<string, CSSProperties> = {
  wrap: { display: "grid", gap: 16, marginBottom: 50 },
  error: {
    padding: 12,
    borderRadius: 10,
    border: "1px solid var(--pink-300)",
    background: "var(--pink-50)",
    color: "var(--pink-800)",
  },
  loading: { padding: 12, color: "var(--gray-700)" },

  savedBlock: {
    padding: 12,
    borderRadius: 10,
    border: "1px solid var(--gray-200)",
    background: "var(--white)",
    display: "grid",
    gap: 8,
  },
  savedHeaderRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  savedTitle: {
    fontWeight: 700,
    fontSize: 15,
    color: "var(--gray-900)",
  },
  clearBtn: {
    padding: "4px 10px",
    fontSize: 12,
    borderRadius: 999,
    border: "1px solid var(--gray-300)",
    background: "var(--gray-50)",
    color: "var(--gray-800)",
    cursor: "pointer",
  },
  savedList: {
    display: "grid",
    gap: 8,
    maxHeight: 260,
    overflow: "auto",
  },
  savedItem: {
    borderRadius: 8,
    border: "1px solid var(--gray-200)",
    background: "var(--gray-50)",
    padding: 8,
    display: "grid",
    gap: 4,
  },
  savedItemTitle: {
    fontWeight: 600,
    fontSize: 16,
    color: "var(--gray-900)",
    margin: 0,
  },
  savedMetaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    fontSize: 12,
    color: "var(--gray-700)",
  },
  savedMetaTag: {
    padding: "4px 8px",
    borderRadius: 999,
    background: "var(--gray-200)",
  },
  savedPreview: {
    fontSize: 13,
    color: "var(--gray-800)",
  },
  savedEmpty: {
    fontSize: 13,
    color: "var(--gray-600)",
  },
};

function extractTitle(markdown: string): string {
  const lines = markdown.split("\n").map((line) => line.trim());
  const heading = lines.find((line) => line.startsWith("#"));
  if (heading) {
    const trimmed = heading.replace(/^#+\s*/, "").trim();
    if (trimmed) return trimmed;
  }
  const firstContent = lines.find((line) => line.length > 0);
  return firstContent || "(no title)";
}

function extractPreview(markdown: string): string {
  const text = markdown.replace(/[`*_>#-]/g, "").trim();
  if (!text) return "";
  return text.length > 140 ? `${text.slice(0, 140)}...` : text;
}

const PostsPage = () => {
  const [data, setData] = useState<PostGenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>(() =>
    loadSavedPosts()
  );

  async function handleGenerate(req: PostGenerateRequest) {
    setLoading(true);
    setError(null);
    try {
      const res = await generatePost(req);
      setData(res);

      const next = addSavedPost({
        repo: req.repo,
        lang: (req.lang as PromptLang) ?? ("ko" as PromptLang),
        tone: (req.tone as PromptTone) ?? ("concise" as PromptTone),
        content: res.post.content,
        sources: res.sources,
      });
      setSavedPosts(next);
    } catch (e: any) {
      setError(e?.message ?? "Failed to generate post");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  const handleClearSaved = () => {
    clearSavedPosts();
    setSavedPosts([]);
  };

  return (
    <div style={postsPageStyles.wrap}>
      <PostForm onSubmit={handleGenerate} loading={loading} />

      {error && <div style={postsPageStyles.error}>{error}</div>}
      {loading && <div style={postsPageStyles.loading}>Generating...</div>}
      {!loading && !error && data && <PostResult data={data} />}

      <div style={postsPageStyles.savedBlock}>
        <div style={postsPageStyles.savedHeaderRow}>
          <div style={postsPageStyles.savedTitle}>Saved Posts</div>
          <button
            type="button"
            style={postsPageStyles.clearBtn}
            onClick={handleClearSaved}
            disabled={!savedPosts.length}
          >
            Clear All
          </button>
        </div>

        <div style={postsPageStyles.savedList}>
          {!savedPosts.length && (
            <div style={postsPageStyles.savedEmpty}>
              아직 저장된 포스트가 없습니다.
            </div>
          )}

          {savedPosts.map((post) => (
            <div key={post.id} style={postsPageStyles.savedItem}>
              <p style={postsPageStyles.savedItemTitle}>
                {extractTitle(post.content)}
              </p>
              <div style={postsPageStyles.savedMetaRow}>
                <span style={postsPageStyles.savedMetaTag}>{post.repo}</span>
                <span style={postsPageStyles.savedMetaTag}>
                  {post.lang} · {post.tone}
                </span>
                <span style={postsPageStyles.savedMetaTag}>
                  {new Date(post.createdAt).toLocaleString()}
                </span>
              </div>
              <div style={postsPageStyles.savedPreview}>
                {extractPreview(post.content)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostsPage;
