import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppProvider } from './contexts/Appcontext.tsx'
import { RepoProvider } from './contexts/Repocontext.tsx'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <RepoProvider>
          <App />
        </RepoProvider>
      </AppProvider>
    </QueryClientProvider>
  </StrictMode>,
)
