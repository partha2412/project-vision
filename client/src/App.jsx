import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import NavBar from './common/NavBar'
import Checkout from './pages/Checkout'
import VTO from './pages/VTO'
import Footer from './common/Footer'
import ProductsPage from './pages/ProductsPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import WishlistPage from './pages/WishlistPage'
import ProfileSettings from './pages/ProfileSettings'
import SignupPage from './pages/SignupPage'
import Admin from './pages/Admin'
import Pending from './pages/Pending'
import Notifications from './pages/Notifications'
import Analytics from './pages/Analytics'
import AdminDashboard from './pages/AdminDashboard'
import AdminSettings from './pages/AdminSettings'
import CartPage from './pages/CartPage'
import AllProducts from "./pages/AllProduct";
import ProductDetail from "./pages/ProductDetails";
import Men from "./pages/Men";
import Women from "./pages/Women";
import Kids from "./pages/Kids";

const App = () => {
  return (
    <div className='relative h-screen'>

      {/* <Navbar2/> */}
      <BrowserRouter>
        <NavBar />
        <Routes>
          {/* <Route path='/' element={<Landing/>} /> */}
          <Route path='/' element={<Landing />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/products/:type' element={<ProductsPage />} />
          <Route path='/wishlist' element={<WishlistPage />} />
          <Route path='/cart' element={<CartPage />} />

          <Route path='/userdashboard' element={<ProfileSettings />} />

          <Route path='/checkout' element={<Checkout />} />
          <Route path='/vto' element={<VTO />} />
          {/* <Route path='/admin' element={<Admin />} />
          <Route path='/p' element={<Pending />} />
          <Route path='/notification' element={<Notifications />} />
          <Route path='/ana' element={<Analytics />} /> */}
          <Route path='/admindashboard' element={<AdminDashboard />} />
          {/* <Route path='/ad' element={<AdminSettings />} /> */}
          <Route path="/products" element={<AllProducts />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/men" element={<Men />} />
          <Route path="/women" element={<Women />} />
          <Route path="/kids" element={<Kids />} />





        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  )
}

export default App
