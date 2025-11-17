//activities만 다룸
import { createContext, useContext, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchActivities, generateBlogPost } from "../apis/api";

const ActivityContext = createContext();

//이것도 없애야 되나?
export const useActivities = () => useContext(ActivityContext);

export const ActivityProvider = ({ children }) => {
  const [repoInfo, setRepoInfo] = useState({ owner: "", repo: "", branch: "" });

  const {
    data: activities,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["activities", repoInfo],
    queryFn: () =>
      fetchActivities(repoInfo.owner, repoInfo.repo, repoInfo.branch),
    enabled: !!repoInfo.owner && !!repoInfo.repo && !!repoInfo.branch,
  });

  const generateBlogMutation = useMutation({
    mutationFn: ({ commitMessage, diff }) =>
      generateBlogPost(commitMessage, diff),
  });

  return (
    <ActivityContext.Provider
      value={{
        activities,
        isLoading,
        error,
        setRepoInfo,
        generateBlogMutation,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};
