import { useRef, useState } from "react";
import { useSearchParams } from "react-router";

import { Editor } from "@toast-ui/react-editor";

import "@toast-ui/editor/dist/toastui-editor.css";

import Button from "@/components/ui/Button";
import { ErrorFallback, LoadingFallback } from "@/components/ui/Fallback";
import Label from "@/components/ui/Label";
import TextInput from "@/components/ui/TextInput";
import { useAiPost } from "@/features/post/api/getAiPost";

export default function CreatePostPage() {
  const [searchParams] = useSearchParams();
  const owner = searchParams.get("owner") ?? "";
  const repository = searchParams.get("repository") ?? "";
  const prNumber = Number(searchParams.get("prNumber") ?? "0");

  const hasSearchParams = owner !== "" && repository !== "" && prNumber > 0;

  const { data: aiPost, status } = useAiPost({
    params: { owner, repository, prNumber },
    queryConfig: { enabled: hasSearchParams },
  });
  const editorRef = useRef<Editor>(null);
  const [title, setTitle] = useState(aiPost?.title || "");

  const handleSave = () => {
    const markdown = editorRef.current?.getInstance().getMarkdown();
    console.log("Title:", title);
    console.log("Content:", markdown);
    // TODO: 저장 로직 추가
  };

  const handleTitleChange = (title: string) => {
    setTitle(title);
  };

  if (status === "error") return <ErrorFallback />;

  //   if (status === "pending") {
  //     return <LoadingFallback />;
  //   }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">새 글 작성</h1>
      <div className="space-y-5">
        <TextInput value={title} onChange={(e) => handleTitleChange(e.target.value)} label="제목" required />

        <div>
          <Label label="내용" required />
          <Editor
            ref={editorRef}
            initialValue={aiPost?.content || ""}
            previewStyle="vertical"
            height="600px"
            initialEditType="markdown"
            useCommandShortcut={true}
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>저장</Button>
        </div>
      </div>
    </div>
  );
}
