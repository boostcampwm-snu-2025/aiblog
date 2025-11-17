import { useState } from "react";

function ActivityList({ activities, isLoading, error }) {
  const [generatedBlog, setGeneratedBlog] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);

  const handleGenerateBlog = async (commitMessage, diff) => {
    setIsGenerating(true);
    setGeneratedBlog("");
    setGenerationError(null);

    try {
      const response = await fetch("/api/blog/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commitMessage: commitMessage,
          diff: diff,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate blog post.");
      }

      const data = await response.json();
      setGeneratedBlog(data.blog);
    } catch (e) {
      setGenerationError(e.message);
    } finally {
      setIsGenerating(false);
    }
  };

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
        <p className="text-sm">{error}</p>
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

  return (
    <>
      <div className="space-y-6">
        {activities.map((activity) => (
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
                onClick={() =>
                  handleGenerateBlog(activity.message, activity.diff)
                }
                disabled={isGenerating}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
              >
                {isGenerating ? "Generating..." : "블로그 생성"}
              </button>
            </div>
            <p className="text-gray-700 text-lg mb-3">{activity.message}</p>
            <span className="text-sm text-gray-400">
              {activity.date
                ? new Date(activity.date).toLocaleString()
                : "Unknown date"}
            </span>
          </div>
        ))}
      </div>

      {isGenerating && (
        <div className="text-center p-10">
          <p className="text-lg text-gray-500">Generating blog post...</p>
        </div>
      )}

      {generationError && (
        <div className="text-center p-10 bg-red-100 border border-red-400 text-red-700 rounded-lg mt-6">
          <p className="font-bold">Failed to generate blog.</p>
          <p className="text-sm">{generationError}</p>
        </div>
      )}

      {generatedBlog && (
        <div className="mt-10 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Generated Blog Post</h2>
          <div className="prose max-w-none">{generatedBlog}</div>
        </div>
      )}
    </>
  );
}

export default ActivityList;
