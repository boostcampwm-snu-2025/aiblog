import BlogView from "../component/BlogView";

export default function BlogPage({ content, repoName }: { content: string; repoName:string; }) {
  return (<div>
    <BlogView content={content} />
    <button onClick={() => downloadMarkdown(content, `${repoName}.txt`)}>
        Save as Markdown
    </button>

    </div>)
}

function downloadMarkdown(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
