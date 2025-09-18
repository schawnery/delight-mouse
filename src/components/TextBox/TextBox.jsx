import React from "react";
import PropTypes from "prop-types";
import styles from "./TextBox.module.css";

/**
 * TextBox - A multi-line text entry component.
 * Props:
 *   value: string
 *   onChange: function (event)
 *   placeholder: string (optional)
 *   rows: number (optional, default 3)
 *   ...rest: any other textarea props
 */
function TextBox({ value, onChange, placeholder = "", rows = 3, ...rest }) {
  return (
    <textarea
      className="text-box"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      {...rest}
    />
  );
}

TextBox.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  rows: PropTypes.number
};

export default TextBox;
