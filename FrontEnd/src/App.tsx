import './App.css'
import { useState } from 'react'
import MainPage from './pages/mainPage'
import PostPage from './pages/postPage'

function App() {
  const [currentPage, setCurrentPage] = useState<'main' | 'posts'>('main')

  return (
    <>
      {currentPage === 'main' ? (
        <MainPage onNavigateToPosts={() => setCurrentPage('posts')} />
      ) : (
        <PostPage onNavigateToMain={() => setCurrentPage('main')} />
      )}
    </>
  )
}

export default App
