import { useState, useEffect } from "react";
import useFetch from "../../../shared/hooks/useFetch";
import { getSimplePRDetail } from "../../../shared/api/github";
import type { SimplePRDetail } from "../../../shared/api/github";

export function usePRDetail(owner: string, repo: string) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedPR, setSelectedPR] = useState<number | null>(null);

  const prDetailFetch = useFetch<SimplePRDetail, [string, string, number]>(
    getSimplePRDetail
  );

  const openDetail = (n: number) => {
    if (!owner || !repo) return;
    setSelectedPR(n);
    setDetailOpen(true);
  };

  useEffect(() => {
    if (detailOpen && selectedPR != null && owner && repo) {
      prDetailFetch.fetchData(owner, repo, selectedPR);
    }
  }, [detailOpen, selectedPR, owner, repo]);

  return {
    detailOpen,
    setDetailOpen,
    selectedPR,
    prDetailFetch,
    openDetail,
  };
}