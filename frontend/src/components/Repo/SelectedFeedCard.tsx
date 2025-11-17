import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useMemo, useState } from 'react';
import { useRepoContext } from '../../contexts/Repocontext';
import { formatDateTime } from '../../utils/date';
import { summaryApi } from '../../api/summaries';

const SelectedFeedCard = () => {
    const { selectedFeed, selectedCommit, selectedPullRequest, selectedRepo } = useRepoContext();
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isTruncated, setIsTruncated] = useState(false);

    const selectedItem = useMemo(() => {
        if (!selectedRepo) {
            return null;
        }

        if (selectedFeed === 'commits' && selectedCommit) {
            return {
                changeType: 'commit' as const,
                title: selectedCommit.message,
                author: selectedCommit.owner_login,
                avatar: selectedCommit.owner_avatar_url,
                timestampLabel: formatDateTime(selectedCommit.date, true),
                owner: selectedRepo.owner_login,
                repo: selectedRepo.name,
                sha: selectedCommit.sha,
                htmlUrl: selectedCommit.html_url,
                description: selectedCommit.message,
            };
        }

        if (selectedFeed === 'pullRequests' && selectedPullRequest) {
            return {
                changeType: 'pull_request' as const,
                title: selectedPullRequest.title,
                author: selectedPullRequest.author_login,
                avatar: selectedPullRequest.author_avatar_url,
                timestampLabel: formatDateTime(selectedPullRequest.created_at, true),
                owner: selectedRepo.owner_login,
                repo: selectedRepo.name,
                number: selectedPullRequest.number,
                htmlUrl: selectedPullRequest.html_url,
                description: selectedPullRequest.body,
            };
        }

        return null;
    }, [selectedFeed, selectedCommit, selectedPullRequest, selectedRepo]);

    useEffect(() => {
        setSummary('');
        setError(null);
        setIsTruncated(false);
    }, [selectedFeed, selectedCommit?.sha, selectedPullRequest?.id, selectedRepo?.id]);

    const handleGenerateSummary = async () => {
        if (!selectedItem) {
            setError('커밋이나 Pull Request를 먼저 선택해주세요.');
            return;
        }

        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            setError('로그인 후 다시 시도해주세요.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await summaryApi.generateSummary(accessToken, {
                change_type: selectedItem.changeType,
                owner: selectedItem.owner,
                repo: selectedItem.repo,
                sha: selectedItem.sha,
                number: selectedItem.number,
                title: selectedItem.title,
                description: selectedItem.description,
                author: selectedItem.author,
                html_url: selectedItem.htmlUrl,
            });

            setSummary(response.summary);
            setIsTruncated(response.truncated);
        } catch (err) {
            const message = err instanceof Error ? err.message : '요약 생성 중 오류가 발생했습니다.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!selectedItem) {
        return (
            <Box
                sx={{
                    borderRadius: 3,
                    border: '1px dashed rgba(0,0,0,0.2)',
                    backgroundColor: '#fafafa',
                    p: 4,
                    minWidth: { xs: '100%', md: 360 },
                }}
            >
                <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500 }}>
                    커밋이나 Pull Request를 선택하면 AI 요약을 생성할 수 있어요.
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                borderRadius: 3,
                border: '1px solid rgba(0,0,0,0.1)',
                backgroundColor: '#ffffff',
                p: 4,
                minWidth: { xs: '100%', md: 360 },
                maxWidth: '100%',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}
        >
            <Typography variant="h6" sx={{ mt: 1, mb: 2, fontWeight: 700, wordBreak: 'break-word' }}>
                {selectedItem.title}
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Avatar src={selectedItem.avatar} alt={selectedItem.author} sx={{ width: 56, height: 56 }} />
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {selectedItem.author}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {selectedItem.timestampLabel}
                    </Typography>
                </Box>
            </Stack>

            {error && (
                <Alert severity="error" sx={{ mb: 1 }}>
                    {error}
                </Alert>
            )}

            {summary && (
                <Box
                    sx={{
                        borderRadius: 2,
                        backgroundColor: 'grey.50',
                        border: '1px solid rgba(0,0,0,0.06)',
                        p: 2,
                    }}
                >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        AI Summary
                    </Typography>
                    <Typography variant="body2" color="text.primary" sx={{ whiteSpace: 'pre-line' }}>
                        {summary}
                    </Typography>
                    {isTruncated && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                            전체 변경 사항이 길어 일부만 요약했어요. 자세한 내용은 GitHub에서 확인해주세요.
                        </Typography>
                    )}
                </Box>
            )}

            <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.2,
                    gap: 1,
                }}
                onClick={handleGenerateSummary}
                disabled={isLoading}
            >
                {isLoading ? 'Generating...' : 'Generate Summary'}
                {isLoading && <CircularProgress size={18} color="inherit" />}
            </Button>
        </Box>
    );
};

export default SelectedFeedCard;
