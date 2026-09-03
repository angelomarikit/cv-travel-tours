import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { SiteProvider } from '@/contexts/SiteContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { ContentProvider } from '@/contexts/ContentContext'
import { ToastProvider } from '@/contexts/ToastContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SiteProvider>
        <AuthProvider>
          <ContentProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </ContentProvider>
        </AuthProvider>
      </SiteProvider>
    </BrowserRouter>
  </StrictMode>,
)
