
import React, { useState } from 'react';
import { FaSave } from 'react-icons/fa';
import CardActions from './CardActions';
import Tag from '../Tag/Tag';
import './EditableCard.css';

const EditableCard = ({ title, description, tag, timestamp, onEdit, onDelete, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);
  const MAX_DESCRIPTION_LENGTH = 140;
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
          />
        ) : (
          <span className="editable-card-title">{title}</span>
        )}
        {isEditing ? (
          <div className="card-action-icons">
            <FaSave className="card-action-icon" onClick={handleSaveClick} />
            <CardActions onDelete={onDelete} />
          </div>
        ) : (
          <CardActions onEdit={handleEditClick} onDelete={onDelete} />
        )}
      </div>
      <div className="editable-card-body">
        {isEditing ? (
          <>
            <textarea
              value={editDescription}
              onChange={e => {
                if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) {
                  setEditDescription(e.target.value);
                }
              }}
              className={`text-box${editDescription.length === MAX_DESCRIPTION_LENGTH ? ' text-box-limit' : ''}`}
              rows={2}
              maxLength={MAX_DESCRIPTION_LENGTH}
            />
            <div className="description-counter">
              {editDescription.length}/{MAX_DESCRIPTION_LENGTH}
            </div>
          </>
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
            tag ? <Tag text={tag} /> : null
          )}
          <span className="editable-card-timestamp">{timestamp}</span>
      </div>
    </div>
  );
};

export default EditableCard;
