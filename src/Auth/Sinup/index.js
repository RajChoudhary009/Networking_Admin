import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SERVER_API_URL } from "../../server/server"
import axios from "axios";
import "./index.css";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    referralCode: "",
  });

  // Handle Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(`${SERVER_API_URL}/api/users/register`, formData);

      if (response.status === 200) {
        alert("Account Created Successfully ✅");
        navigate("/login");
      }
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        {/* LEFT SIDE */}
        <div className="auth-left">
          <div className="logo">USER PANEL</div>
          <Link to="/" className="back-btn">Back to store →</Link>

          <div className="caption">
            <h2>Create Account & Start Earning</h2>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-right">
          <h1>Create Account</h1>

          <p className="login-text">
            Already have account?{" "}
            <Link to="/login" className="link-navigtion">Login</Link>
          </p>

          <form onSubmit={handleSubmit}>

            {/* Name */}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {/* Password */}
            <div className="password-box">
              <input
                type="password"
                name="password"
                placeholder="Create Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span className="eye">👁</span>
            </div>

            {/* Referral Code */}
            <input
              type="text"
              name="referralCode"
              placeholder="Referral Code"
              value={formData.referralCode}
              onChange={handleChange}
            />

            <button className="submit-btn" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Signup;