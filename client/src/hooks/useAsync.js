import { useState, useCallback } from 'react';

/**
 * Custom hook for managing async operations with status pattern
 * @template T
 * @param {Function} asyncFunction - The async function to execute
 * @returns {Object} - { execute, status, data, error, isLoading, isSuccess, isError }
 */
export const useAsync = (asyncFunction) => {
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...params) => {
      setStatus('loading');
      setData(null);
      setError(null);

      try {
        const result = await asyncFunction(...params);
        setData(result);
        setStatus('success');
        return result;
      } catch (err) {
        setError(err.message || 'An error occurred');
        setStatus('error');
        throw err;
      }
    },
    [asyncFunction]
  );

  return {
    execute,
    status,
    data,
    error,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
    isIdle: status === 'idle',
  };
};
