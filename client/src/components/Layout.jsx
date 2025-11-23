import { useNavigate, useLocation } from 'react-router-dom';
import './Layout.css';

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="app">
      <header className="app-header">
        <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          Smart Blog
        </h1>
        <nav className="app-nav">
          <button
            className={`nav-link ${location.pathname === '/blogs' ? 'active' : ''}`}
            onClick={() => navigate('/blogs')}
          >
            Saved Posts
          </button>
          <button className="nav-link">Settings</button>
        </nav>
      </header>

      <main className="app-main">
        {children}
      </main>
    </div>
  );
}

export default Layout;
