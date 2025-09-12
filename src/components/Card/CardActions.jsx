import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './CardActions.css';

export default function CardActions({ onEdit, onDelete }) {
  return (
    <div className="card-action-icons">
      <FaEdit className="card-action-icon" onClick={onEdit} />
      <FaTrash className="card-action-icon" onClick={onDelete} />
    </div>
  );
}
