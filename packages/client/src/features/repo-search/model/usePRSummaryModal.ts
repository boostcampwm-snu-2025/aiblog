import { useState, useCallback } from "react";
import {
  generatePRSummary,
  generateBlogPost,
  saveBlogPost,
} from "../../../shared/api";
import { extractErrorMessage } from "../../../shared/lib/errorUtils";

type PRSummaryModalState = {
  isOpen: boolean;
  summary: string | null;
  blogPost: string | null;
  blogPostTitle: string | null;
  isLoading: boolean;
  isLoadingBlogPost: boolean;
  isSavingBlogPost: boolean;
  error: string | null;
  blogPostError: string | null;
  saveBlogPostError: string | null;
  savedBlogPostId: string | null;
  currentPRNumber: number | null;
  currentRepoUrl: string | null;
};

const INITIAL_STATE: PRSummaryModalState = {
  isOpen: false,
  summary: null,
  blogPost: null,
  blogPostTitle: null,
  isLoading: false,
  isLoadingBlogPost: false,
  isSavingBlogPost: false,
  error: null,
  blogPostError: null,
  saveBlogPostError: null,
  savedBlogPostId: null,
  currentPRNumber: null,
  currentRepoUrl: null,
};

export function usePRSummaryModal() {
  const [state, setState] = useState<PRSummaryModalState>(INITIAL_STATE);

  const openModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: true,
      error: null,
      summary: null,
      blogPost: null,
      blogPostTitle: null,
      blogPostError: null,
      saveBlogPostError: null,
      savedBlogPostId: null,
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
          currentPRNumber: pullNumber,
          currentRepoUrl: url,
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

  const generateBlogPostContent = useCallback(async () => {
    if (!state.currentRepoUrl || !state.currentPRNumber || !state.summary) {
      setState((prev) => ({
        ...prev,
        blogPostError: "블로그 글 생성을 위한 정보가 부족합니다.",
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      isLoadingBlogPost: true,
      blogPostError: null,
      blogPost: null,
    }));

    try {
      const result = await generateBlogPost({
        url: state.currentRepoUrl,
        pullNumber: state.currentPRNumber,
        summary: state.summary,
      });
      setState((prev) => ({
        ...prev,
        blogPost: result.blogPost,
        blogPostTitle: result.blogPostTitle ?? null,
        isLoadingBlogPost: false,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        blogPostError: extractErrorMessage(
          err,
          "블로그 글 생성에 실패했습니다."
        ),
        isLoadingBlogPost: false,
      }));
    }
  }, [state.currentRepoUrl, state.currentPRNumber, state.summary]);

  const saveBlogPostToServer = useCallback(async (): Promise<boolean> => {
    if (!state.currentRepoUrl || !state.currentPRNumber || !state.blogPost) {
      setState((prev) => ({
        ...prev,
        saveBlogPostError: "블로그 글 저장을 위한 정보가 부족합니다.",
      }));
      return false;
    }

    setState((prev) => ({
      ...prev,
      isSavingBlogPost: true,
      saveBlogPostError: null,
      savedBlogPostId: null,
    }));

    try {
      const result = await saveBlogPost({
        url: state.currentRepoUrl,
        pullNumber: state.currentPRNumber,
        blogPost: state.blogPost,
        summary: state.summary,
        title: state.blogPostTitle ?? undefined,
      });
      setState((prev) => ({
        ...prev,
        isSavingBlogPost: false,
        savedBlogPostId: result.id,
      }));
      return true;
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isSavingBlogPost: false,
        saveBlogPostError: extractErrorMessage(
          err,
          "블로그 글 저장에 실패했습니다."
        ),
      }));
      return false;
    }
  }, [
    state.currentRepoUrl,
    state.currentPRNumber,
    state.blogPost,
    state.summary,
    state.blogPostTitle,
  ]);

  return {
    isOpen: state.isOpen,
    summary: state.summary,
    blogPost: state.blogPost,
    blogPostTitle: state.blogPostTitle,
    isLoading: state.isLoading,
    isLoadingBlogPost: state.isLoadingBlogPost,
    isSavingBlogPost: state.isSavingBlogPost,
    error: state.error,
    blogPostError: state.blogPostError,
    saveBlogPostError: state.saveBlogPostError,
    savedBlogPostId: state.savedBlogPostId,
    openModal,
    closeModal,
    generateSummary,
    generateBlogPostContent,
    saveBlogPostToServer,
  };
}
