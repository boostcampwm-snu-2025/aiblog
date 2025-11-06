import { useEffect, useState } from 'react';
import RepoInput from './components/RepoInput';
import ActivityList from './components/ActivityList';
import { getAuthState, loginWithGitHub } from './lib/api';

export default function App() {
  const [auth, setAuth] = useState(false);
  const [owner, setOwner] = useState('facebook');
  const [repo, setRepo] = useState('react');

  useEffect(() => {
    getAuthState()
      .then(res => setAuth(res.authenticated))
      .catch(err => {
        console.error('Auth check failed:', err);
        setAuth(false);
      });
  }, []);

  return (
    <div style={{ maxWidth:900, margin:'40px auto', padding:16 }}>
      <h1>SmartBlog — GitHub 연동 (Week 1)</h1>

      <div style={{ marginBottom:16, display:'flex', gap:12, alignItems:'center' }}>
        <RepoInput onSubmit={(o, r) => { setOwner(o); setRepo(r); }} />
        <span>현재: <b>{owner}/{repo}</b></span>
        <span style={{ marginLeft:'auto' }}>
          {auth ? <span>🔓 GitHub 로그인됨</span> : <button onClick={loginWithGitHub}>GitHub 로그인</button>}
        </span>
      </div>

      <ActivityList owner={owner} repo={repo} />
    </div>
  );
}
