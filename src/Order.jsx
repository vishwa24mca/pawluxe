import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, Link } from "react-router-dom";
import axios from "axios";

function Order() {
    const [orders, setOrders] = useState([]);
    
    // Toast state
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const navigate = useNavigate();
    const context = useOutletContext();
    const user = context ? context[0] : null;

    useEffect(() => {
        if (user && user.email) {
            axios.get(`http://localhost:3000/orders?userEmail=${user.email}`)
                .then(res => {
                    if (Array.isArray(res.data)) {
                        setOrders([...res.data].reverse());
                    } else {
                        setOrders([]);
                    }
                })
                .catch(err => console.error("Error fetching orders:", err));
        } else {
            setOrders([]);
        }
    }, [user]);

    // Helper function to show toast messages
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'success' });
        }, 3000);
    };

    // --- Cancel Order Function ---
    const handleCancelOrder = (orderIdToCancel) => {
        axios.patch(`http://localhost:3000/orders/${orderIdToCancel}`, { isCancelled: true })
            .then(() => {
                setOrders(prevOrders => prevOrders.map(order => {
                    const safeId = order._id || order.orderId || order.id;
                    if (safeId === orderIdToCancel) {
                        return { ...order, isCancelled: true };
                    }
                    return order;
                }));
                showToast("Order cancelled successfully.", "warning");
            })
            .catch(err => {
                console.error("Error cancelling order:", err);
                showToast("Failed to cancel order.", "danger");
            });
    };

    if (!user) {
        return (
            <div className="container mt-5 text-center">
                <h3 className="text-muted">Please log in to view your orders.</h3>
                <button className="btn btn-warning mt-3" onClick={() => navigate("/login")}>Go to Login</button>
            </div>
        );
    }

    return (
        <div className="bg-light pb-5 position-relative" style={{ minHeight: "90vh" }}>
            <div className="bg-dark text-white text-center py-5">
                <p className="text-warning text-uppercase small fw-bold mb-1">Your History</p>
                <h1 className="fw-bold">My Orders</h1>
            </div>

            <div className="container mt-5" style={{ maxWidth: "800px" }}>
                {orders.length === 0 ? (
                    <div className="text-center bg-white p-5 rounded shadow-sm mx-auto">
                        <div className="mb-4 text-secondary" style={{ fontSize: "4rem" }}><i className="bi bi-box-seam"></i></div>
                        <h3 className="fw-bold text-dark">No orders found</h3>
                        <p className="text-muted">You haven't placed any orders yet.</p>
                        <Link to="/products" className="btn btn-warning rounded-pill px-4 py-2 mt-3 fw-bold">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-4">
                        {orders?.map((order, orderIndex) => {
                            const safeId = order._id || order.orderId || order.id;

                            return (
                                <div key={safeId || orderIndex} className="card shadow-sm border-0 rounded-4 overflow-hidden">
                                    <div className="card-header bg-white border-bottom p-3 d-flex justify-content-between align-items-center">
                                        <div>
                                            <span className="text-muted small d-block">Order Placed</span>
                                            <strong className="text-dark">{order.date || "Unknown Date"}</strong>
                                        </div>
                                        <div className="text-center">
                                            <span className="text-muted small d-block">Total</span>
                                            <strong className={order.isCancelled ? "text-secondary text-decoration-line-through fs-5" : "text-success fs-5"}>₹{order.total || 0}</strong>
                                        </div>
                                        <div className="text-end d-none d-sm-block">
                                            <span className="text-muted small d-block">{user.name}</span>
                                            <strong className="text-dark" style={{ fontSize: "14px" }}>{user.email}</strong>
                                        </div>
                                    </div>

                                    <div className="card-body p-0">
                                        <ul className="list-group list-group-flush">
                                            {order.items?.map((item, itemIndex) => (
                                                <li key={item.productId || itemIndex} className={`list-group-item p-3 d-flex align-items-center gap-3 ${order.isCancelled ? 'bg-light opacity-75' : ''}`}>
                                                    <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px" }}>
                                                        {item.image ? (
                                                            <img src={item.image} alt={item.name} className="w-100 h-100 rounded" style={{ objectFit: "cover", filter: order.isCancelled ? "grayscale(100%)" : "none" }} />
                                                        ) : (
                                                            <span style={{ fontSize: "28px", filter: order.isCancelled ? "grayscale(100%)" : "none" }}>{item.emoji || "📦"}</span>
                                                        )}
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <h6 className={`m-0 fw-bold ${order.isCancelled ? 'text-muted' : ''}`}>{item.name || "Unknown Item"}</h6>
                                                        <small className="text-muted">Qty: {item.quantity || 1}</small>
                                                    </div>
                                                    <div className="fw-bold text-dark">
                                                        ₹{(item.price || 0) * (item.quantity || 1)}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* FOOTER: Show Cancel Button OR Cancelled Text */}
                                    <div className="card-footer bg-white p-3 text-end border-top-0 d-flex justify-content-end align-items-center">
                                        {order.isCancelled ? (
                                            <span className="text-danger fw-bold">
                                                <i className="bi bi-x-circle-fill me-1"></i> Order Cancelled
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => handleCancelOrder(safeId)}
                                                className="btn btn-outline-danger btn-sm rounded-pill px-4 fw-bold"
                                            >
                                                <i className="bi bi-x-circle me-1"></i> Cancel Order
                                            </button>
                                        )}
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                )}
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

export default Order;