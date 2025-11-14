import { useState, useCallback } from "react";

export default function useFetch<T, A extends any[]>(
  apiFunc: (...args: A) => Promise<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (...args: A) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunc(...args);
      setData(result);
    } catch (err: unknown) {
      // 1) 일반적인 Error 인스턴스
      if (err instanceof Error) {
        setError(err.message);
        return;
      }

      // 2) Axios-like 에러 구조 (err.response.data.message 등)
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as any).response?.data === "object"
      ) {
        const axiosErr = err as any;
        const apiMsg =
          axiosErr.response?.data?.message ??
          axiosErr.response?.statusText ??
          "API Error";
        setError(apiMsg);
        return;
      }

      // 3) Promise reject가 string인 경우 — throw "error message"
      if (typeof err === "string") {
        setError(err);
        return;
      }

      // 4) Promise reject가 숫자나 boolean처럼 이상한 경우
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  return { data, loading, error, fetchData, setData };
}
