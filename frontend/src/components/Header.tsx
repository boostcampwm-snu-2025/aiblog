import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useAppContext } from '../contexts/Appcontext';
import { authApi } from '../api/auth';
import { useQueryClient } from '@tanstack/react-query';

const Header: React.FC = () => {
    const { currentTab, setCurrentTab, isLoggedIn, setIsLoggedIn } = useAppContext();
    const queryClient = useQueryClient();

    const handleLoginClick = () => {
        if (isLoggedIn) {
            // Logout logic will be implemented later
            if (setIsLoggedIn) {
                setIsLoggedIn(false);
                queryClient.removeQueries();
            }
            localStorage.removeItem('access_token');
        } else {
            authApi.login();
        }
    };

    const navItems = [
        { key: 'github', label: 'Github', onClick: () => setCurrentTab('github') },
        { key: 'post', label: 'Post', onClick: () => setCurrentTab('post') },
        { key: 'login', label: isLoggedIn ? 'Logout' : 'Login', onClick: handleLoginClick }
    ];

    return (
        <AppBar position="absolute" elevation={0} sx={{ backgroundColor: '#262626', width: '100%', maxHeight: 64 }}>
            <Toolbar disableGutters sx={{ px: 2, minHeight: 56 }}>
                {/* Left brand */}
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontWeight: 600, letterSpacing: 0.5, ml: 4, ":hover": { cursor: 'pointer' } }}
                    onClick={() => setCurrentTab('github')}
                >
                    Smart Blog
                </Typography>
                {/* Right nav */}
                <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
                    {navItems.map(item => (
                        <Button
                            key={item.key}
                            color="inherit"
                            onClick={item.onClick}
                            sx={{
                                fontWeight: currentTab === item.key ? 600 : 500,
                                position: 'relative',
                                '&::after': currentTab === item.key ? {
                                    content: '""',
                                    position: 'absolute',
                                    left: 8,
                                    right: 8,
                                    bottom: 4,
                                    height: 2,
                                    borderRadius: 1,
                                    backgroundColor: 'primary.main'
                                } : {},
                            }}
                        >
                            {item.label}
                        </Button>
                    ))}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;