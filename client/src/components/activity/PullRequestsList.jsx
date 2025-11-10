import { useMemo } from 'react';
import { usePullRequests } from '../../hooks/useGitHub';
import { useUIStore } from '../../store/uiStore';
import { filterPullRequests, sortPullRequests } from '../../utils/helpers';
import PullRequestItem from './PullRequestItem';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import EmptyState from '../common/EmptyState';

const PullRequestsList = ({ owner, repo }) => {
  const { itemsPerPage, searchQuery, sortBy, sortOrder, prState } = useUIStore();
  
  const { data: pullRequests, isLoading, error, refetch } = usePullRequests(owner, repo, {
    per_page: itemsPerPage,
    state: prState
  });

  // Apply search and sort
  const processedPRs = useMemo(() => {
    if (!pullRequests) return [];
    const filtered = filterPullRequests(pullRequests, searchQuery);
    return sortPullRequests(filtered, sortBy, sortOrder);
  }, [pullRequests, searchQuery, sortBy, sortOrder]);

  if (isLoading) {
    return <LoadingSpinner message="Loading pull requests..." />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error.message || 'Failed to load pull requests'} 
        onRetry={refetch}
      />
    );
  }

  if (!processedPRs || processedPRs.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        }
        title={searchQuery ? 'No pull requests found' : 'No pull requests available'}
        message={searchQuery ? 'Try adjusting your search query' : 'This repository has no pull requests yet'}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gh-fg-muted">
          Showing {processedPRs.length} pull request{processedPRs.length !== 1 ? 's' : ''}
        </div>
        
        <PRStateFilter />
      </div>
      
      {processedPRs.map((pr) => (
        <PullRequestItem key={pr.id} pullRequest={pr} />
      ))}
    </div>
  );
};

const PRStateFilter = () => {
  const { prState, setPRState } = useUIStore();

  const states = [
    { value: 'all', label: 'All' },
    { value: 'open', label: 'Open' },
    { value: 'closed', label: 'Closed' }
  ];

  return (
    <div className="flex gap-2">
      {states.map((state) => (
        <button
          key={state.value}
          onClick={() => setPRState(state.value)}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            prState === state.value
              ? 'bg-gh-accent-emphasis text-white'
              : 'bg-gh-canvas-default text-gh-fg-muted hover:text-gh-fg-default border border-gh-border-default'
          }`}
        >
          {state.label}
        </button>
      ))}
    </div>
  );
};

export default PullRequestsList;
