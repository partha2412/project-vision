import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from './pages/Landing';
import SignupPage from './pages/SignupPage';
import Login from './pages/Login';
import LowerNavbar from './pages/LowerNavbar';
import { WishlistProvider } from './pages/WishlistContext.jsx';
import App from "./App.jsx"
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WishlistProvider>
      <App />
    </WishlistProvider>
  </StrictMode>
  
)
