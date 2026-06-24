import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

// Accept setUser as a prop from App.jsx
function Login({ setUser }) {
    const nav = useNavigate();
    const [users, setUsers] = useState([]);
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get("http://localhost:3000/details")
            .then((res) => setUsers(res.data))
            .catch((err) => console.error("Error loading users:", err));
    }, []);

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (!loginData.email || !loginData.password) {
            setError("Please fill in all fields.");
            return;
        }

        // Find the matching user in your database collection
        const foundUser = users.find(
            (u) => u.email === loginData.email && u.password === loginData.password
        );

        if (foundUser) {
            setError("");
            
            // Create user object with necessary details
            const userData = { 
                name: foundUser.name, 
                email: foundUser.email,
                number: foundUser.number,
                address: foundUser.address
            };
            
            // Persist user data to localStorage
            localStorage.setItem("pawluxe_user", JSON.stringify(userData));

            // Save the user data into the shared App state
            setUser(userData);

            // Redirect back to the Home page
            nav("/"); 
        } else {
            setError("Invalid Email or Password!");
        }
    };

    // Shared input style matching the Registration form
    const inputStyle = "form-control form-control-lg bg-white border border-2 border-secondary-subtle shadow-sm fs-6";

    return (
        <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center py-5">
            <div className="card border-0 shadow rounded-4 w-100" style={{ maxWidth: "450px" }}>
                <div className="card-body p-4 p-md-5 bg-white rounded-4">
                    
                    <div className="text-center mb-4">
                        <span className="badge rounded-pill py-2 px-3 mb-2 text-uppercase fw-bold" style={{ backgroundColor: "#fdf8ec", color: "#b8860b" }}>
                            Welcome Back
                        </span>
                        <h2 className="fw-bold text-dark mb-0">Login to PawLuxe</h2>
                    </div>

                    <form onSubmit={handleLogin}>
                        
                        <div className="mb-3">
                            <label className="form-label fw-bold text-dark small mb-1">Email Address</label>
                            <input 
                                type="email" 
                                name="email" 
                                className={inputStyle} 
                                value={loginData.email} 
                                onChange={handleChange} 
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="form-label fw-bold text-dark small mb-1">Password</label>
                            <input 
                                type="password" 
                                name="password" 
                                className={inputStyle} 
                                value={loginData.password} 
                                onChange={handleChange} 
                            />
                        </div>

                        {error && (
                            <div className="alert alert-danger py-2 small fw-bold text-center border-0 shadow-sm mb-3" role="alert">
                                <i className="bi bi-exclamation-circle me-2"></i>{error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="btn w-100 rounded-pill fw-bold py-3 shadow mt-2"
                            style={{ backgroundColor: "#d4a843", color: "#1a1208", letterSpacing: "0.5px", transition: "all 0.2s" }}
                            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                        >
                            Login Securely
                        </button>

                    </form>

                    <div className="text-center mt-4 pt-3 border-top border-light-subtle">
                        <p className="text-secondary small mb-0">
                            Don't have an account?{" "}
                            <Link to="/form" className="fw-bold text-decoration-none" style={{ color: "#b8860b" }}>
                                Register here
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Login;