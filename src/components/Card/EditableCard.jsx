import React from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import Tag from '../Tag/Tag';
import './EditableCard.css';

const EditableCard = ({ title, description, tag, timestamp, onEdit, onDelete }) => (
  <div className="editable-card">
    <div className="editable-card-header">
      <span className="editable-card-title">{title}</span>
      <div className="editable-card-actions">
        <FaEdit className="editable-card-icon" onClick={onEdit} />
        <FaTrash className="editable-card-icon" onClick={onDelete} />
      </div>
    </div>
    <div className="editable-card-body">
      <span className="editable-card-description">{description}</span>
    </div>
    <div className="editable-card-footer">
      <Tag text={tag} />
      <span className="editable-card-timestamp">{timestamp}</span>
    </div>
  </div>
);

export default EditableCard;
