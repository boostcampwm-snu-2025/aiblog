//데이터 fetching (owner -> repos)
import { useQuery } from "@tanstack/react-query";
import { fetchUserRepos } from "../apis/github";

export const useGithubRepos = (owner) => {
  return useQuery({
    queryKey: ["repos", owner],
    queryFn: () => fetchUserRepos(owner),
    enabled: !!owner,
    select: (data) => {
      // 데이터가 배열이 아니거나 비어있을 경우 안전하게 처리
      if (!Array.isArray(data)) {
        // 예상치 못한 데이터 형식일 경우 경고를 남기고 빈 배열 반환
        console.warn("Unexpected data format for repos:", data);
        return [];
      }
      // 각 repo 객체가 id와 name을 가지고 있는지 확인
      return data.filter((repo) => repo.id && repo.name);
    },
  });
};
