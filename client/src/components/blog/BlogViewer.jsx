import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BlogViewer = ({ blog, onClose }) => {
  if (!blog) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gh-canvas-subtle border border-gh-border-default rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gh-border-default">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gh-fg-default mb-2">
              {blog.title}
            </h2>
            <div className="flex items-center space-x-4 text-sm text-gh-fg-muted">
              <span>{blog.repoName}</span>
              <span>•</span>
              <span>{blog.type === 'commit' ? '커밋' : 'Pull Request'}</span>
              <span>•</span>
              <span>{new Date(blog.createdAt).toLocaleString('ko-KR')}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 hover:bg-gh-btn-hover-bg rounded-md transition-colors"
          >
            <svg className="w-6 h-6 text-gh-fg-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <article className="prose prose-invert prose-sm sm:prose-base max-w-none markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {blog.content}
            </ReactMarkdown>
          </article>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gh-border-default bg-gh-canvas-default">
          <div className="flex items-center justify-between">
            <a
              href={blog.sourceData?.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-gh-accent-fg hover:underline"
            >
              <span>GitHub에서 보기</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gh-btn-bg hover:bg-gh-btn-hover-bg text-gh-fg-default border border-gh-border-default rounded-md transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogViewer;
