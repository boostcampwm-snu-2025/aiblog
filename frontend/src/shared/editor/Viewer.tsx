import { Viewer as TuiViewer } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";

type ViewerProps = {
  content: string;
};

export default function Viewer({ content }: ViewerProps) {
  return <TuiViewer initialValue={content} />;
}
