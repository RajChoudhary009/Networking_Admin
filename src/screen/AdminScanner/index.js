import React, { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_API_URL } from "../../server/server";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

const AdminScanner = () => {
  const [scanners, setScanners] = useState([]);
  const [formData, setFormData] = useState({
    scannerPayAdd: "",
    scannerImage: null
  });

  // 🔥 FETCH
  const fetchScanner = async () => {
    try {
      const res = await axios.get(`${SERVER_API_URL}/api/scanner`);
      setScanners(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load scanners");
    }
  };

  useEffect(() => {
    fetchScanner();
  }, []);

  // 🔥 INPUT CHANGE
  const handleChange = (e) => {
    setFormData({ ...formData, scannerPayAdd: e.target.value });
  };

  const handleFile = (e) => {
    setFormData({ ...formData, scannerImage: e.target.files[0] });
  };

  // 🔥 SUBMIT
  const handleSubmit = async () => {
    if (!formData.scannerPayAdd || !formData.scannerImage) {
      toast.error("All fields required");
      return;
    }

    try {
      const data = new FormData();
      data.append("scannerPayAdd", formData.scannerPayAdd);
      data.append("scannerImage", formData.scannerImage);

      const res = await axios.post(
        `${SERVER_API_URL}/api/scanner`,
        data
      );

      if (res.status === 200) {
        toast.success("Scanner Added ✅");
        setFormData({ scannerPayAdd: "", scannerImage: null });
        fetchScanner();
      }
      setFormData({ scannerPayAdd: "", scannerImage: null });
    } catch (err) {
      toast.error("Upload failed");
      setFormData({ scannerPayAdd: "", scannerImage: null });
    }
  };

  // 🔥 DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this scanner?")) return;

    try {
      await axios.delete(`${SERVER_API_URL}/api/scanner/delete/${id}`);
      toast.success("Deleted ✅");
      fetchScanner();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="scanner-main">
      <ToastContainer style={{ zIndex: 99999 }} />

      <div className="scanner-container">
        <h2 className="title">⚙️ Admin Scanner Panel</h2>

        {/* 🔥 ADD FORM */}
        <div className="scanner-form">
          <input
            type="text"
            placeholder="Enter Payment Address"
            value={formData.scannerPayAdd}
            onChange={handleChange}
          />

          <input type="file" onChange={handleFile} />

          <button onClick={handleSubmit}>Add Scanner</button>
        </div>

        {/* 🔥 LIST */}
        <div className="scanner-grid">
          {scanners.map((item) => (
            <div className="scanner-card" key={item.id}>
              <img
                src={`${SERVER_API_URL}/${item.scannerImage}`}
                alt="scanner"
                className="scanner-img"
              />

              <p className="address">{item.scannerPayAdd}</p>

              <button
                className="delete-btn"
                onClick={() => handleDelete(item.id)}
              >
                🗑 Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminScanner;