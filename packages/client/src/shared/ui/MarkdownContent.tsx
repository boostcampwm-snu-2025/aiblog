import { Card } from "../Card";
import { parseMarkdownLine } from "../lib/markdownUtils";

type MarkdownContentProps = {
  content: string;
};

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <Card variant="ghost" padding="none" className="whitespace-pre-wrap">
      <div className="prose prose-sm max-w-none text-gray-700">
        {content.split("\n").map((line, index) => {
          const parsed = parseMarkdownLine(line);

          switch (parsed.type) {
            case "h2":
              return (
                <h2
                  key={index}
                  className="text-lg font-semibold text-gray-900 mt-6 mb-3 first:mt-0"
                >
                  {parsed.content}
                </h2>
              );
            case "h3":
              return (
                <h3
                  key={index}
                  className="text-base font-semibold text-gray-900 mt-4 mb-2"
                >
                  {parsed.content}
                </h3>
              );
            case "list":
              return (
                <li key={index} className="ml-4 mb-1">
                  {parsed.content}
                </li>
              );
            case "break":
              return <br key={index} />;
            case "paragraph":
              return (
                <p key={index} className="mb-2">
                  {parsed.content}
                </p>
              );
          }
        })}
      </div>
    </Card>
  );
}
