
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
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              className="text-box"
              maxLength={55}
              style={{ width: '100%' }}
            />
            <div className="title-counter" style={{ position: 'absolute', right: 8, top: 8, fontSize: '0.85em', color: '#888' }}>
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
          <>
            <div style={{ position: 'relative' }}>
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
                style={{ width: '100%' }}
              />
              <div className="description-counter" style={{ position: 'absolute', right: 8, bottom: 8, fontSize: '0.85em', color: '#888' }}>
                {editDescription.length}/{MAX_DESCRIPTION_LENGTH}
              </div>
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
                  style={{ width: '100%', marginTop: 0 }}
                />
          ) : (
            <>
              {tag ? <Tag text={tag} /> : null}
              <span className="editable-card-timestamp">{timestamp}</span>
            </>
          )}
      </div>
      {isEditing && (
        <>
          {/* ...existing code for edit fields... */}
          <div className="editable-card-actions-bottom" style={{ display: 'flex', flexDirection: 'column', marginTop: '16px' }}>
            <div className="editable-card-actions-row" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '0.5em' }}>
              <button className="delete-btn" onClick={() => { setIsEditing(false); if (onDelete) onDelete(); }} style={{ color: 'red', border: '1px solid #e53e3e', background: '#fff', minWidth: 80 }}>
                Delete
              </button>
              <div style={{ flex: 1 }} />
              <button className="cancel-btn" onClick={() => setIsEditing(false)} style={{ minWidth: 80 }}>Cancel</button>
              <button className="submit-btn" onClick={handleSaveClick} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', minWidth: 80 }}>
                <FaSave style={{ marginRight: '4px' }} /> Save
              </button>
            </div>
          </div>
        </>
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
