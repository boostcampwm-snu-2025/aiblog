import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../../contexts/Appcontext';
import { useRepoContext } from '../../contexts/Repocontext';
import { authApi } from '../../api/auth';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export const LoginCallbackPage: React.FC = () => {
    const { setCurrentTab, setIsLoggedIn } = useAppContext();
    const { fetchRepos } = useRepoContext();
    const hasRun = useRef(false);

    useEffect(() => {
        // 중복 실행 방지
        if (hasRun.current) return;
        hasRun.current = true;

        const handleCallback = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');

            if (!code) {
                console.error('No code found in URL');
                setCurrentTab('github');
                return;
            }

            try {
                const response = await authApi.handleCallback(code);
                if (response.access_token) {
                    localStorage.setItem('access_token', response.access_token);
                    
                    if (setIsLoggedIn) {
                        setIsLoggedIn(true);
                    }

                    await fetchRepos();

                    setCurrentTab('github');
                    
                    window.history.replaceState({}, document.title, '/');
                } else {
                    console.error('No access token received');
                    setCurrentTab('github');
                }
            } catch (error) {
                console.error('Error during OAuth callback:', error);
                setCurrentTab('github');
            }
        };

        handleCallback();
    }, [setCurrentTab, setIsLoggedIn, fetchRepos]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                gap: 2
            }}
        >
            <CircularProgress />
            <Typography variant="h6">Processing...</Typography>
        </Box>
    );
};
