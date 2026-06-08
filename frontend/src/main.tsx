import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ModalProvider } from './context/ModalContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ModalProvider>
        <App />
        <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1f2937',
                color: '#f9fafb',
                border: '1px solid rgba(255,255,255,0.05)',
                fontSize: '14px',
              },
              success: {
                iconTheme: {
                  primary: '#9333ea',
                  secondary: '#f9fafb',
                },
              },
            }}
          />
        </ModalProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)