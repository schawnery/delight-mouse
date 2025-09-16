
import React, { useState } from 'react';
import { FaSave } from 'react-icons/fa';
import CardActions from './CardActions';
import Tag from '../Tag/Tag';
import './EditableCard.css';
import '../TextBox/TextBox.css';
import PropTypes from 'prop-types';

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
          <div className="editable-card-header-input-wrapper">
            <input
              type="text"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              className="text-box editable-card-title-input"
              maxLength={55}
            />
            <div className="title-counter">
              {editTitle.length}/55
            </div>
          </div>
        ) : (
          <span className="editable-card-title">{title}</span>
        )}
      </div>
      {!isEditing && <CardActions onEdit={handleEditClick} onDelete={onDelete} />}
      <div className="editable-card-body">
        {isEditing ? (
          <div className="editable-card-description-wrapper">
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
          </div>
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
            className="text-box editable-card-tag-input"
          />
        ) : (
          <>
            {tag ? <Tag text={tag} /> : null}
            <span className="editable-card-timestamp">{timestamp}</span>
          </>
        )}
      </div>
      {isEditing && (
        <div className="editable-card-actions-bottom">
          <div className="editable-card-actions-row">
            <button className="delete-btn" onClick={() => { setIsEditing(false); if (onDelete) onDelete(); }}>
              Delete
            </button>
            <div style={{ flex: 1 }} />
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
            <button className="submit-btn" onClick={handleSaveClick}>
              <FaSave style={{ marginRight: '4px' }} /> Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

EditableCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  tag: PropTypes.string,
  timestamp: PropTypes.string.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onSave: PropTypes.func
};

export default EditableCard;
