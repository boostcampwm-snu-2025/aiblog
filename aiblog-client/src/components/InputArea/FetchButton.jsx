import { Button, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useAppContext } from '@/contexts/AppContext';

export function FetchButton() {
  const { isLoading, repoName } = useAppContext();

  return (
    <Button
      type="submit"
      variant="contained"
      size="large"
      endIcon={isLoading ? null : <SendIcon />}
      disabled={isLoading || !repoName}
      sx={{
        height: '56px',
        flexShrink: 0,
      }}
    >
      {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Fetch Data'}
    </Button>
  );
}