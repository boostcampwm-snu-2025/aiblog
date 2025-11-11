import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { RepoItem } from '../../types/githubRepo';
import { useRepoContext } from '../../contexts/Repocontext';
import { formatDateTime } from '../../utils/date';
import { grey } from '@mui/material/colors';
import CommitList from '../Commit/CommitList';
import PullRequest from '../PullRequest/PullRequestList';

type FeedType = 'commits' | 'pullRequests';

const FEED_LABELS: Record<FeedType, string> = {
    commits: 'Commits',
    pullRequests: 'PRs',
};

interface RepoCardProps {
    repo: RepoItem;
}

const RepoCard: React.FC<RepoCardProps> = ({ repo }) => {
    const {
        selectedRepo,
        selectRepo,
        selectedFeed,
        setSelectedFeed,
        fetchRepoCommits,
        fetchRepoPullRequests,
    } = useRepoContext();

    const isActive = selectedRepo?.id === repo.id;

    const handleCardClick = () => {
        if (selectedRepo?.id === repo.id) {
            return;
        }
        selectRepo(repo.id);
    };

    const handleFeedClick = (feed: FeedType) => (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (selectedRepo?.id !== repo.id) {
            selectRepo(repo.id);
        }
        setSelectedFeed(feed);
        if (feed === 'commits') {
            void fetchRepoCommits(repo);
        } else {
            void fetchRepoPullRequests(repo);
        }
    };

    const formattedUpdatedAt = formatDateTime(repo.updated_at!, true);
    const formattedPushedAt = formatDateTime(repo.pushed_at!, false);

    return (
        <Box
            onClick={handleCardClick}
            sx={{
                borderRadius: 3,
                border: '1px solid',
                backgroundColor: isActive ? 'grey.200' : '#ffffff',
                p: { xs: 2, sm: 3 },
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                cursor: 'pointer',
                transition: 'box-shadow 0.25s ease, transform 0.25s ease, border-color 0.25s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                },
            }}
        >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                <Stack direction="row" spacing={2} alignItems="center" flex={1}>
                    <Avatar src={repo.owner_avatar_url} alt={repo.owner_login} sx={{ width: 48, height: 48 }} />
                    <Box>
                        <Link
                            href={repo.html_url}
                            onClick={event => event.stopPropagation()}
                            rel="noopener noreferrer"
                            target="_blank"
                            underline="none"
                            sx={{
                                display: 'inline-block',
                                fontWeight: 700,
                                color: grey,
                                fontSize: '1.05rem',
                                ':hover': { textDecoration: 'underline' },
                            }}
                        >
                            {repo.full_name}
                        </Link>
                        {repo.description && (
                            <Typography variant="body2" sx={{ mt: 0.5, color: 'rgba(0, 0, 0, 0.65)' }}>
                                {repo.description}
                            </Typography>
                        )}
                    </Box>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ ml: { sm: 'auto' } }}>
                    {(Object.keys(FEED_LABELS) as FeedType[]).map(feed => (
                        <Button
                            key={feed}
                            variant={selectedFeed === feed && isActive ? 'contained' : 'outlined'}
                            size="small"
                            onClick={handleFeedClick(feed)}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 999,
                                px: 2.5,
                                color: selectedFeed === feed && isActive ? '#ffffff' : 'grey.800',
                                backgroundColor: selectedFeed === feed && isActive ? 'grey.800' : 'transparent',
                                '&:hover': {
                                    backgroundColor: selectedFeed === feed && isActive ? 'grey.700' : 'rgba(244, 143, 177, 0.18)',
                                },
                            }}
                        >
                            {FEED_LABELS[feed]}
                        </Button>
                    ))}
                </Stack>
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip
                    size="small"
                    label={`Updated: ${formattedUpdatedAt}`}
                    sx={{
                        backgroundColor: 'grey.100',
                        color: 'grey.800',
                        fontWeight: 600,
                    }}
                />
                <Chip
                    size="small"
                    label={`Default Branch: ${repo.default_branch}`}
                    sx={{
                        backgroundColor: 'grey.100',
                        color: 'grey.800',
                        fontWeight: 600,
                    }}
                />
                <Chip
                    size="small"
                    label={`Last Push: ${formattedPushedAt}`}
                    sx={{
                        backgroundColor: 'grey.100',
                        color: 'grey.800',
                        fontWeight: 600,
                    }}
                />
            </Stack>

            {isActive && selectedFeed === 'commits' && (
                <Box sx={{ pt: 1 }}>
                    <CommitList />
                </Box>
            )}

            {isActive && selectedFeed === 'pullRequests' && (
                <Box sx={{ pt: 1 }}>
                    <PullRequest />
                </Box>
            )}
        </Box>
    );
};

export default RepoCard;