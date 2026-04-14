import React, { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_API_URL } from "../../server/server";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./index.css";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({});

  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(value) ||
      user.email?.toLowerCase().includes(value) ||
      user.userCode?.toLowerCase().includes(value)
    );
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${SERVER_API_URL}/api/users`);
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("User fetch error:", err);
    }
  };

  const handleUpdate = async () => {
    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (
          formData[key] !== undefined &&
          formData[key] !== "" &&
          formData[key] !== null
        ) {
          data.append(key, formData[key]);
        }
      });

      const token = localStorage.getItem("global_user_token");

      if (!token) {
        toast.error("❌ Unauthorized! Please login again");
        return;
      }

      await axios.put(`${SERVER_API_URL}/api/users/update/byAdmin/${selectedUser.userId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );

      toast.success("✅ User updated successfully");

      fetchUsers();
      setSelectedUser(null);

    } catch (err) {
      console.error("Update error:", err);

      toast.error(
        err?.response?.data?.message || "❌ Failed to update user"
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={4000} newestOnTop
        pauseOnHover
        theme="dark"
      />

      <div className="users-main">
        <div className="users-container">
          <h2 className="users-title">👥 All Users</h2>

          <div className="search-box">
            <input
              type="text"
              placeholder={`🔍 Search ${users.length} users by name, email, or ID...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filteredUsers.length === 0 ? (
            <p className="users-no-data">No Users Found</p>
          ) : (
            <div className="users-grid">
              {filteredUsers.map((user) => (
                <div className="user-card" key={user.id} onClick={() => {
                  setSelectedUser(user);
                  setFormData(user); // pre-fill
                }}>

                  {/* Avatar */}
                  <div className="user-avatar">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="user-info">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                  </div>

                  {/* Details */}
                  <div className="user-details">
                    <p><strong>ID:</strong> {user.userCode}</p>
                    <p><strong>Wallet:</strong> ${user.wallet}</p>
                    <p><strong>Rank:</strong> {user.rankId}</p>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedUser && (
        <div className="popup-overlay" onClick={() => setSelectedUser(null)}>
          <div className="popup-box" onClick={(e) => e.stopPropagation()}>

            <h2>Edit User</h2>

            {/* 🔥 TOP - Scanner Preview */}
            <div className="scanner-preview">
              <p>User Scanner</p>

              {preview ? (
                <img src={preview} alt="preview" className="scanner-img" />
              ) : (
                selectedUser?.userScanner && (
                  <img
                    src={`${SERVER_API_URL}/${selectedUser.userScanner}`}
                    alt="scanner"
                    className="scanner-img"
                  />
                )
              )}
            </div>

            {/* 🔥 Upload New Scanner */}
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                setFormData({ ...formData, userScanner: file });

                if (file) {
                  setPreview(URL.createObjectURL(file));
                }
              }}
            />

            {/* 🔥 Inputs */}
            <input
              type="text"
              placeholder="email"
              defaultValue={selectedUser.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Name"
              defaultValue={selectedUser.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Payment Address"
              defaultValue={selectedUser.paymentAddress}
              onChange={(e) =>
                setFormData({ ...formData, paymentAddress: e.target.value })
              }
            />

            {/* <input
              type="text"
              placeholder="Rank ID"
              defaultValue={selectedUser.rankId}
              onChange={(e) =>
                setFormData({ ...formData, rankId: e.target.value })
              }
            /> */}

            <input
              type="text"
              placeholder="Role"
              defaultValue={selectedUser.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            />

            {/* 🔥 Buttons */}
            <div className="popup-actions">
              <button onClick={() => setSelectedUser(null)}>Cancel</button>
              <button onClick={handleUpdate}>Update</button>
            </div>

          </div>
        </div>
      )}

    </>
  );
};

export default UsersPage;