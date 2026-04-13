import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContaxt } from "../../store/userData";
import { SERVER_API_URL } from "../../server/server"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import "./index.css";


export const Account = () => {
  const navigate = useNavigate();
  const { userData, setUserData, fetchUser } = useContext(UserContaxt)
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const [scannerList, setScannerList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentScanner = scannerList[currentIndex];
  const [showTxModal, setShowTxModal] = useState(false);

  const [selectedTx, setSelectedTx] = useState(null);
  const [selectedTxId, setSelectedTxId] = useState(null);
  const [txData, setTxData] = useState({ status: "pending" });

  // Date time
  const formatDateTime = (date) => {
    const d = new Date(date);

    const day = d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const time = d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${day} • ${time}`;
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;

  //   setTxData((prev) => ({
  //     ...prev,
  //     [name]: value
  //   }));
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setTxData((prev) => {
      let updated = { ...prev, [name]: value };

      if (name === "status" && value !== "approved") {
        updated.withdrawMethod = "";
      }

      return updated;
    });
  };


  const fetchScanner = async () => {
    try {
      const res = await axios.get(`${SERVER_API_URL}/api/scanner`);
      console.log("scaneer-data", res.data.data)
      if (res.status === 200) {
        setScannerList(res.data.data || []);
      }

    } catch (err) {
      console.error("Fetch Scanner Error:", err);

      const message = err.response?.data?.message || "Failed to load Scanner";
      toast.error(message);
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("global_user_token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      const res = await axios.get(`${SERVER_API_URL}/api/transactions/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
      console.log("res.data.data", res.data.data)
      if (res.status === 200) {
        setTransactions(res.data.data || []);
      }

    } catch (err) {
      console.error("Fetch TX Error:", err);

      const message =
        err.response?.data?.message || "Failed to load transactions";

      toast.error(message);

      // 🔐 if token expired
      if (err.response?.status === 401) {
        localStorage.removeItem("global_user_token");
        window.location.href = "/login";
      }
    }
  };


  const handleUpdateStatus = async () => {
    if (!selectedTxId) {
      toast.error("Invalid transaction");
      return;
    }

    try {
      const token = localStorage.getItem("global_user_token");

      if (!token) {
        toast.error("Unauthorized");
        return;
      }

      // const res = await axios.put(`${SERVER_API_URL}/api/transactions/update/${selectedTxId}`, { status: txData.status, withdrawMethod: txData.withdrawMethod },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`
      //     }
      //   }
      // );

      const payload = {
        status: txData.status
      };

      if (selectedTx.type === "withdraw") {
        payload.withdrawMethod = txData.withdrawMethod;
      }

      const res = await axios.put(`${SERVER_API_URL}/api/transactions/update/${selectedTxId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      );

      if (res.status === 200) {
        toast.success("Status Updated ✅");

        // 🔥 UI update without reload
        setTransactions((prev) =>
          prev.map((tx) =>
            tx.id === selectedTxId
              ? { ...tx, status: txData.status }
              : tx
          )
        );
        await fetchUser();
        fetchTransactions()
        setShowTxModal(false);
      }

    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };


  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % scannerList.length);
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === 0 ? scannerList.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    fetchScanner();
    fetchTransactions();
  }, []);

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

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


  if (!userData || !userData.email) {
    return (
      <div className="loading-wrapper">
        <h2 className="loading-text">Loading...</h2>
      </div>
    );
  }


  return (
    <>
      <ToastContainer position="top-right" autoClose={4000} newestOnTop
        pauseOnHover
        theme="dark"
      />

      <div className="transaction-main-container">
        <div className="account-container">

          {/* TOP SECTION */}
          <div className="top-section">

            {/* LEFT SIDE */}
            <div className="left-box" onClick={() => setShowScannerModal(true)}>

              {scannerList.length > 0 && currentScanner && (
                <>
                  <h3 className="payment-heading">
                    Admin Upload Scanner
                  </h3>
                  {/* Slider */}
                  <div className="slider-container">
                    <button className="slide-btn left" onClick={prevSlide}>‹</button>

                    <img
                      src={`${SERVER_API_URL}/${currentScanner.scannerImage}`}
                      className="scanner-img"
                      alt="scanner"
                    />

                    <button className="slide-btn right" onClick={nextSlide}>›</button>
                  </div>

                  {/* Payment Address */}
                  <div className="payment-box">
                    <p>Payment Address</p>

                    <span className="break">
                      {currentScanner.scannerPayAdd}
                    </span>

                    <button
                      className="copy-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(currentScanner.scannerPayAdd);
                      }}
                    >
                      Copy Link
                    </button>
                  </div>
                </>
              )}

            </div>

            {/* RIGHT SIDE */}
            <div className="right-box">
              <h2>{userData.name}</h2>

              <div className="info-row">
                <span>Email</span>
                <span>{userData.email}</span>
              </div>

              <div className="info-row">
                <span>User ID</span>
                <span>{userData.userCode}</span>
              </div>

              <div className="info-row">
                <span>Wallet</span>
                <span>${userData.wallet}</span>
              </div>

              <div className="info-row">
                <span>Referral Code</span>
                <span>{userData.referralCode}</span>
              </div>

              <div className="info-row">
                <span>Rank</span>
                <span>RANK {userData.rankId}</span>
              </div>

              <div className="info-row">
                <span></span>
                <button className="statu-Logut-btn" onClick={handleLogout}>⬅ Logout</button>
              </div>

            </div>

          </div>

          {/* BOTTOM SECTION - TRANSACTIONS */}
          <div className="transaction-section">
            <h3>Transaction History</h3>
            <div className="transaction-list">
              {transactions.length === 0 ? (
                <p>No transactions found</p>
              ) : (
                transactions.map((tx) => (
                  <div className="transaction-card" key={tx.id}>
                    <div className="tx-left">
                      <p className="amount">${tx.amount}</p>
                      <span className="method">
                        {tx.type === "deposit"
                          ? tx.paymentMethod || "N/A"
                          : tx.withdrawMethod || "N/A"}
                      </span>
                    </div>

                    {tx.type === "withdraw" && (
                      <div className="charge-box">
                        <span className="charge-text">
                          Deduction (10%): Admin 5% + TDS 5%
                        </span>
                      </div>
                    )}

                    <div className="tx-center">
                      {tx.screenshot && (
                        <img src={`${SERVER_API_URL}/${tx.screenshot}`} alt="proof" />
                      )}
                    </div>

                    <div className="upi-status-image">

                      <span className={`status type`}>
                        {tx.user.name}
                      </span>

                      {/* 👉 DATE TIME */}
                      <p className="tx-date">
                        {formatDateTime(tx.createdAt)}
                      </p>

                      <div className="tx-right">
                        <span className={`status type`}>
                          {tx.type} Status
                        </span>
                      </div>


                      <div className="tx-right">
                        <span className={`status ${tx.status}`} onClick={() => {
                          setShowTxModal(true);
                          setSelectedTxId(tx.id);
                          setSelectedTx(tx);
                          // setTxData({ status: tx.status });
                          setTxData({
                            status: tx.status,
                            withdrawMethod: tx.withdrawMethod || "BEP 20/USDT"
                          });
                        }}>
                          {tx.status}
                        </span>
                      </div>
                    </div>

                  </div>
                ))
              )}
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

            {/* Big Scanner Image */}
            <img src={`${SERVER_API_URL}/${currentScanner.scannerImage}`} alt="Scanner" className="big-scanner" />

            <h3>Update Wallet</h3>

            {/* Payment Address */}
            <div className="payment-info">
              <span>Payment Address:</span>
              <span className="break">{currentScanner.scannerPayAdd}</span>
            </div>

          </div>
        </div>
      )}

      {/* 🔥 POPUP */}
      {showTxModal && selectedTx && (
        <div className="modal">
          <div className="modal-box">

            {/* Close */}
            <span className="close-btn" onClick={() => setShowTxModal(false)}>
              ✖
            </span>

            <h3>Transaction Approval</h3>

            {/* 🔥 USER + TX DETAILS */}

            <div className="tx-details">

              <div className="wallet-box">
                <span className="wallet-amount">
                  $ {selectedTx.user?.wallet}
                </span>
              </div>

              <div className="detail-row">
                <span>Name:</span>
                <span>{selectedTx.user?.name || "N/A"}</span>
              </div>

              <div className="detail-row">
                <span>Email:</span>
                <span>{selectedTx.user?.email || "N/A"}</span>
              </div>

              <div className="detail-row">
                <span>Amount:</span>
                <span>${selectedTx.amount}</span>
              </div>

              <div className="detail-row">
                <span>Payment Type:</span>
                <span>{selectedTx.paymentMethod}</span>
              </div>

              <div className="detail-row">
                <span>Status:</span>
                <span className={`status ${selectedTx.status}`}>
                  {selectedTx.status}
                </span>
              </div>

              {selectedTx.type === "withdraw" && selectedTx.amount > 0 && (
                <>
                  {(() => {
                    const amount = Number(selectedTx.amount);
                    const adminCharge = amount * 0.05;
                    const tds = amount * 0.05;
                    const totalDeduction = adminCharge + tds;
                    const approvedAmount = amount - totalDeduction;

                    return (
                      <div className="withdraw-summary">
                        <p><strong>Deduction:</strong> ${totalDeduction.toFixed(2)}</p>
                        <p>Admin Charge (5%): ${adminCharge.toFixed(2)}</p>
                        <p>TDS (5%): ${tds.toFixed(2)}</p>
                        <p style={{ color: "green" }}>
                          <strong>Approved Amount:</strong> ${approvedAmount.toFixed(2)}
                        </p>
                      </div>
                    );
                  })()}

                  {/* 🔥 User Scanner Preview */}
                  {selectedTx.user.userScanner && (
                    <div className="tx-proof">
                      <p>📸 Admin: Kindly make the payment on this scanner</p>
                      <img
                        className="popup-image-selected"
                        src={`${SERVER_API_URL}/${selectedTx.user.userScanner}`}
                        alt="proof"
                      />
                      <div className="payment-address-box">
                        <p className="payment-label">Payment Address</p>
                        <p
                          className="payment-address"
                          onClick={() => {
                            navigator.clipboard.writeText(selectedTx.user.paymentAddress);
                            toast.success("Copied!");
                          }}
                        >
                          {selectedTx.user.paymentAddress}
                        </p>
                      </div>
                    </div>
                  )}

                </>
              )}

            </div>

            {/* 🔥 Screenshot Preview */}
            {selectedTx.screenshot && (
              <div className="tx-proof">
                <p>📸 Payment Proof Submitted by User</p>
                <img
                  className="popup-image-selected"
                  src={`${SERVER_API_URL}/${selectedTx.screenshot}`}
                  alt="proof"
                />
              </div>
            )}

            {/* 🔥 STATUS CHANGE */}
            <select
              name="status"
              onChange={handleChange}
              value={txData.status}
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            {selectedTx.type === "withdraw" && selectedTx.amount > 0 && (
              <select
                name="withdrawMethod"
                value={txData.withdrawMethod || "BEP 20/USDT"}
                onChange={handleChange}
              >
                <option value="BEP 20/USDT">🟡 BEP 20 / USDT (BSC)</option>
                <option value="TRC 20/USDT">🔴 TRC 20 / USDT (TRON)</option>
                <option value="Polygon/USDT">🟣 Polygon / USDT</option>
              </select>
            )}


            {/* ACTIONS */}
            <div className="modal-actions">
              <button onClick={handleUpdateStatus}>Submit</button>
              <button onClick={() => setShowTxModal(false)}>Cancel</button>
            </div>

          </div>
        </div>
      )}

    </>
  );
};