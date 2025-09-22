import React from 'react';
import PropTypes from 'prop-types';

import Modal from './Modal';
import styles from './Modal.module.css';
import TextBox from '../TextBox/TextBox';

export default function CreateCardModal({ open, card, onSave, onClose }) {
  const [title, setTitle] = React.useState(card?.title || '');
  const [description, setDescription] = React.useState(card?.description || '');
  const [tag, setTag] = React.useState(card?.tag || '');
  const [priority, setPriority] = React.useState(card?.priority || '');

  React.useEffect(() => {
    setTitle(card?.title || '');
    setDescription(card?.description || '');
    setTag(card?.tag || '');
    setPriority(card?.priority || '');
  }, [card]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Always assign to queued column; parent should handle column assignment
    onSave({
      ...card,
      title,
      description,
      tag,
      priority,
      column: 'queued',
    });
  };

  return (
    <Modal isOpen={open} onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Create a Card</h2>
        <TextBox
          label="Task name"
          onChange={e => setTitle(e.target.value)}
          value={title}
          rows={1}
        />
        <TextBox
          label="Details"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
        />
        <TextBox
          label="Tag name"
          value={tag}
          onChange={e => setTag(e.target.value)}
          rows={1}
        />
        <TextBox
          label="Priority value"
          value={priority}
          onChange={e => setPriority(e.target.value)}
          rows={1}
        />
        <div className={styles.actions}>
          <button type="submit" className={styles.saveBtn}>Create</button>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
}

CreateCardModal.propTypes = {
  open: PropTypes.bool.isRequired,
  card: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
