import React from 'react';
import PropTypes from 'prop-types';
import styles from './Dropdown.module.css';

/**
 * Dropdown - A simple, accessible dropdown/select component.
 * Props:
 *   options: array of { value, label }
 *   value: selected value
 *   onChange: function (event)
 *   label: string (optional)
 *   id: string (optional)
 *   disabled: boolean (optional)
 */
const Dropdown = ({ options, value, onChange, label, id, disabled }) => (
  <div className={styles.dropdownWrapper}>
    {label && (
      <label htmlFor={id} className={styles.dropdownLabel}>{label}</label>
    )}
    <select
      id={id}
      className={styles.dropdown}
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

Dropdown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Dropdown;
