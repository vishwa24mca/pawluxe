import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        axios.post('http://localhost:3000/api/contact', formData)
            .then(res => {
                toast.success(res.data.message || "Message sent successfully!");
                setFormData({ name: "", email: "", subject: "", message: "" });
            })
            .catch(err => {
                console.error("Error sending message:", err);
                toast.error("Failed to send message. Check server logs.");
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <div className="container py-5">
            <div className="row g-5 align-items-stretch">

                {/* Form Section */}
                <div className="col-lg-7">
                    <div className="card h-100 border-0 rounded-4 shadow-lg p-4 p-md-5">
                        <div className="card-body p-0">
                            <h2 className="display-6 fw-bolder text-dark mb-4">Get in Touch</h2>
                            <p className="fs-5 text-muted mb-4">
                                We would love to hear from you! Whether you have a question
                                about our premium pet collections, need assistance with an
                                order, or just want to share a photo of your furry friend, the
                                <strong> PawLuxe</strong> team is always here to help.
                            </p>

                            <hr className="my-4 text-muted" />

                            <h4 className="fw-bold text-dark mb-4">Send Us a Message</h4>

                            <form onSubmit={handleSubmit}>
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold text-secondary small text-uppercase">Name <span className="text-danger">*</span></label>
                                        {/* FIX: Changed border-0 to border border-secondary-subtle */}
                                        <input type="text" name="name" className="form-control form-control-lg bg-light border border-secondary-subtle py-3" value={formData.name} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold text-secondary small text-uppercase">Email <span className="text-danger">*</span></label>
                                        {/* FIX: Changed border-0 to border border-secondary-subtle */}
                                        <input type="email" name="email" className="form-control form-control-lg bg-light border border-secondary-subtle py-3" value={formData.email} onChange={handleChange} required />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label fw-bold text-secondary small text-uppercase">Subject</label>
                                        {/* FIX: Changed border-0 to border border-secondary-subtle */}
                                        <input type="text" name="subject" className="form-control form-control-lg bg-light border border-secondary-subtle py-3" value={formData.subject} onChange={handleChange} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label fw-bold text-secondary small text-uppercase">Message <span className="text-danger">*</span></label>
                                        {/* FIX: Changed border-0 to border border-secondary-subtle */}
                                        <textarea name="message" rows="5" className="form-control form-control-lg bg-light border border-secondary-subtle py-3" value={formData.message} onChange={handleChange} required style={{ resize: "none" }}></textarea>
                                    </div>
                                    <div className="col-12 mt-5">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="btn rounded-pill fw-bold py-3 px-5 w-100 shadow-sm"
                                            style={{ backgroundColor: "#d4a843", color: "#1a1208", border: "none" }}
                                        >
                                            {isSubmitting ? (
                                                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending...</>
                                            ) : "Submit Message"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Contact Information Section */}
               <div className="col-lg-5">
                    <div className="card h-100 border-0 rounded-4 shadow-sm p-4 p-md-5 d-flex flex-column position-relative overflow-hidden" style={{ backgroundColor: "#1a1208" }}>
                        {/* Decorative accent */}
                        <div className="position-absolute top-0 end-0 p-4 opacity-25" style={{ pointerEvents: "none" }}>
                            <i className="bi bi-paw-fill" style={{ fontSize: "10rem", color: "#d4a843", transform: "rotate(15deg) translate(20px, -40px)", display: "block" }}></i>
                        </div>

                        <div className="card-body p-0 d-flex flex-column position-relative z-1">
                            <h3 className="fw-bolder mb-5" style={{ color: "#d4a843", fontFamily: "'Playfair Display', Georgia, serif" }}>Contact Details</h3>

                            <ul className="list-unstyled fs-6 m-0 mb-auto">
                                <li className="d-flex align-items-start mb-4">
                                    <div className="bg-gradient rounded-circle p-3 me-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ backgroundColor: "rgba(212, 168, 67, 0.1)", width: "50px", height: "50px" }}>
                                        <i className="bi bi-envelope-fill fs-4" style={{ color: "#d4a843" }}></i>
                                    </div>
                                    <div>
                                        <span className="d-block small text-uppercase text-white-50 fw-bold tracking-wide mb-1">Email Support</span>
                                        <a href="mailto:pawluxe@gmail.com" className="text-white text-decoration-none fw-semibold" style={{ transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color = "#d4a843"} onMouseOut={e => e.currentTarget.style.color = "white"}>
                                            pawluxe@gmail.com
                                        </a>
                                    </div>
                                </li>

                                <li className="d-flex align-items-start mb-4">
                                    <div className="bg-gradient rounded-circle p-3 me-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ backgroundColor: "rgba(212, 168, 67, 0.1)", width: "50px", height: "50px" }}>
                                        <i className="bi bi-telephone-fill fs-4" style={{ color: "#d4a843" }}></i>
                                    </div>
                                    <div>
                                        <span className="d-block small text-uppercase text-white-50 fw-bold tracking-wide mb-1">Phone Enquiries</span>
                                        <a href="tel:+916374929212" className="text-white text-decoration-none fw-semibold" style={{ transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color = "#d4a843"} onMouseOut={e => e.currentTarget.style.color = "white"}>
                                            +91 6374929212
                                        </a>
                                    </div>
                                </li>

                                <li className="d-flex align-items-start mb-4">
                                    <div className="bg-gradient rounded-circle p-3 me-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ backgroundColor: "rgba(212, 168, 67, 0.1)", width: "50px", height: "50px" }}>
                                        <i className="bi bi-geo-alt-fill fs-4" style={{ color: "#d4a843" }}></i>
                                    </div>
                                    <div>
                                        <span className="d-block small text-uppercase text-white-50 fw-bold tracking-wide mb-1">Headquarters</span>
                                        <span className="text-white lh-base fw-semibold d-block">
                                            25c, Valluvar Cross Street,<br />
                                            Jaihindpuram 2nd Main Road,<br />
                                            Madurai, Tamil Nadu 625011
                                        </span>
                                        <span className="d-block small mt-2" style={{ color: "#d4a843" }}><i className="bi bi-info-circle me-1"></i>Online store only. No walk-ins.</span>
                                    </div>
                                </li>
                                </ul>

                                <div className="p-4 rounded-4 mt-auto mb-4" style={{ backgroundColor: "rgba(212, 168, 67, 0.05)", border: "1px solid rgba(212, 168, 67, 0.1)" }}>
                                    <h6 className="fw-bold text-uppercase mb-2" style={{ color: "#d4a843", letterSpacing: "1px" }}>
                                        <i className="bi bi-shield-check me-2"></i> Our Commitment
                                    </h6>
                                    <p className="text-white-50 small mb-0 lh-lg">
                                        We guarantee a response within <strong>24 hours</strong>. Your satisfaction is our top priority, and we're dedicated to providing you and your pets with exceptional service every step of the way.
                                    </p>
                                </div>

                                <div className="mt-2 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                                    <p className="text-white-50 small mb-4">
                                    <i className="bi bi-clock-history me-2" style={{ color: "#d4a843" }}></i> Available Mon-Fri, 9:00 AM - 6:00 PM (IST)
                                </p>

                                <h6 className="fw-bold mb-3 text-white text-uppercase tracking-wide small">Follow Us</h6>
                                <div className="d-flex gap-3">
                                    <a href="#" className="rounded-circle d-flex align-items-center justify-content-center text-decoration-none transition-all" style={{ backgroundColor: "rgba(212, 168, 67, 0.1)", color: "#d4a843", width: "40px", height: "40px", transition: "all 0.3s ease" }} onMouseOver={e => {e.currentTarget.style.backgroundColor = "#d4a843"; e.currentTarget.style.color = "#1a1208"; e.currentTarget.style.transform = "translateY(-3px)";}} onMouseOut={e => {e.currentTarget.style.backgroundColor = "rgba(212, 168, 67, 0.1)"; e.currentTarget.style.color = "#d4a843"; e.currentTarget.style.transform = "translateY(0)";}}>
                                        <i className="bi bi-instagram fs-6"></i>
                                    </a>
                                    <a href="#" className="rounded-circle d-flex align-items-center justify-content-center text-decoration-none transition-all" style={{ backgroundColor: "rgba(212, 168, 67, 0.1)", color: "#d4a843", width: "40px", height: "40px", transition: "all 0.3s ease" }} onMouseOver={e => {e.currentTarget.style.backgroundColor = "#d4a843"; e.currentTarget.style.color = "#1a1208"; e.currentTarget.style.transform = "translateY(-3px)";}} onMouseOut={e => {e.currentTarget.style.backgroundColor = "rgba(212, 168, 67, 0.1)"; e.currentTarget.style.color = "#d4a843"; e.currentTarget.style.transform = "translateY(0)";}}>
                                        <i className="bi bi-facebook fs-6"></i>
                                    </a>
                                    <a href="#" className="rounded-circle d-flex align-items-center justify-content-center text-decoration-none transition-all" style={{ backgroundColor: "rgba(212, 168, 67, 0.1)", color: "#d4a843", width: "40px", height: "40px", transition: "all 0.3s ease" }} onMouseOver={e => {e.currentTarget.style.backgroundColor = "#d4a843"; e.currentTarget.style.color = "#1a1208"; e.currentTarget.style.transform = "translateY(-3px)";}} onMouseOut={e => {e.currentTarget.style.backgroundColor = "rgba(212, 168, 67, 0.1)"; e.currentTarget.style.color = "#d4a843"; e.currentTarget.style.transform = "translateY(0)";}}>
                                        <i className="bi bi-twitter-x fs-6"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Contact;