import { useState } from 'react';
import RepoInputForm from '../components/RepoInputForm';
import ActivityList from '../components/ActivityList';
import ActivityDetail from '../components/ActivityDetail';
import { useGitHubActivity } from '../hooks/useGitHubActivity';
import { blogApi } from '../apis/api';
import './Home.css';

function Home() {
  const { activities, isLoading, error, repoInfo, fetchGitHubActivity } = useGitHubActivity();
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [generatedBlog, setGeneratedBlog] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSelectActivity = (activity) => {
    setSelectedActivity(activity);
    setGeneratedBlog(null); // 새로운 활동 선택 시 블로그 초기화
  };

  const handleGenerateBlog = async (activity) => {
    setIsGenerating(true);

    try {
      const blog = await blogApi.generate(activity);
      setGeneratedBlog(blog);
    } catch (err) {
      console.error('Error generating blog:', err);
      alert('블로그 생성 실패: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCloseBlog = () => {
    setGeneratedBlog(null);
  };

  return (
    <>
      <div className="search-section">
        <RepoInputForm onSubmit={fetchGitHubActivity} isLoading={isLoading} />
      </div>

      {error && (
        <div className="error-box">
          <p>{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="loading-box">
          <div className="spinner"></div>
          <p>GitHub 활동 데이터를 가져오는 중...</p>
        </div>
      )}

      {!isLoading && activities.length > 0 && (
        <div className="content-grid">
          <ActivityList
            activities={activities}
            repoInfo={repoInfo}
            onSelectActivity={handleSelectActivity}
            selectedActivity={selectedActivity}
          />
          <ActivityDetail
            activity={selectedActivity}
            onGenerateBlog={handleGenerateBlog}
            isGenerating={isGenerating}
            generatedBlog={generatedBlog}
            onCloseBlog={handleCloseBlog}
          />
        </div>
      )}
    </>
  );
}

export default Home;
