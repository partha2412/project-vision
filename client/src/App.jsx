import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import NavBar from './common/NavBar'
import Checkout from './pages/Checkout'
import VTO from './pages/VTO'
import Footer from './common/Footer'
import Login from './pages/Login'
import SignupPage from './pages/SignupPage'
import WishlistPage from './pages/WishlistPage'
import ProfileSettings from './pages/ProfileSettings'
import ProtectedRoute from './context/ProtectedRoute'
import CartPage from './pages/CartPage'
import AllProducts from "./pages/AllProduct"
import ProductDetail from "./pages/ProductDetails"

import AdminDashboard from './pages/AdminDashboard';
import { ToastContainer } from "react-toastify"
import NotFound from './common/NotFound'


import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ChatWidget from './common/ChatWidget'

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}


const App = () => {
  return (
      <BrowserRouter>        
          <ScrollToTop />
          <NavBar />
          <ToastContainer position="top-right" autoClose={1500} />
          <Routes>
            
            <Route path='/' element={<Landing />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignupPage />} />
            <Route path='/wishlist' element={<WishlistPage />} />
            <Route path='/cart' element={<CartPage />} />

            {/* Protected routes */}
            <Route
              path="/userdashboard"
              element={
                <ProtectedRoute>
                  <ProfileSettings />
                </ProtectedRoute>
              }
            />

            <Route path='/checkout' element={<Checkout />} />
            <Route path='/vto' element={<VTO />} />
            <Route
              path="/admindashboard"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="/products" element={<AllProducts />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
          <ChatWidget />
        <Footer />
      </BrowserRouter>
  )
}

export default App
