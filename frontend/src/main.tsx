import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppProvider } from './contexts/Appcontext.tsx'
import { RepoProvider } from './contexts/Repocontext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <RepoProvider>
        <App />
      </RepoProvider>
    </AppProvider>
  </StrictMode>,
)
