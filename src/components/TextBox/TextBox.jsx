import React from "react";
import "./TextBox.css";

/**
 * TextBox - A multi-line text entry component.
 * Props:
 *   value: string
 *   onChange: function (event)
 *   placeholder: string (optional)
 *   rows: number (optional, default 3)
 *   ...rest: any other textarea props
 */
export default function TextBox({ value, onChange, placeholder = "", rows = 3, ...rest }) {
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
