import { Paper, Box } from '@mui/material';
import { useCommitNotes } from '@/hooks/useCommitNotes';
import { EmptySelectionState } from './EmptySelectionState';
import { GitHubItemDetails } from './GitHubItemDetails';
import { CommitNoteInput } from './CommitNoteInput';

export function RightPanel() {
  const { activeCommit, currentNote, handleNoteChange } = useCommitNotes();

  const renderContent = () => {
    if (!activeCommit) {
      return (
        <EmptySelectionState />
      );
    }

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, p: 0 }}>
        <GitHubItemDetails activeItem={activeCommit} />
        <CommitNoteInput
          value={currentNote}
          onChange={handleNoteChange}
        />
      </Box>
    );
  };

  return (
    <Paper
      sx={{
        p: 3,
        height: '100%',
        minHeight: { xs: '300px', md: '70vh' },
        overflowY: 'auto',
        borderRadius: 2,
      }}
    >
      {renderContent()}
    </Paper>
  );
}