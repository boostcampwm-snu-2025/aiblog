import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Header from './components/Header'
import { useAppContext } from './contexts/Appcontext'
import RepoPage from './components/Repo/RepoPage';
import PostPage from './pages/PostPage';
import { CallbackHandler } from './components/Login/CallbackHandler';

function App() {

  const { currentTab, setCurrentTab } = useAppContext();

  // Check if this is a callback from GitHub OAuth
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      setCurrentTab('callback');
    }
  }, [setCurrentTab]);

  const renderPage = () => {
    switch (currentTab) {
      case 'github':
        return <RepoPage />;
      case 'post':
        return <PostPage />;
      case 'callback':
        return <CallbackHandler />;
      default:
        return <RepoPage />;
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flex: 1, width: '100%', mt: 10 }}>
        {renderPage()}
      </Box>
    </Box>
  )
}

export default App
