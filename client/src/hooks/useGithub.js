import { useState, useCallback } from 'react';

const PROXY_SERVER_URL = 'http://localhost:3001';

export function useGitHub() {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [data, setData] = useState({ commits: [], pulls: [] });
  const [error, setError] = useState(null);

  const fetchRepoData = useCallback(async (owner, repo) => {
    setStatus('loading');
    setError(null);
    setData({ commits: [], pulls: [] });

    try {
      const [commitRes, pullRes] = await Promise.all([
        fetch(`${PROXY_SERVER_URL}/api/github/${owner}/${repo}/commits`),
        fetch(`${PROXY_SERVER_URL}/api/github/${owner}/${repo}/pulls`),
      ]);

      if (!commitRes.ok || !pullRes.ok) {
        throw new Error('데이터를 불러오는 데 실패했습니다.');
      }

      const commits = await commitRes.json();
      const pulls = await pullRes.json();

      setData({ commits, pulls });
      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }, []);

  return { status, data, error, fetchRepoData };
}