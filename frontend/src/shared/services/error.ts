export const handleQueryError = (error: Error) => {
  if (error instanceof HttpError) {
    if (error.status >= 500) {
      alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      return;
    }
  }

  // 네트워크 에러 (fetch 자체 실패)
  if (error instanceof TypeError) {
    alert("네트워크 연결을 확인해주세요.");
    return;
  }
};

export const handleMutationError = (error: Error) => {
  if (error instanceof HttpError) {
    if (error.status >= 500) {
      alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      return;
    }
  }

  // 네트워크 에러
  if (error instanceof TypeError) {
    alert("네트워크 연결을 확인해주세요.");
    return;
  }
};

export class HttpError extends Error {
  status: number;
  statusText: string;

  constructor(status: number, statusText: string) {
    super(`HTTP Error: ${status} ${statusText}`);
    this.name = "HttpError";
    this.status = status;
    this.statusText = statusText;
  }
}
