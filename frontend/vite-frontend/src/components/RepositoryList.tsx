import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Repository } from '../types/Repository';
import './RepositoryList.css';
import RepoDetails from './RepoDetails';
import SavedBlogs from './SavedBlogs';

export default function RepositoryList() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [blogContent, setBlogContent] = useState<string | null>(null);
  const [lastMeta, setLastMeta] = useState<{ source: 'commit' | 'pr'; item: any } | null>(null);
  const [viewSaved, setViewSaved] = useState(false);
  const [blogLoading, setBlogLoading] = useState(false);
  const [blogError, setBlogError] = useState<string | null>(null);

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
      setBlogLoading(true);
      setBlogError(null);
      setBlogContent(null);
      const payload = { source, item, repo: selectedRepo };
      const resp = await axios.post('http://localhost:3000/api/create-blog', payload);
      // Prefer different possible response shapes from backend
      const generated = resp?.data?.result || resp?.data?.data || (typeof resp?.data === 'string' ? resp.data : null) || JSON.stringify(resp?.data);
      console.log('Create blog result:', resp.data);
      setBlogContent(generated);
      setLastMeta({ source, item });
      setBlogLoading(false);
      // For now, just log result to console (frontend requirement)
    } catch (err) {
      console.error('Failed to create blog', err);
      const e = err as any;
      const msg = e?.response?.data?.error || e?.message || 'LLM call failed';
      setBlogError(String(msg));
      setBlogLoading(false);
    }
  };

  if (selectedRepo) {
    return (
      <div className="details-container">
        <div className="details-left">
          <RepoDetails repo={selectedRepo} onBack={() => { setSelectedRepo(null); setBlogContent(null); }} onCreateBlog={handleCreateBlog} />
        </div>
        <div className="blog-preview">
          <div className="preview-header">
            <h3>Generated Blog</h3>
            <div>
              <button className="save-preview" disabled={blogLoading || !blogContent} onClick={async () => {
                if (!blogContent) return;
                try {
                  const title = `${selectedRepo?.name || 'blog'} - ${lastMeta?.source || ''} - ${lastMeta?.item?.sha || lastMeta?.item?.number || ''}`;
                  await axios.post('http://localhost:3000/api/blogs', { title, content: blogContent, source: lastMeta?.source, repo: selectedRepo, item: lastMeta?.item });
                  alert('Saved blog');
                } catch (e) {
                  console.error('Failed to save blog', e);
                  alert('Failed to save');
                }
              }}>Save</button>
              <button className="close-preview" onClick={() => { setBlogContent(null); setBlogError(null); }}>Close</button>
            </div>
          </div>
          <div className="preview-body">
            {blogLoading ? (
              <div className="loading">LLM 요청 실행중... 잠시만 기다려주세요.</div>
            ) : blogError ? (
              <div className="error">오류 발생: {blogError}</div>
            ) : blogContent ? (
              <pre style={{ whiteSpace: 'pre-wrap' }}>{blogContent}</pre>
            ) : (
              <div className="empty">생성된 블로그가 없습니다. Commit/PR 항목에서 "Create Blog"를 클릭하세요.</div>
            )}
          </div>
        </div>
      </div>
    );
  }
  if (viewSaved) {
    return <SavedBlogs onBack={() => setViewSaved(false)} />;
  }

  return (
    <div className="repository-list">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My Public Repositories</h1>
        <div>
          <button onClick={() => setViewSaved(true)}>Saved Blogs</button>
        </div>
      </div>
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