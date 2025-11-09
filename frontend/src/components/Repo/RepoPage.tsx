import React from 'react';
import Box from '@mui/material/Box';
import { useRepoContext } from '../../contexts/Repocontext';
import RepoCard from './RepoCard';
import { Typography } from '@mui/material';
import { useAppContext } from '../../contexts/Appcontext';

const RepoPage: React.FC = () => {
    const {isLoggedIn} = useAppContext();
    const { repos, selectedFeed } = useRepoContext();
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%'
            }}>
            <Typography variant="h4" sx={{ padding: 5, display:  isLoggedIn ? 'block' : 'none' }}>
                GitHub Repositories
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
                <Box
                    sx={{
                        ml: 5,
                        mr: 5,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'start',
                        gap: 2
                    }}
                >
                    {repos.map(repo => (
                        <Box key={repo.id} sx={{ width: '100%', maxWidth: 800 }}>
                            <RepoCard repo={repo} />
                        </Box>
                    ))}
                </Box>
                <Box
                    sx={{
                        padding: 3,
                    }}
                >
                    <Typography variant="h4" sx={{ padding: 2, display: isLoggedIn ? 'block' : 'none' }}>
                        Selected {selectedFeed === 'commits' ? 'Commits' : 'Pull Requests'}
                    </Typography>
                    
                </Box>
            </Box>
        </Box>
    );
};

export default RepoPage;