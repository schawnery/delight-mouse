import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ children }) {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <button className="navbar-btn" onClick={() => navigate("/dailys")}>Dailys</button>
        <button className="navbar-btn" onClick={() => navigate("/home")}>Home</button>
        <button className="navbar-btn" onClick={() => navigate("/about")}>About</button>
        {children}
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  children: PropTypes.node
};

export default Navbar;
