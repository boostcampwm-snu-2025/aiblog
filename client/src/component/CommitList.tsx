import type { Commit } from "../types";

export default function CommitList({
  username,
  repoName,
  commits,
}: {
  username: string;
  repoName: string;
  commits: Commit[];
}) {
  return (
    <div style={{ width: "80%", margin: "auto auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "0.5rem",
          margin: "1rem",
          flexWrap: "wrap",
        }}
      >
        <p
          style={{
            color: "#70839F",
            fontFamily: "monospace",
            fontWeight: "600",
            fontSize: "32px",
            margin: 0,
          }}
        >
          {username}
        </p>
        <p
          style={{
            color: "#666666ff",
            fontWeight: "500",
            fontSize: "32px",
            margin: 0,
          }}
        >
          / {repoName} Commits
        </p>
      </div>

      <div>
        {commits.length === 0 ? (
          <p>No commits found.</p>
        ) : (
          commits.map((commit: any) => (
            <button
              key={commit.sha}
              style={{
                marginBottom: "1rem",
                width: "100%",
                textAlign: "left",
                padding: "0.5rem 1rem",
                borderRadius: "5px",
                cursor: "default",
              }}
            >
              <p
                style={{
                  fontSize: "16px",
                  fontFamily: "monospace",
                  color: "#70839F",
                  margin: 0,
                }}
              >
                {commit.commit.message}
              </p>
              <small style={{ display: "block", color: "#666" }}>
                {commit.commit.author.name} — {new Date(commit.commit.author.date).toLocaleString()}
              </small>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
