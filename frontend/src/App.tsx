import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Header from './components/Header'
import { useAppContext } from './contexts/Appcontext'
import RepoPage from './components/Repo/RepoPage';
import PostPage from './components/Post/PostPage';
import { LoginCallbackPage } from './components/Login/LoginCallbackPage';

function App() {

  const { currentTab, setCurrentTab } = useAppContext();

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
        return <LoginCallbackPage />;
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
