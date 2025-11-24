import { useBlogList } from '../../hooks/useBlog';
import { useBlogContext } from '../../contexts/BlogContext';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import EmptyState from '../common/EmptyState';

/**
 * BlogList Component
 * Displays list of saved blog posts from localStorage
 */
const BlogList = () => {
  const { posts, isLoading, error } = useBlogList();
  const { actions } = useBlogContext();

  const handlePostClick = (post) => {
    actions.setCurrentPost(post);
  };

  const handleDeletePost = (e, postId) => {
    e.stopPropagation();
    if (window.confirm('이 글을 삭제하시겠습니까?')) {
      actions.deletePost(postId);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const extractTitle = (content) => {
    // Extract first heading from markdown
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1] : '제목 없음';
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        title="저장된 블로그 글이 없습니다"
        message="GitHub 커밋이나 PR로부터 블로그를 생성해보세요."
      />
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">저장된 블로그 글</h2>
      
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => handlePostClick(post)}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold text-gray-900 flex-1">
                {extractTitle(post.content)}
              </h3>
              <button
                onClick={(e) => handleDeletePost(e, post.id)}
                className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                title="삭제"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {formatDate(post.createdAt)}
              </span>
              
              {post.metadata && (
                <>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                    {post.metadata.type === 'commit' ? 'Commit' : 'Pull Request'}
                  </span>
                  <span className="text-gray-500">
                    {post.metadata.owner}/{post.metadata.repo}
                  </span>
                </>
              )}
            </div>
            
            <p className="mt-3 text-gray-700 line-clamp-2">
              {post.content.substring(0, 200)}...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
