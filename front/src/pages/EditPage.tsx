import { useEffect, useMemo, useRef, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import ReactMarkdown from "react-markdown";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface CommitListItem {
  hash: string;
  date: string; // ISO
  message: string;
}

interface CommitFile {
  filename: string;
  status: "added" | "modified" | "deleted" | "renamed";
  additions: number;
  deletions: number;
  changes: number;
  patch: string;
}

interface CommitDetails {
  hash: string;
  message: string;
  date: string; // ISO
  stats: {
    total: number;
    additions: number;
    deletions: number;
  };
  files: CommitFile[];
}

const parseOwnerRepo = (full: string): { owner: string; repo: string } | null => {
  const parts = full.split("/");
  if (parts.length !== 2) return null;
  return { owner: parts[0], repo: parts[1] };
};

const repoToUrl = (full: string): string => {
  return `https://github.com/${full}`;
};

const shortHash = (hash: string) => hash.slice(0, 7);

const useApiBase = () => {
  return useMemo(() => {
    const envBase = (import.meta as any)?.env?.VITE_API_BASE_URL as
      | string
      | undefined;
    return envBase && envBase.length > 0
      ? envBase.replace(/\/$/, "")
      : "http://0.0.0.0:11111/api";
  }, []);
};

const Line = ({ text }: { text: string }) => {
  // Decide style based on first char
  const first = text[0];
  const isAdd = first === "+";
  const isDel = first === "-";
  const isHead = text.startsWith("@@");
  const base = "whitespace-pre-wrap break-words px-2 py-0.5";
  const cls = isHead
    ? "bg-gray-100 text-gray-600"
    : isAdd
    ? "bg-green-50 text-green-700"
    : isDel
    ? "bg-red-50 text-red-700"
    : "text-gray-600";
  return <span className={`${base} ${cls}`}>{text}</span>;
};

const FileDiff = ({ file }: { file: CommitFile }) => {
  const lines = (file.patch || "").split(/\r?\n/);
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden mb-4">
      <div className="bg-gray-100 text-gray-700 p-2 text-sm flex items-center justify-between">
        <div className="font-mono truncate">{file.filename}</div>
        <div className="text-xs ml-2 shrink-0">
          <span className="inline-block rounded px-2 py-0.5 bg-gray-200 text-gray-700 mr-2">
            {file.status}
          </span>
          <span className="text-green-700">+{file.additions}</span>
          <span className="mx-1 text-gray-400">/</span>
          <span className="text-red-700">-{file.deletions}</span>
        </div>
      </div>
      <pre className="font-mono text-sm p-2 overflow-x-auto bg-white">
        <div className="flex flex-col items-start gap-0.5">
          {lines.map((l, idx) => (
            <Line key={idx} text={l} />
          ))}
        </div>
      </pre>
    </div>
  );
};

