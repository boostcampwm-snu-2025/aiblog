import { Button, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useMainPageContext } from '@/contexts/MainPageContext';

export function FetchButton() {
  const { isLoading, repoName, handleSubmit } = useMainPageContext();

  return (
    <Button
      type="submit"
      variant="contained"
      size="large"
      endIcon={isLoading ? null : <SendIcon />}
      disabled={isLoading || !repoName}
      onClick={handleSubmit}
      sx={{
        height: '56px',
        flexShrink: 0,
      }}
    >
      {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Fetch Data'}
    </Button>
  );
}