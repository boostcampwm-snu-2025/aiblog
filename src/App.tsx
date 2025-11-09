import { useState, useEffect } from 'react';
import RepoInput from './components/RepoInput';
import ActivityList from './components/ActivityList';
import RepositoryList from './components/RepositoryList';

export default function App() {
  const [owner, setOwner] = useState('dev-pyun');
  const [repo, setRepo] = useState('aiblog');
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // repo가 변경되면 dataLoaded를 false로 리셋
  useEffect(() => {
    setDataLoaded(false);
  }, [owner, repo]);

  const handleLoadingChange = (isLoading: boolean) => {
    setLoading(isLoading);
    if (!isLoading) {
      setDataLoaded(true);
    }
  };

  const showActivityList = repo && dataLoaded;

  return (
    <div style={{ maxWidth:900, padding:16}}>
      <h1>SmartBlog — GitHub 연동 (Week 1)</h1>

      <div style={{ marginBottom:16, display:'flex', gap:12, alignItems:'center' }}>
        <RepoInput
          owner={owner}
          repo={repo}
          onOwnerChange={setOwner}
          onRepoChange={setRepo}
          onSubmit={(o, r) => { setOwner(o); setRepo(r); }}
        />
        <span>현재: <b>{repo ? `${owner}/${repo}` : owner}</b></span>
        <span style={{ marginLeft:'auto' }}>
          {loading && <span>⏳ 로딩 중...</span>}
        </span>
      </div>

      {/* RepositoryList: repo가 없거나 ActivityList 로딩 중일 때 표시 */}
      <div style={{ display: !showActivityList ? 'block' : 'none' }}>
        <RepositoryList owner={owner} onSelectRepo={(selectedRepo) => setRepo(selectedRepo)} onLoadingChange={handleLoadingChange} />
      </div>

      {/* ActivityList: repo가 있고 데이터 로드 완료 시 표시 */}
      <div style={{ display: showActivityList ? 'block' : 'none' }}>
        {repo && <ActivityList owner={owner} repo={repo} onLoadingChange={handleLoadingChange} />}
      </div>
    </div>
  );
}
