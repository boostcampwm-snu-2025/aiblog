// web/src/App.tsx
import { useMemo, useState } from 'react';
import { RepoForm } from './components/RepoForm';
import { ActivityList } from './components/ActivityList';
import { Loader } from './components/Loader';
import { ErrorBanner } from './components/ErrorBanner';
import { BlogPreview } from './components/BlogPreview';
import { SavedPostList } from './components/SavedPostList';
import { fetchRecent, summarizeActivities } from './api';
import type { Activity } from './types';
import { usePosts, type AsyncStatus } from './postsContext';
import { useSettings } from './useSettings';

export default function App() {
  const [view, setView] = useState<'activities' | 'saved' | 'settings'>(
    'activities',
  );

  const { settings, setSettings } = useSettings();
  const { state: postsState, addPost, deletePost, selectPost, reloadFromStorage } =
    usePosts();

  const [items, setItems] = useState<Activity[]>([]);
  const [activitiesStatus, setActivitiesStatus] =
    useState<AsyncStatus>('idle');
  const [activitiesError, setActivitiesError] = useState<string | undefined>();
  const [searched, setSearched] = useState(false);

  const [selected, setSelected] = useState<Activity | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [summaryLoadingId, setSummaryLoadingId] = useState<string | null>(null);
  const [summaryError, setSummaryError] = useState<string | undefined>();
  const [summaryStatus, setSummaryStatus] = useState<AsyncStatus>('idle');

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | undefined>();

  async function onSearch(owner: string, repo: string, sinceDays: number) {
    setActivitiesError(undefined);
    setSummaryError(undefined);
    setSaveMessage(undefined);
    setActivitiesStatus('loading');
    setItems([]);
    setSearched(true);
    setSelected(null);
    setSummary('');
    try {
      const data = await fetchRecent(owner, repo, sinceDays);
      setItems(data);
      setActivitiesStatus('success');
    } catch (e: any) {
      setActivitiesError(e?.message ?? '불러오기 실패');
      setActivitiesStatus('error');
    }
  }

  async function handleGenerate(item: Activity) {
    setSelected(item);
    setSummary('');
    setSummaryError(undefined);
    setSaveMessage(undefined);
    setSummaryStatus('loading');
    setSummaryLoadingId(item.id);
    try {
      const markdown = await summarizeActivities(
        [item],
        settings.language,
        settings.tone,
      );
      setSummary(markdown);
      setSummaryStatus('success');
    } catch (e: any) {
      setSummaryError(e?.message ?? 'AI 요약 생성 실패');
      setSummaryStatus('error');
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
      addPost({ title, markdown: summary, tags: ['github', selected.type] });
      setSaveMessage('블로그 포스트로 저장되었습니다.');
    } catch (e: any) {
      setSaveMessage(e?.message ?? '저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  }

  const selectedPost = useMemo(
    () =>
      postsState.selectedId
        ? postsState.items.find((p) => p.id === postsState.selectedId) ?? null
        : null,
    [postsState.items, postsState.selectedId],
  );

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-header-left">
          <span className="app-logo-dot" />
          <span className="app-title">Smart Blog</span>
        </div>
        <nav className="app-nav">
          <button
            type="button"
            className={`nav-btn${view === 'saved' ? ' nav-btn--active' : ''}`}
            onClick={() => setView('saved')}
          >
            Saved Posts
          </button>
          <button
            type="button"
            className={`nav-btn${
              view === 'activities' ? ' nav-btn--active' : ''
            }`}
            onClick={() => setView('activities')}
          >
            Recent Commits
          </button>
          <button
            type="button"
            className={`nav-btn${
              view === 'settings' ? ' nav-btn--active' : ''
            }`}
            onClick={() => setView('settings')}
          >
            Settings
          </button>
        </nav>
      </header>

      <main className="app-main">
        {view === 'activities' && (
          <>
            <section className="search-section">
              <RepoForm
                onSearch={onSearch}
                defaultSinceDays={settings.defaultSinceDays}
              />
              {activitiesStatus === 'loading' && <Loader />}
              {activitiesError && <ErrorBanner msg={activitiesError} />}
            </section>

            <section className="content-layout">
              <div className="column column-left">
                <h2 className="column-title">Recent Commits</h2>
                {activitiesStatus === 'success' &&
                  searched &&
                  items.length === 0 && (
                  <div className="empty">
                    선택한 기간 내에 표시할 커밋/PR이 없습니다.
                  </div>
                )}
                {activitiesStatus === 'success' && items.length > 0 && (
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
                      {summaryStatus === 'loading' &&
                        summaryLoadingId === selected.id && (
                        <div className="loading-inline">요약 생성 중…</div>
                      )}
                      {summaryError && (
                        <div className="error-inline">{summaryError}</div>
                      )}
                      {summary && <BlogPreview markdown={summary} />}
                      {!summary &&
                        summaryStatus !== 'loading' &&
                        !summaryError && (
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
          </>
        )}

        {view === 'saved' && (
          <section className="content-layout">
            <div className="column column-left">
              <div className="column-header-row">
                <h2 className="column-title">Saved Posts</h2>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => reloadFromStorage()}
                  disabled={postsState.status === 'loading'}
                >
                  새로고침
                </button>
              </div>
              {postsState.status === 'loading' && <Loader />}
              {postsState.status === 'error' && postsState.error && (
                <ErrorBanner msg={postsState.error} />
              )}
              {postsState.status !== 'loading' &&
                postsState.status !== 'error' && (
                <SavedPostList
                  posts={postsState.items}
                  selectedId={postsState.selectedId ?? undefined}
                  onSelect={(post) => selectPost(post.id)}
                  onDelete={(post) => {
                    if (!window.confirm('이 포스트를 삭제할까요?')) return;
                    deletePost(post.id);
                  }}
                />
              )}
            </div>

            <div className="column column-right">
              <h2 className="column-title">Post Detail</h2>
              {!selectedPost && (
                <div className="selected-empty">
                  왼쪽에서 저장된 블로그 글을 선택하면 내용이 표시됩니다.
                </div>
              )}
              {selectedPost && (
                <div className="selected-card">
                  <div className="selected-header">
                    <div className="selected-title">{selectedPost.title}</div>
                    <div className="selected-meta">
                      {new Date(selectedPost.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="selected-body">
                    <div className="selected-label">Content</div>
                    <BlogPreview markdown={selectedPost.markdown} />
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {view === 'settings' && (
          <section className="settings-section">
            <div className="column settings-column">
              <h2 className="column-title">Settings</h2>
              <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
                <div className="settings-group">
                  <div className="settings-label">요약 언어 (Language)</div>
                  <div className="settings-row">
                    <label className="settings-option">
                      <input
                        type="radio"
                        name="language"
                        value="ko"
                        checked={settings.language === 'ko'}
                        onChange={() =>
                          setSettings((s) => ({ ...s, language: 'ko' }))
                        }
                      />
                      <span>한국어</span>
                    </label>
                    <label className="settings-option">
                      <input
                        type="radio"
                        name="language"
                        value="en"
                        checked={settings.language === 'en'}
                        onChange={() =>
                          setSettings((s) => ({ ...s, language: 'en' }))
                        }
                      />
                      <span>English</span>
                    </label>
                  </div>
                  <p className="settings-help">
                    AI Summary가 생성되는 언어를 선택합니다.
                  </p>
                </div>

                <div className="settings-group">
                  <div className="settings-label">요약 톤 (Tone)</div>
                  <div className="settings-row">
                    <label className="settings-option">
                      <input
                        type="radio"
                        name="tone"
                        value="blog"
                        checked={settings.tone === 'blog'}
                        onChange={() =>
                          setSettings((s) => ({ ...s, tone: 'blog' }))
                        }
                      />
                      <span>Blog (자유로운 블로그 스타일)</span>
                    </label>
                    <label className="settings-option">
                      <input
                        type="radio"
                        name="tone"
                        value="concise"
                        checked={settings.tone === 'concise'}
                        onChange={() =>
                          setSettings((s) => ({ ...s, tone: 'concise' }))
                        }
                      />
                      <span>Concise (간결한 요약)</span>
                    </label>
                  </div>
                  <p className="settings-help">
                    블로그 글 느낌의 자유로운 요약 또는 간결한 요약 중 선택할 수
                    있습니다.
                  </p>
                </div>

                <div className="settings-group">
                  <div className="settings-label">기본 조회 기간</div>
                  <select
                    className="repo-since"
                    value={settings.defaultSinceDays}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        defaultSinceDays: Number(e.target.value),
                      }))
                    }
                  >
                    <option value={14}>최근 14일</option>
                    <option value={30}>최근 30일</option>
                    <option value={90}>최근 90일</option>
                    <option value={180}>최근 180일</option>
                    <option value={365}>최근 1년</option>
                    <option value={0}>전체</option>
                  </select>
                  <p className="settings-help">
                    새로 검색할 때 기본으로 선택되는 기간입니다. Repo 입력창 오른쪽
                    드롭다운과 연동됩니다.
                  </p>
                </div>
              </form>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

