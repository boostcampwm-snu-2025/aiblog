import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Repository } from '../types/Repository';
import './RepositoryList.css';
import RepoDetails from './RepoDetails';

export default function RepositoryList() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await axios.get<Repository[]>('http://localhost:3000/api/repos');
        setRepositories(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch repositories');
        setLoading(false);
      }
    };

    fetchRepositories();
  }, []);

  if (loading) return <div>Loading repositories...</div>;
  if (error) return <div className="error">{error}</div>;

  const handleCreateBlog = async (source: 'commit' | 'pr', item: any) => {
    if (!selectedRepo) return;
    try {
      const payload = { source, item, repo: selectedRepo };
      const resp = await axios.post('http://localhost:3000/api/create-blog', payload);
      console.log('Create blog result:', resp.data);
      // For now, just log result to console (frontend requirement)
    } catch (err) {
      console.error('Failed to create blog', err);
    }
  };

  if (selectedRepo) {
    return <RepoDetails repo={selectedRepo} onBack={() => setSelectedRepo(null)} onCreateBlog={handleCreateBlog} />;
  }

  return (
    <div className="repository-list">
      <h1>My Public Repositories</h1>
      <div className="repositories">
        {repositories.map(repo => (
          <div key={repo.id} className="repository-card">
            <h2>
              <button className="repo-link" onClick={() => setSelectedRepo(repo)}>
                {repo.name}
              </button>
            </h2>
            {repo.description && <p className="description">{repo.description}</p>}
            <div className="repository-info">
              {repo.language && <span className="language">🔤 {repo.language}</span>}
              <span className="stars">⭐ {repo.stars}</span>
              <span className="forks">🔱 {repo.forks}</span>
              <span className="updated">
                📅 {new Date(repo.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}