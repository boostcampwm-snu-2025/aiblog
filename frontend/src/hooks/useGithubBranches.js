//데이터 fetching (repo -> branches)
import { useQuery } from "@tanstack/react-query";
import { fetchRepoBranches } from "../apis/github";

export const useGithubBranches = (owner, repo) => {
  return useQuery({
    queryKey: ["branches", owner, repo],
    queryFn: () => fetchRepoBranches(owner, repo),
    enabled: !!owner && !!repo,
    select: (data) => {
      if (!Array.isArray(data)) {
        // 예상치 못한 데이터 형식일 경우 경고를 남기고 빈 배열 반환
        console.warn("Unexpected data format for branches:", data);
        return [];
      }
      // 각 branch 객체가 name을 가지고 있는지 확인
      return data.filter((branch) => branch.name);
    },
  });
};
