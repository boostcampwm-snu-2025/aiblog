import { useState } from 'react';
import * as githubApi from '../apis/githubApi';

export const useGitHubActivity = () => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [repoInfo, setRepoInfo] = useState(null);

  const fetchActivity = async ({ owner, repo }) => {
    setIsLoading(true);
    setError('');
    setActivities([]);

    try {
      const data = await githubApi.fetchGitHubActivity(owner, repo);
      setActivities(data);
      setRepoInfo({ owner, repo });
    } catch (err) {
      console.error('Error fetching GitHub activity:', err);
      setError(
        err.response?.data?.message ||
        '데이터를 가져오는 중 오류가 발생했습니다. 레포지토리 이름을 확인해주세요.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    activities,
    isLoading,
    error,
    repoInfo,
    fetchGitHubActivity: fetchActivity,
  };
};