import React from 'react';
import Box from '@mui/material/Box';
import { useRepoContext } from '../../contexts/Repocontext';
import RepoCard from './RepoCard';
import { Typography } from '@mui/material';
import { useAppContext } from '../../contexts/Appcontext';
import SelectedFeedCard from './SelectedFeedCard';

const RepoPage: React.FC = () => {
    const {isLoggedIn} = useAppContext();
    const { repos, selectedFeed } = useRepoContext();
    const selectedFeedLabel = selectedFeed === 'commits'
        ? 'Commit'
        : selectedFeed === 'pullRequests'
            ? 'Pull Request'
            : 'Item';
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
                    gap: 2,
                    flexWrap: 'wrap'
                }}
            >
                <Box
                    sx={{
                        ml: 3,
                        mr: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'start',
                        gap: 3,
                        flex: 1,
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
                        flex: 1,
                        minWidth: 500,
                    }}
                >
                    {isLoggedIn && (
                        <>
                            <Typography variant="h5" sx={{ mb: 2 }}>
                                Selected {selectedFeedLabel}
                            </Typography>
                            <SelectedFeedCard />
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default RepoPage;