import { useCallback, useState } from 'react';

// idle | loading | success | error 상태관리 공통 훅
export function useAsync(fn) {
  const [status, setStatus] = useState('idle');
  const [error, setError]   = useState(null);
  const [data, setData]     = useState(null);

  const run = useCallback(async (...args) => {
    setStatus('loading'); setError(null);
    try {
      const res = await fn(...args);
      setData(res); setStatus('success');
      return res;
    } catch (e) {
      setError(e); setStatus('error');
      throw e;
    }
  }, [fn]);

  return { status, error, data, run };
}
