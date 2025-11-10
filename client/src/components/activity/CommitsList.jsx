import { useMemo } from 'react';
import { useCommits } from '../../hooks/useGitHub';
import { useUIStore } from '../../store/uiStore';
import { filterCommits, sortCommits } from '../../utils/helpers';
import CommitItem from './CommitItem';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import EmptyState from '../common/EmptyState';

const CommitsList = ({ owner, repo }) => {
  const { itemsPerPage, searchQuery, sortBy, sortOrder } = useUIStore();
  
  const { data: commits, isLoading, error, refetch } = useCommits(owner, repo, {
    per_page: itemsPerPage
  });

  // Apply search and sort
  const processedCommits = useMemo(() => {
    if (!commits) return [];
    const filtered = filterCommits(commits, searchQuery);
    return sortCommits(filtered, sortBy, sortOrder);
  }, [commits, searchQuery, sortBy, sortOrder]);

  if (isLoading) {
    return <LoadingSpinner message="Loading commits..." />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error.message || 'Failed to load commits'} 
        onRetry={refetch}
      />
    );
  }

  if (!processedCommits || processedCommits.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
        title={searchQuery ? 'No commits found' : 'No commits available'}
        message={searchQuery ? 'Try adjusting your search query' : 'This repository has no commits yet'}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-gh-fg-muted mb-4">
        Showing {processedCommits.length} commit{processedCommits.length !== 1 ? 's' : ''}
      </div>
      
      {processedCommits.map((commit) => (
        <CommitItem key={commit.sha} commit={commit} />
      ))}
    </div>
  );
};

export default CommitsList;
