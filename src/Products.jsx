import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';

const categories = ['All', 'Beds', 'Collars', 'Grooming', 'Accessories', 'Toys', 'Treats'];

function Products() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');

  // New state for handling toast notifications
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [wishlistedIds, setWishlistedIds] = useState({});

  const navigate = useNavigate();
  const [user] = useOutletContext();

  useEffect(() => {
    axios.get('http://localhost:3000/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  // Helper function to trigger toast and hide it after 3 seconds
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(product => product.category === activeCategory);

  const addToCart = (product) => {
    if (!user) {
      showToast("Please log in first!", "danger");
      navigate('/login');
      return;
    }

    const cartItem = { ...product, quantity: 1, userEmail: user.email };

    axios.post('http://localhost:3000/cart', cartItem)
      .then(() => showToast(`${product.name} was added to your Cart!`))
      .catch(err => {
        console.error("Error saving to cart:", err);
        showToast("Error adding to cart. Please try again.", "danger");
      });
  };

  const addToWishlist = (product) => {
    if (!user) {
      showToast("Please log in first!", "danger");
      navigate('/login');
      return;
    }

    const productId = product._id || product.id;
    setWishlistedIds(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));

    const wishlistItem = { ...product, userEmail: user.email };

    axios.post('http://localhost:3000/wishlist', wishlistItem)
      .then(() => showToast(`${product.name} was saved to your Wishlist!`))
      .catch(err => {
        console.error("Error saving to wishlist:", err);
        showToast("Error adding to wishlist. Please try again.", "danger");
      });
  };

  const buyNow = (product) => {
    if (!user) {
      showToast("Please log in to purchase instantly!", "warning");
      navigate('/login');
      return;
    }
    const productId = product._id || product.id;
    navigate(`/bill/${productId}`);
  };

  return (
    <div className="bg-light pb-5" style={{ minHeight: '100vh' }}>

      {/* ─── Header Section ─── */}
      <div className="bg-dark text-white text-center py-5 position-relative overflow-hidden">
        <div className="container position-relative z-1">
          <p className="small fw-bold text-uppercase mb-2" style={{ letterSpacing: "0.15em", color: "#d4a843" }}>
            PawLuxe Collections
          </p>
          <h1 className="fw-bold display-5 mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Shop Our Products
          </h1>
          <p className="text-secondary mb-0 mx-auto" style={{ maxWidth: "500px" }}>
            Premium essentials for your beloved pets, crafted for comfort and style.
          </p>
        </div>
      </div>

      <div className="container mt-5">

        {/* ─── Category Filters ─── */}
        <div className="d-flex overflow-auto gap-3 mb-5 pb-2 scrollbar-hide" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className="btn rounded-pill px-4 py-2 fw-bold shadow-sm transition-all"
              style={{
                whiteSpace: 'nowrap',
                backgroundColor: activeCategory === category ? "#d4a843" : "#ffffff",
                color: activeCategory === category ? "#1a1208" : "#495057",
                border: activeCategory === category ? "none" : "1px solid #dee2e6",
                transform: activeCategory === category ? "scale(1.05)" : "scale(1)"
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* ─── Products Grid ─── */}
        <div className="row g-4">
          {filteredProducts.map(product => (
            <div key={product.id || product._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div
                className="card h-100 border-0 rounded-4 shadow-sm position-relative overflow-hidden"
                style={{ transition: 'all 0.3s ease', cursor: 'pointer', backgroundColor: "#fff" }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                }}
              >

                {/* Category Badge over image */}
                <span
                  className="badge position-absolute top-0 start-0 m-3 rounded-pill fw-semibold px-3 py-2 shadow-sm"
                  style={{ backgroundColor: "#1a1208", color: "#d4a843", zIndex: 2, letterSpacing: "0.05em" }}
                >
                  {product.category}
                </span>

                {/* Product Image */}
                <div className="bg-white d-flex align-items-center justify-content-center p-4 mt-4" style={{ height: '200px' }}>
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="img-fluid" style={{ maxHeight: '100%', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ fontSize: '64px' }}>{product.emoji}</span>
                  )}
                </div>

                {/* Card Content */}
                <div className="card-body d-flex flex-column p-4 border-top border-light-subtle">
                  <h5 className="fw-bold mb-2 text-dark text-truncate" title={product.name}>{product.name}</h5>
                  <p className="text-secondary small mb-3 flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.desc}
                  </p>

                  <div className="fw-bold fs-4 text-dark mb-4">
                    ₹{product.price}
                  </div>

                  {/* Action Buttons */}
                  <div className="d-grid gap-2 mt-auto">
                    <button
                      onClick={() => buyNow(product)}
                      className="btn rounded-pill fw-bold py-2 shadow-sm"
                      style={{ backgroundColor: "#d4a843", color: "#1a1208", transition: "background 0.2s" }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e8bf61"}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#d4a843"}
                    >
                      Buy Now
                    </button>

                    <div className="d-flex gap-2">
                      <button
                        onClick={() => addToCart(product)}
                        className="btn btn-dark flex-grow-1 rounded-pill fw-bold small py-2"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => addToWishlist(product)}
                        className={`btn rounded-circle d-flex align-items-center justify-content-center transition-all ${wishlistedIds[product._id || product.id] ? 'btn-danger border-danger' : 'btn-outline-dark'}`}
                        style={{ 
                          width: '42px', 
                          height: '42px', 
                          backgroundColor: wishlistedIds[product._id || product.id] ? "#dc3545" : "transparent",
                          color: wishlistedIds[product._id || product.id] ? "#ffffff" : "#1a1208",
                          borderColor: wishlistedIds[product._id || product.id] ? "#dc3545" : "#e9ecef"
                        }}
                        onMouseOver={(e) => { 
                          if (!wishlistedIds[product._id || product.id]) {
                            e.currentTarget.style.backgroundColor = "#f8f9fa"; 
                            e.currentTarget.style.borderColor = "#d4a843"; 
                            e.currentTarget.style.color = "#d4a843"; 
                          }
                        }}
                        onMouseOut={(e) => { 
                          if (!wishlistedIds[product._id || product.id]) {
                            e.currentTarget.style.backgroundColor = "transparent"; 
                            e.currentTarget.style.borderColor = "#e9ecef"; 
                            e.currentTarget.style.color = "#1a1208"; 
                          }
                        }}
                      >
                        <i className={`bi ${wishlistedIds[product._id || product.id] ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Toast Notification UI ─── */}
      {toast.show && (
        <div
          className={`toast show position-fixed bottom-0 end-0 m-4 align-items-center text-white bg-${toast.type} border-0 shadow-lg`}
          role="alert"
          style={{ zIndex: 1050, animation: 'fadeIn 0.3s ease-in-out' }}
        >
          <div className="d-flex">
            <div className="toast-body fw-medium px-4 py-3">
              {toast.message}
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-3 m-auto"
              onClick={() => setToast({ ...toast, show: false })}
            ></button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Products;