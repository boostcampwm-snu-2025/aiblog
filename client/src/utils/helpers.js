/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
};

/**
 * Format date to readable string
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Extract first line of commit message
 */
export const getCommitTitle = (message) => {
  if (!message) return '';
  return message.split('\n')[0];
};

/**
 * Parse repository URL or path
 * Supports: 
 * - github.com/owner/repo
 * - owner/repo
 * - https://github.com/owner/repo
 */
export const parseRepositoryInput = (input) => {
  if (!input) return null;

  // Remove whitespace
  input = input.trim();

  // Remove trailing .git
  input = input.replace(/\.git$/, '');

  // Pattern 1: owner/repo
  const simplePattern = /^([^\/\s]+)\/([^\/\s]+)$/;
  const simpleMatch = input.match(simplePattern);
  if (simpleMatch) {
    return { owner: simpleMatch[1], repo: simpleMatch[2] };
  }

  // Pattern 2: github.com/owner/repo or https://github.com/owner/repo
  const urlPattern = /github\.com\/([^\/\s]+)\/([^\/\s]+)/;
  const urlMatch = input.match(urlPattern);
  if (urlMatch) {
    return { owner: urlMatch[1], repo: urlMatch[2] };
  }

  return null;
};

/**
 * Search filter for commits
 */
export const filterCommits = (commits, searchQuery) => {
  if (!searchQuery) return commits;
  
  const query = searchQuery.toLowerCase();
  return commits.filter(commit => 
    commit.message.toLowerCase().includes(query) ||
    commit.author.name.toLowerCase().includes(query) ||
    commit.author.login?.toLowerCase().includes(query)
  );
};

/**
 * Search filter for pull requests
 */
export const filterPullRequests = (pulls, searchQuery) => {
  if (!searchQuery) return pulls;
  
  const query = searchQuery.toLowerCase();
  return pulls.filter(pr => 
    pr.title.toLowerCase().includes(query) ||
    pr.user.login.toLowerCase().includes(query) ||
    pr.body?.toLowerCase().includes(query)
  );
};

/**
 * Sort commits
 */
export const sortCommits = (commits, sortBy, sortOrder) => {
  const sorted = [...commits].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(b.author.date) - new Date(a.author.date);
        break;
      case 'author':
        comparison = a.author.name.localeCompare(b.author.name);
        break;
      case 'message':
        comparison = a.message.localeCompare(b.message);
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? -comparison : comparison;
  });
  
  return sorted;
};

/**
 * Sort pull requests
 */
export const sortPullRequests = (pulls, sortBy, sortOrder) => {
  const sorted = [...pulls].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(b.created_at) - new Date(a.created_at);
        break;
      case 'author':
        comparison = a.user.login.localeCompare(b.user.login);
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'state':
        comparison = a.state.localeCompare(b.state);
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? -comparison : comparison;
  });
  
  return sorted;
};
