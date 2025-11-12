import { Box, Typography } from '@mui/material';
import NoteAltIcon from '@mui/icons-material/NoteAlt';

export function EmptySelectionState({ children }) {
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
      <Typography variant="body2" sx={{ mb: 3 }}>
        Click on an item from the list to see details and add notes for the AI summary.
      </Typography>
      {children}
    </Box>
  );
}