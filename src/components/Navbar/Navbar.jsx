
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ children }) {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <button className="navbar-btn" onClick={() => navigate("/home")}>Home</button>
        <button className="navbar-btn" onClick={() => navigate("/dailys")}>Dailys</button>
        {children}
      </div>
    </nav>
  );
}
