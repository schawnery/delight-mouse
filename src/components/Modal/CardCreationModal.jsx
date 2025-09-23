// components/Modal/CardCreationModal.jsx
import React, { useState } from 'react';
import Modal from './Modal';
import TextBox from '../TextBox/TextBox';

const CardCreationModal = ({ 
  isOpen, 
  onClose, 
  onCreateCard, 
  maxQueued, 
  canCreate 
}) => {
  const [cardTitle, setCardTitle] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [cardTag, setCardTag] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cardTitle.trim() && canCreate) {
      const timestamp = new Date().toLocaleString();
      onCreateCard({
        title: cardTitle.trim(),
        description: cardDescription.trim(),
        tag: cardTag.trim(),
        timestamp,
        type: 'editable',
      });
      setCardTitle("");
      setCardDescription("");
      setCardTag("");
      onClose();
    }
  };

  const handleClose = () => {
    setCardTitle("");
    setCardDescription("");
    setCardTag("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="modal-header">
        <div>
          <div className="modal-title">Create New Card</div>
          <div className="modal-desc">
            Add a new task card to your kanban board. It will be added to the Queued column.
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="modal-form-row">
          <input
            className="modal-input"
            placeholder="Enter card title..."
            value={cardTitle}
            onChange={e => {
              if (e.target.value.length <= 55) {
                setCardTitle(e.target.value);
              }
            }}
            maxLength={55}
            required
          />
          <div className={`input-counter${cardTitle.length === 55 ? ' input-counter-limit' : ''}`}>
            {cardTitle.length}/55
          </div>
        </div>
        
        <div className="modal-form-row">
          <label className="modal-label" htmlFor="modal-desc">Description</label>
          <TextBox
            id="modal-desc"
            value={cardDescription}
            onChange={e => {
              if (e.target.value.length <= 140) {
                setCardDescription(e.target.value);
              }
            }}
            placeholder="Enter card description..."
            rows={3}
            maxLength={140}
          />
          <div className={`input-counter${cardDescription.length === 140 ? ' input-counter-limit' : ''}`}>
            {cardDescription.length}/140
          </div>
        </div>
        
        <div className="modal-form-row">
          <label className="modal-label" htmlFor="modal-tag">Tag</label>
          <input
            id="modal-tag"
            type="text"
            className="modal-input"
            placeholder="Enter tag (optional)..."
            value={cardTag}
            onChange={e => setCardTag(e.target.value)}
            maxLength={32}
          />
        </div>
        
        <div className="modal-actions">
          <button
            type="button"
            className="modal-cancel-btn"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="modal-submit-btn"
            disabled={!cardTitle.trim() || !canCreate}
          >
            Create Card
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CardCreationModal;