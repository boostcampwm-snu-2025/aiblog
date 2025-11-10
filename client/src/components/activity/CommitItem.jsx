import { formatRelativeTime, getCommitTitle, truncateText } from '../../utils/helpers';

const CommitItem = ({ commit }) => {
  const title = getCommitTitle(commit.message);
  const hasBody = commit.message.split('\n').length > 1;

  return (
    <div className="bg-gh-canvas-default border border-gh-border-default rounded-lg p-4 hover:border-gh-border-muted transition-colors">
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {commit.author.avatar_url ? (
            <img
              src={commit.author.avatar_url}
              alt={commit.author.name}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gh-accent-emphasis flex items-center justify-center text-white font-semibold">
              {commit.author.name[0].toUpperCase()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="flex items-start justify-between">
            <h3 className="text-gh-fg-default font-medium leading-tight">
              {title}
            </h3>
            <span className="ml-2 text-xs text-gh-fg-muted whitespace-nowrap">
              {formatRelativeTime(commit.author.date)}
            </span>
          </div>

          {/* Metadata */}
          <div className="flex items-center space-x-4 mt-2 text-sm text-gh-fg-muted">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gh-fg-default">
                {commit.author.login || commit.author.name}
              </span>
              <span>committed</span>
            </div>

            {commit.stats?.total && (
              <div className="flex items-center space-x-2">
                <span className="text-gh-success-fg">+{commit.stats.additions || 0}</span>
                <span className="text-gh-danger-fg">-{commit.stats.deletions || 0}</span>
              </div>
            )}

            {commit.files_count > 0 && (
              <span>
                {commit.files_count} file{commit.files_count !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* SHA and Link */}
          <div className="flex items-center space-x-3 mt-2">
            <a
              href={commit.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-xs font-mono text-gh-accent-fg hover:underline"
            >
              <span>{commit.sha.substring(0, 7)}</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            {hasBody && (
              <button className="text-xs text-gh-accent-fg hover:underline">
                View details
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommitItem;
