import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

function Form() {
  const nav = useNavigate();
  const [showError, setShowError] = useState(false);
  const [msg, setmsg] = useState("");
  const [msg2, setmsg2] = useState("");
  const [value, setvalue] = useState({
    name: "",
    email: "",
    gender: "",
    number: "",
    city: "",
    password: "",
    address: ""
  });

  let change = (e) => {
    setvalue({ ...value, [e.target.name]: e.target.value });
  };

  let detail = () => {
    const isInvalid = !value.name || !value.email || !value.gender || !value.number || !value.city || !value.password || !value.address;

    if (isInvalid) {
      setShowError(true);
      return;
    }

    axios.post("http://localhost:3000/details", value)
      .then((res) => {
        setmsg("Account created successfully!");
        setmsg2("Redirecting to login...");
        setvalue({
          name: "", email: "", gender: "", number: "", city: "", password: "", address: ""
        });
        setShowError(false);
        setTimeout(() => {
          setmsg("");
          setmsg2("");
          nav("/login");
        }, 1500);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Registration failed. Check server.");
      });
  };

  // Custom base style for inputs to make them unique and visible
  const inputStyle = "form-control form-control-lg bg-white border border-2 border-secondary-subtle shadow-sm fs-6";

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="card border-0 shadow rounded-4 w-100" style={{ maxWidth: "550px" }}>
        <div className="card-body p-4 p-md-5 bg-white rounded-4">

          <div className="text-center mb-4">
            <span className="badge rounded-pill py-2 px-3 mb-2 text-uppercase fw-bold" style={{ backgroundColor: "#fdf8ec", color: "#b8860b" }}>
              Join PawLuxe
            </span>
            <h2 className="fw-bold text-dark mb-0">Create an Account</h2>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>

            <div className="mb-3">
              <label className="form-label fw-bold text-dark small mb-1">Full Name</label>
              <input type="text" name="name" className={inputStyle} value={value.name} onChange={change} />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold text-dark small mb-1">Email Address</label>
              <input type="email" name="email" className={inputStyle} value={value.email} onChange={change} />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-sm-6">
                <label className="form-label fw-bold text-dark small mb-1">Password</label>
                <input type="password" name="password" className={inputStyle} value={value.password} onChange={change} />
              </div>
              <div className="col-sm-6">
                <label className="form-label fw-bold text-dark small mb-1">Phone Number</label>
                <input type="number" name="number" className={inputStyle} value={value.number} onChange={change} />
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-sm-6">
                <label className="form-label fw-bold text-dark small d-block mb-2">Gender</label>
                <div className="d-flex gap-3 mt-2 px-1">
                  <div className="form-check">
                    <input className="form-check-input border-secondary" type="radio" name="gender" id="male" value="male" checked={value.gender === "male"} onChange={change} />
                    <label className="form-check-label text-dark fw-medium" htmlFor="male">Male</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input border-secondary" type="radio" name="gender" id="female" value="female" checked={value.gender === "female"} onChange={change} />
                    <label className="form-check-label text-dark fw-medium" htmlFor="female">Female</label>
                  </div>
                </div>
              </div>

              <div className="col-sm-6">
                <label className="form-label fw-bold text-dark small mb-1">City</label>
                <select name="city" className={`form-select form-select-lg bg-white border border-2 border-secondary-subtle shadow-sm fs-6`} value={value.city} onChange={change}>
                  <option value="" disabled>Select City</option>
                  <option value="madurai">Madurai</option>
                  <option value="trichy">Trichy</option>
                  <option value="Dindukal">Dindukal</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold text-dark small mb-1">Address</label>
              <textarea
                name="address"
                className={inputStyle}
                value={value.address}
                onChange={change}
                rows="3"
                style={{ resize: "none" }}
              />
            </div>

            {showError && (
              <div className="alert alert-danger py-2 small fw-bold text-center border-0 shadow-sm mb-3" role="alert">
                <i className="bi bi-exclamation-circle me-2"></i>Please fill out all required fields!
              </div>
            )}

            {msg && (
              <div className="alert alert-success py-2 small fw-bold text-center border-0 shadow-sm mb-3" role="alert">
                <i className="bi bi-check-circle me-2"></i>{msg} <br /> <span className="fw-normal">{msg2}</span>
              </div>
            )}

            <button
              type="button"
              onClick={detail}
              className="btn w-100 rounded-pill fw-bold py-3 shadow mt-2"
              style={{ backgroundColor: "#d4a843", color: "#1a1208", letterSpacing: "0.5px", transition: "all 0.2s" }}
              onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              Create Account
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Form;