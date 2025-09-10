import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Products from './pages/Products'
import SingleProduct from './pages/SingleProduct'
import Products2 from './pages/Products2'
import Test from './pages/Test'
import Landing from './pages/Landing'
import NavBar from './common/NavBar'
import Checkout from './pages/Checkout'
import VTO from './pages/VTO'
import CalibrationTool from './pages/CalibrationTool'
import Footer from './common/Footer'
import ProductsPage from './pages/ProductsPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Airflex from './pages/Airflex'
import WishlistPage from './pages/WishlistPage'
//import Navbar2 from './common/Navbar2'

const App = () => {
  return (
    <div>

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



          <Route path='/pro' element={<SingleProduct />} />
          <Route path='/test' element={<Test />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/vto' element={<VTO />} />
          <Route path='/cal' element={<CalibrationTool />} />
          <Route path='/airflex' element={<Airflex/>} />
          
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  )
}

export default App
