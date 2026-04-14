import React, { useState, useContext } from "react";
import axios from "axios";
import { SERVER_API_URL } from "../../server/server"
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContaxt } from "../../store/userData";
// import logo from "../../Assets/logo.jpeg";
import "./index.css";


const Login = () => {
    const navigate = useNavigate();
    const { setUserData } = useContext(UserContaxt)
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        userCode: "",
        password: "",
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async () => {

        if (!formData.userCode || !formData.password) {
            alert("Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(`${SERVER_API_URL}/api/users/admin/login`,
                {
                    userCode: formData.userCode,
                    password: formData.password,
                },
            );

            if (response.status === 200) {
                alert("Login Successful ✅");

                // // 🔐 Token store
                localStorage.setItem("global_user_token", response.data.global_user_token);
                setUserData(response.data.user);

                console.log("response.data.user", response.data.user)
                navigate("/");
            }

        } catch (error) {
            console.error("Login Error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "❌ Invalid Credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={4000} />
            <div className="lf-wrapper">
                <div className="lf-card">

                    {/* LEFT SIDE */}
                    <div className="lf-left">
                        <div className="lf-brand">
                            <div className="lf-logo">{` ADMIN `}</div>
                            {/* <span>Admin</span> */}
                        </div>

                        <h2 className="lf-heading">Welcome !</h2>
                        <p className="lf-subtext">
                            Login to your account to track your earnings, manage your referrals,
                            and grow your network easily.
                        </p>

                        <div className="lf-field">
                            <label>
                                User ID
                            </label>
                            <input
                                type="userCode"
                                name="userCode"
                                placeholder="Enter your User ID"
                                value={formData.userCode}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="lf-field">
                            <label>Password</label>
                            <div className="lf-password">
                                <input
                                    // type="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <span className="lf-eye">👁</span>
                                <span
                                    className="lf-eye"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {showPassword ? "🙈" : "👁"}
                                </span>

                            </div>
                        </div>

                        {/* <div className="lf-forgot">Forgot your password?</div> */}
                        <div
                            className="lf-forgot-btn"
                            onClick={async () => {
                                if (!formData.userCode) {
                                    toast.error("Please enter your User ID first");
                                    return;
                                }

                                const confirmAction = window.confirm(
                                    `Reset Password\n\nAre you sure you want to reset your password?\nA reset link will be sent to your registered email.`
                                  );
                              
                                  if (!confirmAction) return;

                                try {
                                    setLoading(true);
                                    const res = await axios.post(`${SERVER_API_URL}/api/users/forgot-password`, {
                                        userCode: formData.userCode,
                                    });
                                    toast.success(res.data.message || "✅ Email sent successfully");
                                } catch (err) {
                                    console.error(err);
                                    toast.error(err.response?.data?.message || "❌ Error sending email");
                                } finally {
                                    setLoading(false);
                                }
                            }}
                        >
                            Forgot your password?
                        </div>

                        <button
                            className="lf-btn"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? "Signing In..." : "SIGN IN"}
                        </button>

                        <p className="lf-bottom">
                            Don’t have an account?
                            <Link to="/signup" className="link-navigtion"> Register Now</Link>
                        </p>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="lf-right">
                        
                    </div>

                </div>
            </div>
        </>
    );
};

export default Login;
