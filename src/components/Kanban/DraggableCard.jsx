import React from 'react';
import styles from './DraggableCard.module.css';
import PropTypes from 'prop-types';

const DraggableCard = ({ children }) => {
  return (
    <div className={styles.draggableCard}>
      {children}
    </div>
  );
};

DraggableCard.propTypes = {
  card: PropTypes.object.isRequired,
  column: PropTypes.string.isRequired,
  index: PropTypes.number,
  handleCardMove: PropTypes.func,
  handleDeleteCard: PropTypes.func,
  columnSetters: PropTypes.object,
  STORAGE_KEYS: PropTypes.object
};

export default DraggableCard;
