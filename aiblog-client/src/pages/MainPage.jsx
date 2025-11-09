import { Grid, Box } from '@mui/material';
import { RepoSetup } from '@/components/RepoSetup';
import { LeftPanel } from '@/components/LeftPanel';
import { RightPanel } from '@/components/RightPanel';
import { MainPageProvider, useMainPageContext } from '@/contexts/MainPageContext';

function MainPageContent() {
  const { githubData, apiError } = useMainPageContext();

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <RepoSetup />

      {(githubData || apiError) && (
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <LeftPanel />
          </Grid>
          <Grid item xs={12} md={6}>
            <RightPanel />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export function MainPage() {
  return (
    <MainPageProvider>
      <MainPageContent />
    </MainPageProvider>
  );
}