import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Form from './Form'
import Login from './Login'
import Home from './Home'
import Products from './Products'
import Layout from './Layout'
import Wishlist from './Wishlist'
import Cart from './Cart'
import About from './About'
import Contact from './Contact'
import Buynow from './Buynow'
import Order from './Order'
import Cancel from './Cancel'
import { Toaster } from 'react-hot-toast';

function App() {
  // Shared user state initialized from localStorage to persist session
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("pawluxe_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  return (
    <>
      <Toaster position="bottom-right" />
      <Routes>
        <Route element={<Layout context={{ user, setUser }} />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/form" element={<Form />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/products" element={<Products />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/bill/:id" element={<Buynow />} />
          <Route path="/order" element={<Order />} />
          <Route path="/cancel" element={<Cancel />} />
        </Route>
      </Routes>
    </>
  )
}

export default App