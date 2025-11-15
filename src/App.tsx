import { useState, useEffect } from 'react';
import RepoInput from './components/RepoInput';
import ActivityList from './components/ActivityList';
import RepositoryList from './components/RepositoryList';
import TwoColumnLayout from './components/TwoColumnLayout';
import BlogPreviewPanel from './components/BlogPreviewPanel';
import type { BlogGenerationResponse } from './lib/api';

export default function App() {
  // 실제 검색에 사용되는 상태
  const [owner, setOwner] = useState('dev-pyun');
  const [repo, setRepo] = useState('aiblog');

  // 입력 필드의 임시 상태
  const [inputOwner, setInputOwner] = useState('dev-pyun');
  const [inputRepo, setInputRepo] = useState('aiblog');

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
    }
  };

  const handlePublish = () => {
    if (generatedBlog) {
      alert('블로그가 게시되었습니다!\n\n(Phase 3에서 실제 게시 기능을 구현할 예정입니다)');
      // TODO: Phase 3에서 실제 게시 API 호출
    }
  };

  const handleCancel = () => {
    if (confirm('생성된 블로그를 취소하시겠습니까?')) {
      setGeneratedBlog(null);
    }
  };

  const showActivityList = repo && dataLoaded;

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: 16 }}>
      <h1>SmartBlog — GitHub 연동 (Phase 2: 투 페인 UI)</h1>

      <div style={{ marginBottom:16, display:'flex', gap:12, alignItems:'center' }}>
        <RepoInput
          owner={inputOwner}
          repo={inputRepo}
          onOwnerChange={setInputOwner}
          onRepoChange={setInputRepo}
          onSubmit={(o, r) => {
            // 불러오기 버튼 클릭 시에만 실제 검색 실행
            setOwner(o);
            setRepo(r);
            setGeneratedBlog(null); // 새로 검색할 때 이전 블로그 초기화
          }}
        />
        <span>현재: <b>{repo ? `${owner}/${repo}` : owner}</b></span>
        <span style={{ marginLeft:'auto' }}>
          {loading && <span>⏳ 로딩 중...</span>}
        </span>
      </div>

      {/* RepositoryList: repo가 없거나 ActivityList 로딩 중일 때 표시 */}
      <div style={{ display: !showActivityList ? 'block' : 'none' }}>
        <RepositoryList
          owner={owner}
          onSelectRepo={(selectedRepo) => {
            setRepo(selectedRepo);
            setInputRepo(selectedRepo); // 입력 필드도 동기화
          }}
          onLoadingChange={handleLoadingChange}
        />
      </div>

      {/* TwoColumnLayout: repo가 있고 데이터 로드 완료 시 표시 */}
      {showActivityList && repo && (
        <TwoColumnLayout
          leftPanel={
            <ActivityList
              owner={owner}
              repo={repo}
              onLoadingChange={handleLoadingChange}
              onBlogGenerate={handleBlogGenerate}
            />
          }
          rightPanel={
            <BlogPreviewPanel
              blogData={generatedBlog}
              onPublish={handlePublish}
              onCancel={handleCancel}
            />
          }
        />
      )}
    </div>
  );
}
