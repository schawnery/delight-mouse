import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './DragCard.module.css';
import { useDraggable, useDroppable } from '@dnd-kit/core';

const DragCard = ({ id, title, description, initialTag = '', value = 0 }) => {
  const [userTag, setUserTag] = useState(initialTag);
  const { attributes, listeners, setNodeRef: setDraggableNodeRef, transform, isDragging } = useDraggable({ id });
  const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({ id });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, opacity: isDragging ? 0.5 : 1, cursor: 'grab', background: isOver ? '#e0e0ff' : undefined }
    : { opacity: isDragging ? 1 : 1, cursor: 'grab', background: isOver ? '#e0e0ff' : undefined };

  // Compose refs for draggable and droppable
  const setRefs = (node) => {
    setDraggableNodeRef(node);
    setDroppableNodeRef(node);
  };

  return (
    <div ref={setRefs} style={style} {...attributes} {...listeners} className={styles["drag-card"]}>
      <div className={styles["drag-card-header"]}>
        <h3>{title}</h3>
      </div>
      <div className={styles["drag-card-body"]}>
        <p>{description}</p>
      </div>
      <div className={styles["drag-card-tags"]}>
        <input
          type="text"
          className={styles["drag-card-tag-input"]}
          value={userTag}
          onChange={e => setUserTag(e.target.value)}
          placeholder="Enter tag"
        />
        <span className={styles["drag-card-value-tag"]}>{value}</span>
      </div>
    </div>
  );
};

DragCard.propTypes = {
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	initialTag: PropTypes.string,
	value: PropTypes.number
};

export default DragCard;