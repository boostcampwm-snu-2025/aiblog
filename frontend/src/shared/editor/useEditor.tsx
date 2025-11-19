import { useRef } from "react";

import type { Editor as TuiEditor } from "@toast-ui/react-editor";

export function useEditor() {
  const editorRef = useRef<TuiEditor>(null);

  const getMarkdown = () => {
    return editorRef.current?.getInstance().getMarkdown() || "";
  };

  return {
    editorRef,
    getMarkdown,
  };
}
