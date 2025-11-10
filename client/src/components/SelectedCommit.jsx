import { useState } from 'react';
import { savePost } from '../api.js';

export default function SelectedCommit({ commit, summary }) {
  const [saving, setSaving] = useState(false);
  if (!commit) return <div className="card"><em>좌측에서 커밋을 선택하세요.</em></div>;

  const title = commit.messageHeadline;

  async function onSave() {
    setSaving(true);
    await savePost({
      title,
      body: summary || '(요약 없음)',
      sourceUrl: commit.url,
      tags: ['commit']
    });
    setSaving(false);
    alert('Saved!');
  }

  return (
    <div className="card">
      <h3 style={{marginTop:0}}>{title}</h3>
      <div className="badge">{commit.author?.user?.login || commit.author?.name} • {new Date(commit.committedDate).toLocaleDateString()}</div>
      <h4>AI Summary</h4>
      <textarea defaultValue={summary || ''} readOnly />
      <div style={{marginTop:12}}>
        <button className="btn" onClick={onSave} disabled={saving || !summary}>
          {saving ? 'Saving...' : 'Save as Blog Post'}
        </button>
      </div>
    </div>
  );
}
