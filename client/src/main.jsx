import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = "1057408294071-7g7nt0maiie6j6t8mfkos5071438fcmk.apps.googleusercontent.com"; // replace with your actual Google client ID

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <CartProvider>
      <WishlistProvider>
        <StrictMode>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <App />
          </GoogleOAuthProvider>
        </StrictMode>
      </WishlistProvider>
    </CartProvider>
  </AuthProvider>
);
