import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import type { CommitItem as CommitItemType } from '../../types/githubCommit';
import { formatDateTime } from '../../utils/date';
import { useRepoContext } from '../../contexts/Repocontext';
import { memo } from 'react';
interface CommitItemProps {
    commit: CommitItemType;
}

const CommitItem: React.FC<CommitItemProps> = ({ commit }) => {
    const { selectedCommit, setSelectedCommit, setSelectedPullRequest } = useRepoContext();
    const formattedDate = formatDateTime(commit.date, true);
    const isSelected = selectedCommit?.sha === commit.sha;

    const handleSelect = () => {
        setSelectedCommit(commit);
        setSelectedPullRequest(null);
    };

    return (
        <Box
            role="button"
            tabIndex={0}
            onClick={handleSelect}
            onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleSelect();
                }
            }}
            sx={{
                borderRadius: 3,
                border: `1px solid ${isSelected ? 'rgba(25, 118, 210, 0.5)' : 'rgba(216, 27, 96, 0.18)'}`,
                backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.04)' : '#ffffff',
                p: { xs: 2, sm: 3 },
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                transition: 'box-shadow 0.25s ease, transform 0.25s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.08)' : 'rgba(244, 143, 177, 0.08)'
                },
                cursor: 'pointer',
            }}
        >
            <Avatar
                src={commit.owner_avatar_url}
                alt={commit.owner_login}
                sx={{ width: 48, height: 48 }}
            />

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link
                    href={commit.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="none"
                    sx={{
                        fontWeight: 700,
                        color: 'grey.900',
                        fontSize: '1.05rem',
                        ':hover': { textDecoration: 'underline' },
                        wordBreak: 'break-word',
                    }}
                >
                    {commit.message}
                </Link>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip
                        size="small"
                        label={commit.owner_login}
                        sx={{
                            backgroundColor: 'grey.200',
                            color: 'grey.800',
                            fontWeight: 600,
                            textTransform: 'capitalize',
                        }}
                    />
                    <Chip
                        size="small"
                        label={formattedDate}
                        sx={{
                            backgroundColor: 'grey.200',
                            color: 'grey.900',
                            fontWeight: 600,
                        }}
                    />
                </Stack>
            </Box>
        </Box>
    );
};

export default memo(CommitItem);
