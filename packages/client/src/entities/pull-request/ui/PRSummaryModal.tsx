import { Modal } from "../../../shared/Modal";
import { Button } from "../../../shared";
import { Card } from "../../../shared";
import { MODAL_MAX_HEIGHT_VH } from "../../../shared/lib/constants";
import { parseMarkdownLine } from "../../../shared/lib/markdownUtils";

type PRSummaryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  summary: string | null;
  isLoading: boolean;
  error?: string | null;
  onGenerateBlogPost?: () => void;
};

export function PRSummaryModal({
  isOpen,
  onClose,
  summary,
  isLoading,
  error,
  onGenerateBlogPost,
}: PRSummaryModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
      <div
        className="flex flex-col h-full"
        style={{ maxHeight: `${MODAL_MAX_HEIGHT_VH}vh` }}
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">PR 요약</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <svg
                  className="animate-spin h-8 w-8 text-gray-600 mx-auto mb-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <p className="text-gray-600">요약을 생성하는 중...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-2">요약 생성에 실패했습니다.</p>
              <p className="text-sm text-gray-500">{error}</p>
            </div>
          ) : summary ? (
            <Card
              variant="ghost"
              padding="none"
              className="whitespace-pre-wrap"
            >
              <div className="prose prose-sm max-w-none text-gray-700">
                {summary.split("\n").map((line, index) => {
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
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>요약을 불러올 수 없습니다.</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
          {summary && onGenerateBlogPost && (
            <Button onClick={onGenerateBlogPost}>블로그 글 생성하기</Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
