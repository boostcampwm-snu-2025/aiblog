import { useNavigate } from 'react-router-dom';
import SavedBlogsList from '../components/SavedBlogsList';
import { useBlogStorage } from '../hooks/useBlogStorage';
import './SavedBlogs.css';

function SavedBlogs() {
  const navigate = useNavigate();
  const { savedBlogs, deleteBlog, isLoading } = useBlogStorage();

  return (
    <div className="saved-blogs-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← 홈으로
        </button>
        <h1>💾 저장된 블로그</h1>
      </div>

      <SavedBlogsList
        savedBlogs={savedBlogs}
        deleteBlog={deleteBlog}
        isLoading={isLoading}
      />
    </div>
  );
}

export default SavedBlogs;
