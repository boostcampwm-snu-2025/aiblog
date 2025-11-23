import { useState } from 'react';
import RepoInputForm from '../components/RepoInputForm';
import ActivityList from '../components/ActivityList';
import ActivityDetail from '../components/ActivityDetail';
import { useGitHubActivity } from '../hooks/useGitHubActivity';
import { useBlogStorage } from '../hooks/useBlogStorage';
import { blogApi } from '../apis/api';
import './Home.css';

function Home() {
  // 커스텀 훅 호출 → GitHub 활동, 로딩 상태, 에러 등 가져오기
  // fetchGitHubActivity는 repo(owner/repo) 입력 시 API 호출 함수
  const { activities, isLoading, error, repoInfo, fetchGitHubActivity } = useGitHubActivity();

  // 블로그 저장/관리 훅
  const { saveBlog } = useBlogStorage();

  // 사용자가 리스트에서 선택한 커밋/PR 데이터
  const [selectedActivity, setSelectedActivity] = useState(null);

  // AI가 생성한 블로그 글 내용
  const [generatedBlog, setGeneratedBlog] = useState(null);

  // 블로그 생성 중 로딩 여부
  const [isGenerating, setIsGenerating] = useState(false);

  // 리스트에서 커밋/PR 하나를 선택했을 때 실행되는 함수
  const handleSelectActivity = (activity) => {
    setSelectedActivity(activity);   // 선택된 활동 저장
    setGeneratedBlog(null);          // 다른 활동을 선택하면 기존 블로그 글은 초기화
  };

  // "AI 블로그 생성" 버튼 클릭 시 실행되는 함수
  // 서버에 activity 내용을 보내고 블로그 글 생성
  const handleGenerateBlog = async (activity) => {
    setIsGenerating(true); // 로딩 시작

    try {
      // 백엔드 API 호출 → activity 정보를 기반으로 블로그 글 생성
      const blog = await blogApi.generate(activity);
      setGeneratedBlog(blog); // 생성된 블로그 글 저장

      // localStorage에 자동 저장
      const savedBlogData = {
        title: blog.title,
        content: blog.content,
        createdAt: blog.createdAt,
        activityType: activity.type,
        repoInfo: repoInfo, // 어떤 레포지토리에서 생성했는지 저장
      };

      saveBlog(savedBlogData);

      // 저장 성공 알림 (콘솔)
      console.log('✅ 블로그가 localStorage에 저장되었습니다!');

    } catch (err) {
      console.error('Error generating blog:', err);
      // 서버에서 보낸 메시지가 있으면 표시, 아니면 기본 메시지 표시
      alert('블로그 생성 실패: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsGenerating(false); // 로딩 종료
    }
  };

  // 블로그 글 화면에서 "닫기" 버튼 눌렀을 때
  const handleCloseBlog = () => {
    setGeneratedBlog(null); // 블로그 화면 닫고 상세 화면으로 복귀
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
          <ActivityList
            activities={activities}          // 활동 목록
            repoInfo={repoInfo}              // 저장소 정보
            onSelectActivity={handleSelectActivity} // 항목 클릭 시 실행할 함수
            selectedActivity={selectedActivity}      // 현재 선택된 항목
          />

          {/* 오른쪽: 활동 상세 정보 or AI 블로그 */}
          <ActivityDetail
            activity={selectedActivity}       // 선택된 활동 정보
            onGenerateBlog={handleGenerateBlog} // 블로그 생성 함수
            isGenerating={isGenerating}         // 블로그 생성 중?
            generatedBlog={generatedBlog}       // 생성된 블로그 내용
            onCloseBlog={handleCloseBlog}       // 블로그 창 닫기
          />
        </div>
      )}

    </>
  );
}

export default Home;
