import { useState } from 'react';
import { RepoForm } from './components/RepoForm';
import { ActivityList } from './components/ActivityList';
import { Loader } from './components/Loader';
import { ErrorBanner } from './components/ErrorBanner';
import { BlogPreview } from './components/BlogPreview';
import { fetchRecent, summarize } from './api';
import type { Activity } from './types';

export default function App(){
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|undefined>();
  const [selected, setSelected] = useState<string[]>([]);
  const [md, setMd] = useState('');

  async function onSearch(owner:string, repo:string){
    setError(undefined); setLoading(true); setMd(''); setSelected([]);
    try { setItems(await fetchRecent(owner, repo)); }
    catch(e:any){ setError(e.message || '불러오기 실패'); }
    finally{ setLoading(false); }
  }
  async function onSummarize(){
    try {
      const chosen = items.filter(i=>selected.includes(i.id));
      const text = await summarize(chosen);
      setMd(text);
    } catch(e:any){ setError(e.message || '요약 실패'); }
  }

  return (
    <div className="container">
      <h1>GitHub 활동 요약 블로그</h1>
      <RepoForm onSearch={onSearch} />
      {loading && <Loader/>}
      {error && <ErrorBanner msg={error}/>}  
      {!!items.length && <>
        <div className="toolbar">
          <button onClick={onSummarize} disabled={!selected.length}>선택 항목 요약 생성</button>
          <span>{selected.length}개 선택</span>
        </div>
        <ActivityList items={items} onSelect={setSelected}/>
      </>}
      {!!md && <>
        <h2>요약 미리보기</h2>
        <BlogPreview markdown={md}/>
      </>}
    </div>
  );
}