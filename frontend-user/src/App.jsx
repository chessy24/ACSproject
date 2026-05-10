import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import GcashPayment from "./pages/GcashPayment";

const backendUrl = "https://acsproject-lfwx.onrender.com";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/gcash-payment/:orderId" element={<GcashPayment />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {

  useEffect(() => {

    const keepAlive = () => {
      fetch(`${backendUrl}/health`).catch(() => {});
    };

    // ping immediately
    keepAlive();

    // ping every 4 minutes
    const interval = setInterval(keepAlive, 240000);

    return () => clearInterval(interval);

  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;