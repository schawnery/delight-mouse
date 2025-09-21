import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import styles from './CardCreateForm.module.css';

const CardCreateForm = ({ onCreate, onCancel, defaultColumnId, columns }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [columnId, setColumnId] = useState(defaultColumnId || (columns[0]?.id || ''));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({
      title: title.trim(),
      description: description.trim(),
      columnId,
    });
    setTitle('');
    setDescription('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label}>
        Title
        <input
          className={styles.input}
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </label>
      <label className={styles.label}>
        Description
        <textarea
          className={styles.textarea}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </label>
      <label className={styles.label}>
        Column
        <select
          className={styles.select}
          value={columnId}
          onChange={e => setColumnId(e.target.value)}
        >
          {columns.map(col => (
            <option key={col.id} value={col.id}>{col.title}</option>
          ))}
        </select>
      </label>
      <div className={styles.actions}>
        <Button type="submit">Create Card</Button>
        <Button type="button" onClick={onCancel} className={styles.cancelBtn}>Cancel</Button>
      </div>
    </form>
  );
};

CardCreateForm.propTypes = {
  onCreate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  defaultColumnId: PropTypes.string,
  columns: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })).isRequired,
};

export default CardCreateForm;
