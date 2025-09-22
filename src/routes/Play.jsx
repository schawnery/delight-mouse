//load constants and depdendencies
import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';

// load components
import WeeklyProgressBar from '../components/WeeklyProgressBar/WeeklyProgressBar';
// import ScoreBox from '../components/ScoreBox/ScoreBox';
import TextBox from '../components/TextBox/TextBox';
import Column from '../components/Kanban/Column/Column';
import Tag from '../components/Tag/Tag';
import Board from '../components/Kanban/Board/Board';
import '../styles/Home.css';

import DragCard from '../components/Card/DragCard/DragCard';
import EditCardModal from '../components/Modal/EditCardModal';
import { getAllColumns, getAllCards, putColumn, putCard } from '../utils/kanbanDb';
import Button from '../components/Button/Button';
import Modal from '../components/Modal/Modal';
import CreateCardModal from '../components/Modal/CreateCardModal';



/**
 * Play - Main Kanban board route for daily challenges and tasks.
 * Features:
 *   - Card creation, editing, drag-and-drop between columns
 *   - LocalStorage persistence
 *   - Challenge prompt generation
 *   - Character limits and counters
 */

// Column/card limits
const QUEUED_LIMIT = 35;
const IN_PROGRESS_WIP = 3;

const defaultColumns = {
  'column-1': { id: 'Queued', title: 'Queued', cardIds: ['card-1'] },
  'column-2': { id: 'In Progress', title: 'In Progress', cardIds: ['card-2'] },
  'column-3': { id: 'Completed', title: 'Completed', cardIds: ['card-3'] }
};
const defaultCards = {
  'card-1': { id: 'card-1', title: 'Test Card', description: 'This is a test card in the new column.', value: 1 },
  'card-2': { id: 'card-2', title: 'Test Card', description: 'This is a test card in the new column.', value: 2 },
  'card-3': { id: 'card-3', title: 'Test Card', description: 'This is a test card in the new column.', value: 3 }
};



