
import React, { useState } from 'react';
import { FaTrash, FaEdit, FaSave } from 'react-icons/fa';
import Tag from '../Tag/Tag';
import './EditableCard.css';

const EditableCard = ({ title, description, tag, timestamp, onEdit, onDelete, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);
  const [editTag, setEditTag] = useState(tag);

  const handleEditClick = () => {
    setIsEditing(true);
    if (onEdit) onEdit();
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    if (onSave) {
      onSave({
        title: editTitle,
        description: editDescription,
        tag: editTag,
        timestamp,
        type: 'editable',
      });
    }
  };

  return (
    <div className="editable-card">
      <div className="editable-card-header">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            className="text-box"
            style={{ marginBottom: '0.5em', width: '100%', maxWidth: 400 }}
          />
        ) : (
          <span className="editable-card-title">{title}</span>
        )}
        <div className="editable-card-actions">
          {isEditing ? (
            <FaSave className="editable-card-icon" onClick={handleSaveClick} />
          ) : (
            <FaEdit className="editable-card-icon" onClick={handleEditClick} />
          )}
          <FaTrash className="editable-card-icon" onClick={onDelete} />
        </div>
      </div>
      <div className="editable-card-body">
        {isEditing ? (
          <textarea
            value={editDescription}
            onChange={e => setEditDescription(e.target.value)}
            className="text-box"
            rows={2}
            style={{ marginBottom: '0.5em', width: '100%', maxWidth: 400, textAlign: 'left' }}
          />
        ) : (
          <span className="editable-card-description" style={{ textAlign: 'left', display: 'block' }}>{description}</span>
        )}
      </div>
      <div className="editable-card-footer">
        {isEditing ? (
          <input
            type="text"
            value={editTag}
            onChange={e => setEditTag(e.target.value)}
            className="text-box"
            style={{ marginBottom: '0.5em', width: '100%', maxWidth: 400 }}
          />
        ) : (
          <Tag text={tag} />
        )}
        <span className="editable-card-timestamp">{timestamp}</span>
      </div>
    </div>
  );
};

export default EditableCard;
