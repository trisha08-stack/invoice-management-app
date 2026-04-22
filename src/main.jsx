import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './ThemeContext'
import { InvoiceProvider } from './InvoiceContext'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <InvoiceProvider>
        <App />
      </InvoiceProvider>
    </ThemeProvider>
  </StrictMode>
)