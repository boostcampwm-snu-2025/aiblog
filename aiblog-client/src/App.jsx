import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // 1. 서버에서 받은 메시지를 저장할 상태
  const [message, setMessage] = useState('');

  // 2. 컴포넌트가 처음 렌더링될 때 서버에 테스트 요청
  useEffect(() => {
    // 3. index.js에서 설정한 /api/test로 요청
    fetch('http://localhost:4000/api/test')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        // 4. 성공하면 서버 메시지를 상태에 저장
        setMessage(data.message);
      })
      .catch(err => {
        // 5. 실패하면 에러 메시지 표시
        console.error('서버 연결 실패:', err);
        setMessage(`서버에 연결할 수 없습니다. (에러: ${err.message})`);
      });
  }, []); // 빈 배열: 이 효과를 한 번만 실행

  return (
    <>
      <h1>AI Blog Client (React)</h1>
      <h2>서버 연결 테스트:</h2>
      <p>{message || '서버에서 응답 대기 중...'}</p>
    </>
  );
}

export default App;