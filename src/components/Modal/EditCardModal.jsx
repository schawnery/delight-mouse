import React from 'react';
import PropTypes from 'prop-types';

import Modal from './Modal';
import styles from './Modal.module.css';
import TextBox from '../TextBox/TextBox';
import Button from '../Button/Button';

export default function EditCardModal({ open, card, onSave, onDelete, onClose }) {
  const [title, setTitle] = React.useState(card?.title || '');
  const [description, setDescription] = React.useState(card?.description || '');
  const [tag, setTag] = React.useState(card?.tag || '');
  const [priority, setPriority] = React.useState(card?.priority || '');
  const formRef = React.useRef();

  React.useEffect(() => {
    setTitle(card?.title || '');
    setDescription(card?.description || '');
    setTag(card?.tag || '');
    setPriority(card?.priority || '');
  }, [card]);

  // Handle Ctrl+Enter to save
  React.useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (formRef.current) {
          formRef.current.requestSubmit();
        }
      }
    };
    if (open) {
      window.addEventListener('keydown', handler);
    }
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [open]);

  return (
    <Modal isOpen={open} onClose={onClose}>
      <form ref={formRef} className={styles.form} onSubmit={e => { e.preventDefault(); onSave({ ...card, title, description, tag, priority }); }}>
        <h2>Edit the Card</h2>
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
          <Button type="button" className="secondaryButton secondaryButton--red" onClick={() => onDelete(card.id)}>
            Delete
          </Button>
          <div className={styles.actionGroup}>
            <Button type="button" className="secondaryButton secondaryButton--black" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="button">Save</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

EditCardModal.propTypes = {
  open: PropTypes.bool.isRequired,
  card: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
