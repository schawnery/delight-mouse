import React from 'react';
import PropTypes from 'prop-types';
import styles from './DropZone.module.css';

const DropZone = ({ onDrop, children }) => {
  return (
    <div className={styles.dropZone}>
      {children}
    </div>
  );
};

DropZone.propTypes = {
  onDrop: PropTypes.func,
  children: PropTypes.node
};

export default DropZone;
