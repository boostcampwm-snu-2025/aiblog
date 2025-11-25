import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useActivities } from "../contexts/useActivities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveBlogPost } from "../apis/api";

const BlogDisplay = () => {
  const { generateBlogMutation } = useActivities();
  const { data: generatedBlog, isLoading, error } = generateBlogMutation;
  const queryClient = useQueryClient();

  const saveBlogMutation = useMutation({
    mutationFn: saveBlogPost,
    onSuccess: () => {
      // Invalidate and refetch the blogs query to show the new post in the saved list
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      // Optionally, show a success message to the user
      alert("Blog post saved!");
    },
    onError: (error) => {
      // Optionally, show an error message to the user
      alert(`Error saving post: ${error.message}`);
    },
  });

  const handleSave = () => {
    if (!generatedBlog) return;

    const lines = generatedBlog.split("\n");
    // A simple way to get a title - find the first non-empty line.
    const title = lines.find((line) => line.trim() !== "") || "Untitled Post";

    saveBlogMutation.mutate({ title, content: generatedBlog });
  };

  if (isLoading) {
    return (
      <div className="text-center p-10">
        <p className="text-lg text-pink-500">Generating blog post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 bg-red-100 border border-red-400 text-red-700 rounded-lg mt-6">
        <p className="font-bold">Failed to generate blog.</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  if (generatedBlog) {
    return (
      <div className="mt-10 bg-pink-50 rounded-xl shadow-lg p-6 border-2 border-pink-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-pink-600">
            Generated Blog Post
          </h2>
          <button
            onClick={handleSave}
            disabled={saveBlogMutation.isLoading}
            className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
          >
            {saveBlogMutation.isLoading ? "Saving..." : "Save Post"}
          </button>
        </div>
        <div className="prose prose-pink max-w-none wrap-break-word">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {generatedBlog}
          </ReactMarkdown>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full text-gray-500">
      <p>Click "Generate Blog" on an activity to see the post here.</p>
    </div>
  );
};

export default BlogDisplay;
