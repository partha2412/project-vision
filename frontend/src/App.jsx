import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import SignupPage from "./pages/SignupPage";
import Login from "./pages/Login";
import LowerNavbar from "./pages/LowerNavbar";
import WishlistPage from "./pages/WishlistPage";
import Airflex from "./pages/Airflex";
import Checkout from "./pages/Checkout";
import Aviator from "./pages/Aviator";
import SingleProductCheckout from "./pages/SingleProductCheckout";
import BuyonegetOne from "./pages/BuyonegetOne";
import Navbar from "./pages/Navbar";


function App() {
  return (

    <BrowserRouter>
    <Navbar/>
      <Routes>
        {/* Your existing pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/nav" element={<LowerNavbar />} />

        {/* Wishlist & Products */}
             <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/airflex" element={<Airflex />} />
             <Route path="/aviator" element={<Aviator/>} />
            <Route path="/blend" element={<Aviator/>} />
             <Route path="/cateeye" element={<Aviator/>} />
             <Route path="/clipon" element={<Aviator/>} />
             <Route path="/clubmaster" element={<Aviator/>} />
             <Route path="/image179" element={<Aviator/>} />

             <Route path="/trans" element={<Aviator/>} />

            <Route path="/checkout" element={<Checkout />} />
        <Route path="/single" element={<SingleProductCheckout />} />

        <Route path="/b" element={<BuyonegetOne/>} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
