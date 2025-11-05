import { Grid, Typography, Paper } from '@mui/material';

export function RightPanel() {
  return (
    <Grid item xs={12} md={6}>
      <Typography variant="h5" gutterBottom>
        Details & Summary Notes
      </Typography>
      <Paper
        sx={{
          p: 2,
          minHeight: '60vh',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
        }}
      >
        <Typography color="textSecondary">
          Select an item from the list to see details here.
        </Typography>
      </Paper>
    </Grid>
  );
}