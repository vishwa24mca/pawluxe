import React, { useReducer, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom"; 
import axios from "axios";
import Bill from "./Bill";
import toast from 'react-hot-toast';

const DELIVERY_FEE = 250; 

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":     return { cartItems: action.payload };
    case "REMOVE_ITEM":  return { cartItems: state.cartItems.filter(i => i.id !== action.id && i._id !== action.id) };
    case "UPDATE_QTY":
      return {
        cartItems: state.cartItems.map(i => (i.id === action.id || i._id === action.id) ? { ...i, quantity: action.qty } : i)
      };
    default: return state;
  }
};

function Cart() { 
  const navigate = useNavigate();
  const [showBill, setShowBill] = useState(false);
  const [{ cartItems }, dispatch] = useReducer(cartReducer, { cartItems: [] });

  const [user] = useOutletContext(); 

  useEffect(() => {
    // 1. UPDATED: Only fetch if user is logged in, and ONLY fetch their specific items!
    if (user && user.email) {
      axios.get(`http://localhost:3000/cart?userEmail=${user.email}`)
        .then(res => dispatch({ type: "SET_CART", payload: res.data.map(i => ({ ...i, quantity: i.quantity || 1 })) }))
        .catch(err => console.error("Fetch error:", err));
    }
  }, [user]); // Add user dependency so it updates if they log out/log in

  const updateQtyInDb = (id, newQty) => {
    dispatch({ type: "UPDATE_QTY", id, qty: newQty });
    axios.patch(`http://localhost:3000/cart/${id}`, { quantity: newQty }).catch(err => console.error("DB Update error:", err));
  };

  const changeQuantity = (id, delta) => {
    const item = cartItems.find(i => i.id === id || i._id === id);
    const calculatedQty = item.quantity + delta;
    updateQtyInDb(id, calculatedQty > 0 ? calculatedQty : 1);
  };

  const removeItem = (id) => {
    axios.delete(`http://localhost:3000/cart/${id}`)
      .then(() => dispatch({ type: "REMOVE_ITEM", id }))
      .catch(() => toast.error("Failed to delete item."));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + DELIVERY_FEE; 

  return (
    <div className="bg-light pb-5" style={{ minHeight: "90vh" }}>
      <div className="bg-dark text-white text-center py-5">
        <p className="text-warning text-uppercase small fw-bold mb-1">Shopping Experience</p>
        <h1 className="fw-bold">{showBill ? "Checkout Summary" : "Your Shopping Cart"}</h1>
      </div>

      {showBill ? (
        <Bill 
          cartItems={cartItems} 
          subtotal={subtotal} 
          deliveryFee={DELIVERY_FEE} 
          total={total} 
          onBackToCart={() => setShowBill(false)} 
          user={user} 
        />
      ) : (
        <div className="container mt-5">
          {cartItems.length === 0 ? (
            <div className="text-center bg-white p-5 rounded shadow-sm mx-auto" style={{ maxWidth: "600px" }}>
              <div className="mb-4 text-warning" style={{ fontSize: "5rem" }}><i className="bi bi-cart3"></i></div>
              <h3 className="fw-bold text-dark">Your cart is empty</h3>
              <button className="btn btn-warning rounded-pill px-4 py-2 mt-3 fw-bold" onClick={() => navigate("/products")}>Continue Shopping</button>
            </div>
          ) : (
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="bg-white rounded p-4 shadow-sm">
                  <h3 className="fs-5 fw-bold mb-4 pb-2 border-bottom">Items List</h3>
                  {cartItems.map((item) => {
                    const itemId = item._id || item.id;
                    return (
                      <div key={itemId} className="card shadow-sm border-0 rounded-4 mb-3">
                        <div className="card-body d-flex align-items-center gap-3 p-3">
                          
                          <div className="bg-light rounded overflow-hidden d-flex align-items-center justify-content-center" style={{ width: "90px", height: "90px", minWidth: "90px" }}>
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-100 h-100" style={{ objectFit: "cover" }} />
                            ) : (
                              <span style={{ fontSize: "36px" }}>{item.emoji}</span>
                            )}
                          </div>

                          <div className="flex-grow-1">
                            <span className="text-warning text-uppercase fw-bold dependency-label" style={{ fontSize: "10px", display: "block" }}>
                              {item.category}
                            </span>
                            <h4 className="m-0 fs-6 fw-bold text-dark">{item.name}</h4>
                            <p className="text-muted small my-1 line-clamp-2" style={{ fontSize: "12px", lineHeight: "1.4" }}>
                              {item.desc}
                            </p>
                            <div className="text-secondary small fw-semibold">₹{item.price} each</div>
                          </div>

                          <div className="d-flex align-items-center gap-2">
                            <button onClick={() => changeQuantity(itemId, -1)} className="btn btn-sm btn-outline-secondary rounded-circle">-</button>
                            <span className="fw-bold px-2">{item.quantity}</span>
                            <button onClick={() => changeQuantity(itemId, 1)} className="btn btn-sm btn-outline-secondary rounded-circle">+</button>
                          </div>

                          <div className="text-end" style={{ minWidth: "110px" }}>
                            <div className="fw-bold text-dark">₹{item.price * item.quantity}</div>
                            <button onClick={() => removeItem(itemId)} className="btn btn-link text-danger p-0 mt-1 text-decoration-none small">Remove</button>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="col-lg-4">
                <div className="bg-white rounded p-4 shadow-sm">
                  <h3 className="fs-5 fw-bold mb-4 pb-2 border-bottom">Order Summary</h3>
                  <div className="d-flex justify-content-between mb-3"><span className="text-secondary">Subtotal</span><span className="fw-semibold">₹{subtotal}</span></div>
                  <div className="d-flex justify-content-between mb-3"><span className="text-secondary">Delivery</span><span className="fw-semibold text-success">₹{DELIVERY_FEE}</span></div>
                  <hr className="my-4" />
                  <div className="d-flex justify-content-between align-items-center mb-4"><span className="fs-6 fw-bold">Total</span><span className="fs-4 fw-bold text-warning">₹{total}</span></div>
                  <button onClick={() => setShowBill(true)} className="btn btn-dark w-100 rounded-pill py-2 fw-bold mb-3">Checkout</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Cart;