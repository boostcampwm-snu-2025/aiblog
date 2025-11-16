import { forwardRef } from "react";

import { Editor as TuiEditor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

type EditorProps = {
  initialValue?: string;
};

const Editor = forwardRef<TuiEditor, EditorProps>(({ initialValue }, ref) => {
  return (
    <TuiEditor
      ref={ref}
      initialValue={initialValue || ""}
      previewStyle="vertical"
      height="600px"
      initialEditType="markdown"
      useCommandShortcut={true}
    />
  );
});

Editor.displayName = "Editor";

export default Editor;
