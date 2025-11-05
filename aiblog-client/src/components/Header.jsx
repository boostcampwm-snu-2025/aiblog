import { AppBar, Toolbar, Typography } from '@mui/material';

export function Header() {
  return (
    <AppBar position="static" sx={{ mb: 4, borderRadius: '4px' }}>
      <Toolbar>
        <Typography variant="h6" component="div">
          AI Blog Generator
        </Typography>
      </Toolbar>
    </AppBar>
  );
}