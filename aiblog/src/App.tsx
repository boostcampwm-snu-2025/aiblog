import { useMemo, useState, useEffect } from "react";
import { Octokit } from "@octokit/core"; 
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"; 
import "./App.css";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8787";

const octokit = new Octokit({
  userAgent: "github-blog-generator",
});

type CommitItem = {
  sha: string;
  message: string;
  author: string | null;
  date: string;
};

type PullItem = {
  number: number;
  title: string;
  user: string;
  state: string;
  created_at: string;
  body?: string; 
};

// [NEW] 저장된 블로그 타입 정의
type SavedBlog = {
  id: string;
  repo: string;
  content: string;
  createdAt: string;
};

function App() {
  // Tab state: 'generate' or 'saved'
  const [activeTab, setActiveTab] = useState<'generate' | 'saved'>('generate');

  const [repo, setRepo] = useState("");
  const [loading, setLoading] = useState(false);
  const [commits, setCommits] = useState<CommitItem[]>([]);
  const [pulls, setPulls] = useState<PullItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // blog output
  const [blog, setBlog] = useState<string | null>(null);
  const [blogLoading, setBlogLoading] = useState(false);
  const [serverModel, setServerModel] = useState<string | null>(null);
  
  // [NEW] Saved Blogs State
  const [savedBlogs, setSavedBlogs] = useState<SavedBlog[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null); // 현재 수정 중인 ID
  const [editContent, setEditContent] = useState(""); // 수정 중인 내용

  const [owner, name] = useMemo(() => {
    const [o, n] = repo.split("/");
    return [o, n] as const;
  }, [repo]);

  // [NEW] 저장된 블로그 목록 가져오기
  const fetchSavedBlogs = async () => {
    try {
      const r = await fetch(`${API_BASE}/api/blogs`);
      const j = await r.json();
      if (j.ok) setSavedBlogs(j.blogs);
    } catch (e) {
      console.error("Failed to fetch saved blogs", e);
    }
  };

  // [NEW] 현재 생성된 블로그 저장하기
  const handleSaveBlog = async () => {
    if (!blog || !repo) return;
    if (!confirm("현재 내용을 저장하시겠습니까?")) return;

    try {
      const r = await fetch(`${API_BASE}/api/blogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo, content: blog }),
      });
      const j = await r.json();
      if (j.ok) {
        alert("저장되었습니다!");
        fetchSavedBlogs(); // 목록 갱신
        setActiveTab('saved'); // 저장 목록 탭으로 이동
      } else {
        alert("저장 실패: " + j.error);
      }
    } catch (e) {
      alert("저장 오류");
    }
  };

  // [NEW] 블로그 삭제
  const handleDeleteBlog = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      const r = await fetch(`${API_BASE}/api/blogs/${id}`, { method: "DELETE" });
      const j = await r.json();
      if (j.ok) {
        fetchSavedBlogs();
      }
    } catch (e) {
      alert("삭제 오류");
    }
  };

  // [NEW] 수정 모드 진입
  const startEdit = (b: SavedBlog) => {
    setEditingId(b.id);
    setEditContent(b.content);
  };

  // [NEW] 수정 내용 저장 (Update)
  const saveEdit = async (id: string) => {
    try {
      const r = await fetch(`${API_BASE}/api/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent }),
      });
      const j = await r.json();
      if (j.ok) {
        setEditingId(null);
        fetchSavedBlogs();
      } else {
        alert("수정 실패");
      }
    } catch (e) {
      alert("수정 오류");
    }
  };

  useEffect(() => {
    fetchServerModel();
    fetchSavedBlogs(); // 앱 시작 시 목록 로드
  }, []);

  const fetchServerModel = async () => {
    try {
      const r = await fetch(`${API_BASE}/api/models`);
      const j = await r.json();
      if (j.ok) setServerModel(j.chosen);
    } catch { /* ignore */ }
  };

  const handleFetch = async () => {
    if (!repo) return;
    setLoading(true);
    setError(null);
    setCommits([]);
    setPulls([]);
    setBlog(null);
    try {
      if (!owner || !name) throw new Error("Use format owner/name");

      const commitRes = await octokit.request("GET /repos/{owner}/{repo}/commits", {
        owner, repo: name, per_page: 5
      });
      const commitsData: CommitItem[] = commitRes.data.map((c: any) => ({
        sha: c.sha,
        message: c.commit.message,
        author: c.commit.author?.name ?? null,
        date: c.commit.author?.date
      }));

      const pullRes = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
        owner, repo: name, state: "all", per_page: 5
      });
      const pullsData: PullItem[] = pullRes.data.map((p: any) => ({
        number: p.number,
        title: p.title,
        user: p.user?.login ?? "unknown",
        state: p.state,
        created_at: p.created_at
      }));

      setCommits(commitsData);
      setPulls(pullsData);
    } catch (e: any) {
      setError(e.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // (generate 함수들은 기존 로직과 동일)
  const generateForCommit = async (c: CommitItem) => {
    setBlogLoading(true);
    setBlog(null);
    try {
      const r = await fetch(`${API_BASE}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo, itemType: "commit", commit: c })
      });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "Generation failed");
      setServerModel(j.model ?? null);
      setBlog(j.blogMd);
    } catch (e: any) {
      setBlog(`**Error:** ${e.message ?? e}`);
    } finally {
      setBlogLoading(false);
    }
  };

  const fetchPRBody = async (num: number) => {
    try {
      const r = await octokit.request("GET /repos/{owner}/{repo}/pulls/{pull_number}", {
        owner, repo: name, pull_number: num
      });
      return r.data.body as string | undefined;
    } catch { return undefined; }
  };

  const generateForPR = async (p: PullItem) => {
    setBlogLoading(true);
    setBlog(null);
    try {
      const body = await fetchPRBody(p.number);
      const r = await fetch(`${API_BASE}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo, itemType: "pull", pull: { ...p, body } })
      });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "Generation failed");
      setServerModel(j.model ?? null);
      setBlog(j.blogMd);
    } catch (e: any) {
      setBlog(`**Error:** ${e.message ?? e}`);
    } finally {
      setBlogLoading(false);
    }
  };

  const generateForAll = async () => {
    setBlogLoading(true);
    setBlog(null);
    try {
      const pullsWithBody: PullItem[] = [];
      for (const p of pulls) {
        const body = await fetchPRBody(p.number);
        pullsWithBody.push({ ...p, body });
      }
      const r = await fetch(`${API_BASE}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo, itemType: "all", commits, pulls: pullsWithBody })
      });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "Generation failed");
      setServerModel(j.model ?? null);
      setBlog(j.blogMd);
    } catch (e: any) {
      setBlog(`**Error:** ${e.message ?? e}`);
    } finally {
      setBlogLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 880, margin: "60px auto", padding: "0 16px" }}>
      <h1>GitHub Blog Generator</h1>
      
      {/* [NEW] 탭 메뉴 */}
      <div style={{ marginBottom: 20, borderBottom: '1px solid #ccc' }}>
        <button 
          onClick={() => setActiveTab('generate')}
          style={{ 
            marginRight: 10, 
            fontWeight: activeTab === 'generate' ? 'bold' : 'normal',
            borderBottom: activeTab === 'generate' ? '2px solid black' : 'none',
            background: 'none', border: 'none', cursor: 'pointer', fontSize: 16
          }}
        >
          Generate
        </button>
        <button 
          onClick={() => setActiveTab('saved')}
          style={{ 
            fontWeight: activeTab === 'saved' ? 'bold' : 'normal',
            borderBottom: activeTab === 'saved' ? '2px solid black' : 'none',
            background: 'none', border: 'none', cursor: 'pointer', fontSize: 16
          }}
        >
          Saved Blogs
        </button>
      </div>

      {/* ================= GENERATE TAB ================= */}
      {activeTab === 'generate' && (
        <>
          <p style={{ opacity: 0.7, marginTop: -8 }}>
            Enter <code>owner/repo</code>, fetch activity, then click <b>Generate Blog</b>.
          </p>

          <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 16 }}>
            <input
              type="text"
              placeholder="e.g. vercel/next.js"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              style={{ padding: 8, width: 320 }}
            />
            <button onClick={handleFetch} style={{ padding: "8px 12px" }}>Fetch</button>
            <button onClick={generateForAll} disabled={commits.length + pulls.length === 0} style={{ padding: "8px 12px" }}>
              Generate Blog (All)
            </button>
            {serverModel && (
              <span style={{ marginLeft: "auto", fontSize: 12, opacity: 0.7 }}>
                Model: {serverModel}
              </span>
            )}
          </div>

          {loading && <p>🔄 Loading GitHub data…</p>}
          {error && <p style={{ color: "red" }}>⚠️ Error: {error}</p>}

          {!loading && commits.length > 0 && (
            <div style={{ marginTop: 28 }}>
              <h2>🧱 Recent Commits</h2>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {commits.map((c) => (
                  <li key={c.sha} style={{ marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid #eee" }}>
                    <div style={{ fontWeight: 600 }}>{c.message}</div>
                    <div style={{ fontSize: 13, opacity: 0.75 }}>
                      Author: {c.author ?? "Unknown"} · Date: {c.date}
                    </div>
                    <div style={{ marginTop: 6 }}>
                      <button onClick={() => generateForCommit(c)} style={{ padding: "6px 10px" }}>Generate Blog</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!loading && pulls.length > 0 && (
            <div style={{ marginTop: 28 }}>
              <h2>📬 Recent Pull Requests</h2>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {pulls.map((p) => (
                  <li key={p.number} style={{ marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid #eee" }}>
                    <div style={{ fontWeight: 600 }}>#{p.number} {p.title}</div>
                    <div style={{ fontSize: 13, opacity: 0.75 }}>
                      User: {p.user} · State: {p.state}
                    </div>
                    <div style={{ marginTop: 6 }}>
                      <button onClick={() => generateForPR(p)} style={{ padding: "6px 10px" }}>Generate Blog</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {blogLoading && <p style={{ marginTop: 24 }}>🧠 Generating blog with Gemini…</p>}

          {blog && (
            <div className="blog-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ marginTop: 0 }}>📝 Generated Blog</h2>
                {/* [NEW] 저장 버튼 */}
                <button onClick={handleSaveBlog} style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '8px 16px', cursor: 'pointer' }}>
                  Save to Library
                </button>
              </div>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {blog}
              </ReactMarkdown>
            </div>
          )}
        </>
      )}

      {/* ================= SAVED BLOGS TAB ================= */}
      {activeTab === 'saved' && (
        <div>
          <h2>📚 Saved Blogs</h2>
          {savedBlogs.length === 0 && <p>No saved blogs yet.</p>}
          {savedBlogs.map(b => (
            <div key={b.id} className="blog-card" style={{ marginBottom: 30 }}>
              <div style={{ borderBottom: '1px solid #ddd', paddingBottom: 10, marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>Repo:</strong> {b.repo} <span style={{ margin: '0 8px' }}>|</span>
                  <span style={{ fontSize: 13, color: '#666' }}>{new Date(b.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  {editingId === b.id ? (
                    <>
                      <button onClick={() => saveEdit(b.id)} style={{ marginRight: 8 }}>Save</button>
                      <button onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(b)} style={{ marginRight: 8 }}>Edit</button>
                      <button onClick={() => handleDeleteBlog(b.id)} style={{ color: 'red' }}>Delete</button>
                    </>
                  )}
                </div>
              </div>
              
              {/* 수정 모드일 때 textarea, 아닐 때 Markdown 뷰어 */}
              {editingId === b.id ? (
                <textarea 
                  value={editContent} 
                  onChange={(e) => setEditContent(e.target.value)}
                  style={{ width: '100%', height: 300, fontFamily: 'monospace' }}
                />
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {b.content}
                </ReactMarkdown>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;