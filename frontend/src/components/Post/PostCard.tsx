import { Card, CardContent, CardActions, Typography, Box, Button, IconButton } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { formatDateTime } from '../../utils/date';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import type { Post, UpdatePostData } from '../../api/posts';
import React from 'react';
import { useUpdatePost } from '../../hooks/usePosts';
import { useDeletePost } from '../../hooks/usePosts';

interface PostCardProps {
    post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {

    const [editingPostId, setEditingPostId] = React.useState<number | null>(null);
    const updatePostMutation = useUpdatePost();
    const deletePostMutation = useDeletePost();

    const handleEditClick = (post: Post) => {
        setEditingPostId(post.id);
    };

    const handleCancelEdit = () => {
        setEditingPostId(null);
    };

    const handleSaveEdit = (id: number) => {
        const data: UpdatePostData = {
            title: post.title,
            content: post.content
        };
        updatePostMutation.mutate({ id, data });
    };

    const handleDeleteClick = (id: number) => {
        deletePostMutation.mutate(id);
    };

    return (
        <Card>
            <CardContent>
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
    );
};

export default PostCard;