import { useEffect, useState } from "react";

export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export const useFetchJson = <T,>(
  url: string | null,
  init?: RequestInit
): FetchState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!url) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }
    const controller = new AbortController();
    const doFetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(url, { ...(init || {}), signal: controller.signal });
        if (!res.ok) {
          throw new Error(`Request failed (${res.status})`);
        }
        const json = (await res.json()) as T;
        setData(json);
      } catch (e: any) {
        if (e?.name !== "AbortError") {
          setError(e instanceof Error ? e : new Error(String(e)));
        }
      } finally {
        setLoading(false);
      }
    };
    doFetch();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { data, loading, error };
};

