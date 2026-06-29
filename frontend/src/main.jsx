import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

const toastOptions = {
  duration: 4000,
  style: {
    background: '#1A1A1A',
    color: '#F5F5F5',
    border: '1px solid rgba(212, 175, 55, 0.25)',
    fontSize: '13px',
    fontWeight: 600,
  },
  success: { iconTheme: { primary: '#D4AF37', secondary: '#1A1A1A' } },
  error: { iconTheme: { primary: '#f87171', secondary: '#1A1A1A' } },
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster position="top-right" toastOptions={toastOptions} />
  </StrictMode>,
)
