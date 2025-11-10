import { formatRelativeTime, truncateText } from '../../utils/helpers';

const PullRequestItem = ({ pullRequest: pr }) => {
  const getStateColor = () => {
    if (pr.merged_at) return 'text-purple-500';
    if (pr.state === 'open') return 'text-gh-success-fg';
    return 'text-gh-danger-fg';
  };

  const getStateIcon = () => {
    if (pr.merged_at) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
          <path d="M5 3.254V3.25v.005a.75.75 0 110-.005v.004zm.45 1.9a2.25 2.25 0 10-1.95.218v5.256a2.25 2.25 0 101.5 0V7.123A5.735 5.735 0 009.25 9h1.378a2.251 2.251 0 100-1.5H9.25a4.25 4.25 0 01-3.8-2.346zM12.75 9a.75.75 0 100-1.5.75.75 0 000 1.5zm-8.5 4.5a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
        </svg>
      );
    }
    if (pr.state === 'open') {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
          <path d="M1.5 3.25a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zm5.677-.177L9.573.677A.25.25 0 0110 .854V2.5h1A2.5 2.5 0 0113.5 5v5.628a2.251 2.251 0 11-1.5 0V5a1 1 0 00-1-1h-1v1.646a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm0 9.5a.75.75 0 100 1.5.75.75 0 000-1.5zm8.25.75a.75.75 0 111.5 0 .75.75 0 01-1.5 0z"/>
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
        <path d="M3.25 1A2.25 2.25 0 011 3.25v9.5A2.25 2.25 0 013.25 15h9.5A2.25 2.25 0 0115 12.75v-9.5A2.25 2.25 0 0012.75 1h-9.5zm9.5 1.5a.75.75 0 01.75.75v9.5a.75.75 0 01-.75.75h-9.5a.75.75 0 01-.75-.75v-9.5a.75.75 0 01.75-.75h9.5z"/>
      </svg>
    );
  };

  return (
    <div className="bg-gh-canvas-default border border-gh-border-default rounded-lg p-4 hover:border-gh-border-muted transition-colors">
      <div className="flex items-start space-x-3">
        {/* State Icon */}
        <div className={`flex-shrink-0 mt-1 ${getStateColor()}`}>
          {getStateIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Number */}
          <div className="flex items-start justify-between">
            <h3 className="text-gh-fg-default font-medium leading-tight flex-1">
              {pr.title}
              <span className="ml-2 text-gh-fg-muted font-normal">
                #{pr.number}
              </span>
            </h3>
            <span className="ml-2 text-xs text-gh-fg-muted whitespace-nowrap">
              {formatRelativeTime(pr.created_at)}
            </span>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gh-fg-muted">
            <div className="flex items-center space-x-2">
              {pr.user.avatar_url && (
                <img
                  src={pr.user.avatar_url}
                  alt={pr.user.login}
                  className="w-5 h-5 rounded-full"
                />
              )}
              <span className="font-medium text-gh-fg-default">{pr.user.login}</span>
            </div>

            <div className="flex items-center space-x-1">
              <span>from</span>
              <code className="px-1 py-0.5 bg-gh-canvas-subtle rounded text-xs">
                {pr.head.ref}
              </code>
              <span>to</span>
              <code className="px-1 py-0.5 bg-gh-canvas-subtle rounded text-xs">
                {pr.base.ref}
              </code>
            </div>

            {pr.merged_at && (
              <span className="text-purple-500 font-medium">
                Merged {formatRelativeTime(pr.merged_at)}
              </span>
            )}
          </div>

          {/* Labels */}
          {pr.labels && pr.labels.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {pr.labels.slice(0, 3).map((label) => (
                <span
                  key={label.name}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `#${label.color}20`,
                    color: `#${label.color}`
                  }}
                >
                  {label.name}
                </span>
              ))}
              {pr.labels.length > 3 && (
                <span className="text-xs text-gh-fg-muted">
                  +{pr.labels.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Link */}
          <div className="mt-2">
            <a
              href={pr.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-xs text-gh-accent-fg hover:underline"
            >
              <span>View on GitHub</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PullRequestItem;
