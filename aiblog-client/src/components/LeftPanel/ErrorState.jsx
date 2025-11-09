import { Alert } from '@mui/material';

export function ErrorState({ message }) {
  return (
    <Alert severity="error" sx={{ m: 2 }}>
      {message}
    </Alert>
  );
}