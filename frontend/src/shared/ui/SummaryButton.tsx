import { useState } from "react";

interface SummaryButtonProps {
  title: string;
  content: string;
  onSummary: (title: string, summary: string) => void;
}

export default function SummaryButton({ title, content, onSummary }: SummaryButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/llm/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();
      onSummary(title, data.result);
    } catch (e) {
      alert("요약 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
    >
      {loading ? "..." : "요약 생성"}
    </button>
  );
}