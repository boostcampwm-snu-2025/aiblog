import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
  Chip,
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

// Helper function (can be moved to utils/dateUtils.js later)
const formatDate = (isoString) => {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export function SavedPostDetailDialog({ post, onClose, onDelete }) {
  if (!post) return null;

  return (
    <Dialog
      open={!!post}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: { bgcolor: 'background.paper' } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <ArticleIcon color="primary" />
        <Typography variant="h6" component="span" sx={{ flexGrow: 1 }}>
          {post.title}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ p: 3 }}>
        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <Chip label={post.repository || 'Unknown Repo'} size="small" />
          <Typography variant="body2" color="text.secondary">
            {formatDate(post.createdAt)}
          </Typography>
        </Box>
        
        <Box
          sx={{
            whiteSpace: 'pre-wrap',
            fontFamily: 'inherit',
            lineHeight: 1.7,
            '& h1, & h2, & h3': { mt: 3, mb: 1, fontWeight: 600 },
            '& ul, & ol': { pl: 3 },
            '& li': { mb: 0.5 },
            '& code': { 
              bgcolor: 'action.hover', 
              p: 0.5, 
              borderRadius: 1, 
              fontFamily: 'monospace' 
            },
            '& pre': {
              bgcolor: 'action.hover',
              p: 2,
              borderRadius: 2,
              overflowX: 'auto',
              '& code': { p: 0, bgcolor: 'transparent' }
            }
          }}
        >
          {post.content}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={(e) => onDelete(e, post.id)} 
          color="error" 
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}