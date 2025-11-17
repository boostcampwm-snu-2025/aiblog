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
    const [blog, setBlog] = useState("");
    const [generating, setGenerating] = useState(false);
    const [currentTarget, setCurrentTarget] = useState<string | null>(null);

    // Optional GitHub token for higher rate limits / private repos (server is safer)
    const TOKEN: string | null = null;

    // Helper for GitHub API calls from the client (only for list endpoints)
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
        setBlog("");

        const [owner, name] = repo.split("/");
        if (!owner || !name) {
            setError("Format must be owner/repo. Example: facebook/react");
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
            setError(`Failed to load: ${e.message}`);
            setCommits([]);
            setPrs([]);
        } finally {
            setLoading(false);
        }
    };

    // Generate blog for a single commit (server fetches full details)
    const generateCommitBlog = async (commit: Commit) => {
        if (!repo) {
            setError("Please enter a repo first.");
            return;
        }

        setGenerating(true);
        setBlog("");
        setCurrentTarget(`commit:${commit.sha}`);

        try {
            const res = await fetch("/api/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "commit",
                    repo,
                    sha: commit.sha,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setBlog(`Error: ${data.error || "Unknown error"}`);
            } else {
                setBlog(data.blog || "Summarization failed.");
            }
        } catch (err: any) {
            setBlog("Error during summarization: " + err.message);
        } finally {
            setGenerating(false);
            setCurrentTarget(null);
        }
    };

    // Generate blog for a single PR (server fetches full details)
    const generatePRBlog = async (pr: PullRequest) => {
        if (!repo) {
            setError("Please enter a repo first.");
            return;
        }

        setGenerating(true);
        setBlog("");
        setCurrentTarget(`pr:${pr.number}`);

        try {
            const res = await fetch("/api/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "pr",
                    repo,
                    number: pr.number,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setBlog(`Error: ${data.error || "Unknown error"}`);
            } else {
                setBlog(data.blog || "Summarization failed.");
            }
        } catch (err: any) {
            setBlog("Error during summarization: " + err.message);
        } finally {
            setGenerating(false);
            setCurrentTarget(null);
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
            <h1>GitHub Activity Viewer</h1>
            <p className="sub">
                Enter owner/repo → fetch recent commits & PRs, then generate LLM
                blogs per item.
            </p>

            <div className="input-row">
                <input
                    type="text"
                    placeholder="Example: boostcampwm-snu-2025/bye2money"
                    value={repo}
                    onChange={(e) => setRepo(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && loadRepo()}
                />
                <button onClick={loadRepo}>Load</button>
            </div>

            {error && <div className="error">{error}</div>}

            {loading && (
                <div className="loading">
                    <div className="spinner" /> <span>Loading...</span>
                </div>
            )}

            {blog && (
                <div className="panel" style={{ marginTop: 20 }}>
                    <h2>AI-Generated Blog</h2>
                    <pre style={{ whiteSpace: "pre-wrap" }}>{blog}</pre>
                </div>
            )}

            {!loading && !error && (
                <div className="results">
                    {/* COMMITS */}
                    <section>
                        <h2>Recent Commits</h2>
                        <ul className="list">
                            {commits.length === 0 ? (
                                <li className="item meta">
                                    No commits available.
                                </li>
                            ) : (
                                commits.map((c) => {
                                    const isThisTarget =
                                        currentTarget === `commit:${c.sha}` &&
                                        generating;
                                    return (
                                        <li key={c.sha} className="item">
                                            <div className="row">
                                                <a
                                                    href={c.html_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="title"
                                                >
                                                    {c.commit.message.split(
                                                        "\n"
                                                    )[0] ?? "(no message)"}
                                                </a>
                                                <span className="meta">
                                                    {formatDate(
                                                        c.commit.author?.date
                                                    )}
                                                </span>
                                            </div>
                                            <div className="row">
                                                <div className="meta">
                                                    by{" "}
                                                    {c.commit.author?.name ??
                                                        c.author?.login ??
                                                        "unknown"}
                                                </div>
                                                <button
                                                    className="mini-gen-btn"
                                                    onClick={() =>
                                                        generateCommitBlog(c)
                                                    }
                                                    disabled={generating}
                                                >
                                                    {isThisTarget
                                                        ? "Generating..."
                                                        : "Blog this commit"}
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })
                            )}
                        </ul>
                    </section>

                    {/* PULL REQUESTS */}
                    <section>
                        <h2>Recent Pull Requests</h2>
                        <ul className="list">
                            {prs.length === 0 ? (
                                <li className="item meta">No PRs available.</li>
                            ) : (
                                prs.map((pr) => {
                                    const state = pr.merged_at
                                        ? "merged"
                                        : pr.state;
                                    const isThisTarget =
                                        currentTarget === `pr:${pr.number}` &&
                                        generating;
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
                                                <span className="meta">
                                                    {formatDate(pr.created_at)}
                                                </span>
                                            </div>

                                            <div className="row">
                                                <div className="meta">
                                                    by{" "}
                                                    {pr.user?.login ??
                                                        "unknown"}
                                                </div>

                                                <button
                                                    className="mini-gen-btn"
                                                    onClick={() =>
                                                        generatePRBlog(pr)
                                                    }
                                                    disabled={generating}
                                                >
                                                    {isThisTarget
                                                        ? "Generating..."
                                                        : "Blog this PR"}
                                                </button>

                                                <span
                                                    className={`badge ${state}`}
                                                >
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
