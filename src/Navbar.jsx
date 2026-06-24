import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import pawLuxeLogo from "./assets/logo.svg"; 
import toast from 'react-hot-toast';

function Navbar({ user, setUser }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMenu = () => setMobileOpen(false);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("pawluxe_user");
    
    setUser(null); 
    toast.success("Logged out successfully!");
    closeMenu();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
      <div className="container">

        {/* BRAND / LOGO */}
        <Link className="navbar-brand d-flex align-items-center" to="/" onClick={closeMenu}>
          <img src={pawLuxeLogo} alt="PawLuxe Logo" height="40" />
        </Link>

        {/* MOBILE TOGGLE BUTTON */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* NAVBAR LINKS */}
        <div className={`collapse navbar-collapse justify-content-end ${mobileOpen ? "show" : ""}`}>
          <div className="navbar-nav align-items-center gap-2">

            <div className="nav-item">
              <NavLink className="nav-link" to="/" onClick={closeMenu}>Home</NavLink>
            </div>

            <div className="nav-item">
              <NavLink className="nav-link" to="/about" onClick={closeMenu}>About</NavLink>
            </div>

            <div className="nav-item">
              <NavLink className="nav-link" to="/contact" onClick={closeMenu}>Contact</NavLink>
            </div>

            <div className="nav-item">
              <NavLink className="nav-link" to="/products" onClick={closeMenu}>Products</NavLink>
            </div>

            {/* --- NEW LINKS ADDED HERE --- */}
            <div className="nav-item">
              <NavLink className="nav-link" to="/order" onClick={closeMenu}>Orders</NavLink>
            </div>

            <div className="nav-item">
              <NavLink className="nav-link" to="/cancel" onClick={closeMenu}>Cancel Order</NavLink>
            </div>
            {/* ---------------------------- */}

            <div className="nav-item">
              <NavLink className="nav-link d-flex align-items-center" to="/wishlist" onClick={closeMenu}>
                <i className="bi bi-heart me-1"></i> Wishlist
              </NavLink>
            </div>

            <div className="nav-item">
              <NavLink className="nav-link d-flex align-items-center" to="/cart" onClick={closeMenu}>
                <i className="bi bi-cart3 me-1"></i> Cart
              </NavLink>
            </div>

            {/* Vertical Divider */}
            <div className="d-none d-lg-block border-end mx-2" style={{ height: "20px" }}></div>

            {/* DYNAMIC AUTHENTICATION SECTION */}
            <div className="nav-item mt-2 mt-lg-0 text-center">
              {user ? (
                <div className="d-flex flex-column align-items-center">
                  <Link className="btn btn-outline-danger rounded-pill px-3 btn-sm mb-1" to="/login" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-1"></i> Logout
                  </Link>
                  
                  <div className="text-secondary" style={{ fontSize: "11px", lineHeight: "1.3" }}>
                    <span className="text-warning d-block font-monospace fw-bold">{user.name}</span>
                    <span>{user.email}</span>
                  </div>
                </div>
              ) : (
                <NavLink className="btn btn-outline-warning rounded-pill px-3 btn-sm" to="/login" onClick={closeMenu}>
                  <i className="bi bi-person-fill me-1"></i> Login
                </NavLink>
              )}
            </div>

          </div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;