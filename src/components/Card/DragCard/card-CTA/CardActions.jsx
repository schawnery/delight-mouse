import React from 'react';
import PropTypes from 'prop-types';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function CardActions({ onEdit, onDelete }) {
  return (
    <div className="card-action-icons">
      <FaEdit className="card-action-icon" onClick={onEdit} />
      <FaTrash className="card-action-icon" onClick={onDelete} />
    </div>
  );
}

CardActions.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
