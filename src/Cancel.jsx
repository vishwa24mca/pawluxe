import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, Link } from "react-router-dom";
import axios from "axios";
import Bill from "./Bill"; // 1. Import the Bill component

function Cancel() {
    const [cancelledOrders, setCancelledOrders] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    
    // 2. Add states to handle showing the Bill and remembering which order to checkout
    const [showBill, setShowBill] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    
    const navigate = useNavigate();
    const context = useOutletContext();
    const user = context ? context[0] : null;

    useEffect(() => {
        if (user && user.email) {
            axios.get(`http://localhost:3000/cancelled?userEmail=${user.email}`)
                .then(res => {
                    if (Array.isArray(res.data)) {
                        setCancelledOrders([...res.data].reverse());
                    } else {
                        setCancelledOrders([]);
                    }
                })
                .catch(err => console.error("Error fetching cancelled orders:", err));
        } else {
            setCancelledOrders([]);
        }
    }, [user]);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'success' });
        }, 3000);
    };

    // 3. Instead of logic, just set the order and show the bill
    const handleReorder = (order) => {
        if (!order.items || order.items.length === 0) {
            showToast("No items found to re-order.", "warning");
            return;
        }
        setSelectedOrder(order);
        setShowBill(true);
    };

    if (!user) {
        return (
            <div className="container mt-5 text-center">
                <h3 className="text-muted">Please log in to view cancelled orders.</h3>
                <button className="btn btn-warning mt-3" onClick={() => navigate("/login")}>Go to Login</button>
            </div>
        );
    }

    // 4. Calculate Math for the Bill
    let subtotal = 0;
    if (selectedOrder && selectedOrder.items) {
        subtotal = selectedOrder.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }
    const DELIVERY_FEE = 250;
    const total = subtotal + DELIVERY_FEE;

    // 5. If showBill is true, render ONLY the Bill component
    if (showBill && selectedOrder) {
        return (
            <div className="bg-light pb-5 position-relative" style={{ minHeight: "90vh" }}>
                <div className="bg-dark text-white text-center py-5">
                    <p className="text-warning text-uppercase small fw-bold mb-1">Welcome Back</p>
                    <h1 className="fw-bold">Checkout Summary</h1>
                </div>
                <Bill 
                    cartItems={selectedOrder.items} 
                    subtotal={subtotal} 
                    deliveryFee={DELIVERY_FEE} 
                    total={total} 
                    onBackToCart={() => setShowBill(false)} 
                    user={user}
                    // Pass the ID so the Bill knows which one to delete after payment
                    cancelledOrderId={selectedOrder.id || selectedOrder._id} 
                />
            </div>
        );
    }

    // 6. Otherwise, render the normal Cancel page
    return (
        <div className="bg-light pb-5 position-relative" style={{ minHeight: "90vh" }}>
            <div className="bg-dark text-white text-center py-5">
                <p className="text-warning text-uppercase small fw-bold mb-1">Cancellation History</p>
                <h1 className="fw-bold">Cancelled Orders</h1>
            </div>

            <div className="container mt-5" style={{ maxWidth: "800px" }}>
                {cancelledOrders.length === 0 ? (
                    <div className="text-center bg-white p-5 rounded shadow-sm mx-auto">
                        <div className="mb-4 text-secondary" style={{ fontSize: "4rem" }}><i className="bi bi-x-octagon"></i></div>
                        <h3 className="fw-bold text-dark">No Cancelled Orders</h3>
                        <p className="text-muted">You have a clean track record!</p>
                        <Link to="/products" className="btn btn-warning rounded-pill px-4 py-2 mt-3 fw-bold">Continue Shopping</Link>
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-4">
                        {cancelledOrders.map((order, orderIndex) => {
                            const safeId = order._id || order.id;

                            return (
                                <div key={safeId || orderIndex} className="card shadow-sm border-0 rounded-4 overflow-hidden border-danger">
                                    <div className="card-header bg-white border-bottom p-3 d-flex justify-content-between align-items-center">
                                        <div>
                                            <span className="text-muted small d-block">Order Placed</span>
                                            <strong className="text-dark">{order.date || "Unknown Date"}</strong>
                                        </div>
                                        <div className="text-center">
                                            <span className="text-muted small d-block">Total</span>
                                            <strong className="text-secondary text-decoration-line-through fs-5">₹{order.total || 0}</strong>
                                        </div>
                                        <div className="text-end d-none d-sm-block">
                                            <span className="text-muted small d-block">{user.name}</span>
                                            <strong className="text-dark" style={{ fontSize: "14px" }}>{user.email}</strong>
                                        </div>
                                    </div>

                                    <div className="card-body p-0">
                                        <ul className="list-group list-group-flush">
                                            {order.items?.map((item, itemIndex) => (
                                                <li key={item.productId || itemIndex} className="list-group-item p-3 d-flex align-items-center gap-3 bg-light opacity-75">
                                                    <div className="bg-white rounded d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px" }}>
                                                        {item.image ? (
                                                            <img src={item.image} alt={item.name} className="w-100 h-100 rounded" style={{ objectFit: "cover", filter: "grayscale(100%)" }} />
                                                        ) : (
                                                            <span style={{ fontSize: "28px", filter: "grayscale(100%)" }}>{item.emoji || "📦"}</span>
                                                        )}
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <h6 className="m-0 fw-bold text-muted">{item.name || "Unknown Item"}</h6>
                                                        <small className="text-muted">Qty: {item.quantity || 1}</small>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="card-footer bg-white p-3 d-flex justify-content-between align-items-center border-top-0">
                                        <span className="text-danger fw-bold fs-6 d-flex align-items-center">
                                            <i className="bi bi-x-circle-fill me-2"></i> Cancelled
                                        </span>
                                        <button 
                                            onClick={() => handleReorder(order)}
                                            className="btn rounded-pill fw-bold px-4 py-2 shadow-sm"
                                            style={{ backgroundColor: "#d4a843", color: "#1a1208", transition: "background 0.2s" }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e8bf61"}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#d4a843"}
                                        >
                                            <i className="bi bi-arrow-clockwise me-2"></i> Re-order
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

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

export default Cancel;