import {
  Box,
  CircularProgress,
  Typography,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Link,
  Divider,
  ListItemButton, // Use ListItemButton for click effects
  FormControlLabel, // For the "Select All" checkbox
} from '@mui/material';
import { useAppContext } from '@/contexts/AppContext';
import { useMemo } from 'react';
import CommitIcon from '@mui/icons-material/Commit';
import PullRequestIcon from '@mui/icons-material/AltRoute';

// Helper to format date strings (e.g., "2023-10-27T10:00:00Z" -> "2023-10-27")
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch (e) {
    return dateString;
  }
};

// Helper to get the unique ID for an item
const getItemId = (item) => item.oid || item.id;

export function LeftPanel() {
  const {
    isLoading,
    apiError,
    githubData,
    filterType,
    // Get new states and setters
    checkedCommits,
    setCheckedCommits,
    activeCommit,
    setActiveCommit,
  } = useAppContext();

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
    return allItems.sort((a, b) => {
      const dateA = new Date(a.committedDate || a.createdAt);
      const dateB = new Date(b.committedDate || b.createdAt);
      return dateB - dateA;
    });
  }, [githubData, filterType]);

  // --- Event Handlers ---

  /**
   * Handles individual checkbox clicks.
   */
  const handleToggleCheckbox = (item) => {
    const id = getItemId(item);
    // Create a new Set from the old one
    const newChecked = new Set(checkedCommits);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedCommits(newChecked);
  };

  /**
   * Handles the "Select All" checkbox click.
   */
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      // Select all items
      const allItemIds = new Set(items.map(getItemId));
      setCheckedCommits(allItemIds);
    } else {
      // Deselect all items
      setCheckedCommits(new Set());
    }
  };

  /**
   * Handles clicking on a list item to show details.
   */
  const handleItemClick = (item) => {
    setActiveCommit(item);
  };

  // --- Derived State for Checkboxes ---
  const allItemIds = useMemo(() => items.map(getItemId), [items]);
  const numChecked = checkedCommits.size;
  const numItems = allItemIds.length;
  const isAllSelected = numItems > 0 && numChecked === numItems;
  const isIndeterminate = numChecked > 0 && numChecked < numItems;

  // 2. Conditional Rendering Logic
  const renderContent = () => {
    // 2a. Loading state
    if (isLoading) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
          }}
        >
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading data...</Typography>
        </Box>
      );
    }

    // 2b. Error state
    if (apiError) {
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          {apiError}
        </Alert>
      );
    }

    // 2c. No data yet
    if (!githubData || items.length === 0) {
      return (
        <Typography sx={{ p: 3, textAlign: 'center', color: 'grey.600' }}>
          Please fetch data to see recent activity.
        </Typography>
      );
    }

    // 2d. Data loaded - render the list
    return (
      <List dense sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
        {/* --- "Select All" Checkbox --- */}
        <ListItem sx={{ pl: 1, pr: 2, borderBottom: '1px solid #eee' }}>
          <ListItemIcon sx={{ minWidth: 0, mr: 1 }}>
            <Checkbox
              edge="start"
              checked={isAllSelected}
              indeterminate={isIndeterminate}
              onChange={handleSelectAll}
              inputProps={{ 'aria-label': 'select all items' }}
            />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {numChecked} / {numItems} selected
              </Typography>
            }
          />
        </ListItem>

        {/* --- List Items --- */}
        {items.map((item, index) => {
          const id = getItemId(item);
          const isCommit = item.__typename === 'Commit';
          const isChecked = checkedCommits.has(id);
          const isActive = activeCommit && getItemId(activeCommit) === id;

          const title = isCommit ? item.messageHeadline : item.title;
          const date = isCommit ? item.committedDate : item.createdAt;
          const user =
            (isCommit ? item.author?.user?.login : item.author?.login) ||
            'unknown';

          return (
            <Box key={id}>
              {/* Use ListItemButton for the click+select effect */}
              <ListItemButton
                onClick={() => handleItemClick(item)}
                selected={isActive} // Highlight if active
                sx={{ pl: 1 }}
              >
                {/* Checkbox Area */}
                <ListItemIcon sx={{ minWidth: 0, mr: 1 }}>
                  <Checkbox
                    edge="start"
                    checked={isChecked}
                    onChange={() => handleToggleCheckbox(item)}
                    onClick={(e) => e.stopPropagation()} // Stop click from bubbling to ListItemButton
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': `label-${id}` }}
                  />
                </ListItemIcon>
                
                {/* Icon (Commit/PR) */}
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
                
                {/* Text Content */}
                <ListItemText
                  id={`label-${id}`}
                  primary={
                    <Typography variant="body1" noWrap>
                      {title}
                    </Typography>
                  }
                  secondary={`${user} • ${formatDate(date)}`}
                />

                {/* GitHub Link (Action) */}
                <Link
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ fontSize: '0.8rem', ml: 1 }}
                  onClick={(e) => e.stopPropagation()} // Stop click from bubbling
                >
                  View on GitHub
                </Link>
              </ListItemButton>
              {index < items.length - 1 && <Divider component="li" />}
            </Box>
          );
        })}
      </List>
    );
  };

  return (
    <Box
      sx={{
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        height: '100%',
        minHeight: '200px',
        overflow: 'hidden',
      }}
    >
      <Typography variant="h6" sx={{ p: 2, pb: 1, fontWeight: 600 }}>
        Recent Activity
      </Typography>
      <Box sx={{ overflowY: 'auto', maxHeight: '60vh' }}>
        {renderContent()}
      </Box>
    </Box>
  );
}