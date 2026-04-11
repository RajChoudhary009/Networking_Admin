import React, { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_API_URL } from "../../server/server";
import "./index.css";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

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

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
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
              <div className="user-card" key={user.id}>

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
  );
};

export default UsersPage;