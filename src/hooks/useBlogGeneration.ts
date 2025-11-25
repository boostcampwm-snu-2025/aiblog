import { useBlog } from '../contexts/BlogContext';
import type { AsyncState, BlogGenerationData } from '../types';

/**
 * 블로그 생성 로직을 관리하는 커스텀 훅
 */
export function useBlogGeneration() {
  const { state, generateBlog, clearCurrentBlog } = useBlog();

  const handleGenerate = async (owner: string, repo: string, commitSha: string) => {
    await generateBlog(owner, repo, commitSha);
  };

  const handleClear = () => {
    clearCurrentBlog();
  };

  return {
    currentBlog: state.currentBlog,
    generationState: state.generationState,
    isGenerating: state.generationState.status === 'loading',
    hasError: state.generationState.status === 'error',
    error: state.generationState.status === 'error' ? state.generationState.error : null,
    generateBlog: handleGenerate,
    clearBlog: handleClear,
  };
}