const Play = () => {
  const [columns, setColumns] = useState({});
  const [cards, setCards] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCardId, setEditCardId] = useState(null);
  // Edit card handlers
  const handleEditCard = (cardId) => setEditCardId(cardId);
  const handleCloseEditModal = () => setEditCardId(null);
  const handleSaveEditCard = (updatedCard) => {
    setCards(prev => ({ ...prev, [updatedCard.id]: updatedCard }));
    setEditCardId(null);
  };
  const handleDeleteCard = (cardId) => {
    setCards(prev => {
      const newCards = { ...prev };
      delete newCards[cardId];
      return newCards;
    });
    setColumns(prev => {
      const newCols = { ...prev };
      Object.values(newCols).forEach(col => {
        col.cardIds = col.cardIds.filter(id => id !== cardId);
      });
      return newCols;
    });
    setEditCardId(null);
  };

  // Load from IndexedDB on mount, or set defaults if empty
  useEffect(() => {
    async function loadFromDb() {
      const dbColumns = await getAllColumns();
      const dbCards = await getAllCards();
      if (dbColumns.length > 0 && dbCards.length > 0) {
        // Convert arrays to objects keyed by id, ensure cardIds is always an array
        const columnsObj = {};
        dbColumns.forEach(col => {
          columnsObj[col.id] = {
            ...col,
            cardIds: Array.isArray(col.cardIds) ? col.cardIds : [],
          };
        });
        const cardsObj = {};
        dbCards.forEach(card => { cardsObj[card.id] = card; });
        setColumns(columnsObj);
        setCards(cardsObj);
      } else {
        // If IndexedDB is empty, set defaults and persist them
        setColumns(defaultColumns);
        setCards(defaultCards);
        Object.values(defaultColumns).forEach(col => putColumn(col));
        Object.values(defaultCards).forEach(card => putCard(card));
      }
    }
    loadFromDb();
  }, []);

  // Persist columns to IndexedDB whenever columns state changes
  useEffect(() => {
    Object.values(columns).forEach(col => {
      putColumn(col);
    });
  }, [columns]);

  // Persist cards to IndexedDB whenever cards state changes
  useEffect(() => {
    Object.values(cards).forEach(card => {
      putCard(card);
    });
  }, [cards]);

  // Handler to create a new card
  const handleCreateCard = ({ title, description, tag, priority }) => {
    // Generate a unique card id
    const newId = `card-${Date.now()}`;
    const newCard = {
      id: newId,
      title,
      description,
      tag,
      priority,
      value: 1,
    };
    setCards(prev => ({ ...prev, [newId]: newCard }));
    setColumns(prev => {
      const queuedCol = prev['Queued'] || prev['column-1'];
      const queuedColId = queuedCol.id || 'Queued';
      return {
        ...prev,
        [queuedColId]: {
          ...queuedCol,
          cardIds: [...queuedCol.cardIds, newId],
        },
      };
    });
    setIsModalOpen(false);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Persist columns to IndexedDB whenever columns state changes
  useEffect(() => {
    Object.values(columns).forEach(col => {
      putColumn(col);
    });
  }, [columns]);

  
  // Precompute total cards for performance
  // this section handles tag/indicator card count per column
  const totalCards = Object.values(columns).reduce((sum, col) => sum + col.cardIds.length, 0);
  // Helper for tag text
  const getColumnTagText = (colId, column) => {
    if (colId === 'Completed') {
      return `${column.cardIds.length}/${totalCards}`;
    }
    if (colId === 'In Progress') {
      return `${column.cardIds.length}/${IN_PROGRESS_WIP}`;
    }
    if (colId === 'Queued') {
      // Remaining slots for Queued = QUEUED_LIMIT - (totalCards - column.cardIds.length)
      const remainingQueuedSlots = Math.max(QUEUED_LIMIT - (totalCards - column.cardIds.length), 0);
      return `${column.cardIds.length}/${remainingQueuedSlots}`;
    }
    return column.cardIds.length;
  };
  const queuedLimitReached = columns['Queued'] && columns['Queued'].cardIds.length >= QUEUED_LIMIT;

  return (
    <div className="home-container">
      <Button onClick={handleOpenModal} disabled={queuedLimitReached}>Create Card</Button>
      <WeeklyProgressBar />
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {queuedLimitReached ? (
          <div style={{ padding: 24, textAlign: 'center', color: 'red' }}>
            Queued column is full ({QUEUED_LIMIT} card limit).
          </div>
        ) : (
          <CreateCardModal
            open={isModalOpen}
            onSave={handleCreateCard}
            onClose={handleCloseModal}
          />
        )}
      </Modal>
      <Board columns={columns} setColumns={setColumns}>
        {['Queued', 'In Progress', 'Completed'].map((colId) => {
          const column = columns[colId];
          if (!column) return null;
          const tagText = getColumnTagText(colId, column);
          return (
            <Column
              key={column.id}
              header={column.title}
              tagText={tagText}
              columnId={colId}
              cardIds={column.cardIds}
              wipLimitReached={colId === 'In Progress' && column.cardIds.length >= IN_PROGRESS_WIP}
            >
              {column.cardIds.map((cardId) => {
                const card = cards[cardId];
                if (!card) return null;
                return (
                  <DragCard
                    key={card.id}
                    id={card.id}
                    title={card.title}
                    description={card.description}
                    tag={card.tag}
                    priority={card.priority}
                    value={card.value}
                    onClick={() => handleEditCard(card.id)}
                    onEdit={() => handleEditCard(card.id)}
                    onDelete={() => handleDeleteCard(card.id)}
                  />
                );
              })}
            </Column>
          );
        })}
      </Board>
      {/* Edit Card Modal */}
      <EditCardModal
        open={!!editCardId}
        card={editCardId ? cards[editCardId] : null}
        onSave={handleSaveEditCard}
        onDelete={handleDeleteCard}
        onClose={handleCloseEditModal}
      />
    </div>
  );
};

export default Play;