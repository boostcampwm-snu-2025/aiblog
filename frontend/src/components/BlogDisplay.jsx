import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useActivities } from "../contexts/ActivityContext";

const BlogDisplay = () => {
  const { generateBlogMutation } = useActivities();
  const { data: generatedBlog, isLoading, error } = generateBlogMutation;

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
        <h2 className="text-3xl font-bold mb-4 text-pink-600">
          Generated Blog Post
        </h2>
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
