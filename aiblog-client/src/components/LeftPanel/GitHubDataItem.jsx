import {
  Box,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
  Typography,
  Link,
  Divider,
} from '@mui/material';
import CommitIcon from '@mui/icons-material/Commit';
import PullRequestIcon from '@mui/icons-material/AltRoute';
import { formatDate } from '@/utils'

// Helper to get the unique ID for an item
const getItemId = (item) => item.oid || item.id;

export function GitHubDataItem({
  item,
  isChecked,
  isActive,
  onToggleCheckbox,
  onItemClick,
  isLastItem,
}) {
  const id = getItemId(item);
  const isCommit = item.__typename === 'Commit';

  const title = isCommit ? item.messageHeadline : item.title;
  const date = isCommit ? item.committedDate : item.createdAt;
  const user =
    (isCommit ? item.author?.user?.login : item.author?.login) || 'unknown';

  return (
    <Box key={id}>
      <ListItemButton
        onClick={() => onItemClick(item)}
        selected={isActive}
        sx={{ pl: 1 }}
      >
        <ListItemIcon sx={{ minWidth: 0, mr: 1 }}>
          <Checkbox
            edge="start"
            checked={isChecked}
            onChange={() => onToggleCheckbox(item)}
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
            disableRipple
            inputProps={{ 'aria-labelledby': `label-${id}` }}
          />
        </ListItemIcon>
        <ListItemIcon sx={{ minWidth: 0, mr: 1.5 }}>
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
        </ListItemIcon>
        <ListItemText
          id={`label-${id}`}
          primary={
            <Typography variant="body1" noWrap>
              {title}
            </Typography>
          }
          secondary={`${user} • ${formatDate(date)}`}
        />
        <Link
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ fontSize: '0.8rem', ml: 1 }}
          onClick={(e) => e.stopPropagation()}
        >
          View on GitHub
        </Link>
      </ListItemButton>
      {!isLastItem && <Divider component="li" />}
    </Box>
  );
}