import ReactMarkdown from "react-markdown";

interface Props {
  content: string;
}

export default function BlogView({ content }: Props) {
  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
