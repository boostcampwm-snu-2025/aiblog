import {
  Grid,
  Typography,
  Paper,
  Box,
  TextField,
  Divider,
  Link,
} from '@mui/material';
import { useAppContext } from '@/contexts/AppContext';
import CommitIcon from '@mui/icons-material/Commit';
import PullRequestIcon from '@mui/icons-material/AltRoute';
import NoteAltIcon from '@mui/icons-material/NoteAlt';

// --- Helper Functions (copied from LeftPanel for consistency) ---

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch (e) {
    return dateString;
  }
};

const getItemId = (item) => item.oid || item.id;

// --- Component ---

export function RightPanel() {
  const { activeCommit, commitNotes, setCommitNotes } = useAppContext();

  /**
   * Handles changes to the notes textarea.
   * Updates the commitNotes state immutably.
   */
  const handleNoteChange = (event) => {
    if (!activeCommit) return;

    const newNote = event.target.value;
    const currentId = getItemId(activeCommit);

    setCommitNotes((prevNotes) => ({
      ...prevNotes,
      [currentId]: newNote,
    }));
  };

  /**
   * Renders the content based on whether an item is active.
   */
  const renderContent = () => {
    // 1. If no item is selected (activeCommit is null)
    if (!activeCommit) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
            color: 'text.secondary',
          }}
        >
          <NoteAltIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h6">Select an item</Typography>
          <Typography variant="body2">
            Click on an item from the list to see details and add notes for the
            AI summary.
          </Typography>
        </Box>
      );
    }

    // 2. If an item is selected
    const currentId = getItemId(activeCommit);
    const isCommit = activeCommit.__typename === 'Commit';
    const title = isCommit
      ? activeCommit.messageHeadline
      : activeCommit.title;
    const date = isCommit
      ? activeCommit.committedDate
      : activeCommit.createdAt;
    const user =
      (isCommit
        ? activeCommit.author?.user?.login
        : activeCommit.author?.login) || 'unknown';
    const noteValue = commitNotes[currentId] || '';

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Section 1: Item Details */}
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
            href={activeCommit.url}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            View on GitHub
          </Link>
        </Typography>

        <Divider />

        {/* Section 2: AI Notes Textarea */}
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Notes for AI Summary
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={8}
          variant="outlined"
          placeholder="What was the context for this change? What was important about it? Your notes here will guide the AI summary."
          value={noteValue}
          onChange={handleNoteChange}
        />
        {/* TODO: Add "Generate Blog Post" button here 
          (It will use the 'checkedCommits' and 'commitNotes' states)
        */}
      </Box>
    );
  };

  return (
    <Grid item xs={12} md={6}>
      <Paper
        sx={{
          p: 3,
          height: '100%',
          minHeight: { xs: '300px', md: '70vh' }, // Ensure height matches LeftPanel area
          overflowY: 'auto',
          borderRadius: 2,
        }}
      >
        {renderContent()}
      </Paper>
    </Grid>
  );
}