import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './DragCard.module.css';
import Timestamp from '../../Timestamp/Timestamp';
import Tag from '../../Tag/Tag';
import { useDraggable, useDroppable } from '@dnd-kit/core';

const DragCard = ({ id, title, description, tag = '', value = 0, priority = '', created, onClick, onEdit, onDelete }) => {
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

  // Only treat as click if not dragged
  const [mouseDown, setMouseDown] = useState(null);
  // Determine created time: use prop if present, else parse from id if possible
  let createdTime = created;
  if (!createdTime && id && id.startsWith('card-')) {
    const ts = Number(id.replace('card-', ''));
    if (!isNaN(ts)) createdTime = ts;
  }
  const handleMouseDown = (e) => {
    setMouseDown({ x: e.clientX, y: e.clientY, time: Date.now() });
  };
  const handleMouseUp = (e) => {
    if (!onClick || !mouseDown) return;
    const dx = Math.abs(e.clientX - mouseDown.x);
    const dy = Math.abs(e.clientY - mouseDown.y);
    const dt = Date.now() - mouseDown.time;
    if (dx < 5 && dy < 5 && dt < 300) {
      onClick();
    }
    setMouseDown(null);
  };
  return (
    <div
      ref={setRefs}
      style={style}
      {...attributes}
      {...listeners}
      className={styles["drag-card"]}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className={styles["drag-card-header"]}>
        {createdTime && (
          <Timestamp date={createdTime} format="short" />
        )}
        <h3 style={{ margin: 0 }}>{title}</h3>
      </div>
      <div className={styles["drag-card-body"]}>
        <p>{description}</p>
      </div>
      
        <div style={{ marginTop: '0.5em', display: 'flex', gap: '0.5em', alignItems: 'center' }}>
          {tag && <Tag text={tag} />}
          {priority !== '' && (
            <Tag text={`Priority: ${priority}`} />
          )}
        </div>
    </div>
  );
};


DragCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  tag: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  priority: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  created: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date),
  ]),
  // Drag and drop handlers
  onClick: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default DragCard;