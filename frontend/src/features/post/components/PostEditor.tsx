import { useState } from "react";

import Editor from "@/components/editor/Editor";
import { useEditor } from "@/components/editor/useEditor";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import TextInput from "@/components/ui/TextInput";
import type { PostEditorData } from "@/entities/post";

type PostEditorProps = {
  initValue?: PostEditorData;
  onSaveClick: (post: PostEditorData) => void;
};

export default function PostEditor({ initValue, onSaveClick }: PostEditorProps) {
  const { editorRef, getMarkdown } = useEditor();
  const [title, setTitle] = useState(initValue?.title || "");

  const handleSave = () => {
    const markdown = getMarkdown();
    console.log("Title:", title);
    console.log("Content:", markdown);
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
