import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Repository } from '../types/Repository';
import './RepositoryList.css';

export default function RepositoryList() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="repository-list">
      <h1>My Public Repositories</h1>
      <div className="repositories">
        {repositories.map(repo => (
          <div key={repo.id} className="repository-card">
            <h2>
              <a href={repo.url} target="_blank" rel="noopener noreferrer">
                {repo.name}
              </a>
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