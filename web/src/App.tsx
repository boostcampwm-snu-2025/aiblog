// web/src/App.tsx
import { useEffect, useState } from 'react';
import { RepoForm } from './components/RepoForm';
import { ActivityList } from './components/ActivityList';
import { Loader } from './components/Loader';
import { ErrorBanner } from './components/ErrorBanner';
import { BlogPreview } from './components/BlogPreview';
import { SavedPostList } from './components/SavedPostList';
import {
  createPost,
  deletePost,
  fetchRecent,
  listPosts,
  summarizeActivities,
} from './api';
import type { Activity } from './types';
import type { Post } from './api.types';

export default function App() {
  const [view, setView] = useState<'activities' | 'saved'>('activities');

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

  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState<string | undefined>();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    if (view === 'saved') {
      void loadPosts();
    }
  }, [view]);

  async function loadPosts() {
    setPostsError(undefined);
    setPostsLoading(true);
    try {
      const data = await listPosts();
      setPosts(data);
      if (data.length > 0) {
        setSelectedPost((prev) => prev ?? data[0]);
      } else {
        setSelectedPost(null);
      }
    } catch (e: any) {
      setPostsError(e?.message ?? '포스트 목록을 불러오지 못했습니다.');
    } finally {
      setPostsLoading(false);
    }
  }

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
      const created = await createPost(title, summary, ['github', selected.type]);
      setPosts((prev) => [created, ...prev]);
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
          <button type="button" className="nav-btn" disabled>
            Settings
          </button>
        </nav>
      </header>

      <main className="app-main">
        {view === 'activities' && (
          <>
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
                  onClick={() => loadPosts()}
                  disabled={postsLoading}
                >
                  새로고침
                </button>
              </div>
              {postsLoading && <Loader />}
              {postsError && <ErrorBanner msg={postsError} />}
              {!postsLoading && !postsError && (
                <SavedPostList
                  posts={posts}
                  selectedId={selectedPost?.id}
                  onSelect={(post) => setSelectedPost(post)}
                  onDelete={async (post) => {
                    if (!window.confirm('이 포스트를 삭제할까요?')) return;
                    try {
                      await deletePost(post.id);
                      setPosts((prev) =>
                        prev.filter((p) => p.id !== post.id),
                      );
                      setSelectedPost((prev) =>
                        prev && prev.id === post.id ? null : prev,
                      );
                    } catch (e: any) {
                      setPostsError(
                        e?.message ?? '포스트 삭제 중 오류가 발생했습니다.',
                      );
                    }
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
                      {new Date(
                        selectedPost.createdAt,
                      ).toLocaleDateString()}
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
      </main>
    </div>
  );
}

