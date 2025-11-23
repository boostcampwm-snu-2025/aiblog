import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import SavedBlogs from './pages/SavedBlogs';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<SavedBlogs />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;



