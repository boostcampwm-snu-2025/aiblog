import { useState } from 'react';

export default function SelectedCommit({ commit, summary, onSave }) {
  const [saving, setSaving] = useState(false);

  if (!commit) {
    return (
      <div className="card">
        <em>좌측에서 커밋을 선택하세요.</em>
      </div>
    );
  }

  const title = commit.messageHeadline || '(no title)';
  const author =
    commit.author?.user?.login || commit.author?.name || 'unknown';
  const canSave = Boolean(summary);

  async function handleSave() {
    if (!onSave || !canSave || saving) return;
    try {
      setSaving(true);
      await onSave(); // ← 부모(App)의 저장 로직: PostsContext.add + 서버 savePost
      // 성공 시 알림은 부모에서 하거나 여기서 간단히:
      // alert('Saved!');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <div className="badge">
        {author} • {new Date(commit.committedDate).toLocaleDateString()}
      </div>

      <h4>AI Summary</h4>
      <textarea readOnly defaultValue={summary || ''} />

      <div style={{ marginTop: 12 }}>
        <button
          className="btn"
          onClick={handleSave}
          disabled={!canSave || saving}
        >
          {saving ? 'Saving...' : 'Save as Blog Post'}
        </button>
      </div>
    </div>
  );
}
