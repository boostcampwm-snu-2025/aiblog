import { useState } from 'react';
import {
  Container,
  Typography,
} from '@mui/material';
import { useAppContext } from '@/contexts/AppContext';
import { NoDataState } from '@/components/LeftPanel/NoDataState';
import { SavedPostList } from '@/components/SavedPostList';
import { SavedPostDetailDialog } from '@/components/SavedPostDetailDialog';

export function SavedPostsPage() {
  const { savedPosts, deletePost } = useAppContext();
  
  const [selectedPost, setSelectedPost] = useState(null);

  const handleOpenPost = (post) => {
    setSelectedPost(post);
  };

  const handleClosePost = () => {
    setSelectedPost(null);
  };

  const handleDelete = (e, postId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(postId);
      if (selectedPost?.id === postId) {
        handleClosePost();
      }
    }
  };


  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 700 }}>
        Saved Posts
      </Typography>

      {savedPosts.length === 0 ? (
        <NoDataState message="No saved posts yet. Generate and save some blog posts!" />
      ) : (
        <SavedPostList
          posts={savedPosts} 
          onOpenPost={handleOpenPost} 
          onDeletePost={handleDelete} 
        />
      )}

      <SavedPostDetailDialog
        post={selectedPost} 
        onClose={handleClosePost} 
        onDelete={handleDelete} 
      />
    </Container>
  );
}