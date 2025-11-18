import { Box, Container } from '@mui/material';
import { RepoSetup } from '@/components/RepoSetup';
import { LeftPanel } from '@/components/LeftPanel';
import { RightPanel } from '@/components/RightPanel';
import { GenerateButton } from '@/components/GenerateButton';
import { BlogResultModal } from '@/components/BlogResultModal';
import { MainPageProvider, useMainPageContext } from '@/contexts/MainPageContext';

function MainPageContent() {
  const { githubData, apiError } = useMainPageContext();
  const showResults = !!(githubData || apiError);

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: showResults ? 'center' : 'flex-start',
        alignItems: showResults ? 'stretch' : 'center',
        minHeight: 'calc(75vh)',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: showResults ? '100%' : '600px',
          m: showResults ? '0 0 32px 0' : 'auto',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <RepoSetup />
      </Box>

      {showResults && (
        <>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 3,
              flexGrow: 1,
              height: 'calc(100% - 80px)', 
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0, height: '100%', minHeight: '500px' }}>
              <LeftPanel />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0, height: '100%', minHeight: '500px' }}>
              <RightPanel />
            </Box>
          </Box>

          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
             <GenerateButton fullWidth={false} sx={{ width: 'auto', px: 1, py: 0.5 }} />
          </Box>
        </>
      )}
      <BlogResultModal />
    </Container>
  );
}

export function MainPage() {
  return (
    <MainPageProvider>
      <MainPageContent />
    </MainPageProvider>
  );
}