// import React from "react";

function About() {
  return (
    <div className="container py-5">
      
      {/* SECTION 1: Introduction (Text Left, Image Right) */}
      <div className="row align-items-center mb-5 pb-4 border-bottom">
        <div className="col-lg-6 mb-4 mb-lg-0 pe-lg-5">
          <h1 className="display-5 fw-bold text-dark mb-4">
            About <span className="text-warning">PawLuxe</span>
          </h1>
          <p className="lead text-secondary lh-base">
            Welcome to PawLuxe, where we believe our four-legged companions are more than just pets; they are cherished members of the family.
          </p>
          <p className="text-secondary lh-base">
            Born out of a deep love for animals and a passion for premium quality, PawLuxe bridges the gap between everyday pet care and sophisticated living. We know that pet products shouldn't force you to choose between your furry friend's comfort and your personal style.
          </p>
        </div>
        <div className="col-lg-6">
          {/* Using a high-quality placeholder image of a dog from Unsplash */}
          <img 
            src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80" 
            alt="Happy dog looking premium" 
            className="img-fluid rounded-4 shadow"
          />
        </div>
      </div>

      {/* SECTION 2: Our Mission (Image Left, Text Right) */}
      {/* 'flex-lg-row-reverse' swaps the order on large screens so it looks like a zigzag pattern! */}
      <div className="row align-items-center mb-5 flex-lg-row-reverse pb-4 border-bottom">
        <div className="col-lg-6 mb-4 mb-lg-0 ps-lg-5">
          <h2 className="fw-bold text-dark mb-3">Our Mission</h2>
          <p className="text-secondary lh-base">
            Every product that carries our name is a reflection of our commitment to excellence. We source only the finest, pet-safe materials built to last. 
          </p>
          <p className="text-secondary lh-base">
            Our mission is to provide luxury that your pet can genuinely feel, and aesthetics that you can proudly display in your home. We are dedicated to setting the highest standard of comfort, style, and care in the pet industry.
          </p>
          <p className="text-dark fw-bold mt-4">
            Thank you for letting PawLuxe be a part of your pet's beautiful journey.
          </p>
        </div>
        <div className="col-lg-6">
          {/* Using a high-quality placeholder image of a cat from Unsplash */}
          <img 
            src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80" 
            alt="Elegant cat" 
            className="img-fluid rounded-4 shadow"
          />
        </div>
      </div>

      {/* SECTION 3: Why Choose Us (Bootstrap Icons) */}
      <div className="row text-center pt-3">
        <div className="col-12 mb-5">
          <h2 className="fw-bold text-dark">The PawLuxe Difference</h2>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="text-warning mb-3" style={{ fontSize: "3rem" }}>
            <i className="bi bi-award-fill"></i>
          </div>
          <h4 className="fw-bold fs-5">Premium Quality</h4>
          <p className="text-muted small px-3">
            Handcrafted with the finest, durable materials for ultimate comfort that lasts a lifetime.
          </p>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="text-warning mb-3" style={{ fontSize: "3rem" }}>
            <i className="bi bi-shield-check"></i>
          </div>
          <h4 className="fw-bold fs-5">100% Pet Safe</h4>
          <p className="text-muted small px-3">
            Tested rigorously to ensure the complete safety, health, and happiness of your pets.
          </p>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="text-warning mb-3" style={{ fontSize: "3rem" }}>
            <i className="bi bi-gem"></i>
          </div>
          <h4 className="fw-bold fs-5">Elegant Design</h4>
          <p className="text-muted small px-3">
            Beautifully styled to seamlessly match your home decor without compromising on function.
          </p>
        </div>
      </div>

    </div>
  );
}

export default About;