import React from 'react';
import PropTypes from 'prop-types';
import styles from './Timestamp.module.css';

/**
 * Timestamp - Displays a formatted date/time string.
 * Props:
 *   date: Date|string|number (required)
 *   format: string (optional, e.g. 'short', 'long', 'time', 'date')
 */
export default function Timestamp({ date, format = 'short' }) {
  let dt = date instanceof Date ? date : new Date(date);
  let formatted = '';
  switch (format) {
    case 'long':
      formatted = dt.toLocaleString();
      break;
    case 'time':
      formatted = dt.toLocaleTimeString();
      break;
    case 'date':
      formatted = dt.toLocaleDateString();
      break;
    case 'short':
    default:
      formatted = dt.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });
      break;
  }
  return <span className={styles.timestamp}>{formatted}</span>;
}

Timestamp.propTypes = {
  date: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  format: PropTypes.oneOf(['short', 'long', 'time', 'date'])
};
