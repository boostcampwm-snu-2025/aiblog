import { useState, useEffect } from 'react';
import RepoInput from './components/RepoInput';
import ActivityList from './components/ActivityList';
import RepositoryList from './components/RepositoryList';
import type { BlogGenerationResponse } from './lib/api';

export default function App() {
  const [owner, setOwner] = useState('dev-pyun');
  const [repo, setRepo] = useState('aiblog');
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState<BlogGenerationResponse['data'] | null>(null);

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

  const handleBlogGenerate = (blogData: BlogGenerationResponse['data']) => {
    if (blogData) {
      setGeneratedBlog(blogData);
      console.log('블로그 생성 완료:', blogData);
      alert(`블로그가 생성되었습니다!\n\n제목: ${blogData.title}\n요약: ${blogData.summary || '없음'}`);
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
        {repo && <ActivityList owner={owner} repo={repo} onLoadingChange={handleLoadingChange} onBlogGenerate={handleBlogGenerate} />}
      </div>

      {/* 생성된 블로그 미리보기 (임시) */}
      {generatedBlog && (
        <div style={{ marginTop: 24, padding: 16, border: '2px solid #0066cc', borderRadius: 8 }}>
          <h2>생성된 블로그</h2>
          <h3>{generatedBlog.title}</h3>
          {generatedBlog.summary && <p style={{ fontStyle: 'italic', color: '#666' }}>{generatedBlog.summary}</p>}
          <div style={{ whiteSpace: 'pre-wrap', marginTop: 12 }}>{generatedBlog.content}</div>
          <div style={{ marginTop: 16, fontSize: 12, color: '#888' }}>
            <div>커밋: {generatedBlog.metadata.commitSha.substring(0, 7)}</div>
            <div>작성자: {generatedBlog.metadata.author}</div>
            <div>변경 파일: {generatedBlog.metadata.filesChanged.join(', ')}</div>
          </div>
        </div>
      )}
    </div>
  );
}
