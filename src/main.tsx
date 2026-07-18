import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'
import { StaffAuthProvider } from './context/StaffAuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { SseProvider } from './context/SseProvider'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <StaffAuthProvider>
              <SseProvider>
                <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
                <App />
              </SseProvider>
            </StaffAuthProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
)
