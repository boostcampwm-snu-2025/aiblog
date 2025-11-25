import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getBlogPostById, updateBlogPost } from '../apis/api';
import Markdown from 'react-markdown';
import { useState, useEffect } from 'react';

function PostDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const { data: blog, isLoading, isError } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => getBlogPostById(id),
  });

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setContent(blog.content);
    }
  }, [blog]);

  const updateMutation = useMutation({
    mutationFn: (updatedBlog) => updateBlogPost(id, updatedBlog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog', id] });
      setIsEditing(false);
    },
  });

  const handleSave = () => {
    updateMutation.mutate({ title, content });
  };

  if (isLoading) return <div className="text-center p-8">Loading...</div>;
  if (isError) return <div className="text-center p-8 text-red-500">Error fetching post.</div>;

  return (
    <div className="container mx-auto p-8">
      <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-pink-100">
        {isEditing ? (
          <>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-4xl font-bold text-gray-800 mb-4 w-full border-b-2"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="prose lg:prose-xl w-full h-96 border rounded-md p-2"
            />
            <div className="mt-4">
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full"
                disabled={updateMutation.isLoading}
              >
                {updateMutation.isLoading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="ml-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{blog.title}</h1>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
              >
                Edit
              </button>
            </div>
            <p className="text-sm text-gray-400 mb-8">Published on {new Date(blog.createdAt).toLocaleDateString()}</p>
            <div className="prose lg:prose-xl">
              <Markdown>{blog.content}</Markdown>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PostDetailPage;
