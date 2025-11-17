import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { formatDateTime } from '../../utils/date';
import type { PRItem } from '../../types/githubPR';
import { Typography } from '@mui/material';
import { useRepoContext } from '../../contexts/Repocontext';

interface PullRequestItemProps {
    pullRequest: PRItem
}

const PullRequestItem: React.FC<PullRequestItemProps> = ({ pullRequest }) => {
    const { selectedPullRequest, setSelectedPullRequest, setSelectedCommit } = useRepoContext();
    const formattedDate = formatDateTime(pullRequest.created_at, true);
    const isSelected = selectedPullRequest?.id === pullRequest.id;

    const handleSelect = () => {
        setSelectedPullRequest(pullRequest);
        setSelectedCommit(null);
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
                cursor: 'pointer'
            }}
        >
            <Avatar
                src={pullRequest.author_avatar_url}
                alt={pullRequest.author_login}
                sx={{ width: 48, height: 48 }}
            />

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link
                    href={pullRequest.html_url}
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
                    {pullRequest.title}
                </Link>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip
                        size="small"
                        label={pullRequest.author_login}
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
                    <Chip
                        size="small"
                        label={pullRequest.state}
                        sx={{
                            backgroundColor: 'grey.200',
                            color: 'grey.900',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                        }}
                    />
                </Stack>
                <Typography variant="body2" sx={{ mt: 1, color: 'rgba(0, 0, 0, 0.65)' }}>
                    {pullRequest.body || '설명이 없습니다.'}
                </Typography>
            </Box>
        </Box>
    );
};

export default PullRequestItem;