import './Layout.css';

function Layout({ children }) {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Smart Blog</h1>
        <nav className="app-nav">
          <button className="nav-link">Saved Posts</button>
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
