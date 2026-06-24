import React, { useReducer, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom"; // 1. Added useOutletContext
import axios from "axios";
import toast from 'react-hot-toast';

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case "SET_WISHLIST":
      return { wishlistItems: action.payload };

    case "REMOVE_ITEM":
      return {
        wishlistItems: state.wishlistItems.filter(
          (item) => item.id !== action.payload && item._id !== action.payload
        ),
      };

    default:
      return state;
  }
};

function Wishlist() {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(wishlistReducer, { wishlistItems: [] });
  const wishlistItems = state.wishlistItems;
  
  const [user] = useOutletContext(); // 2. Grab the logged in user!

  useEffect(() => {
    // 3. UPDATED: Only fetch if user is logged in, and ONLY fetch their specific items!
    if (user && user.email) {
      axios.get(`http://localhost:3000/wishlist?userEmail=${user.email}`)
        .then((res) => {
          dispatch({ type: "SET_WISHLIST", payload: res.data });
        })
        .catch((err) => console.error("Error fetching wishlist:", err));
    }
  }, [user]);

  const removeItem = (id) => {
    axios.delete(`http://localhost:3000/wishlist/${id}`)
      .then(() => {
        dispatch({ type: "REMOVE_ITEM", payload: id });
      })
      .catch((err) => {
        console.error("Error deleting item:", err);
        toast.error("Failed to remove item from wishlist database.");
      });
  };

  const addToCart = (item) => {
    // 4. UPDATED: Make sure it keeps the userEmail when it moves from Wishlist to Cart!
    const cartItem = { ...item, quantity: 1, userEmail: user.email };
    
    axios.post("http://localhost:3000/cart", cartItem)
      .then(() => {
        toast.success("Item added to cart!");
        removeItem(item._id || item.id);
      })
      .catch((err) => console.error("Error adding to cart:", err));
  };

  return (
    <div className="bg-light pb-5" style={{ minHeight: "90vh" }}>
      <div className="bg-dark text-white text-center py-5">
        <p className="text-warning text-uppercase small fw-bold mb-1">My Curated Collection</p>
        <h1 className="fw-bold">Your Wishlist</h1>
        <p className="text-secondary mb-0">Selected treasures reserved for your cherished companion</p>
      </div>

      <div className="container mt-5">
        {wishlistItems.length === 0 ? (
          <div className="text-center bg-white p-5 rounded shadow-sm mx-auto" style={{ maxWidth: "600px" }}>
            <div className="mb-4 text-warning" style={{ fontSize: "5rem" }}>
              <i className="bi bi-heart"></i>
            </div>
            <h3 className="fw-bold text-dark">Your wishlist is empty</h3>
            <p className="text-muted mb-4">Discover premium collections handpicked for comfort and luxury.</p>
            <button
              className="btn btn-warning rounded-pill px-4 py-2 fw-bold"
              onClick={() => navigate("/products")}
            >
              Explore Products
            </button>
          </div>
        ) : (
          <div className="row g-4 justify-content-center">
            {wishlistItems.map((item) => (
              <div key={item._id || item.id} className="col-12 col-md-6 col-lg-5">
                <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden product-card">
                  <div className="d-flex h-100">
                    
                    <div className="bg-light d-flex align-items-center justify-content-center overflow-hidden" style={{ width: "120px", minWidth: "120px" }}>
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-100 h-100" 
                          style={{ objectFit: "cover" }} 
                        />
                      ) : (
                        <span style={{ fontSize: "48px" }}>{item.emoji}</span>
                      )}
                    </div>

                    <div className="card-body d-flex flex-column p-4">
                      <span className="text-warning small fw-bold text-uppercase mb-1">
                        {item.category}
                      </span>
                      <h4 className="card-title fs-6 fw-bold mb-2">{item.name}</h4>
                      <p className="card-text text-muted small mb-3">{item.desc}</p>
                      
                      <div className="mt-auto d-flex justify-content-between align-items-center mb-3">
                        <span className="fw-bold fs-5 text-dark">₹{item.price}</span>
                        <button
                          onClick={() => removeItem(item._id || item.id)}
                          className="btn btn-sm text-danger border-0 p-0"
                        >
                          <i className="bi bi-trash3-fill me-1"></i> Remove
                        </button>
                      </div>
                      
                      <button
                        onClick={() => addToCart(item)}
                        className="btn btn-dark w-100 rounded-pill fw-bold small py-2"
                      >
                        Add To Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;