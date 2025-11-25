import { useState } from "react";
import { useActivities } from "../contexts/useActivities";

function ActivityList() {
  const { activities, isLoading, error, generateBlogMutation } =
    useActivities();
  const [processingCommitSha, setProcessingCommitSha] = useState(null);

  if (isLoading) {
    return (
      <div className="text-center p-10">
        <p className="text-lg text-gray-500">Loading activities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <p className="font-bold">Oops! Something went wrong.</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center p-10">
        <p className="text-lg text-gray-500">
          No activities to display. Enter a repository and click "Get
          Activities".
        </p>
      </div>
    );
  }

  const handleGenerateClick = (activity) => {
    setProcessingCommitSha(activity.sha);
    generateBlogMutation.mutate(
      {
        commitMessage: activity.message,
        diff: activity.diff,
      },
      {
        onSettled: () => {
          setProcessingCommitSha(null);
        },
      }
    );
  };

  return (
    <div className="space-y-6 mt-6">
      {activities.map((activity) => {
        const isProcessing =
          generateBlogMutation.isLoading &&
          processingCommitSha === activity.sha;

        return (
          <div
            key={activity.sha}
            className="bg-white rounded-xl shadow-lg p-6 transition-transform transform hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img
                  src={`https://github.com/${activity.authorLogin}.png`}
                  alt={activity.authorName}
                  className="w-10 h-10 rounded-full mr-4 border-2 border-pink-200"
                />
                <span className="font-bold text-gray-800">
                  {activity.authorName}
                </span>
              </div>
              <button
                onClick={() => handleGenerateClick(activity)}
                disabled={generateBlogMutation.isLoading}
                className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded-full disabled:bg-gray-400 transition-colors"
              >
                {isProcessing ? "Generating..." : "블로그 생성"}
              </button>
            </div>
            <p className="text-gray-700 text-lg mb-3">{activity.message}</p>
            <span className="text-sm text-gray-400">
              {activity.date
                ? new Date(activity.date).toLocaleString()
                : "Unknown date"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default ActivityList;
