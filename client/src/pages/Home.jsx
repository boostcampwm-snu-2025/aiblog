import RepoInputForm from '../components/RepoInputForm';
import ActivityList from '../components/ActivityList';
import ActivityDetail from '../components/ActivityDetail';
import { useAppContext } from '../contexts/AppContext';
import { useBlogStorage } from '../hooks/useBlogStorage';
import './Home.css';

function Home() {
  // ========== Context에서 전역 상태와 함수들 가져오기 ==========
  const {
    activities,
    isLoading,
    error,
    repoInfo,
    selectedActivity,
    generatedBlog,
    isGenerating,
    fetchGitHubActivity,
    selectActivity,
    generateBlog,
    closeBlog,
  } = useAppContext();

  // 블로그 저장/관리 훅
  const { saveBlog } = useBlogStorage();

  // ========== 블로그 저장 함수 ==========
  const handleSaveBlog = () => {
    if (!generatedBlog || !selectedActivity) return;

    const savedBlogData = {
      title: generatedBlog.title,
      content: generatedBlog.content,
      createdAt: generatedBlog.createdAt,
      activityType: selectedActivity.type,
      repoInfo: repoInfo,
    };

    saveBlog(savedBlogData);
    alert('블로그가 저장되었습니다!');
  };

  return (
    <>
      {/* 상단: 저장소 입력창 */}
      <div className="search-section">
        {/* 제출(onSubmit)하면 fetchGitHubActivity 실행 → GitHub API 호출 */}
        <RepoInputForm onSubmit={fetchGitHubActivity} isLoading={isLoading} />
      </div>

      {/* 에러가 있을 경우 에러 박스 렌더링 */}
      {error && (
        <div className="error-box">
          <p>{error}</p>
        </div>
      )}

      {/* GitHub 활동 데이터를 가져오는 중일 때 로딩 화면 */}
      {isLoading && (
        <div className="loading-box">
          <div className="spinner"></div>
          <p>GitHub 활동 데이터를 가져오는 중...</p>
        </div>
      )}

      {/* 로딩이 끝났고, activities 배열에 데이터가 1개 이상 있을 때만 리스트 & 상세 화면 표시 */}
      {!isLoading && activities.length > 0 && (
        <div className="content-grid">
          {/* 왼쪽: 활동 리스트(커밋/PR 목록) */}
          <ActivityList />

          {/* 오른쪽: 활동 상세 정보 or AI 블로그 */}
          <ActivityDetail onSaveBlog={handleSaveBlog} />
        </div>
      )}

    </>
  );
}

export default Home;
