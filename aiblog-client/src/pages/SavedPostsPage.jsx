import { Paper, Typography } from '@mui/material';

export function SavedPostsPage() {
  return (
    <Paper sx={{ p: 4, borderRadius: '8px' }}>
      <Typography variant="h4">Saved Posts</Typography>
      <Typography>This page will show your saved blog posts.</Typography>
    </Paper>
  );
}