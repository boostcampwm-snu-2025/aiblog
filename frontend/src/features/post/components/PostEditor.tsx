import { useState } from "react";

import type { PostEditorData } from "@/entities/post";
import Editor from "@/shared/editor/Editor";
import { useEditor } from "@/shared/editor/useEditor";
import Button from "@/shared/ui/Button";
import Label from "@/shared/ui/Label";
import TextInput from "@/shared/ui/TextInput";

type PostEditorProps = {
  initValue?: PostEditorData;
  onSaveClick: (post: PostEditorData) => void;
};

export default function PostEditor({ initValue, onSaveClick }: PostEditorProps) {
  const { editorRef, getMarkdown } = useEditor();
  const [title, setTitle] = useState(initValue?.title || "");

  const handleSave = () => {
    const markdown = getMarkdown();
    onSaveClick({ title, content: markdown });
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  return (
    <div className="space-y-5">
      <TextInput value={title} onChange={(e) => handleTitleChange(e.target.value)} label="제목" required />
      <div>
        <Label label="내용" required />
        <Editor ref={editorRef} initialValue={initValue?.content} />
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSave}>저장</Button>
      </div>
    </div>
  );
}
