import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import axios from "axios";
import Bill from "./Bill"; // Import your reusable Bill UI!

function Buynow() {
  const navigate = useNavigate();
  const { id } = useParams(); // Grab the ID from the web address
  const [user] = useOutletContext(); 
  
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Fetch all products and find the one that matches our ID
    axios.get("http://localhost:3000/products")
      .then(res => {
        const found = res.data.find(item => (item._id === id || item.id === id));
        setProduct(found);
      })
      .catch(err => console.error("Error fetching item:", err));
  }, [id]);

  if (!product) {
    return <h2 className="text-center mt-5">Loading Checkout...</h2>;
  }

  // Calculate the bill math for this ONE item
  const itemWithQty = { ...product, quantity: 1 };
  const subtotal = itemWithQty.price;
  const DELIVERY_FEE = 250;
  const total = subtotal + DELIVERY_FEE;

  return (
    <div className="bg-light pb-5" style={{ minHeight: "100vh" }}>
      <div className="bg-dark text-white text-center py-5 mb-4">
        <h1 className="fw-bold">Instant Checkout</h1>
      </div>

      {/* Render your exact Bill design! */}
      <Bill 
        cartItems={[itemWithQty]} 
        subtotal={subtotal} 
        deliveryFee={DELIVERY_FEE} 
        total={total} 
        onBackToCart={() => navigate("/products")} // Send them back to shop
        user={user} 
      />
    </div>
  );
}

export default Buynow;