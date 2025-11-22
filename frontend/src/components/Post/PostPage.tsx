import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ReactMarkdown from 'react-markdown';
import { usePosts, useUpdatePost, useDeletePost } from '../../hooks/usePosts';
import { formatDateTime } from '../../utils/date';
import Loading from '../Loading';
import Error from '../Error';

const PostsPage: React.FC = () => {
    const { data: posts, isLoading, error } = usePosts();
    const updatePostMutation = useUpdatePost();
    const deletePostMutation = useDeletePost();
    const [editingPostId, setEditingPostId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');

    const handleEditClick = (post: { id: number; title: string; content: string }) => {
        setEditingPostId(post.id);
        setEditTitle(post.title);
        setEditContent(post.content);
    };

    const handleCancelEdit = () => {
        setEditingPostId(null);
        setEditTitle('');
        setEditContent('');
    };

    const handleSaveEdit = (id: number) => {
        updatePostMutation.mutate(
            { id, data: { title: editTitle, content: editContent } },
            {
                onSuccess: () => {
                    setEditingPostId(null);
                },
            }
        );
    };

    const handleDeleteClick = (id: number) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            deletePostMutation.mutate(id);
        }
    };

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
                    <Card key={post.id} sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <CardContent>
                            {editingPostId === post.id ? (
                                <Stack spacing={2}>
                                    <TextField
                                        label="Title"
                                        fullWidth
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                    />
                                    <TextField
                                        label="Content (Markdown)"
                                        fullWidth
                                        multiline
                                        rows={6}
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                    />
                                </Stack>
                            ) : (
                                <>
                                    <Typography variant="h5" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                                        {post.title}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                                        {formatDateTime(post.created_at, true)}
                                    </Typography>
                                    <Box sx={{
                                        '& img': { maxWidth: '100%' },
                                        '& pre': { backgroundColor: '#f5f5f5', p: 1, borderRadius: 1, overflowX: 'auto' },
                                        '& code': { backgroundColor: '#f5f5f5', p: 0.5, borderRadius: 0.5 }
                                    }}>
                                        <ReactMarkdown>{post.content}</ReactMarkdown>
                                    </Box>
                                </>
                            )}
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                            {editingPostId === post.id ? (
                                <>
                                    <Button
                                        startIcon={<SaveIcon />}
                                        variant="contained"
                                        onClick={() => handleSaveEdit(post.id)}
                                        disabled={updatePostMutation.isPending}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        startIcon={<CancelIcon />}
                                        onClick={handleCancelEdit}
                                        disabled={updatePostMutation.isPending}
                                    >
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <IconButton onClick={() => handleEditClick(post)} aria-label="edit">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteClick(post.id)} aria-label="delete" color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            )}
                        </CardActions>
                    </Card>
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
