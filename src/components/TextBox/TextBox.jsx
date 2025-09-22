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

function TextBox({ label, value, onChange, placeholder = "", ...rest }) {
  return (
    <div>
      <label className={styles["textbox-label"]}>{label}</label>
      <textarea
        className={styles["text-box"]}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
}


TextBox.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  rows: PropTypes.number
};

export default TextBox;
