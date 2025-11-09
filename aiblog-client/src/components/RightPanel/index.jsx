import { Paper, Box } from '@mui/material';
import { useCommitNotes } from '@/hooks/useCommitNotes';
import { EmptySelectionState } from './EmptySelectionState';
import { GitHubItemDetails } from './GitHubItemDetails';
import { CommitNoteInput } from './CommitNoteInput';
import { GenerateButton } from './GenerateButton';

export function RightPanel() {
  const { activeCommit, currentNote, handleNoteChange } = useCommitNotes();

  const renderContent = () => {
    // 1. If no item is selected
    if (!activeCommit) {
      return (
        <EmptySelectionState>
          <GenerateButton fullWidth={false} />
        </EmptySelectionState>
      );
    }

    // 2. If an item is selected
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Section 1: Item Details */}
        <GitHubItemDetails activeItem={activeCommit} />

        {/* Section 2: AI Notes Input */}
        <CommitNoteInput
          value={currentNote}
          onChange={handleNoteChange}
        />
        
        <GenerateButton fullWidth={true} />
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