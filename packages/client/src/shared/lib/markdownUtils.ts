type MarkdownLine = {
  type: "h2" | "h3" | "list" | "paragraph" | "break";
  content: string;
};

export function parseMarkdownLine(line: string): MarkdownLine {
  if (line.startsWith("## ")) {
    return {
      type: "h2",
      content: line.replace("## ", ""),
    };
  }

  if (line.startsWith("### ")) {
    return {
      type: "h3",
      content: line.replace("### ", ""),
    };
  }

  if (line.trim().startsWith("- ")) {
    return {
      type: "list",
      content: line.replace("- ", ""),
    };
  }

  if (line.trim() === "") {
    return {
      type: "break",
      content: "",
    };
  }

  return {
    type: "paragraph",
    content: line,
  };
}
