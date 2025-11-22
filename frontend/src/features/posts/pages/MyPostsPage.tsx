import ReactMarkdown from "react-markdown";
import { useState } from "react";

interface SavedPost {
  title: string;
  content: string;
  createdAt: string;
}

export default function MyPostsPage() {
  const [posts] = useState<SavedPost[]>(() => {
    return JSON.parse(localStorage.getItem("blog-posts") || "[]");
  });

  if (posts.length === 0) {
    return (
      <div className="text-center text-gray-600">
        <h2 className="text-2xl font-semibold mb-4">📝 My Saved Posts</h2>
        <p>아직 저장된 글이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">📝 My Saved Posts</h2>

      <ul className="space-y-4">
        {posts.map((post, i) => (
          <li key={i} className="p-4 border rounded text-left">
            <h3 className="font-bold text-lg">{post.title}</h3>
            <p className="text-gray-500 text-sm mb-2">
              {new Date(post.createdAt).toLocaleString()}
            </p>
            <div className="prose max-w-none">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}