import { Box, Collapse } from '@mui/material';
import { RepoInput } from './RepoInput';
import { FetchButton } from './FetchButton';
import { useAppContext } from '@/contexts/AppContext';

export function InputArea() {
  const { repoName } = useAppContext();

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
      <Box sx={{ flexGrow: 1 }}>
        <RepoInput />
      </Box>
      {repoName && (
        <Collapse in={!!repoName}>
          <FetchButton />
        </Collapse>
      )}
    </Box>
  );
}