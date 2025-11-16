type LoadingFallbackProps = {
  message?: string;
};

export function LoadingFallback({ message = "로딩 중..." }: LoadingFallbackProps) {
  return (
    <div className="p-16 text-center">
      <div className="mx-auto mb-6 inline-block h-16 w-16 animate-spin rounded-full border-b-2 border-blue-600"></div>
      <p className="text-lg text-gray-600">{message}</p>
    </div>
  );
}

type ErrorFallbackProps = {
  message?: string;
};

export function ErrorFallback({ message = "오류가 발생했습니다. 잠시 후 다시 시도해주세요." }: ErrorFallbackProps) {
  return (
    <div className="p-16 text-center">
      <p className="text-lg text-red-600">{message}</p>
    </div>
  );
}
