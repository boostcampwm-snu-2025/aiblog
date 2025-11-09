import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useRepoContext } from '../../contexts/Repocontext';
import CommitItem from './CommitItem';
import { paginate } from '../../utils/page';

const CommitList = () => {
    const { commits, loading, error } = useRepoContext();
    const [page, setPage] = useState(0);

    const PAGE_SIZE = 5;
    useEffect(() => {
        setPage(0);
    }, [commits]);

    const pagination = useMemo(() => paginate(commits, page, PAGE_SIZE), [commits, page]);
    const { items: pagedCommits, currentPage, totalPages, rangeStart, rangeEnd, totalItems } = pagination;

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress size={24} />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography variant="body2" color="error" sx={{ px: 1 }}>
                {error}
            </Typography>
        );
    }

    if (totalItems === 0) {
        return (
            <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
                조회할 커밋이 없습니다.
            </Typography>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" sx={{ px: 1 }}>커밋 목록</Typography>
            {pagedCommits.map(commit => (
                <CommitItem key={commit.sha} commit={commit} />
            ))}
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, pt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                    {`${rangeStart}-${rangeEnd} / ${totalItems}`}
                </Typography>
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                        disabled={currentPage === 0}
                        sx={{
                            textTransform: 'none',
                            borderColor: 'grey.400',
                            color: currentPage === 0 ? 'rgba(0,0,0,0.38)' : 'grey.600',
                            '&:hover': {
                                borderColor: 'grey.600',
                            },
                        }}
                    >
                        이전
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))}
                        disabled={currentPage >= totalPages - 1}
                        sx={{
                            textTransform: 'none',
                            borderColor: 'grey.400',
                            color: currentPage >= totalPages - 1 ? 'rgba(0,0,0,0.38)' : 'grey.600',
                            '&:hover': {
                                borderColor: 'grey.600',
                                backgroundColor: 'rgba(244, 143, 177, 0.12)',
                            },
                        }}
                    >
                        다음
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
};

export default CommitList;