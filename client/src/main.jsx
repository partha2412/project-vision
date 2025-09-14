import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'

createRoot(document.getElementById('root')).render(
  <WishlistProvider>
    <StrictMode>
      
          <App />
      
    </StrictMode>
  </WishlistProvider>,
)
