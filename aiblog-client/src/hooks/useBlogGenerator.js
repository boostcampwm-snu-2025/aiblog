import { useCallback } from 'react';
import { useMainPageContext } from '@/contexts/MainPageContext';
const getItemId = (item) => item.oid || item.id;

export function useBlogGenerator() {
  const {
    githubData,
    checkedCommits,
    commitNotes,
    setIsGenerating,
    setGeneratedContent,
    setGenerationError,
  } = useMainPageContext();

  const getSelectedItems = useCallback(() => {
    if (!githubData?.data?.repository || checkedCommits.size === 0) {
      return [];
    }

    const { repository } = githubData.data;
    const commitNodes =
      repository.defaultBranchRef?.target?.history?.nodes || [];
    const prNodes = repository.pullRequests?.nodes || [];

    const allItems = [...commitNodes, ...prNodes];

    return allItems.filter((item) => checkedCommits.has(getItemId(item)));
  }, [githubData, checkedCommits]);

  const handleGenerateBlog = useCallback(async () => {
    setIsGenerating(true);
    setGeneratedContent(null);
    setGenerationError(null);

    const selectedItems = getSelectedItems();

    if (selectedItems.length === 0) {
      setGenerationError('No items selected.');
      setIsGenerating(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/llm/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedItems: selectedItems,
          notes: commitNotes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate blog post.');
      }

      setGeneratedContent(data.text);
    } catch (error) {
      console.error('Blog generation error:', error.message);
      setGenerationError(error.message);
    } finally {
      setIsGenerating(false);
    }
  }, [
    getSelectedItems,
    commitNotes,
    setIsGenerating,
    setGeneratedContent,
    setGenerationError,
  ]);

  return { handleGenerateBlog };
}