import { useState } from "react";
import { Octokit } from "@octokit/core"; // npm install @octokit/core
import "./App.css";

const octokit = new Octokit({
  userAgent: "github-blog-generator",
  // auth: process.env.REACT_APP_GITHUB_TOKEN // 필요시 토큰 사용
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
};

function App() {
  const [repo, setRepo] = useState("");
  const [loading, setLoading] = useState(false);
  const [commits, setCommits] = useState<CommitItem[]>([]);
  const [pulls, setPulls] = useState<PullItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async () => {
    if (!repo) return;
    setLoading(true);
    setError(null);
    setCommits([]);
    setPulls([]);

    try {
      const [owner, name] = repo.split("/");
      if (!owner || !name) throw new Error("Use format owner/name");

      // 커밋 가져오기
      const commitRes = await octokit.request("GET /repos/{owner}/{repo}/commits", {
        owner,
        repo: name,
        per_page: 3
      });
      const commitsData: CommitItem[] = commitRes.data.map((c: any) => ({
        sha: c.sha,
        message: c.commit.message,
        author: c.commit.author?.name ?? null,
        date: c.commit.author?.date
      }));

      // PR 가져오기
      const pullRes = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
        owner,
        repo: name,
        state: "all",
        per_page: 3
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

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h1>GitHub Blog Generator</h1>
      <input
        type="text"
        placeholder="Enter GitHub Repo (e.g. suho/project)"
        value={repo}
        onChange={(e) => setRepo(e.target.value)}
        style={{ padding: 8, width: 250 }}
      />
      <button onClick={handleFetch} style={{ marginLeft: 10, padding: 8 }}>
        Fetch
      </button>

      {loading && <p>🔄 데이터 로딩중… (Loading…)</p>}
      {error && <p style={{ color: "red" }}>⚠️ Error: {error}</p>}

      {!loading && commits.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h2>🧱 Recent Commits</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {commits.map((c, i) => (
              <li key={i} style={{ marginBottom: 12 }}>
                <strong>{c.message}</strong><br />
                <span>Author: {c.author ?? "Unknown"}</span><br />
                <span>Date: {c.date}</span><br />
                <span>SHA: {c.sha.substring(0, 7)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && pulls.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h2>📬 Recent Pull Requests</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {pulls.map((p, i) => (
              <li key={i} style={{ marginBottom: 12 }}>
                <strong>#{p.number} {p.title}</strong><br />
                <span>User: {p.user}</span><br />
                <span>State: {p.state}</span><br />
                <span>Date: {p.created_at}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
