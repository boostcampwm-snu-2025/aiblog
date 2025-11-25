import { useState } from 'react';
import { useBlogContext } from '../contexts/BlogContext';

const PROXY_SERVER_URL = 'http://localhost:3001';

export function useLLM() {
  const [status, setStatus] = useState('idle'); // idle | generating | success | error
  const [error, setError] = useState(null);
  const { dispatch } = useBlogContext();

  const generateBlog = async (item) => {
    setStatus('generating');
    setError(null);

    try {
      const response = await fetch(`${PROXY_SERVER_URL}/api/llm/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemType: item.type,
          content: item.content,
          author: item.author,
        }),
      });

      if (!response.ok) {
        throw new Error('블로그 생성 실패');
      }

      const data = await response.json();
      const blogContent = data.blogContent;

      // 생성 성공 시 Context에 바로 저장
      dispatch({
        type: 'ADD_POST',
        payload: {
          id: item.id,
          type: item.type,
          title: item.content, // 원본 제목/메시지를 제목으로 사용
          content: blogContent,
          createdAt: new Date().toISOString(),
          originalUrl: item.url,
          author: item.author
        },
      });

      setStatus('success');
      return blogContent; // 모달 표시를 위해 반환

    } catch (err) {
      setError(err.message);
      setStatus('error');
      return null;
    } finally {
      setStatus('idle');
    }
  };

  return { status, error, generateBlog };
}