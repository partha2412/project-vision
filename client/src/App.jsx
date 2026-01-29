import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import NavBar from './common/NavBar'
import Checkout from './pages/Checkout'
import VTO from './pages/VTO'
import Footer from './common/Footer'
import ProductsPage from './pages/ProductsPage'
import Login from './pages/Login'
import SignupPage from './pages/SignupPage'
import WishlistPage from './pages/WishlistPage'
import ProfileSettings from './pages/ProfileSettings'
import ProtectedRoute from './context/ProtectedRoute'
import CartPage from './pages/CartPage'
import AllProducts from "./pages/AllProduct"
import ProductDetail from "./pages/ProductDetails"
import Men from "./pages/Men"
import Women from "./pages/Women"
import Kids from "./pages/Kids"
import AdminDashboard from './pages/AdminDashboard';



const App = () => {
  return (
    <div className='relative w-screen h-screen'>
      <BrowserRouter>
        <> {/* ✅ Wrap everything needing wishlist */}
          <NavBar />
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignupPage />} />
            <Route path='/products/:type' element={<ProductsPage />} />
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
            <Route path="/men" element={<Men />} />
            <Route path="/women" element={<Women />} />
            <Route path="/kids" element={<Kids />} />
            {/* <Route path="/review" element={<ReviewPage />} /> */}
          </Routes>
        </>
      </BrowserRouter>
      <Footer />
    </div>
  )
}

export default App
