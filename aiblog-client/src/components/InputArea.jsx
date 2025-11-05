import { Grid, TextField, Button, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useAppContext } from '@/contexts/AppContext';

export function InputArea() {
  const { repoName, setRepoName, isLoading } = useAppContext();

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={8}>
        <TextField
          fullWidth
          label="Repository Name (e.g., owner/repo)"
          variant="outlined"
          value={repoName}
          onChange={(e) => setRepoName(e.target.value)}
          disabled={isLoading}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          endIcon={isLoading ? null : <SendIcon />}
          disabled={isLoading || !repoName}
          sx={{ height: '56px' }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Fetch Data'}
        </Button>
      </Grid>
    </Grid>
  );
}