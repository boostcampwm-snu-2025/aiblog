import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from '@/theme'; 
import { useAppContext } from '@/contexts/AppContext';
import { Header } from '@/components/Header';
import { MainPage } from '@/pages/MainPage';
import { SavedPostsPage } from '@/pages/SavedPostsPage';
import { SettingsPage } from '@/pages/SettingsPage';

function AppContent() {
  const { page } = useAppContext();

  const renderPage = () => {
    switch (page) {
      case 'main':
        return <MainPage />;
      case 'saved':
        return <SavedPostsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <MainPage />;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        minHeight: '100vh',
        bgcolor: 'background.default', // Use theme background color
        color: 'text.primary', // Use theme text color
      }}
    >
      <Header />
      {/* Main content area with top padding for fixed header */}
      <Box component="main" sx={{ flexGrow: 1, pt: '64px' }}>
        {renderPage()}
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalize styles and apply background color */}
      <AppContent />
    </ThemeProvider>
  );
}

export default App;