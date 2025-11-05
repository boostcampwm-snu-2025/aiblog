import { Paper, Typography } from '@mui/material';

export function SettingsPage() {
  return (
    <Paper sx={{ p: 4, borderRadius: '8px' }}>
      <Typography variant="h4">Settings</Typography>
      <Typography>This page will contain application settings.</Typography>
    </Paper>
  );
}