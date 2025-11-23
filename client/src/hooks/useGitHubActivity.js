import { useState, useEffect } from 'react';
import { githubApi } from '../apis/api';

const STORAGE_KEY = 'github_repo_cache';

// GitHub 활동 데이터를 가져오는 로직을 묶어 만든 '커스텀 훅'
export const useGitHubActivity = () => {

  // 활동 리스트 (커밋/PR 목록)
  const [activities, setActivities] = useState([]);

  // API 요청 중인지 여부를 저장
  const [isLoading, setIsLoading] = useState(false);

  // 에러 메시지 저장
  const [error, setError] = useState('');

  // 어떤 저장소(owner/repo) 데이터를 보고 있는지 저장
  const [repoInfo, setRepoInfo] = useState(null);

  // 컴포넌트 마운트 시 localStorage에서 저장된 레포 정보 불러오기
  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const { activities: cachedActivities, repoInfo: cachedRepoInfo } = JSON.parse(cached);
        setActivities(cachedActivities);
        setRepoInfo(cachedRepoInfo);
      } catch (err) {
        console.error('Failed to load cached repo data:', err);
      }
    }
  }, []);

  // 실제로 GitHub API를 호출하는 함수
  // 비동기 async 함수이며 { owner, repo } 객체를 받아온다
  const fetchActivity = async ({ owner, repo }) => {

    // 데이터를 새로 불러오므로 로딩 상태 true
    setIsLoading(true);

    // 이전 에러 메시지가 남아있을 수 있으므로 초기화
    setError('');

    // 이전 저장된 활동 데이터도 지워서 초기화
    setActivities([]);

    try {
      // GitHub API 호출 → 활동 데이터 목록 받아오기
      const data = await githubApi.getActivity(owner, repo);

      // 받아온 활동 데이터를 상태에 저장
      setActivities(data);

      // 현재 어떤 repo를 보고 있는지 기록
      const newRepoInfo = { owner, repo };
      setRepoInfo(newRepoInfo);

      // localStorage에 저장
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        activities: data,
        repoInfo: newRepoInfo
      }));

    } catch (err) {
      // 에러 발생 시 콘솔에 원본 에러 출력 (개발용)
      console.error('Error fetching GitHub activity:', err);

      // 사용자에게 보여줄 에러 메시지 설정
      setError(
        // API 서버가 에러 메시지를 보냈으면 그걸 보여주고
        err.response?.data?.message ||
        // 아니면 기본 메시지 출력
        '데이터를 가져오는 중 오류가 발생했습니다. 레포지토리 이름을 확인해주세요.'
      );

    } finally {
      // 성공하든 실패하든 마지막에 로딩 상태를 false로 변경
      setIsLoading(false);
    }
  };

  // 외부(Home.jsx 등)에서 쓸 수 있도록 상태와 함수들을 반환
  return {
    activities,                // 활동 목록
    isLoading,                 // 로딩 여부
    error,                     // 에러 메시지
    repoInfo,                  // 저장소 정보
    fetchGitHubActivity: fetchActivity, // API 요청 함수 (이름 변경해서 제공)
  };
};
