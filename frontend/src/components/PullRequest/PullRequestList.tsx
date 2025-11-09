import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useMemo, useState } from "react";
import { useRepoContext } from "../../contexts/Repocontext";
import { paginate } from "../../utils/page";
import PullRequestItem from "./PullRequestItem";


const PullRequest = () => {
    const {pullRequests, loading, error } = useRepoContext();
    const [page, setPage] = useState(0);

    const PAGE_SIZE = 1;
    useEffect(() => {
        setPage(0);
    }, [pullRequests]);

    const pagination = useMemo(() => paginate(pullRequests, page, PAGE_SIZE), [pullRequests, page]);
    const { items: pagedPullRequests, currentPage, totalPages, rangeStart, rangeEnd, totalItems } = pagination;

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
                조회할 풀 리퀘스트가 없습니다.
            </Typography>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" sx={{ px: 1 }}>풀 리퀘스트 목록</Typography>
            {pagedPullRequests.map(pullRequest => (
                <PullRequestItem key={pullRequest.id} pullRequest={pullRequest} />
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
    )
}

export default PullRequest;