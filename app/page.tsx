"use client";

import { useState } from "react";

type Commit = {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author?: { name: string; date: string };
  };
  author?: { login: string };
};

type PullRequest = {
  id: number;
  number: number;
  title: string;
  state: "open" | "closed";
  merged_at?: string | null;
  created_at: string;
  html_url: string;
  user?: { login: string };
};

export default function Home() {
  const [repo, setRepo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [commits, setCommits] = useState<Commit[]>([]);
  const [prs, setPrs] = useState<PullRequest[]>([]);

  // For public repos, token is not required
  // Add your token here only for local testing (never commit it)
  const TOKEN: string | null = null;

  const fetchJSON = async <T,>(url: string): Promise<T> => {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
    };
    if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

    const res = await fetch(url, { headers });
    const body = await res.json();
    if (!res.ok) throw new Error(body.message || `HTTP ${res.status}`);
    return body as T;
  };

  const loadRepo = async () => {
    setError("");
    const [owner, name] = repo.split("/");
    if (!owner || !name) {
      setError("형식은 owner/repo 입니다. 예: facebook/react");
      return;
    }

    setLoading(true);
    try {
      const commitsUrl = `https://api.github.com/repos/${owner}/${name}/commits?per_page=10`;
      const prsUrl = `https://api.github.com/repos/${owner}/${name}/pulls?state=all&per_page=10&sort=created&direction=desc`;

      const [commitsData, prsData] = await Promise.all([
        fetchJSON<Commit[]>(commitsUrl),
        fetchJSON<PullRequest[]>(prsUrl),
      ]);

      setCommits(commitsData);
      setPrs(prsData);
    } catch (e: any) {
      setError(`불러오기 실패: ${e.message}`);
      setCommits([]);
      setPrs([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleString(undefined, {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

  return (
    <main className="container">
      <h1>GitHub 작업 목록</h1>
      <p className="sub">owner/repo 입력 → 최근 커밋 및 PR</p>

      <div className="input-row">
        <input
          type="text"
          placeholder="예: boostcampwm-snu-2025/bye2money"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && loadRepo()}
        />
        <button onClick={loadRepo}>불러오기</button>
      </div>

      {error && <div className="error">{error}</div>}

      {loading && (
        <div className="loading">
          <div className="spinner" /> <span>데이터 로딩중...</span>
        </div>
      )}

      {!loading && !error && (
        <div className="results">
          <section>
            <h2>최근 커밋</h2>
            <ul className="list">
              {commits.length === 0 ? (
                <li className="item meta">커밋이 없습니다.</li>
              ) : (
                commits.map((c) => (
                  <li key={c.sha} className="item">
                    <div className="row">
                      <a
                        href={c.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="title"
                      >
                        {c.commit.message.split("\n")[0] ?? "(no message)"}
                      </a>
                      <span className="meta">
                        {formatDate(c.commit.author?.date)}
                      </span>
                    </div>
                    <div className="meta">
                      by {c.commit.author?.name ?? c.author?.login ?? "unknown"}
                    </div>
                  </li>
                ))
              )}
            </ul>
          </section>

          <section>
            <h2>최근 PR</h2>
            <ul className="list">
              {prs.length === 0 ? (
                <li className="item meta">PR이 없습니다.</li>
              ) : (
                prs.map((pr) => {
                  const state = pr.merged_at ? "merged" : pr.state;
                  return (
                    <li key={pr.id} className="item">
                      <div className="row">
                        <a
                          href={pr.html_url}
                          target="_blank"
                          rel="noreferrer"
                          className="title"
                        >
                          #{pr.number} — {pr.title}
                        </a>
                        <span className="meta">{formatDate(pr.created_at)}</span>
                      </div>
                      <div className="row">
                        <div className="meta">
                          by {pr.user?.login ?? "unknown"}
                        </div>
                        <span className={`badge ${state}`}>
                          {state.toUpperCase()}
                        </span>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </section>
        </div>
      )}
    </main>
  );
}
