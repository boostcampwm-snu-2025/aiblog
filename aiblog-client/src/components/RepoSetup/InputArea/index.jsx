import { Box } from '@mui/material';
import { RepoInput } from './RepoInput';
import { FetchButton } from './FetchButton';

export function InputArea() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
      <RepoInput />
      <FetchButton />
    </Box>
  );
}