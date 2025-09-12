import React from 'react';
import styles from './DropZone.module.css';

const DropZone = ({ onDrop, children }) => {
  return (
    <div className={styles.dropZone}>
      {children}
    </div>
  );
};

export default DropZone;
