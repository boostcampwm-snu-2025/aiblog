import { Button } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useMainPageContext } from '@/contexts/MainPageContext';

export function GenerateButton({ fullWidth = false }) {
  const { checkedCommits } = useMainPageContext();
  const count = checkedCommits.size;

  return (
    <Button
      variant="contained"
      color="primary"
      size="large"
      startIcon={<AutoAwesomeIcon />}
      disabled={count === 0}
      sx={{
        width: fullWidth ? '100%' : '80%',
        mt: fullWidth ? 1 : 3, // Adjust margin based on context
      }}
      // onClick handler will be added in Week 2
    >
      Generate Blog Post ({count})
    </Button>
  );
}