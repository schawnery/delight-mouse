import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import styles from './CardActions.module.css';

export default function CardActions({ onEdit, onDelete }) {
  return (
    <div className={styles["card-action-icons"]}>
      <FaEdit className={styles["card-action-icon"]} onClick={onEdit} />
      <FaTrash className="card-action-icon" onClick={onDelete} />
    </div>
  );
}
