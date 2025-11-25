import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getAllBlogPosts, deleteBlogPost } from '../apis/api';

function SavedPostsPage() {
  const queryClient = useQueryClient();
  const { data: blogs, isLoading, isError } = useQuery({
    queryKey: ['blogs'],
    queryFn: getAllBlogPosts,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="text-center p-8">Loading...</div>;
  if (isError) return <div className="text-center p-8 text-red-500">Error fetching posts.</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Saved Posts</h1>
      <div className="space-y-4">
        {blogs.length === 0 ? (
          <p>No saved posts yet.</p>
        ) : (
          blogs.map((blog) => (
            <div key={blog._id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <Link to={`/posts/${blog._id}`} className="text-xl font-semibold text-pink-500 hover:underline">
                    {blog.title}
                  </Link>
                  <p className="text-gray-600 mt-2 truncate">{blog.content}</p>
                  <p className="text-sm text-gray-400 mt-2">{new Date(blog.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-full disabled:bg-gray-400 transition-colors"
                  disabled={deleteMutation.isLoading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SavedPostsPage;
