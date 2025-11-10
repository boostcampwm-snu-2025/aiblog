import React, { useState } from 'react'; 
import NavBar from './components/NavBar.jsx';
import RepoSearch from './components/RepoSearch.jsx';
import CommitList from './components/CommitList.jsx';
import SelectedCommit from './components/SelectedCommit.jsx';
import SavedPosts from './components/SavedPosts.jsx';
import { getCommits, summarizeCommit } from './api.js';

export default function App() {
  const [view, setView] = useState('home');
  const [commits, setCommits] = useState([]);
  const [selected, setSelected] = useState(null);     
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');

  async function load(repo) {
    setError('');
    setCommits([]);
    setSelected(null);
    setSummary('');
    try {
      const list = await getCommits(repo);
      setCommits(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e.message || 'Failed to load commits');
    }
  }

  async function onSummarize(c) {
    setSelected(c);
    setSummary('요약 생성 중...');
    try {
      const { summary } = await summarizeCommit(c);
      setSummary(summary);
    } catch (e) {
      setSummary('');
      setError(e.message || 'Failed to summarize');
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
              {error && <div className="card" style={{ color: '#b91c1c' }}>에러: {error}</div>}
              <CommitList
                commits={commits}
                onSelect={setSelected}       
                onSummarize={onSummarize}
              />
            </div>
            <div>
              <SelectedCommit commit={selected} summary={summary} />
            </div>
          </div>
        )}
        {view === 'saved' && <SavedPosts />}
      </div>
    </>
  );
}
