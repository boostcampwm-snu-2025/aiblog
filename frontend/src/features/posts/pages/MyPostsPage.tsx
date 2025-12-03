import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { usePosts } from "../../../shared/contexts/PostsContext";

export default function MyPostsPage() {
  const { posts, dispatch } = usePosts();

  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  // 수정 폼 상태
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const currentPost = posts.find(p => p.createdAt === selectedPost) || null;

  if (posts.length === 0) {
    return (
      <div className="text-center text-gray-600">
        <h2 className="text-2xl font-semibold mb-4">📝 My Saved Posts</h2>
        <p>아직 저장된 글이 없습니다.</p>
      </div>
    );
  }

  const handleDelete = (createdAt: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    dispatch({ type: "DELETE_POST", payload: createdAt });
    setSelectedPost(null);
  };

  const startEdit = (post: any) => {
    setEditMode(true);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const saveEdit = () => {
    if (!currentPost) return;

    dispatch({
      type: "EDIT_POST",
      payload: {
        ...currentPost,
        title: editTitle,
        content: editContent
      }
    });

    setEditMode(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">📝 My Saved Posts</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* 📌 왼쪽 목록 */}
        <div className="md:col-span-1 border rounded p-4 bg-gray-50">
          <h3 className="text-lg font-bold mb-3">저장된 글 목록</h3>

          <ul className="space-y-3">
            {posts.map(post => (
              <li
                key={post.createdAt}
                onClick={() => {
                  setSelectedPost(post.createdAt);
                  setEditMode(false);
                }}
                className={`p-3 rounded cursor-pointer hover:bg-gray-200 transition ${
                  selectedPost === post.createdAt ? "bg-gray-300" : ""
                }`}
              >
                <p className="font-semibold">{post.title}</p>
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* 📌 오른쪽 상세 / 수정 */}
        <div className="md:col-span-2 border rounded p-4">
          {!currentPost ? (
            <p className="text-center text-gray-500">왼쪽에서 글을 선택하세요.</p>
          ) : editMode ? (
            // ✏ 수정 모드
            <div>
              <h3 className="text-xl font-bold mb-3">✏ 글 수정</h3>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full border p-2 rounded mb-3"
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full border p-2 rounded h-48"
              />

              <div className="mt-4 flex gap-3">
                <button
                  onClick={saveEdit}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  저장
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            // 📄 상세 보기
            <div>
              <h3 className="text-xl font-bold mb-3">{currentPost.title}</h3>
              <p className="text-gray-500 text-sm mb-4">
                {new Date(currentPost.createdAt).toLocaleString()}
              </p>

              <p className="whitespace-pre-wrap text-left leading-relaxed">
                <ReactMarkdown>{currentPost.content}</ReactMarkdown>
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => startEdit(currentPost)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(currentPost.createdAt)}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  삭제
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}