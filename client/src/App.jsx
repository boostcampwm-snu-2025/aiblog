import { useState } from 'react';
import { BlogProvider } from './contexts/BlogContext';
import Header from './components/layout/Header';
import RepositoryInput from './components/repository/RepositoryInput';
import ActivityTabs from './components/activity/ActivityTabs';
import BlogList from './components/blog/BlogList';
import BlogViewer from './components/blog/BlogViewer';
import { useCurrentBlog } from './hooks/useBlog';

function AppContent() {
  const [repository, setRepository] = useState(null);
  const [view, setView] = useState('activity'); // 'activity' | 'saved'
  const { currentPost } = useCurrentBlog();

  const handleRepositorySubmit = (owner, repo) => {
    setRepository({ owner, repo });
    setView('activity');
  };

  return (
    <div className="min-h-screen bg-gh-canvas-default">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* View Toggle */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setView('activity')}
            className={`px-4 py-2 rounded-md transition-colors ${
              view === 'activity'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            GitHub Activity
          </button>
          <button
            onClick={() => setView('saved')}
            className={`px-4 py-2 rounded-md transition-colors ${
              view === 'saved'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            저장된 블로그
          </button>
        </div>

        {/* Activity View */}
        {view === 'activity' && (
          <>
            <div className="mb-8">
              <RepositoryInput onSubmit={handleRepositorySubmit} />
            </div>

            {repository && (
              <ActivityTabs 
                owner={repository.owner} 
                repo={repository.repo} 
              />
            )}
          </>
        )}

        {/* Saved Blogs View */}
        {view === 'saved' && <BlogList />}
      </main>

      {/* Blog Viewer Modal */}
      {currentPost && <BlogViewer blog={currentPost} />}
    </div>
  );
}

function App() {
  return (
    <BlogProvider>
      <AppContent />
    </BlogProvider>
  );
}

export default App;
