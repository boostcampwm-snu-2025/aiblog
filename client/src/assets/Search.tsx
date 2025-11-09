import { useState } from "react";

interface SearchProps {
  username: string;
  repoName?: string | null;
}

export default function Search({ username, repoName: initialRepoName }: SearchProps) {
  const [repoName, setRepoName] = useState(initialRepoName ?? "");

  return (
    <div style={{margin:"auto auto", width:"80%", paddingTop:"24px", display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <button
        style={{
            fontFamily:"monospace",
            fontSize:"16px",
          padding: "0.5rem 1rem",
          cursor: "default",
        }}
      >
        {username}
      </button>
      <span>/</span>
      <input
        type="text"
        value={repoName}
        onChange={(e) => setRepoName(e.target.value)}
        placeholder="Repository"
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
      <button
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "#70839F",
          color: "white",
          cursor: "pointer",
        }}
        onClick={() => console.log("Search for:", username, repoName)}
      >
        Search
      </button>
    </div>
  );
}
