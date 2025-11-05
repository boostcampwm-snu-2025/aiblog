import {
  Grid,
  Typography,
  Paper,
  Box,
  CircularProgress,
} from '@mui/material';
import { useAppContext } from '@/contexts/AppContext';

export function LeftPanel() {
  const { isLoading, error, data } = useAppContext();
  return (
    <Grid item xs={12} md={6}>
      <Typography variant="h5" gutterBottom>
        Recent Activity
      </Typography>
      <Paper
        sx={{
          p: 2,
          minHeight: '60vh',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
        }}
      >
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {error && <Typography color="error">{error}</Typography>}
        {data && <Typography>Data will render here</Typography>}
        {!isLoading && !error && !data && (
          <Typography color="textSecondary">
            Please enter a repository and click 'Fetch Data'.
          </Typography>
        )}
      </Paper>
    </Grid>
  );
}