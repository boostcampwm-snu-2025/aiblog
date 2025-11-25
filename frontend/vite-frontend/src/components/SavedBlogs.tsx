import { useEffect, useState } from 'react';
import axios from 'axios';

type Blog = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

export default function SavedBlogs({ onBack }: { onBack: () => void }) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Blog | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const resp = await axios.get<Blog[]>('http://localhost:3000/blogs');
        setBlogs(resp.data || []);
        setLoading(false);
      } catch (e) {
        setError('Failed to load saved blogs');
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div>Loading saved blogs...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div style={{ padding: 12 }}>
      <button onClick={onBack}>← Back</button>
      <h2>Saved Blogs</h2>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          {blogs.length === 0 && <div>No saved blogs yet.</div>}
          <ul>
            {blogs.map(b => (
              <li key={b.id} style={{ marginBottom: 8 }}>
                <button onClick={() => setSelected(b)} style={{ textAlign: 'left' }}>{b.title}</button>
                <div style={{ fontSize: 12, color: '#666' }}>{new Date(b.created_at).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 2, borderLeft: '1px solid #ddd', paddingLeft: 12 }}>
          {selected ? (
            <div>
              <h3>{selected.title}</h3>
              <div style={{ whiteSpace: 'pre-wrap' }}>{selected.content}</div>
            </div>
          ) : (
            <div>Select a saved blog to preview</div>
          )}
        </div>
      </div>
    </div>
  );
}