export const EditPage = () => {
  const apiBase = useApiBase();

  // Repos
  const [repos, setRepos] = useState<string[]>([]);
  const [reposLoading, setReposLoading] = useState<boolean>(true);
  const [reposError, setReposError] = useState<string | null>(null);

  // Commits for selected repo
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [commits, setCommits] = useState<CommitListItem[]>([]);
  const [commitsLoading, setCommitsLoading] = useState<boolean>(false);
  const [commitsError, setCommitsError] = useState<string | null>(null);

  // Selected commit
  const [selectedCommit, setSelectedCommit] = useState<string>("");
  const [details, setDetails] = useState<CommitDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(true);

  // Editor state
  const [title, setTitle] = useState<string>("");
  const [tagsInput, setTagsInput] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [generating, setGenerating] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const genAbortRef = useRef<AbortController | null>(null);

  // Load repos on mount
  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        setReposLoading(true);
        setReposError(null);
        const res = await fetch(`${apiBase}/github/repos`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Failed to load repos (${res.status})`);
        const data = (await res.json()) as string[];
        setRepos(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (e?.name !== "AbortError") setReposError(e?.message || "Failed to load repos");
      } finally {
        setReposLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [apiBase]);

  // When repo changes, clear commits + details and fetch commits
  useEffect(() => {
    if (!selectedRepo) {
      setCommits([]);
      setSelectedCommit("");
      setDetails(null);
      return;
    }
    const parsed = parseOwnerRepo(selectedRepo);
    if (!parsed) return;

    const controller = new AbortController();
    const load = async () => {
      try {
        setCommitsLoading(true);
        setCommitsError(null);
        setCommits([]);
        setSelectedCommit("");
        setDetails(null);
        const res = await fetch(
          `${apiBase}/github/repos/${encodeURIComponent(parsed.owner)}/${encodeURIComponent(
            parsed.repo
          )}/commits`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`Failed to load commits (${res.status})`);
        const data = (await res.json()) as CommitListItem[];
        setCommits(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (e?.name !== "AbortError") setCommitsError(e?.message || "Failed to load commits");
      } finally {
        setCommitsLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [selectedRepo, apiBase]);

  // When commit changes, fetch details
  useEffect(() => {
    const parsed = selectedRepo ? parseOwnerRepo(selectedRepo) : null;
    if (!parsed || !selectedCommit) {
      setDetails(null);
      return;
    }
    const controller = new AbortController();
    const load = async () => {
      try {
        setDetailsLoading(true);
        const res = await fetch(
          `${apiBase}/github/repos/${encodeURIComponent(parsed.owner)}/${encodeURIComponent(
            parsed.repo
          )}/commits/${encodeURIComponent(selectedCommit)}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`Failed to load commit details (${res.status})`);
        const data = (await res.json()) as CommitDetails;
        setDetails(data);
      } catch (e) {
        // Swallow error for now
        setDetails(null);
      } finally {
        setDetailsLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [selectedCommit, selectedRepo, apiBase]);

  const startGenerate = async () => {
    if (!details) return;
    try {
      setGenerating(true);
      setContent("");
      const controller = new AbortController();
      genAbortRef.current = controller;
      const res = await fetch(`${apiBase}/ai/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commitMessage: details.message,
          commitDate: details.date,
          files: details.files.map((f) => ({
            filename: f.filename,
            status: f.status,
            additions: f.additions,
            deletions: f.deletions,
            changes: f.changes,
            patch: f.patch,
          })),
        }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) throw new Error(`Failed to start stream (${res.status})`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let sseBuffer = "";
      let done = false;
      while (!done) {
        const { value, done: streamDone } = await reader.read();
        if (streamDone) break;
        const chunk = decoder.decode(value, { stream: true });
        sseBuffer += chunk;

        // Process SSE events by blank line separator
        let idx;
        while ((idx = sseBuffer.indexOf("\n\n")) !== -1) {
          const eventBlock = sseBuffer.slice(0, idx);
          sseBuffer = sseBuffer.slice(idx + 2);
          const lines = eventBlock.split(/\n/);
          let eventName: string | null = null;
          for (const line of lines) {
            if (line.startsWith("event:")) {
              eventName = line.slice(6).trim();
            } else if (line.startsWith("data:")) {
              const data = line.slice(5).trimStart();
              if (data === "[DONE]") {
                done = true;
                break;
              }
              // Append with newline to reconstruct lines
              if (data && data.length > 0) {
                setContent((prev) => prev + data + "\n");
              } else if (eventName !== "error") {
                // preserve blank lines except explicit errors
                setContent((prev) => prev + "\n");
              }
            }
          }
        }
      }
    } catch (e) {
      // ignore
    } finally {
      setGenerating(false);
      genAbortRef.current = null;
    }
  };

  const parsedTags = useMemo(() => {
    return tagsInput
      .split(/[,\n]/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  }, [tagsInput]);

  const canSave = !!selectedRepo && !!selectedCommit && title.trim().length > 0 && content.trim().length > 0 && !saving && !generating;

  const onSave = async () => {
    if (!canSave) return;
    const repoUrl = repoToUrl(selectedRepo);
    try {
      setSaving(true);
      const res = await fetch(`${apiBase}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          repo: repoUrl,
          commit: selectedCommit,
          content: content,
          tags: parsedTags,
        }),
      });
      if (res.status !== 201) throw new Error(`Failed to save (${res.status})`);
      // Reset state
      setSelectedRepo("");
      setCommits([]);
      setSelectedCommit("");
      setDetails(null);
      setTitle("");
      setTagsInput("");
      setContent("");
      // Re-fetch repos to re-initialize select state
      setReposLoading(true);
      setReposError(null);
      try {
        const r = await fetch(`${apiBase}/github/repos`);
        const data = (await r.json()) as string[];
        setRepos(Array.isArray(data) ? data : []);
      } catch (e) {
        // ignore
      } finally {
        setReposLoading(false);
      }
    } catch (e) {
      // ignore or show toast in the future
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Repo + Commit selects */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div>
          <label htmlFor="repo-select" className="block text-sm font-medium text-gray-700 mb-1">
            Repository
          </label>
          {reposLoading ? (
            <Skeleton width={240} height={42} />
          ) : reposError ? (
            <div className="w-[240px] h-[42px] text-sm text-red-600 flex items-center">{reposError}</div>
          ) : (
            <select
              id="repo-select"
              className="w-[240px] h-[42px] p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 appearance-none pr-10"
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
            >
              <option value="" disabled>
                {repos.length ? "Select a repository" : "No repositories"}
              </option>
              {repos.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label htmlFor="commit-select" className="block text-sm font-medium text-gray-700 mb-1">
            Commit / PR
          </label>
          {commitsLoading ? (
            <Skeleton width={450} height={42} />
          ) : (
            <select
              id="commit-select"
              className="w-[450px] h-[42px] p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 font-mono text-sm appearance-none pr-10"
              value={selectedCommit}
              onChange={(e) => setSelectedCommit(e.target.value)}
              disabled={!selectedRepo || commits.length === 0}
            >
              <option value="" disabled>
                {!selectedRepo
                  ? "Select a repository first"
                  : commits.length === 0
                  ? "No commits"
                  : "Select a commit"}
              </option>
              {commits.map((c) => (
                <option key={c.hash} value={c.hash}>
                  [{shortHash(c.hash)}] {c.message.split("\n")[0]}
                </option>
              ))}
            </select>
          )}
          {commitsError ? (
            <div className="text-sm text-red-600 mt-1">{commitsError}</div>
          ) : null}
        </div>
      </div>

      {/* Collapsible commit details with smooth animation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div
          className="p-4 cursor-pointer font-medium text-gray-900"
          role="button"
          aria-expanded={detailsOpen}
          onClick={() => setDetailsOpen((v) => !v)}
        >
          <div className="flex justify-between items-center">
            <span>
              {selectedCommit && details
                ? `Details for commit: [${shortHash(details.hash)}] ${details.message.split("\n")[0]}`
                : "Details (select a commit)"}
            </span>
            <span className="text-sm text-gray-500">(Click to expand/collapse)</span>
          </div>
        </div>
        {/* Animate using grid-rows from 0fr -> 1fr when open */}
        <div
          className={`border-t border-gray-200 grid transition-[grid-template-rows] duration-300 ease-in-out ${
            detailsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden p-4">
            {!selectedCommit ? (
              <div className="text-gray-600">Select a commit to view details.</div>
            ) : detailsLoading ? (
              <div className="space-y-2">
                <Skeleton width={240} />
                <Skeleton count={3} />
                <Skeleton width={240} />
                <Skeleton count={5} />
              </div>
            ) : details ? (
              <div>
                <h3 className="text-lg font-semibold mb-2">Commit Message</h3>
                <div className="p-3 bg-gray-50 rounded-md text-gray-800 mb-6 whitespace-pre-wrap">
                  {details.message}
                </div>

                <h3 className="text-lg font-semibold mb-2">
                  File Changes ({details.files?.length ?? 0})
                </h3>
                <div>
                  {details.files && details.files.length > 0 ? (
                    details.files.map((f) => <FileDiff key={f.filename} file={f} />)
                  ) : (
                    <div className="text-gray-600">No file changes found.</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-gray-600">Failed to load details.</div>
            )}
          </div>
        </div>
      </div>

      {/* Generate button */}
      <div className="flex justify-center pb-1">
        <button
          onClick={startGenerate}
          disabled={!details || generating}
          className={`px-6 py-2 rounded-lg shadow-sm text-white font-medium transition-colors flex items-center space-x-2 ${
            !details || generating
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          }`}
        >
          {generating ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm12 2a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0V9h-1a1 1 0 110-2h1V6a1 1 0 011-1zM5 12a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm12 0a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <span>{generating ? "Generating..." : "Generate Summary"}</span>
        </button>
      </div>

      {/* Title + Markdown Editor + Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label htmlFor="post-title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="post-title"
            type="text"
            className="w-full h-[42px] p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 mb-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Catchy blog post title"
            disabled={generating}
          />

          <label htmlFor="tags-input" className="block text-sm font-medium text-gray-700 mb-1">
            Tags (comma separated)
          </label>
          <input
            id="tags-input"
            type="text"
            className="w-full h-[42px] p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 mb-3"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. auth, jwt, middleware"
            disabled={generating}
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">Markdown Editor</label>
          <div className={`${generating ? "pointer-events-none opacity-70" : ""}`}>
            <MDEditor
              value={content}
              onChange={(val) => setContent(val ?? "") as any}
              height={400}
              preview="edit"
            />
         </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Live Preview</label>
          <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-xl shadow-sm border border-gray-100 h-full overflow-y-auto">
            {content ? (
              <article className="space-y-6 text-gray-700 leading-relaxed">
                <ReactMarkdown
                  components={{
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        className="text-blue-600 hover:underline"
                        target={props.href?.startsWith("http") ? "_blank" : undefined}
                        rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                      />
                    ),
                    h1: ({ node, ...props }) => (
                      <h1 {...props} className="text-3xl lg:text-4xl font-bold text-gray-900 !mt-10 mb-4" />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 {...props} className="text-2xl font-semibold text-gray-900 !mt-10 mb-4" />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 {...props} className="text-xl font-semibold text-gray-900 !mt-10 mb-4" />
                    ),
                    p: ({ node, ...props }) => <p {...props} className="text-gray-700 leading-relaxed" />,
                    ul: ({ node, ...props }) => <ul {...props} className="list-disc list-outside space-y-2 pl-6" />,
                    ol: ({ node, ...props }) => <ol {...props} className="list-decimal list-outside space-y-2 pl-6" />,
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        {...props}
                        className="border-l-4 border-blue-500 bg-blue-50 p-4 my-6 rounded-r-lg text-blue-900 italic"
                      />
                    ),
                    pre: ({ node, ...props }) => (
                      <pre {...props} className="bg-gray-900 text-gray-50 p-4 rounded-lg overflow-x-auto" />
                    ),
                    code: ({ node, inline, className, ...props }: any) => (
                      <code
                        {...props}
                        className={`font-mono ${inline ? "bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded" : ""} ${
                          className ?? ""
                        }`}
                      />
                    ),
                    hr: ({ node, ...props }) => <hr {...props} className="my-8 border-gray-200" />,
                  }}
                >
                  {content}
                </ReactMarkdown>
              </article>
            ) : (
              <div className="text-gray-500">Nothing to preview yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onSave}
          disabled={!canSave}
          className={`px-6 py-2 text-white font-medium rounded-lg shadow-sm transition-colors ${
            !canSave
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          }`}
        >
          {saving ? "Saving..." : "Save Post"}
        </button>
      </div>
    </div>
  );
};
