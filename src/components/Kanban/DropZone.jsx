{/*import React from 'react';
import PropTypes from 'prop-types';
import styles from './DropZone.module.css';

const DropZone = ({ onDrop, children }) => {
  return (
    <div className={styles.dropZone}>
      {children}
    </div>
  );
};

DropZone.propTypes = {
  onDrop: PropTypes.func,
  children: PropTypes.node
};

export default DropZone;*/}

// components/Kanban/EnhancedDropZone.jsx
import React from 'react';
import { useDrop } from 'react-dnd';
import dropZoneStyles from './DropZone.module.css';

const EnhancedDropZone = ({ onDrop, children }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'CARD',
    drop: (item, monitor) => {
      // If dropped on the column but not on a specific card, add to end
      if (!monitor.didDrop()) {
        onDrop(item, null);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  }));

  // Use CSS modules for drop zone styling
  const dropZoneClass = isOver
    ? `${dropZoneStyles['drop-zone']} ${dropZoneStyles['drop-zone-active']}`
    : dropZoneStyles['drop-zone'];

  return (
    <div
      ref={drop}
      className={dropZoneClass}
    >
      {children}
    </div>
  );
};

export default EnhancedDropZone;
