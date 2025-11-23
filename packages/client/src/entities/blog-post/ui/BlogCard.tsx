import { Card, Button } from "@shared";

type BlogCardProps = {
  title: string;
  content: string;
  onViewDetails?: () => void;
  className?: string;
};

const PREVIEW_MAX_LENGTH = 240;

function createPreview(text: string, maxLen: number): string {
  const plain = text
    .replace(/[#>*`_~\-]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= maxLen) return plain;
  return plain.slice(0, maxLen) + "…";
}

export function BlogCard({
  title,
  content,
  onViewDetails,
  className,
}: BlogCardProps) {
  const preview = createPreview(content, PREVIEW_MAX_LENGTH);

  return (
    <Card className={className}>
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{preview}</p>
        <div>
          <Button size="sm" onClick={onViewDetails}>
            view details
          </Button>
        </div>
      </div>
    </Card>
  );
}
