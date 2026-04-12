import React from 'react';
import { useNavigate } from "react-router-dom";
import "./index.css"

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div className="access-denied-container" style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", }}>
            <div className="access-box">
                <h1>🚫 404</h1>
                <p>
                    Oops! The page you're looking for doesn't exist. <br />
                    It might have been removed, renamed, or the link is incorrect.
                </p>
                <button className="back-btn" onClick={() => navigate('/')}>Go Back</button>
            </div>
        </div>
    )
}

export default NotFound;