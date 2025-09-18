import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar({ children }) {
  const navigate = useNavigate();
  return (
    <nav className={styles.navbar}>
        <button className={styles["navbar-btn"]} onClick={() => navigate("/play")}>Play</button>
        <button className={styles["navbar-btn"]} onClick={() => navigate("/about")}>About</button>
        {children}
    </nav>
  );
}

Navbar.propTypes = {
  children: PropTypes.node
};

export default Navbar;
