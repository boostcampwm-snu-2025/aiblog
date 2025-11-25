import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Repository } from '../types/Repository';
import './RepoDetails.css';

type Props = {
  repo: Repository;
  onBack: () => void;
  // optional callback when user clicks "Create Blog"
  onCreateBlog?: (source: 'commit' | 'pr', item: any) => void;
};

export default function RepoDetails({ repo, onBack, onCreateBlog }: Props) {
  const [commits, setCommits] = useState<any[]>([]);
  const [pulls, setPulls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!repo.owner) {
        setError('Repository owner not available');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [commitsRes, pullsRes] = await Promise.all([
          axios.get(`http://localhost:3000/github/repos/${repo.owner}/${repo.name}/commits`),
          axios.get(`http://localhost:3000/github/repos/${repo.owner}/${repo.name}/pulls`)
        ]);

        setCommits(commitsRes.data);
        setPulls(pullsRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load repository details');
        setLoading(false);
      }
    };

    fetchDetails();
  }, [repo]);

  if (loading) return <div>Loading details...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="repo-details">
      <button className="back-button" onClick={onBack}>← Back to list</button>
      <h2>{repo.name}</h2>
      {repo.description && <p className="description">{repo.description}</p>}

      <section className="commits">
        <h3>Recent Commits</h3>
        {commits.length === 0 && <p>No commits found.</p>}
        <ul>
          {commits.map(c => (
              <li key={c.sha}>
                <div className="commit-message">{c.message}</div>
                <div className="commit-meta">{c.author} — {c.date ? new Date(c.date).toLocaleString() : ''}</div>
                <button
                  className="create-blog-btn"
                  onClick={() => {
                    if (onCreateBlog) onCreateBlog('commit', c);
                    else console.log('Create Blog clicked for commit', c);
                  }}
                >
                  Create Blog
                </button>
              </li>
            ))}
        </ul>
      </section>

      <section className="pulls">
        <h3>Pull Requests</h3>
        {pulls.length === 0 && <p>No pull requests found.</p>}
        <ul>
          {pulls.map(p => (
              <li key={p.id}>
                <div className="pr-title">#{p.number} {p.title}</div>
                <div className="pr-meta">{p.user} — {p.state} {p.merged_at ? `(merged ${new Date(p.merged_at).toLocaleDateString()})` : ''}</div>
                <button
                  className="create-blog-btn"
                  onClick={() => {
                    if (onCreateBlog) onCreateBlog('pr', p);
                    else console.log('Create Blog clicked for PR', p);
                  }}
                >
                  Create Blog
                </button>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
