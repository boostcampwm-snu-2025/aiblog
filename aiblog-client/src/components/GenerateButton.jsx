import { Button, CircularProgress } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useMainPageContext } from '@/contexts/MainPageContext';
import { useBlogGenerator } from '@/hooks/useBlogGenerator';

export function GenerateButton({ fullWidth = false, sx = {} }) {
  const { checkedCommits, isGenerating } = useMainPageContext();  
  const { handleGenerateBlog } = useBlogGenerator();
  const count = checkedCommits.size;

  return (
    <Button
      variant="contained"
      color="primary"
      size="large"
      startIcon={isGenerating ? null : <AutoAwesomeIcon />}
      disabled={count === 0 || isGenerating}
      onClick={handleGenerateBlog}
      sx={{
        width: fullWidth ? '100%' : '80%',
        ...sx,
      }}
    >
      {isGenerating ? (
        <CircularProgress size={26} color="inherit" />
      ) : (
        `Generate Blog Post (${count})`
      )}
    </Button>
  );
}