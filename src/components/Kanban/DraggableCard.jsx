import React from 'react';
import styles from './DraggableCard.module.css';

const DraggableCard = ({ children }) => {
  return (
    <div className={styles.draggableCard}>
      {children}
    </div>
  );
};

export default DraggableCard;
