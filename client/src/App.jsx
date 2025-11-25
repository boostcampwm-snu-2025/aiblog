import React, { useState } from 'react';

// 1. 전역 상태 Provider (데이터 공급)
import { BlogProvider } from './contexts/BlogContext';

// 2. 커스텀 훅 (비즈니스 로직)
import { useGitHub } from './hooks/useGithub';
import { useLLM } from './hooks/useLLM';
import { parseRepoInput } from './utils/repoParser';

// 3. UI 컴포넌트 (화면 조각들)
// 주의: export default로 내보낸 컴포넌트는 중괄호 없이, export function은 중괄호 {}를 써야 합니다.
import { RepoForm } from './components/RepoForm'; 
import { RepoItemList } from './components/RepoItemList';
import { SavedBlogList } from './components/SaveBlogList';
import { BlogModal } from './components/BlogModal';

function AppContent() {
  // --- 상태 관리 ---
  const [repoInput, setRepoInput] = useState('facebook/react');
  const [modalContent, setModalContent] = useState(null);
  const [generatingItemId, setGeneratingItemId] = useState(null);
  const [activeTab, setActiveTab] = useState('saved'); // 'saved' | 'search'

  // --- 커스텀 훅 사용 ---
  // API 호출 로직이 Hook 안으로 숨겨져 App.jsx가 깔끔해집니다.
  const { status: repoStatus, data: repoData, error: repoError, fetchRepoData } = useGitHub();
  const { status: llmStatus, generateBlog } = useLLM();

  // --- 핸들러 ---
  const handleSearch = (e) => {
    e.preventDefault();
    const repoPath = parseRepoInput(repoInput);
    if (!repoPath) {
      alert('유효하지 않은 저장소 주소입니다.');
      return;
    }
    fetchRepoData(repoPath.split('/')[0], repoPath.split('/')[1]);
    setActiveTab('search'); // 검색 시 자동으로 검색 탭으로 이동
  };

  // 목록의 버튼(생성/확인) 클릭 시 처리
  const handleItemAction = async ({ type, item, post }) => {
    if (type === 'view') {
      // 이미 저장된 글 보기
      setModalContent(post.content);
    } else if (type === 'generate') {
      // 새 글 생성 요청
      setGeneratingItemId(item.id);
      const content = await generateBlog(item); // 생성 후 자동 저장됨 (Hook 내부에서 처리)
      if (content) {
        setModalContent(content);
      }
      setGeneratingItemId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* 상단 검색 폼 */}
        <RepoForm 
            repoInput={repoInput} 
            setRepoInput={setRepoInput} 
            handleSubmit={handleSearch} 
            isLoading={repoStatus === 'loading'} 
        />

        {/* 탭 메뉴 */}
        <div className="flex border-b border-gray-700 mb-6">
            <button 
                className={`flex-1 md:flex-none px-6 py-3 font-semibold transition-colors ${activeTab === 'search' ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-800/50' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'}`} 
                onClick={() => setActiveTab('search')}
            >
                🔍 GitHub 검색
            </button>
            <button 
                className={`flex-1 md:flex-none px-6 py-3 font-semibold transition-colors ${activeTab === 'saved' ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-800/50' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'}`} 
                onClick={() => setActiveTab('saved')}
            >
                📂 저장된 블로그
            </button>
        </div>

        {/* 메인 컨텐츠 영역 */}
        <main className="min-h-[400px]">
            {/* 탭 1: 저장된 목록 */}
            {activeTab === 'saved' && (
                <SavedBlogList onView={(post) => setModalContent(post.content)} />
            )}

            {/* 탭 2: 검색 결과 */}
            {activeTab === 'search' && (
                <>
                    {repoStatus === 'loading' && (
                        <div className="flex flex-col justify-center items-center p-20">
                            <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin mb-4"></div>
                            <span className="text-xl text-gray-400">GitHub 데이터를 불러오는 중...</span>
                        </div>
                    )}
                    {repoStatus === 'error' && (
                        <div className="bg-red-900/50 border border-red-700 text-red-100 p-6 rounded-lg text-center">
                            <h3 className="text-lg font-bold mb-2">오류 발생</h3>
                            <p>{repoError}</p>
                        </div>
                    )}
                    {repoStatus === 'success' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* RepoItemList 하나로 Commit/PR 모두 처리 */}
                            <RepoItemList 
                                title="Recent Commits" 
                                items={repoData.commits} 
                                type="commit" 
                                onAction={handleItemAction}
                                isGenerating={llmStatus === 'generating'}
                                generatingId={generatingItemId}
                            />
                            <RepoItemList 
                                title="Recent Pull Requests" 
                                items={repoData.pulls} 
                                type="pr" 
                                onAction={handleItemAction}
                                isGenerating={llmStatus === 'generating'}
                                generatingId={generatingItemId}
                            />
                        </div>
                    )}
                    {repoStatus === 'idle' && (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                            <div className="text-6xl mb-4">👆</div>
                            <p className="text-xl">원하는 저장소를 입력하고 검색하세요.</p>
                        </div>
                    )}
                </>
            )}
        </main>

        {/* 결과 모달 */}
        <BlogModal 
            content={modalContent} 
            isLoading={llmStatus === 'generating' && !modalContent} 
            onClose={() => setModalContent(null)} 
        />
      </div>
    </div>
  );
}

// 최상위에서 Provider로 감싸기
export default function App() {
  return (
    <BlogProvider>
      <AppContent />
    </BlogProvider>
  );
}