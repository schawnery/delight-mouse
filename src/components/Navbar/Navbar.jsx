import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar({ children }) {
  const navigate = useNavigate();
  return (
    <nav className={styles.navbar}>
      <div className={styles["navbar-content"]}>
        <button className={styles["navbar-btn"]} onClick={() => navigate("/play")}>Play</button>
        <button className={styles["navbar-btn"]} onClick={() => navigate("/about")}>About</button>
        {children}
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  children: PropTypes.node
};

export default Navbar;
