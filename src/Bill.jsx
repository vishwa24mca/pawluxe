import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from 'react-hot-toast';

// UPDATED: Added `cancelledOrderId` to the props
function Bill({ cartItems, deliveryFee = 250, onBackToCart, user, cancelledOrderId }) {
  const navigate = useNavigate();
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editedAddress, setEditedAddress] = useState(user?.address || "");
  const [items, setItems] = useState([]);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    if (cartItems) {
      setItems(cartItems.map(item => ({ ...item, quantity: item.quantity || 1 })));
    }
  }, [cartItems]);

  useEffect(() => {
    if (user?.address && !editedAddress) {
      setEditedAddress(user.address);
    }
  }, [user]);

  const handleIncreaseQuantity = (itemId) => {
    setItems(prevItems => prevItems.map(item =>
      (item._id === itemId || item.id === itemId)
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  };

  const handleDecreaseQuantity = (itemId) => {
    setItems(prevItems => prevItems.map(item =>
      (item._id === itemId || item.id === itemId) && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + deliveryFee;

  const handleConfirmAndPay = () => {
    if (!user) {
      toast.error("Please log in to place an order.");
      return;
    }

    const newOrder = {
      orderId: `PAW-${Math.floor(Math.random() * 1000000)}`,
      date: new Date().toLocaleDateString(),
      items: items.map((item) => ({
        productId: item._id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        emoji: item.emoji
      })),
      total: total,
      userEmail: user.email,
      customerName: user.name,
      customerPhone: user.number,
      customerAddress: editedAddress ? editedAddress.replace(/\s+/g, ' ').trim() : user.address
    };

    axios.post("http://localhost:3000/orders", newOrder)
      .then(() => {
        toast.success("Payment Successful! You can now download your invoice.");
        setIsPaid(true);

        // UPDATED: If they paid for a re-order, delete it from the cancelled list!
        if (cancelledOrderId) {
          axios.delete(`http://localhost:3000/cancelled/${cancelledOrderId}`)
            .catch(err => console.error("Error deleting cancelled order:", err));
        }

      })
      .catch(err => console.error("Error saving order:", err));
  };

  const handleDownloadInvoice = () => {
    const doc = new jsPDF();

    doc.setTextColor(212, 168, 67);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.text("PawLuxe Luxury Pet Care", 105, 20, { align: "center" });

    doc.setTextColor(26, 18, 8);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(14);
    doc.text("Official Invoice Summary", 105, 30, { align: "center" });

    doc.setDrawColor(212, 168, 67);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 190, 42, { align: "right" });

    doc.setFont("Helvetica", "bold");
    doc.text("Billed To:", 20, 42);
    doc.setFont("Helvetica", "normal");
    doc.text(`Name: ${user?.name || "Guest Checkout"}`, 20, 48);
    doc.text(`Email: ${user?.email || "N/A"}`, 20, 54);
    doc.text(`Phone: ${user?.number || "N/A"}`, 20, 60);

    const displayAddress = editedAddress
      ? editedAddress.replace(/\s+/g, ' ').trim()
      : (user?.address ? user.address.replace(/\s+/g, ' ').trim() : "N/A");

    doc.text(`Address: ${displayAddress}`, 20, 66);

    doc.setFontSize(13);
    doc.setFont("Helvetica", "bold");
    doc.setTextColor(26, 18, 8);
    doc.text("Items Purchased:", 20, 80);

    let verticalPosition = 90;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12);

    items.forEach((item) => {
      const itemText = `• ${item.name} (x${item.quantity})`;
      const priceText = `Rs. ${item.price * item.quantity}`;

      doc.text(itemText, 25, verticalPosition);
      doc.text(priceText, 190, verticalPosition, { align: "right" });

      verticalPosition += 10;
    });

    doc.setDrawColor(200, 200, 200);
    doc.line(20, verticalPosition, 190, verticalPosition);
    verticalPosition += 10;

    doc.setTextColor(100, 100, 100);
    doc.text("Subtotal:", 25, verticalPosition);
    doc.text(`Rs. ${subtotal}`, 190, verticalPosition, { align: "right" });

    verticalPosition += 8;
    doc.text("Premium Delivery Fee:", 25, verticalPosition);
    doc.text(`Rs. ${deliveryFee}`, 190, verticalPosition, { align: "right" });

    verticalPosition += 10;
    doc.setDrawColor(212, 168, 67);
    doc.line(20, verticalPosition, 190, verticalPosition);

    verticalPosition += 10;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(40, 167, 69);
    doc.text("Grand Total:", 25, verticalPosition);
    doc.text(`Rs. ${total}`, 190, verticalPosition, { align: "right" });

    doc.save(`PawLuxe_Invoice_${user?.name || "Guest"}.pdf`);
  };

  return (
    <div className="container mt-5 mb-5" style={{ maxWidth: "550px" }}>
      <div className="card p-4 p-md-5 shadow rounded-4 border-0">

        <h2 className="text-center fw-bold mb-4" style={{ color: "#d4a843", fontFamily: "'Playfair Display', Georgia, serif" }}>
          Final Checkout
        </h2>

        {user ? (
          <div className="bg-light p-3 rounded-3 mb-4 border border-light-subtle">
            <h6 className="fw-bold mb-2 text-dark border-bottom pb-2">Delivery Details</h6>
            <div className="small text-secondary" style={{ lineHeight: "1.8" }}>
              <div className="d-flex align-items-start"><strong className="text-dark" style={{ width: "80px", minWidth: "80px" }}>Name:</strong> <span className="text-start text-break">{user.name}</span></div>
              <div className="d-flex align-items-start"><strong className="text-dark" style={{ width: "80px", minWidth: "80px" }}>Email:</strong> <span className="text-start text-break">{user.email}</span></div>
              <div className="d-flex align-items-start"><strong className="text-dark" style={{ width: "80px", minWidth: "80px" }}>Phone:</strong> <span className="text-start text-break">{user.number || "Not provided"}</span></div>

              <div className="d-flex align-items-start mt-1">
                <strong className="text-dark" style={{ width: "80px", minWidth: "80px" }}>Address:</strong>
                {isEditingAddress ? (
                  <div className="flex-grow-1">
                    <textarea
                      className="form-control form-control-sm mb-2 shadow-sm"
                      rows="3"
                      value={editedAddress}
                      onChange={(e) => setEditedAddress(e.target.value)}
                    />
                    <button className="btn btn-sm btn-dark py-0 px-3 rounded-pill" onClick={() => setIsEditingAddress(false)}>Save</button>
                  </div>
                ) : (
                  <div className="flex-grow-1 d-flex justify-content-between align-items-start">
                    <span className="me-2 text-start" style={{ wordBreak: "break-word" }}>
                      {editedAddress ? editedAddress.replace(/\s+/g, ' ').trim() : "Not provided"}
                    </span>
                    <button
                      className="btn btn-sm p-0 text-warning flex-shrink-0 ms-2"
                      onClick={() => setIsEditingAddress(true)}
                      title="Edit Address"
                      disabled={isPaid}
                    >
                      <i className="bi bi-pencil-square fs-6"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="alert alert-warning small text-center py-2 mb-4">
            You are checking out as a Guest.
          </div>
        )}

        <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Order Summary</h6>
        <ul className="list-group list-group-flush mb-4">
          {items.map((item) => (
            <li key={item._id || item.id} className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center bg-transparent">

              <div className="d-flex flex-column gap-2">
                <div className="d-flex align-items-center gap-2">
                  {item.emoji && <span style={{ fontSize: "1.2rem" }}>{item.emoji}</span>}
                  <span className="text-secondary">{item.name}</span>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center border rounded-pill px-2 py-1 bg-white shadow-sm" style={{ width: "fit-content" }}>
                    <button
                      className="btn btn-sm p-0 text-secondary border-0 d-flex align-items-center justify-content-center"
                      style={{ width: "24px", height: "24px" }}
                      onClick={() => handleDecreaseQuantity(item._id || item.id)}
                      disabled={item.quantity <= 1 || isPaid}
                    >
                      <i className="bi bi-dash fs-5"></i>
                    </button>

                    <span className="fw-bold text-dark mx-2" style={{ fontSize: "0.95rem", minWidth: "18px", textAlign: "center" }}>
                      {item.quantity}
                    </span>

                    <button
                      className="btn btn-sm p-0 text-secondary border-0 d-flex align-items-center justify-content-center"
                      style={{ width: "24px", height: "24px" }}
                      onClick={() => handleIncreaseQuantity(item._id || item.id)}
                      disabled={isPaid}
                    >
                      <i className="bi bi-plus fs-5"></i>
                    </button>
                  </div>
                </div>
              </div>

              <span className="fw-bold text-dark" style={{ fontSize: "1.1rem" }}>₹{item.price * item.quantity}</span>
            </li>
          ))}
        </ul>

        <div className="bg-light p-3 rounded-3 mb-4">
          <div className="d-flex justify-content-between mb-2 small text-secondary">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="d-flex justify-content-between mb-2 small text-secondary">
            <span>Delivery Fee</span>
            <span>{deliveryFee === 0 ? <span className="text-success fw-bold">FREE</span> : `₹${deliveryFee}`}</span>
          </div>
          <hr className="my-2 border-secondary-subtle" />
          <div className="d-flex justify-content-between fw-bold fs-5 mt-2" style={{ color: "#1a1208" }}>
            <span>Grand Total</span>
            <span style={{ color: "#d4a843" }}>₹{total}</span>
          </div>
        </div>

        <div className="d-flex flex-column gap-3 mt-2">

          <button
            className="btn w-100 rounded-pill fw-bold bg-white shadow-sm"
            style={{
              border: "2px solid #e9ecef",
              transition: "all 0.2s",
              color: isPaid ? "#212529" : "#6c757d",
              cursor: isPaid ? "pointer" : "not-allowed"
            }}
            onClick={handleDownloadInvoice}
            disabled={!isPaid}
            onMouseOver={(e) => { if (isPaid) { e.currentTarget.style.borderColor = "#d4a843"; e.currentTarget.style.color = "#d4a843"; } }}
            onMouseOut={(e) => { if (isPaid) { e.currentTarget.style.borderColor = "#e9ecef"; e.currentTarget.style.color = "#212529"; } }}
          >
            <i className={`bi bi-file-earmark-pdf me-2 ${isPaid ? "text-danger" : "text-secondary"}`}></i>
            Download Invoice {isPaid ? "" : "(Available after payment)"}
          </button>

          <div className="row g-2">
            <div className="col-6">
              <button className="btn btn-light border w-100 rounded-pill fw-bold" onClick={onBackToCart}>
                Go Back
              </button>
            </div>
            <div className="col-6">
              {!isPaid ? (
                <button
                  className="btn w-100 rounded-pill fw-bold"
                  style={{ backgroundColor: "#1a1208", color: "#d4a843" }}
                  onClick={handleConfirmAndPay}
                >
                  Confirm & Pay
                </button>
              ) : (
                <button
                  className="btn w-100 rounded-pill fw-bold"
                  style={{ backgroundColor: "#28a745", color: "#ffffff" }}
                  onClick={() => navigate("/order")}
                >
                  View Orders
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Bill;