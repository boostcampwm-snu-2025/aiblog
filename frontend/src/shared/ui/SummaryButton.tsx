import { useState } from "react";
import { generateSummary } from "../api/llm";

interface SummaryButtonProps {
  title: string;
  getContent: () => Promise<string> | string;
  onSummary: (title: string, summary: string) => void;
}

export default function SummaryButton({
  title,
  getContent,
  onSummary,
}: SummaryButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const contentResult = getContent();
      const content =
        typeof contentResult === "string"
          ? contentResult
          : await contentResult;

      const summary = await generateSummary(title, content);
      onSummary(title, summary);
    } catch (err) {
      console.error("Error while generating summary:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:bg-gray-400"
    >
      {loading ? "..." : "요약 생성"}
    </button>
  );
}