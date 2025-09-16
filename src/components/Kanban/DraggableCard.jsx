{/*import React from 'react';
import styles from './DraggableCard.module.css';
import PropTypes from 'prop-types';

const DraggableCard = ({ children }) => {
  return (
    <div className={styles.draggableCard}>
      {children}
    </div>
  );
};

DraggableCard.propTypes = {
  card: PropTypes.object.isRequired,
  column: PropTypes.string.isRequired,
  index: PropTypes.number,
  handleCardMove: PropTypes.func,
  handleDeleteCard: PropTypes.func,
  columnSetters: PropTypes.object,
  STORAGE_KEYS: PropTypes.object
};

export default DraggableCard;*/}

import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FaTrash } from 'react-icons/fa';
import Card from '../Card/Card';
import EditableCard from '../Card/EditableCard';

const DraggableCard = ({ 
  card, 
  column, 
  index, 
  onCardMove, 
  onCardDelete, 
  onCardSave 
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CARD',
    item: { ...card, sourceColumn: column },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ handlerId }, drop] = useDrop(() => ({
    accept: 'CARD',
    drop: (draggedCard, monitor) => {
      if (!draggedCard || draggedCard.timestamp === card.timestamp) return;
      // Handle drop on this specific card position
      onCardMove(draggedCard, column, index);
    },
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
    hover: (draggedCard, monitor) => {
      if (!draggedCard || draggedCard.timestamp === card.timestamp) return;
      // Optional: Add visual feedback during hover
    }
  }));

  const attachToCard = (el) => {
    drag(drop(el));
  };

  const cardStyle = {
    opacity: isDragging ? 0.5 : 1,
    cursor: 'move',
    position: 'relative',
    marginBottom: '8px',
  };

  if (card.type === 'editable') {
    return (
      <div
        ref={attachToCard}
        data-handler-id={handlerId}
        style={cardStyle}
      >
        <EditableCard
          title={card.title}
          description={card.description}
          tag={card.tag}
          timestamp={card.timestamp}
          onDelete={() => onCardDelete(card, column)}
          onSave={onCardSave}
        />
      </div>
    );
  }

  return (
    <div
      ref={attachToCard}
      data-handler-id={handlerId}
      style={cardStyle}
    >
      <Card>
        <p>{card.prompt}</p>
        <span className="card-timestamp">{card.timestamp}</span>
        <FaTrash
          style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            cursor: 'pointer',
            color: 'grey',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onCardDelete(card, column);
          }}
        />
      </Card>
    </div>
  );
};

export default DraggableCard;
