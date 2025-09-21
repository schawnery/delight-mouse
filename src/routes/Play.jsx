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
import { getAllColumns, getAllCards, putColumn, putCard } from '../utils/kanbanDb';
import Button from '../components/Button/Button';
import Modal from '../components/Modal/Modal';
import CardCreateForm from '../components/Card/CardCreateForm';



/**
 * Play - Main Kanban board route for daily challenges and tasks.
 * Features:
 *   - Card creation, editing, drag-and-drop between columns
 *   - LocalStorage persistence
 *   - Challenge prompt generation
 *   - Character limits and counters
 */
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
  const handleCreateCard = ({ title, description, columnId }) => {
    // Generate a unique card id
    const newId = `card-${Date.now()}`;
    const newCard = {
      id: newId,
      title,
      description,
      value: 1,
    };
    setCards(prev => ({ ...prev, [newId]: newCard }));
    setColumns(prev => {
      const col = prev[columnId];
      return {
        ...prev,
        [columnId]: {
          ...col,
          cardIds: [...col.cardIds, newId],
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

  const queuedLimitReached = columns['Queued'] && columns['Queued'].cardIds.length >= 35;
  return (
    <div className="home-container">
      <Button onClick={handleOpenModal} disabled={queuedLimitReached}>Create Card</Button>
      <WeeklyProgressBar />
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {queuedLimitReached ? (
          <div style={{ padding: 24, textAlign: 'center', color: 'red' }}>
            Queued column is full (35 card limit).
          </div>
        ) : (
          <CardCreateForm
            onCreate={handleCreateCard}
            onCancel={handleCloseModal}
            columns={Object.values(columns)}
          />
        )}
      </Modal>
      <Board columns={columns} setColumns={setColumns}>
        {['Queued', 'In Progress', 'Completed'].map((colId) => {
          const column = columns[colId];
          if (!column) return null;
          let tagText = column.cardIds.length;
          if (colId === 'Completed') {
            const totalCards = Object.values(columns).reduce((sum, col) => sum + col.cardIds.length, 0);
            tagText = `${column.cardIds.length}/${totalCards}`;
          } else if (colId === 'In Progress') {
            tagText = `${column.cardIds.length}/3`;
          } else if (colId === 'Queued') {
            // Show current/remaining creation limit for Queued
            const totalCards = Object.values(columns).reduce((sum, col) => sum + col.cardIds.length, 0);
            const maxQueued = Math.max(35 - (totalCards - column.cardIds.length), 0);
            tagText = `${column.cardIds.length}/${maxQueued}`;
          }
          return (
            <Column
              key={column.id}
              header={
                <>
                  {column.title}
                  <Tag text={tagText} />
                </>
              }
              columnId={column.id}
              cardIds={column.cardIds}
              wipLimitReached={colId === 'In Progress' && column.cardIds.length >= 3}
            >
              {column.cardIds.map((cardId) => {
                const card = cards[cardId];
                return card ? (
                  <DragCard
                    key={card.id}
                    id={card.id}
                    title={card.title}
                    description={card.description}
                    value={card.value}
                  />
                ) : null;
              })}
            </Column>
          );
        })}
      </Board>
    </div>
  );
};

export default Play;