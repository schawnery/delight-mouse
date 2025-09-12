import React from "react";
import PropTypes from "prop-types";
import "./Card.css";

function Card({ children, className = "", ...rest }) {
  return (
    <div className={`card ${className}`} {...rest}>
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default Card;
