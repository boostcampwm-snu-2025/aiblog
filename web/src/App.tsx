// web/src/App.tsx
import { useState } from 'react';
import { RepoForm } from './components/RepoForm';
import { ActivityList } from './components/ActivityList';
import { Loader } from './components/Loader';
import { ErrorBanner } from './components/ErrorBanner';
import { BlogPreview } from './components/BlogPreview';
import { createPost, fetchRecent, summarizeActivities } from './api';
import type { Activity } from './types';

export default function App() {
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [searched, setSearched] = useState(false);

  const [selected, setSelected] = useState<Activity | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [summaryLoadingId, setSummaryLoadingId] = useState<string | null>(null);
  const [summaryError, setSummaryError] = useState<string | undefined>();

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | undefined>();

  async function onSearch(owner: string, repo: string, sinceDays: number) {
    setError(undefined);
    setSummaryError(undefined);
    setSaveMessage(undefined);
    setLoading(true);
    setItems([]);
    setSearched(true);
    setSelected(null);
    setSummary('');
    try {
      const data = await fetchRecent(owner, repo, sinceDays);
      setItems(data);
    } catch (e: any) {
      setError(e?.message ?? '불러오기 실패');
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate(item: Activity) {
    setSelected(item);
    setSummary('');
    setSummaryError(undefined);
    setSaveMessage(undefined);
    setSummaryLoadingId(item.id);
    try {
      const markdown = await summarizeActivities([item], 'ko', 'blog');
      setSummary(markdown);
    } catch (e: any) {
      setSummaryError(e?.message ?? 'AI 요약 생성 실패');
    } finally {
      setSummaryLoadingId(null);
    }
  }

  async function handleSave() {
    if (!selected || !summary) return;
    setSaving(true);
    setSaveMessage(undefined);
    try {
      const title = selected.title || 'GitHub 업데이트';
      await createPost(title, summary, ['github', selected.type]);
      setSaveMessage('블로그 포스트로 저장되었습니다.');
    } catch (e: any) {
      setSaveMessage(e?.message ?? '저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-header-left">
          <span className="app-logo-dot" />
          <span className="app-title">Smart Blog</span>
        </div>
        <nav className="app-nav">
          <button type="button" className="nav-btn">
            Saved Posts
          </button>
          <button type="button" className="nav-btn">
            Settings
          </button>
        </nav>
      </header>

      <main className="app-main">
        <section className="search-section">
          <RepoForm onSearch={onSearch} />
          {loading && <Loader />}
          {error && <ErrorBanner msg={error} />}
        </section>

        <section className="content-layout">
          <div className="column column-left">
            <h2 className="column-title">Recent Commits</h2>
            {!loading && !error && searched && items.length === 0 && (
              <div className="empty">
                선택한 기간 내에 표시할 커밋/PR이 없습니다.
              </div>
            )}
            {!loading && !error && items.length > 0 && (
              <ActivityList
                items={items}
                selectedId={selected?.id}
                generatingId={summaryLoadingId}
                onGenerate={handleGenerate}
              />
            )}
          </div>

          <div className="column column-right">
            <h2 className="column-title">Selected Commit</h2>
            {!selected && (
              <div className="selected-empty">
                왼쪽 목록에서 커밋이나 PR에 대해{' '}
                <strong>Generate Summary</strong> 버튼을 눌러보세요.
              </div>
            )}

            {selected && (
              <div className="selected-card">
                <div className="selected-header">
                  <div className="selected-title">{selected.title}</div>
                  <div className="selected-meta">
                    {selected.author} ·{' '}
                    {new Date(selected.committedAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="selected-body">
                  <div className="selected-label">AI Summary</div>
                  {summaryLoadingId === selected.id && (
                    <div className="loading-inline">요약 생성 중…</div>
                  )}
                  {summaryError && (
                    <div className="error-inline">{summaryError}</div>
                  )}
                  {summary && <BlogPreview markdown={summary} />}
                  {!summary && !summaryLoadingId && !summaryError && (
                    <div className="summary-placeholder">
                      이 커밋에 대한 요약을 생성하려면 왼쪽에서
                      <strong> Generate Summary</strong> 버튼을 눌러주세요.
                    </div>
                  )}
                </div>

                <div className="selected-footer">
                  <button
                    type="button"
                    className="primary-btn save-btn"
                    disabled={!summary || saving}
                    onClick={handleSave}
                  >
                    {saving ? '저장 중…' : 'Save as Blog Post'}
                  </button>
                  {saveMessage && (
                    <span className="save-message">{saveMessage}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

