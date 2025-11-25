const STORAGE_KEY = 'aiblog_saved_posts';

export const getSavedPosts = () => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error('Failed to load posts from localStorage:', error);
    return [];
  }
};

export const savePosts = (posts) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (error) {
    console.error('Failed to save posts to localStorage:', error);
  }
};

export const addPostToStorage = (newPost) => {
  const posts = getSavedPosts();
  const updatedPosts = [newPost, ...posts]; // 최신 글이 위로 오게
  savePosts(updatedPosts);
  return updatedPosts;
};

export const removePostFromStorage = (postId) => {
  const posts = getSavedPosts();
  const updatedPosts = posts.filter((post) => post.id !== postId);
  savePosts(updatedPosts);
  return updatedPosts;
};