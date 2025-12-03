import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { usePosts } from '../../hooks/usePosts';
import Loading from '../Loading';
import Error from '../Error';
import PostCard from './PostCard';

const PostsPage: React.FC = () => {
    const { data: posts, isLoading, error } = usePosts();

    if (isLoading) {
        return (
            <Loading />
        );
    }

    if (error) {
        return (
            <Error error_msg={error.message} />
        );
    }

    return (
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
                Blog Posts
            </Typography>

            <Stack spacing={3}>
                {posts?.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}

                {posts?.length === 0 && (
                    <Typography variant="body1" color="text.secondary" align="center">
                        No posts yet. Generate a summary to create one!
                    </Typography>
                )}
            </Stack>
        </Box>
    );
};

export default PostsPage;
