import { useState } from 'react';
import RepoInputForm from './components/RepoInputForm';
import CommitList from './components/CommitList';
import CommitDetail from './components/CommitDetail';
import { useGitHubActivity } from './hooks/useGitHubActivity';
import './App.css';

function App() {
  const { activities, isLoading, error, fetchGitHubActivity } = useGitHubActivity();
  const [selectedCommit, setSelectedCommit] = useState(null);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Smart Blog</h1>
        <nav className="app-nav">
          <button className="nav-link">Saved Posts</button>
          <button className="nav-link">Settings</button>
        </nav>
      </header>

      <main className="app-main">
        <div className="search-section">
          <RepoInputForm onSubmit={fetchGitHubActivity} isLoading={isLoading} />
        </div>

        {error && (
          <div className="error-box">
            <p>{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="loading-box">
            <div className="spinner"></div>
            <p>GitHub 활동 데이터를 가져오는 중...</p>
          </div>
        )}

        {!isLoading && activities.length > 0 && (
          <div className="content-grid">
            <CommitList
              activities={activities}
              onSelectCommit={setSelectedCommit}
              selectedCommit={selectedCommit}
            />
            <CommitDetail commit={selectedCommit} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

