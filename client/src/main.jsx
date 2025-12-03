import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { PostsProvider } from './components/PostsContext.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PostsProvider>
      <App />
    </PostsProvider>
  </React.StrictMode>
);
