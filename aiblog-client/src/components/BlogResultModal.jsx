import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Box,
  IconButton,
} from '@mui/material';
import { useMainPageContext } from '@/contexts/MainPageContext';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';

export function BlogResultModal() {
  const {
    generatedContent,
    setGeneratedContent,
    generationError,
    setGenerationError,
  } = useMainPageContext();

  // 1. Check if the modal should be open
  const isOpen = !!generatedContent || !!generationError;

  // 2. Handle closing the modal
  const handleClose = () => {
    setGeneratedContent(null);
    setGenerationError(null);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullWidth
      maxWidth="md" // Make modal wide for blog content
      aria-labelledby="blog-result-title"
      PaperProps={{
        sx: {
          bgcolor: 'background.paper', // Ensure dark theme background
        },
      }}
    >
      <DialogTitle
        id="blog-result-title"
        sx={{ display: 'flex', alignItems: 'center', gap: 1, m: 0, p: 2 }}
      >
        <AutoAwesomeIcon />
        Generated Blog Post
        <Box sx={{ flexGrow: 1 }} />
        <IconButton aria-label="close" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        {/* 3a. Handle Error State */}
        {generationError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {generationError}
          </Alert>
        )}

        {/* 3b. Handle Success State (Generated Content) */}
        {generatedContent && (
          <Box
            sx={{
              whiteSpace: 'pre-wrap', // This is crucial for rendering newlines
              fontFamily: 'inherit',
              lineHeight: 1.7,
              p: { xs: 1, md: 2 },
              '& h2': { // Style markdown titles
                fontSize: '1.5rem',
                fontWeight: 600,
                mt: 3,
                mb: 1,
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                pb: 0.5,
              },
              '& ul': { // Style markdown lists
                pl: 2.5,
              },
              '& li': {
                mb: 0.5,
              }
            }}
          >
            {/* We render as string, simple styling is applied via sx */}
            {generatedContent}
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 1.5 }}>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
        {/* TODO: Add "Save Post" button here for Week 3 */}
      </DialogActions>
    </Dialog>
  );
}