import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const formatDate = (isoString) => {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export function SavedPostList({ posts, onOpenPost, onDeletePost }) {
  return (
    <Grid container spacing={3}>
      {posts.map((post) => (
        <Grid item xs={12} sm={6} md={4} key={post.id}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6,
              }
            }}
            onClick={() => onOpenPost(post)}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Chip 
                  label={post.repository || 'Unknown Repo'} 
                  size="small" 
                  color="primary" 
                  variant="outlined" 
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarTodayIcon fontSize="inherit" />
                  {formatDate(post.createdAt)}
                </Typography>
              </Box>
              
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600, lineHeight: 1.4 }}>
                {post.title || 'Untitled Post'}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
              }}>
                {post.content}
              </Typography>
            </CardContent>
            
            <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
              <IconButton 
                aria-label="delete" 
                color="error" 
                onClick={(e) => onDeletePost(e, post.id)}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}