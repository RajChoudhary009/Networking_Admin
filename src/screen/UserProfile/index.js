import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContaxt } from "../../store/userData";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { SERVER_API_URL, SERVER_URL } from "../../server/server"
import scaneer from "../../Assest/profile.png"
import scanImgSmall from "../../Assest/scaneer.avif"
import "./index.css";

export const UserProfile = () => {
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(UserContaxt)
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [paymentAddress, setPaymentAddress] = useState("");
  const [scannerFile, setScannerFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG/PNG allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Max size 2MB");
      return;
    }

    setScannerFile(file);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("global_user_token");

      if (!token) {
        toast.error("Login required");
        return;
      }

      if (!paymentAddress && !scannerFile) {
        toast.error("Add at least one field");
        return;
      }

      const formData = new FormData();

      if (paymentAddress) {
        formData.append("paymentAddress", paymentAddress);
      }

      if (scannerFile) {
        formData.append("userScanner", scannerFile);
      }

      setLoading(true);

      const res = await axios.post(`${SERVER_API_URL}/api/users/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        toast.success("Updated Successfully ✅");

        setShowScannerModal(false);

        // 👉 optional: userData refresh
        // fetchUser();

        setScannerFile(null);
      }

    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // jab userData aaye tab update karo
  useEffect(() => {
    if (userData?.paymentAddress) {
      setPaymentAddress(userData.paymentAddress);
    }
  }, [userData]);


  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if (!confirmLogout) return; // ❌ user clicked NO

    try {
      const response = await axios.get(`${SERVER_API_URL}/api/users/logout`);

      if (response.status === 200) {
        localStorage.removeItem("global_user_token");
        setUserData(null);

        navigate("/login");
      }

    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleUserCodeCopy = (text) => {
    if (!text) return;
    const fullUrl = `${SERVER_URL}/ref-signup/${text}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success("Copied!");
  };

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  console.log("userData?.userScanner", userData?.userScanner)
  if (!userData || !userData.email) {
    return (
      <div className="loading-wrapper">
        <h2 className="loading-text">Loading...</h2>
      </div>
    );
  }


  return (
    <>
      <ToastContainer position="top-right" autoClose={4000} />
      <Link to="/" className="back-btn">⬅ Back to Home</Link>
      <button className="Logut-btn" onClick={handleLogout}>⬅ Logut</button>
      <div className="user-profile">
        <div className="profile-card">
          {/* Rank Badge */}
          <div className="rank-badge">
            RANK {userData.rankId}
            <span className="rank-arrow">↑</span>
          </div>

          <div
            className="scanner-wrapper"
            onClick={() => setShowScannerModal(true)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={scaneer}
              alt="User Scanner"
              className="scanner-img"
            />
            <div className="scan-line"></div>
          </div>

          <h3>{userData.name}</h3>
          <p className="wallet"><strong>Wallet:</strong> ${userData.wallet.toLocaleString()}</p>
          <div className="info-list">
            <div className="info-row">
              <span>Email</span>
              <span>{userData.email}</span>
            </div>

            <div className="info-row">
              <span>User ID</span>
              <span>{userData.userCode}
                <button
                  style={{ marginLeft: "5px" }}
                  className="copy-btn"
                  onClick={() => handleUserCodeCopy(userData.userCode)}
                >
                  📋
                </button>
              </span>
            </div>

            <div className="info-row">
              <span>User Scanner</span>

              <div className="scanner-box-small">
                <img
                  src={
                    userData?.userScanner
                      ? `${SERVER_API_URL}/${userData.userScanner}`
                      : scanImgSmall
                  }
                  alt="User Scanner"
                  className="scanner-img-small"
                />
              </div>
            </div>

            <div className="info-row">
              <span>Payment Address</span>
              <span className="break copy-box">
                {userData.paymentAddress}

                <button
                  className="copy-btn"
                  onClick={() => handleCopy(userData.paymentAddress)}
                >
                  📋
                </button>
              </span>
            </div>

            <div className="info-row">
              <span>Referral Code</span>
              <span>{userData.referralCode}</span>
            </div>

            <div className="info-row">
              <span>Referred By</span>
              <span>{userData.referredBy || "---"}</span>
            </div>

            <div className="info-row">
              <span>Payment Status</span>
              <span className={`status-badge ${userData.paymentStatus === "success" ? "success" : "pending"}`}>
                {userData.paymentStatus === "success" ? "Paid" : "Pending"}
              </span>
            </div>
          </div>

        </div>
      </div>

      {showScannerModal && (
        <div className="scanner-modal">
          <div className="scanner-box">

            {/* Close */}
            <span
              className="close-btn"
              onClick={() => setShowScannerModal(false)}
            >
              ✖
            </span>

            {/* Image Preview */}
            <img
              src={
                scannerFile
                  ? URL.createObjectURL(scannerFile)
                  : userData?.userScanner
                    ? `${SERVER_API_URL}/${userData.userScanner}`
                    : scanImgSmall
              }
              alt="Scanner"
              className="big-scanner"
            />

            <h3>Wallet & Scanner</h3>

            {/* 🔥 CONDITION */}
            {userData?.userScanner && userData?.paymentAddress ? (
              <>
                {/* 👁️ VIEW MODE */}
                <div className="payment-info">
                  <span>Payment Address:</span>
                  <span className="break">{userData.paymentAddress}</span>
                </div>
              </>
            ) : (
              <>
                {/* ✏️ EDIT MODE */}

                {/* Upload Scanner */}
                {!userData?.userScanner && (
                  <div className="upload-box">
                    <label>Upload Scanner</label>
                    <input type="file" onChange={handleFileChange} />
                  </div>
                )}

                {/* Payment Input */}
                {!userData?.paymentAddress && (
                  <input
                    type="text"
                    placeholder="Enter Payment Address"
                    value={paymentAddress}
                    onChange={(e) => setPaymentAddress(e.target.value)}
                    className="payment-input"
                  />
                )}

                {/* Save Button */}
                <button
                  className="save-btn"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
};