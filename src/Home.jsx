import React from "react";
import { useNavigate } from "react-router-dom";
import About from "./About";
import Contact from "./Contact";

function Home() {
  const nav = useNavigate();

  return (
    <div className="bg-light">
      {/* ─── Hero Section (DARK GREY THEME TO MATCH NAVBAR) ─── */}
      {/* Removed the brown gradient and replaced it with Bootstrap's bg-dark */}
      <div
        className="bg-dark text-white text-center position-relative overflow-hidden d-flex align-items-center"
        style={{ minHeight: "70vh" }}
      >
        <div className="container position-relative z-1 py-5">
          <span
            className="badge rounded-pill py-2 px-4 mb-4 text-uppercase fw-normal"
            style={{ letterSpacing: "0.15em", color: "#d4a843", border: "1px solid #d4a843" }}
          >
            Premium Pet Lifestyle
          </span>

          <h1
            className="display-4 fw-bold mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Your Pet Deserves <span style={{ color: "#d4a843" }}>Pure Luxury</span>
          </h1>

          <p className="lead mx-auto mb-5 text-secondary" style={{ maxWidth: "600px" }}>
            Handcrafted collections for the most cherished members of your family
            — because they deserve nothing less.
          </p>

          <button
            onClick={() => nav("/products")}
            className="btn rounded-pill px-5 py-3 fw-bold text-uppercase shadow-sm"
            style={{
              letterSpacing: "0.08em",
              backgroundColor: "#d4a843",
              color: "#1a1208",
              border: "none",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => (e.target.style.background = "#e8bf61")}
            onMouseLeave={(e) => (e.target.style.background = "#d4a843")}
          >
            Shop Products <i className="bi bi-arrow-right ms-2"></i>
          </button>
        </div>
      </div>

      {/* ─── Trust Bar ─── */}
      <div className="bg-white border-bottom py-4 shadow-sm">
        <div className="container">
          <div className="row g-4 text-center justify-content-center">
            {[
              { label: "100% Safe", sub: "Pet-safe materials" },
              { label: "Premium Quality", sub: "Handcrafted with love" },
              { label: "Fast Delivery", sub: "Pan-India shipping" },
              { label: "Easy Returns", sub: "7-day hassle-free" },
            ].map((item) => (
              <div key={item.label} className="col-6 col-md-3">
                <strong
                  className="d-block small text-uppercase fw-bold mb-1"
                  style={{ letterSpacing: "0.08em", color: "#b8860b" }}
                >
                  {item.label}
                </strong>
                <span className="text-muted small">{item.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Content Sections ─── */}
      <div className="container py-5">
        <div className="mb-5">
          <About />
        </div>

        <hr className="text-muted my-5 opacity-25" />

        <div>
          <Contact />
        </div>
      </div>
    </div>
  );
}

export default Home;