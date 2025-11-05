import {
  Box,
  Grid,
} from '@mui/material';
import { RepoSetup } from '@/components/RepoSetup';
import { LeftPanel } from '@/components/LeftPanel';
import { RightPanel } from '@/components/RightPanel';
import { useAppContext } from '@/contexts/AppContext';

export function MainPage() {
  const { handleSubmit, repoName } = useAppContext();

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}
    >
      <RepoSetup />
      <Grid container spacing={3}>
        <LeftPanel />
        <RightPanel />
      </Grid>
    </Box>
  );
}