import { Box, Typography } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';

export function NoDataState({ message = 'Please fetch data to see recent activity.' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '200px',
        color: 'text.secondary',
        p: 3,
        textAlign: 'center',
      }}
    >
      <SearchOffIcon sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
      <Typography>{message}</Typography>
    </Box>
  );
}