import { Container } from '@mui/material';
import { useAppContext } from '@/contexts/AppContext';

// Import components
import { Header } from '@/components/Header';

// Import pages
import { MainPage } from '@/pages/MainPage';
import { SavedPostsPage } from '@/pages/SavedPostsPage';
import { SettingsPage } from '@/pages/SettingsPage';

function App() {
  const { page } = useAppContext();

  // Helper function to render the correct page
  const renderPage = () => {
    switch (page) {
      case 'saved':
        return <SavedPostsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'main':
      default:
        return <MainPage />;
    }
  };

  return (
    <Container maxWidth="lg">
      <Header />
      {renderPage()}
    </Container>
  );
}

export default App;