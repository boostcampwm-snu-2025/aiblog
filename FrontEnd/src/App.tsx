import './App.css'
import { useState } from 'react'
import MainPage from './pages/mainPage'
import PostPage from './pages/postPage'
import { RepositoryProvider } from '@/contexts/RepositoryContext'
import { SummaryProvider } from '@/contexts/SummaryContext'

function App() {
  const [currentPage, setCurrentPage] = useState<'main' | 'posts'>('main')

  return (
    <RepositoryProvider>
      <SummaryProvider>
        {currentPage === 'main' ? (
          <MainPage onNavigateToPosts={() => setCurrentPage('posts')} />
        ) : (
          <PostPage onNavigateToMain={() => setCurrentPage('main')} />
        )}
      </SummaryProvider>
    </RepositoryProvider>
  )
}

export default App
