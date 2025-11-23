import { useState } from "react";
import { usePosts } from "../../../shared/contexts/PostsContext";

export function useSummaryState() {
  const [summary, setSummary] = useState<{ title: string; content: string } | null>(null);
  const { dispatch } = usePosts();

  const saveSummary = () => {
    if (!summary) return;

    dispatch({
      type: "ADD_POST",
      payload: {
        title: summary.title,
        content: summary.content,
        createdAt: new Date().toISOString()
      }
    });

    alert("저장 완료!");
  };

  return {
    summary,
    setSummary,
    saveSummary,
  };
}