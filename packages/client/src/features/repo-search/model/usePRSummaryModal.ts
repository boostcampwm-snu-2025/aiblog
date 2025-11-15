import { useState, useCallback } from "react";
import { generatePRSummary } from "../../../shared/api";
import { extractErrorMessage } from "../../../shared/lib/errorUtils";

type PRSummaryModalState = {
  isOpen: boolean;
  summary: string | null;
  isLoading: boolean;
  error: string | null;
};

const INITIAL_STATE: PRSummaryModalState = {
  isOpen: false,
  summary: null,
  isLoading: false,
  error: null,
};

export function usePRSummaryModal() {
  const [state, setState] = useState<PRSummaryModalState>(INITIAL_STATE);

  const openModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: true,
      error: null,
      summary: null,
    }));
  }, []);

  const closeModal = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const generateSummary = useCallback(
    async (url: string, pullNumber: number) => {
      if (!url) {
        setState((prev) => ({
          ...prev,
          error: "레포지토리 URL이 필요합니다.",
        }));
        return;
      }

      openModal();
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        summary: null,
      }));

      try {
        const result = await generatePRSummary({
          url,
          pullNumber,
        });
        setState((prev) => ({
          ...prev,
          summary: result.summary,
          isLoading: false,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: extractErrorMessage(err, "요약 생성에 실패했습니다."),
          isLoading: false,
        }));
      }
    },
    [openModal]
  );

  return {
    isOpen: state.isOpen,
    summary: state.summary,
    isLoading: state.isLoading,
    error: state.error,
    openModal,
    closeModal,
    generateSummary,
  };
}
