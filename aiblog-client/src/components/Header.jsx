import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAppContext } from '@/contexts/AppContext';

export function Header() {
  const { setPage } = useAppContext();

  return (
    <AppBar position="static" sx={{ borderRadius: '4px' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          onClick={() => setPage('main')}
          sx={{ cursor: 'pointer' }}
        >
          Smart Blog
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button color="inherit" onClick={() => setPage('saved')}>
          Saved Posts
        </Button>
        <Button color="inherit" onClick={() => setPage('settings')}>
          Settings
        </Button>
      </Toolbar>
    </AppBar>
  );
}