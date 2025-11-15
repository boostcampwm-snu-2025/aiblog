import { useState } from 'react';
import NavBar from './components/NavBar.jsx';
import RepoSearch from './components/RepoSearch.jsx';
import CommitList from './components/CommitList.jsx';
import SelectedCommit from './components/SelectedCommit.jsx';
import SavedPosts from './components/SavedPosts.jsx';

import { getCommits, getPRs, summarizeCommit, summarizePR, savePost } from './api.js';

function PRList({ prs = [], onSelect, onSummarize }) {
  const list = Array.isArray(prs) ? prs : [];
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Recent PRs</h3>
      {list.length === 0 ? (
        <div className="badge">No PRs</div>
      ) : (
        <div className="list">
          {list.map((pr) => (
            <div key={pr.number} className="item">
              <div>
                <div><strong>#{pr.number} {pr.title}</strong></div>
                <div className="badge">{new Date(pr.updatedAt).toISOString().slice(0, 10)}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn secondary" onClick={() => onSelect(pr)}>Open</button>
                <button className="btn" onClick={() => onSummarize(pr)}>Generate Summary</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState('home');           
  const [mode, setMode] = useState('commits');        
  const [currentRepo, setCurrentRepo] = useState(''); 

  // Commits 상태
  const [commits, setCommits] = useState([]);
  const [selected, setSelected] = useState(null);
  const [summary, setSummary] = useState('');

  // PR 상태
  const [prs, setPrs] = useState([]);
  const [selectedPr, setSelectedPr] = useState(null);
  const [prSummary, setPrSummary] = useState('');

  // 공통
  const [error, setError] = useState('');
  const [loadingList, setLoadingList] = useState(false);

  // repo 불러오기(Commits 기본)
  async function load(repo) {
    setError('');
    setCurrentRepo(repo || '');
    setMode('commits');        // 기본은 커밋 탭
    setLoadingList(true);

    // 커밋 패널 초기화
    setCommits([]);
    setSelected(null);
    setSummary('');

    // PR 패널도 같이 초기화
    setPrs([]);
    setSelectedPr(null);
    setPrSummary('');

    try {
      const list = await getCommits(repo);
      setCommits(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e.message || 'Failed to load commits');
    } finally {
      setLoadingList(false);
    }
  }

  // 커밋 요약
  async function onSummarizeCommit(c) {
    setSelected(c);
    setSummary('요약 생성 중...');
    try {
      const { summary } = await summarizeCommit(c);
      setSummary(summary);
    } catch (e) {
      setSummary('');
      setError(e.message || 'Failed to summarize commit');
    }
  }

  // PR 목록 불러오기
  async function loadPRsIfNeeded() {
    if (!currentRepo) {
      setError('레포를 먼저 Load 해주세요 (owner/repo)');
      return;
    }
    if (prs.length > 0) return; // 이미 로드됨
    setLoadingList(true);
    try {
      const list = await getPRs(currentRepo);
      setPrs(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e.message || 'Failed to load PRs');
    } finally {
      setLoadingList(false);
    }
  }

  // PR 요약
  async function onSummarizePr(pr) {
    setSelectedPr(pr);
    setPrSummary('요약 생성 중...');
    try {
      const { summary } = await summarizePR(pr);
      setPrSummary(summary);
    } catch (e) {
      setPrSummary('');
      setError(e.message || 'Failed to summarize PR');
    }
  }

  // PR 저장
  async function onSavePr() {
    if (!selectedPr || !prSummary) return;
    try {
      await savePost({
        title: selectedPr.title,
        body: prSummary,
        sourceUrl: selectedPr.url,
        tags: ['pr']
      });
      alert('Saved!');
    } catch (e) {
      alert('Save failed: ' + (e.message || 'unknown'));
    }
  }

  return (
    <>
      <NavBar onNav={setView} />
      <div className="container">
        {view === 'home' && (
          <div className="row">
            <div>
              <RepoSearch onSearch={load} />
              <div style={{ height: 12 }} />

              {/* 탭 전환 버튼 */}
              <div className="card" style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
                <button
                  className={`btn ${mode === 'commits' ? '' : 'secondary'}`}
                  onClick={() => setMode('commits')}
                >
                  Commits
                </button>
                <button
                  className={`btn ${mode === 'prs' ? '' : 'secondary'}`}
                  onClick={async () => {
                    setMode('prs');
                    await loadPRsIfNeeded();
                  }}
                >
                  PRs
                </button>
              </div>

              {error && <div className="card" style={{ color: '#b91c1c' }}>에러: {error}</div>}
              {loadingList && <div className="card">로딩 중...</div>}

              {mode === 'commits' ? (
                <CommitList
                  commits={commits}
                  onSelect={setSelected}
                  onSummarize={onSummarizeCommit}
                />
              ) : (
                <PRList
                  prs={prs}
                  onSelect={setSelectedPr}
                  onSummarize={onSummarizePr}
                />
              )}
            </div>

            <div>
              {mode === 'commits' ? (
                <SelectedCommit commit={selected} summary={summary} />
              ) : (
                <div className="card">
                  <h3 style={{ marginTop: 0 }}>
                    {selectedPr ? selectedPr.title : 'PR 선택'}
                  </h3>
                  {selectedPr && (
                    <>
                      <div className="badge">
                        #{selectedPr.number} • {new Date(selectedPr.updatedAt).toLocaleString()}
                      </div>
                      <a href={selectedPr.url} target="_blank" rel="noreferrer">PR 링크 ↗</a>
                    </>
                  )}
                  <h4>AI Summary</h4>
                  <textarea readOnly defaultValue={prSummary || ''} />
                  <div style={{ marginTop: 12 }}>
                    <button className="btn" onClick={onSavePr} disabled={!selectedPr || !prSummary}>
                      Save as Blog Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'saved' && <SavedPosts />}
      </div>
    </>
  );
}
