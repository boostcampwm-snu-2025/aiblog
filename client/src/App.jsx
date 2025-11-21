import React, { useState } from 'react';
// 1. 유틸리티 및 컴포넌트 임포트
import { parseRepoInput } from './utils/repoParser';
import { RepoForm } from './components/RepoForm';
import { CommitList } from './components/CommitList';
import { PullList } from './components/PullList';
import { BlogModal } from './components/BlogModal';

const PROXY_SERVER_URL = 'http://localhost:3001';

export default function App() {
  // --- 상태 관리 ---
  // 1. GitHub 데이터 로딩 상태
  const [repoInput, setRepoInput] = useState('facebook/react');
  const [commits, setCommits] = useState([]);
  const [pulls, setPulls] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // 저장소 로딩
  const [error, setError] = useState(null);

  // 2. LLM 블로그 생성 상태
  const [isGenerating, setIsGenerating] = useState(false); // 블로그 생성 로딩
  const [generatingId, setGeneratingId] = useState(null); // 어떤 항목을 생성 중인지 ID
  const [generatedContent, setGeneratedContent] = useState(null); // 생성된 블로그 내용

  // --- 핸들러 함수 ---

  /** 1. GitHub 저장소 불러오기 핸들러 */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const repoPath = parseRepoInput(repoInput);

    if (!repoPath) {
      setError('유효하지 않은 저장소 주소입니다. "owner/repo" 또는 GitHub URL 형식으로 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setCommits([]);
    setPulls([]);

    try {
      const [owner, repo] = repoPath.split('/');
      const [commitRes, pullRes] = await Promise.all([
        fetch(`${PROXY_SERVER_URL}/api/github/${owner}/${repo}/commits`),
        fetch(`${PROXY_SERVER_URL}/api/github/${owner}/${repo}/pulls`),
      ]);

      if (!commitRes.ok || !pullRes.ok) {
        throw new Error('데이터를 불러오는 데 실패했습니다.');
      }
      const commitsData = await commitRes.json();
      const pullsData = await pullRes.json();
      setCommits(commitsData);
      setPulls(pullsData);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /** 2. 블로그 생성 핸들러 */
  const handleGenerateBlog = async (item) => {
    // item: { id, type, content, author }
    setIsGenerating(true);
    setGeneratingId(item.id);
    setGeneratedContent(null); // 모달은 열리되, 이전 내용 제거
    setError(null);

    try {
      const response = await fetch(`${PROXY_SERVER_URL}/api/llm/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemType: item.type,
          content: item.content,
          author: item.author,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || '블로그 생성에 실패했습니다.');
      }

      const data = await response.json();
      setGeneratedContent(data.blogContent);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
      setGeneratingId(null);
    }
  };

  /** 3. 모달 닫기 핸들러 */
  const handleCloseModal = () => {
    setGeneratedContent(null);
    // isGenerating이 true일 때는 닫히지 않게 할 수도 있지만,
    // 지금은 로딩 중에도 닫을 수 있게 단순하게 구현
    if (isGenerating) {
      setIsGenerating(false);
      setGeneratingId(null);
    }
  };

  // --- 렌더링 ---
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* 1. 입력 폼 컴포넌트 */}
        <RepoForm
          repoInput={repoInput}
          setRepoInput={setRepoInput}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />

        {/* 2. 저장소 로딩 및 에러 처리 */}
        {isLoading && (
          <div className="flex justify-center items-center p-12">
            <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin"></div>
            <span className="ml-3 text-lg">데이터를 불러오는 중입니다...</span>
          </div>
        )}
        
        {error && (
          <div className="my-4 bg-red-900 border border-red-700 text-red-100 p-4 rounded-md">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* 3. 결과 목록 */}
        {!isLoading && !error && (commits.length > 0 || pulls.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <CommitList
              commits={commits}
              onGenerate={handleGenerateBlog}
              isGenerating={isGenerating}
              generatingId={generatingId}
            />
            <PullList
              pulls={pulls}
              onGenerate={handleGenerateBlog}
              isGenerating={isGenerating}
              generatingId={generatingId}
            />
          </div>
        )}
      </div>

      {/* 4. 블로그 생성 모달 (조건부 렌더링) */}
      <BlogModal
        content={generatedContent}
        isLoading={isGenerating}
        onClose={handleCloseModal}
      />
    </div>
  );
}