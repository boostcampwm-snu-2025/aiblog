import type { PaginationInfo } from "@/entities/pullrequest";
import Button from "@/shared/ui/Button";

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

export default function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { currentPage, hasNext, hasPrev } = pagination;

  return (
    <div className="flex items-center justify-center gap-4">
      <Button onClick={() => onPageChange(currentPage - 1)} disabled={!hasPrev}>
        ← 이전
      </Button>
      <span className="text-gray-700">페이지 {currentPage}</span>
      <Button onClick={() => onPageChange(currentPage + 1)} disabled={!hasNext}>
        다음 →
      </Button>
    </div>
  );
}
