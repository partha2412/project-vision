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

const App = () => {
  return (
    <div className='relative'>

      {/* <Navbar2/> */}
      <BrowserRouter>
        <NavBar />
        <Routes>
          {/* <Route path='/' element={<Landing/>} /> */}
          <Route path='/' element={<Landing />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/products/:type' element={<ProductsPage />} />
          <Route path='/wishlist' element={<WishlistPage/>} />

          <Route path='/checkout' element={<Checkout />} />
          <Route path='/vto' element={<VTO />} />
          
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  )
}

export default App
