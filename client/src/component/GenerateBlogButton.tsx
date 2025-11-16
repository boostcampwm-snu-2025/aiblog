import { useState } from "react";
import type { GenerateBlogButtonProps } from "../types";


export default function GenerateBlogButton({
  username,
  repoName,
  onGenerate,
}: GenerateBlogButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await onGenerate(username, repoName);
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        marginTop: "0.5rem",
        padding: "0.25rem 0.75rem",
        backgroundColor: "#222",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        fontSize: "14px",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? "Generating..." : "Generate Blog"}
    </button>
  );
}
