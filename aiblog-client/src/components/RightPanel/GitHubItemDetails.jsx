import { Box, Typography, Link } from '@mui/material';
import CommitIcon from '@mui/icons-material/Commit';
import PullRequestIcon from '@mui/icons-material/AltRoute';

// Helper to format date strings
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch (e) {
    return dateString;
  }
};

export function GitHubItemDetails({ activeItem }) {
  if (!activeItem) return null;

  const isCommit = activeItem.__typename === 'Commit';
  const title = isCommit ? activeItem.messageHeadline : activeItem.title;
  const date = isCommit ? activeItem.committedDate : activeItem.createdAt;
  const user =
    (isCommit
      ? activeItem.author?.user?.login
      : activeItem.author?.login) || 'unknown';

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {isCommit ? (
          <CommitIcon
            fontSize="small"
            titleAccess="Commit"
            sx={{ color: 'text.secondary' }}
          />
        ) : (
          <PullRequestIcon
            fontSize="small"
            titleAccess="Pull Request"
            sx={{ color: 'success.main' }}
          />
        )}
        <Typography variant="h6" component="h3" sx={{ wordBreak: 'break-all' }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="body2" color="textSecondary" sx={{ mt: -1.5 }}>
        {user} • {formatDate(date)} •{' '}
        <Link
          href={activeItem.url}
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
        >
          View on GitHub
        </Link>
      </Typography>
    </>
  );
}