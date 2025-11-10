import { useState } from 'react';
import './RepoInputForm.css';

function RepoInputForm({ onSubmit, isLoading }) {
  const [repoUrl, setRepoUrl] = useState('');
  const [error, setError] = useState('');

  const parseRepoUrl = (url) => {
    // GitHub URL 파싱
    // 예: https://github.com/owner/repo 또는 owner/repo
    const githubUrlPattern = /github\.com\/([^\/]+)\/([^\/\?#]+)/;
    const shortPattern = /^([^\/]+)\/([^\/\?#]+)$/;

    let match = url.match(githubUrlPattern);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }

    match = url.match(shortPattern);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }

    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!repoUrl.trim()) {
      setError('레포지토리 URL을 입력해주세요.');
      return;
    }

    const parsed = parseRepoUrl(repoUrl.trim());
    if (!parsed) {
      setError('올바른 GitHub 레포지토리 URL을 입력해주세요. (예: owner/repo)');
      return;
    }

    onSubmit(parsed);
  };

  return (
    <div className="repo-input-form">
      <h2>GitHub 활동 분석하기</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="예: facebook/react 또는 https://github.com/facebook/react"
            disabled={isLoading}
            className="repo-input"
          />
          <button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? '로딩 중...' : '분석하기'}
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </form>
      <p className="hint">
        GitHub 레포지토리 주소를 입력하면 최근 커밋과 PR 목록을 가져옵니다.
      </p>
    </div>
  );
}

export default RepoInputForm;
