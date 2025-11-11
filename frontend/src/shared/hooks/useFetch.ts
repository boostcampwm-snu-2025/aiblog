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
    } catch (err: any) {
      setError(err.message ?? "Error occurred");
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  return { data, loading, error, fetchData };
}
