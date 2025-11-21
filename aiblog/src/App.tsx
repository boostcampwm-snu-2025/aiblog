import { useMemo, useState } from "react";
import { Octokit } from "@octokit/core"; // npm install @octokit/core
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"; // code block theme
import "./App.css";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8787";

const octokit = new Octokit({
  userAgent: "github-blog-generator",
  // auth: process.env.REACT_APP_GITHUB_TOKEN // 필요시 사용
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
  body?: string; // 상세 조회 시 채움
};

function App() {
  const [repo, setRepo] = useState("");
  const [loading, setLoading] = useState(false);
  const [commits, setCommits] = useState<CommitItem[]>([]);
  const [pulls, setPulls] = useState<PullItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // blog output
  const [blog, setBlog] = useState<string | null>(null);
  const [blogLoading, setBlogLoading] = useState(false);
  const [serverModel, setServerModel] = useState<string | null>(null);

  const [owner, name] = useMemo(() => {
    const [o, n] = repo.split("/");
    return [o, n] as const;
  }, [repo]);

  const fetchServerModel = async () => {
    try {
      const r = await fetch(`${API_BASE}/api/models`);
      const j = await r.json();
      if (j.ok) setServerModel(j.chosen);
    } catch {
      // ignore
    }
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

      // Commits
      const commitRes = await octokit.request("GET /repos/{owner}/{repo}/commits", {
        owner,
        repo: name,
        per_page: 5
      });
      const commitsData: CommitItem[] = commitRes.data.map((c: any) => ({
        sha: c.sha,
        message: c.commit.message,
        author: c.commit.author?.name ?? null,
        date: c.commit.author?.date
      }));

      // PRs
      const pullRes = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
        owner,
        repo: name,
        state: "all",
        per_page: 5
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
      fetchServerModel();
    } catch (e: any) {
      setError(e.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const generateForCommit = async (c: CommitItem) => {
    setBlogLoading(true);
    setBlog(null);
    try {
      const r = await fetch(`${API_BASE}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo,
          itemType: "commit",
          commit: c
        })
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
    } catch {
      return undefined;
    }
  };

  const generateForPR = async (p: PullItem) => {
    setBlogLoading(true);
    setBlog(null);
    try {
      const body = await fetchPRBody(p.number);
      const r = await fetch(`${API_BASE}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo,
          itemType: "pull",
          pull: { ...p, body }
        })
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
        body: JSON.stringify({
          repo,
          itemType: "all",
          commits,
          pulls: pullsWithBody
        })
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
                  Author: {c.author ?? "Unknown"} · Date: {c.date} · SHA: {c.sha.substring(0, 7)}
                </div>
                <div style={{ marginTop: 6 }}>
                  <button onClick={() => generateForCommit(c)} style={{ padding: "6px 10px" }}>
                    Generate Blog
                  </button>
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
                  User: {p.user} · State: {p.state} · Date: {p.created_at}
                </div>
                <div style={{ marginTop: 6 }}>
                  <button onClick={() => generateForPR(p)} style={{ padding: "6px 10px" }}>
                    Generate Blog
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {blogLoading && <p style={{ marginTop: 24 }}>🧠 Generating blog with Gemini…</p>}

      {blog && (
        <div className="blog-card">
          <h2 style={{ marginTop: 0 }}>📝 Generated Blog</h2>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {blog}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default App;
