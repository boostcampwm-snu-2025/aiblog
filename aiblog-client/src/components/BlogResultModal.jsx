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
  Snackbar,
} from '@mui/material';
import { useMainPageContext } from '@/contexts/MainPageContext';
import { useAppContext } from '@/contexts/AppContext'; 
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { useState } from 'react';

export function BlogResultModal() {
  const {
    generatedContent,
    setGeneratedContent,
    generationError,
    setGenerationError,
    repoName,
  } = useMainPageContext();

  const { savePost } = useAppContext();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const isOpen = !!generatedContent || !!generationError;

  const handleClose = () => {
    setGeneratedContent(null);
    setGenerationError(null);
  };

  const handleSave = () => {
    if (!generatedContent) return;

    const newPost = {
      title: `Blog Post - ${repoName}`,
      content: generatedContent,
      repository: repoName,
    };

    savePost(newPost);
    setOpenSnackbar(true);
    handleClose();
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        aria-labelledby="blog-result-title"
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
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
          {generationError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {generationError}
            </Alert>
          )}

          {generatedContent && (
            <Box
              sx={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'inherit',
                lineHeight: 1.7,
                p: { xs: 1, md: 2 },
                '& h2': {
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  mt: 3,
                  mb: 1,
                  borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                  pb: 0.5,
                },
                '& ul': {
                  pl: 2.5,
                },
                '& li': {
                  mb: 0.5,
                }
              }}
            >
              {generatedContent}
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button onClick={handleClose} color="inherit">
            Close
          </Button>
          {generatedContent && (
            <Button
              onClick={handleSave}
              variant="contained"
              color="secondary"
              startIcon={<SaveIcon />}
            >
              Save Post
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Post saved successfully!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setOpenSnackbar(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
}