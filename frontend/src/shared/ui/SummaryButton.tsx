import { useState } from "react";
import { generateSummary } from "../api/llm";

interface SummaryButtonProps {
  title: string;
  content: string;
  onSummary: (title: string, summary: string) => void;
}

export default function SummaryButton({ title, content, onSummary }: SummaryButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    const summary = await generateSummary(title, content);
    onSummary(title, summary);

    setLoading(false);
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