import { useState } from 'react';
import Header from './components/layout/Header';
import RepositoryInput from './components/repository/RepositoryInput';
import ActivityTabs from './components/activity/ActivityTabs';
import { useUIStore } from './store/uiStore';

function App() {
  const [repository, setRepository] = useState(null);

  const handleRepositorySubmit = (owner, repo) => {
    setRepository({ owner, repo });
  };

  return (
    <div className="min-h-screen bg-gh-canvas-default">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Repository Input Section */}
        <div className="mb-8">
          <RepositoryInput onSubmit={handleRepositorySubmit} />
        </div>

        {/* Activity Display Section */}
        {repository && (
          <ActivityTabs 
            owner={repository.owner} 
            repo={repository.repo} 
          />
        )}
      </main>
    </div>
  );
}

export default App;
