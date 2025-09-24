import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';

const Button = ({ children, onClick, type = 'button', className = '', ...props }) => {
  // Support both CSS module and global class names
  const classNames = [styles.button];
  if (className) {
    className.split(' ').forEach(cls => {
      if (styles[cls]) {
        classNames.push(styles[cls]);
      } else {
        classNames.push(cls);
      }
    });
  }
  return (
    <button
      type={type}
      className={classNames.join(' ').trim()}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string,
  className: PropTypes.string,
};

export default Button;
