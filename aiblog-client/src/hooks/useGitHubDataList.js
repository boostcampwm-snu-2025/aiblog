import { useMemo, useCallback } from 'react';
import { useMainPageContext } from '@/contexts/MainPageContext';

// Helper to get the unique ID for an item
const getItemId = (item) => item.oid || item.id;

/**
 * Custom hook to manage the logic for the GitHub data list.
 * Handles data parsing, sorting, and checkbox interactions.
 */
export function useGitHubDataList() {
  const {
    githubData,
    filterType,
    checkedCommits,
    setCheckedCommits,
    activeCommit,
    setActiveCommit,
  } = useMainPageContext();

  // 1. Parse and merge data based on filterType
  const items = useMemo(() => {
    if (!githubData?.data?.repository) return [];
    const { repository } = githubData.data;
    let commitNodes = [];
    let prNodes = [];

    if (filterType === 'commits' || filterType === 'all') {
      commitNodes =
        repository.defaultBranchRef?.target?.history?.nodes || [];
    }
    if (filterType === 'prs' || filterType === 'all') {
      prNodes = repository.pullRequests?.nodes || [];
    }

    const allItems = [...commitNodes, ...prNodes];
    // Sort descending by date (newest first)
    return allItems.sort((a, b) => {
      const dateA = new Date(a.committedDate || a.createdAt);
      const dateB = new Date(b.committedDate || b.createdAt);
      return dateB - dateA;
    });
  }, [githubData, filterType]);

  // 2. Derived state for checkboxes
  const checkboxState = useMemo(() => {
    const allItemIds = items.map(getItemId);
    const numChecked = checkedCommits.size;
    const numItems = allItemIds.length;

    return {
      numChecked,
      numItems,
      isAllSelected: numItems > 0 && numChecked === numItems,
      isIndeterminate: numChecked > 0 && numChecked < numItems,
    };
  }, [checkedCommits, items]);

  // 3. Event Handlers

  const handleToggleCheckbox = useCallback(
    (item) => {
      const id = getItemId(item);
      const newChecked = new Set(checkedCommits);
      if (newChecked.has(id)) {
        newChecked.delete(id);
      } else {
        newChecked.add(id);
      }
      setCheckedCommits(newChecked);
    },
    [checkedCommits, setCheckedCommits]
  );

  const handleSelectAll = useCallback(
    (event) => {
      if (event.target.checked) {
        const allItemIds = new Set(items.map(getItemId));
        setCheckedCommits(allItemIds);
      } else {
        setCheckedCommits(new Set());
      }
    },
    [items, setCheckedCommits]
  );

  const handleItemClick = useCallback(
    (item) => {
      setActiveCommit(item);
    },
    [setActiveCommit]
  );

  return {
    items,
    checkboxState,
    handleToggleCheckbox,
    handleSelectAll,
    handleItemClick,
    activeCommit, // Needed for highlighting selected item
    checkedCommits, // Needed for checking individual items
  };
}