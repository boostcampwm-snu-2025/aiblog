import type { MouseEventHandler } from "react";
import type { SimplePRDetail } from "../../../shared/api/github";

interface PRDetailModalProps {
  open: boolean;
  onClose: MouseEventHandler<HTMLButtonElement>;
  data: SimplePRDetail | null;
}

export default function PRDetailModal({ open, onClose, data }: PRDetailModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold text-lg">PR 상세 보기</h3>
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            닫기
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6 text-left space-y-4">
          {!data ? (
            <div className="text-center text-gray-500">불러오는 중...</div>
          ) : (
            <>
              <a
                href={data.html_url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 font-semibold hover:underline"
              >
                #{data.number} — {data.title}
              </a>

              <p className="text-sm text-gray-500">
                작성자: {data.author} |{" "}
                {new Date(data.created_at).toLocaleString()}
                {data.merged ? " | (merged)" : ""}
              </p>

              {data.body ? (
                <div className="whitespace-pre-wrap bg-gray-50 border rounded p-4 text-sm">
                  {data.body}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">본문 내용이 없습니다.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}