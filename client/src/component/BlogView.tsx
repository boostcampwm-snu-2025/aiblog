import ReactMarkdown from "react-markdown";



export default function BlogView({ content }: {content: string}) {
  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
