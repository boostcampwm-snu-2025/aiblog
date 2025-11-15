import { useRef, useState } from "react";

import { Editor } from "@toast-ui/react-editor";

import "@toast-ui/editor/dist/toastui-editor.css";
import { useSearchParams } from "react-router";

export default function CreatePostPage() {
  const searchParams = useSearchParams();
  const editorRef = useRef<Editor>(null);
  const [title, setTitle] = useState("");

  const handleSave = () => {
    const markdown = editorRef.current?.getInstance().getMarkdown();
    console.log("Title:", title);
    console.log("Content:", markdown);
    // TODO: 저장 로직 추가
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">새 글 작성</h1>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
        className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      <Editor
        ref={editorRef}
        initialValue="# 여기에 내용을 작성하세요"
        previewStyle="vertical"
        height="600px"
        initialEditType="markdown"
        useCommandShortcut={true}
      />

      {/* 저장 버튼 */}
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={handleSave} className="rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600">
          저장
        </button>
      </div>
    </div>
  );
}
