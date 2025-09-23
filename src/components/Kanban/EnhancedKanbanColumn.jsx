// components/Kanban/EnhancedKanbanColumn.jsx
import React from 'react';
import DropZone from './DropZone';
import DraggableCard from './DraggableCard';

const getHeaderClass = (columnKey) => {
  if (columnKey === 'startedCards') return 'main-window-header queued';
  if (columnKey === 'inProgressCards') return 'main-window-header inprogress';
  if (columnKey === 'completedCards') return 'main-window-header completed';
  return 'main-window-header';
};

const EnhancedKanbanColumn = ({ 
  title, 
  description, 
  cards, 
  columnKey, 
  limit, 
  onCardMove, 
  onCardDelete, 
  onCardSave,
  WIP_LIMIT,
  maxQueued,
  TOTAL_CARD_LIMIT
}) => {
  const handleDrop = (card, position) => {
    // Prevent dropping if limits are reached
    if ((columnKey === 'inProgressCards' && cards.length >= WIP_LIMIT) ||
        (columnKey === 'startedCards' && cards.length >= maxQueued)) {
      return;
    }
    onCardMove(card, columnKey, position);
  };

  const renderCountPill = () => {
    if (columnKey === 'inProgressCards') {
      return `${cards.length}/${WIP_LIMIT}`;
    }
    if (columnKey === 'startedCards') {
      return `${cards.length}/${typeof maxQueued === 'number' ? maxQueued : TOTAL_CARD_LIMIT}`;
    }
    return cards.length;
  };

  return (
    <main className="kanban-column">
      <DropZone onDrop={handleDrop}>
        <div className="challenge-content">
          <div className={getHeaderClass(columnKey)}>
            <h2>{title}</h2>
            <span className="kanban-count-pill">
              {renderCountPill()}
            </span>
          </div>
          <div className="right-cards-wrapper">
            {cards.map((card, index) => (
              <DraggableCard 
                key={`${card.timestamp}-${index}`} 
                card={card}   
                column={columnKey}
                index={index}
                onCardMove={onCardMove}
                onCardDelete={onCardDelete}
                onCardSave={onCardSave}
              />
            ))}
          </div>
        </div>
      </DropZone>
    </main>
  );
};

export default EnhancedKanbanColumn;