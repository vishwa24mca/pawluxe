import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

// Catch the context object coming directly from App.jsx
function Layout({ context }) {
  const { user, setUser } = context; // Destructure the variables here

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Hand data down to the navbar component */}
      <Navbar user={user} setUser={setUser} />

      <main style={{ flex: "1 0 auto" }}>
        {/* Forward it down into the pipe so Cart.jsx can pick it up with useOutletContext() */}
        <Outlet context={[user, setUser]} />
      </main>

      {/* ─── Footer (Updated to Dark Grey Theme) ─── */}
      <footer className="bg-dark text-center py-4 mt-auto" style={{ fontSize: "13px" }}>
        <div className="container">
          <p className="text-white fw-bold mb-2">✦ PawLuxe Luxury Pet Care</p>
          <p className="text-secondary mb-0">
            © {new Date().getFullYear()} PawLuxe. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;