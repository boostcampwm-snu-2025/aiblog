//activities만 다룸
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchActivities, generateBlogPost } from "../apis/api";
import { ActivityContext } from "./ActivityContext";

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
